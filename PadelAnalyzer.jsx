import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import RACKETS_DB from "./rackets-db.json";

// Merged DB: RACKETS_DB + extras, dédupliqué par ID (extras override static)
// Production logger — silent in prod, verbose in dev
const __DEV = process.env.NODE_ENV !== 'production';
const _log = __DEV ? console.log.bind(console) : () => {};
const _warn = __DEV ? console.warn.bind(console) : () => {};
function getMergedDB() {
  // Cache: invalidated when localStorage extras change
  const extraRaw = localStorage.getItem('padel_db_extra') || '[]';
  if (getMergedDB._cache && getMergedDB._cacheKey === extraRaw) return getMergedDB._cache;
  let extra = [];
  try { extra = JSON.parse(extraRaw); } catch {}
  if (!Array.isArray(extra)) extra = [];
  const extraMap = new Map();
  extra.forEach(r => extraMap.set(r.id, r));
  const map = new Map();
  RACKETS_DB.forEach(r => {
    const ex = extraMap.get(r.id);
    if (ex) {
      // Static DB wins for scores, but take richer content from extras
      const merged = { ...r };
      if (ex.editorial && (!r.editorial || ex.editorial.length > r.editorial.length)) merged.editorial = ex.editorial;
      if (ex.techHighlights && ex.techHighlights.length > (r.techHighlights || []).length) merged.techHighlights = ex.techHighlights;
      if (ex.targetProfile && (!r.targetProfile || ex.targetProfile.length > r.targetProfile.length)) merged.targetProfile = ex.targetProfile;
      if (ex.imageUrl && !r.imageUrl) merged.imageUrl = ex.imageUrl;
      map.set(r.id, merged);
    } else {
      map.set(r.id, r);
    }
  });
  // Add extras that don't exist in static DB (new imports)
  extra.forEach(r => { if (!map.has(r.id)) map.set(r.id, r); });
  const result = [...map.values()];
  getMergedDB._cache = result;
  getMergedDB._cacheKey = extraRaw;
  return result;
}

// ==================== SUPABASE REST API (no SDK needed) ====================
const SB_URL = "https://nvomaxjyhuemdfvhzcbf.supabase.co/rest/v1";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b21heGp5aHVlbWRmdmh6Y2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTI3NjEsImV4cCI6MjA4NzY2ODc2MX0.2vQyuT6rPTeGzMp244L9n0OzBwOnW3WTviC3RKxrp8U";
const SB_HEADERS = { "apikey": SB_KEY, "Authorization": "Bearer " + SB_KEY, "Content-Type": "application/json", "Prefer": "return=representation" };

async function sbGet(table, query) {
  const r = await fetch(`${SB_URL}/${table}?${query}`, { headers: SB_HEADERS });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || r.statusText); }
  return r.json();
}
async function sbPost(table, data) {
  const r = await fetch(`${SB_URL}/${table}`, { method: "POST", headers: SB_HEADERS, body: JSON.stringify(data) });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || r.statusText); }
  return r.json();
}
async function sbUpsert(table, data, onConflict) {
  const h = { ...SB_HEADERS, "Prefer": "return=representation,resolution=merge-duplicates" };
  const url = onConflict ? `${SB_URL}/${table}?on_conflict=${onConflict}` : `${SB_URL}/${table}`;
  const r = await fetch(url, { method: "POST", headers: h, body: JSON.stringify(data) });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || r.statusText); }
  return r.json();
}
async function sbDelete(table, query) {
  const r = await fetch(`${SB_URL}/${table}?${query}`, { method: "DELETE", headers: SB_HEADERS });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || r.statusText); }
}
async function sbPatch(table, query, data) {
  const r = await fetch(`${SB_URL}/${table}?${query}`, { method: "PATCH", headers: SB_HEADERS, body: JSON.stringify(data) });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || r.statusText); }
  return r.json();
}

// ==================== SUPABASE HELPERS ====================
// Sanitize familyCode: only alphanumeric, max 10 chars
function sanitizeCode(code) { return String(code || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 10); }
function getFamilyCode() { return sanitizeCode(localStorage.getItem('padel_family_code') || ''); }
function setFamilyCodeLS(code) { localStorage.setItem('padel_family_code', sanitizeCode(code)); }
function getGroupRole() { return localStorage.getItem('padel_group_role') || 'famille'; }
function setGroupRoleLS(role) { localStorage.setItem('padel_group_role', role); }
function getGroupName() { return localStorage.getItem('padel_group_name') || ''; }
function setGroupNameLS(name) { localStorage.setItem('padel_group_name', name); }

function generateFamilyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Simple hash (SHA-256 via SubtleCrypto)
async function hashPassword(pwd) {
  const data = new TextEncoder().encode(pwd);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

async function groupLogin(name, password) {
  const data = await sbGet('groups', `name=eq.${encodeURIComponent(name)}&limit=1`);
  if (!data.length) return { error: "Groupe introuvable" };
  const group = data[0];
  const hash = await hashPassword(password);
  if (hash !== group.password_hash) return { error: "Mot de passe incorrect" };
  return { ok: true, family_code: group.family_code, role: group.role, name: group.name };
}

async function groupCreate(name, password, role) {
  // Vérifier si le nom existe
  const exists = await sbGet('groups', `name=eq.${encodeURIComponent(name)}&limit=1`);
  if (exists.length) return { error: "Ce nom de groupe existe déjà" };
  const hash = await hashPassword(password);
  const family_code = generateFamilyCode();
  // Créer le groupe
  await sbPost('groups', { name, password_hash: hash, role: role || 'famille', family_code });
  // Créer aussi dans families pour compatibilité
  try { await registerFamily(family_code, null); } catch(e) { /* peut déjà exister */ }
  return { ok: true, family_code, role, name };
}

async function registerFamily(code, adminPin) {
  return sbPost('families', { code, admin_pin: adminPin || null });
}

async function checkFamilyExists(code) {
  const data = await sbGet('families', `code=eq.${code}&limit=1`);
  return data.length ? data[0] : null;
}

async function cloudLoadProfiles(familyCode) {
  const data = await sbGet('profiles', `family_code=eq.${familyCode}&order=created_at`);
  return (data || []).map(row => ({
    name: row.name,
    profile: row.data || {},
    savedAt: new Date(row.updated_at).getTime(),
    locked: row.locked || false,
    _cloud_id: row.id,
  }));
}

async function cloudSaveProfile(familyCode, name, profileData, locked) {
  return sbUpsert('profiles', {
    family_code: familyCode, name, data: profileData, locked: locked || false, updated_at: new Date().toISOString()
  }, 'family_code,name');
}

async function cloudDeleteProfile(familyCode, name) {
  return sbDelete('profiles', `family_code=eq.${familyCode}&name=eq.${encodeURIComponent(name)}`);
}

async function cloudLoadSavedRackets(familyCode) {
  const data = await sbGet('saved_rackets', `family_code=eq.${familyCode}&limit=1`);
  return data.length ? (data[0].data || []) : [];
}

async function cloudSaveSavedRackets(familyCode, rackets) {
  return sbUpsert('saved_rackets', {
    family_code: familyCode, data: rackets, updated_at: new Date().toISOString()
  }, 'family_code');
}

async function cloudLoadExtraRackets(familyCode) {
  const data = await sbGet('extra_rackets', `family_code=eq.${familyCode}&limit=1`);
  return data.length ? (data[0].data || []) : [];
}

async function cloudSaveExtraRackets(familyCode, extras) {
  return sbUpsert('extra_rackets', {
    family_code: familyCode, data: extras, updated_at: new Date().toISOString()
  }, 'family_code');
}

async function cloudGetAdminPin(familyCode) {
  const data = await sbGet('families', `code=eq.${familyCode}&select=admin_pin&limit=1`);
  return data.length ? (data[0].admin_pin || '') : '';
}

async function cloudSetAdminPin(familyCode, pin) {
  return sbPatch('families', `code=eq.${familyCode}`, { admin_pin: pin });
}

// ==================== ADMIN RPC HELPERS ====================
async function sbRpc(fnName, params) {
  const r = await fetch(`${SB_URL.replace('/rest/v1','/rest/v1/rpc')}/${fnName}`, {
    method: "POST", headers: SB_HEADERS, body: JSON.stringify(params)
  });
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.message || r.statusText); }
  return r.json();
}

async function checkIsAdmin(familyCode) {
  try {
    // Check groups table first
    const groups = await sbGet('groups', `family_code=eq.${familyCode}&select=role&limit=1`);
    if (groups.length && groups[0].role === 'admin') return true;
    // Fallback: check families table (legacy)
    const result = await sbRpc('is_family_admin', { p_family_code: familyCode });
    return result === true;
  } catch { return false; }
}

async function adminListFamilies(familyCode) {
  return sbRpc('admin_list_families', { p_family_code: familyCode });
}

async function adminLoadFamilyProfiles(familyCode, targetCode) {
  return sbRpc('admin_load_family_profiles', { p_family_code: familyCode, p_target_code: targetCode });
}

async function adminUpsertRacket(familyCode, racket) {
  return sbRpc('admin_upsert_racket', { p_family_code: familyCode, p_racket: racket });
}

async function adminToggleRacket(familyCode, racketId) {
  return sbRpc('admin_toggle_racket', { p_family_code: familyCode, p_racket_id: racketId });
}

async function adminDeleteRacket(familyCode, racketId) {
  return sbRpc('admin_delete_racket', { p_family_code: familyCode, p_racket_id: racketId });
}

async function adminGetStats(familyCode) {
  return sbRpc('admin_get_stats', { p_family_code: familyCode });
}

// Load ALL rackets from Supabase rackets table (admin imports go here)
async function cloudLoadAllRackets() {
  const data = await sbGet('rackets', 'select=*&limit=500');
  return data || [];
}

const LEVEL_OPTIONS = [
  { value: "Débutant", label: "Débutant", desc: "Découverte, < 1 an" },
  { value: "Intermédiaire", label: "Intermédiaire", desc: "Bases acquises, 1-3 ans" },
  { value: "Avancé", label: "Avancé", desc: "Technique solide, tactique" },
  { value: "Expert", label: "Expert", desc: "Compétiteur classé" },
];
const SIDE_OPTIONS = ["Gauche", "Droite", "Les deux"];
const HAND_OPTIONS = ["Droitier", "Gaucher"];
const FREQ_OPTIONS = [
  { value: "Occasionnel (1-2x/mois)", label: "Occasionnel", desc: "1-2x/mois" },
  { value: "Régulier (1-2x/semaine)", label: "Régulier", desc: "1-2x/semaine" },
  { value: "Assidu (3-4x/semaine)", label: "Assidu", desc: "3-4x/semaine" },
  { value: "Intensif (5+/semaine)", label: "Intensif", desc: "5+/semaine" },
];
const BRAND_TAGS = [
  { id:"head", label:"Head" },
  { id:"bullpadel", label:"Bullpadel" },
  { id:"nox", label:"Nox" },
  { id:"babolat", label:"Babolat" },
  { id:"adidas", label:"Adidas" },
  { id:"siux", label:"Siux" },
  { id:"starvie", label:"StarVie" },
  { id:"wilson", label:"Wilson" },
];
const STYLE_TAGS = [
  { id:"offensif", label:"Offensif", tip:"Filet, volées, conclure vite" },
  { id:"defensif", label:"Défensif / Mur", tip:"Lobs, patience, attend l'erreur" },
  { id:"tactique", label:"Tactique", tip:"Placement, construction, rythme" },
  { id:"puissant", label:"Puissant / Frappeur", tip:"Remates, frappes lourdes" },
  { id:"veloce", label:"Véloce", tip:"Couverture terrain, rapidité" },
  { id:"endurant", label:"Endurant", tip:"Longs échanges, résistance" },
  { id:"contre", label:"Contre-attaquant", tip:"Défend puis retourne" },
  { id:"polyvalent", label:"Polyvalent", tip:"Mix attaque/défense, adaptatif" },
  { id:"technique", label:"Technique", tip:"Précision, toucher de balle" },
];
const INJURY_TAGS = [
  { id:"dos", label:"Dos" },
  { id:"poignet", label:"Poignet" },
  { id:"coude", label:"Coude (tennis elbow)" },
  { id:"epaule", label:"Épaule" },
  { id:"genou", label:"Genou" },
  { id:"cheville", label:"Cheville" },
  { id:"mollet", label:"Mollet" },
  { id:"hanche", label:"Hanche" },
  { id:"achille", label:"Tendon d'Achille" },
  { id:"aucune", label:"Aucune" },
];
const PRIORITY_TAGS = [
  { id:"confort", label:"Confort" },
  { id:"polyvalence", label:"Polyvalence" },
  { id:"puissance", label:"Puissance" },
  { id:"controle", label:"Contrôle" },
  { id:"spin", label:"Spin" },
  { id:"legerete", label:"Légèreté" },
  { id:"protection", label:"Protection bras" },
  { id:"reprise", label:"Reprise en douceur" },
];

const INITIAL_PROFILE = {
  age: "", weight: "", height: "", level: "Intermédiaire", side: "Droite", hand: "Droitier",
  genre: "Homme", fitness: "actif",
  styleTags: [],
  styleExtra: "",
  injuryTags: [],
  injuryExtra: "",
  priorityTags: [],
  priorityExtra: "",
  brandTags: [],
  frequency: "Occasionnel (1-2x/mois)", competition: false,
  // Expert feel preferences (WPT-level)
  expertToucher: "", // "sec" | "medium" | "souple"
  expertReactivite: "", // "explosive" | "progressive"
  expertPoids: "", // "lourd" | "equilibre" | "leger"
  expertForme: "", // "diamant" | "goutte" | "ronde" | "indifferent"
};

const FITNESS_OPTIONS = [
  { value: "athletique", label: "Athlétique", icon: "💪", desc: "Sport intensif" },
  { value: "actif", label: "Actif", icon: "🏃", desc: "Sport régulier" },
  { value: "occasionnel", label: "Occasionnel", icon: "🚶", desc: "Activité modérée" },
];

const INITIAL_RACKETS = [];

// Load saved rackets from localStorage
function loadSavedRackets() {
  try {
    const raw = localStorage.getItem('padel_rackets');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) {
        // Refresh critical fields from current DB (localStorage may have stale/missing data)
        return arr.map(r => {
          const dbMatch = getMergedDB().find(db => db.name.toLowerCase() === (r.name||"").toLowerCase());
          if (dbMatch) {
            return { ...r,
              imageUrl: dbMatch.imageUrl || r.imageUrl,
              category: dbMatch.category || r.category || null,
              junior: dbMatch.junior || r.junior || false,
              womanLine: dbMatch.womanLine || r.womanLine || false,
              year: dbMatch.year || r.year || null,
              scores: dbMatch.scores || r.scores,
            };
          }
          return r;
        });
      }
    }
  } catch {}
  return [];
}
function saveRackets(rackets) {
  try { localStorage.setItem('padel_rackets', JSON.stringify(rackets)); } catch {}
}
// Load saved profile
function loadSavedProfile() {
  try {
    const raw = localStorage.getItem('padel_profile');
    if (raw) { const p = JSON.parse(raw); if (p && typeof p === 'object') return {...INITIAL_PROFILE, ...p}; }
  } catch {}
  return INITIAL_PROFILE;
}
// Multi-profile management
function loadProfilesList() {
  try {
    const raw = localStorage.getItem('padel_profiles_list');
    if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr; }
  } catch {}
  return [];
}
function saveProfilesList(list) {
  try { localStorage.setItem('padel_profiles_list', JSON.stringify(list)); } catch {}
}
function saveNamedProfile(name, profile) {
  const list = loadProfilesList();
  const existing = list.findIndex(p => p.name === name);
  const entry = { name, profile: {...profile}, savedAt: Date.now() };
  if (existing >= 0) list[existing] = entry; else list.push(entry);
  saveProfilesList(list);
  return list;
}
function deleteNamedProfile(name) {
  const list = loadProfilesList().filter(p => p.name !== name);
  saveProfilesList(list);
  return list;
}
function toggleProfileLock(name) {
  const list = loadProfilesList();
  const idx = list.findIndex(p => p.name === name);
  if (idx >= 0) list[idx].locked = !list[idx].locked;
  saveProfilesList(list);
  return list;
}
function getAdminPin() { return localStorage.getItem('padel_admin_pin') || ''; }
function setAdminPin(pin) { localStorage.setItem('padel_admin_pin', pin); }

const ATTRS = ["Puissance","Contrôle","Confort","Spin","Maniabilité","Tolérance"];

// Image URL helper — passthrough, no proxy needed (browser loads directly)
function proxyImg(url) {
  return url || null;
}

// Safe bold text rendering — replaces dangerouslySetInnerHTML for **bold** markdown
function safeBold(text, boldColor) {
  if (!text) return null;
  const parts = String(text).split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => 
    i % 2 === 1 
      ? React.createElement('strong', { key: i, style: { color: boldColor || '#f1f5f9' } }, part)
      : part
  );
}
const COLORS_POOL = ["#E53935","#FF9800","#E91E63","#4CAF50","#009688","#2196F3","#1565C0","#9C27B0","#00BCD4","#FF5722","#8BC34A","#795548","#607D8B","#D4E157","#F06292","#4DD0E1","#FFB74D","#AED581","#BA68C8","#4FC3F7"];
const explanations = {
  Puissance:"Vitesse de sortie de balle pour un effort donné. Diamant > goutte > ronde. Équilibre haut = plus d'inertie. Mousse réactive = catapulte.",
  Contrôle:"Capacité à placer la balle précisément. Ronde > goutte > diamant. Sweet spot large = tolérant. Équilibre bas = plus précis.",
  Confort:"Vibrations transmises au bras/dos. Mousse souple + fibre de verre + anti-vibrations = confort. Carbone rigide (12K, 18K) + mousse dure = inconfortable.",
  Spin:"Accroche de la surface sur la balle pour créer de la rotation. Texture 3D, sable = plus de spin.",
  Maniabilité:"Facilité à bouger la raquette rapidement. Poids léger + équilibre bas = réactif. >370g = pénalisant.",
  Tolérance:"Performance sur frappes décentrées. Grand sweet spot + forme ronde/goutte = pardonne les erreurs. Diamant + carbone rigide = exigeant.",
};
const fyConfig = {
  recommended:{ text:"RECOMMANDÉ", bg:"#1B5E20", border:"#4CAF50" },
  partial:{ text:"JOUABLE", bg:"#E65100", border:"#FF9800" },
  no:{ text:"DÉCONSEILLÉ", bg:"#B71C1C", border:"#E53935" },
};

const SCORING_SYSTEM_PROMPT = `You are a padel racket technical analyst. Score rackets using a HYBRID approach: reference scores from review sites calibrated with mechanical guard-rails.

METHODOLOGY:
1. If REFERENCE SCORES are provided: use the calibration formula (ref_score - 50) / 5 as your starting point, then apply guard-rail caps below.
2. If NO reference scores: use PURE MECHANICAL RULES below to calculate from scratch.
3. Guard-rail caps ALWAYS apply regardless of source. They prevent marketing inflation.

MECHANICAL RULES (1.0 to 10.0, use 0.5 increments):

PUISSANCE (power = ball exit speed per effort):
- Shape base: Diamant=8.0, Goutte d'eau/Teardrop=6.5, Hybride=6.0, Ronde/Round=5.5
- Balance modifier: Haut/High: +1.0, Mi-haut/Medium-high: +0.5, Moyen/Medium: 0, Bas/Low: -0.5
- Core modifier: Reactive/Power foam: +0.5, Standard EVA: 0, Soft/Control foam: -0.5
- Cap at 10.0

CONTRÔLE (control = shot placement precision):
- Shape base: Ronde=8.5, Hybride=8.0, Goutte d'eau=7.5, Diamant=5.5
- Surface modifier: Fiberglass/hybrid: +0.5, Pure carbon: 0, Very stiff carbon (12K+): -0.5
- Sweet spot modifier: Optimized/large: +0.5, Standard: 0
- GUARD-RAIL: Diamant shape CANNOT exceed 7.5 contrôle (limited sweet spot)

CONFORT (comfort = vibration absorption, arm protection):
- Core base: Soft foam/Control foam: 7.5, Standard EVA/MLD: 6.0, Hard EVA (HR3 Black): 5.0, Reactive/Power foam: 5.0
- Surface modifier: Fiberglass dominant: +1.5, Hybrid carbon/glass: +0.5, Pure carbon: 0, Stiff carbon (12K, 18K Xtrem): -0.5
- Anti-vib tech modifier: Dedicated system (Ease Vibe, Pulse System, Auxetic+SoftCap): +0.5
- Weight modifier: <355g: +0.5, 355-365g: 0, >365g: -0.5
- GUARD-RAIL: Stiff carbon (12K Xtrem, TriCarbon) + hard EVA core = NEVER above 6.0
- GUARD-RAIL: Any reactive/power foam without anti-vib = NEVER above 6.5
- GUARD-RAIL: Fiberglass + soft foam + anti-vib = MINIMUM 7.0

SPIN (spin = surface grip on ball):
- Rough 3D + sand texture (Dual Spin, Extreme Spin): 8.5
- 3D texture only: 7.5
- Smooth/standard: 6.0

MANIABILITÉ (maneuverability = ease of quick movement):
- Weight base: <350g: 9.0, 350-355g: 8.0, 355-360g: 7.5, 360-365g: 7.0, 365-370g: 6.5, >370g: 6.0
- Balance modifier: Bas/Low: +1.0, Moyen/Medium: +0.5, Mi-haut: 0, Haut/High: -0.5
- Adjustable balance (Weight Balance system): +0.5

TOLÉRANCE (forgiveness on off-center hits):
- Shape base: Ronde=8.5, Hybride=8.0, Goutte d'eau=7.0, Diamant=5.0
- Sweet spot modifier: Optimized/large: +0.5, Standard: 0
- Surface modifier: Fiberglass (softer rebound): +0.5, Hybrid: 0, Stiff carbon: -0.5
- GUARD-RAIL: Diamant shape CANNOT exceed 6.5 tolérance

VERDICT RULES for player profile — use these padel-specific style tags:
- "Offensif" → needs power, rewards diamant/high balance
- "Défensif / Mur" → needs control + tolerance, rewards ronde/goutte
- "Tactique" → needs control + maneuverability
- "Puissant / Frappeur" → needs power + spin, rewards diamant
- "Véloce" → needs maneuverability + light weight
- "Endurant" → needs comfort + tolerance (long rallies = more vibrations)
- "Contre-attaquant" → needs tolerance + control + decent power
- "Polyvalent" → needs balanced scores, no extreme weakness
- "Technique" → needs control + spin

Injury tags impact:
- "Dos" or "Poignet" or "Coude" → Confort MUST be >= 7 for "recommended"
- "Aucune" → no injury constraint

forYou classification:
- "recommended": Confort >= 7 if injuries exist, AND matches play style well
- "partial": Confort 5-7 with injuries, OR minor mismatch with style
- "no": Confort < 5 with injuries, OR shape+weight too demanding, OR requires high technique level for casual play

Write verdict in French, 2 sentences max. Be direct and honest about risks for the player's injuries.

Return ONLY valid JSON, no markdown, no backticks.`;

function getNextColor(rks) {
  const used = new Set(rks.map(r=>r.color));
  return COLORS_POOL.find(c=>!used.has(c)) || '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
}

function buildProfileText(p) {
  const styles = p.styleTags.map(id=>STYLE_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
  const injuries = p.injuryTags.map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
  const priorities = p.priorityTags.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
  const brands = p.brandTags.map(id=>BRAND_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
  const styleStr = [...styles, p.styleExtra].filter(Boolean).join(", ") || "Non précisé";
  const injuryStr = [...injuries, p.injuryExtra].filter(Boolean).join(", ") || "Aucune";
  const brandStr = brands.length ? brands.join(", ") : "Toutes marques";
  const isFemme = (p.genre || "Homme") === "Femme";
  const physique = [p.age ? `${p.age} ans` : null, p.height ? `${p.height}cm` : null, p.weight ? `${p.weight}kg` : null, p.genre || "Homme", `fitness: ${p.fitness||"actif"}`].filter(Boolean).join(", ");

  // Expert feel-based preferences
  const toucherLabels = {sec:"Sec & Direct",medium:"Medium",souple:"Souple & Enveloppant"};
  const reactLabels = {explosive:"Explosive",progressive:"Progressive"};
  const poidsLabels = {lourd:"Lourd & Stable",equilibre:"Équilibré",leger:"Léger & Vif"};
  const formeLabels = {diamant:"Diamant",goutte:"Goutte d'eau",ronde:"Ronde",indifferent:"Indifférent"};

  let prioStr;
  if (p.expertToucher) {
    // Expert mode - show feel preferences
    const feelParts = [
      `Toucher: ${toucherLabels[p.expertToucher]||p.expertToucher}`,
      p.expertReactivite ? `Réactivité: ${reactLabels[p.expertReactivite]||p.expertReactivite}` : null,
      p.expertPoids ? `Poids: ${poidsLabels[p.expertPoids]||p.expertPoids}` : null,
      p.expertForme ? `Forme: ${formeLabels[p.expertForme]||p.expertForme}` : null,
    ].filter(Boolean);
    prioStr = `[PRO] ${feelParts.join(", ")}`;
  } else {
    prioStr = [...priorities, p.priorityExtra].filter(Boolean).join(", ") || "Non précisé";
  }

  return `${isFemme?"Joueuse":"Joueur"}: ${physique || "Non renseigné"}. Niveau: ${p.level}. Main: ${p.hand||"Droitier"}. Côté: ${p.side}. Style: ${styleStr}. Blessures: ${injuryStr}. Fréquence: ${p.frequency}. Compétition: ${p.competition?"Oui":"Non"}. Priorité: ${prioStr}. Marques préférées: ${brandStr}.`;
}

// =====================================================
// SCORING ENGINE V11 — 3 modes: Junior/Pépite, Expert (Tapia), Normal
// Gabarit continu, pénalité poids, womanLine renforcé
// =====================================================

// === MODE DETECTION ===
// Returns: "junior" | "pepite" | "expert" | "normal"
// === COACH DIAGNOSTIC — Contradiction detection ===
function detectProfileContradictions(profile) {
  const prioTags = profile.priorityTags || [];
  const styleTags = profile.styleTags || [];
  const notes = [];
  
  // Contradiction pairs in priorities
  const contradictions = [
    {a:"puissance",b:"controle",msg:"Puissance et Contrôle s'opposent physiquement : une raquette diamant donne de la puissance mais réduit le contrôle, et inversement. Les scores reflètent le meilleur compromis — ta 1ère priorité pèse plus."},
    {a:"puissance",b:"protection",msg:"Puissance et Protection bras sont en tension : frapper fort demande rigidité, protéger le bras demande souplesse. L'algo cherche l'équilibre optimal."},
    {a:"puissance",b:"legerete",msg:"Puissance et Légèreté sont contradictoires : les raquettes légères manquent de punch, les puissantes sont plus lourdes. L'ordre de tes priorités guide le compromis."},
    {a:"legerete",b:"spin",msg:"Légèreté et Spin se contredisent partiellement : le spin demande du poids en tête et une surface rugueuse, ce qui ajoute des grammes."},
    {a:"controle",b:"spin",msg:"Contrôle et Spin sont en légère tension : le contrôle favorise les raquettes rondes et douces, le spin les surfaces agressives et les formes hybrides."},
  ];
  
  for (const c of contradictions) {
    const idxA = prioTags.indexOf(c.a);
    const idxB = prioTags.indexOf(c.b);
    if (idxA >= 0 && idxB >= 0) {
      // Both present — stronger warning if both in top 2
      const bothTop2 = idxA < 2 && idxB < 2;
      notes.push({severity: bothTop2 ? "high" : "medium", text: c.msg, tags: [c.a, c.b]});
    }
  }
  
  // Style contradictions with priorities
  const styleConflicts = [
    {styles:["offensif","puissant"],prio:"controle",msg:"Ton style offensif favorise la puissance, mais ta priorité Contrôle tire vers la rondeur : les scores sont un compromis entre attaque et précision."},
    {styles:["defensif","contre"],prio:"puissance",msg:"Ton style défensif favorise le contrôle, mais ta priorité Puissance tire vers le diamant : les scores reflètent ce compromis attaque/défense."},
    {styles:["veloce"],prio:"puissance",msg:"Ton style véloce demande légèreté, mais ta priorité Puissance demande du poids : les scores reflètent ce compromis vitesse/punch."},
  ];
  
  for (const sc of styleConflicts) {
    if (sc.styles.some(s => styleTags.includes(s)) && prioTags.includes(sc.prio)) {
      notes.push({severity: "medium", text: sc.msg, tags: [sc.prio]});
    }
  }
  
  return notes.slice(0, 2); // Max 2 notes to not overwhelm
}

function detectPlayerMode(profile) {
  const age = Number(profile.age) || 30;
  const level = (profile.level || "").toLowerCase();
  const fitness = (profile.fitness || "actif").toLowerCase();
  if (age > 0 && age < 15) {
    const isAdvanced = level.includes("avanc") || level.includes("expert");
    const isActive = fitness === "athletique" || fitness === "actif";
    if (isAdvanced && isActive) return "pepite";
    return "junior";
  }
  if (level.includes("expert") && fitness === "athletique") return "expert";
  return "normal";
}

// === GABARIT INDEX (CONTINU V11) ===
function computeGabaritIndex(profile) {
  const age = Number(profile.age) || 30;
  const weight = Number(profile.weight) || 0;
  const height = Number(profile.height) || 0;
  const genre = (profile.genre || "Homme").toLowerCase();
  const fitness = (profile.fitness || "actif").toLowerCase();

  let base = 0.5;
  if (weight > 0 && height > 0) {
    const bmi = weight / (height / 100) ** 2;
    const optimalBmi = genre === "femme" ? 21.5 : 23.5;
    const deviation = (bmi - optimalBmi) / (genre === "femme" ? 6 : 7);
    base = 0.6 * Math.exp(-deviation * deviation) + 0.1;
    base = Math.max(0.08, Math.min(0.7, base));
  } else if (weight > 0) {
    const optW = genre === "femme" ? 62 : 78;
    const dev = (weight - optW) / (genre === "femme" ? 20 : 25);
    base = 0.55 * Math.exp(-dev * dev) + 0.1;
    base = Math.max(0.08, Math.min(0.7, base));
  }

  const genderMod = genre === "femme" ? -0.10 : 0;
  let ageMod = 0;
  if (age < 25) {
    ageMod = 0.02 * (1 - (25 - age) / 15);
  } else if (age <= 35) {
    ageMod = 0;
  } else {
    const yearsOver35 = age - 35;
    if (yearsOver35 <= 15) ageMod = -yearsOver35 * 0.003;
    else if (yearsOver35 <= 30) ageMod = -15 * 0.003 - (yearsOver35 - 15) * 0.006;
    else ageMod = -15 * 0.003 - 15 * 0.006 - (yearsOver35 - 30) * 0.01;
  }
  const fitnessMod = fitness === "athletique" ? 0.15 : fitness === "actif" ? 0 : -0.12;
  let heightMod = 0;
  if (height > 0) {
    const refHeight = genre === "femme" ? 165 : 178;
    heightMod = (height - refHeight) * 0.002;
    heightMod = Math.max(-0.08, Math.min(0.08, heightMod));
  }

  const raw = base + genderMod + ageMod + fitnessMod + heightMod;
  const mode = detectPlayerMode(profile);
  if (mode === "expert") return Math.max(0.55, Math.min(1, raw));
  if (mode === "pepite") return Math.max(0.35, Math.min(0.7, raw));
  return Math.max(0, Math.min(1, raw));
}

// === PARSE RACKET WEIGHT ===
function parseRacketWeight(weightStr) {
  if (!weightStr) return null;
  const s = String(weightStr).replace(/g/gi, "").trim();
  const parts = s.split("-").map(Number).filter(n => !isNaN(n) && n > 0);
  if (parts.length === 2) return (parts[0] + parts[1]) / 2;
  if (parts.length === 1) return parts[0];
  return null;
}

// === IDEAL WEIGHT FOR PROFILE ===
function idealRacketWeight(profile, gabaritIndex) {
  const genre = (profile.genre || "Homme").toLowerCase();
  if (genre === "femme") return 310 + gabaritIndex * 80;
  return 330 + gabaritIndex * 70;
}

// === WEIGHT PENALTY ===
function weightPenalty(racketWeight, idealWeight) {
  if (!racketWeight || !idealWeight) return 0;
  const diff = racketWeight - idealWeight;
  if (diff <= 0) return Math.max(-0.1, diff * 0.005);
  return -Math.pow(diff / 10, 1.6) * 0.15;
}

// === MAIN SCORING ENGINE V11 ===
function computeGlobalScore(scores, profile, racket) {
  if (!scores || typeof scores !== "object") return 0;
  const mode = detectPlayerMode(profile);
  const isMale = !profile.genre || profile.genre === "Homme";
  const isFemale = !isMale;
  const gab = computeGabaritIndex(profile);
  const rWeight = racket ? parseRacketWeight(racket.weight) : null;
  const idealW = idealRacketWeight(profile, gab);

  // === HARD FILTERS (all modes) ===
  if (isMale && racket?.womanLine) return 0;
  const isJuniorRacket = racket?.junior || racket?.category === "junior";
  if ((mode === "normal" || mode === "expert") && isJuniorRacket) return 0;

  // === JUNIOR MODE ===
  if (mode === "junior") {
    if (!isJuniorRacket) return 0;
    let sum = 0, count = 0;
    for (const a of ATTRS) { sum += scores[a] || 0; count++; }
    let score = count > 0 ? sum / count : 5;
    if (rWeight && rWeight > 340) score -= (rWeight - 340) * 0.02;
    const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
    if (brandPref.length && racket?.brand && brandPref.includes(racket.brand.toLowerCase())) score += 0.10;
    return Math.max(0, score);
  }

  // === PEPITE MODE ===
  if (mode === "pepite") {
    const isJR = isJuniorRacket;
    const isLightAdult = !isJR && rWeight && rWeight <= 350;
    if (!isJR && !isLightAdult) return 0;

    const prioTags = profile.priorityTags || [];
    const prioAttrMap = { puissance: "Puissance", spin: "Spin", controle: "Contrôle", confort: "Confort", legerete: "Maniabilité", protection: "Confort", polyvalence: null, reprise: null };
    const orderedWeightsPep = [2.0, 1.5, 1.0, 0.7, 0.7];
    let priorityAttrs = [];
    let prioAttrWeights = {};
    prioTags.forEach((tag, idx) => {
      const w_val = orderedWeightsPep[Math.min(idx, orderedWeightsPep.length-1)];
      if (tag === "polyvalence") { ATTRS.forEach(a => { if (!prioAttrWeights[a]) { prioAttrWeights[a] = w_val * 0.5; priorityAttrs.push(a); } }); }
      else if (tag === "reprise") { ["Confort","Tolérance","Maniabilité"].forEach(a => { if (!prioAttrWeights[a]) { prioAttrWeights[a] = w_val; priorityAttrs.push(a); } else { prioAttrWeights[a] += w_val * 0.3; } }); }
      else { const attr = prioAttrMap[tag]; if (attr && !prioAttrWeights[attr]) { prioAttrWeights[attr] = w_val; priorityAttrs.push(attr); } else if (attr) { prioAttrWeights[attr] += w_val * 0.3; } }
    });
    priorityAttrs = [...new Set(priorityAttrs)];
    const secondaryAttrs = ATTRS.filter(a => !priorityAttrs.includes(a));

    let prioSum = 0, prioWSum = 0;
    for (const a of priorityAttrs) { const pw = prioAttrWeights[a] || 1; prioSum += (scores[a] || 0) * pw; prioWSum += pw; }
    const prioAvg = prioWSum > 0 ? prioSum / prioWSum : 5;
    let secSum = 0;
    for (const a of secondaryAttrs) secSum += scores[a] || 0;
    const secAvg = secondaryAttrs.length ? secSum / secondaryAttrs.length : 5;

    let score = prioAvg * 0.6 + secAvg * 0.4;
    if (isLightAdult) score += 0.15;
    if (rWeight) { const pepiteIdeal = 335; if (rWeight > pepiteIdeal) score -= (rWeight - pepiteIdeal) * 0.01; }
    const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
    if (brandPref.length && racket?.brand && brandPref.includes(racket.brand.toLowerCase())) score += 0.10;
    return Math.max(0, score);
  }

  // === EXPERT (TAPIA) MODE ===
  if (mode === "expert") {
    if (racket?.category === "debutant") return 0;
    if (racket?.category === "intermediaire") return 0;

    // === CHECK: New feel-based or legacy priority-based? ===
    const hasExpertFeel = !!profile.expertToucher;

    if (hasExpertFeel) {
      // === EXPERT MODE V2: FEEL-BASED MATCHING ===
      const toucher = profile.expertToucher;
      const reactivite = profile.expertReactivite || "explosive";
      const poidsPrefer = profile.expertPoids || "equilibre";
      const formePrefer = profile.expertForme || "indifferent";

      const core = (racket?.core || "").toLowerCase();
      const surface = (racket?.surface || "").toLowerCase();
      const rShape = (racket?.shape || "").toLowerCase();
      const rWeight = racket?.weight ? parseFloat(racket.weight) : 365;
      // Estimate balance from shape when not provided (diamant=head-heavy, ronde=head-light)
      let balanceMm = racket?.balance_mm ? parseFloat(racket.balance_mm) : 0;
      if (!balanceMm) {
        const sh = (racket?.shape || "").toLowerCase();
        if (sh.includes("diamant")) balanceMm = 268;
        else if (sh.includes("ronde") || sh.includes("rond")) balanceMm = 254;
        else if (sh.includes("goutte") || sh.includes("hybride")) balanceMm = 260;
        else balanceMm = 260;
      }

      let score = 5.0;

      const isHardCore = core.includes("hard") || core.includes("rigide") || core.includes("dure") || core.includes("dur)")
        || core.includes("hr3") || core.includes("hr4") || core.includes("carbon power")
        || core.includes("dense") || core.includes("h-eva") || core.includes("high memory")
        || core.includes("x-eva") && !core.includes("basse")
        || core.includes("eva power") || core.includes("eva pro") || core.includes("pro eva");
      const isSoftCore = core.includes("soft") || core.includes("comfort") || (core.includes("foam") && !core.includes("power foam"))
        || core.includes("basse densité");
      const isMediumCore = !isHardCore && !isSoftCore && (
        core.includes("multieva") || core.includes("multi eva") || core.includes("m-eva")
        || core.includes("standard") || core.includes("medium") || core.includes("balance")
        || core.includes("pro-touch") || core.includes("black eva") || core.includes("performance")
        || core === "eva" || core === "eva "
      );
      const isPowerFoam = core.includes("power foam");
      const isCarbonSurface = surface.includes("carbon") || surface.includes("carbone") || surface.includes("18k") || surface.includes("12k") || surface.includes("3k")
        || surface.includes("graphite") || surface.includes("woven");
      const isFiberSurface = surface.includes("fibre") || surface.includes("fiber") || surface.includes("glass") || surface.includes("verre")
        || surface.includes("fibrix");

      if (toucher === "sec") {
        if (isHardCore) score += 1.5;
        else if (isPowerFoam) score += 0.8;
        else if (isMediumCore) score += 0.3;
        else if (isSoftCore) score -= 1.2;
        if (isCarbonSurface) score += 0.6;
        if (isFiberSurface) score -= 0.5;
      } else if (toucher === "souple") {
        if (isSoftCore) score += 1.5;
        else if (isMediumCore) score += 0.6;
        else if (isPowerFoam) score += 0.3;
        else if (isHardCore) score -= 1.0;
        if (isFiberSurface) score += 0.3;
      } else {
        if (isMediumCore || isPowerFoam) score += 0.8;
        else if (isHardCore) score += 0.2;
        else if (isSoftCore) score += 0.2;
      }

      if (reactivite === "explosive") {
        score += Math.max(0, (balanceMm - 258)) * 0.08;
        if (isHardCore || isPowerFoam) score += 0.4;
        if (isSoftCore) score -= 0.3;
      } else {
        score += Math.max(0, (265 - balanceMm)) * 0.06;
        if (isMediumCore || isSoftCore) score += 0.3;
      }

      if (poidsPrefer === "lourd") {
        if (rWeight >= 370) score += 1.0;
        else if (rWeight >= 365) score += 0.5;
        else if (rWeight < 355) score -= 1.0;
        else if (rWeight < 360) score -= 0.4;
      } else if (poidsPrefer === "leger") {
        if (rWeight <= 355) score += 1.0;
        else if (rWeight <= 360) score += 0.5;
        else if (rWeight > 370) score -= 1.0;
        else if (rWeight > 365) score -= 0.4;
      } else {
        if (rWeight >= 355 && rWeight <= 370) score += 0.5;
        else if (rWeight > 375 || rWeight < 350) score -= 0.5;
      }

      if (formePrefer !== "indifferent") {
        const shapeMatch = {
          diamant: rShape.includes("diamant"),
          goutte: rShape.includes("goutte") || rShape.includes("hybride"),
          ronde: rShape.includes("ronde") || rShape.includes("rond"),
        };
        if (shapeMatch[formePrefer]) {
          score += 1.5;
        } else {
          if (formePrefer === "diamant" && (rShape.includes("goutte") || rShape.includes("hybride"))) score -= 0.5;
          else if (formePrefer === "diamant" && rShape.includes("ronde")) score -= 2.0;
          else if (formePrefer === "ronde" && rShape.includes("diamant")) score -= 2.0;
          else if (formePrefer === "ronde" && (rShape.includes("goutte") || rShape.includes("hybride"))) score -= 0.5;
          else if (formePrefer === "goutte" && rShape.includes("diamant")) score -= 0.8;
          else if (formePrefer === "goutte" && rShape.includes("ronde")) score -= 0.8;
        }
      }

      const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
      if (brandPref.length && racket?.brand && brandPref.includes(racket.brand.toLowerCase())) score += 0.15;

      const injuries = profile.injuryTags || [];
      if (injuries.length && !injuries.includes("aucune")) {
        const injuryCount = injuries.filter(i => i !== "aucune").length;
        if (isHardCore) score -= injuryCount * 0.3;
        if (isSoftCore) score += injuryCount * 0.15;
        if (rWeight > 375) score -= injuryCount * 0.1;
      }

      if (racket?.category === "expert") score += 0.5;
      else if (racket?.category === "avance") score += 0.1;

      if (isFemale && racket) {
        if (racket.womanLine) score += 0.30;
        if (rWeight && rWeight > 370) score -= (rWeight - 370) * 0.015;
      }

      return Math.max(0, Math.min(10, (score - 2) / 8 * 10));

    } else {
      // === LEGACY EXPERT: priority-based (backward compatible for old profiles) ===
      const prioTags = profile.priorityTags || [];
      const prioAttrMap = { puissance: "Puissance", spin: "Spin", controle: "Contrôle", confort: "Confort", legerete: "Maniabilité", protection: "Confort", polyvalence: null, reprise: null };
      const orderedWeightsEx = [2.0, 1.5, 1.0, 0.7, 0.7];
      let priorityAttrsX = [];
      let prioAttrWeightsX = {};
      prioTags.forEach((tag, idx) => {
        const w_val = orderedWeightsEx[Math.min(idx, orderedWeightsEx.length-1)];
        if (tag === "polyvalence") { ATTRS.forEach(a => { if (!prioAttrWeightsX[a]) { prioAttrWeightsX[a] = w_val * 0.5; priorityAttrsX.push(a); } }); }
        else if (tag === "reprise") { ["Confort","Tolérance","Maniabilité"].forEach(a => { if (!prioAttrWeightsX[a]) { prioAttrWeightsX[a] = w_val; priorityAttrsX.push(a); } else { prioAttrWeightsX[a] += w_val * 0.3; } }); }
        else { const attr = prioAttrMap[tag]; if (attr && !prioAttrWeightsX[attr]) { prioAttrWeightsX[attr] = w_val; priorityAttrsX.push(attr); } else if (attr) { prioAttrWeightsX[attr] += w_val * 0.3; } }
      });
      priorityAttrsX = [...new Set(priorityAttrsX)];
      if (priorityAttrsX.length === 0) priorityAttrsX = [...ATTRS];
      const secondaryAttrsX = ATTRS.filter(a => !priorityAttrsX.includes(a));

      let prioSumX = 0, prioWSumX = 0;
      for (const a of priorityAttrsX) { const pw = prioAttrWeightsX[a] || 1; prioSumX += (scores[a] || 0) * pw; prioWSumX += pw; }
      const prioAvgX = prioWSumX > 0 ? prioSumX / prioWSumX : 5;
      let secSumX = 0;
      for (const a of secondaryAttrsX) secSumX += scores[a] || 0;
      const secAvgX = secondaryAttrsX.length ? secSumX / secondaryAttrsX.length : 5;

      let scoreX = prioAvgX * 0.85 + secAvgX * 0.15;

      if (racket) {
        const rShape = (racket.shape || "").toLowerCase();
        const hand = profile.hand || "Droitier";
        const side = profile.side || "Droite";
        const isAttacker = (hand === "Droitier" && side === "Gauche") || (hand === "Gaucher" && side === "Droite");
        const wantsPower = prioTags.includes("puissance") || isAttacker;
        const wantsControl = prioTags.includes("controle") || prioTags.includes("protection");
        if (wantsPower) {
          if (rShape.includes("diamant")) scoreX += 0.30;
          else if (rShape.includes("goutte") || rShape.includes("hybride")) scoreX += 0.05;
          else if (rShape.includes("ronde")) scoreX -= 0.30;
        } else if (wantsControl) {
          if (rShape.includes("ronde")) scoreX += 0.30;
          else if (rShape.includes("hybride") || rShape.includes("goutte")) scoreX += 0.05;
          else if (rShape.includes("diamant")) scoreX -= 0.15;
        }
      }
      const brandPrefL = (profile.brandTags || []).map(b => b.toLowerCase());
      if (brandPrefL.length && racket?.brand && brandPrefL.includes(racket.brand.toLowerCase())) scoreX += 0.12;

      if (isFemale && racket) {
        if (racket.womanLine) scoreX += 0.30;
        if (rWeight && rWeight > 370) scoreX -= (rWeight - 370) * 0.015;
      }
      return Math.max(0, scoreX);
    }
  }

  // === NORMAL MODE (Débutant → Avancé) ===
  if (profile.competition && racket?.category) {
    const lvl = (profile.level || "").toLowerCase();
    if (lvl.includes("avanc") && racket.category === "debutant") return 0;
  }

  const prioTags = profile.priorityTags || [];
  const prioAttrMap = { puissance: "Puissance", spin: "Spin", controle: "Contrôle", confort: "Confort", legerete: "Maniabilité", protection: "Confort", polyvalence: null, reprise: null };
  // Ordered priority weights: 1st=2.0, 2nd=1.5, 3rd=1.0, 4th+=0.7
  const orderedWeights = [2.0, 1.5, 1.0, 0.7, 0.7];
  let priorityAttrs = [];
  let prioAttrWeights = {};
  prioTags.forEach((tag, idx) => {
    const w_val = orderedWeights[Math.min(idx, orderedWeights.length-1)];
    if (tag === "polyvalence") { ATTRS.forEach(a => { if (!prioAttrWeights[a]) { prioAttrWeights[a] = w_val * 0.5; priorityAttrs.push(a); } }); }
    else if (tag === "reprise") { ["Confort","Tolérance","Maniabilité"].forEach(a => { if (!prioAttrWeights[a]) { prioAttrWeights[a] = w_val; priorityAttrs.push(a); } else { prioAttrWeights[a] += w_val * 0.3; } }); }
    else { const attr = prioAttrMap[tag]; if (attr && !prioAttrWeights[attr]) { prioAttrWeights[attr] = w_val; priorityAttrs.push(attr); } else if (attr) { prioAttrWeights[attr] += w_val * 0.3; } }
  });
  priorityAttrs = [...new Set(priorityAttrs)];
  const secondaryAttrs = ATTRS.filter(a => !priorityAttrs.includes(a));

  let prioSum = 0, prioWSum = 0;
  for (const a of priorityAttrs) { const pw = prioAttrWeights[a] || 1; prioSum += (scores[a] || 0) * pw; prioWSum += pw; }
  const prioAvg = prioWSum > 0 ? prioSum / prioWSum : 5;

  const w = {};
  for (const a of secondaryAttrs) w[a] = 1;

  const styleMap = {
    offensif: { Puissance: 0.2 }, puissant: { Puissance: 0.3 },
    defensif: { Contrôle: 0.3, Tolérance: 0.3 },
    tactique: { Contrôle: 0.3, Maniabilité: 0.2 },
    veloce: { Maniabilité: 0.4 },
    endurant: { Confort: 0.3, Tolérance: 0.2 },
    contre: { Tolérance: 0.3, Contrôle: 0.2 },
    polyvalent: { Contrôle: 0.2, Tolérance: 0.2 },
    technique: { Contrôle: 0.3 },
  };
  for (const tag of (profile.styleTags || [])) {
    const boosts = styleMap[tag];
    if (boosts) for (const [k, v] of Object.entries(boosts)) { if (w[k] !== undefined) w[k] += v; }
  }

  const ARM_INJURIES = ["dos", "poignet", "coude", "epaule"];
  const LEG_INJURIES = ["genou", "cheville", "mollet", "hanche", "achille"];
  const injTags = profile.injuryTags || [];
  if (injTags.some(t => ARM_INJURIES.includes(t))) { if (w.Confort !== undefined) w.Confort += 1.5; if (w.Tolérance !== undefined) w.Tolérance += 0.5; }
  if (injTags.some(t => LEG_INJURIES.includes(t))) { if (w.Maniabilité !== undefined) w.Maniabilité += 1; }

  if (gab < 0.3) {
    const factor = (0.3 - gab) / 0.3;
    if (w.Maniabilité !== undefined) w.Maniabilité += 1.5 * factor;
    if (w.Confort !== undefined) w.Confort += 1.2 * factor;
    if (w.Tolérance !== undefined) w.Tolérance += 0.8 * factor;
  } else if (gab > 0.6) {
    const factor = (gab - 0.6) / 0.4;
    if (w.Puissance !== undefined) w.Puissance += 0.4 * factor;
  }

  let secTotal = 0, secWeight = 0;
  for (const a of secondaryAttrs) { const wt = w[a] || 1; secTotal += (scores[a] || 0) * wt; secWeight += wt; }
  const secAvg = secWeight > 0 ? secTotal / secWeight : 5;

  let score = prioAvg * 0.65 + secAvg * 0.35;

  if (racket) {
    score += weightPenalty(rWeight, idealW);

    const rShape = (racket.shape || "").toLowerCase();
    const hand = profile.hand || "Droitier";
    const side = profile.side || "Droite";
    const isAttacker = (hand === "Droitier" && side === "Gauche") || (hand === "Gaucher" && side === "Droite");
    const wantsPower = prioTags.includes("puissance") || isAttacker;
    const wantsControl = prioTags.includes("controle") || prioTags.includes("protection");
    if (wantsPower) {
      if (rShape.includes("diamant")) score += 0.25;
      else if (rShape.includes("goutte") || rShape.includes("hybride")) score += 0.05;
      else if (rShape.includes("ronde")) score -= 0.25;
    } else if (wantsControl) {
      if (rShape.includes("ronde")) score += 0.25;
      else if (rShape.includes("hybride") || rShape.includes("goutte")) score += 0.05;
    } else {
      if (rShape.includes("goutte") || rShape.includes("hybride")) score += 0.06;
    }

    const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
    if (brandPref.length && racket.brand && brandPref.includes(racket.brand.toLowerCase())) score += 0.12;

    if (profile.competition && racket.category) {
      if (racket.category === "debutant") score -= 0.5;
      else if (racket.category === "intermediaire") score -= 0.08;
    }

    if (isFemale && racket.womanLine) {
      if (gab < 0.3) score += 0.45;
      else if (gab < 0.45) score += 0.35;
      else if (gab < 0.6) score += 0.25;
      else score += 0.18;
    }
    if (isFemale && !racket.womanLine && rWeight) {
      const femmeThreshold = 310 + gab * 80;
      if (rWeight > femmeThreshold + 10) score -= (rWeight - femmeThreshold - 10) * 0.015;
    }
  }
  return Math.max(0, score);
}

// Format score as percentage
function fmtPct(score) { return (score * 10).toFixed(2) + "%"; }

// === FOR YOU VERDICT ===
function computeForYou(scores, profile, racket) {
  if (!scores || typeof scores !== "object") return "no";
  const gsRaw = computeGlobalScore(scores, profile, racket);
  const gs = Math.round(gsRaw * 10) / 10; // Round to 1 decimal
  const ARM_INJURIES = ["dos", "poignet", "coude", "epaule"];
  const hasArmInjury = (profile.injuryTags || []).some(t => ARM_INJURIES.includes(t));
  const comfort = scores.Confort || 0;
  if (gs >= 7.0 && (!hasArmInjury || comfort >= 7)) return "recommended";
  if (hasArmInjury && comfort < 5 && gs < 6) return "no";
  if (gs < 4) return "no";
  return "partial";
}

// === DYNAMIC TARGET PROFILE ===
function generateDynamicTargetProfile(racket, profile, globalScore) {
  if (!racket?.scores || !profile?.level) return null;
  const sc = racket.scores;
  const gs = globalScore || computeGlobalScore(sc, profile, racket);
  const pct = (gs * 10).toFixed(1);
  const verdict = computeForYou(sc, profile, racket);
  const name = profile._name || "Joueur";
  const isFemme = (profile.genre || "").toLowerCase() === "femme";
  const prioTags = profile.priorityTags || [];
  const styleTags = profile.styleTags || [];
  const injTags = (profile.injuryTags || []).filter(t => t !== "aucune");
  const rWeight = parseRacketWeight(racket.weight);
  const gab = computeGabaritIndex(profile);
  const idealW = idealRacketWeight(profile, gab);
  const shape = (racket.shape || "").toLowerCase();

  // Priority labels
  const prioMap = { puissance: "Puissance", controle: "Contrôle", confort: "Confort", spin: "Spin", legerete: "Maniabilité", protection: "Confort", polyvalence: null, reprise: "Tolérance" };
  const prioAttrs = prioTags.map(t => prioMap[t]).filter(Boolean);

  // Find strengths: racket scores that match player priorities
  const strengths = prioAttrs.filter(a => (sc[a] || 0) >= 8).map(a => `${a} à ${sc[a]}`);
  // Find weaknesses: racket scores below 7 on priority attrs
  const weaknesses = prioAttrs.filter(a => (sc[a] || 0) < 7).map(a => `${a} (${sc[a]})`);

  // All scores sorted
  const sorted = ATTRS.map(a => ({ name: a, val: sc[a] || 0 })).sort((a, b) => b.val - a.val);
  const top2 = sorted.slice(0, 2);
  const low1 = sorted[sorted.length - 1];

  // Build paragraphs
  const parts = [];

  // Opening — match score
  if (verdict === "recommended") {
    parts.push(`**${name}**, cette raquette correspond à **${pct}%** de ton profil — c'est un excellent match.`);
  } else if (verdict === "partial") {
    parts.push(`**${name}**, cette raquette atteint **${pct}%** de compatibilité — jouable mais pas optimale pour ton profil.`);
  } else {
    parts.push(`**${name}**, avec **${pct}%** de compatibilité, cette raquette n'est pas adaptée à ton profil.`);
  }

  // Strengths vs priorities
  if (strengths.length >= 2) {
    parts.push(`Elle excelle sur tes priorités : ${strengths.join(' et ')}.`);
  } else if (strengths.length === 1) {
    parts.push(`Elle répond bien à ta priorité ${strengths[0]}.`);
  } else if (prioAttrs.length > 0) {
    parts.push(`Ses points forts (${top2.map(a => `${a.name} ${a.val}`).join(', ')}) ne correspondent pas directement à tes priorités.`);
  }

  // Shape fit
  const hand = profile.hand || "Droitier";
  const side = profile.side || "Droite";
  const isAttacker = (hand === "Droitier" && side === "Gauche") || (hand === "Gaucher" && side === "Droite");
  if (isAttacker && shape.includes("diamant")) {
    parts.push(`Sa forme diamant est taillée pour ton jeu d'attaquant côté ${side.toLowerCase()}.`);
  } else if (!isAttacker && shape.includes("ronde")) {
    parts.push(`Sa forme ronde convient à ton jeu de construction côté ${side.toLowerCase()}.`);
  } else if (isAttacker && shape.includes("ronde")) {
    parts.push(`Attention : sa forme ronde ne favorise pas l'attaque — un diamant ou goutte d'eau serait plus adapté à ton côté ${side.toLowerCase()}.`);
  }

  // Weight fit
  if (rWeight && idealW) {
    const diff = rWeight - idealW;
    if (diff > 15) {
      parts.push(`À ${rWeight}g, elle est ${Math.round(diff)}g au-dessus de ton poids idéal — tu pourrais sentir la fatigue en fin de match.`);
    } else if (diff < -15) {
      parts.push(`À ${rWeight}g, elle est légère pour ton gabarit — maniabilité au top, mais tu perdras un peu en puissance.`);
    }
  }

  // Injuries
  const ARM_INJURIES = ["dos", "poignet", "coude", "epaule"];
  const injLabels = { dos: "dos", poignet: "poignet", coude: "coude", epaule: "épaule", genou: "genou", cheville: "cheville" };
  if (injTags.some(t => ARM_INJURIES.includes(t))) {
    const comfort = sc.Confort || 0;
    const tolerance = sc["Tolérance"] || 0;
    const injNames = injTags.filter(t => ARM_INJURIES.includes(t)).map(t => injLabels[t] || t).join('/');
    if (comfort >= 8 && tolerance >= 8) {
      parts.push(`Avec ta fragilité au ${injNames}, le confort (${comfort}) et la tolérance (${tolerance}) de cette raquette sont rassurants.`);
    } else if (comfort < 7) {
      parts.push(`⚠️ Attention ${injNames} : le confort à ${comfort}/10 peut être insuffisant pour toi. Privilégie une raquette avec confort ≥ 8.`);
    }
  }

  // WomanLine bonus
  if (isFemme && racket.womanLine) {
    parts.push(`Version femme avec grip et poids adaptés à ta morphologie.`);
  } else if (isFemme && rWeight && rWeight > 365) {
    parts.push(`Modèle mixte à ${rWeight}g — vérifie le grip et le poids en main, une version Woman existe peut-être.`);
  }

  // Style synergy
  if (styleTags.includes("veloce") && (sc["Maniabilité"] || 0) >= 8.5) {
    parts.push(`Sa maniabilité (${sc["Maniabilité"]}) colle à ton jeu véloce.`);
  }
  if (styleTags.includes("endurant") && (sc.Confort || 0) >= 8.5) {
    parts.push(`Son confort (${sc.Confort}) supporte tes longs échanges.`);
  }
  if (styleTags.includes("defensif") && (sc["Tolérance"] || 0) >= 8.5) {
    parts.push(`Sa tolérance (${sc["Tolérance"]}) pardonne les frappes décentrées en défense.`);
  }

  // Weak points warning
  if (weaknesses.length > 0 && verdict === "partial") {
    parts.push(`Points faibles pour toi : ${weaknesses.join(', ')}.`);
  }

  return parts.join(' ');
}

function TagGroup({tags, selected, onToggle, color="#f97316"}) {
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6,paddingLeft:13}}>
      {tags.map(t=>{
        const active = selected.includes(t.id);
        return (
          <button key={t.id} className="pa-tag" onClick={()=>onToggle(t.id)} title={t.tip||""} style={{
            padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:600,cursor:"pointer",
            background:active?`${color}18`:"rgba(255,255,255,0.03)",
            border:`1px solid ${active?color+"88":"rgba(255,255,255,0.08)"}`,
            color:active?color:"#64748b",fontFamily:"'Inter',sans-serif",
            boxShadow:active?`0 2px 8px ${color}22`:"none",
          }}>{active?"✓ ":""}{t.label}</button>
        );
      })}
    </div>
  );
}

// === RACKET DESCRIPTION GENERATOR ===
function generateRacketDescription(r) {
  const sc = r.scores||{};
  const attrs = ATTRS.map(a=>({name:a,val:sc[a]||0})).sort((a,b)=>b.val-a.val);
  const top2 = attrs.slice(0,2);
  const low = attrs[attrs.length-1];
  const cat = r.category||"intermediaire";
  const catLabels = {debutant:"débutant",intermediaire:"intermédiaire",avance:"avancé",expert:"expert",junior:"junior"};
  const shape = (r.shape||"").toLowerCase();
  
  let profile = "";
  // Shape-based
  if(shape.includes("diamant")||shape.includes("diamond")) profile = "joueurs offensifs qui cherchent de la puissance en smash";
  else if(shape.includes("ronde")||shape.includes("round")) profile = "joueurs défensifs ou polyvalents qui valorisent le contrôle";
  else if(shape.includes("goutte")||shape.includes("drop")||shape.includes("hybride")) profile = "joueurs polyvalents qui veulent un bon équilibre attaque/défense";
  else profile = "joueurs polyvalents";
  
  // Level
  const levelStr = catLabels[cat]||"intermédiaire";
  
  // Build description
  let desc = `Raquette de niveau ${levelStr}. `;
  desc += `Points forts : ${top2[0].name} (${top2[0].val}/10) et ${top2[1].name} (${top2[1].val}/10). `;
  if(low.val<=5) desc += `Point faible : ${low.name} (${low.val}/10). `;
  desc += `Idéale pour les ${profile}. `;
  
  // Injury/comfort note
  if(sc["Confort"]>=8) desc += "Son excellent confort la rend adaptée aux joueurs sujets aux tendinites.";
  else if(sc["Confort"]<=5) desc += "⚠ Peu confortable, déconseillée si vous avez des douleurs articulaires.";
  
  return desc;
}

// === TOP RACKETS BY ATTRIBUTE ===
const MAGAZINE_CATEGORIES = [
  {id:"puissance", label:"💥 Puissance", attr:"Puissance", desc:"Les frappes les plus dévastatrices"},
  {id:"controle", label:"🎯 Contrôle", attr:"Contrôle", desc:"Précision chirurgicale"},
  {id:"confort", label:"🛡 Confort", attr:"Confort", desc:"Protège tes articulations"},
  {id:"spin", label:"🌀 Spin", attr:"Spin", desc:"Effets et rotations maximales"},
  {id:"polyvalence", label:"⚖️ Polyvalence", attr:null, desc:"Les meilleures all-round"},
  {id:"rapport", label:"💰 Rapport qualité/prix", attr:null, desc:"Performances au meilleur prix"},
];

function getTopByCategory(catId, year, n=5) {
  const cat = MAGAZINE_CATEGORIES.find(c=>c.id===catId);
  if(!cat) return [];
  let pool = getMergedDB().filter(r=>!year||r.year===year);
  if(catId==="polyvalence") {
    // Score = min score across all attrs (best worst attribute)
    pool = pool.map(r=>{
      const sc = r.scores||{};
      const vals = ATTRS.map(a=>sc[a]||0);
      const minV = Math.min(...vals);
      const avgV = vals.reduce((a,b)=>a+b,0)/vals.length;
      return {...r, _sortScore: minV*0.6 + avgV*0.4};
    });
  } else if(catId==="rapport") {
    pool = pool.filter(r=>r.price).map(r=>{
      const sc = r.scores||{};
      const avg = ATTRS.map(a=>sc[a]||0).reduce((a,b)=>a+b,0)/6;
      const priceNums = (r.price||"").match(/\d+/g);
      const priceNum = priceNums ? (priceNums.length>1 ? (parseInt(priceNums[0])+parseInt(priceNums[1]))/2 : parseInt(priceNums[0])) : 300;
      return {...r, _rawQP: priceNum>0 ? (avg / (priceNum/100)) : 0};
    });
    pool.sort((a,b)=>b._rawQP-a._rawQP);
    const maxQP = pool[0]?._rawQP || 1;
    pool = pool.map(r=>({...r, _sortScore: Math.round((r._rawQP / maxQP) * 100) / 10}));
  } else {
    pool = pool.map(r=>({...r, _sortScore: (r.scores||{})[cat.attr]||0}));
  }
  pool.sort((a,b)=>b._sortScore-a._sortScore);
  return pool.slice(0,n);
}

// === DEEP ANALYSIS — 100% deterministic, zero AI ===
function generateDeepAnalysis(profile, ranked, attrs) {
  if (!ranked.length) return [];
  const best = ranked[0], second = ranked[1], bestScore = best.globalScore;
  const lines = [];
  const styles = profile.styleTags||[], priorities = profile.priorityTags||[];
  const brands = profile.brandTags||[], injuries = (profile.injuryTags||[]).filter(t=>t!=="aucune");
  const OFF_S=["offensif","puissant"], DEF_S=["defensif","contre","endurant"], TECH_S=["tactique","technique"];
  const offC=styles.filter(s=>OFF_S.includes(s)).length, defC=styles.filter(s=>DEF_S.includes(s)).length;
  const techC=styles.filter(s=>TECH_S.includes(s)).length;
  const POW_P=["puissance","spin"], CTL_P=["controle","confort","protection","reprise"];
  const offP=priorities.filter(p=>POW_P.includes(p)).length, defP=priorities.filter(p=>CTL_P.includes(p)).length;
  const hasTension=(offP>0&&defC>=2)||(defP>0&&offC>=2);
  const isComplex=styles.length>=4||(styles.length>=3&&hasTension);
  // Compute weights (mirror computeGlobalScore)
  const w={}; attrs.forEach(a=>w[a]=1);
  const PM={confort:{Confort:1.5},polyvalence:{Contrôle:0.5,Maniabilité:0.5,Tolérance:0.5},puissance:{Puissance:1.5},controle:{Contrôle:1.5},spin:{Spin:1.5},legerete:{Maniabilité:1.5},protection:{Confort:1.5},reprise:{Confort:1.5,Tolérance:1,Maniabilité:0.5}};
  const ordMult = [1.4, 1.0, 0.7, 0.5, 0.5];
  priorities.forEach((t,idx)=>{const b=PM[t];const m=ordMult[Math.min(idx,ordMult.length-1)];if(b)Object.entries(b).forEach(([k,v])=>w[k]=(w[k]||1)+v*m);});
  const SM={offensif:{Puissance:0.5},defensif:{Contrôle:0.5,Tolérance:0.5},tactique:{Contrôle:0.5,Maniabilité:0.3},puissant:{Puissance:0.5,Spin:0.3},veloce:{Maniabilité:0.8},endurant:{Confort:0.5,Tolérance:0.3},contre:{Tolérance:0.5,Contrôle:0.3},polyvalent:{Contrôle:0.3,Tolérance:0.3},technique:{Contrôle:0.5,Spin:0.3}};
  styles.forEach(t=>{const b=SM[t];if(b)Object.entries(b).forEach(([k,v])=>w[k]=(w[k]||1)+v);});
  const ARM_I=["dos","poignet","coude","epaule"],LEG_I=["genou","cheville","mollet","hanche","achille"];
  if(injuries.some(t=>ARM_I.includes(t)))w.Confort+=2;
  if(injuries.some(t=>LEG_I.includes(t)))w.Maniabilité+=1.5;
  const h=Number(profile.height)||0,age=Number(profile.age)||0;
  if(h>0&&h<170)w.Maniabilité+=0.5;if(h>=185)w.Puissance+=0.3;
  if(age>=40){w.Confort+=0.5;w.Tolérance+=0.3;}
  if(age>=50){w.Confort+=0.5;w.Maniabilité+=0.5;w.Tolérance+=0.3;}
  if(age>=60){w.Confort+=0.5;w.Tolérance+=0.5;}
  const hand=profile.hand||"Droitier",side=profile.side||"Droite";
  const isAtt=(hand==="Droitier"&&side==="Gauche")||(hand==="Gaucher"&&side==="Droite");
  const isCon=(hand==="Droitier"&&side==="Droite")||(hand==="Gaucher"&&side==="Gauche");
  if(isAtt){w.Puissance+=0.5;w.Spin+=0.3;}if(isCon){w.Contrôle+=0.5;w.Tolérance+=0.3;}
  const wT=Object.values(w).reduce((s,v)=>s+v,0);
  const wS=attrs.map(a=>({attr:a,weight:w[a],pct:Math.round(w[a]/wT*100)})).sort((a,b)=>b.weight-a.weight);
  const top2=wS.slice(0,2),top2pct=top2.reduce((s,x)=>s+x.pct,0),rest4pct=100-top2pct;
  // Top 3 orientation
  const t3C=ranked.slice(0,Math.min(3,ranked.length)).reduce((s,r)=>s+(r.scores["Contrôle"]||0),0)/Math.min(3,ranked.length);
  const t3P=ranked.slice(0,Math.min(3,ranked.length)).reduce((s,r)=>s+(r.scores.Puissance||0),0)/Math.min(3,ranked.length);
  const t3CtrlOriented=t3C>t3P+0.5;
  const wSaysPow=top2[0].attr==="Puissance"||top2[1].attr==="Puissance";
  const paradox=wSaysPow&&t3CtrlOriented;
  const SL={defensif:"Défensif/Mur",veloce:"Véloce",endurant:"Endurant",contre:"Contre-attaquant",technique:"Technique",puissant:"Puissant/Frappeur",offensif:"Offensif",tactique:"Tactique",polyvalent:"Polyvalent"};
  const PL={puissance:"Puissance",spin:"Spin",controle:"Contrôle",confort:"Confort",legerete:"Légèreté",protection:"Protection bras",reprise:"Reprise en douceur",polyvalence:"Polyvalence"};
  // §1 Profile reading
  const prioLabelStr = priorities.map(p=>PL[p]||p).filter(Boolean);
  const isYoung = age>0 && age<16;
  const noStyles = styles.length===0;
  const hasInjuries = injuries.length > 0;
  const injLabels = injuries.map(t=>{const m={dos:"Dos",poignet:"Poignet",coude:"Tennis elbow",epaule:"Épaule",genou:"Genou",cheville:"Cheville",mollet:"Mollet",hanche:"Hanche",achille:"Tendon d'Achille"};return m[t]||t;});
  const tensionOffPrioDefStyle = offP>0 && defC>=2;
  const tensionDefPrioOffStyle = defP>0 && offC>=2;
  
  if(noStyles){
    if(isYoung){
      lines.push(`Profil junior (${age} ans, ${h}cm). Pas de style de jeu déclaré — l'algorithme se base sur les priorités (${prioLabelStr.join(", ")}) et les caractéristiques physiques. Pour un jeune joueur, la maniabilité et le confort sont naturellement surpondérés.`);
    } else if(hasInjuries && priorities.length>0){
      lines.push(`Pas de style déclaré, mais les blessures (${injLabels.join(", ")}) pèsent lourd sur le scoring. Combinées aux priorités ${prioLabelStr.join(" et ")}, elles orientent le classement vers le confort et la protection.`);
    } else if(priorities.length>0){
      lines.push(`Pas de style de jeu déclaré — le classement repose sur les priorités (${prioLabelStr.join(", ")}) et le profil physique. Avec moins de contraintes à croiser, le score plafond sera plus élevé.`);
    } else {
      lines.push(`Profil minimaliste : ni style ni priorité déclarés. Le classement est basé sur les raquettes les plus équilibrées globalement.`);
    }
  } else if(isComplex && tensionOffPrioDefStyle){
    const ds=styles.filter(s=>DEF_S.includes(s)).map(s=>SL[s]||s).join(", ");
    const op=priorities.filter(p=>POW_P.includes(p)).map(p=>PL[p]||p).join(" et ");
    const ts=styles.filter(s=>TECH_S.includes(s)).map(s=>SL[s]||s);
    let extra=ts.length?`, plus ${ts.join(" et ")} qui renforce${ts.length>1?"nt":""} le Contrôle`:"";
    lines.push(`Profil exigeant : ${styles.length} styles dont ${defC} défensifs (${ds})${extra}, face à des priorités offensives (${op}). Le système doit arbitrer entre ces deux tendances.`);
  } else if(isComplex && tensionDefPrioOffStyle){
    const os=styles.filter(s=>OFF_S.includes(s)).map(s=>SL[s]||s).join(", ");
    const dp=priorities.filter(p=>CTL_P.includes(p)).map(p=>PL[p]||p).join(" et ");
    lines.push(`Profil paradoxal : styles offensifs (${os}) mais priorités orientées protection (${dp})${hasInjuries?" — probablement lié aux blessures ("+injLabels.join(", ")+")":""}. Le système cherche des raquettes qui tapent fort tout en préservant le corps.`);
  } else if(isComplex){
    lines.push(`Profil riche avec ${styles.length} styles. L'algorithme croise tous ces paramètres pour pondérer les 6 critères. Plus le profil est diversifié, plus le score plafond baisse — aucune raquette ne peut exceller partout.`);
  } else if(offC>0&&defC===0&&!hasInjuries){
    lines.push(`Profil offensif ciblé. L'algorithme surpondère Puissance et Spin — les diamants lourdes devraient dominer.`);
  } else if(offC>0&&defC===0&&hasInjuries){
    lines.push(`Profil offensif tempéré par les blessures (${injLabels.join(", ")}). Le Confort est boosté pour préserver le corps malgré le style agressif.`);
  } else if(defC>0&&offC===0){
    if(hasInjuries){
      lines.push(`Profil défensif renforcé par les blessures (${injLabels.join(", ")}). Le Confort devient prioritaire — les rondes légères et tolérantes domineront.`);
    } else {
      lines.push(`Profil orienté défense et contrôle. Les rondes et hybrides vont naturellement dominer le classement.`);
    }
  } else if(styles.length<=2){
    const styleStr = styles.map(s=>SL[s]||s).join(" + ");
    lines.push(`Profil ciblé (${styleStr}${prioLabelStr.length?", priorité "+prioLabelStr.join("/"):""}). Peu de critères en conflit — le classement sera tranché.`);
  } else {
    lines.push(`Profil équilibré entre ${styles.length} styles. Le classement récompense les raquettes les plus polyvalentes.`);
  }
  // §2 Weight explanation — prose, not data dump
  const pct = v => (v*10).toFixed(1);
  const pctRound = v => Math.round(v*10);
  // Paradox only makes sense when defensive styles actually exist AND outweigh priorities
  const realParadox = paradox && defC>=2 && rest4pct > top2pct;
  
  if(realParadox){
    lines.push(`Résultat contre-intuitif mais logique : malgré des priorités ${top2[0].attr} et ${top2[1].attr}, ce sont des raquettes orientées contrôle qui dominent le classement. Pourquoi ? Parce que les ${defC} styles défensifs${techC>0?" et le style technique":""} gonflent le poids de 4 autres critères (Contrôle, Tolérance, Confort, Maniabilité) qui, ensemble, pèsent plus lourd (${rest4pct}%) que les 2 priorités (${top2pct}%). Une raquette qui score 8-9 sur ces 4 axes compense largement un 7 en Puissance.`);
  } else if(noStyles && priorities.length>0){
    // Simple profile driven by priorities
    lines.push(`Le classement est piloté par les priorités ${prioLabelStr.join(" et ")} qui concentrent ${top2pct}% du poids. Les raquettes les mieux notées sur ${top2[0].attr}${top2[1]?" et "+top2[1].attr:""} arrivent naturellement en tête.`);
  } else if(top2[0].pct>=25){
    lines.push(`Le profil tire clairement vers ${top2[0].attr} et ${top2[1].attr}, qui concentrent ${top2pct}% du poids total. Le classement favorise logiquement les raquettes fortes sur ces deux axes.`);
  } else {
    lines.push(`Aucun critère ne domine massivement — le classement récompense les raquettes les plus équilibrées sur l'ensemble des 6 axes.`);
  }
  // §3 Score ceiling
  if(bestScore<7.8){
    lines.push(`Score plafond à ${pct(bestScore)}% — ${isComplex?"normal pour un profil à "+styles.length+" styles qui tirent dans des directions différentes. ":""}Aucune raquette du marché ne peut satisfaire tous les critères à la fois. Un score de ${pctRound(bestScore)}% signifie meilleur compromis réaliste, pas un choix médiocre.`);
  } else if(bestScore>=8.5){
    lines.push(`Score élevé à ${pct(bestScore)}%${noStyles||styles.length<=2?" — logique pour un profil avec peu de contraintes à satisfaire":" — profil cohérent, la n°1 répond bien à l'ensemble des critères"}.${second&&(bestScore-second.globalScore)>=0.1?" L'avance est nette.":""}`);
  } else {
    // 7.8 - 8.5
    const tight = second && (bestScore-second.globalScore)<0.05;
    if(noStyles){
      lines.push(`Score à ${pct(bestScore)}% — correct pour un profil sans style déclaré, guidé par ${prioLabelStr.length?prioLabelStr.join(" et "):"les paramètres physiques"}.${tight?" Le peloton de tête est très serré, le ressenti en main fera la différence.":""}`);
    } else {
      lines.push(`Score à ${pct(bestScore)}% — bon compromis.${tight?" Le peloton de tête est très serré, le ressenti en main fera la différence.":""}`);
    }
  }
  // §4 Brand analysis
  if(brands.length>0){
    // Check which brands are actually in Top 3
    const brandsInTop3 = brands.filter(b=>ranked.slice(0,3).some(r=>(r.brand||"").toLowerCase().replace(/\s/g,"").includes(b)));
    const brandsNotInTop3 = brands.filter(b=>!brandsInTop3.includes(b));
    const bInLabels = brandsInTop3.map(b=>b.charAt(0).toUpperCase()+b.slice(1));
    const bOutLabels = brandsNotInTop3.map(b=>b.charAt(0).toUpperCase()+b.slice(1));
    const bestBR=brandsNotInTop3.length>0?ranked.find(r=>brandsNotInTop3.some(b=>(r.brand||"").toLowerCase().replace(/\s/g,"").includes(b))):null;
    
    if(brandsInTop3.length===brands.length){
      // All preferred brands are in Top 3
      const verb=bInLabels.length>1?"sont représentées":"est représentée";
      lines.push(`${bInLabels.join(", ")} ${verb} dans le Top 3 — ${bInLabels.length>1?"les marques préférées proposent":"la marque préférée propose"} des modèles techniquement adaptés au profil.`);
    } else if(brandsInTop3.length>0 && brandsNotInTop3.length>0){
      // Mixed: some brands in, some out
      const inStr=bInLabels.join(", ");
      const outStr=bOutLabels.join(", ");
      let line=`${inStr} ${bInLabels.length>1?"sont dans":"est dans"} le Top 3.`;
      if(bestBR){
        line+=` ${outStr} absente — la meilleure est la ${bestBR.name} à ${(bestBR.globalScore*10).toFixed(1)}%.`;
      }
      lines.push(line);
    } else if(bestBR){
      // No brand in Top 3
      const gap=(bestScore-bestBR.globalScore)*10;
      lines.push(`Marque préférée ${bOutLabels.join("/")} absente du Top 3 : la meilleure est la ${bestBR.name} à ${(bestBR.globalScore*10).toFixed(1)}% (${gap.toFixed(1)} pts sous la n°1). L'écart technique ne peut pas être comblé par un simple bonus marque — le classement reste objectif.`);
    }
  }
  // §5 Top 3 shapes
  if(ranked.length>=3){
    const shapes=ranked.slice(0,3).map(r=>r.shape).filter(Boolean);
    const uniq=[...new Set(shapes)];
    if(uniq.length===1&&uniq[0]==="Ronde") lines.push(`Les 3 finalistes sont des rondes : forme offrant le meilleur compromis contrôle/tolérance, cohérent quand ces critères pèsent lourd.`);
    else if(uniq.length===1&&uniq[0]==="Diamant") lines.push(`Les 3 finalistes sont des diamants : logique pour un profil puissance pure.`);
    else if(uniq.length>=2) lines.push(`Le podium mélange ${uniq.join(" et ")} — le profil est assez polyvalent pour que différentes géométries scorent bien.`);
  }
  return lines;
}

export default function PadelAnalyzer() {
  const [rackets, setRackets] = useState(()=>{
    const saved = loadSavedRackets();
    return saved.length ? saved : INITIAL_RACKETS;
  });
  const [selected, setSelected] = useState(()=>{
    const saved = loadSavedRackets();
    return saved.length ? saved.slice(0,Math.min(saved.length,4)).map(r=>r.id) : [];
  });
  const [tab, setTab] = useState("radar");
  const [showArena, setShowArena] = useState(false);
  const [openAttr, setOpenAttr] = useState(null);
  const [profile, setProfile] = useState(()=>loadSavedProfile());
  const [panel, setPanel] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [suggestResults, setSuggestResults] = useState(null);
  const [suggestChecked, setSuggestChecked] = useState(new Set());
  const [addingBatch, setAddingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState("");
  const [profileName, setProfileName] = useState(()=>{
    const p = loadSavedProfile();
    return p._name || "";
  });
  const [savedProfiles, setSavedProfiles] = useState(()=>loadProfilesList());
  const [profileSearchTerm, setProfileSearchTerm] = useState("");
  const [activeProfileIdx, setActiveProfileIdx] = useState(0);
  const carouselRef = useRef(null);
  const [hoveredRacket, setHoveredRacket] = useState(null);
  const [localDBCount, setLocalDBCount] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('padel_db_extra')||'[]').length; } catch{ return 0; }
  });
  // Compteur dynamique = total unique (embedded + extras dédupliqués par ID)
  const totalDBCount = useMemo(() => getMergedDB().length, [localDBCount]);
  const [screen, setScreen] = useState(()=>{
    // Check session freshness for vendeur/admin
    const role = getGroupRole();
    const lastActive = parseInt(localStorage.getItem('padel_last_active') || '0');
    const idleMs = Date.now() - lastActive;
    const MAX_IDLE = { vendeur: 5 * 60 * 1000, admin: 30 * 60 * 1000 }; // 5min / 30min
    if ((role === 'vendeur' && idleMs > MAX_IDLE.vendeur) ||
        (role === 'admin' && idleMs > MAX_IDLE.admin)) {
      // Clear session credentials only — cloud data survives
      localStorage.removeItem('padel_group_role');
      localStorage.removeItem('padel_group_name');
      localStorage.removeItem('padel_family_code');
      localStorage.removeItem('padel_last_active');
      return "login";
    }
    localStorage.setItem('padel_last_active', String(Date.now()));
    if (!getFamilyCode()) return "login";
    const p = loadSavedProfile();
    return (p._name) ? "home" : "home";
  });

  // ============ BROWSER BACK BUTTON SUPPORT ============
  const SCREEN_BACK = { home:"login", magazine:"home", wizard:"home", recap:"wizard", analyzing:null, reveal:"dashboard", dashboard:"home", app:"dashboard", racketSheet:"home", catalog:"home", admin:"home" };
  const cameFromAdminRef = useRef(false);

  // Open a full racket sheet from any screen
  const openRacketSheet = useCallback((racket, fromScreen) => {
    if (!racket) return;
    // Find full data from DB if needed
    const allDB = getMergedDB();
    const full = allDB.find(r => r.id === racket.id) || allDB.find(r => r.name === racket.name) || racket;
    setRacketSheet(full);
    setRacketSheetFrom(fromScreen || screen);
    setScreen("racketSheet");
  }, [screen]);
  const isPopStateRef = useRef(false);

  // Push to browser history on screen change (but NOT when triggered by popstate)
  useEffect(() => {
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }
    if (screen !== "analyzing") {
      window.history.pushState({ screen }, "", "");
    }
  }, [screen]);

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = (e) => {
      if (e.state?.screen) {
        isPopStateRef.current = true;
        setScreen(e.state.screen);
      } else {
        // No state = user went back past first screen → stay put
        window.history.pushState({ screen: "home" }, "", "");
        isPopStateRef.current = true;
        setScreen("home");
      }
    };
    // Seed initial history entry
    window.history.replaceState({ screen }, "", "");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  const [wizardStep, setWizardStep] = useState(0);
  const [revealIdx, setRevealIdx] = useState(0);
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm }
  const [passwordModal, setPasswordModal] = useState(null); // { mode:'unlock'|'setpin'|'lock', profileName, onSuccess }
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [magCat, setMagCat] = useState("puissance");
  const [magYear, setMagYear] = useState(2026);
  const [magDetail, setMagDetail] = useState(null); // racket to show in detail
  const [racketSheet, setRacketSheet] = useState(null); // full racket sheet view
  const [racketSheetFrom, setRacketSheetFrom] = useState("home"); // screen to return to
  const [catalogSearch, setCatalogSearch] = useState(""); // catalog search term
  const [catFilters, setCatFilters] = useState({ brands:[], cats:[], shapes:[], years:[], priceMax:0 }); // 0 = no limit
  const toggleCatFilter = (key, val) => setCatFilters(f => ({...f, [key]: f[key].includes(val) ? f[key].filter(v=>v!==val) : [...f[key], val]}));
  const resetCatFilters = () => setCatFilters({ brands:[], cats:[], shapes:[], years:[], priceMax:0 });
  const [magSlide, setMagSlide] = useState(0); // current slide index in top5
  const [addDetail, setAddDetail] = useState(null); // index of expanded search result

  // ============ CLOUD SYNC STATE ============
  const [familyCode, setFamilyCode] = useState(()=>getFamilyCode());
  const [groupRole, setGroupRole] = useState(()=>getGroupRole());
  const [groupName, setGroupNameState] = useState(()=>getGroupName());
  const [cloudStatus, setCloudStatus] = useState(""); // "", "loading", "synced", "error"
  const [cloudLoginName, setCloudLoginName] = useState("");
  const [cloudLoginPassword, setCloudLoginPassword] = useState("");
  const [cloudLoginMode, setCloudLoginMode] = useState("join"); // "join" | "create"
  const [cloudLoginRole, setCloudLoginRole] = useState("famille"); // "vendeur" | "famille"
  const [cloudError, setCloudError] = useState("");
  const [swUpdateReady, setSwUpdateReady] = useState(!!window.__SW_UPDATE_READY);

  // ============ ADMIN STATE ============
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("families");
  const [adminFamilies, setAdminFamilies] = useState([]);
  const [adminExpandedFamily, setAdminExpandedFamily] = useState(null);
  const [adminFamilyProfiles, setAdminFamilyProfiles] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminRacketSearch, setAdminRacketSearch] = useState("");
  const [adminRacketFilter, setAdminRacketFilter] = useState("all");
  const [adminEditRacket, setAdminEditRacket] = useState(null);
  const [adminViewProfile, setAdminViewProfile] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");
  const adminFileInputRef = useRef(null);

  // Cloud sync: load profiles AND extra rackets from Supabase when family code changes
  useEffect(()=>{
    if (!familyCode) return;
    setCloudStatus("loading");
    // Toujours vider les profils locaux d'abord pour éviter les fuites entre groupes
    setSavedProfiles([]);
    Promise.all([
      cloudLoadProfiles(familyCode),
      cloudLoadAllRackets()
    ]).then(([cloudProfiles, cloudRackets]) => {
      setSavedProfiles(cloudProfiles);
      saveProfilesList(cloudProfiles);
      // Merge cloud rackets that aren't in static RACKETS_DB into localStorage extras
      if (cloudRackets.length > 0) {
        try {
          const staticIds = new Set(RACKETS_DB.map(r => r.id));
          const staticNames = new Set(RACKETS_DB.map(r => r.name.toLowerCase()));
          const extras = cloudRackets.filter(r => 
            r.id && !staticIds.has(r.id) && !staticNames.has((r.name||'').toLowerCase())
          );
          if (extras.length > 0) {
            localStorage.setItem('padel_db_extra', JSON.stringify(extras));
            setLocalDBCount(extras.length);
            _log(`[Cloud] Loaded ${extras.length} extra rackets from Supabase (${cloudRackets.length} total in cloud, ${RACKETS_DB.length} static)`);
          }
        } catch(e) { _warn('[Cloud] Rackets merge failed:', e.message); }
      }
      setCloudStatus("synced");
      // Check admin status
      checkIsAdmin(familyCode).then(admin => {
        setIsAdmin(admin);
        if (admin) _log("[Admin] ✅ Mode admin activé");
      });
    }).catch(err => {
      _warn("[Cloud] Load error:", err.message);
      setCloudStatus("error");
    });
  }, [familyCode]);

  // ============ INACTIVITY TIMER (Vendeur/Tablette mode) ============
  useEffect(() => {
    if (groupRole !== 'vendeur' || screen === 'login') return;
    const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
    let timer = null;
    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        // Clear session state but DON'T destroy cloud data
        setCloudLoginName("");
        setCloudLoginPassword("");
        setCloudError("");
        setSavedProfiles([]); // clear React state only
        setProfile({...INITIAL_PROFILE});
        setProfileName("");
        localStorage.removeItem('padel_last_active');
        // Reset familyCode so cloud sync re-triggers on next login
        setFamilyCode("");
        setFamilyCodeLS("");
        setGroupRole("famille");
        setGroupRoleLS("");
        setGroupNameState("");
        setGroupNameLS("");
        setCloudStatus("");
        setScreen("login");
        setAdminMsg("⏱ Session expirée — inactivité");
        setTimeout(() => setAdminMsg(""), 4000);
      }, TIMEOUT_MS);
    };
    const events = ['mousedown','mousemove','keydown','touchstart','scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer, {passive:true}));
    resetTimer();
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [groupRole, screen]);

  // ============ SESSION HEARTBEAT (vendeur/admin) ============
  useEffect(() => {
    if (screen === 'login' || (groupRole !== 'vendeur' && groupRole !== 'admin')) return;
    const tick = () => localStorage.setItem('padel_last_active', String(Date.now()));
    tick();
    const interval = setInterval(tick, 30 * 1000); // every 30s
    // Also tick when tab regains focus (prevents false expiry from tab switching)
    const onVisible = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisible); };
  }, [groupRole, screen]);

  // ============ LOCALSTORAGE CACHE CLEANUP ============
  useEffect(() => {
    try {
      const MAX_CACHE_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
      const MAX_CACHE_ENTRIES = 100;
      const cacheKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('padel_score_')) cacheKeys.push(key);
      }
      // Remove expired entries
      let removed = 0;
      for (const key of cacheKeys) {
        try {
          const raw = JSON.parse(localStorage.getItem(key));
          if (!raw?.ts || Date.now() - raw.ts > MAX_CACHE_AGE) { localStorage.removeItem(key); removed++; }
        } catch { localStorage.removeItem(key); removed++; }
      }
      // If still too many, remove oldest
      if (cacheKeys.length - removed > MAX_CACHE_ENTRIES) {
        const remaining = cacheKeys
          .filter(k => localStorage.getItem(k))
          .map(k => { try { return { k, ts: JSON.parse(localStorage.getItem(k))?.ts || 0 }; } catch { return { k, ts: 0 }; } })
          .sort((a, b) => a.ts - b.ts);
        const toRemove = remaining.slice(0, remaining.length - MAX_CACHE_ENTRIES);
        toRemove.forEach(({ k }) => localStorage.removeItem(k));
        removed += toRemove.length;
      }
      if (removed > 0) _log(`[Cache] Cleaned ${removed} expired score entries`);
    } catch {}
  }, []);

  // ============ SW UPDATE LISTENER ============
  useEffect(() => {
    const handler = () => setSwUpdateReady(true);
    window.addEventListener('sw-update-ready', handler);
    return () => window.removeEventListener('sw-update-ready', handler);
  }, []);

  // Auto-reload when reaching login screen with pending update (NEVER during wizard/analyzing)
  useEffect(() => {
    if (screen === 'login' && swUpdateReady) {
      _log('[SW] Login screen + update ready → reloading');
      window.location.reload();
    }
  }, [screen, swUpdateReady]);

  // Cloud save helper
  const cloudSyncProfile = useCallback(async (name, profileData, locked) => {
    if (!familyCode) return;
    try { await cloudSaveProfile(familyCode, name, profileData, locked); } 
    catch(e) { _warn("[Cloud] Save:", e.message); }
  }, [familyCode]);

  // Cloud delete helper
  const cloudDeleteProfileFn = useCallback(async (name) => {
    if (!familyCode) return;
    try { await cloudDeleteProfile(familyCode, name); } 
    catch(e) { _warn("[Cloud] Delete:", e.message); }
  }, [familyCode]);

  // Cloud logout
  const handleCloudLogout = () => {
    setFamilyCode("");
    setFamilyCodeLS("");
    setGroupRole("famille");
    setGroupRoleLS("");
    setGroupNameState("");
    setGroupNameLS("");
    setCloudStatus("");
    setCloudLoginName("");
    setCloudLoginPassword("");
    setCloudLoginRole("famille");
    setCloudError("");
    setSavedProfiles([]);
    saveProfilesList([]);
    localStorage.removeItem('padel_last_active');
    setScreen("login");
  };

  // Cloud login via groups
  const handleCloudJoin = async () => {
    const name = cloudLoginName.trim();
    const pwd = cloudLoginPassword.trim();
    if (!name) { setCloudError("Entre un nom de groupe"); return; }
    if (pwd.length < 8) { setCloudError("Mot de passe trop court (8 car. min)"); return; }
    setCloudError("");
    try {
      let result;
      if (cloudLoginMode === "join") {
        result = await groupLogin(name, pwd);
      } else {
        result = await groupCreate(name, pwd, cloudLoginRole);
      }
      if (result.error) { setCloudError(result.error); return; }
      setFamilyCodeLS(result.family_code);
      setFamilyCode(result.family_code);
      setGroupRoleLS(result.role);
      setGroupRole(result.role);
      setGroupNameLS(result.name);
      setGroupNameState(result.name);
      setScreen("home");
    } catch(e) { setCloudError(e.message); }
  };

  // Auto-save rackets and profile to localStorage
  useEffect(()=>{ saveRackets(rackets); }, [rackets]);
  useEffect(()=>{ try { localStorage.setItem('padel_profile', JSON.stringify({...profile, _name: profileName})); } catch{} }, [profile, profileName]);

  const toggleRacket = (id) => {
    setSelected(p => p.includes(id) ? (p.length>1?p.filter(r=>r!==id):p) : p.length<4?[...p,id]:p);
  };
  const removeRacket = (id) => {
    setRackets(p => p.filter(r=>r.id!==id));
    setSelected(p => { const n=p.filter(r=>r!==id); return n.length?n:rackets.filter(r=>r.id!==id).length?[rackets.filter(r=>r.id!==id)[0].id]:[]; });
  };
  const toggleTag = (field, id) => {
    setProfile(p => {
      const cur = p[field];
      if (field==="injuryTags" && id==="aucune") return {...p,[field]:cur.includes("aucune")?[]:["aucune"]};
      if (field==="injuryTags" && cur.includes("aucune")) return {...p,[field]:[id]};
      return {...p,[field]:cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]};
    });
  };

  // Home screen: select existing profile
  const selectHomeProfile = (sp) => {
    setProfile({...INITIAL_PROFILE,...sp.profile});
    setProfileName(sp.name);
    setPanel(null);
    setScreen("dashboard");
  };
  // Home screen: create new profile → wizard flow
  const createNewProfile = () => {
    setProfile({...INITIAL_PROFILE});
    setProfileName("");
    setWizardStep(0);
    setPanel(null);
    setScreen("wizard");
  };
  // Disconnect: clear session and back to home
  const disconnect = () => {
    setPanel(null);
    setRackets([]);
    setSelected([]);
    setSuggestResults(null);
    setSuggestChecked(new Set());
    setError("");
    setScreen("home");
  };
  // Dashboard → App with Top 3 loaded
  const launchAnalysis = (top3Rackets) => {
    if (top3Rackets && top3Rackets.length) {
      const loaded = top3Rackets.map((r, i) => {
        const color = COLORS_POOL[i % COLORS_POOL.length];
        return {
          id: r.id + '-' + Date.now() + '-' + i,
          name: r.name, shortName: r.shortName || r.name.slice(0,28),
          brand: r.brand, shape: r.shape, weight: r.weight,
          balance: r.balance||"—", surface: r.surface||"—", core: r.core||"—",
          price: r.price||"—", player: r.player||"—", color,
          imageUrl: r.imageUrl||null,
          scores: r.scores,
          category: r.category||null,
          junior: r.junior||false,
          womanLine: r.womanLine||false,
          year: r.year||null,
          verdict: r.verdict||"Analyse non disponible",
          forYou: "partial",
          refSource: "Base Padel Analyzer",
          _fromDB: true, _incomplete: false,
        };
      });
      setRackets(loaded);
      setSelected(loaded.slice(0,4).map(r=>r.id));
    }
    setPanel(null);
    setScreen("app");
  };
  // Dashboard → App without loading (keep existing session)
  const goToApp = () => {
    setPanel(null);
    setScreen("app");
  };
  // Go back to dashboard from app
  const goToDashboard = () => {
    setPanel(null);
    setScreen("dashboard");
  };

  const selRackets = rackets.filter(r=>selected.includes(r.id));
  const radarData = ATTRS.map(a => { const pt={attribute:a, "— 10/10 —":10}; selRackets.forEach(r=>{pt[r.shortName]=Number(r.scores[a])||0}); return pt; });
  const profileText = buildProfileText(profile);

  const rescoreRacket = async(id) => {
    const r = rackets.find(x=>x.id===id);
    if (!r) return;
    setLoading(true); setLoadMsg(`🔄 Re-scoring ${r.shortName}...`);
    try {
      // Clear cache for this racket
      try { localStorage.removeItem(getCacheKey(r.name, r.brand)); } catch{}
      const scored = await fetchAndScoreRacket(r.name, r.brand, r.color);
      setRackets(p=>p.map(x=>x.id===id?{...scored, id}:x));
    } catch(e) { setError("❌ Échec du re-scoring: "+e.message); }
    finally { setLoading(false); setLoadMsg(""); }
  };

  // ============================================================
  // FIXED: system prompt goes in body.system, not in messages
  // ============================================================
  function stripCiteTags(text) {
    return text.replace(/<\/?cite[^>]*>/gi, '').replace(/<\/?source[^>]*>/gi, '');
  }

  async function callAI(msgs, {webSearch=false, systemPrompt=null, maxTokens=1500, retries=4}={}) {
    const body = { model:"claude-sonnet-4-20250514", max_tokens:maxTokens, temperature:0, messages:msgs };
    if (systemPrompt) body.system = systemPrompt;
    if (webSearch) body.tools = [{type:"web_search_20250305",name:"web_search"}];
    
    for (let attempt=0; attempt<=retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(()=>controller.abort(), 120000);
      try {
        const r = await fetch("/api/chat",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(body),
          signal:controller.signal,
        });
        clearTimeout(timeout);
        if ((r.status===529 || r.status===429) && attempt<retries) {
          const waitSec = r.status===429 ? 30+attempt*15 : 8+attempt*4;
          _warn(`[API] ${r.status} rate limited, retry ${attempt+1}/${retries} in ${waitSec}s...`);
          setLoadMsg?.(`⏳ Limite API atteinte — pause ${waitSec}s avant de reprendre (${attempt+1}/${retries})...`);
          await new Promise(ok=>setTimeout(ok,waitSec*1000));
          continue;
        }
        if (!r.ok) {
          const errBody = await r.text().catch(()=>"");
          throw new Error(`API ${r.status}: ${errBody.slice(0,300)}`);
        }
        const d = await r.json();
        const raw = d.content?.filter(b=>b.type==="text").map(b=>b.text).join("\n")||"";
        return stripCiteTags(raw);
      } catch(e) {
        clearTimeout(timeout);
        if (e.name==="AbortError") throw new Error("Timeout — la requête a pris trop de temps (>120s). Réessaie.");
        if (attempt<retries && (e.message?.includes("529")||e.message?.includes("429")||e.message?.includes("Overloaded")||e.message?.includes("rate_limit"))) {
          const waitSec = 30+attempt*15;
          _warn(`[API] Retry ${attempt+1}/${retries} after error:`, e.message);
          await new Promise(ok=>setTimeout(ok,waitSec*1000));
          continue;
        }
        throw e;
      }
    }
  }
  function parseJ(t) {
    let c = t.replace(/```json|```/g,'').trim();
    // Strip any remaining XML/HTML tags (cite, source, etc.)
    c = c.replace(/<\/?[a-z][^>]*>/gi, '');
    // Try direct parse first
    try { const m = c.match(/[\[{][\s\S]*[\]}]/); if(m) return JSON.parse(m[0]); } catch {}
    // Fix trailing commas before } or ]
    try { const fixed = c.replace(/,\s*([}\]])/g, '$1'); const m = fixed.match(/[\[{][\s\S]*[\]}]/); if(m) return JSON.parse(m[0]); } catch {}
    // Fix unquoted keys
    try { const fixed = c.replace(/(\{|,)\s*([a-zA-Z_]\w*)\s*:/g, '$1"$2":'); const m = fixed.match(/[\[{][\s\S]*[\]}]/); if(m) return JSON.parse(m[0]); } catch {}
    // Fix single quotes to double quotes
    try { const fixed = c.replace(/'/g, '"'); const m = fixed.match(/[\[{][\s\S]*[\]}]/); if(m) return JSON.parse(m[0]); } catch {}
    // Last resort — try the whole thing
    try { return JSON.parse(c); } catch {}
    throw new Error("Impossible de parser la réponse. Réessaie.");
  }

  // ============================================================
  // SEARCH: manual racket lookup
  // ============================================================
  const searchRackets = useCallback(async()=>{
    if(!searchQ.trim())return;
    setLoading(true); setError(""); setSuggestions(null); setLoadMsg("🔍 Recherche en cours...");
    try {
      const txt = await callAI([{role:"user",content:`Search the web for padel rackets matching: "${searchQ}". The user may have typed an approximate name, brand, player name, or partial model. Find the 2-4 most likely padel racket matches currently on sale (2024-2026 models).
For EACH match: exact full official name, brand, shape (Diamant/Goutte d'eau/Ronde/Hybride), approximate weight, one-line description in French.
Return ONLY a JSON array: [{"name":"...","brand":"...","shape":"...","weight":"...","description":"..."}]. No markdown.`}], {webSearch:true});
      const res = parseJ(txt);
      if(!Array.isArray(res)||!res.length) throw new Error("Aucun résultat");
      setSuggestions(res);
    } catch(e) { setError("❌ "+e.message+". Essaie d'autres mots-clés."); }
    finally { setLoading(false); setLoadMsg(""); }
  },[searchQ]);

  // Select from manual search → get specs + score
  const selectSuggestion = useCallback(async(idx)=>{
    const sug = suggestions[idx]; if(!sug)return;
    setSuggestions(s=>s.map((x,i)=>({...x,_disabled:true,_selected:i===idx})));
    setLoading(true); setError(""); setLoadMsg("🔍 Récupération des specs...");
    try {
      const newR = await fetchAndScoreRacket(sug.name, sug.brand, getNextColor(rackets));
      setRackets(p=>[...p,newR]);
      setSelected(p=>p.length<4?[...p,newR.id]:p);
      setSearchQ(""); setSuggestions(null);
      setLoadMsg("✅ "+newR.name+" ajoutée !");
      setTimeout(()=>setLoadMsg(""),2500);
    } catch(e) { setError("❌ "+e.message); setSuggestions(s=>s?.map(x=>({...x,_disabled:false,_selected:false}))); }
    finally { setLoading(false); }
  },[suggestions,rackets,profile,profileText]);

  // ============================================================
  // SHARED: fetch specs + score a single racket
  // ============================================================
  // Score cache — save scored rackets to avoid re-scoring
  function normalizeName(name) {
    return (name||'').toLowerCase()
      .replace(/\b(head|bullpadel|adidas|wilson|babolat|nox|siux|starvie|varlion|drop shot|dunlop|star vie)\b/gi,'') // strip brand from name
      .replace(/\b(20\d{2})\b/g,'') // strip year
      .replace(/\b(v\d+)\b/gi,'') // strip version numbers like V2
      .replace(/[^a-z0-9]/g,'')
      .replace(/\s+/g,'');
  }
  function getCacheKey(name, brand) {
    const n = normalizeName(name);
    const b = (brand||'').toLowerCase().replace(/[^a-z0-9]/g,'');
    return 'padel_score_' + b + '_' + n;
  }
  function getCachedScore(name, brand) {
    try {
      const raw = localStorage.getItem(getCacheKey(name, brand));
      if (!raw) return null;
      const cached = JSON.parse(raw);
      // Cache expires after 7 days
      if (Date.now() - cached.ts > 7*24*60*60*1000) { localStorage.removeItem(getCacheKey(name, brand)); return null; }
      return cached.data;
    } catch { return null; }
  }
  function setCachedScore(name, brand, data) {
    try { localStorage.setItem(getCacheKey(name, brand), JSON.stringify({ts:Date.now(), data})); } catch {}
  }
  // Save web-found rackets to local DB supplement for future DB matching
  function saveToLocalDB(racket) {
    try {
      const extra = JSON.parse(localStorage.getItem('padel_db_extra')||'[]');
      // Check if already exists in extras OR embedded DB
      const nameLower = racket.name.toLowerCase();
      if (extra.some(r=>r.name.toLowerCase()===nameLower || r.id===racket.id)) return;
      if (RACKETS_DB.some(r=>r.name.toLowerCase()===nameLower || r.id===racket.id)) return;
      // Determine category from scores
      const avgScore = Object.values(racket.scores||{}).reduce((a,b)=>a+b,0)/6;
      let category = 'intermediaire';
      if (racket.name.toLowerCase().includes('junior')||racket.name.toLowerCase().includes('kids')) category = 'junior';
      else if (avgScore >= 7.5) category = 'expert';
      else if (avgScore >= 7) category = 'avance';
      else if (avgScore <= 5.5) category = 'debutant';
      
      extra.push({
        id: racket.id, name: racket.name, shortName: racket.shortName,
        brand: racket.brand, shape: racket.shape, weight: racket.weight,
        balance: racket.balance||"—", surface: racket.surface||"—", core: racket.core||"—",
        price: racket.price||"—", player: racket.player||"—", imageUrl: racket.imageUrl||null,
        year: new Date().getFullYear(), category,
        scores: racket.scores, verdict: racket.verdict||"—",
      });
      localStorage.setItem('padel_db_extra', JSON.stringify(extra));
      setLocalDBCount(extra.length);
      _log(`[DB+] Saved ${racket.name} to local DB supplement (total: ${extra.length})`);
      // Sync to cloud
      if (familyCode) cloudSaveExtraRackets(familyCode, extra).catch(e => _warn('[Cloud] Extra sync:', e.message));
    } catch(e) { _warn('[DB+] Save failed:', e.message); }
  }

  function exportLocalDB() {
    try {
      const extra = JSON.parse(localStorage.getItem('padel_db_extra')||'[]');
      if (!extra.length) { alert('Aucune raquette apprise localement.'); return; }
      const blob = new Blob([JSON.stringify(extra, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `padel-local-db-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) { alert('Erreur export: ' + e.message); }
  }

  function clearLocalDB() {
    if (!localDBCount) return;
    setConfirmModal({message:`Supprimer les ${localDBCount} raquette(s) apprise(s) localement ?`,onConfirm:()=>{
      try { localStorage.removeItem('padel_db_extra'); setLocalDBCount(0); if (familyCode) cloudSaveExtraRackets(familyCode, []).catch(()=>{}); } catch{}
      setConfirmModal(null);
    },onCancel:()=>setConfirmModal(null)});
  }

  // Load a racket directly from DB (no API needed)
  function loadRacketFromDB(name, brand, color) {
    const allDB = getMergedDB();
    
    const nameLower = name.toLowerCase();
    const entry = allDB.find(r=>r.name.toLowerCase()===nameLower) || allDB.find(r=>nameLower.includes(r.name.toLowerCase().slice(0,15))||r.name.toLowerCase().includes(nameLower.slice(0,15)));
    if (!entry) return null;
    
    return {
      id: entry.id + '-' + Date.now(),
      name: entry.name, shortName: entry.shortName || entry.name.slice(0,28),
      brand: entry.brand, shape: entry.shape, weight: entry.weight,
      balance: entry.balance||"—", surface: entry.surface||"—", core: entry.core||"—",
      price: entry.price||"—", player: entry.player||"—", color,
      imageUrl: entry.imageUrl||null,
      scores: entry.scores,
      category: entry.category||null,
      junior: entry.junior||false,
      womanLine: entry.womanLine||false,
      year: entry.year||null,
      verdict: entry.verdict||"Analyse non disponible",
      forYou: "partial", // Computed dynamically by computeForYou()
      refSource: "Base Padel Analyzer",
      _fromDB: true, _incomplete: false,
    };
  }

  async function fetchAndScoreRacket(name, brand, assignedColor) {
    // Check cache first
    const cached = getCachedScore(name, brand);
    if (cached) {
      _log(`[Cache] Hit for ${name} — using cached scores`);
      return { ...cached, color: assignedColor, id: cached.id + '-' + Date.now() };
    }
    
    // Check DB second (embedded + local supplement)
    const dbResult = loadRacketFromDB(name, brand, assignedColor);
    if (dbResult) {
      _log(`[DB] Found ${name} in database — no API call needed`);
      setCachedScore(name, brand, dbResult);
      return dbResult;
    }

    // Step 1: Fetch specs + reference scores from review sites
    const specsTxt = await callAI([{role:"user",content:`Search the web for complete technical specs AND review scores of this padel racket: "${name}" by ${brand}.

PART A — TECHNICAL SPECS (search manufacturer site, retailers):
brand, full name, short display name (max 18 chars), shape (Diamant/Goutte d'eau/Ronde/Hybride), weight range in grams, balance (mm + Haut/Mi-haut/Moyen/Bas), hitting surface material (carbon, fiberglass, hybrid, 12K, 18K etc.), core/foam material (density: soft, medium, hard, reactive), anti-vibration tech if any, approximate price in €, pro player endorsement, product image URL.

IMAGE URL RULES: Find a DIRECT URL to a product photo of the racket (jpg/png/webp). Search retailers like PadelNuestro, Padel Reference, PadelZone, Amazon, Decathlon, or the manufacturer's site. The URL must point to an actual photo of THIS specific racket model — not a logo, banner, category page, or generic image. Look for URLs containing the racket model name. If you cannot find a reliable product photo URL, set imageUrl to null.

PART B — REFERENCE SCORES (search Esprit Padel Shop, PadelMania, Padel Reference, PadelZone, or any review site that gives scores/ratings):
Find existing ratings/scores for this racket. Look for: power/puissance, control/contrôle, comfort/confort, spin/effet, maneuverability/maniabilité/manoeuvrabilité, tolerance/tolérance/sweet spot. These may be on /100, /10, /5, or star ratings.
If you find scores, convert ALL to /100 scale. If a site uses /10 multiply by 10, if /5 multiply by 20.
If NO review scores found, set refScores to null.

Return ONLY JSON:
{
  "brand":"...","name":"...","shortName":"...","shape":"...","weight":"...","balance":"...","surface":"...","core":"...","antivib":"...","price":"...","player":"...","imageUrl":"https://...",
  "refScores": {"puissance":85,"controle":70,"confort":65,"spin":75,"maniabilite":60,"tolerance":70,"source":"Esprit Padel Shop"} or null
}
No markdown.`}], {webSearch:true});
    const specs = parseJ(specsTxt);

    // Step 2: Score using reference scores + mechanical rules as guard-rails
    const hasRef = specs.refScores && typeof specs.refScores === 'object';
    const refBlock = hasRef ? `
REFERENCE SCORES (from ${specs.refScores.source || 'review site'}, scale /100):
Puissance: ${specs.refScores.puissance ?? 'N/A'}, Contrôle: ${specs.refScores.controle ?? 'N/A'}, Confort: ${specs.refScores.confort ?? 'N/A'}, Spin: ${specs.refScores.spin ?? 'N/A'}, Maniabilité: ${specs.refScores.maniabilite ?? 'N/A'}, Tolérance: ${specs.refScores.tolerance ?? 'N/A'}

CALIBRATION METHOD:
1. Start from reference scores. Convert /100 to /10: score_base = (ref_score / 10) - 0.5. This applies a mild deflation since review sites tend to inflate (they rarely go below 60/100). Examples: 90→8.5, 80→7.5, 73→6.8, 65→6.0.
2. Apply GUARD-RAIL CAPS from mechanical rules (see system prompt). If a cap applies, use the LOWER of calibrated vs cap. For example: Diamant shape → Contrôle capped at 7.5, Tolérance capped at 6.5. Stiff carbon + hard EVA → Confort max 6.0.
3. Apply GUARD-RAIL FLOORS from mechanical rules. For example: Fiberglass + soft foam + anti-vib → Confort minimum 7.0.
4. Round to nearest 0.5.
5. Final scores must respect both the relative ordering from reviews AND the absolute caps/floors from mechanical rules.` : `
NO REFERENCE SCORES FOUND. Use PURE MECHANICAL RULES from system prompt to calculate scores.`;

    const scoreTxt = await callAI([{role:"user",content:`Score this padel racket's INTRINSIC properties. Do NOT consider any player profile — score the racket itself.

RACKET SPECS:
- Name: ${specs.name}
- Shape: ${specs.shape}
- Weight: ${specs.weight}
- Balance: ${specs.balance}
- Surface: ${specs.surface}
- Core/Foam: ${specs.core}
- Anti-vibration tech: ${specs.antivib || "none specified"}
${refBlock}

IMPORTANT: Scores must reflect the racket's own characteristics, NOT how well it fits any player. A heavy diamond racket scores high on Puissance and low on Maniabilité regardless of who uses it.

Calculate each score step by step: state the reference score (if available), the calibrated score, any guard-rail cap, then the final score.

Return JSON: {"scores":{"Puissance":X,"Contrôle":X,"Confort":X,"Spin":X,"Maniabilité":X,"Tolérance":X},"verdict":"French text describing the racket's character and best use case (2-3 sentences)","reasoning":"brief calculation notes","refSource":"${specs.refScores?.source || 'none'}"}
No markdown, no backticks.`}], {systemPrompt: SCORING_SYSTEM_PROMPT});
    let analysis;
    try { analysis = parseJ(scoreTxt); } catch(e1) {
      _warn(`[Score] Parse failed for ${specs.name}, retrying...`, e1.message);
      try {
        const retry = await callAI([{role:"user",content:`Score this padel racket's INTRINSIC properties. Specs: ${specs.name}, ${specs.shape}, ${specs.weight}, ${specs.balance}, ${specs.surface}, ${specs.core}.
Return ONLY valid JSON: {"scores":{"Puissance":7,"Contrôle":7,"Confort":7,"Spin":7,"Maniabilité":7,"Tolérance":7},"verdict":"French text describing the racket"}
No markdown, no backticks, no explanation.`}], {systemPrompt: SCORING_SYSTEM_PROMPT, maxTokens:600});
        analysis = parseJ(retry);
        _log(`[Score] Retry succeeded for ${specs.name}`);
      } catch(e2) {
        _warn(`[Score] Retry also failed for ${specs.name}:`, e2.message);
        analysis = { scores:{}, verdict:"Scoring automatique indisponible — clique 🔄 pour réessayer.", forYou:"partial", _incomplete:true };
      }
    }

    const newId = (specs.name||name).toLowerCase().replace(/[^a-z0-9]/g,'-').slice(0,35)+'-'+Date.now();
    // Sanitize specs — replace any null/undefined/"Not Found"/empty with "—"
    const clean = (v) => (!v || v === 'null' || v === 'undefined' || /not found|introuvable|n\/a|unknown/i.test(v)) ? "—" : String(v).trim();
    const result = {
      id:newId, name:specs.name||name, shortName:(specs.shortName||specs.name||name).slice(0,28),
      brand:clean(specs.brand)||brand||"—", shape:clean(specs.shape),
      weight:clean(specs.weight), balance:clean(specs.balance),
      surface:clean(specs.surface), core:clean(specs.core), price:clean(specs.price),
      player:clean(specs.player), color:assignedColor,
      imageUrl:specs.imageUrl||null,
      scores:Object.fromEntries(ATTRS.map(a=>[a, Math.round((Number(analysis.scores?.[a])||5)*10)/10])),
      verdict:analysis.verdict||"Analyse non disponible",
      forYou: "partial", // Will be computed dynamically by computeForYou() based on current profile
      refSource: analysis.refSource || specs.refScores?.source || null,
      _incomplete: analysis._incomplete || Object.keys(analysis.scores||{}).length < 6,
    };
    // Save to cache
    setCachedScore(specs.name||name, specs.brand||brand, result);
    // Also save to local DB supplement for future DB matching
    saveToLocalDB(result);
    return result;
  }

  // ============================================================
  // DATABASE: match rackets from local DB
  // ============================================================
  function matchFromDB(profile, existingNames) {
    const age = Number(profile.age)||0;
    const ht = Number(profile.height)||0;
    const isJunior = (age>0&&age<15)||(ht>0&&ht<150);
    const brandPref = profile.brandTags.map(id=>BRAND_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
    
    // Merge embedded DB + any localStorage supplements (deduped by ID)
    const allDB = getMergedDB();

    // Filter by category
    let pool;
    if (isJunior) {
      pool = allDB.filter(r=>r.category==='junior');
    } else {
      const lvl = profile.level||'Débutant';
      const catMap = {'Débutant':['debutant','intermediaire'],'Intermédiaire':['intermediaire','debutant','avance','expert'],'Avancé':['avance','intermediaire','expert'],'Expert':['expert','avance','intermediaire']};
      const cats = catMap[lvl]||['debutant','intermediaire'];
      pool = allDB.filter(r=>cats.includes(r.category));
    }
    
    // Exclude already owned
    const exLower = existingNames.map(n=>n.toLowerCase());
    pool = pool.filter(r=>!exLower.some(n=>r.name.toLowerCase().includes(n.slice(0,12))||n.includes(r.name.toLowerCase().slice(0,12))));
    
    // Filter by brand preferences (if any)
    let brandPool = pool;
    if (brandPref.length) {
      const prefLower = brandPref.map(b=>b.toLowerCase());
      brandPool = pool.filter(r=>prefLower.includes(r.brand.toLowerCase()));
      // Always include a few from other brands
      const otherPool = pool.filter(r=>!prefLower.includes(r.brand.toLowerCase()));
      const otherTop = otherPool.sort((a,b)=>computeGlobalScore(a.scores, profile, a)-computeGlobalScore(b.scores, profile, b)).reverse().slice(0,2);
      brandPool = [...brandPool, ...otherTop];
    }
    
    // Deduplicate by model: keep newest year when same model exists in multiple years
    const deduped = [];
    const modelMap = new Map();
    for (const r of brandPool) {
      // Extract model name without year (e.g. "Bullpadel Vertex 04" from "Bullpadel Vertex 04 2024")
      const modelKey = r.name.replace(/\s*20\d{2}\s*/g, '').toLowerCase().trim();
      const existing = modelMap.get(modelKey);
      if (!existing || (r.year||0) > (existing.year||0)) {
        modelMap.set(modelKey, r);
      }
    }
    brandPool = [...modelMap.values()];

    // Score all and sort (computeGlobalScore returns 0 for incompatible: womanLine for men, junior, etc.)
    const scored = brandPool.map(r=>({...r, _globalScore: computeGlobalScore(r.scores, profile, r)}))
      .filter(r=>r._globalScore > 0);
    scored.sort((a,b)=>b._globalScore-a._globalScore);
    
    // Split into heart (top matches) and priority (match priority tags)
    const prioTags = (profile.priorityTags||[]);
    const prioAttrs = [];
    if (prioTags.includes('puissance')) prioAttrs.push('Puissance');
    if (prioTags.includes('controle')) prioAttrs.push('Contrôle');
    if (prioTags.includes('confort')||prioTags.includes('protection')||prioTags.includes('reprise')) prioAttrs.push('Confort');
    if (prioTags.includes('spin')) prioAttrs.push('Spin');
    if (prioTags.includes('legerete')) prioAttrs.push('Maniabilité');
    
    // For female profiles, ensure womanLine representation in heart
    let heart;
    const isFemaleProfile = (profile.genre||"").toLowerCase() === "femme";
    if (isFemaleProfile) {
      const wlScored = scored.filter(r=>r.womanLine);
      const nonWl = scored.filter(r=>!r.womanLine);
      const wlCount = Math.min(wlScored.length, 5); // up to 5 womanLine
      const nonWlCount = 12 - wlCount;
      heart = [...wlScored.slice(0, wlCount), ...nonWl.slice(0, nonWlCount)];
      heart.sort((a,b)=>b._globalScore - a._globalScore);
    } else {
      heart = scored.slice(0, 12);
    }
    const heartIds = new Set(heart.map(r=>r.id));
    
    // Priority: sort remaining by average of priority attributes
    let prioPool = scored.filter(r=>!heartIds.has(r.id));
    if (prioAttrs.length) {
      prioPool.sort((a,b)=>{
        const avgA = prioAttrs.reduce((s,k)=>(s+(a.scores[k]||0)),0)/prioAttrs.length;
        const avgB = prioAttrs.reduce((s,k)=>(s+(b.scores[k]||0)),0)/prioAttrs.length;
        return avgB-avgA;
      });
    }
    const priority = prioPool.slice(0, 4);
    
    return { heart, priority, totalPool: pool.length };
  }

  // ============================================================
  // SUGGEST: DB first, web search fallback
  // ============================================================
  const suggestRackets = useCallback(async()=>{
    setLoading(true); setError(""); setSuggestResults(null); setSuggestChecked(new Set()); setLoadMsg("🎯 Recherche dans la base de données...");
    const existingNames = rackets.map(r=>r.name);
    const brandPref = profile.brandTags.map(id=>BRAND_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
    const prioLabels = profile.priorityTags.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
    const isExpertFeel = !!profile.expertToucher;
    const feelDesc = isExpertFeel ? `PRO FEEL PREFERENCES: Toucher=${profile.expertToucher}, Réactivité=${profile.expertReactivite||"explosive"}, Poids=${profile.expertPoids||"equilibre"}, Forme=${profile.expertForme||"indifferent"}` : "";
    _log("[Suggest] Starting. Existing:", existingNames, "Brands:", brandPref, "Priorities:", isExpertFeel ? feelDesc : prioLabels);
    
    try {
      // Phase 1: Try DB first
      const dbMatch = matchFromDB(profile, existingNames);
      _log("[DB] Pool:", dbMatch.totalPool, "Heart:", dbMatch.heart.length, "Priority:", dbMatch.priority.length);
      
      if (dbMatch.heart.length + dbMatch.priority.length >= 6) {
        // Enough results from DB — format as suggestions
        const results = [
          ...dbMatch.heart.map(r=>({name:r.name, brand:r.brand, shape:r.shape, weight:r.weight, price:r.price, category:"heart", description:r.verdict, _fromDB:true})),
          ...dbMatch.priority.map(r=>({name:r.name, brand:r.brand, shape:r.shape, weight:r.weight, price:r.price, category:"priority", description:r.verdict, _fromDB:true})),
        ];
        _log("[DB] Sufficient results:", results.length, "— skipping web search");
        setSuggestResults(results);
        setLoadMsg("✅ " + results.length + " raquettes trouvées instantanément !");
        setTimeout(()=>setLoadMsg(""),2500);
        setLoading(false);
        return;
      }
      
      // Phase 2: Not enough from DB — use web search
      _log("[DB] Only", dbMatch.heart.length + dbMatch.priority.length, "results — falling back to web search");
      setLoadMsg("🌐 Recherche web complémentaire...");
      const startTime = Date.now();
      const timer = setInterval(()=>{
        const elapsed = Math.floor((Date.now()-startTime)/1000);
        setLoadMsg(`🌐 Recherche web complémentaire... (${elapsed}s)`);
      }, 1000);
      
      try {
        const txt = await callAI([{role:"user",content:`Search the web for padel rackets suitable for this player. Find 8 different models (2024-2026).

PLAYER: ${profileText}

EXCLUDED (already owned, do NOT include): ${existingNames.join('; ')}

${brandPref.length ? `PREFERRED BRANDS: ${brandPref.join(', ')}. Include 5+ from these brands and 1-2 from other brands.` : ''}

You MUST return TWO categories:

CATEGORY "heart" (4-5 rackets) — COUPS DE CŒUR: Best overall match for the player's FULL profile (style, level, side, priorities).${(profile.injuryTags||[]).some(t=>t!=="aucune") ? ' Player has injuries — prioritize comfort and safety. Avoid stiff carbon with hard EVA.' : ' No injuries — focus on best performance match for the player style and priorities.'}

CATEGORY "priority" (3 rackets) — ALTERNATIVES ${isExpertFeel ? "SENSATIONS" : "PRIORITÉ"}: ${isExpertFeel ? `Rackets that match the player's PRO FEEL: ${feelDesc}. A "sec" touch means hard EVA/rigid foam + carbon surface. A "souple" touch means soft EVA/foam. "Explosive" reactivity = high balance diamond shapes. "Progressive" = lower balance, control shapes.` : `Rackets that specifically match the player's PRIORITY TAGS: ${prioLabels.join(', ')}. These can sacrifice some comfort for performance in the priority areas. ${prioLabels.includes('Puissance') ? 'Include powerful rackets (diamond/drop shapes, high balance) even if comfort is lower.' : ''} ${prioLabels.includes('Spin') ? 'Include textured surface rackets for maximum spin.' : ''}`} Still exclude truly dangerous choices (no comfort below 4/10). Add a warning in description if comfort is limited.

Key rules:
${(()=>{
  const a=Number(profile.age)||0; const ht=Number(profile.height)||0;
  const isJunior = (a>0&&a<15)||(ht>0&&ht<150);
  const isSenior = a>=50;
  const lines = [];
  if(isJunior) {
    lines.push('- JUNIOR PLAYER: Search specifically for JUNIOR/KIDS padel rackets. Weight 300-340g max. Price range 30-120€. Smaller grip. Do NOT suggest adult rackets.');
  } else if(profile.level==="Avancé"||profile.level==="Expert") {
    lines.push('- Avancé/Expert level → price range 200-400€.');
  } else if(profile.level==="Intermédiaire") {
    lines.push('- Intermédiaire level → price range 100-250€.');
  } else {
    lines.push('- Débutant level → price range 50-150€. Prioritize round shapes, light weight, high tolerance.');
  }
  if(isSenior) lines.push('- Player is 50+ years old → prioritize lightweight rackets (340-360g), excellent comfort and vibration dampening.');
  lines.push('- Véloce/Endurant → light weight preferred.');
  lines.push('- Each racket: name (exact official name), brand, shape, weight, price (€), category ("heart" or "priority"), description (2 sentences French: WHY it fits + warning if comfort limited).');
  return lines.join('\n');
})()}

Return ONLY a JSON array, no markdown: [{"name":"...","brand":"...","shape":"...","weight":"...","price":"...","category":"heart","description":"..."}]`}], {webSearch:true, maxTokens:2500});
        const res = parseJ(txt);
        if(!Array.isArray(res)||!res.length) throw new Error("Aucune suggestion trouvée");
        _log("[WebSearch] Got results:", res.length, res.map(r=>`${r.category}:${r.name}`));
        const filtered = res.filter(s => !existingNames.some(n => 
          n.toLowerCase().includes(s.name?.toLowerCase()?.slice(0,15)) || 
          s.name?.toLowerCase()?.includes(n.toLowerCase().slice(0,15))
        ));
        setSuggestResults(filtered.length ? filtered : res);
        clearInterval(timer);
        setLoadMsg("");
      } catch(e) {
        clearInterval(timer);
        throw e;
      }
    } catch(e) { console.error("[Suggest] Failed:", e.message, e); setError("❌ "+e.message); }
    finally { setLoading(false); setLoadMsg(""); }
  },[profile,profileText,rackets]);

  // Toggle checkbox on a suggestion
  const toggleSuggestCheck = (idx) => {
    setSuggestChecked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // Load a racket directly from DB (no API needed)
  // Batch add all checked suggestions
  const addCheckedSuggestions = useCallback(async()=>{
    if (!suggestResults || suggestChecked.size===0) return;
    setAddingBatch(true); setError("");
    const toAdd = [...suggestChecked].sort((a,b)=>a-b);
    const sugsToScore = toAdd.map(idx=>suggestResults[idx]).filter(s=>s&&!s._added);
    if (!sugsToScore.length) { setAddingBatch(false); return; }
    
    const usedColors = new Set(rackets.map(r=>r.color));
    const availableColors = COLORS_POOL.filter(c=>!usedColors.has(c));
    while (availableColors.length < sugsToScore.length) {
      availableColors.push(`hsl(${Math.floor(Math.random()*360)}, 70%, 55%)`);
    }
    
    let added = 0;
    for (let i=0; i<sugsToScore.length; i++) {
      const sug = sugsToScore[i];
      const color = availableColors[i] || `hsl(${i*60}, 70%, 55%)`;
      setBatchProgress(`⏳ ${i+1}/${sugsToScore.length} — ${sug.name}...`);
      try {
        let newR;
        if (sug._fromDB) {
          // Direct from database — instant, no API call
          newR = loadRacketFromDB(sug.name, sug.brand, color);
          if (!newR) throw new Error("Raquette introuvable dans la base");
          _log(`[DB] Loaded ${sug.name} directly — no API call`);
        } else {
          // Web search result — needs API scoring
          newR = await fetchAndScoreRacket(sug.name, sug.brand, color);
          // Save to local DB supplement for future use
          saveToLocalDB(newR);
        }
        setRackets(p=>[...p,newR]);
        setSelected(p=>p.length<4?[...p,newR.id]:p);
        const idx = toAdd[i];
        setSuggestResults(s=>s.map((x,j)=>j===idx?{...x,_added:true}:x));
        added++;
        if (!sug._fromDB && i < sugsToScore.length-1) await new Promise(ok=>setTimeout(ok,3000));
      } catch(e) {
        const idx = toAdd[i];
        setSuggestResults(s=>s.map((x,j)=>j===idx?{...x,_error:e.message}:x));
      }
    }
    setBatchProgress(`✅ ${added} raquette${added>1?"s":""} ajoutée${added>1?"s":""}!`);
    setSuggestChecked(new Set());
    setTimeout(()=>setBatchProgress(""),3000);
    setAddingBatch(false);
  },[suggestResults,suggestChecked,rackets,profile,profileText]);

  // ============================================================
  // RE-ANALYZE all verdicts
  // ============================================================
  const reanalyzeAll = useCallback(async()=>{
    setLoading(true); setError(""); setLoadMsg("🔄 Ré-analyse en cours...");
    try {
      const txt = await callAI([{role:"user",content:`Re-evaluate ALL these rackets for this player profile. Apply STRICT MECHANICAL RULES.

PLAYER: ${profileText}

RACKETS:
${rackets.map(r=>`- "${r.name}": shape=${r.shape}, weight=${r.weight}, balance=${r.balance}, surface=${r.surface}, core=${r.core}`).join('\n')}

For EACH racket provide ONLY forYou and verdict. Do NOT change the scores (those are mechanical).
Return JSON array: [{"name":"exact name","forYou":"recommended|partial|no","verdict":"2 sentences French"}]. No markdown.`}], {systemPrompt: SCORING_SYSTEM_PROMPT});
      const res = parseJ(txt);
      setRackets(p=>p.map(r=>{
        const m = res.find(x=>r.name.toLowerCase().includes(x.name?.toLowerCase())||x.name?.toLowerCase().includes(r.name.toLowerCase()));
        return m ? {...r,forYou:m.forYou,verdict:m.verdict} : r;
      }));
      setLoadMsg("✅ Profil mis à jour !"); setTimeout(()=>setLoadMsg(""),2000);
    } catch(e) { setError("❌ "+e.message); }
    finally { setLoading(false); }
  },[profile,rackets,profileText]);

  // ============================================================
  // STYLES
  // ============================================================
  const S = {
    root:{fontFamily:"'Inter',sans-serif",background:"linear-gradient(160deg,#080c14,#0f1623,#0d1520,#0a0f1a)",color:"#e2e8f0",minHeight:"100vh",padding:"24px 16px",letterSpacing:"-0.01em"},
    card:{background:"rgba(255,255,255,0.025)",borderRadius:16,padding:18,border:"1px solid rgba(255,255,255,0.06)",marginBottom:18,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",animation:"fadeIn 0.3s ease"},
    title:{fontFamily:"'Outfit'",fontSize:12,fontWeight:700,color:"#f97316",marginBottom:12,letterSpacing:"0.04em",textTransform:"uppercase"},
    btn:(a)=>({padding:"8px 16px",background:a?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${a?"#f97316":"rgba(255,255,255,0.08)"}`,borderRadius:10,color:a?"#f97316":"#94a3b8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.2s cubic-bezier(.4,0,.2,1)",letterSpacing:"-0.01em"}),
    btnGreen:{padding:"12px 16px",background:"linear-gradient(135deg,rgba(76,175,80,0.2),rgba(76,175,80,0.1))",border:"1px solid rgba(76,175,80,0.4)",borderRadius:12,color:"#4CAF50",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",width:"100%",transition:"all 0.2s ease",letterSpacing:"-0.01em"},
    input:{width:"100%",padding:"9px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif",transition:"border-color 0.2s ease"},
    select:{width:"100%",padding:"9px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#e2e8f0",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"'Inter',sans-serif",appearance:"auto",transition:"border-color 0.2s ease"},
    label:{fontSize:10,color:"#64748b",fontWeight:600,marginBottom:4,display:"block",letterSpacing:"0.02em",textTransform:"uppercase"},
    sectionLabel:{fontSize:12,color:"#e2e8f0",fontWeight:700,marginTop:14,marginBottom:3},
  };

  return (
    <div style={S.root}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .pa-card { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
        .pa-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .pa-carousel::-webkit-scrollbar { display: none; }
        .pa-tag { transition: all 0.15s cubic-bezier(.4,0,.2,1); }
        .pa-tag:active { transform: scale(0.94); }
        .pa-tab { position: relative; transition: all 0.2s ease; }
        .pa-tab::after { content: ''; position: absolute; bottom: -1px; left: 50%; width: 0; height: 2px; background: #f97316; border-radius: 1px; transition: all 0.25s cubic-bezier(.4,0,.2,1); transform: translateX(-50%); }
        .pa-tab-active::after { width: 60%; }
        .pa-badge { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .pa-score-cell { position: relative; }
        .pa-score-cell::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 3px; border-radius: 2px; opacity: 0.15; }
        .pa-section { border-left: 3px solid; padding-left: 10px; margin-top: 14px; margin-bottom: 4px; }
        tr.pa-row { transition: background 0.15s ease; }
        tr.pa-row:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* ============================================================ */}
      {/* SW UPDATE BANNER */}
      {/* ============================================================ */}
      {swUpdateReady && screen !== 'login' && <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"8px 16px",background:"linear-gradient(135deg,#1e3a5f,#0f172a)",borderBottom:"1px solid rgba(249,115,22,0.3)",animation:"fadeIn 0.3s ease"}}>
        <span style={{fontSize:12,color:"#94a3b8"}}>🔄 Mise à jour disponible</span>
        <button onClick={()=>window.location.reload()} style={{padding:"4px 14px",borderRadius:8,fontSize:11,fontWeight:700,background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.4)",color:"#f97316",cursor:"pointer",fontFamily:"'Inter'"}}>Mettre à jour</button>
      </div>}

      {/* ============================================================ */}
      {/* LOGIN / CLOUD SCREEN */}
      {/* ============================================================ */}
      {screen==="login"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",animation:"fadeIn 0.5s ease",padding:"0 16px"}}>
        <div style={{width:80,height:80,borderRadius:20,background:"linear-gradient(135deg,#f97316,#ef4444)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><ellipse cx="22" cy="18" rx="10" ry="12" stroke="#fff" strokeWidth="2.5" fill="none"/><line x1="22" y1="30" x2="22" y2="38" stroke="#fff" strokeWidth="3" strokeLinecap="round"/><circle cx="33" cy="32" r="3.5" fill="#fff" opacity="0.9"/></svg>
        </div>
        <h1 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px",letterSpacing:"-0.02em"}}>PADEL ANALYZER</h1>
        <p style={{color:"#64748b",fontSize:12,margin:"0 0 32px",textAlign:"center"}}>Ton conseiller raquette intelligent</p>
        
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:24,width:"100%",maxWidth:380}}>
          {/* Mode toggle */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            <button onClick={()=>{setCloudLoginMode("join");setCloudError("");}} style={{flex:1,padding:"10px",borderRadius:10,border:cloudLoginMode==="join"?"1px solid #f97316":"1px solid rgba(255,255,255,0.1)",background:cloudLoginMode==="join"?"rgba(249,115,22,0.15)":"transparent",color:cloudLoginMode==="join"?"#f97316":"#64748b",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Se connecter</button>
            <button onClick={()=>{setCloudLoginMode("create");setCloudError("");}} style={{flex:1,padding:"10px",borderRadius:10,border:cloudLoginMode==="create"?"1px solid #f97316":"1px solid rgba(255,255,255,0.1)",background:cloudLoginMode==="create"?"rgba(249,115,22,0.15)":"transparent",color:cloudLoginMode==="create"?"#f97316":"#64748b",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Créer un compte</button>
          </div>
          
          {adminMsg&&<div style={{padding:"10px 14px",background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.25)",borderRadius:10,marginBottom:12,fontSize:12,color:"#f97316",textAlign:"center",fontWeight:600,animation:"fadeIn 0.3s ease"}}>{adminMsg}</div>}
          
          <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 16px",lineHeight:1.5}}>
            {cloudLoginMode==="join"
              ?"Connecte-toi avec ton nom de groupe et ton mot de passe."
              :"Crée ton espace pour sauvegarder et synchroniser tes profils."}
          </p>
          
          {/* Nom du groupe */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4,display:"block"}}>Nom du groupe</label>
            <input type="text" value={cloudLoginName} onChange={e=>setCloudLoginName(e.target.value)} autoComplete="one-time-code" name="padel_grp_x"
              readOnly onFocus={e=>e.target.removeAttribute('readOnly')}
              placeholder={cloudLoginMode==="join"?"Ex: Famille Dupont":"Choisis un nom de groupe"}
              style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,color:"#f1f5f9",fontSize:14,fontFamily:"'Inter'",fontWeight:600,outline:"none",boxSizing:"border-box"}}
              onKeyDown={e=>e.key==="Enter"&&handleCloudJoin()}/>
          </div>
          
          {/* Mot de passe */}
          <div style={{marginBottom:cloudLoginMode==="create"?12:0}}>
            <label style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4,display:"block"}}>Mot de passe</label>
            <input type="password" value={cloudLoginPassword} onChange={e=>setCloudLoginPassword(e.target.value)} autoComplete="new-password" name="padel_pwd_x"
              readOnly onFocus={e=>e.target.removeAttribute('readOnly')}
              placeholder="••••••"
              style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,color:"#f1f5f9",fontSize:14,fontFamily:"'Inter'",fontWeight:600,outline:"none",boxSizing:"border-box"}}
              onKeyDown={e=>e.key==="Enter"&&handleCloudJoin()}/>
          </div>
          
          {/* Rôle (création uniquement) */}
          {cloudLoginMode==="create"&&<div style={{marginBottom:0}}>
            <label style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6,display:"block"}}>Type de compte</label>
            <div style={{display:"flex",gap:8}}>
              {[
                {value:"famille",label:"👨‍👩‍👧 Famille",desc:"Usage personnel"},
                {value:"vendeur",label:"🏪 Vendeur",desc:"Portefeuille clients"},
              ].map(opt=>(
                <button key={opt.value} onClick={()=>setCloudLoginRole(opt.value)} style={{
                  flex:1,padding:"10px 8px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",textAlign:"center",transition:"all 0.15s",
                  background:cloudLoginRole===opt.value?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.03)",
                  border:`1px solid ${cloudLoginRole===opt.value?"#f97316":"rgba(255,255,255,0.08)"}`,
                  color:cloudLoginRole===opt.value?"#f97316":"#64748b",
                }}>
                  <div style={{fontSize:13,fontWeight:700}}>{opt.label}</div>
                  <div style={{fontSize:9,marginTop:2,opacity:0.7}}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>}
          
          {cloudError&&<p style={{color:"#ef4444",fontSize:11,marginTop:10,textAlign:"center"}}>{cloudError}</p>}
          
          <button onClick={handleCloudJoin} style={{marginTop:16,width:"100%",padding:"14px",background:"linear-gradient(135deg,rgba(249,115,22,0.3),rgba(239,68,68,0.2))",border:"1px solid rgba(249,115,22,0.4)",borderRadius:14,color:"#f97316",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Outfit'",letterSpacing:"-0.01em"}}>
            {cloudLoginMode==="join"?"☁️ Se connecter":"☁️ Créer mon espace"}
          </button>
          
          <button onClick={()=>{setFamilyCodeLS("LOCAL");setFamilyCode("LOCAL");setGroupRoleLS("famille");setGroupRole("famille");setScreen("home");}} style={{marginTop:12,width:"100%",padding:"10px",background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,color:"#475569",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            Continuer en local (sans synchronisation)
          </button>
        </div>
        
        <p style={{fontSize:8,color:"#334155",marginTop:32,letterSpacing:"0.05em"}}>
          <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> V12 · {totalDBCount} raquettes
        </p>
      </div>}

      {/* ============================================================ */}
      {/* HOME SCREEN */}
      {/* ============================================================ */}
      {screen==="home"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",animation:"fadeIn 0.5s ease",padding:"0 16px"}}>
        {/* Big logo */}
        <div style={{marginBottom:24,animation:"fadeIn 0.6s ease"}}>
          <svg width="80" height="80" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter:"drop-shadow(0 8px 24px rgba(249,115,22,0.35))"}}>
            <defs><linearGradient id="logoGradHome" x1="0" y1="0" x2="44" y2="44"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#ef4444"/></linearGradient></defs>
            <rect width="44" height="44" rx="10" fill="url(#logoGradHome)"/>
            <ellipse cx="22" cy="18" rx="10" ry="12" stroke="#fff" strokeWidth="2.2" fill="none"/>
            <line x1="22" y1="10" x2="22" y2="26" stroke="#fff" strokeWidth="1.2" opacity="0.4"/>
            <line x1="14" y1="18" x2="30" y2="18" stroke="#fff" strokeWidth="1.2" opacity="0.4"/>
            <line x1="22" y1="30" x2="22" y2="38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="33" cy="32" r="3.5" fill="#fff" opacity="0.85"/>
          </svg>
        </div>
        <h1 style={{fontFamily:"'Outfit'",fontSize:32,fontWeight:800,background:"linear-gradient(135deg,#f97316,#ef4444,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 6px",letterSpacing:"-0.03em",textAlign:"center"}}>PADEL ANALYZER</h1>
        {groupName&&familyCode!=="LOCAL"?<p style={{color:"#f97316",fontSize:14,margin:"0 0 8px",fontWeight:700,textAlign:"center",fontFamily:"'Outfit'"}}>
          {groupRole==="admin"?"👑 Salut Boss":groupRole==="vendeur"?`🏪 Espace ${groupName}`:`👋 Bienvenue ${groupName}`}
        </p>:<p style={{color:"#64748b",fontSize:13,margin:"0 0 8px",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:500,textAlign:"center"}}>Ton conseiller raquette intelligent</p>}
        <p style={{color:"#475569",fontSize:11,margin:"0 0 36px",textAlign:"center",maxWidth:340,lineHeight:1.5}}>Analyse ton profil, explore {totalDBCount}+ raquettes, trouve la pala parfaite pour ton jeu.</p>

        {/* Saved profiles — Carousel */}
        {savedProfiles.length>0&&(()=>{
          const profileSearch = profileSearchTerm;
          const filtered = savedProfiles.filter(sp=>!profileSearch||sp.name.toLowerCase().includes(profileSearch.toLowerCase()));
          const CARD_W = 210;
          const GAP = 14;
          const scrollToIdx = (idx)=>{
            const el = carouselRef.current;
            if(!el) return;
            const target = idx * (CARD_W + GAP);
            el.scrollTo({left:target,behavior:"smooth"});
            setActiveProfileIdx(idx);
          };
          const handleScroll = ()=>{
            const el = carouselRef.current;
            if(!el) return;
            const idx = Math.round(el.scrollLeft / (CARD_W + GAP));
            setActiveProfileIdx(Math.max(0, Math.min(idx, filtered.length-1)));
          };
          const scrollDir = (dir)=>{
            const next = dir==="left" ? activeProfileIdx-1 : activeProfileIdx+1;
            if(next>=0 && next<filtered.length) scrollToIdx(next);
            else if(next<0) scrollToIdx(filtered.length-1); // loop
            else scrollToIdx(0); // loop
          };
          return (
          <div style={{width:"100%",maxWidth:560,marginBottom:24}}>
            <p style={{fontSize:10,color:"#94a3b8",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:12,textAlign:"center"}}>👤 Mes profils <span style={{color:"#64748b",fontWeight:400}}>({savedProfiles.length})</span></p>

            {/* Search bar — shows when 4+ profiles */}
            {savedProfiles.length>=4&&<div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
              <div style={{position:"relative",width:"100%",maxWidth:280}}>
                <input
                  type="text" placeholder="Rechercher un profil…" value={profileSearch}
                  onChange={e=>{setProfileSearchTerm(e.target.value);setActiveProfileIdx(0);}}
                  style={{width:"100%",padding:"8px 12px 8px 32px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#e2e8f0",fontSize:12,fontFamily:"'Inter',sans-serif",outline:"none",boxSizing:"border-box"}}
                />
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#64748b",pointerEvents:"none"}}>🔍</span>
                {profileSearch&&<button onClick={()=>{setProfileSearchTerm("");setActiveProfileIdx(0);}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",fontSize:14,cursor:"pointer",padding:2}}>✕</button>}
              </div>
            </div>}

            {/* Carousel container */}
            <div style={{position:"relative",display:"flex",alignItems:"center",gap:4}}>
              {/* Left arrow */}
              {filtered.length>1&&<button onClick={()=>scrollDir("left")} aria-label="Précédent" style={{
                width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",
                color:"#e2e8f0",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                fontFamily:"'Inter',sans-serif",transition:"all 0.2s",backdropFilter:"blur(8px)",
              }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(249,115,22,0.15)";e.currentTarget.style.borderColor="rgba(249,115,22,0.4)";}}
                 onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>‹</button>}

              {/* Scrollable track */}
              <div ref={carouselRef} className="pa-carousel" onScroll={handleScroll} style={{
                display:"flex",gap:GAP,overflowX:"auto",scrollSnapType:"x mandatory",scrollBehavior:"smooth",
                flex:1,padding:"6px 0 10px",msOverflowStyle:"none",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",
              }} onKeyDown={e=>{if(e.key==="ArrowLeft"){e.preventDefault();scrollDir("left");}if(e.key==="ArrowRight"){e.preventDefault();scrollDir("right");}}} tabIndex={0}>
                {/* Spacer so first card can center */}
                <div style={{minWidth:`calc(50% - ${CARD_W/2}px)`,flexShrink:0}} aria-hidden="true"/>
                {filtered.map((sp,i)=>{
                  const p = sp.profile||{};
                  const styles = (p.styleTags||[]).map(id=>STYLE_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
                  const injuries = (p.injuryTags||[]).filter(t=>t!=="aucune").map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
                  const isJunior = p.age && parseInt(p.age)<16;
                  const levelColors = {Débutant:"#4CAF50",Intermédiaire:"#FF9800",Avancé:"#ef4444",Compétition:"#9C27B0",Expert:"#a855f7"};
                  const desc = [p.side&&`Côté ${p.side}`, p.hand].filter(Boolean).join(" · ");
                  const stylesStr = styles.length?styles.slice(0,2).join(", "):"";
                  const isActive = i === activeProfileIdx;
                  return (
                    <button key={sp.name} onClick={()=>{
                      if(sp.locked){
                        setPinInput("");setPinError("");setPasswordModal({mode:'unlock',profileName:sp.name,onSuccess:()=>{selectHomeProfile(sp);setPasswordModal(null);}});
                      } else { selectHomeProfile(sp); }
                    }} style={{
                      background: isActive ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.03)",
                      border: isActive ? "1px solid rgba(249,115,22,0.35)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:18,padding:"22px 16px 16px",cursor:"pointer",textAlign:"center",fontFamily:"'Inter',sans-serif",
                      minWidth:CARD_W,maxWidth:CARD_W,flexShrink:0,scrollSnapAlign:"center",
                      display:"flex",flexDirection:"column",alignItems:"center",gap:8,position:"relative",
                      transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
                      transform: isActive ? "scale(1.03)" : "scale(0.97)",
                      opacity: isActive ? 1 : 0.7,
                      boxShadow: isActive ? "0 4px 20px rgba(249,115,22,0.15)" : "none",
                    }}>
                      {/* Lock toggle (top-left) */}
                      <div onClick={e=>{e.stopPropagation();
                        if(sp.locked){
                          setPinInput("");setPinError("");setPasswordModal({mode:'unlock-toggle',profileName:sp.name,onSuccess:()=>{const updated=toggleProfileLock(sp.name);setSavedProfiles(updated);setPasswordModal(null);}});
                        } else {
                          const pin=getAdminPin();
                          if(!pin){setPinInput("");setPinError("");setPasswordModal({mode:'setpin',profileName:sp.name,onSuccess:()=>{const updated=toggleProfileLock(sp.name);setSavedProfiles(updated);setPasswordModal(null);}});}
                          else{const updated=toggleProfileLock(sp.name);setSavedProfiles(updated);}
                        }
                      }} style={{
                        position:"absolute",top:6,left:6,width:22,height:22,borderRadius:"50%",
                        background:sp.locked?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.05)",
                        border:`1px solid ${sp.locked?"rgba(99,102,241,0.3)":"rgba(255,255,255,0.1)"}`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,
                        color:sp.locked?"#a5b4fc":"#475569",
                        cursor:"pointer",opacity:sp.locked?0.9:0.4,transition:"all 0.2s",zIndex:2,
                      }} onMouseEnter={e=>{e.currentTarget.style.opacity="1";}}
                         onMouseLeave={e=>{e.currentTarget.style.opacity=sp.locked?"0.9":"0.4";}}
                         title={sp.locked?"Déverrouiller":"Verrouiller"}>{sp.locked?"🔒":"🔓"}</div>
                      {/* Delete button */}
                      {!sp.locked&&<div onClick={e=>{e.stopPropagation();setConfirmModal({message:`Supprimer le profil "${sp.name}" ?`,onConfirm:()=>{const updated=deleteNamedProfile(sp.name);setSavedProfiles(updated);cloudDeleteProfileFn(sp.name);setConfirmModal(null);},onCancel:()=>setConfirmModal(null)});}} style={{
                        position:"absolute",top:6,right:6,width:22,height:22,borderRadius:"50%",
                        background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#ef4444",
                        cursor:"pointer",opacity:0.5,transition:"all 0.2s",zIndex:2,
                      }} onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background="rgba(239,68,68,0.25)";}}
                         onMouseLeave={e=>{e.currentTarget.style.opacity="0.5";e.currentTarget.style.background="rgba(239,68,68,0.1)";}}>🗑</div>}
                      {/* Avatar */}
                      <div style={{width:56,height:56,borderRadius:16,
                        background: isActive 
                          ? "linear-gradient(135deg,rgba(249,115,22,0.35),rgba(239,68,68,0.25))" 
                          : "linear-gradient(135deg,rgba(249,115,22,0.18),rgba(239,68,68,0.12))",
                        border: isActive ? "2px solid rgba(249,115,22,0.5)" : "1px solid rgba(249,115,22,0.2)",
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,
                        color: isActive ? "#f97316" : "#94a3b8",flexShrink:0,transition:"all 0.3s"}}>
                        {sp.name.charAt(0).toUpperCase()}
                      </div>
                      {/* Name */}
                      <div style={{fontSize:15,fontWeight:700,color: isActive ? "#f1f5f9" : "#cbd5e1",lineHeight:1.2,transition:"color 0.3s"}}>{sp.name}</div>
                      {/* Level badge */}
                      {p.level&&<div style={{fontSize:9,fontWeight:600,color:levelColors[p.level]||"#64748b",background:`${levelColors[p.level]||"#64748b"}18`,padding:"2px 10px",borderRadius:10,letterSpacing:"0.03em",textTransform:"uppercase"}}>{p.level}{isJunior?" · Junior":""}</div>}
                      {/* Desc */}
                      {desc&&<div style={{fontSize:10,color:"#64748b",lineHeight:1.3}}>{desc}</div>}
                      {/* Styles */}
                      {stylesStr&&<div style={{fontSize:9,color:"#94a3b8",fontStyle:"italic"}}>{stylesStr}</div>}
                      {/* Injuries */}
                      {injuries.length>0&&<div style={{fontSize:9,color:"#ef4444",opacity:0.8}}>🩹 {injuries.join(", ")}</div>}
                      {/* CTA */}
                      <div style={{marginTop:6,fontSize:10,color: sp.locked ? "#a5b4fc" : isActive ? "#f97316" : "#64748b",fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",transition:"color 0.3s"}}>
                        {sp.locked ? "🔒 Protégé" : isActive ? "▶ Ouvrir" : "Ouvrir →"}
                      </div>
                    </button>
                  );
                })}
                {/* Spacer so last card can center */}
                <div style={{minWidth:`calc(50% - ${CARD_W/2}px)`,flexShrink:0}} aria-hidden="true"/>
              </div>

              {/* Right arrow */}
              {filtered.length>1&&<button onClick={()=>scrollDir("right")} aria-label="Suivant" style={{
                width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",
                color:"#e2e8f0",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                fontFamily:"'Inter',sans-serif",transition:"all 0.2s",backdropFilter:"blur(8px)",
              }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(249,115,22,0.15)";e.currentTarget.style.borderColor="rgba(249,115,22,0.4)";}}
                 onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>›</button>}
            </div>

            {/* Dot indicators — clickable */}
            {filtered.length>1&&<div style={{display:"flex",justifyContent:"center",gap:7,marginTop:10}}>
              {filtered.map((_,i)=><button key={i} onClick={()=>scrollToIdx(i)} aria-label={`Profil ${i+1}`} style={{
                width: i===activeProfileIdx ? 18 : 7,height:7,borderRadius:4,border:"none",cursor:"pointer",padding:0,
                background: i===activeProfileIdx ? "#f97316" : "rgba(255,255,255,0.15)",
                transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)",
              }}/>)}
            </div>}

            {/* Keyboard hint */}
            {filtered.length>1&&<p style={{fontSize:8,color:"#334155",textAlign:"center",marginTop:6,letterSpacing:"0.04em"}}>← → Flèches ou swipe pour naviguer</p>}

            {profileSearch&&filtered.length===0&&<p style={{fontSize:11,color:"#64748b",textAlign:"center",marginTop:8}}>Aucun profil trouvé pour "{profileSearch}"</p>}
          </div>);
        })()}

        {/* New profile button */}
        <button onClick={createNewProfile} style={{
          padding:"14px 28px",background:"linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))",
          border:"1px solid rgba(249,115,22,0.35)",borderRadius:14,color:"#f97316",fontSize:14,fontWeight:700,
          cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.2s ease",letterSpacing:"-0.01em",
          width:"100%",maxWidth:400,
        }}>
          + Nouveau profil
        </button>

        {savedProfiles.length===0&&<p style={{fontSize:11,color:"#475569",marginTop:12,textAlign:"center",lineHeight:1.5}}>
          Crée ton premier profil pour commencer l'analyse
        </p>}

        {/* ============================================================ */}
        {/* MAGAZINE CTA */}
        {/* ============================================================ */}
        <div style={{marginTop:40,width:"100%",maxWidth:500}}>
          <button onClick={()=>{setMagCat("puissance");setMagYear(2026);setMagDetail(null);setMagSlide(0);setScreen("magazine");}} style={{
            width:"100%",padding:"20px 24px",borderRadius:20,cursor:"pointer",
            background:"linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(168,85,247,0.06) 100%)",
            border:"1px solid rgba(249,115,22,0.2)",transition:"all 0.3s",position:"relative",overflow:"hidden",
          }}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:16,fontWeight:800,fontFamily:"'Outfit'",color:"#f1f5f9",letterSpacing:"-0.02em"}}>📰 Tendances &amp; Magazine</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>Top raquettes, fiches techniques, articles</div>
              </div>
              <span style={{fontSize:24,color:"#f97316"}}>→</span>
            </div>
          </button>

          {/* CATALOGUE CTA */}
          <button onClick={()=>{setCatalogSearch("");resetCatFilters();setScreen("catalog");}} style={{
            width:"100%",padding:"20px 24px",borderRadius:20,cursor:"pointer",marginTop:12,
            background:"linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(249,115,22,0.04) 100%)",
            border:"1px solid rgba(34,197,94,0.15)",transition:"all 0.3s",
          }}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:16,fontWeight:800,fontFamily:"'Outfit'",color:"#f1f5f9",letterSpacing:"-0.02em"}}>🔍 Catalogue · {totalDBCount} raquettes</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>Rechercher, explorer, comparer toutes les palas</div>
              </div>
              <span style={{fontSize:24,color:"#22c55e"}}>→</span>
            </div>
          </button>
        </div>

        {familyCode && familyCode !== "LOCAL" && <div style={{marginTop:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:10,color:cloudStatus==="synced"?"#4ade80":cloudStatus==="loading"?"#fbbf24":"#64748b"}}>
            {cloudStatus==="synced"?"☁️ Synchronisé":"☁️ Cloud"} · <span style={{fontFamily:"'Outfit'",fontWeight:700,letterSpacing:"0.1em"}}>{familyCode}</span>
          </span>
          <button onClick={handleCloudLogout} style={{background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"3px 8px",color:"#64748b",fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>⏻</button>
          {isAdmin&&<button onClick={()=>{setAdminTab("families");setScreen("admin");}} style={{background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:6,padding:"3px 8px",color:"#c084fc",fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⚙️ Admin</button>}
        </div>}

        <div style={{marginTop:familyCode&&familyCode!=="LOCAL"?12:40,fontSize:8,color:"#334155",letterSpacing:"0.05em",textAlign:"center"}}>
          <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> V12 · {totalDBCount} raquettes · Scoring hybride calibré
        </div>
      </div>}

      {/* ============================================================ */}
      {/* ADMIN SCREEN */}
      {/* ============================================================ */}
      {screen==="admin"&&(()=>{
        const loadFamilies = async () => {
          setAdminLoading(true);
          try {
            const data = await adminListFamilies(familyCode);
            setAdminFamilies(data||[]);
          } catch(e) { setAdminMsg("Erreur: "+e.message); }
          setAdminLoading(false);
        };
        const loadStats = async () => {
          setAdminLoading(true);
          try {
            const data = await adminGetStats(familyCode);
            setAdminStats(data);
          } catch(e) { setAdminMsg("Erreur: "+e.message); }
          setAdminLoading(false);
        };
        const expandFamily = async (code) => {
          if (adminExpandedFamily === code) { setAdminExpandedFamily(null); return; }
          setAdminExpandedFamily(code);
          try {
            const profiles = await adminLoadFamilyProfiles(familyCode, code);
            setAdminFamilyProfiles(profiles||[]);
          } catch(e) { setAdminFamilyProfiles([]); }
        };
        const handleToggleRacket = async (id) => {
          try {
            const newState = await adminToggleRacket(familyCode, id);
            setAdminMsg(`Raquette ${id}: ${newState ? "activée" : "désactivée"}`);
          } catch(e) { setAdminMsg("Erreur: "+e.message); }
        };
        const handleSaveRacket = async (racket) => {
          setAdminLoading(true);
          try {
            await adminUpsertRacket(familyCode, racket);
            setAdminMsg("✅ Raquette sauvegardée: " + racket.name);
            setAdminEditRacket(null);
          } catch(e) { setAdminMsg("Erreur: "+e.message); }
          setAdminLoading(false);
        };
        const handleImportJSON = async (jsonStr) => {
          try {
            const arr = JSON.parse(jsonStr);
            if (!Array.isArray(arr)) throw new Error("Le JSON doit être un tableau");
            setAdminLoading(true);
            let ok = 0, fail = 0;
            for (const r of arr) {
              try {
                const dbRacket = {
                  id: r.id, name: r.name, short_name: r.shortName||r.short_name,
                  brand: r.brand, shape: r.shape, weight: r.weight, balance: r.balance,
                  surface: r.surface, core: r.core, antivib: r.antivib, price: r.price,
                  player: r.player, image_url: r.imageUrl||r.image_url, year: r.year,
                  category: r.category, scores: r.scores, verdict: r.verdict,
                  editorial: r.editorial, tech_highlights: r.techHighlights||r.tech_highlights,
                  target_profile: r.targetProfile||r.target_profile,
                  junior: r.junior||false, woman_line: r.womanLine||r.woman_line||false,
                  description: r.description, pro_player_info: r.proPlayerInfo||r.pro_player_info,
                  is_active: true
                };
                await adminUpsertRacket(familyCode, dbRacket);
                ok++;
              } catch { fail++; }
            }
            setAdminMsg(`✅ Import: ${ok} OK, ${fail} erreurs sur ${arr.length}`);
          } catch(e) { setAdminMsg("Erreur JSON: "+e.message); }
          setAdminLoading(false);
        };

        // Auto-load on tab change
        if (adminTab === "families" && adminFamilies.length === 0 && !adminLoading) loadFamilies();
        if (adminTab === "stats" && !adminStats && !adminLoading) loadStats();

        // Filtered rackets for admin view
        const allRackets = getMergedDB();
        const filteredRackets = allRackets.filter(r => {
          if (adminRacketSearch && !r.name.toLowerCase().includes(adminRacketSearch.toLowerCase()) && !r.brand.toLowerCase().includes(adminRacketSearch.toLowerCase())) return false;
          if (adminRacketFilter !== "all" && r.brand !== adminRacketFilter) return false;
          return true;
        });
        const brands = [...new Set(allRackets.map(r=>r.brand))].sort();

        const tabStyle = (active) => ({
          padding:"10px 20px", fontSize:12, fontWeight:active?700:500,
          color: active?"#c084fc":"#64748b", background: active?"rgba(168,85,247,0.12)":"transparent",
          border: active?"1px solid rgba(168,85,247,0.3)":"1px solid rgba(255,255,255,0.08)",
          borderRadius:10, cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.2s"
        });

        return (
        <div style={{maxWidth:1020,margin:"0 auto",padding:"20px 16px",animation:"fadeIn 0.4s ease"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>setScreen("home")} style={{background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 12px",color:"#64748b",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>← Accueil</button>
              <h2 style={{fontFamily:"'Outfit'",fontSize:22,fontWeight:800,background:"linear-gradient(135deg,#a855f7,#6366f1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0}}>⚙️ Dashboard Admin</h2>
            </div>
            <span style={{fontSize:10,color:"#64748b"}}>{familyCode} · {allRackets.length} raquettes</span>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            <button onClick={()=>setAdminTab("families")} style={tabStyle(adminTab==="families")}>👥 Familles & Profils</button>
            <button onClick={()=>setAdminTab("rackets")} style={tabStyle(adminTab==="rackets")}>🏓 Raquettes</button>
            <button onClick={()=>{setAdminTab("stats");setAdminStats(null);}} style={tabStyle(adminTab==="stats")}>📊 Statistiques</button>
          </div>

          {/* Status message */}
          {adminMsg&&<div style={{padding:"10px 14px",background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:10,marginBottom:16,fontSize:11,color:"#c084fc",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>{adminMsg}</span>
            <button onClick={()=>setAdminMsg("")} style={{background:"none",border:"none",color:"#c084fc",cursor:"pointer",fontSize:14}}>✕</button>
          </div>}

          {adminLoading&&<div style={{textAlign:"center",padding:20,color:"#64748b",fontSize:12}}>⏳ Chargement...</div>}

          {/* ====== TAB: FAMILIES ====== */}
          {adminTab==="families"&&!adminLoading&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{adminFamilies.length} famille(s)</span>
              <button onClick={()=>{setAdminFamilies([]);}} style={{background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"4px 10px",color:"#64748b",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>🔄 Rafraîchir</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {adminFamilies.map(fam=>(
                <div key={fam.code} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden"}}>
                  <button onClick={()=>expandFamily(fam.code)} style={{width:"100%",padding:"14px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14,fontFamily:"inherit"}}>
                    <div style={{width:40,height:40,borderRadius:12,background:fam.is_admin?"linear-gradient(135deg,rgba(168,85,247,0.3),rgba(99,102,241,0.2))":"rgba(255,255,255,0.05)",border:fam.is_admin?"1px solid rgba(168,85,247,0.4)":"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                      {fam.is_admin?"👑":"👤"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:14,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit'",letterSpacing:"0.08em"}}>{fam.code}</span>
                        {fam.is_admin&&<span style={{fontSize:8,fontWeight:700,color:"#c084fc",background:"rgba(168,85,247,0.15)",padding:"2px 8px",borderRadius:6,textTransform:"uppercase"}}>Admin</span>}
                      </div>
                      <div style={{fontSize:10,color:"#64748b",marginTop:2}}>
                        {fam.profile_count||0} profil(s)
                        {fam.profile_names&&fam.profile_names.length>0&&<span> · {fam.profile_names.join(", ")}</span>}
                      </div>
                      <div style={{fontSize:9,color:"#475569",marginTop:2}}>
                        {fam.last_activity ? `Dernière activité: ${new Date(fam.last_activity).toLocaleDateString('fr-FR')} ${new Date(fam.last_activity).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}` : "Aucune activité"}
                      </div>
                    </div>
                    <span style={{color:"#64748b",fontSize:16,transition:"transform 0.2s",transform:adminExpandedFamily===fam.code?"rotate(90deg)":"rotate(0)"}}>{adminExpandedFamily===fam.code?"▾":"▸"}</span>
                  </button>

                  {/* Expanded: profiles detail */}
                  {adminExpandedFamily===fam.code&&<div style={{padding:"0 18px 14px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                    {adminFamilyProfiles.length===0&&<p style={{fontSize:11,color:"#475569",margin:"10px 0"}}>Aucun profil</p>}
                    {adminFamilyProfiles.map(p=>{
                      const d = p.data||{};
                      return (
                        <div key={p.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:12}}>
                            <div style={{width:32,height:32,borderRadius:10,background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#f97316",flexShrink:0}}>
                              {(p.name||"?").charAt(0).toUpperCase()}
                            </div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{p.name} {p.locked&&"🔒"}</div>
                              <div style={{fontSize:10,color:"#64748b"}}>
                                {d.level||"—"} · {d.hand||"—"} · Côté {d.side||"—"}
                                {d.styleTags&&d.styleTags.length>0&&<span> · {d.styleTags.slice(0,3).join(", ")}</span>}
                              </div>
                            </div>
                            <div style={{display:"flex",gap:4,flexShrink:0}}>
                              <button onClick={()=>setAdminViewProfile(p)} style={{padding:"4px 8px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#64748b",fontSize:9,cursor:"pointer",fontFamily:"inherit"}} title="Coup d'œil">👁</button>
                              <button onClick={()=>{cameFromAdminRef.current=true;setProfile({...INITIAL_PROFILE,...(p.data||{})});setProfileName(p.name);setScreen("dashboard");}} style={{padding:"4px 8px",background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:6,color:"#c084fc",fontSize:9,cursor:"pointer",fontFamily:"inherit"}} title="Entrer dans le profil">✏️</button>
                              <button onClick={async()=>{
                                if(!confirm(`Supprimer le profil "${p.name}" de la famille ${fam.code} ?`)) return;
                                try {
                                  await cloudDeleteProfile(fam.code, p.name);
                                  setAdminMsg(`✅ Profil "${p.name}" supprimé`);
                                  const profiles = await adminLoadFamilyProfiles(familyCode, fam.code);
                                  setAdminFamilyProfiles(profiles||[]);
                                } catch(e) { setAdminMsg("Erreur: "+e.message); }
                              }} style={{padding:"4px 8px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,color:"#ef4444",fontSize:9,cursor:"pointer",fontFamily:"inherit"}} title="Supprimer">🗑</button>
                            </div>
                            <div style={{fontSize:9,color:"#475569"}}>{p.updated_at?new Date(p.updated_at).toLocaleDateString('fr-FR'):""}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>}
                </div>
              ))}
            </div>
          </div>}

          {/* ====== TAB: RACKETS ====== */}
          {adminTab==="rackets"&&!adminLoading&&<div>
            {/* Search + Filter bar */}
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <input value={adminRacketSearch} onChange={e=>setAdminRacketSearch(e.target.value)} placeholder="Rechercher nom ou marque…" style={{flex:"1 1 200px",padding:"8px 12px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#e2e8f0",fontSize:11,fontFamily:"inherit",outline:"none"}}/>
              <select value={adminRacketFilter} onChange={e=>setAdminRacketFilter(e.target.value)} style={{padding:"8px 12px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#e2e8f0",fontSize:11,fontFamily:"inherit",outline:"none"}}>
                <option value="all">Toutes marques</option>
                {brands.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
              <input type="file" accept=".json" ref={adminFileInputRef} style={{display:"none"}} onChange={e=>{
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = ev => { handleImportJSON(ev.target.result); };
                reader.readAsText(file);
                e.target.value = "";
              }}/>
              <button onClick={()=>adminFileInputRef.current?.click()} style={{padding:"8px 14px",background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.25)",borderRadius:8,color:"#4CAF50",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📥 Import JSON</button>
              <button onClick={()=>setAdminEditRacket({id:"",name:"",shortName:"",brand:"",shape:"Ronde",weight:"",balance:"Moyen",surface:"",core:"",antivib:"—",price:"",player:"—",imageUrl:"",year:2025,category:"intermediaire",scores:{Puissance:5,Contrôle:5,Confort:5,Spin:5,Maniabilité:5,Tolérance:5},verdict:"",editorial:"",techHighlights:[],targetProfile:"",junior:false,womanLine:false,proPlayerInfo:null,_isNew:true})} style={{padding:"8px 14px",background:"rgba(168,85,247,0.1)",border:"1px solid rgba(168,85,247,0.25)",borderRadius:8,color:"#c084fc",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>➕ Nouvelle raquette</button>
            </div>

            <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>{filteredRackets.length} raquette(s) affichée(s) sur {allRackets.length}</div>

            {/* Rackets table */}
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {filteredRackets.slice(0,50).map(r=>(
                <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,fontSize:11}}>
                  {r.imageUrl&&<img src={proxyImg(r.imageUrl)} alt="" style={{width:36,height:36,objectFit:"contain",borderRadius:6,background:"rgba(255,255,255,0.05)",flexShrink:0}} onError={e=>{e.target.style.display='none'}}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,color:"#e2e8f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
                    <div style={{fontSize:9,color:"#64748b"}}>{r.brand} · {r.shape} · {r.category} · {r.year}</div>
                  </div>
                  <div style={{fontSize:9,color:"#64748b",flexShrink:0}}>{r.price||"—"}</div>
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    <button onClick={()=>openRacketSheet(r,"admin")} style={{padding:"4px 8px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#64748b",fontSize:9,cursor:"pointer",fontFamily:"inherit"}} title="Voir fiche">📋</button>
                    <button onClick={()=>setAdminEditRacket({...r,scores:{...r.scores},techHighlights:[...(r.techHighlights||[]).map(h=>({...h}))],proPlayerInfo:r.proPlayerInfo?{...r.proPlayerInfo}:null,_isNew:false})} style={{padding:"4px 8px",background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:6,color:"#c084fc",fontSize:9,cursor:"pointer",fontFamily:"inherit"}} title="Éditer">✏️</button>
                    <button onClick={()=>handleToggleRacket(r.id)} style={{padding:"4px 8px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#64748b",fontSize:9,cursor:"pointer",fontFamily:"inherit"}} title="Activer/Désactiver">
                      {r.is_active===false?"🔴":"🟢"}
                    </button>
                  </div>
                </div>
              ))}
              {filteredRackets.length>50&&<p style={{fontSize:10,color:"#475569",textAlign:"center",marginTop:8}}>Affichage limité à 50 — affinez votre recherche</p>}
            </div>
          </div>}

          {/* ====== TAB: STATS ====== */}
          {adminTab==="stats"&&!adminLoading&&adminStats&&<div>
            {/* KPI cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
              {[
                {label:"Familles",value:adminStats.total_families,icon:"👥",color:"#a855f7"},
                {label:"Profils",value:adminStats.total_profiles,icon:"👤",color:"#6366f1"},
                {label:"Raquettes actives",value:adminStats.active_rackets,icon:"🏓",color:"#f97316"},
                {label:"Marques",value:adminStats.brands,icon:"🏷️",color:"#22c55e"},
              ].map(kpi=>(
                <div key={kpi.label} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:24}}>{kpi.icon}</div>
                  <div style={{fontSize:28,fontWeight:800,color:kpi.color,fontFamily:"'Outfit'",margin:"4px 0"}}>{kpi.value}</div>
                  <div style={{fontSize:10,color:"#64748b",fontWeight:500}}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* By category */}
            {adminStats.by_category&&<div style={{marginBottom:20}}>
              <h3 style={{fontSize:13,fontWeight:700,color:"#94a3b8",marginBottom:10}}>Répartition par catégorie</h3>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {Object.entries(adminStats.by_category).sort((a,b)=>b[1]-a[1]).map(([cat,count])=>{
                  const catColors = {debutant:"#22c55e",intermediaire:"#f59e0b",avance:"#ef4444",expert:"#a855f7",junior:"#3b82f6"};
                  return (
                    <div key={cat} style={{padding:"10px 16px",background:`${catColors[cat]||"#64748b"}12`,border:`1px solid ${catColors[cat]||"#64748b"}30`,borderRadius:10,textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:800,color:catColors[cat]||"#64748b",fontFamily:"'Outfit'"}}>{count}</div>
                      <div style={{fontSize:10,color:"#94a3b8",textTransform:"capitalize"}}>{cat}</div>
                    </div>
                  );
                })}
              </div>
            </div>}

            {/* By brand */}
            {adminStats.by_brand&&<div style={{marginBottom:20}}>
              <h3 style={{fontSize:13,fontWeight:700,color:"#94a3b8",marginBottom:10}}>Raquettes par marque</h3>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {Object.entries(adminStats.by_brand).sort((a,b)=>b[1]-a[1]).map(([brand,count])=>{
                  const maxCount = Math.max(...Object.values(adminStats.by_brand));
                  return (
                    <div key={brand} style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:11,color:"#e2e8f0",fontWeight:600,width:100,flexShrink:0}}>{brand}</span>
                      <div style={{flex:1,height:20,background:"rgba(255,255,255,0.03)",borderRadius:6,overflow:"hidden"}}>
                        <div style={{width:`${(count/maxCount)*100}%`,height:"100%",background:"linear-gradient(90deg,rgba(168,85,247,0.3),rgba(99,102,241,0.3))",borderRadius:6,transition:"width 0.5s ease"}}/>
                      </div>
                      <span style={{fontSize:11,color:"#94a3b8",fontWeight:600,width:30,textAlign:"right"}}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>}

            {/* Recent families */}
            {adminStats.recent_families&&<div>
              <h3 style={{fontSize:13,fontWeight:700,color:"#94a3b8",marginBottom:10}}>10 dernières familles actives</h3>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {adminStats.recent_families.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,fontSize:11}}>
                    <span style={{fontFamily:"'Outfit'",fontWeight:700,color:"#e2e8f0",letterSpacing:"0.06em"}}>{f.code}</span>
                    <span style={{color:"#64748b"}}>{f.profiles} profil(s)</span>
                    <span style={{fontSize:9,color:"#475569",marginLeft:"auto"}}>{f.last_activity?new Date(f.last_activity).toLocaleDateString('fr-FR'):""}</span>
                  </div>
                ))}
              </div>
            </div>}
          </div>}


          {/* ====== MODAL: COUP D'ŒIL PROFIL ====== */}
          {adminViewProfile&&(()=>{
            const p = adminViewProfile;
            const d = p.data||{};
            const styles = (d.styleTags||[]).map(id=>STYLE_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            const injuries = (d.injuryTags||[]).filter(t=>t!=="aucune").map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            const priorities = (d.priorityTags||[]).map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            const brands = (d.brandTags||[]).map(id=>BRAND_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            const hand = d.hand||"Droitier";
            const side = d.side||"Droite";
            const isFemme = (d.genre||"Homme")==="Femme";
            const isAttacker = (hand==="Droitier"&&side==="Gauche")||(hand==="Gaucher"&&side==="Droite");
            const role = side==="Les deux" ? (isFemme?"Polyvalente":"Polyvalent") : isAttacker ? (isFemme?"Attaquante":"Attaquant") : (isFemme?"Constructrice":"Constructeur");

            return <div onClick={()=>setAdminViewProfile(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000,animation:"fadeIn 0.2s ease"}}>
              <div onClick={e=>e.stopPropagation()} style={{background:"#111827",border:"1px solid rgba(255,255,255,0.12)",borderRadius:20,padding:"24px 22px",maxWidth:420,width:"92%",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,rgba(249,115,22,0.3),rgba(239,68,68,0.2))",border:"2px solid rgba(249,115,22,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#f97316"}}>{(p.name||"?")[0].toUpperCase()}</div>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit'"}}>{p.name} {p.locked&&"🔒"}</div>
                      <div style={{fontSize:10,color:"#64748b"}}>Famille: {p.family_code} · {role}</div>
                    </div>
                  </div>
                  <button onClick={()=>setAdminViewProfile(null)} style={{background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  {[
                    {label:"Niveau",value:d.level||"—"},
                    {label:"Main",value:hand},
                    {label:"Côté",value:side},
                    {label:"Genre",value:d.genre||"Homme"},
                    {label:"Fréquence",value:d.frequency||"—"},
                    {label:"Compétition",value:d.competition?"Oui":"Non"},
                    {label:"Fitness",value:d.fitness||"—"},
                  ].map(item=>(
                    <div key={item.label} style={{padding:"8px 10px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8}}>
                      <div style={{fontSize:8,color:"#64748b",textTransform:"uppercase",fontWeight:600,letterSpacing:"0.05em"}}>{item.label}</div>
                      <div style={{fontSize:12,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {(d.age||d.height||d.weight)&&<div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                  {d.age&&<span style={{padding:"3px 10px",borderRadius:8,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.15)",color:"#a5b4fc",fontSize:10,fontWeight:600}}>{d.age} ans</span>}
                  {d.height&&<span style={{padding:"3px 10px",borderRadius:8,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.15)",color:"#a5b4fc",fontSize:10,fontWeight:600}}>{d.height} cm</span>}
                  {d.weight&&<span style={{padding:"3px 10px",borderRadius:8,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.15)",color:"#a5b4fc",fontSize:10,fontWeight:600}}>{d.weight} kg</span>}
                </div>}

                {styles.length>0&&<div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Style de jeu</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {styles.map(t=><span key={t} style={{padding:"3px 10px",borderRadius:8,background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.2)",color:"#f97316",fontSize:10,fontWeight:600}}>{t}</span>)}
                  </div>
                </div>}

                {priorities.length>0&&<div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Priorités</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {priorities.map((pr,i)=><span key={pr} style={{padding:"3px 10px",borderRadius:8,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.15)",color:"#fbbf24",fontSize:10,fontWeight:600}}>{i+1}. {pr}</span>)}
                  </div>
                </div>}

                {injuries.length>0&&<div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Blessures</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {injuries.map(inj=><span key={inj} style={{padding:"3px 10px",borderRadius:8,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",color:"#f87171",fontSize:10,fontWeight:600}}>{inj}</span>)}
                  </div>
                </div>}

                {brands.length>0&&<div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Marques préférées</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {brands.map(b=><span key={b} style={{padding:"3px 10px",borderRadius:8,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",color:"#c084fc",fontSize:10,fontWeight:600}}>{b}</span>)}
                  </div>
                </div>}

                {d.expertToucher&&<div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Préférences Expert</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {d.expertToucher&&<span style={{padding:"3px 10px",borderRadius:8,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",color:"#c084fc",fontSize:10,fontWeight:600}}>Toucher: {d.expertToucher}</span>}
                    {d.expertReactivite&&<span style={{padding:"3px 10px",borderRadius:8,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",color:"#c084fc",fontSize:10,fontWeight:600}}>Réactivité: {d.expertReactivite}</span>}
                    {d.expertPoids&&<span style={{padding:"3px 10px",borderRadius:8,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",color:"#c084fc",fontSize:10,fontWeight:600}}>Poids: {d.expertPoids}</span>}
                    {d.expertForme&&<span style={{padding:"3px 10px",borderRadius:8,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",color:"#c084fc",fontSize:10,fontWeight:600}}>Forme: {d.expertForme}</span>}
                  </div>
                </div>}

                <div style={{fontSize:8,color:"#475569",textAlign:"center",marginTop:12}}>
                  Créé le {p.created_at?new Date(p.created_at).toLocaleDateString('fr-FR'):"—"} · Modifié le {p.updated_at?new Date(p.updated_at).toLocaleDateString('fr-FR'):"—"}
                </div>
              </div>
            </div>;
          })()}

          {/* ====== MODAL: EDIT / CREATE RACKET FORM ====== */}
          {adminEditRacket&&(()=>{
            const r = adminEditRacket;
            const setR = (field, val) => setAdminEditRacket(prev => ({...prev, [field]: val}));
            const setScore = (key, val) => setAdminEditRacket(prev => ({...prev, scores: {...prev.scores, [key]: parseFloat(val)||0}}));
            const addTH = () => setAdminEditRacket(prev => ({...prev, techHighlights: [...(prev.techHighlights||[]), {label:"",value:"",detail:""}]}));
            const updateTH = (idx, field, val) => setAdminEditRacket(prev => {
              const ths = [...(prev.techHighlights||[])];
              ths[idx] = {...ths[idx], [field]: val};
              return {...prev, techHighlights: ths};
            });
            const removeTH = (idx) => setAdminEditRacket(prev => ({...prev, techHighlights: (prev.techHighlights||[]).filter((_,i)=>i!==idx)}));

            const inputSt = {width:"100%",padding:"8px 10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,color:"#e2e8f0",fontSize:11,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
            const labelSt = {fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:3,display:"block"};
            const selectSt = {...inputSt, appearance:"auto"};

            const handleSave = () => {
              if(!r.id || !r.name || !r.brand) { setAdminMsg("⚠️ ID, Nom et Marque sont obligatoires"); return; }
              const dbRacket = {
                id: r.id, name: r.name, short_name: r.shortName||"",
                brand: r.brand, shape: r.shape, weight: r.weight, balance: r.balance,
                surface: r.surface, core: r.core, antivib: r.antivib, price: r.price,
                player: r.player, image_url: r.imageUrl, year: r.year,
                category: r.category, scores: r.scores, verdict: r.verdict,
                editorial: r.editorial, tech_highlights: r.techHighlights,
                target_profile: r.targetProfile,
                junior: r.junior||false, woman_line: r.womanLine||false,
                pro_player_info: r.proPlayerInfo,
                is_active: true
              };
              handleSaveRacket(dbRacket);
            };

            return <div onClick={()=>setAdminEditRacket(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000,animation:"fadeIn 0.2s ease"}}>
              <div onClick={e=>e.stopPropagation()} style={{background:"#111827",border:"1px solid rgba(168,85,247,0.25)",borderRadius:20,padding:"22px 20px",maxWidth:560,width:"94%",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}}>
                {/* Header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h3 style={{fontFamily:"'Outfit'",fontSize:17,fontWeight:800,color:"#c084fc",margin:0}}>{r._isNew?"➕ Nouvelle raquette":"✏️ Éditer raquette"}</h3>
                  <button onClick={()=>setAdminEditRacket(null)} style={{background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
                </div>

                {/* Identité */}
                <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Identité</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  <div><label style={labelSt}>ID *</label><input value={r.id} onChange={e=>setR("id",e.target.value)} placeholder="marque-modele-annee" style={inputSt} disabled={!r._isNew}/></div>
                  <div><label style={labelSt}>Nom complet *</label><input value={r.name} onChange={e=>setR("name",e.target.value)} placeholder="Bullpadel Vertex 04 2025" style={inputSt}/></div>
                  <div><label style={labelSt}>Nom court</label><input value={r.shortName||""} onChange={e=>setR("shortName",e.target.value)} placeholder="Vertex 04" style={inputSt}/></div>
                  <div><label style={labelSt}>Marque *</label><input value={r.brand} onChange={e=>setR("brand",e.target.value)} placeholder="Bullpadel" style={inputSt}/></div>
                  <div><label style={labelSt}>Année</label><input type="number" value={r.year||2025} onChange={e=>setR("year",parseInt(e.target.value)||2025)} style={inputSt}/></div>
                  <div><label style={labelSt}>Catégorie</label>
                    <select value={r.category} onChange={e=>setR("category",e.target.value)} style={selectSt}>
                      <option value="debutant">Débutant</option>
                      <option value="intermediaire">Intermédiaire</option>
                      <option value="avance">Avancé</option>
                      <option value="expert">Expert</option>
                      <option value="junior">Junior</option>
                    </select>
                  </div>
                </div>

                {/* Specs techniques */}
                <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Spécifications</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                  <div><label style={labelSt}>Forme</label>
                    <select value={r.shape} onChange={e=>setR("shape",e.target.value)} style={selectSt}>
                      <option value="Ronde">Ronde</option>
                      <option value="Diamant">Diamant</option>
                      <option value="Goutte d'eau">Goutte d'eau</option>
                      <option value="Hybride">Hybride</option>
                    </select>
                  </div>
                  <div><label style={labelSt}>Poids</label><input value={r.weight} onChange={e=>setR("weight",e.target.value)} placeholder="360-370g" style={inputSt}/></div>
                  <div><label style={labelSt}>Balance</label>
                    <select value={r.balance} onChange={e=>setR("balance",e.target.value)} style={selectSt}>
                      <option value="Bas">Bas</option>
                      <option value="Moyen">Moyen</option>
                      <option value="Haut">Haut</option>
                    </select>
                  </div>
                  <div><label style={labelSt}>Surface</label><input value={r.surface} onChange={e=>setR("surface",e.target.value)} placeholder="Carbon 3K" style={inputSt}/></div>
                  <div><label style={labelSt}>Noyau</label><input value={r.core} onChange={e=>setR("core",e.target.value)} placeholder="HR3 Core" style={inputSt}/></div>
                  <div><label style={labelSt}>Anti-vib</label><input value={r.antivib||""} onChange={e=>setR("antivib",e.target.value)} placeholder="CTS" style={inputSt}/></div>
                  <div><label style={labelSt}>Prix</label><input value={r.price} onChange={e=>setR("price",e.target.value)} placeholder="180-250€" style={inputSt}/></div>
                  <div><label style={labelSt}>Joueur pro</label><input value={r.player||""} onChange={e=>setR("player",e.target.value)} placeholder="Lebron" style={inputSt}/></div>
                  <div><label style={labelSt}>Image URL</label><input value={r.imageUrl||""} onChange={e=>setR("imageUrl",e.target.value)} placeholder="https://..." style={inputSt}/></div>
                </div>

                {/* Flags */}
                <div style={{display:"flex",gap:16,marginBottom:14}}>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#94a3b8",cursor:"pointer"}}>
                    <input type="checkbox" checked={r.junior||false} onChange={e=>setR("junior",e.target.checked)}/> Junior
                  </label>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#94a3b8",cursor:"pointer"}}>
                    <input type="checkbox" checked={r.womanLine||false} onChange={e=>setR("womanLine",e.target.checked)}/> Ligne femme
                  </label>
                </div>

                {/* Scores */}
                <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Scores /10</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                  {["Puissance","Contrôle","Confort","Spin","Maniabilité","Tolérance"].map(attr=>(
                    <div key={attr}>
                      <label style={labelSt}>{attr}</label>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <input type="range" min="0" max="10" step="0.1" value={r.scores[attr]||5} onChange={e=>setScore(attr,e.target.value)} style={{flex:1,accentColor:"#f97316"}}/>
                        <span style={{fontSize:12,fontWeight:700,color:"#f97316",fontFamily:"'Outfit'",width:28,textAlign:"right"}}>{(r.scores[attr]||5).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verdict + Editorial */}
                <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Contenu éditorial</div>
                <div style={{marginBottom:10}}>
                  <label style={labelSt}>Verdict (résumé court)</label>
                  <textarea value={r.verdict||""} onChange={e=>setR("verdict",e.target.value)} rows={2} placeholder="Résumé en 1-2 phrases..." style={{...inputSt,resize:"vertical"}}/>
                </div>
                <div style={{marginBottom:10}}>
                  <label style={labelSt}>Éditorial (texte détaillé)</label>
                  <textarea value={r.editorial||""} onChange={e=>setR("editorial",e.target.value)} rows={4} placeholder="Analyse détaillée style magazine..." style={{...inputSt,resize:"vertical"}}/>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={labelSt}>Profil cible</label>
                  <textarea value={r.targetProfile||""} onChange={e=>setR("targetProfile",e.target.value)} rows={2} placeholder="Cette raquette s'adresse à..." style={{...inputSt,resize:"vertical"}}/>
                </div>

                {/* Pro Player Info */}
                <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Joueur Pro associé</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  <div><label style={labelSt}>Nom joueur</label><input value={r.proPlayerInfo?.name||""} onChange={e=>setR("proPlayerInfo",{...(r.proPlayerInfo||{}),name:e.target.value||undefined})} placeholder="Agustin Tapia" style={inputSt}/></div>
                  <div><label style={labelSt}>Classement</label><input value={r.proPlayerInfo?.rank||""} onChange={e=>setR("proPlayerInfo",{...(r.proPlayerInfo||{}),rank:e.target.value||undefined})} placeholder="#1 WPT" style={inputSt}/></div>
                </div>

                {/* Tech Highlights */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#c084fc",textTransform:"uppercase",letterSpacing:"0.05em"}}>Tech Highlights</div>
                  <button onClick={addTH} style={{padding:"3px 10px",background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.2)",borderRadius:6,color:"#4CAF50",fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Ajouter</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                  {(r.techHighlights||[]).map((th,idx)=>(
                    <div key={idx} style={{padding:"10px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10}}>
                      <div style={{display:"flex",gap:6,marginBottom:6}}>
                        <div style={{flex:1}}><input value={th.label} onChange={e=>updateTH(idx,"label",e.target.value)} placeholder="Label (ex: Surface)" style={{...inputSt,fontSize:10}}/></div>
                        <div style={{flex:1}}><input value={th.value} onChange={e=>updateTH(idx,"value",e.target.value)} placeholder="Valeur (ex: Carbon 18K)" style={{...inputSt,fontSize:10}}/></div>
                        <button onClick={()=>removeTH(idx)} style={{padding:"4px 8px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,color:"#ef4444",fontSize:10,cursor:"pointer"}}>✕</button>
                      </div>
                      <input value={th.detail||""} onChange={e=>updateTH(idx,"detail",e.target.value)} placeholder="Détail technique..." style={{...inputSt,fontSize:10}}/>
                    </div>
                  ))}
                  {(!r.techHighlights||r.techHighlights.length===0)&&<p style={{fontSize:10,color:"#475569",textAlign:"center",margin:"4px 0"}}>Aucun tech highlight. Cliquez + pour ajouter.</p>}
                </div>

                {/* Actions */}
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setAdminEditRacket(null)} style={{flex:1,padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit'",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#94a3b8"}}>Annuler</button>
                  <button onClick={handleSave} style={{flex:1,padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit'",background:"rgba(168,85,247,0.15)",border:"1px solid rgba(168,85,247,0.4)",color:"#c084fc"}}>💾 {r._isNew?"Créer":"Sauvegarder"}</button>
                </div>
              </div>
            </div>;
          })()}

          {/* Footer */}
          <div style={{fontSize:7,color:"#334155",letterSpacing:"0.05em",textAlign:"center",marginTop:24}}>
            <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> Admin Dashboard · {allRackets.length} raquettes
          </div>
        </div>
        );
      })()}

      {/* ============================================================ */}
      {/* MAGAZINE SCREEN — Full-page premium Tendances */}
      {/* ============================================================ */}
      {screen==="magazine"&&(()=>{
        const catIdx = MAGAZINE_CATEGORIES.findIndex(c=>c.id===magCat);
        const catInfo = MAGAZINE_CATEGORIES[catIdx];
        const top5 = getTopByCategory(magCat, magYear);
        const prevCat = ()=>{const i=(catIdx-1+MAGAZINE_CATEGORIES.length)%MAGAZINE_CATEGORIES.length; setMagCat(MAGAZINE_CATEGORIES[i].id); setMagDetail(null); setMagSlide(0);};
        const nextCat = ()=>{const i=(catIdx+1)%MAGAZINE_CATEGORIES.length; setMagCat(MAGAZINE_CATEGORIES[i].id); setMagDetail(null); setMagSlide(0);};

        const getScore = (r)=>{
          if(!r) return "—";
          if(catInfo?.attr) return (r.scores||{})[catInfo.attr]||0;
          return (r._sortScore||0).toFixed(1);
        };

        const medals = ["🥇","🥈","🥉","4","5"];

        // ========== BLUEPRINT TECH DETAIL VIEW ==========
        if(magDetail) {
          const r = magDetail;
          const sc = r.scores||{};
          const ths = r.techHighlights||[];
          const leftThs = ths.filter((_,i)=>i%2===0);
          const rightThs = ths.filter((_,i)=>i%2===1);

          return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",padding:"0 14px",maxWidth:540,margin:"0 auto",fontFamily:"'Inter',sans-serif"}}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0 10px"}}>
              <button onClick={()=>setMagDetail(null)} style={{background:"none",border:"none",color:"#f97316",fontSize:13,cursor:"pointer",fontWeight:700,fontFamily:"'Outfit'"}}>{"← Top 5"}</button>
              <span style={{fontSize:10,color:"#475569",fontFamily:"'Outfit'"}}>{catInfo?.label}</span>
            </div>

            {/* Name + brand */}
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:22,fontWeight:900,fontFamily:"'Outfit'",color:"#f1f5f9",letterSpacing:"-0.02em"}}>{r.shortName||r.name}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>{r.brand} · {r.shape} · {r.weight} · {r.year}</div>
              {r.proPlayerInfo?.name&&<div style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:6,padding:"3px 12px",borderRadius:16,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)"}}>
                <span style={{fontSize:10,color:"#a855f7",fontWeight:700}}>{"🎾"} {r.proPlayerInfo.name}</span>
              </div>}
            </div>

            {/* === BLUEPRINT ZONE: image center + annotations sides === */}
            <div style={{display:"flex",alignItems:"stretch",gap:0,marginBottom:12,position:"relative"}}>
              {/* Left annotations */}
              <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:8,paddingRight:8}}>
                {leftThs.map((h,i)=>(
                  <div key={i} style={{
                    padding:"8px 10px",borderRadius:10,textAlign:"right",
                    background:"rgba(255,255,255,0.03)",border:"1px solid rgba(249,115,22,0.1)",
                    borderRight:"2px solid rgba(249,115,22,0.3)",
                  }}>
                    <div style={{fontSize:10,color:"#e2e8f0",fontWeight:800,fontFamily:"'Outfit'"}}>{h.value}</div>
                    <div style={{fontSize:8,color:"#f97316",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.03em",marginTop:1}}>{h.label}</div>
                    <p style={{fontSize:8,color:"#64748b",margin:"3px 0 0",lineHeight:1.4}}>{h.detail}</p>
                  </div>
                ))}
              </div>

              {/* Center: Image + Score */}
              <div style={{width:140,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <div style={{position:"absolute",width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
                {r.imageUrl?<img src={r.imageUrl} alt={r.name} style={{width:120,height:120,objectFit:"contain",position:"relative",zIndex:1,filter:"drop-shadow(0 6px 20px rgba(0,0,0,0.4))"}} onError={e=>{e.target.style.display="none"}}/>
                :<div style={{width:100,height:100,borderRadius:"50%",background:"rgba(249,115,22,0.06)",border:"2px dashed rgba(249,115,22,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>{"🏸"}</div>}
                <div style={{marginTop:8,padding:"4px 16px",borderRadius:16,background:"rgba(8,12,20,0.9)",border:"2px solid rgba(249,115,22,0.35)",backdropFilter:"blur(8px)",zIndex:2}}>
                  <span style={{fontSize:26,fontWeight:900,color:"#f97316",fontFamily:"'Outfit'"}}>{getScore(r)}</span>
                  <span style={{fontSize:9,color:"#94a3b8"}}>/10</span>
                </div>
              </div>

              {/* Right annotations */}
              <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:8,paddingLeft:8}}>
                {rightThs.map((h,i)=>(
                  <div key={i} style={{
                    padding:"8px 10px",borderRadius:10,textAlign:"left",
                    background:"rgba(255,255,255,0.03)",border:"1px solid rgba(249,115,22,0.1)",
                    borderLeft:"2px solid rgba(249,115,22,0.3)",
                  }}>
                    <div style={{fontSize:10,color:"#e2e8f0",fontWeight:800,fontFamily:"'Outfit'"}}>{h.value}</div>
                    <div style={{fontSize:8,color:"#f97316",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.03em",marginTop:1}}>{h.label}</div>
                    <p style={{fontSize:8,color:"#64748b",margin:"3px 0 0",lineHeight:1.4}}>{h.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro player context */}
            {r.proPlayerInfo?.context&&<div style={{textAlign:"center",marginBottom:10}}>
              <p style={{fontSize:9,color:"#94a3b8",fontStyle:"italic",margin:0}}>{r.proPlayerInfo.context}</p>
            </div>}

            {/* Editorial */}
            {r.editorial&&<div style={{position:"relative",padding:"16px 18px 16px 28px",margin:"0 0 12px",background:"linear-gradient(135deg, rgba(249,115,22,0.04) 0%, rgba(168,85,247,0.02) 100%)",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{position:"absolute",top:6,left:10,fontSize:32,color:"rgba(249,115,22,0.12)",fontFamily:"Georgia",lineHeight:1}}>{"\u201C"}</div>
              <p style={{fontSize:12,color:"#e2e8f0",lineHeight:1.8,margin:0,fontStyle:"italic"}}>{r.editorial}</p>
            </div>}

            {/* Target profile (dynamic when profile active) */}
            {(()=>{
              const dynText = profileName ? generateDynamicTargetProfile(r, {...profile, _name: profileName}) : null;
              const text = dynText || r.targetProfile;
              if (!text) return null;
              const isDyn = !!dynText;
              return <div style={{padding:"10px 14px",background:isDyn?"rgba(249,115,22,0.05)":"rgba(76,175,80,0.05)",borderRadius:12,border:`1px solid ${isDyn?"rgba(249,115,22,0.12)":"rgba(76,175,80,0.12)"}`,marginBottom:12}}>
                <div style={{fontSize:8,color:isDyn?"#f97316":"#4CAF50",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{isDyn?`🎯 POUR ${(profileName||"toi").toUpperCase()}`:"🎯 CETTE RAQUETTE S\u2019ADRESSE \u00C0"}</div>
                <p style={{fontSize:11,color:"#cbd5e1",lineHeight:1.6,margin:0}}>{safeBold(text, "#f1f5f9")}</p>
              </div>;
            })()}

            {/* Scores — 2 rows of 3 */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:12}}>
              {ATTRS.map(a=>{
                const val = sc[a]||0;
                const isH = catInfo?.attr===a;
                return <div key={a} style={{textAlign:"center",padding:"8px 4px",borderRadius:10,background:isH?"rgba(249,115,22,0.08)":"rgba(255,255,255,0.02)",border:`1px solid ${isH?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.04)"}`}}>
                  <div style={{fontSize:20,fontWeight:900,color:val>=8?"#4CAF50":val>=6?"#e2e8f0":"#f97316",fontFamily:"'Outfit'"}}>{val}</div>
                  <div style={{fontSize:8,color:isH?"#f97316":"#64748b",fontWeight:isH?700:500,marginTop:1}}>{a}</div>
                </div>;
              })}
            </div>

            {/* Specs pills */}
            <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:20}}>
              {[["\u2696\uFE0F",r.balance],["\uD83D\uDCB0",r.price]].map(([icon,v])=>
                v&&v!=="\u2014"&&<span key={icon} style={{fontSize:9,padding:"4px 12px",borderRadius:8,background:"rgba(255,255,255,0.04)",color:"#94a3b8"}}>{icon} {v}</span>
              )}
            </div>
          </div>;
        }

        // ========== SLIDES VIEW — Full-screen swipable Top 5 ==========
        const currentR = top5[magSlide] || null;
        const cSc = currentR?.scores || {};
        const prevSlide = ()=>setMagSlide(s=>(s-1+top5.length)%top5.length);
        const nextSlide = ()=>setMagSlide(s=>(s+1)%top5.length);

        return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",fontFamily:"'Inter',sans-serif",position:"relative",overflow:"hidden"}}
          onTouchStart={e=>{e.currentTarget._touchX=e.touches[0].clientX;}}
          onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-(e.currentTarget._touchX||0); if(Math.abs(dx)>50){dx<0?nextSlide():prevSlide();}}}>

          {/* Top bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px 4px",zIndex:10}}>
            <button onClick={()=>{setScreen("home");setMagDetail(null);setMagSlide(0);}} style={{background:"none",border:"none",color:"#64748b",fontSize:12,cursor:"pointer",fontFamily:"'Outfit'",fontWeight:600}}>← Accueil</button>
            <div style={{display:"flex",gap:4}}>
              {[2026,2025].map(y=>(
                <button key={y} onClick={()=>{setMagYear(y);setMagSlide(0);}} style={{
                  padding:"3px 12px",borderRadius:14,fontSize:10,fontWeight:magYear===y?700:500,cursor:"pointer",fontFamily:"'Inter'",
                  background:magYear===y?"rgba(249,115,22,0.15)":"transparent",
                  border:`1px solid ${magYear===y?"rgba(249,115,22,0.3)":"rgba(255,255,255,0.08)"}`,
                  color:magYear===y?"#f97316":"#64748b",transition:"all 0.2s",
                }}>{y}</button>
              ))}
            </div>
          </div>

          {/* Category navigator */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"4px 0 8px"}}>
            <button onClick={prevCat} style={{background:"none",border:"none",color:"#f97316",fontSize:22,cursor:"pointer",padding:"4px 8px",fontWeight:300}}>‹</button>
            <div style={{textAlign:"center",minWidth:200}}>
              <div style={{fontSize:24,fontWeight:900,fontFamily:"'Outfit'",color:"#f1f5f9",letterSpacing:"-0.02em"}}>{catInfo?.label}</div>
              <div style={{fontSize:10,color:"#64748b",fontStyle:"italic",marginTop:1}}>{catInfo?.desc}</div>
            </div>
            <button onClick={nextCat} style={{background:"none",border:"none",color:"#f97316",fontSize:22,cursor:"pointer",padding:"4px 8px",fontWeight:300}}>›</button>
          </div>

          {/* Category dots */}
          <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:10}}>
            {MAGAZINE_CATEGORIES.map((c,i)=>(
              <button key={c.id} onClick={()=>{setMagCat(c.id);setMagDetail(null);setMagSlide(0);}} style={{
                width:i===catIdx?20:6,height:6,borderRadius:3,cursor:"pointer",transition:"all 0.3s",border:"none",
                background:i===catIdx?"#f97316":"rgba(255,255,255,0.12)",
              }}/>
            ))}
          </div>

          {!top5.length&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <p style={{color:"#475569",fontSize:13,textAlign:"center"}}>Aucune raquette {magYear}</p>
          </div>}

          {/* ===== CURRENT SLIDE ===== */}
          {currentR&&<div style={{flex:1,display:"flex",flexDirection:"column",padding:"0 16px",maxWidth:520,margin:"0 auto",width:"100%",animation:"fadeIn 0.35s ease"}}>

            {/* Rank badge + navigation arrows */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <button onClick={prevSlide} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#94a3b8",fontSize:16,cursor:"pointer",padding:"6px 14px",fontWeight:300}}>‹</button>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:magSlide<3?36:22}}>{magSlide<3?medals[magSlide]:""}</div>
                {magSlide>=3&&<span style={{fontSize:14,fontWeight:800,color:"#475569",background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"4px 12px"}}>#{magSlide+1}</span>}
              </div>
              <button onClick={nextSlide} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#94a3b8",fontSize:16,cursor:"pointer",padding:"6px 14px",fontWeight:300}}>›</button>
            </div>

            {/* Slide dots */}
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:12}}>
              {top5.map((_,i)=>(
                <button key={i} onClick={()=>setMagSlide(i)} style={{
                  width:i===magSlide?24:8,height:8,borderRadius:4,cursor:"pointer",transition:"all 0.3s",border:"none",
                  background:i===magSlide?"#f97316":i<3?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.1)",
                }}/>
              ))}
            </div>

            {/* Racket image + name + score */}
            <div onClick={()=>setMagDetail(currentR)} style={{cursor:"pointer",textAlign:"center",marginBottom:10}}>
              {currentR.imageUrl&&<img src={currentR.imageUrl} alt={currentR.name} style={{
                width:140,height:140,objectFit:"contain",margin:"0 auto",display:"block",
                filter:"drop-shadow(0 8px 24px rgba(249,115,22,0.15))",transition:"transform 0.3s",
              }} onError={e=>{e.target.style.display="none";}}/>}
              <div style={{fontSize:22,fontWeight:900,fontFamily:"'Outfit'",color:"#f1f5f9",marginTop:10,letterSpacing:"-0.02em"}}>{currentR.shortName||currentR.name}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>{currentR.brand} · {currentR.shape} · {currentR.weight}</div>
              {currentR.price&&<div style={{fontSize:10,color:"#64748b",marginTop:2}}>{currentR.price}</div>}
            </div>

            {/* BIG score */}
            <div style={{textAlign:"center",marginBottom:12}}>
              <span style={{
                fontSize:48,fontWeight:900,fontFamily:"'Outfit'",letterSpacing:"-0.04em",
                background:"linear-gradient(135deg, #f97316 0%, #fb923c 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              }}>{getScore(currentR)}</span>
              <span style={{fontSize:14,color:"#64748b",marginLeft:2}}>/10</span>
            </div>

            {/* Pro player */}
            {currentR.proPlayerInfo?.name&&<div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginBottom:10}}>
              <span style={{fontSize:10,color:"#a855f7",fontWeight:700,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:20,padding:"3px 12px"}}>🎾 {currentR.proPlayerInfo.name}</span>
            </div>}

            {/* Editorial excerpt */}
            {currentR.editorial&&<div style={{position:"relative",padding:"14px 16px 14px 28px",background:"rgba(255,255,255,0.03)",borderRadius:14,marginBottom:10,border:"1px solid rgba(255,255,255,0.05)"}}>
              <div style={{position:"absolute",top:6,left:10,fontSize:24,color:"rgba(249,115,22,0.2)",fontFamily:"Georgia"}}>“</div>
              <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.7,margin:0,fontStyle:"italic"}}>{currentR.editorial.length>200?currentR.editorial.substring(0,200)+"…":currentR.editorial}</p>
            </div>}

            {/* Scores compact */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:10}}>
              {ATTRS.map(a=>{
                const val = cSc[a]||0;
                const isH = catInfo?.attr===a;
                return <div key={a} style={{textAlign:"center",padding:"6px 4px",borderRadius:8,background:isH?"rgba(249,115,22,0.08)":"rgba(255,255,255,0.02)",border:isH?"1px solid rgba(249,115,22,0.2)":"1px solid transparent"}}>
                  <div style={{fontSize:18,fontWeight:900,color:val>=8?"#4CAF50":val>=6?"#e2e8f0":"#f97316",fontFamily:"'Outfit'"}}>{val}</div>
                  <div style={{fontSize:7,color:isH?"#f97316":"#64748b",fontWeight:isH?700:500}}>{a}</div>
                </div>;
              })}
            </div>

            {/* CTA see full detail */}
            <button onClick={()=>openRacketSheet(currentR,"magazine")} style={{
              width:"100%",padding:"12px",borderRadius:14,cursor:"pointer",marginBottom:16,
              background:"linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(168,85,247,0.06) 100%)",
              border:"1px solid rgba(249,115,22,0.2)",color:"#f97316",fontSize:12,fontWeight:700,fontFamily:"'Outfit'",
              transition:"all 0.2s",
            }}>Voir la fiche technique complète →</button>

          </div>}

          {/* Footer */}
          <div style={{textAlign:"center",padding:"8px 0 16px"}}>
            <div style={{fontSize:8,color:"#334155",letterSpacing:"0.05em"}}>
              <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> Magazine · {totalDBCount} raquettes
            </div>
          </div>
        </div>;
      })()}


      {/* ============================================================ */}
      {/* CATALOG SCREEN — Browse & Search all rackets */}
      {/* ============================================================ */}
      {screen==="catalog"&&(()=>{
        const allDB = getMergedDB();
        const term = catalogSearch.toLowerCase().trim();
        
        // Get unique values sorted
        const allBrands = [...new Set(allDB.map(r=>r.brand))].sort();
        const allCats = ["debutant","intermediaire","avance","expert"];
        const catLabels = {debutant:"Débutant",intermediaire:"Intermédiaire",avance:"Avancé",expert:"Expert"};
        const allShapes = [...new Set(allDB.map(r=>r.shape).filter(Boolean))].sort();
        const allYears = [...new Set(allDB.map(r=>r.year).filter(Boolean))].sort((a,b)=>b-a);
        const PRICE_RANGES = [{label:"< 100€",max:100},{label:"< 200€",max:200},{label:"< 300€",max:300},{label:"Tous",max:0}];
        
        // Parse price helper
        const parsePrice = (p) => { if(!p) return 0; const m=String(p).match(/(\d+)/); return m?Number(m[1]):0; };
        
        // Filter
        const {brands:fBrands, cats:fCats, shapes:fShapes, years:fYears, priceMax:fPrice} = catFilters;
        const hasFilters = fBrands.length>0 || fCats.length>0 || fShapes.length>0 || fYears.length>0 || fPrice>0 || term;
        
        const filtered = allDB.filter(r => {
          if (term && !((r.name||"").toLowerCase().includes(term) || (r.brand||"").toLowerCase().includes(term) || (r.shortName||"").toLowerCase().includes(term))) return false;
          if (fBrands.length>0 && !fBrands.includes(r.brand)) return false;
          if (fCats.length>0 && !fCats.includes(r.category)) return false;
          if (fShapes.length>0 && !fShapes.includes(r.shape)) return false;
          if (fYears.length>0 && !fYears.includes(r.year)) return false;
          if (fPrice>0 && parsePrice(r.price)>fPrice) return false;
          return true;
        });
        
        // Group by brand
        const byBrand = {};
        filtered.forEach(r => { if(!byBrand[r.brand]) byBrand[r.brand]=[]; byBrand[r.brand].push(r); });
        Object.values(byBrand).forEach(arr => arr.sort((a,b) => (b.year||0)-(a.year||0) || a.name.localeCompare(b.name)));
        const sortedBrands = Object.keys(byBrand).sort();
        
        const avgScore = (r) => {
          const sc = r.scores||{};
          const vals = ATTRS.map(a=>sc[a]||0);
          return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : "—";
        };
        
        const catColor = (c) => c==="expert"?"#f97316":c==="avance"?"#a855f7":c==="intermediaire"?"#3b82f6":"#22c55e";
        
        // Filter chip style helper
        const chipSt = (active, color="#f97316") => ({
          padding:"4px 12px",borderRadius:16,fontSize:10,fontWeight:active?700:500,cursor:"pointer",
          background:active?`${color}15`:"rgba(255,255,255,0.03)",
          border:`1px solid ${active?color+"40":"rgba(255,255,255,0.08)"}`,
          color:active?color:"#64748b",transition:"all 0.15s",fontFamily:"'Inter'",whiteSpace:"nowrap",
        });
        
        const activeCount = fBrands.length + fCats.length + fShapes.length + fYears.length + (fPrice>0?1:0);

        return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",fontFamily:"'Inter',sans-serif",animation:"fadeIn 0.3s ease",maxWidth:600,margin:"0 auto",padding:"0 12px"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0 10px"}}>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#f97316",fontSize:13,cursor:"pointer",fontWeight:700,fontFamily:"'Outfit'"}}>← Accueil</button>
            <span style={{fontSize:11,color:"#64748b",fontFamily:"'Outfit'",fontWeight:600}}>{filtered.length} / {allDB.length} raquettes</span>
          </div>
          
          {/* Title */}
          <div style={{textAlign:"center",marginBottom:16}}>
            <h1 style={{fontSize:26,fontWeight:900,fontFamily:"'Outfit'",color:"#f1f5f9",margin:"0 0 4px",letterSpacing:"-0.02em"}}>🔍 Catalogue</h1>
            <p style={{fontSize:11,color:"#64748b",margin:0}}>Explore {totalDBCount} raquettes · {allBrands.length} marques</p>
          </div>
          
          {/* Search bar */}
          <div style={{position:"relative",marginBottom:12}}>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:14,opacity:0.4}}>🔎</span>
            <input 
              type="text" value={catalogSearch} 
              onChange={e=>setCatalogSearch(e.target.value)}
              placeholder="Rechercher par nom..."
              style={{width:"100%",padding:"12px 14px 12px 40px",borderRadius:14,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#e2e8f0",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
            />
            {catalogSearch&&<button onClick={()=>setCatalogSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",fontSize:16,cursor:"pointer"}}>✕</button>}
          </div>
          
          {/* ===== FILTER SECTION ===== */}
          <div style={{marginBottom:16,background:"rgba(255,255,255,0.02)",borderRadius:14,border:"1px solid rgba(255,255,255,0.06)",padding:"10px 12px"}}>
            
            {/* Niveau */}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Niveau</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {allCats.map(c=>(
                  <button key={c} onClick={()=>toggleCatFilter("cats",c)} style={chipSt(fCats.includes(c), catColor(c))}>{catLabels[c]}</button>
                ))}
              </div>
            </div>
            
            {/* Marque */}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Marque</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {allBrands.map(b=>(
                  <button key={b} onClick={()=>toggleCatFilter("brands",b)} style={chipSt(fBrands.includes(b), "#CE93D8")}>{b}</button>
                ))}
              </div>
            </div>
            
            {/* Forme */}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Forme</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {allShapes.map(s=>(
                  <button key={s} onClick={()=>toggleCatFilter("shapes",s)} style={chipSt(fShapes.includes(s), "#60a5fa")}>{s}</button>
                ))}
              </div>
            </div>
            
            {/* Année + Prix — side by side */}
            <div style={{display:"flex",gap:16}}>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Année</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {allYears.map(y=>(
                    <button key={y} onClick={()=>toggleCatFilter("years",y)} style={chipSt(fYears.includes(y))}>{y}</button>
                  ))}
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Budget max</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {PRICE_RANGES.map(p=>(
                    <button key={p.max} onClick={()=>setCatFilters(f=>({...f,priceMax:f.priceMax===p.max?0:p.max}))} style={chipSt(fPrice===p.max&&p.max>0, "#22c55e")}>{p.label}</button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Reset */}
            {activeCount>0&&<div style={{textAlign:"center",marginTop:10}}>
              <button onClick={()=>{resetCatFilters();setCatalogSearch("");}} style={{background:"none",border:"none",color:"#ef4444",fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>✕ Réinitialiser les filtres ({activeCount})</button>
            </div>}
          </div>
          
          {/* Results by brand */}
          <div style={{flex:1,overflowY:"auto",paddingBottom:40}}>
            {!filtered.length&&<div style={{textAlign:"center",padding:"40px 0",color:"#475569"}}>
              <div style={{fontSize:32,marginBottom:8}}>🔍</div>
              <p style={{fontSize:13}}>Aucune raquette trouvée</p>
            </div>}
            
            {sortedBrands.map(brand=>(
              <div key={brand} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"0 4px"}}>
                  <span style={{fontSize:14,fontWeight:800,fontFamily:"'Outfit'",color:"#f1f5f9"}}>{brand}</span>
                  <span style={{fontSize:10,color:"#64748b",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"2px 8px"}}>{byBrand[brand].length}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",gap:8}}>
                  {byBrand[brand].map(r=>(
                    <button key={r.id||r.name} onClick={()=>openRacketSheet(r,"catalog")} style={{
                      padding:"12px 10px",borderRadius:14,cursor:"pointer",textAlign:"center",
                      background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",
                      transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                    }}>
                      {r.imageUrl?<img src={r.imageUrl} alt={r.name} style={{width:60,height:60,objectFit:"contain",filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.3))"}} onError={e=>{e.target.style.display="none";e.target.nextSibling&&(e.target.nextSibling.style.display="flex");}}/>:null}
                      <div style={{display:r.imageUrl?"none":"flex",width:48,height:48,borderRadius:"50%",background:"rgba(249,115,22,0.06)",border:"1px dashed rgba(249,115,22,0.15)",alignItems:"center",justifyContent:"center",fontSize:20}}>🏸</div>
                      <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",fontFamily:"'Outfit'",lineHeight:1.3}}>{r.shortName||r.name}</div>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:16,fontWeight:900,color:"#f97316",fontFamily:"'Outfit'"}}>{avgScore(r)}</span>
                        <span style={{fontSize:8,color:"#64748b"}}>/10</span>
                      </div>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>
                        <span style={{fontSize:8,padding:"2px 6px",borderRadius:6,background:`${catColor(r.category)}12`,color:catColor(r.category),fontWeight:600}}>{catLabels[r.category]||r.category}</span>
                        <span style={{fontSize:8,padding:"2px 6px",borderRadius:6,background:"rgba(255,255,255,0.04)",color:"#64748b"}}>{r.year}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>;
      })()}


      {/* ============================================================ */}
      {/* RACKET SHEET — Full premium magazine-style racket page */}
      {/* ============================================================ */}
      {screen==="racketSheet"&&racketSheet&&(()=>{
        const r = racketSheet;
        const sc = r.scores||{};
        const ths = r.techHighlights||[];
        const leftThs = ths.filter((_,i)=>i%2===0);
        const rightThs = ths.filter((_,i)=>i%2===1);
        const avgScore = ATTRS.map(a=>sc[a]||0).reduce((a,b)=>a+b,0)/6;
        const radarData = ATTRS.map(a=>({attribute:a, Score:sc[a]||0, Max:10}));
        const catColor = r.category==="expert"?"#f97316":r.category==="avance"?"#a855f7":r.category==="intermediaire"?"#3b82f6":"#22c55e";
        const catLabel = {debutant:"Débutant",intermediaire:"Intermédiaire",avance:"Avancé",expert:"Expert"}[r.category]||r.category;
        
        const handleBack = () => {
          setRacketSheet(null);
          setScreen(racketSheetFrom || "home");
        };
        
        // PDF / Share
        const handleShare = () => {
          const printDiv = document.getElementById('racket-sheet-print');
          if (!printDiv) return;
          const printWin = window.open('','','width=800,height=1100');
          printWin.document.write(`<!DOCTYPE html><html><head><title>${r.name} — PadelAnalyzer</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
            <style>
              * { box-sizing: border-box; margin:0; padding:0; }
              body { font-family:'Outfit','Inter',sans-serif; background:#0f172a; color:#e2e8f0; padding:24px; max-width:700px; margin:0 auto; }
              .sheet-hero { text-align:center; margin-bottom:20px; }
              .sheet-hero img { width:160px; height:160px; object-fit:contain; }
              .sheet-title { font-size:28px; font-weight:900; color:#f1f5f9; }
              .sheet-sub { font-size:12px; color:#94a3b8; margin-top:4px; }
              .sheet-score { font-size:52px; font-weight:900; color:#f97316; text-align:center; margin:10px 0; }
              .sheet-section { margin:16px 0; padding:14px 18px; background:rgba(255,255,255,0.03); border-radius:14px; border:1px solid rgba(255,255,255,0.06); }
              .sheet-section-title { font-size:9px; color:#f97316; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; }
              .sheet-editorial { font-size:13px; line-height:1.8; color:#cbd5e1; font-style:italic; }
              .sheet-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
              .sheet-score-cell { text-align:center; padding:8px; border-radius:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); }
              .sheet-score-val { font-size:22px; font-weight:900; }
              .sheet-score-label { font-size:8px; color:#64748b; margin-top:2px; }
              .sheet-specs { display:grid; grid-template-columns:1fr 1fr; gap:6px 16px; font-size:11px; }
              .sheet-spec-label { color:#64748b; }
              .sheet-spec-val { color:#e2e8f0; font-weight:600; }
              .sheet-footer { text-align:center; margin-top:24px; font-size:9px; color:#334155; }
              @media print { body { background:white; color:#1a1a1a; } .sheet-title,.sheet-score-val,.sheet-spec-val { color:#1a1a1a; } .sheet-sub,.sheet-spec-label,.sheet-score-label { color:#666; } .sheet-editorial { color:#333; } .sheet-section { border-color:#ddd; } }
            </style>
          </head><body>${printDiv.innerHTML}
            <div class="sheet-footer">PadelAnalyzer · padelanalyzer.fr · ${new Date().toLocaleDateString('fr-FR')}</div>
          </body></html>`);
          printWin.document.close();
          setTimeout(()=>printWin.print(), 500);
        };

        return <div style={{minHeight:"100dvh",display:"flex",flexDirection:"column",fontFamily:"'Inter',sans-serif",animation:"fadeIn 0.3s ease",maxWidth:540,margin:"0 auto",padding:"0 12px"}}>
          
          {/* ===== HEADER ===== */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0 8px",zIndex:10}}>
            <button onClick={handleBack} style={{background:"none",border:"none",color:"#f97316",fontSize:13,cursor:"pointer",fontWeight:700,fontFamily:"'Outfit'"}}>← Retour</button>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleShare} style={{
                padding:"6px 14px",borderRadius:10,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"'Outfit'",
                background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.25)",color:"#f97316",
              }}>📄 PDF</button>
            </div>
          </div>

          {/* ===== PRINTABLE CONTENT ===== */}
          <div id="racket-sheet-print">

          {/* ===== HERO: Image + Score badge ===== */}
          <div style={{textAlign:"center",position:"relative",marginBottom:8}}>
            {/* Background glow */}
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",pointerEvents:"none"}}/>
            
            {r.imageUrl?<img src={r.imageUrl} alt={r.name} style={{
              width:180,height:180,objectFit:"contain",position:"relative",zIndex:1,
              filter:"drop-shadow(0 12px 32px rgba(0,0,0,0.5))",
            }} onError={e=>{e.target.style.display="none"}}/>
            :<div style={{width:140,height:140,margin:"0 auto",borderRadius:"50%",background:"rgba(249,115,22,0.06)",border:"2px dashed rgba(249,115,22,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>🏸</div>}
            
            {/* Score badge */}
            <div style={{display:"inline-flex",alignItems:"baseline",gap:2,marginTop:12,padding:"6px 24px",borderRadius:20,background:"rgba(8,12,20,0.9)",border:"2px solid rgba(249,115,22,0.35)",backdropFilter:"blur(8px)",position:"relative",zIndex:2}}>
              <span className="sheet-score" style={{fontSize:36,fontWeight:900,color:"#f97316",fontFamily:"'Outfit'"}}>{avgScore.toFixed(1)}</span>
              <span style={{fontSize:12,color:"#94a3b8"}}>/10</span>
            </div>
          </div>

          {/* ===== NAME + META ===== */}
          <div style={{textAlign:"center",marginBottom:14}}>
            <h1 className="sheet-title" style={{fontSize:26,fontWeight:900,fontFamily:"'Outfit'",color:"#f1f5f9",margin:"0 0 4px",letterSpacing:"-0.03em"}}>{r.name}</h1>
            <p className="sheet-sub" style={{fontSize:12,color:"#94a3b8",margin:"0 0 8px"}}>{r.brand} · {r.shape} · {r.weight} · {r.year}</p>
            <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:10,padding:"3px 12px",borderRadius:12,background:`${catColor}15`,border:`1px solid ${catColor}30`,color:catColor,fontWeight:700}}>{catLabel}</span>
              {r.price&&r.price!=="—"&&<span style={{fontSize:10,padding:"3px 12px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#94a3b8",fontWeight:600}}>💰 {r.price}</span>}
              {r.junior&&<span style={{fontSize:10,padding:"3px 12px",borderRadius:12,background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.2)",color:"#3b82f6",fontWeight:600}}>👦 Junior</span>}
              {r.womanLine&&<span style={{fontSize:10,padding:"3px 12px",borderRadius:12,background:"rgba(236,72,153,0.1)",border:"1px solid rgba(236,72,153,0.2)",color:"#ec4899",fontWeight:600}}>♀ Ligne femme</span>}
            </div>
          </div>

          {/* ===== PRO PLAYER ===== */}
          {r.proPlayerInfo?.name&&<div style={{textAlign:"center",marginBottom:14}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:16,background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.15)"}}>
              <span style={{fontSize:18}}>🎾</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:12,fontWeight:800,color:"#a855f7",fontFamily:"'Outfit'"}}>{r.proPlayerInfo.name}</div>
                {r.proPlayerInfo.context&&<div style={{fontSize:9,color:"#94a3b8",marginTop:1,lineHeight:1.4,maxWidth:280}}>{r.proPlayerInfo.context}</div>}
                {r.proPlayerInfo.rank&&<div style={{fontSize:9,color:"#c084fc",marginTop:1}}>Classement: {r.proPlayerInfo.rank}</div>}
              </div>
            </div>
          </div>}

          {/* ===== SCORES RADAR ===== */}
          <div className="sheet-section" style={{background:"rgba(255,255,255,0.02)",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)",padding:"14px 8px 8px",marginBottom:14}}>
            <div className="sheet-section-title" style={{fontSize:9,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"center",marginBottom:6}}>📊 PROFIL DE PERFORMANCE</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} margin={{top:8,right:40,bottom:8,left:40}}>
                <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                <PolarAngleAxis dataKey="attribute" tick={{fontSize:9,fill:"#94a3b8"}}/>
                <PolarRadiusAxis domain={[0,10]} tick={false} axisLine={false}/>
                <Radar name="Score" dataKey="Score" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
            
            {/* Score grid */}
            <div className="sheet-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginTop:4}}>
              {ATTRS.map(a=>{
                const val = sc[a]||0;
                const best = Math.max(...ATTRS.map(a2=>sc[a2]||0));
                const isBest = val===best && val>0;
                return <div key={a} className="sheet-score-cell" style={{textAlign:"center",padding:"8px 4px",borderRadius:10,background:isBest?"rgba(249,115,22,0.08)":"rgba(255,255,255,0.02)",border:`1px solid ${isBest?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.04)"}`}}>
                  <div className="sheet-score-val" style={{fontSize:22,fontWeight:900,color:val>=8?"#4CAF50":val>=6?"#e2e8f0":"#f97316",fontFamily:"'Outfit'"}}>{val}</div>
                  <div className="sheet-score-label" style={{fontSize:8,color:isBest?"#f97316":"#64748b",fontWeight:isBest?700:500,marginTop:1}}>{a}</div>
                </div>;
              })}
            </div>
          </div>

          {/* ===== BLUEPRINT: Tech Highlights ===== */}
          {ths.length>0&&<div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"center",marginBottom:10}}>🔬 TECHNOLOGIES</div>
            <div style={{display:"flex",alignItems:"stretch",gap:0,position:"relative"}}>
              {/* Left annotations */}
              <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:8,paddingRight:6}}>
                {leftThs.map((h,i)=>(
                  <div key={i} style={{padding:"10px 10px",borderRadius:12,textAlign:"right",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(249,115,22,0.1)",borderRight:"3px solid rgba(249,115,22,0.3)"}}>
                    <div style={{fontSize:11,color:"#e2e8f0",fontWeight:800,fontFamily:"'Outfit'"}}>{h.value}</div>
                    <div style={{fontSize:8,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.03em",marginTop:2}}>{h.label}</div>
                    <p style={{fontSize:9,color:"#64748b",margin:"4px 0 0",lineHeight:1.5}}>{h.detail}</p>
                  </div>
                ))}
              </div>

              {/* Center divider */}
              <div style={{width:2,background:"linear-gradient(to bottom, transparent, rgba(249,115,22,0.2), transparent)",margin:"0 4px",flexShrink:0}}/>

              {/* Right annotations */}
              <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:8,paddingLeft:6}}>
                {rightThs.map((h,i)=>(
                  <div key={i} style={{padding:"10px 10px",borderRadius:12,textAlign:"left",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(249,115,22,0.1)",borderLeft:"3px solid rgba(249,115,22,0.3)"}}>
                    <div style={{fontSize:11,color:"#e2e8f0",fontWeight:800,fontFamily:"'Outfit'"}}>{h.value}</div>
                    <div style={{fontSize:8,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.03em",marginTop:2}}>{h.label}</div>
                    <p style={{fontSize:9,color:"#64748b",margin:"4px 0 0",lineHeight:1.5}}>{h.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>}

          {/* ===== VERDICT ===== */}
          {r.verdict&&r.verdict!=="—"&&r.verdict!=="Analyse non disponible"&&<div className="sheet-section" style={{padding:"14px 18px",marginBottom:14,background:"linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(168,85,247,0.03) 100%)",borderRadius:16,border:"1px solid rgba(249,115,22,0.12)"}}>
            <div className="sheet-section-title" style={{fontSize:9,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>⚖️ VERDICT</div>
            <p style={{fontSize:13,color:"#e2e8f0",lineHeight:1.7,margin:0,fontWeight:600}}>{r.verdict}</p>
          </div>}

          {/* ===== EDITORIAL ===== */}
          {r.editorial&&<div className="sheet-section" style={{position:"relative",padding:"18px 20px 18px 32px",marginBottom:14,background:"rgba(255,255,255,0.02)",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="sheet-section-title" style={{fontSize:9,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>📝 ANALYSE ÉDITORIALE</div>
            <div style={{position:"absolute",top:28,left:12,fontSize:40,color:"rgba(249,115,22,0.1)",fontFamily:"Georgia",lineHeight:1}}>"</div>
            <p className="sheet-editorial" style={{fontSize:13,color:"#cbd5e1",lineHeight:1.9,margin:0,fontStyle:"italic"}}>{r.editorial}</p>
          </div>}

          {/* ===== TARGET PROFILE (dynamic when profile active) ===== */}
          {(()=>{
            const dynText = profileName ? generateDynamicTargetProfile(r, {...profile, _name: profileName}) : null;
            const text = dynText || r.targetProfile;
            if (!text) return null;
            const isDynamic = !!dynText;
            return <div style={{padding:"14px 18px",background:isDynamic?"rgba(249,115,22,0.04)":"rgba(76,175,80,0.04)",borderRadius:16,border:`1px solid ${isDynamic?"rgba(249,115,22,0.12)":"rgba(76,175,80,0.1)"}`,marginBottom:14}}>
              <div style={{fontSize:9,color:isDynamic?"#f97316":"#4CAF50",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{isDynamic?`🎯 POUR ${(profileName||"toi").toUpperCase()}`:"🎯 PROFIL CIBLE"}</div>
              <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.7,margin:0}}>{safeBold(text, "#f1f5f9")}</p>
            </div>;
          })()}

          {/* ===== SPECS TABLE ===== */}
          <div className="sheet-section" style={{padding:"14px 18px",marginBottom:14,background:"rgba(255,255,255,0.02)",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="sheet-section-title" style={{fontSize:9,color:"#f97316",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>📋 CARACTÉRISTIQUES</div>
            <div className="sheet-specs" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 20px"}}>
              {[
                ["Forme", r.shape],
                ["Poids", r.weight],
                ["Équilibre", r.balance],
                ["Surface", r.surface],
                ["Noyau", r.core],
                ["Anti-vibration", r.antivib],
                ["Joueur", r.player],
                ["Année", r.year],
              ].filter(([,v])=>v&&v!=="—"&&v!==undefined).map(([label,val])=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <span className="sheet-spec-label" style={{fontSize:11,color:"#64748b"}}>{label}</span>
                  <span className="sheet-spec-val" style={{fontSize:11,color:"#e2e8f0",fontWeight:600,textAlign:"right"}}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          </div>{/* end print zone */}

          {/* Footer */}
          <div style={{textAlign:"center",padding:"12px 0 30px"}}>
            <div style={{fontSize:8,color:"#334155",letterSpacing:"0.05em"}}>
              <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> · padelanalyzer.fr
            </div>
          </div>
        </div>;
      })()}


      {/* ============================================================ */}
      {/* WIZARD SCREEN — Step-by-step profile creation */}
      {/* ============================================================ */}
      {screen==="wizard"&&(()=>{
        const TOTAL_STEPS = 11;
        const progress = (wizardStep+1) / TOTAL_STEPS;
        const isJuniorW = (Number(profile.age)>0&&Number(profile.age)<15);
        const isFemme = profile.genre === "Femme";
        const g = (m, f) => isFemme ? f : m;
        const wizMode = detectPlayerMode(profile);
        const isExpertMode = wizMode === "expert";
        const isPepiteMode = wizMode === "pepite";

        // Auto-fill for Expert mode (P4/P5)
        if (isExpertMode && profile.frequency !== "Intensif (5+/semaine)") {
          setProfile(p=>({...p, frequency: "Intensif (5+/semaine)", competition: true}));
        }

        // Can advance?
        const canNext = [
          ()=>profileName.trim().length>0,
          ()=>!!profile.genre,
          ()=>Number(profile.age)>0,
          ()=>!!profile.fitness,
          ()=>!!profile.level,
          ()=>!!profile.hand && !!profile.side,
          ()=>!!profile.frequency,
          ()=>(profile.styleTags||[]).length>0,
          ()=>(profile.injuryTags||[]).length>0,
          ()=>isExpertMode ? (!!profile.expertToucher && !!profile.expertForme) : (profile.priorityTags||[]).length>0,
          ()=>true,
        ][wizardStep]();

        const nextStep = () => {
          if(!canNext || wizardStep>=TOTAL_STEPS-1) return;
          let next = wizardStep + 1;
          if (next === 6 && isExpertMode) next = 7;
          setWizardStep(next);
        };
        const prevStep = () => {
          if(wizardStep<=0) return;
          let prev = wizardStep - 1;
          if (prev === 6 && isExpertMode) prev = 5;
          setWizardStep(prev);
        };
        const goRecap = () => { if(canNext) setScreen("recap"); };

        const CardSelect = ({options, value, onChange, multi, columns=2}) => (
          <div style={{display:"grid",gridTemplateColumns:`repeat(${columns},1fr)`,gap:10,maxWidth:460,margin:"0 auto",width:"100%"}}>
            {options.map(o=>{
              const sel = multi ? (value||[]).includes(o.value) : value===o.value;
              const disabled = o.disabled;
              return <button key={o.value} onClick={()=>{
                if(disabled) return;
                if(multi){
                  if(o.value==="aucune") onChange(sel?[]:[o.value]);
                  else onChange(sel?(value||[]).filter(v=>v!==o.value):[...(value||[]).filter(v=>v!=="aucune"),o.value]);
                } else onChange(o.value);
              }} style={{
                padding:"16px 12px",borderRadius:14,cursor:disabled?"not-allowed":"pointer",textAlign:"center",fontFamily:"'Inter',sans-serif",
                background:disabled?"rgba(255,255,255,0.01)":sel?"rgba(249,115,22,0.12)":"rgba(255,255,255,0.03)",
                border:`2px solid ${disabled?"rgba(255,255,255,0.04)":sel?"#f97316":"rgba(255,255,255,0.08)"}`,
                transition:"all 0.25s ease",transform:sel?"scale(1.02)":"scale(1)",
                boxShadow:sel?"0 4px 16px rgba(249,115,22,0.15)":"none",
                opacity:disabled?0.35:1,
              }}>
                {o.icon&&<div style={{fontSize:24,marginBottom:4}}>{o.icon}</div>}
                <div style={{fontSize:14,fontWeight:700,color:disabled?"#475569":sel?"#f97316":"#e2e8f0"}}>{o.label}</div>
                {o.desc&&<div style={{fontSize:10,color:disabled?"#334155":"#64748b",marginTop:2}}>{o.desc}</div>}
              </button>;
            })}
          </div>
        );

        const TagSelect = ({tags, field, colors}) => {
          const c = colors || {on:"#f97316",bg:"rgba(249,115,22,0.12)",border:"#f97316"};
          return <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:460,margin:"0 auto"}}>
            {tags.map(t=>{
              const sel = (profile[field]||[]).includes(t.id);
              return <button key={t.id} className="pa-tag" onClick={()=>{
                setProfile(p=>{
                  const arr = p[field]||[];
                  if(t.id==="aucune") return {...p,[field]:sel?[]:[t.id]};
                  return {...p,[field]:sel?arr.filter(x=>x!==t.id):[...arr.filter(x=>x!=="aucune"),t.id]};
                });
              }} title={t.tip||""} style={{
                padding:"8px 16px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",
                background:sel?c.bg:"rgba(255,255,255,0.03)",
                border:`1.5px solid ${sel?c.border:"rgba(255,255,255,0.08)"}`,
                color:sel?c.on:"#64748b",fontFamily:"'Inter',sans-serif",
                boxShadow:sel?`0 2px 8px ${c.on}22`:"none",transition:"all 0.2s ease",
              }}>{sel?"✓ ":""}{t.label}</button>;
            })}
          </div>;
        };

        const fitLevel = (profile.fitness || "actif").toLowerCase();
        const expertAllowed = fitLevel === "athletique";
        const levelOptions = LEVEL_OPTIONS.map(o => ({
          value: o.value, label: o.label, desc: o.desc,
          icon: {Débutant:"🌱",Intermédiaire:"🎾",Avancé:"🔥",Expert:"💎"}[o.value],
          disabled: o.value === "Expert" && !expertAllowed,
        }));

        const stepContent = [
          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>👤</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>{groupRole==="vendeur"?"Prénom du joueur":"Comment tu t'appelles ?"}</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>{groupRole==="vendeur"?"Le prénom ou pseudo du client.":"Le nom de ton profil joueur."}</p>
            <input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder={groupRole==="vendeur"?"Ex: Manon, Noah...":"Ex: Bidou, Manon, Noah..."}
              onKeyDown={e=>{if(e.key==="Enter"&&canNext)nextStep();}}
              autoFocus style={{width:"100%",maxWidth:360,padding:"16px 20px",borderRadius:14,fontSize:18,fontWeight:600,background:"rgba(255,255,255,0.05)",border:"2px solid rgba(249,115,22,0.3)",color:"#f1f5f9",fontFamily:"'Inter',sans-serif",outline:"none",textAlign:"center"}}/>
          </div>,

          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>{isFemme?"👩":"👨"}</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Tu es…</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Les recommandations s'adaptent au genre (gammes, poids, confort).</p>
            <CardSelect options={[
              {value:"Homme",label:"Homme",icon:"♂️",desc:"Gammes standard"},
              {value:"Femme",label:"Femme",icon:"♀️",desc:"Gammes adaptées + WomanLine"},
            ]} value={profile.genre||"Homme"} onChange={v=>{setProfile(p=>({...p,genre:v}));setTimeout(nextStep,300);}}/>
          </div>,

          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>📏</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Ton gabarit</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Pour adapter le poids et le type de raquette {g("idéal","idéale")}.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,maxWidth:400,margin:"0 auto"}}>
              {[{key:"age",label:"Âge",ph:"30",unit:"ans"},{key:"height",label:"Taille",ph:"170",unit:"cm"},{key:"weight",label:"Poids",ph:"70",unit:"kg"}].map(f=>
                <div key={f.key} style={{textAlign:"center"}}>
                  <label style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:6}}>{f.label}</label>
                  <input type="number" value={profile[f.key]} onChange={e=>setProfile(p=>({...p,[f.key]:Number(e.target.value)}))}
                    placeholder={f.ph} style={{width:"100%",padding:"14px 8px",borderRadius:12,fontSize:22,fontWeight:700,background:"rgba(255,255,255,0.05)",border:"2px solid rgba(255,255,255,0.1)",color:"#f1f5f9",fontFamily:"'Inter',sans-serif",outline:"none",textAlign:"center"}}/>
                  <div style={{fontSize:9,color:"#475569",marginTop:4}}>{f.unit}</div>
                </div>
              )}
            </div>
            {isJuniorW&&<div style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:10,padding:"10px 14px",marginTop:16,fontSize:11,color:"#60a5fa",fontWeight:600,maxWidth:400,margin:"16px auto 0"}}>🧒 Profil junior détecté — recommandations adaptées</div>}
          </div>,

          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>💪</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>{g("Ta condition physique","Ta condition physique")}</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Influence la tolérance au poids et les recommandations avancées.</p>
            <CardSelect columns={1} options={FITNESS_OPTIONS.map(o=>({value:o.value,label:o.label,icon:o.icon,desc:o.desc}))} value={profile.fitness||"actif"} onChange={v=>{
              setProfile(p=>{
                const updated = {...p, fitness:v};
                if(v !== "athletique" && (p.level||"").toLowerCase().includes("expert")) updated.level = "Avancé";
                return updated;
              });
              setTimeout(nextStep,300);
            }}/>
          </div>,

          ()=>{
            const expertBlocked = !expertAllowed;
            return <div style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:16}}>🏆</div>
              <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>{groupRole==="vendeur"?"Quel est son niveau ?":"Quel est ton niveau ?"}</h2>
              <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Ça détermine la gamme de raquettes qu'on va te proposer.</p>
              <CardSelect options={levelOptions} value={profile.level} onChange={v=>{setProfile(p=>({...p,level:v}));setTimeout(nextStep,300);}}/>
              {expertBlocked&&<div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,padding:"10px 14px",marginTop:16,fontSize:11,color:"#fbbf24",fontWeight:600,maxWidth:400,margin:"16px auto 0"}}>💡 Le niveau Expert nécessite une condition physique Athlétique</div>}
              {isPepiteMode&&<div style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:10,padding:"10px 14px",marginTop:16,fontSize:11,color:"#60a5fa",fontWeight:700,maxWidth:400,margin:"16px auto 0"}}>🌟 Jeune Pépite détecté{g("","e")} — accès aux raquettes adultes légères !</div>}
              {isExpertMode&&<div style={{background:"rgba(168,85,247,0.1)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:10,padding:"10px 14px",marginTop:16,fontSize:11,color:"#c084fc",fontWeight:700,maxWidth:400,margin:"16px auto 0"}}>⚡ Mode Pro — matching par sensations physiques, fréquence et compétition auto-remplies</div>}
            </div>;
          },

          ()=>{
            const h=profile.hand||"Droitier",s=profile.side||"Droite";
            const atk=(h==="Droitier"&&s==="Gauche")||(h==="Gaucher"&&s==="Droite");
            const cst=(h==="Droitier"&&s==="Droite")||(h==="Gaucher"&&s==="Gauche");
            const role=s==="Les deux"?g("Polyvalent","Polyvalente"):atk?g("Attaquant","Attaquante")+" (coup droit au centre)":g("Constructeur","Constructrice")+" (revers au centre)";
            const roleColor=atk?"#f97316":cst?"#6366f1":"#94a3b8";
            return <div style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:16}}>🤚</div>
              <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Ta prise de jeu</h2>
              <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Main + côté = on détecte ton rôle sur le terrain.</p>
              <div style={{maxWidth:400,margin:"0 auto"}}>
                <label style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:8}}>Main dominante</label>
                <CardSelect columns={2} options={HAND_OPTIONS.map(o=>({value:o,label:o,icon:o==="Droitier"?"🫲":"🫱"}))} value={profile.hand} onChange={v=>setProfile(p=>({...p,hand:v}))}/>
                <div style={{height:20}}/>
                <label style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:8}}>Côté de jeu</label>
                <CardSelect columns={3} options={SIDE_OPTIONS.map(o=>({value:o,label:o,icon:{Gauche:"⬅️",Droite:"➡️","Les deux":"↔️"}[o]}))} value={profile.side} onChange={v=>setProfile(p=>({...p,side:v}))}/>
              </div>
              {profile.hand&&profile.side&&<div style={{background:`${roleColor}15`,border:`1.5px solid ${roleColor}40`,borderRadius:12,padding:"12px 16px",marginTop:20,fontSize:13,color:roleColor,fontWeight:700,maxWidth:400,margin:"20px auto 0"}}>🎯 Rôle détecté : {role}</div>}
            </div>;
          },

          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>📅</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Ton rythme de jeu</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Fréquence et compétition influencent la durabilité requise.</p>
            <CardSelect options={FREQ_OPTIONS.map(o=>({value:o.value,label:o.label,desc:o.desc,icon:{Occasionnel:"🌙",Régulier:"☀️",Assidu:"🔥",Intensif:"⚡"}[o.label]}))} value={profile.frequency} onChange={v=>setProfile(p=>({...p,frequency:v}))}/>
            <div style={{marginTop:24,maxWidth:460,margin:"24px auto 0"}}>
              <label style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:10}}>Tu fais de la compétition ?</label>
              <CardSelect columns={2} options={[{value:true,label:"Oui",icon:"🏅",desc:"Tournois, classement"},{value:false,label:"Non",icon:"🎾",desc:"Loisir, entre amis"}]} value={profile.competition} onChange={v=>setProfile(p=>({...p,competition:v}))}/>
            </div>
          </div>,

          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>🎾</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>{groupRole==="vendeur"?"Comment joue-t-il/elle ?":"Comment tu joues ?"}</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Sélectionne tout ce qui te correspond. Ça influence le scoring.</p>
            <TagSelect tags={STYLE_TAGS} field="styleTags"/>
          </div>,

          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>🩹</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Ton corps</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Les blessures boostent le critère Confort dans les recommandations.</p>
            <TagSelect tags={INJURY_TAGS} field="injuryTags" colors={{on:"#ef4444",bg:"rgba(239,68,68,0.12)",border:"#ef4444"}}/>
          </div>,

          ()=><div style={{textAlign:"center"}}>
            {isExpertMode ? (<>
            <div style={{fontSize:40,marginBottom:16}}>🎾</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Tes sensations raquette</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 6px"}}>{groupRole==="vendeur"?"À ce niveau, le ressenti guide. Quelles sont ses préférences ?":"À ton niveau, c'est le ressenti qui guide. Dis-nous ce que tu cherches."}</p>
            <p style={{fontSize:11,color:"#a855f7",margin:"0 0 22px",fontWeight:600}}>⚡ Mode Pro — matching par propriétés physiques</p>

            <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:460,margin:"0 auto",textAlign:"left"}}>
              {/* TOUCHER */}
              <div>
                <div style={{fontSize:12,fontWeight:800,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>🤚 Toucher</div>
                <div style={{display:"flex",gap:8}}>
                  {[{v:"sec",l:"Sec & Direct",d:"Sortie de balle sèche, réponse immédiate"},{v:"medium",l:"Medium",d:"Polyvalent, entre fermeté et confort"},{v:"souple",l:"Souple & Enveloppant",d:"Toucher accompagné, confort maximal"}].map(o=>{
                    const sel = profile.expertToucher===o.v;
                    return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertToucher:o.v}))} style={{
                      flex:1,padding:"12px 8px",borderRadius:12,cursor:"pointer",textAlign:"center",fontFamily:"inherit",
                      background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",
                      border:`2px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,transition:"all 0.2s",
                    }}>
                      <div style={{fontSize:13,fontWeight:700,color:sel?"#c084fc":"#e2e8f0"}}>{o.l}</div>
                      <div style={{fontSize:9,color:sel?"#a855f7":"#64748b",marginTop:3}}>{o.d}</div>
                    </button>;
                  })}
                </div>
              </div>

              {/* RÉACTIVITÉ */}
              <div>
                <div style={{fontSize:12,fontWeight:800,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>⚡ Réactivité</div>
                <div style={{display:"flex",gap:8}}>
                  {[{v:"explosive",l:"Explosive",d:"Sortie de balle rapide, frappe sèche"},{v:"progressive",l:"Progressive",d:"Montée en puissance accompagnée"}].map(o=>{
                    const sel = profile.expertReactivite===o.v;
                    return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertReactivite:o.v}))} style={{
                      flex:1,padding:"12px 8px",borderRadius:12,cursor:"pointer",textAlign:"center",fontFamily:"inherit",
                      background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",
                      border:`2px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,transition:"all 0.2s",
                    }}>
                      <div style={{fontSize:13,fontWeight:700,color:sel?"#c084fc":"#e2e8f0"}}>{o.l}</div>
                      <div style={{fontSize:9,color:sel?"#a855f7":"#64748b",marginTop:3}}>{o.d}</div>
                    </button>;
                  })}
                </div>
              </div>

              {/* POIDS EN MAIN */}
              <div>
                <div style={{fontSize:12,fontWeight:800,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>⚖️ Poids en main</div>
                <div style={{display:"flex",gap:8}}>
                  {[{v:"lourd",l:"Lourd & Stable",d:"365g+, inertie pour frapper fort"},{v:"equilibre",l:"Équilibré",d:"355-365g, compromis idéal"},{v:"leger",l:"Léger & Vif",d:"<360g, réactivité au filet"}].map(o=>{
                    const sel = profile.expertPoids===o.v;
                    return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertPoids:o.v}))} style={{
                      flex:1,padding:"12px 8px",borderRadius:12,cursor:"pointer",textAlign:"center",fontFamily:"inherit",
                      background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",
                      border:`2px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,transition:"all 0.2s",
                    }}>
                      <div style={{fontSize:13,fontWeight:700,color:sel?"#c084fc":"#e2e8f0"}}>{o.l}</div>
                      <div style={{fontSize:9,color:sel?"#a855f7":"#64748b",marginTop:3}}>{o.d}</div>
                    </button>;
                  })}
                </div>
              </div>

              {/* FORME */}
              <div>
                <div style={{fontSize:12,fontWeight:800,color:"#c084fc",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>🔷 Forme préférée</div>
                <div style={{display:"flex",gap:8}}>
                  {[{v:"diamant",l:"Diamant",d:"Puissance max, point de frappe haut"},{v:"goutte",l:"Goutte d'eau",d:"Polyvalence, sweet spot centré"},{v:"ronde",l:"Ronde",d:"Contrôle absolu, tolérance"},{v:"indifferent",l:"Indifférent",d:"Laisse l'algo choisir"}].map(o=>{
                    const sel = profile.expertForme===o.v;
                    return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertForme:o.v}))} style={{
                      flex:1,padding:"12px 8px",borderRadius:12,cursor:"pointer",textAlign:"center",fontFamily:"inherit",
                      background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",
                      border:`2px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,transition:"all 0.2s",
                    }}>
                      <div style={{fontSize:13,fontWeight:700,color:sel?"#c084fc":"#e2e8f0"}}>{o.l}</div>
                      <div style={{fontSize:9,color:sel?"#a855f7":"#64748b",marginTop:3}}>{o.d}</div>
                    </button>;
                  })}
                </div>
              </div>
            </div>
            </>) : (<>
            <div style={{fontSize:40,marginBottom:16}}>🎯</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Qu'est-ce que tu cherches ?</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 6px"}}>Clique dans l'ordre d'importance — la 1ère priorité pèse plus.</p>
            <p style={{fontSize:11,color:"#475569",margin:"0 0 22px"}}>1️⃣ = priorité forte · 2️⃣ = importante · 3️⃣+ = secondaire</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:460,margin:"0 auto"}}>
              {PRIORITY_TAGS.map(t=>{
                const prioList = profile.priorityTags||[];
                const idx = prioList.indexOf(t.id);
                const isOn = idx >= 0;
                const rank = idx + 1;
                const rankColors = ["#4CAF50","#8BC34A","#FFC107","#FF9800","#f97316"];
                const c = isOn ? (rankColors[Math.min(idx,rankColors.length-1)]) : "rgba(255,255,255,0.08)";
                return <button key={t.id} onClick={()=>{
                  setProfile(p=>{
                    const cur = [...(p.priorityTags||[])];
                    if (isOn) return {...p, priorityTags: cur.filter(x=>x!==t.id)};
                    return {...p, priorityTags: [...cur, t.id]};
                  });
                }} style={{
                  padding:"10px 18px",borderRadius:14,fontSize:12,fontWeight:700,cursor:"pointer",
                  background:isOn?`${c}20`:"rgba(255,255,255,0.03)",
                  border:`2px solid ${isOn?c:"rgba(255,255,255,0.08)"}`,
                  color:isOn?c:"#94a3b8",fontFamily:"inherit",transition:"all 0.2s",
                  position:"relative",minWidth:110,
                }}>
                  {isOn&&<span style={{position:"absolute",top:-8,left:-8,width:22,height:22,borderRadius:"50%",background:c,color:"#000",fontSize:12,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"}}>{rank}</span>}
                  {t.label}
                  {t.tip&&<div style={{fontSize:9,color:isOn?c:"#475569",marginTop:3,fontWeight:400,opacity:0.8}}>{t.tip}</div>}
                </button>;
              })}
            </div>
            {(profile.priorityTags||[]).length>0&&<div style={{marginTop:16,display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
              {(profile.priorityTags||[]).map((id,i)=>{
                const t = PRIORITY_TAGS.find(x=>x.id===id);
                return t&&<span key={id} style={{fontSize:11,fontWeight:700,color:i===0?"#4CAF50":i===1?"#8BC34A":"#FFC107",background:i===0?"rgba(76,175,80,0.15)":i===1?"rgba(139,195,74,0.15)":"rgba(255,193,7,0.15)",padding:"4px 12px",borderRadius:10}}>{i+1}. {t.label}</span>;
              })}
            </div>}
            </>)}
          </div>,

          ()=><div style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:16}}>🏷</div>
            <h2 style={{fontFamily:"'Outfit'",fontSize:26,fontWeight:800,color:"#f1f5f9",margin:"0 0 8px"}}>Marques préférées</h2>
            <p style={{fontSize:13,color:"#64748b",margin:"0 0 28px"}}>Optionnel — laisse vide pour voir toutes les marques.</p>
            <TagSelect tags={BRAND_TAGS} field="brandTags" colors={{on:"#CE93D8",bg:"rgba(156,39,176,0.12)",border:"#9C27B0"}}/>
          </div>,
        ];

        return (
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"20px 16px",animation:"fadeIn 0.3s ease"}}>
          <style>{`
            @keyframes wizardSlideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
            @keyframes wizardSlideOut { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-40px); } }
          `}</style>

          {/* Progress bar */}
          <div style={{position:"fixed",top:0,left:0,right:0,height:4,background:"rgba(255,255,255,0.06)",zIndex:10}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#f97316,#ef4444)",borderRadius:"0 2px 2px 0",transition:"width 0.5s cubic-bezier(.4,0,.2,1)",width:`${progress*100}%`}}/>
          </div>

          {/* Step counter */}
          <div style={{position:"fixed",top:16,right:20,fontSize:11,color:"#475569",fontWeight:600,zIndex:10}}>
            {wizardStep+1}/{TOTAL_STEPS}
          </div>

          {/* Back button */}
          {wizardStep>0&&<button onClick={prevStep} style={{position:"fixed",top:14,left:16,background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"6px 14px",color:"#94a3b8",fontSize:11,cursor:"pointer",fontFamily:"inherit",zIndex:10}}>
            ← Retour
          </button>}

          {/* Content */}
          <div key={wizardStep} style={{width:"100%",maxWidth:540,animation:"wizardSlideIn 0.4s ease"}}>
            {stepContent[wizardStep]()}
          </div>

          {/* Navigation */}
          <div style={{marginTop:36,display:"flex",gap:12,alignItems:"center"}}>
            {wizardStep===TOTAL_STEPS-1 ? (
              <button onClick={goRecap} style={{
                padding:"14px 40px",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
                background:"linear-gradient(135deg,rgba(76,175,80,0.25),rgba(76,175,80,0.12))",
                border:"1.5px solid rgba(76,175,80,0.4)",color:"#4CAF50",transition:"all 0.3s ease",
              }}>
                Voir le récap →
              </button>
            ) : (
              <button onClick={nextStep} disabled={!canNext} style={{
                padding:"14px 40px",borderRadius:14,fontSize:15,fontWeight:800,cursor:canNext?"pointer":"not-allowed",fontFamily:"'Outfit',sans-serif",
                background:canNext?"linear-gradient(135deg,rgba(249,115,22,0.25),rgba(239,68,68,0.15))":"rgba(255,255,255,0.03)",
                border:`1.5px solid ${canNext?"rgba(249,115,22,0.4)":"rgba(255,255,255,0.06)"}`,
                color:canNext?"#f97316":"#334155",transition:"all 0.3s ease",
                opacity:canNext?1:0.5,
              }}>
                Suivant →
              </button>
            )}
          </div>

          {/* Home link — positioned in flow, not fixed (avoids overlap with Suivant) */}
          <button onClick={()=>setScreen("home")} style={{marginTop:32,background:"none",border:"none",color:"#334155",fontSize:10,cursor:"pointer",fontFamily:"inherit",padding:"6px 12px"}}>
            ← Retour à l'accueil
          </button>
        </div>
        );
      })()}

      {/* ============================================================ */}
      {/* RECAP SCREEN — Profile confirmation before analysis */}
      {/* ============================================================ */}
      {screen==="recap"&&(()=>{
        const styles = (profile.styleTags||[]).map(id=>STYLE_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const injuries = (profile.injuryTags||[]).filter(t=>t!=="aucune").map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const priorities = (profile.priorityTags||[]).map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const brands = (profile.brandTags||[]).map(id=>BRAND_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const hand = profile.hand||"Droitier", side = profile.side||"Droite";
        const isAttacker = (hand==="Droitier"&&side==="Gauche")||(hand==="Gaucher"&&side==="Droite");
        const isFemme_r = (profile.genre||"Homme")==="Femme"; const role = side==="Les deux"?(isFemme_r?"Polyvalente":"Polyvalent"):isAttacker?(isFemme_r?"Attaquante":"Attaquant"):(isFemme_r?"Constructrice":"Constructeur");
        const levelColors = {Débutant:"#4CAF50",Intermédiaire:"#FF9800",Avancé:"#ef4444",Expert:"#9C27B0"};

        return (
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"20px 16px",animation:"fadeIn 0.5s ease"}}>
          <div style={{width:"100%",maxWidth:480}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:48,marginBottom:12}}>🎾</div>
              <h2 style={{fontFamily:"'Outfit'",fontSize:28,fontWeight:800,color:"#f1f5f9",margin:"0 0 6px"}}>{groupRole==="vendeur"?"Profil à valider":"C'est bien toi ?"}</h2>
              <p style={{fontSize:13,color:"#64748b",margin:0}}>{groupRole==="vendeur"?"Vérifiez le profil avant de lancer l'analyse.":"Vérifie ton profil avant de lancer l'analyse."}</p>
            </div>

            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"24px 22px",marginBottom:24}}>
              {/* Name + Avatar */}
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
                <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,rgba(249,115,22,0.35),rgba(239,68,68,0.25))",border:"2px solid rgba(249,115,22,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,color:"#f97316",flexShrink:0}}>
                  {profileName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontSize:22,fontWeight:800,color:"#f1f5f9",fontFamily:"'Outfit'"}}>{profileName}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4}}>
                    {profile.level&&<span style={{fontSize:10,fontWeight:600,color:levelColors[profile.level],background:`${levelColors[profile.level]}18`,padding:"3px 10px",borderRadius:8,textTransform:"uppercase"}}>{profile.level}</span>}
                    <span style={{fontSize:11,color:"#94a3b8"}}>{hand} · Côté {side}</span>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {profile.age&&<div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600,marginBottom:3}}>Gabarit</div><div style={{fontSize:12,color:"#e2e8f0",fontWeight:600}}>{profile.age} ans{profile.height?`, ${profile.height}cm`:""}{profile.weight?`, ${profile.weight}kg`:""}</div></div>}
                <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600,marginBottom:3}}>Rôle</div><div style={{fontSize:12,color:isAttacker?"#f97316":"#a5b4fc",fontWeight:600}}>🎯 {role}</div></div>
                {profile.frequency&&<div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600,marginBottom:3}}>Fréquence</div><div style={{fontSize:12,color:"#e2e8f0",fontWeight:600}}>{FREQ_OPTIONS.find(f=>f.value===profile.frequency)?.label||profile.frequency}{profile.competition?" · 🏅 Compétition":""}</div></div>}
                {styles.length>0&&<div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600,marginBottom:3}}>Style</div><div style={{fontSize:11,color:"#a5b4fc",fontWeight:600}}>{styles.join(", ")}</div></div>}
              </div>

              {/* Tags */}
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:14,justifyContent:"center"}}>
                {profile.expertToucher ? (<>
                  {[
                    {l:`🤚 ${({sec:"Sec",medium:"Medium",souple:"Souple"})[profile.expertToucher]}`,c:"#a855f7"},
                    profile.expertReactivite && {l:`⚡ ${({explosive:"Explosive",progressive:"Progressive"})[profile.expertReactivite]}`,c:"#a855f7"},
                    profile.expertPoids && {l:`⚖️ ${({lourd:"Lourd",equilibre:"Équilibré",leger:"Léger"})[profile.expertPoids]}`,c:"#a855f7"},
                    profile.expertForme && profile.expertForme!=="indifferent" && {l:`🔷 ${({diamant:"Diamant",goutte:"Goutte",ronde:"Ronde"})[profile.expertForme]}`,c:"#a855f7"},
                  ].filter(Boolean).map((t,i)=><span key={i} style={{fontSize:10,background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:8,padding:"4px 10px",color:t.c,fontWeight:600}}>{t.l}</span>)}
                </>) : (<>
                  {priorities.map((p,i)=><span key={p} style={{fontSize:10,background:i===0?"rgba(76,175,80,0.15)":i===1?"rgba(139,195,74,0.12)":"rgba(255,193,7,0.1)",border:`1px solid ${i===0?"rgba(76,175,80,0.35)":i===1?"rgba(139,195,74,0.3)":"rgba(255,193,7,0.25)"}`,borderRadius:8,padding:"4px 10px",color:i===0?"#4CAF50":i===1?"#8BC34A":"#FFC107",fontWeight:600}}>{i+1}️⃣ {p}</span>)}
                </>)}
                {injuries.map(i=><span key={i} style={{fontSize:10,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"4px 10px",color:"#ef4444",fontWeight:600}}>🩹 {i}</span>)}
                {brands.map(b=><span key={b} style={{fontSize:10,background:"rgba(156,39,176,0.1)",border:"1px solid rgba(156,39,176,0.25)",borderRadius:8,padding:"4px 10px",color:"#CE93D8",fontWeight:600}}>🏷 {b}</span>)}
              </div>
            </div>

            {/* Buttons */}
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>{setWizardStep(0);setScreen("wizard");}} style={{
                flex:1,padding:"14px",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
                background:"rgba(255,255,255,0.03)",border:"1.5px solid rgba(255,255,255,0.1)",color:"#94a3b8",
              }}>
                ✏️ Modifier
              </button>
              <button onClick={()=>{
                if(!profileName.trim()){alert(groupRole==="vendeur"?"Entrez le prénom du joueur":"Donne un nom à ton profil");return;}
                const list = saveNamedProfile(profileName.trim(), profile);
                setSavedProfiles(list);
                cloudSyncProfile(profileName.trim(), profile, false);
                setScreen("analyzing");
                setRevealIdx(0);
              }} style={{
                flex:2,padding:"14px",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
                background:"linear-gradient(135deg,rgba(249,115,22,0.25),rgba(239,68,68,0.15))",
                border:"1.5px solid rgba(249,115,22,0.4)",color:"#f97316",
                boxShadow:"0 4px 20px rgba(249,115,22,0.2)",transition:"all 0.3s ease",
              }}>
                🚀 Lancer l'analyse
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ============================================================ */}
      {/* ANALYZING SCREEN — Suspense interstitial */}
      {/* ============================================================ */}
      {screen==="analyzing"&&(()=>{
        const styles = (profile.styleTags||[]).map(id=>STYLE_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const injuries = (profile.injuryTags||[]).filter(t=>t!=="aucune").map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const priorities = (profile.priorityTags||[]).map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const hand = profile.hand||"Droitier", side = profile.side||"Droite";
        const isAttacker = (hand==="Droitier"&&side==="Gauche")||(hand==="Gaucher"&&side==="Droite");
        const isFemme_r = (profile.genre||"Homme")==="Femme"; const role = side==="Les deux"?(isFemme_r?"Polyvalente":"Polyvalent"):isAttacker?(isFemme_r?"Attaquante":"Attaquant"):(isFemme_r?"Constructrice":"Constructeur");
        const age = Number(profile.age)||0;
        const isJuniorA = age>0&&age<15;
        const isPepiteA = detectPlayerMode(profile)==="pepite";
        const isExpertA = detectPlayerMode(profile)==="expert";

        // Build analysis lines (different from pertinence!)
        const lines = [];
        lines.push(`Analyse du profil de ${profileName}...`);
        if(age) lines.push(`${age} ans, ${role.toLowerCase()} côté ${side.toLowerCase()}${profile.competition?" en compétition":""}.`);
        if(styles.length>0) {
          const defStyles = styles.filter(s=>["Défensif / Mur","Endurant","Contre-attaquant"].includes(s));
          const atkStyles = styles.filter(s=>["Offensif","Puissant / Frappeur"].includes(s));
          if(defStyles.length>0&&atkStyles.length>0) lines.push(`Profil mixte : ${atkStyles.join(", ")} mais aussi ${defStyles.join(", ")}. Le système doit trouver le bon équilibre.`);
          else if(atkStyles.length>0) lines.push(`Orientation offensive claire : ${atkStyles.join(", ")}. On cherche de la puissance et du rendement.`);
          else if(defStyles.length>0) lines.push(`Jeu patient et solide : ${defStyles.join(", ")}. Le contrôle et la tolérance seront clés.`);
          else lines.push(`Style ${styles.slice(0,3).join(", ")} — profil technique qui demande un bon équilibre des attributs.`);
        } else {
          lines.push(`Pas de style déclaré — on se base sur les priorités et le profil physique.`);
        }
        if(isExpertA && profile.expertToucher) {
          const toucherLabels = {sec:"Sec & Direct",medium:"Medium",souple:"Souple & Enveloppant"};
          const reactLabels = {explosive:"Explosive",progressive:"Progressive"};
          const poidsLabels = {lourd:"Lourd & Stable",equilibre:"Équilibré",leger:"Léger & Vif"};
          const formeLabels = {diamant:"Diamant",goutte:"Goutte d'eau",ronde:"Ronde",indifferent:"Indifférent"};
          lines.push(`⚡ Mode Pro — Toucher ${toucherLabels[profile.expertToucher]||""}, Réactivité ${reactLabels[profile.expertReactivite]||""}, Poids ${poidsLabels[profile.expertPoids]||""}, Forme ${formeLabels[profile.expertForme]||""}.`);
          lines.push(`Matching par propriétés physiques : mousse, surface, balance, poids.`);
        } else if(priorities.length>0) lines.push(`Priorités : ${priorities.map((p,i)=>`${i+1}. ${p}`).join(", ")}. La 1ère priorité pèse plus dans le scoring.`);
        if(injuries.length>0) lines.push(`⚠ Attention ${injuries.join(", ")} — le confort sera un critère non négociable.`);
        if(isJuniorA&&!isPepiteA) lines.push(`Profil junior : raquettes légères et tolérantes en priorité.`);
        if(isPepiteA) lines.push(`🌟 Jeune Pépite : raquettes junior + adultes légères ≤350g.`);
        if(isExpertA && !profile.expertToucher) lines.push(`⚡ Mode Expert : les priorités dominent le scoring.`);
        lines.push(`Calcul en cours sur ${totalDBCount} raquettes...`);
        lines.push(`Résultats prêts.`);

        return (
        <div style={{position:"fixed",inset:0,background:"#0b0f1a",zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",animation:"fadeIn 0.4s ease"}}>
          <style>{`
            @keyframes analyzeLineIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
            @keyframes analyzePulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
            @keyframes analyzeSpinner { to { transform:rotate(360deg); } }
          `}</style>

          {/* Logo */}
          <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom:24,filter:"drop-shadow(0 8px 24px rgba(249,115,22,0.4))"}}>
            <defs><linearGradient id="logoAnalyze" x1="0" y1="0" x2="44" y2="44"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#ef4444"/></linearGradient></defs>
            <rect width="44" height="44" rx="10" fill="url(#logoAnalyze)"/>
            <ellipse cx="22" cy="18" rx="10" ry="12" stroke="#fff" strokeWidth="2.2" fill="none"/>
            <line x1="22" y1="30" x2="22" y2="38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="33" cy="32" r="3.5" fill="#fff" opacity="0.85"/>
          </svg>

          <div style={{maxWidth:480,width:"100%"}}>
            {lines.map((line,i)=>{
              const isLast = i===lines.length-1;
              const delay = i * 800;
              const totalDuration = lines.length * 800 + 600;
              return <div key={i} style={{
                fontSize: i===0 ? 18 : isLast ? 15 : 13,
                fontWeight: i===0 ? 800 : isLast ? 700 : 500,
                color: i===0 ? "#f1f5f9" : isLast ? "#f97316" : "#94a3b8",
                fontFamily: i===0||isLast ? "'Outfit',sans-serif" : "'Inter',sans-serif",
                marginBottom: i===0 ? 20 : 10,
                textAlign: "center",
                animation: `analyzeLineIn 0.5s ease ${delay}ms both`,
                lineHeight: 1.6,
              }}>{line}</div>;
            })}

            {/* Spinner while lines appear */}
            <div style={{display:"flex",justifyContent:"center",marginTop:20,animation:`analyzeLineIn 0.4s ease ${(lines.length-2)*800}ms both`}}>
              <div style={{width:28,height:28,border:"3px solid rgba(249,115,22,0.2)",borderTopColor:"#f97316",borderRadius:"50%",animation:"analyzeSpinner 0.8s linear infinite"}}/>
            </div>

            {/* Auto-transition to reveal */}
            <div style={{animation:`analyzeLineIn 0.5s ease ${lines.length*800+200}ms both`,textAlign:"center",marginTop:24}}>
              <button onClick={()=>setScreen("reveal")} style={{
                padding:"14px 36px",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
                background:"linear-gradient(135deg,rgba(249,115,22,0.3),rgba(239,68,68,0.2))",
                border:"1.5px solid rgba(249,115,22,0.5)",color:"#f97316",transition:"all 0.3s",
                boxShadow:"0 4px 20px rgba(249,115,22,0.25)",
              }}>
                🏆 Découvrir mes résultats
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ============================================================ */}
      {/* REVEAL SCREEN — Top 3 carousel (one at a time) */}
      {/* ============================================================ */}
      {screen==="reveal"&&(()=>{
        const age = Number(profile.age)||0;
        const ht = Number(profile.height)||0;
        const isJunior = (age>0&&age<15)||(ht>0&&ht<150);
        let pool = isJunior 
          ? getMergedDB().filter(r=>r.category==='junior')
          : (()=>{
              const lvl = profile.level||'Débutant';
              const catMap = {'Débutant':['debutant','intermediaire'],'Intermédiaire':['intermediaire','debutant','avance','expert'],'Avancé':['avance','intermediaire','expert'],'Expert':['expert','avance','intermediaire']};
              return getMergedDB().filter(r=>(catMap[lvl]||['debutant','intermediaire']).includes(r.category));
            })();
        const scored = pool.map(r=>({...r, _gs: computeGlobalScore(r.scores, profile, r)}));
        scored.sort((a,b)=>b._gs-a._gs);
        const top3 = scored.slice(0, 3);
        const prioLabels = (profile.priorityTags||[]).map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);

        const makeVerdict = (r, rank) => {
          const sc = r.scores||{};
          const best2 = ATTRS.filter(a=>sc[a]).sort((a,b)=>(sc[b]||0)-(sc[a]||0)).slice(0,2);
          const pct = (r._gs*10).toFixed(1);
          if(rank===0) return `Ta meilleure option à ${pct}%. ${best2.length>=2?`Elle excelle en ${best2[0]} (${sc[best2[0]]}) et ${best2[1]} (${sc[best2[1]]}).`:""}${prioLabels.length?` Pile sur tes priorités ${prioLabels.join(" et ")}.`:""}`;
          if(rank===1) return `Alternative solide à ${pct}%. ${best2.length>=2?`Point fort : ${best2[0]} à ${sc[best2[0]]}.`:""} Un profil complémentaire au n°1.`;
          return `3ᵉ option à ${pct}%. ${best2.length>=2?`Intéressante pour son ${best2[0]} (${sc[best2[0]]}).`:""} À tester si les deux premières ne conviennent pas.`;
        };

        const medals = ["🥇","🥈","🥉"];
        const rankLabels = ["MEILLEUR CHOIX","2ᵉ CHOIX","3ᵉ CHOIX"];
        const rankColors = ["#f97316","#94a3b8","#cd7f32"];

        const r = top3[revealIdx];
        if(!r) return null;
        const sc = r.scores||{};
        const fyConfig = computeForYou(sc, profile, r);
        const badge = fyConfig==="recommended"?{text:"RECOMMANDÉ",color:"#4CAF50"}:fyConfig==="partial"?{text:"JOUABLE",color:"#FF9800"}:{text:"—",color:"#64748b"};

        return (
        <div style={{position:"fixed",inset:0,background:"#0b0f1a",zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",overflow:"hidden"}}>
          <style>{`
            @keyframes revealCardIn { from { opacity:0; transform:scale(0.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
            @keyframes revealPulse { 0%,100% { box-shadow: 0 0 30px rgba(249,115,22,0.15); } 50% { box-shadow: 0 0 50px rgba(249,115,22,0.35); } }
          `}</style>

          {/* Close button */}
          <button onClick={()=>setScreen("dashboard")} style={{
            position:"absolute",top:16,right:16,width:40,height:40,borderRadius:"50%",
            background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
            color:"#94a3b8",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,
          }}>✕</button>

          {/* Title */}
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:16,color:"#f97316",fontWeight:800,fontFamily:"'Outfit'",letterSpacing:"0.04em",textTransform:"uppercase"}}>🏆 Top 3 de {profileName}</div>
          </div>

          {/* Card container with arrows */}
          <div style={{display:"flex",alignItems:"center",gap:16,maxWidth:"100vw"}}>
            {/* Left arrow */}
            <button onClick={()=>setRevealIdx(i=>Math.max(0,i-1))} disabled={revealIdx===0} style={{
              width:44,height:44,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.12)",
              background:revealIdx>0?"rgba(249,115,22,0.1)":"rgba(255,255,255,0.03)",
              color:revealIdx>0?"#f97316":"#334155",fontSize:22,cursor:revealIdx>0?"pointer":"default",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",
            }}>‹</button>

            {/* Single card */}
            <div key={revealIdx} style={{
              width:340,maxWidth:"75vw",
              background:"rgba(255,255,255,0.04)",
              border:`2px solid ${revealIdx===0?"rgba(249,115,22,0.5)":"rgba(255,255,255,0.1)"}`,
              borderRadius:24,padding:"28px 24px",
              display:"flex",flexDirection:"column",alignItems:"center",gap:14,
              animation:`revealCardIn 0.5s ease both${revealIdx===0?", revealPulse 3s ease infinite":""}`,
            }}>
              <div style={{fontSize:44}}>{medals[revealIdx]}</div>
              <div style={{fontSize:11,fontWeight:700,color:rankColors[revealIdx],textTransform:"uppercase",letterSpacing:"0.08em"}}>{rankLabels[revealIdx]}</div>

              {r.imageUrl&&<img src={r.imageUrl} alt={r.name} style={{width:110,height:110,objectFit:"contain",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.4))"}} onError={e=>{e.target.style.display="none";}}/>}

              <div style={{textAlign:"center"}}>
                <div style={{fontSize:19,fontWeight:800,color:"#f1f5f9",fontFamily:"'Outfit'",lineHeight:1.3}}>{r.name}</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{r.brand} · {r.shape}{r.weight?` · ${r.weight}`:""}</div>
              </div>

              <div style={{fontSize:48,fontWeight:900,fontFamily:"'Outfit'",color:revealIdx===0?"#f97316":"#e2e8f0",lineHeight:1}}>
                {(r._gs*10).toFixed(1)}<span style={{fontSize:20}}>%</span>
              </div>

              <span style={{fontSize:10,fontWeight:700,color:badge.color,background:`${badge.color}18`,border:`1px solid ${badge.color}40`,borderRadius:8,padding:"4px 14px",textTransform:"uppercase"}}>{badge.text}</span>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,width:"100%"}}>
                {ATTRS.map(a=>{
                  const val = sc[a]||0;
                  const isPrio = (profile.priorityTags||[]).some(pid=>{const m={puissance:'Puissance',controle:'Contrôle',confort:'Confort',spin:'Spin',legerete:'Maniabilité',protection:'Confort'};return m[pid]===a;});
                  return <div key={a} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 10px",borderRadius:8,background:isPrio?"rgba(249,115,22,0.08)":"rgba(255,255,255,0.02)"}}>
                    <span style={{fontSize:10,color:isPrio?"#f97316":"#94a3b8",fontWeight:isPrio?700:500}}>{isPrio?"★ ":""}{a}</span>
                    <span style={{fontSize:13,fontWeight:700,color:val>=8?"#4CAF50":val>=6?"#e2e8f0":"#f97316"}}>{val}</span>
                  </div>;
                })}
              </div>

              <p style={{fontSize:11,color:"#94a3b8",lineHeight:1.6,textAlign:"center",margin:0}}>{makeVerdict(r,revealIdx)}</p>

              {r.price&&<div style={{fontSize:10,color:"#475569"}}>💰 {r.price}</div>}
            </div>

            {/* Right arrow */}
            <button onClick={()=>setRevealIdx(i=>Math.min(top3.length-1,i+1))} disabled={revealIdx>=top3.length-1} style={{
              width:44,height:44,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.12)",
              background:revealIdx<top3.length-1?"rgba(249,115,22,0.1)":"rgba(255,255,255,0.03)",
              color:revealIdx<top3.length-1?"#f97316":"#334155",fontSize:22,cursor:revealIdx<top3.length-1?"pointer":"default",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",
            }}>›</button>
          </div>

          {/* Dot indicators */}
          <div style={{display:"flex",gap:8,marginTop:16}}>
            {top3.map((_,i)=><button key={i} onClick={()=>setRevealIdx(i)} style={{
              width:i===revealIdx?20:8,height:8,borderRadius:4,border:"none",cursor:"pointer",padding:0,
              background:i===revealIdx?"#f97316":"rgba(255,255,255,0.15)",transition:"all 0.3s",
            }}/>)}
          </div>

          {/* CTA */}
          <button onClick={()=>setScreen("dashboard")} style={{
            marginTop:20,padding:"12px 32px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
            background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",color:"#94a3b8",transition:"all 0.3s",
          }}>
            Voir l'analyse complète →
          </button>
        </div>
        );
      })()}

      {/* ============================================================ */}
      {/* DASHBOARD SCREEN */}
      {/* ============================================================ */}
      {screen==="dashboard"&&(()=>{
        // Compute Top 3 for this profile
        const age = Number(profile.age)||0;
        const ht = Number(profile.height)||0;
        const isJunior = (age>0&&age<15)||(ht>0&&ht<150);
        let pool = isJunior 
          ? getMergedDB().filter(r=>r.category==='junior')
          : (()=>{
              const lvl = profile.level||'Débutant';
              const catMap = {'Débutant':['debutant','intermediaire'],'Intermédiaire':['intermediaire','debutant','avance','expert'],'Avancé':['avance','intermediaire','expert'],'Expert':['expert','avance','intermediaire']};
              return getMergedDB().filter(r=>(catMap[lvl]||['debutant','intermediaire']).includes(r.category));
            })();
        // Brand preferences — used for display info only, NOT for filtering Top 3
        const brandPref = (profile.brandTags||[]).map(id=>BRAND_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        // Score ALL compatible rackets — unbiased Top 3
        const scored = pool.map(r=>({...r, _gs: computeGlobalScore(r.scores, profile, r), _fy: computeForYou(r.scores, profile, r)}))
          .filter(r=>r._gs > 0);
        scored.sort((a,b)=>b._gs-a._gs);
        const top3 = scored.slice(0, 3);

        // Compute player's ideal weights for radar
        const w = { Puissance:1, Contrôle:1, Confort:1, Spin:1, Maniabilité:1, Tolérance:1 };
        const prioMap = { confort:{Confort:1.5}, polyvalence:{Contrôle:0.5,Maniabilité:0.5,Tolérance:0.5}, puissance:{Puissance:1.5}, controle:{Contrôle:1.5}, spin:{Spin:1.5}, legerete:{Maniabilité:1.5}, protection:{Confort:1.5}, reprise:{Confort:1.5,Tolérance:1.0,Maniabilité:0.5} };
        const ordM2 = [1.4, 1.0, 0.7, 0.5, 0.5];
        (profile.priorityTags||[]).forEach((tag,idx)=>{ const boosts=prioMap[tag]; const m=ordM2[Math.min(idx,ordM2.length-1)]; if(boosts) for(const[k,v] of Object.entries(boosts)) w[k]=(w[k]||1)+v*m; });
        const styleMap = { offensif:{Puissance:0.5}, defensif:{Contrôle:0.5,Tolérance:0.5}, tactique:{Contrôle:0.5,Maniabilité:0.3}, puissant:{Puissance:0.5,Spin:0.3}, veloce:{Maniabilité:0.8}, endurant:{Confort:0.5,Tolérance:0.3}, contre:{Tolérance:0.5,Contrôle:0.3}, polyvalent:{Contrôle:0.3,Tolérance:0.3}, technique:{Contrôle:0.5,Spin:0.3} };
        for (const tag of (profile.styleTags||[])) { const boosts=styleMap[tag]; if(boosts) for(const[k,v] of Object.entries(boosts)) w[k]=(w[k]||1)+v; }
        const maxW = Math.max(...Object.values(w));
        const idealRadar = ATTRS.map(a=>({ attribute: a, Idéal: Math.round((w[a]/maxW)*10*10)/10 }));

        // Profile summary pieces
        const levelColors = {Débutant:"#4CAF50",Intermédiaire:"#FF9800",Avancé:"#ef4444",Compétition:"#9C27B0",Expert:"#9C27B0"};
        const styles = (profile.styleTags||[]).map(id=>STYLE_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const injuries = (profile.injuryTags||[]).filter(t=>t!=="aucune").map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const priorities = (profile.priorityTags||[]).map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
        const hand = profile.hand||"Droitier";
        const side = profile.side||"Droite";
        const isAttacker = (hand==="Droitier"&&side==="Gauche")||(hand==="Gaucher"&&side==="Droite");
        const isFemme_r = (profile.genre||"Homme")==="Femme"; const role = side==="Les deux" ? (isFemme_r?"Polyvalente":"Polyvalent") : isAttacker ? (isFemme_r?"Attaquante":"Attaquant") : (isFemme_r?"Constructrice":"Constructeur");
        const hasSession = rackets.length > 0;
        const fyConfig2 = {recommended:{text:"RECOMMANDÉ",bg:"#1B5E20",border:"#4CAF50",color:"#4CAF50"},partial:{text:"JOUABLE",bg:"#E65100",border:"#FF9800",color:"#FF9800"},no:{text:"DÉCONSEILLÉ",bg:"#B71C1C",border:"#E53935",color:"#E53935"}};

        return (
        <div style={{maxWidth:1020,margin:"0 auto",padding:"0 24px",animation:"fadeIn 0.5s ease"}}>
          {/* Header — compact inline */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:18}}>
            <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0,filter:"drop-shadow(0 4px 12px rgba(249,115,22,0.3))"}}>
              <defs><linearGradient id="logoGradDash" x1="0" y1="0" x2="44" y2="44"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#ef4444"/></linearGradient></defs>
              <rect width="44" height="44" rx="10" fill="url(#logoGradDash)"/>
              <ellipse cx="22" cy="18" rx="10" ry="12" stroke="#fff" strokeWidth="2.2" fill="none"/>
              <line x1="22" y1="30" x2="22" y2="38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="33" cy="32" r="3.5" fill="#fff" opacity="0.85"/>
            </svg>
            <h1 style={{fontFamily:"'Outfit'",fontSize:24,fontWeight:800,background:"linear-gradient(135deg,#f97316,#ef4444,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0}}>PADEL ANALYZER</h1>
          </div>

          {/* Profile card — full width, compact */}
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"16px 22px",marginBottom:20,animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,rgba(249,115,22,0.3),rgba(239,68,68,0.2))",border:"2px solid rgba(249,115,22,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#f97316",flexShrink:0}}>
                {profileName.charAt(0).toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:18,fontWeight:700,color:"#f1f5f9"}}>{profileName}</span>
                  {profile.level&&<span style={{fontSize:10,fontWeight:600,color:levelColors[profile.level]||"#64748b",background:`${levelColors[profile.level]||"#64748b"}18`,padding:"3px 10px",borderRadius:8,textTransform:"uppercase"}}>{profile.level}</span>}
                  {(()=>{const m=detectPlayerMode(profile); const cfg={expert:{text:"⚡ Expert",bg:"rgba(168,85,247,0.15)",border:"rgba(168,85,247,0.4)",color:"#c084fc"},pepite:{text:"🌟 Pépite",bg:"rgba(59,130,246,0.15)",border:"rgba(59,130,246,0.4)",color:"#60a5fa"},junior:{text:"🧒 Junior",bg:"rgba(59,130,246,0.15)",border:"rgba(59,130,246,0.4)",color:"#60a5fa"}}; const c=cfg[m]; return c?<span style={{fontSize:10,fontWeight:700,color:c.color,background:c.bg,border:`1px solid ${c.border}`,padding:"3px 10px",borderRadius:8}}>{c.text}</span>:null;})()}
                  <span style={{fontSize:11,color:"#94a3b8"}}>{hand} · Côté {side}</span>
                  <span style={{fontSize:11,color:"#a5b4fc",fontWeight:600}}>🎯 {role}</span>
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
                  {styles.map(s=><span key={s} style={{fontSize:10,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:8,padding:"2px 8px",color:"#a5b4fc"}}>{s}</span>)}
                  {priorities.map(p=><span key={p} style={{fontSize:10,background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.2)",borderRadius:8,padding:"2px 8px",color:"#f97316"}}>{p}</span>)}
                  {injuries.map(inj=><span key={inj} style={{fontSize:10,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"2px 8px",color:"#ef4444"}}>🩹 {inj}</span>)}
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={()=>{if(cameFromAdminRef.current){cameFromAdminRef.current=false;setScreen("admin");}else{setScreen("home");}}} style={{background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"5px 8px",color:"#64748b",fontSize:10,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}} title={cameFromAdminRef.current?"Retour admin":"Changer de profil"}>{cameFromAdminRef.current?"🔙":"👥"}</button>
                <button onClick={disconnect} style={{background:"none",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"5px 8px",color:"#64748b",fontSize:10,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}} title="Déconnexion">⏻</button>
              </div>
            </div>
          </div>

          {/* ===== MAIN 2-COLUMN LAYOUT ===== */}
          <div style={{display:"flex",gap:20,marginBottom:20,alignItems:"stretch"}}>

            {/* LEFT COLUMN — Radar + Stats */}
            <div style={{flex:"0 0 400px",display:"flex",flexDirection:"column",gap:12}}>
              {/* Radar */}
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"14px 12px",flex:1,animation:"fadeIn 0.4s ease"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.06em",textTransform:"uppercase",textAlign:"center",marginBottom:4,marginTop:0}}>📊 Raquette idéale pour {profileName}</p>
                <ResponsiveContainer width="100%" height={195}>
                  <RadarChart data={idealRadar} margin={{top:10,right:34,bottom:8,left:34}}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                    <PolarAngleAxis dataKey="attribute" tick={{fill:"#94a3b8",fontSize:10}}/>
                    <PolarRadiusAxis angle={90} domain={[0,10]} tick={false} axisLine={false}/>
                    <Radar name="Idéal" dataKey="Idéal" stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {/* Stats row */}
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:800,color:"#f97316",fontFamily:"'Outfit'"}}>{pool.length}</div>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Compatibles</div>
                </div>
                <div style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:800,color:"#4CAF50",fontFamily:"'Outfit'"}}>{scored.filter(r=>r._fy==="recommended").length}</div>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Recommandées</div>
                </div>
                <div style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:800,color:"#a5b4fc",fontFamily:"'Outfit'"}}>{top3.length>0?top3[0]._gs.toFixed(1):"—"}<span style={{fontSize:11,color:"#64748b"}}>/10</span></div>
                  <div style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Meilleur score</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — Top 3 + Explanation */}
            <div style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"18px 20px",animation:"fadeIn 0.5s ease",display:"flex",flexDirection:"column"}}>
              <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.06em",textTransform:"uppercase",textAlign:"center",marginTop:0,marginBottom:4}}>🏆 Top 3 absolu pour {profileName}</p>
              <p style={{fontSize:10,color:"#475569",textAlign:"center",margin:"0 0 14px",lineHeight:1.4}}>Sur {scored.length} raquettes compatibles{brandPref.length>0?<span> · Toutes marques confondues</span>:""}</p>
              <div style={{display:"flex",flexDirection:"column",gap:10,flex:1}}>
                {top3.map((r, i)=>{
                  const fy = fyConfig2[r._fy]||fyConfig2.partial;
                  const medals = ["🥇","🥈","🥉"];
                  return (
                    <div key={r.id} onClick={()=>openRacketSheet(r,"dashboard")} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background: i===0?"rgba(249,115,22,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${i===0?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.06)"}`,borderRadius:14,transition:"all 0.2s",cursor:"pointer"}}>
                      <div style={{fontSize:22,flexShrink:0,width:28,textAlign:"center"}}>{medals[i]}</div>
                      {r.imageUrl&&<img src={proxyImg(r.imageUrl)} alt="" style={{width:48,height:48,objectFit:"contain",borderRadius:8,background:"rgba(255,255,255,0.06)",flexShrink:0}} onError={e=>{e.target.style.display='none'}}/>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
                        <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{r.brand} · {r.shape} · {r.weight}</div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                          <span style={{fontSize:9,fontWeight:600,color:fy.color,background:`${fy.bg}30`,border:`1px solid ${fy.border}40`,borderRadius:6,padding:"2px 7px",textTransform:"uppercase"}}>{fy.text}</span>
                          {r.price&&r.price!=="—"&&<span style={{fontSize:10,color:"#64748b"}}>{r.price}</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>
                        <div style={{fontSize:22,fontWeight:800,color: i===0?"#f97316":"#cbd5e1",fontFamily:"'Outfit'"}}>{r._gs.toFixed(1)}</div>
                        <div style={{fontSize:8,color:"#64748b",textTransform:"uppercase"}}>Score</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Explanation — compact */}
              <div style={{marginTop:12,padding:"10px 14px",background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:12}}>
                <p style={{fontSize:10,color:"#a5b4fc",margin:"0 0 3px",fontWeight:600}}>💡 Comment lire ce classement ?</p>
                <p style={{fontSize:10,color:"#64748b",margin:0,lineHeight:1.6}}>Calculé sur {totalDBCount} raquettes en croisant profil, style et priorités. Lance l'analyse détaillée pour les scores par critère, radars comparatifs et l'Arène.</p>
              </div>
            </div>
          </div>

          {/* COACH DIAGNOSTIC — contradiction notes */}
          {(()=>{
            const coachNotes = detectProfileContradictions(profile);
            if (!coachNotes.length) return null;
            return <div style={{marginBottom:14,animation:"fadeIn 0.8s ease"}}>
              {coachNotes.map((note,i)=><div key={i} style={{
                background:note.severity==="high"?"rgba(251,191,36,0.08)":"rgba(99,102,241,0.08)",
                border:`1px solid ${note.severity==="high"?"rgba(251,191,36,0.25)":"rgba(99,102,241,0.2)"}`,
                borderRadius:14,padding:"14px 16px",marginBottom:i<coachNotes.length-1?8:0,
              }}>
                <div style={{fontSize:12,fontWeight:700,color:note.severity==="high"?"#fbbf24":"#a5b4fc",marginBottom:6,letterSpacing:"-0.01em"}}>
                  {note.severity==="high"?"⚡":"💡"} Note du coach
                </div>
                <p style={{fontSize:11,color:"#cbd5e1",margin:0,lineHeight:1.5}}>{note.text}</p>
              </div>)}
            </div>;
          })()}

          {/* BOTTOM ROW — Analyze button + Action buttons */}
          <div style={{display:"flex",gap:12,marginBottom:14,animation:"fadeIn 0.6s ease"}}>
            <button onClick={()=>launchAnalysis(top3)} style={{flex:"1 1 220px",padding:"14px",background:"linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))",border:"1px solid rgba(249,115,22,0.35)",borderRadius:14,color:"#f97316",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.2s",letterSpacing:"-0.01em",textAlign:"center"}}>
              📊 Analyser ce Top 3 en détail
            </button>
            <button onClick={()=>{launchAnalysis(top3);setTimeout(()=>setPanel("suggest"),50);}} style={{flex:"1 1 180px",padding:"14px 16px",background:"rgba(76,175,80,0.08)",border:"1px solid rgba(76,175,80,0.25)",borderRadius:14,color:"#4CAF50",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.2s",textAlign:"center"}}>
              <div>🎯 Suggère-moi d'autres</div>
              <div style={{fontSize:9,color:"#64748b",fontWeight:400,marginTop:3}}>{brandPref.length>0?`Priorité ${brandPref.join(", ")}`:"Recommandations IA"}</div>
            </button>
            <button onClick={()=>{goToApp();}} style={{flex:"1 1 180px",padding:"14px 16px",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:14,color:"#a5b4fc",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.2s",textAlign:"center"}}>
              <div>{hasSession ? "📊 Reprendre l'analyse" : "📊 Explorer la base"}</div>
              <div style={{fontSize:9,color:"#64748b",fontWeight:400,marginTop:3}}>{hasSession?"Session en cours":"Comparer, radars, PDF"}</div>
            </button>
            <button onClick={()=>{setWizardStep(0);setPanel("profile");setScreen("app");}} style={{flex:"0 1 150px",padding:"14px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:"#94a3b8",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.2s",textAlign:"center"}}>
              <div>✏️ Modifier profil</div>
              <div style={{fontSize:9,color:"#64748b",fontWeight:400,marginTop:3}}>Affiner les résultats</div>
            </button>
          </div>

          {/* Footer */}
          <div style={{fontSize:7,color:"#334155",letterSpacing:"0.05em",textAlign:"center",marginTop:8}}>
            <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> V12 · {totalDBCount} raquettes · Scoring hybride calibré
          </div>
        </div>
        );
      })()}

      {/* ============================================================ */}
      {/* APP SCREEN */}
      {/* ============================================================ */}
      {screen==="app"&&<>
      <div style={{textAlign:"center",marginBottom:28,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:6}}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0,filter:"drop-shadow(0 4px 12px rgba(249,115,22,0.3))"}}>
            <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#ef4444"/></linearGradient></defs>
            <rect width="44" height="44" rx="10" fill="url(#logoGrad)"/>
            <ellipse cx="22" cy="18" rx="10" ry="12" stroke="#fff" strokeWidth="2.2" fill="none"/>
            <line x1="22" y1="10" x2="22" y2="26" stroke="#fff" strokeWidth="1.2" opacity="0.4"/>
            <line x1="14" y1="18" x2="30" y2="18" stroke="#fff" strokeWidth="1.2" opacity="0.4"/>
            <line x1="22" y1="30" x2="22" y2="38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="33" cy="32" r="3.5" fill="#fff" opacity="0.85"/>
          </svg>
          <h1 style={{fontFamily:"'Outfit'",fontSize:22,fontWeight:800,background:"linear-gradient(135deg,#f97316,#ef4444,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0,letterSpacing:"-0.02em"}}>PADEL ANALYZER</h1>
        </div>
        <p style={{color:"#475569",fontSize:10,margin:0,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:500}}>Recherche web · Notation calibrée · Profil personnalisable</p>
        <div style={{fontSize:8,color:"#334155",marginTop:4,fontFamily:"'Outfit'",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span>V12</span><span style={{background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.2)",borderRadius:10,padding:"1px 7px",color:"#f97316",fontSize:8,fontWeight:600}}>🗃️ {totalDBCount}</span></div>
        {/* Profile bar */}
        {profileName&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:20,padding:"4px 12px 4px 6px"}}>
            <div style={{width:22,height:22,borderRadius:7,background:"linear-gradient(135deg,rgba(249,115,22,0.25),rgba(239,68,68,0.2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#f97316",flexShrink:0}}>{profileName.charAt(0).toUpperCase()}</div>
            <span style={{fontSize:11,fontWeight:600,color:"#a5b4fc"}}>{profileName}</span>
          </div>
          <button onClick={goToDashboard} style={{background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.2)",borderRadius:20,padding:"4px 10px",color:"#f97316",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:11}}>🏠</span> Dashboard
          </button>
          <button onClick={disconnect} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"4px 10px",color:"#64748b",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:12}}>⏻</span> Déconnexion
          </button>
        </div>}
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {[["suggest","🎯 Suggère-moi"],["add","+ Ajouter"],["profile","👤 Profil"],["manage","🗑 Gérer"]].map(([k,l])=>(
          <button key={k} onClick={()=>{if(k==="profile")setWizardStep(0);setPanel(p=>p===k?null:k);}} style={{...S.btn(panel===k),borderRadius:20}}>{l}</button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* SUGGEST PANEL */}
      {/* ============================================================ */}
      {panel==="suggest"&&<div style={S.card}>
        <div style={S.title}>🎯 RAQUETTES SUGGÉRÉES POUR TON PROFIL</div>
        <div style={{background:"rgba(249,115,22,0.06)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:10,padding:10,marginBottom:10}}>
          <p style={{fontSize:10,color:"#f97316",fontWeight:700,margin:"0 0 4px"}}>Ton profil :</p>
          <p style={{fontSize:9,color:"#94a3b8",margin:0,lineHeight:1.5}}>{profileText}</p>
        </div>

        {!suggestResults&&!loading&&<div>
          <p style={{fontSize:10,color:"#64748b",margin:"0 0 10px",lineHeight:1.4}}>Recherche des raquettes les plus adaptées à ton profil : <span style={{color:"#f97316",fontWeight:600}}>⭐ Coups de cœur</span> (meilleures correspondances) et <span style={{color:"#fbbf24",fontWeight:600}}>⚡ Alternatives {profile.expertToucher?"Sensations":"Priorité"}</span> (orientées {profile.expertToucher?`toucher ${profile.expertToucher}, réactivité ${profile.expertReactivite||"explosive"}`:profile.priorityTags.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean).join(', ')||"tes priorités"}). Coche celles qui t'intéressent puis valide en un clic.</p>
          <button onClick={suggestRackets} style={S.btnGreen}>🔍 Lancer la recherche</button>
        </div>}
        {loadMsg&&<div style={{fontSize:11,color:"#f97316",marginTop:10,display:"flex",alignItems:"center",gap:6}}>
          <span style={{display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}>⏳</span>
          <span>{loadMsg}</span>
          <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>
        </div>}
        {error&&<div style={{fontSize:11,color:"#ef4444",marginTop:8,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"8px 10px",lineHeight:1.4}}>{error}</div>}
        {batchProgress&&<div style={{fontSize:12,color:"#4CAF50",marginTop:8,fontWeight:600}}>{batchProgress}</div>}

        {suggestResults&&<div style={{marginTop:6}}>
          {(()=>{
            const hearts = suggestResults.filter(s=>s.category==="heart");
            const prios = suggestResults.filter(s=>s.category==="priority");
            // Fallback if API didn't use categories
            const hasCategories = hearts.length>0 || prios.length>0;
            const topPicks = hasCategories ? hearts : suggestResults.slice(0,4);
            const prioAlts = hasCategories ? prios : [];
            const others = hasCategories ? suggestResults.filter(s=>s.category!=="heart"&&s.category!=="priority") : suggestResults.slice(4);
            const prioLabels = profile.priorityTags.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            const isExpertFeelS = !!profile.expertToucher;
            return <>
              {topPicks.length>0&&<>
                <p style={{fontSize:11,color:"#f97316",fontWeight:700,marginBottom:6}}>⭐ Coups de cœur — meilleures correspondances :</p>
                {topPicks.map(s=>{
                  const ri = suggestResults.indexOf(s);
                  return renderSuggestCard(s, ri, suggestChecked.has(ri), true);
                })}
              </>}
              {prioAlts.length>0&&<>
                <p style={{fontSize:11,color:"#fbbf24",fontWeight:700,marginBottom:4,marginTop:14}}>⚡ Alternatives {isExpertFeelS?"Sensations":"Priorité"} — {isExpertFeelS?`toucher ${profile.expertToucher}`:prioLabels.join(', ')} :</p>
                <p style={{fontSize:9,color:"#64748b",marginBottom:6}}>Raquettes orientées vers tes priorités, confort parfois limité — à tester avant d'acheter.</p>
                {prioAlts.map(s=>{
                  const ri = suggestResults.indexOf(s);
                  return renderSuggestCard(s, ri, suggestChecked.has(ri), false);
                })}
              </>}
              {others.length>0&&<>
                <p style={{fontSize:11,color:"#94a3b8",fontWeight:700,marginBottom:6,marginTop:12}}>📋 Autres suggestions :</p>
                {others.map(s=>{
                  const ri = suggestResults.indexOf(s);
                  return renderSuggestCard(s, ri, suggestChecked.has(ri), false);
                })}
              </>}
            </>;
          })()}

          {/* Select all / deselect all + batch add button */}
          {!addingBatch&&suggestResults&&suggestResults.length>0&&<div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
            <button onClick={()=>{
              const allIdxs = suggestResults.map((_,i)=>i).filter(i=>!suggestResults[i]._added);
              const allSelected = allIdxs.every(i=>suggestChecked.has(i));
              if(allSelected) setSuggestChecked(new Set());
              else setSuggestChecked(new Set(allIdxs));
            }} style={{...S.btn(false),padding:"8px 14px",fontSize:11}}>
              {suggestResults.filter((_,i)=>!suggestResults[i]._added).every((_,i)=>suggestChecked.has(i))?"☐ Tout désélectionner":"☑ Tout sélectionner"}
            </button>
            {suggestChecked.size>0&&<button onClick={addCheckedSuggestions} style={{...S.btnGreen,flex:1,padding:"8px 14px"}}>
              ✅ Ajouter {suggestChecked.size} raquette{suggestChecked.size>1?"s":""} au comparateur
            </button>}
          </div>}
          {addingBatch&&<div style={{textAlign:"center",padding:"12px 0",color:"#f97316",fontSize:12,fontWeight:600}}>{batchProgress}</div>}

          <button onClick={()=>{setSuggestResults(null);setSuggestChecked(new Set());setError("");}} style={{...S.btn(false),marginTop:8,width:"100%",padding:"8px 0",fontSize:11}}>🔄 Relancer une nouvelle recherche</button>
        </div>}
      </div>}

      {/* ============================================================ */}
      {/* ADD PANEL (manual search) */}
      {/* ============================================================ */}
      {panel==="add"&&<div style={S.card}>
        <div style={S.title}>🔍 RECHERCHER UNE RAQUETTE</div>
        <p style={{fontSize:10,color:"#64748b",margin:"0 0 8px",lineHeight:1.4}}>Tape un nom même approximatif : "nox tapia 12k", "bullpadel paquito", "babolat lebron"...</p>
        <div style={{display:"flex",gap:6}}>
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&searchRackets()} placeholder="Ex: nox tapia 12k, adidas metalbone..." style={{...S.input,flex:1}}/>
          <button onClick={searchRackets} disabled={loading||!searchQ.trim()} style={{...S.btn(true),opacity:loading?0.5:1,minWidth:80}}>{loading&&!suggestions?"...":"Chercher"}</button>
        </div>
        {loadMsg&&<div style={{fontSize:11,color:"#f97316",marginTop:8}}>{loadMsg}</div>}
        {error&&<div style={{fontSize:11,color:"#ef4444",marginTop:8}}>{error}</div>}
        {suggestions&&<div style={{marginTop:10}}>
          <p style={{fontSize:11,color:"#f97316",fontWeight:700,marginBottom:8}}>📋 Résultats — clique pour voir la fiche technique :</p>
          {suggestions.map((s,i)=>{
            const isExpanded = addDetail === i;
            // Try to match with DB
            const nameLower = (s.name||"").toLowerCase();
            const dbMatch = getMergedDB().find(r=>r.name.toLowerCase()===nameLower) || getMergedDB().find(r=>nameLower.includes((r.shortName||r.name).toLowerCase().slice(0,12))||(r.shortName||r.name).toLowerCase().includes(nameLower.slice(0,12)));
            const sc = dbMatch?.scores||{};
            const hasScores = dbMatch && Object.keys(sc).length>0;
            const gs = hasScores ? computeGlobalScore(sc, profile, dbMatch) : null;
            const fyConfig = hasScores ? computeForYou(sc, profile, dbMatch) : null;
            const badge = fyConfig==="recommended"?{text:"RECOMMANDÉ",color:"#4CAF50"}:fyConfig==="partial"?{text:"JOUABLE",color:"#FF9800"}:fyConfig==="no"?{text:"PEU ADAPTÉ",color:"#64748b"}:null;
            return (
            <div key={i} style={{
              background:s._selected?"rgba(249,115,22,0.15)":isExpanded?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.04)",
              border:`1px solid ${s._selected?"#f97316":isExpanded?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.1)"}`,
              borderRadius:12,marginBottom:8,overflow:"hidden",
              cursor:s._disabled?"default":"pointer",opacity:s._disabled&&!s._selected?0.3:1,
              transition:"all 0.2s",
            }}>
              {/* Header row — click to expand */}
              <div onClick={()=>!s._disabled&&setAddDetail(isExpanded?null:i)} style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
                {dbMatch?.imageUrl&&<img src={dbMatch.imageUrl} alt={s.name} style={{width:38,height:38,objectFit:"contain",borderRadius:6,flexShrink:0,background:"rgba(255,255,255,0.04)"}} onError={e=>{e.target.style.display="none";}}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{s.name}</div>
                  <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{s.brand} · {s.shape} · {s.weight}</div>
                </div>
                {gs!==null&&<div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:18,fontWeight:800,fontFamily:"'Outfit'",color:gs>=7?"#4CAF50":gs>=5?"#f97316":"#ef4444"}}>{(gs*10).toFixed(0)}%</div>
                  <div style={{fontSize:7,color:"#64748b",textTransform:"uppercase"}}>pertinence</div>
                </div>}
                <span style={{fontSize:12,color:"#475569",flexShrink:0,transition:"transform 0.2s",transform:isExpanded?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
              </div>

              {/* Expanded tech sheet */}
              {isExpanded&&<div style={{padding:"0 12px 12px",borderTop:"1px solid rgba(255,255,255,0.05)",animation:"fadeIn 0.3s ease"}}>
                {/* Badge pertinence */}
                {badge&&profileName&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,marginBottom:8}}>
                  <span style={{fontSize:10,fontWeight:700,color:badge.color,background:`${badge.color}18`,border:`1px solid ${badge.color}40`,borderRadius:8,padding:"3px 10px",textTransform:"uppercase"}}>{badge.text}</span>
                  <span style={{fontSize:10,color:"#64748b"}}>pour {profileName}</span>
                </div>}

                {hasScores ? <>
                  {/* Scores grid */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                    {ATTRS.map(a=>{
                      const val = sc[a]||0;
                      const isPrio = (profile.priorityTags||[]).some(pid=>{const m={puissance:'Puissance',controle:'Contrôle',confort:'Confort',spin:'Spin',legerete:'Maniabilité',protection:'Confort'};return m[pid]===a;});
                      return <div key={a} style={{textAlign:"center",padding:"6px 4px",borderRadius:8,background:isPrio?"rgba(249,115,22,0.1)":"rgba(255,255,255,0.02)"}}>
                        <div style={{fontSize:16,fontWeight:800,color:val>=8?"#4CAF50":val>=6?"#e2e8f0":"#f97316",fontFamily:"'Outfit'"}}>{val}</div>
                        <div style={{fontSize:8,color:isPrio?"#f97316":"#64748b",fontWeight:isPrio?700:500,marginTop:2}}>{isPrio?"★ ":""}{a}</div>
                      </div>;
                    })}
                  </div>

                  {/* Tech specs */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:8}}>
                    {[["Forme",dbMatch.shape],["Poids",dbMatch.weight],["Équilibre",dbMatch.balance],["Surface",dbMatch.surface],["Noyau",dbMatch.core],["Prix",dbMatch.price],["Année",dbMatch.year]].map(([k,v])=>
                      v&&v!=="—"&&<div key={k} style={{fontSize:9,color:"#94a3b8",padding:"2px 0"}}>
                        <span style={{color:"#64748b"}}>{k}:</span> <span style={{fontWeight:600,color:"#cbd5e1"}}>{v}</span>
                      </div>
                    )}
                  </div>

                  {/* Pour qui ? */}
                  {dbMatch.editorial&&<div style={{position:"relative",padding:"12px 14px 12px 24px",background:"rgba(255,255,255,0.02)",borderRadius:10,borderLeft:"3px solid rgba(249,115,22,0.3)",marginBottom:8}}>
                    <div style={{position:"absolute",top:4,left:8,fontSize:20,color:"rgba(249,115,22,0.15)",fontFamily:"Georgia"}}>"</div>
                    <p style={{fontSize:11,color:"#cbd5e1",lineHeight:1.6,margin:0,fontStyle:"italic"}}>{dbMatch.editorial}</p>
                  </div>}

                  {(()=>{
                    const dynText = profileName ? generateDynamicTargetProfile(dbMatch, {...profile, _name: profileName}) : null;
                    const text = dynText || dbMatch.targetProfile;
                    if (!text) return null;
                    const isDyn = !!dynText;
                    // In compact view, show only first 2 sentences
                    const shortText = isDyn ? text.split('. ').slice(0, 2).join('. ') + '.' : text;
                    return <div style={{padding:"8px 12px",background:isDyn?"rgba(249,115,22,0.05)":"rgba(76,175,80,0.05)",borderRadius:10,border:`1px solid ${isDyn?"rgba(249,115,22,0.1)":"rgba(76,175,80,0.1)"}`,marginBottom:8}}>
                      <span style={{fontSize:8,color:isDyn?"#f97316":"#4CAF50",fontWeight:700,textTransform:"uppercase"}}>{isDyn?`🎯 Pour ${profileName} : `:"🎯 S'adresse à : "}</span>
                      <span style={{fontSize:10,color:"#94a3b8"}}>{safeBold(shortText, "#cbd5e1")}</span>
                    </div>;
                  })()}

                  {dbMatch.techHighlights&&dbMatch.techHighlights.length>0&&<div style={{marginBottom:8}}>
                    {dbMatch.techHighlights.slice(0,3).map((h,hi)=>(
                      <div key={hi} style={{padding:"4px 10px",marginBottom:2,borderRadius:6,background:"rgba(255,255,255,0.02)",display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
                        <span style={{fontSize:8,color:"#64748b",fontWeight:600}}>{h.label}</span>
                        <span style={{fontSize:9,color:"#e2e8f0",fontWeight:700,fontFamily:"'Outfit'",whiteSpace:"nowrap"}}>{h.value}</span>
                      </div>
                    ))}
                  </div>}

                  {!dbMatch.editorial&&<p style={{fontSize:11,color:"#94a3b8",lineHeight:1.6,margin:"0 0 8px",padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:10,borderLeft:"3px solid rgba(249,115,22,0.3)"}}>
                    🎯 {generateRacketDescription(dbMatch)}
                  </p>}
                </> : <p style={{fontSize:10,color:"#64748b",margin:"10px 0 8px",lineHeight:1.4}}>{s.description||"Raquette non référencée dans la base locale. Les scores ne sont pas disponibles."}</p>}

                {/* Add button */}
                {!s._selected&&!s._disabled&&<button onClick={(e)=>{e.stopPropagation();selectSuggestion(i);setAddDetail(null);}} style={{
                  width:"100%",padding:"10px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
                  background:"linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.12))",
                  border:"1px solid rgba(249,115,22,0.4)",color:"#f97316",transition:"all 0.2s",marginTop:4,
                }}>+ Ajouter au comparateur</button>}
                {s._selected&&<div style={{textAlign:"center",padding:"8px",fontSize:11,color:"#4CAF50",fontWeight:600}}>✅ Ajoutée au comparateur</div>}
              </div>}
            </div>
            );
          })}
        </div>}
      </div>}

      {/* ============================================================ */}
      {/* PROFILE PANEL — WIZARD */}
      {/* ============================================================ */}
      {panel==="profile"&&<div style={S.card}>
        {/* Wizard progress bar */}
        {(()=>{
          const STEPS = [
            {icon:"👤",label:"Identité"},
            {icon:"🎾",label:"Jeu"},
            {icon:"🩹",label:"Corps"},
            {icon:"🎯",label:detectPlayerMode(profile)==="expert"?"Sensations":"Priorités"},
          ];
          return <div style={{marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",padding:"0 4px"}}>
              {/* Connecting line */}
              <div style={{position:"absolute",top:16,left:24,right:24,height:2,background:"rgba(255,255,255,0.06)",borderRadius:1,zIndex:0}}/>
              <div style={{position:"absolute",top:16,left:24,height:2,background:"linear-gradient(90deg,#f97316,#ef4444)",borderRadius:1,zIndex:1,transition:"width 0.4s cubic-bezier(.4,0,.2,1)",width:`${(wizardStep/(STEPS.length-1))*Math.max(0,(100-16))}%`}}/>
              {STEPS.map((s,i)=>(
                <button key={i} onClick={()=>setWizardStep(i)} style={{
                  display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:0,zIndex:2,fontFamily:"inherit",
                }}>
                  <div style={{
                    width:32,height:32,borderRadius:10,
                    background:i<=wizardStep?"linear-gradient(135deg,rgba(249,115,22,0.25),rgba(239,68,68,0.2))":"rgba(255,255,255,0.04)",
                    border:`2px solid ${i<=wizardStep?"#f97316":"rgba(255,255,255,0.1)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
                    transition:"all 0.3s ease",
                    boxShadow:i===wizardStep?"0 0 12px rgba(249,115,22,0.3)":"none",
                    transform:i===wizardStep?"scale(1.1)":"scale(1)",
                  }}>{s.icon}</div>
                  <span style={{fontSize:9,fontWeight:i===wizardStep?700:500,color:i<=wizardStep?"#f97316":"#475569",transition:"color 0.3s ease"}}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>;
        })()}


        {/* STEP 0: Identité */}
        {wizardStep===0&&<div style={{animation:"fadeIn 0.3s ease"}}>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:4,fontFamily:"'Outfit'"}}>👤 Qui es-tu ?</div>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 14px",lineHeight:1.5}}>{groupRole==="vendeur"?"Ces infos permettent d'adapter les recommandations au gabarit et au niveau du joueur.":"Ces infos permettent d'adapter les recommandations à ton gabarit et ton niveau."}</p>
          
          <div style={{marginBottom:12}}>
            <label style={S.label}>Nom du profil</label>
            <input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Ex: Bidou, Noah, Maman..." style={{...S.input,fontSize:13,padding:"11px 14px"}}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            <div><label style={S.label}>Âge</label>
            <input type="number" value={profile.age} onChange={e=>setProfile(p=>({...p,age:Number(e.target.value)}))} placeholder="49" style={S.input}/></div>
            <div><label style={S.label}>Taille (cm)</label>
            <input type="number" value={profile.height} onChange={e=>setProfile(p=>({...p,height:Number(e.target.value)}))} placeholder="175" style={S.input}/></div>
            <div><label style={S.label}>Poids (kg)</label>
            <input type="number" value={profile.weight} onChange={e=>setProfile(p=>({...p,weight:Number(e.target.value)}))} placeholder="80" style={S.input}/></div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div><label style={S.label}>Genre</label>
            <select value={profile.genre||"Homme"} onChange={e=>setProfile(p=>({...p,genre:e.target.value}))} style={S.select}>
              <option value="Homme">Homme</option><option value="Femme">Femme</option>
            </select></div>
            <div><label style={S.label}>Condition</label>
            <select value={profile.fitness||"actif"} onChange={e=>{
              const v=e.target.value;
              setProfile(p=>{
                const u={...p,fitness:v};
                if(v!=="athletique"&&(p.level||"").toLowerCase().includes("expert")) u.level="Avancé";
                return u;
              });
            }} style={S.select}>
              {FITNESS_OPTIONS.map(o=>(<option key={o.value} value={o.value}>{o.label}</option>))}
            </select></div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div><label style={S.label}>Niveau</label>
            <select value={profile.level} onChange={e=>setProfile(p=>({...p,level:e.target.value}))} style={S.select}>
              {LEVEL_OPTIONS.map(o=>{
                const disabled = o.value==="Expert"&&(profile.fitness||"actif").toLowerCase()!=="athletique";
                return <option key={o.value} value={o.value} disabled={disabled}>{o.label} — {o.desc}{disabled?" (nécessite Athlétique)":""}</option>;
              })}
            </select></div>
            <div><label style={S.label}>Fréquence</label>
            <select value={profile.frequency} onChange={e=>setProfile(p=>({...p,frequency:e.target.value}))} style={S.select}>
              {FREQ_OPTIONS.map(o=>(<option key={o.value} value={o.value}>{o.label} — {o.desc}</option>))}
            </select></div>
          </div>

          {/* Expert mode hint */}
          {(profile.fitness||"").toLowerCase()==="athletique"&&!(profile.level||"").includes("Expert")&&Number(profile.age)>=15&&
            <div style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:8,padding:"6px 10px",marginBottom:12,fontSize:10,color:"#c084fc",fontWeight:500,cursor:"pointer"}}
              onClick={()=>setProfile(p=>({...p,level:"Expert"}))}>
              💡 Condition Athlétique détectée → le <strong>Mode Expert</strong> est disponible ! <span style={{textDecoration:"underline"}}>Activer</span>
            </div>
          }

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <div><label style={S.label}>Main</label>
            <select value={profile.hand} onChange={e=>setProfile(p=>({...p,hand:e.target.value}))} style={S.select}>
              {HAND_OPTIONS.map(o=>(<option key={o} value={o}>{o}</option>))}
            </select></div>
            <div><label style={S.label}>Côté de jeu</label>
            <select value={profile.side} onChange={e=>setProfile(p=>({...p,side:e.target.value}))} style={S.select}>
              {SIDE_OPTIONS.map(o=>(<option key={o} value={o}>{o}</option>))}
            </select></div>
            <div><label style={S.label}>Compétition</label>
            <select value={profile.competition?"oui":"non"} onChange={e=>setProfile(p=>({...p,competition:e.target.value==="oui"}))} style={S.select}>
              <option value="non">Non</option><option value="oui">Oui</option>
            </select></div>
          </div>

          {/* Junior/Senior indicators */}
          {((Number(profile.age)>0&&Number(profile.age)<15))&&
            <div style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:8,padding:"8px 10px",marginTop:12,fontSize:10,color:"#60a5fa",fontWeight:600}}>
              🧒 Profil junior détecté — recommandations adaptées
            </div>
          }
          {detectPlayerMode(profile)==="pepite"&&
            <div style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:8,padding:"8px 10px",marginTop:12,fontSize:10,color:"#60a5fa",fontWeight:700}}>
              🌟 Jeune Pépite — accès aux raquettes adultes légères !
            </div>
          }
          {detectPlayerMode(profile)==="expert"&&
            <div style={{background:"rgba(168,85,247,0.1)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:8,padding:"8px 10px",marginTop:12,fontSize:10,color:"#c084fc",fontWeight:700}}>
              ⚡ Mode Expert (Tapia) — priorités dominent
            </div>
          }
        </div>}

        {/* STEP 1: Style de jeu */}
        {wizardStep===1&&<div style={{animation:"fadeIn 0.3s ease"}}>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:4,fontFamily:"'Outfit'"}}>🎾 Comment tu joues ?</div>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 14px",lineHeight:1.5}}>Ton style de jeu influence directement quels critères sont prioritaires dans le scoring. Sélectionne tout ce qui te correspond.</p>
          
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
            {STYLE_TAGS.map(t=>{
              const sel = profile.styleTags.includes(t.id);
              return <button key={t.id} onClick={()=>toggleTag("styleTags",t.id)} className="pa-tag" style={{
                padding:"10px 14px",borderRadius:12,
                background:sel?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.03)",
                border:`1.5px solid ${sel?"#f97316":"rgba(255,255,255,0.08)"}`,
                color:sel?"#f97316":"#94a3b8",fontSize:12,fontWeight:sel?700:500,cursor:"pointer",fontFamily:"inherit",
                transition:"all 0.2s ease",textAlign:"left",
              }}>
                <div>{t.label}</div>
                <div style={{fontSize:9,color:sel?"#fb923c":"#475569",marginTop:2,fontWeight:400}}>{t.tip}</div>
              </button>;
            })}
          </div>
          
          <label style={{...S.label,marginBottom:6}}>Précisions (optionnel)</label>
          <input value={profile.styleExtra} onChange={e=>setProfile(p=>({...p,styleExtra:e.target.value}))} placeholder="Ex: Je monte beaucoup au filet, je joue avec du lift..." style={{...S.input,fontSize:11}}/>
        </div>}

        {/* STEP 2: Corps / Blessures */}
        {wizardStep===2&&<div style={{animation:"fadeIn 0.3s ease"}}>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:4,fontFamily:"'Outfit'"}}>🩹 Ton corps</div>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 14px",lineHeight:1.5}}>Les blessures et contraintes physiques impactent directement le critère <strong style={{color:"#ef4444"}}>Confort</strong> dans les verdicts. Une raquette inadaptée peut aggraver les douleurs.</p>
          
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
            {INJURY_TAGS.map(t=>{
              const sel = profile.injuryTags.includes(t.id);
              const isNone = t.id==="aucune";
              return <button key={t.id} onClick={()=>toggleTag("injuryTags",t.id)} className="pa-tag" style={{
                padding:"10px 14px",borderRadius:12,
                background:sel?(isNone?"rgba(76,175,80,0.15)":"rgba(239,68,68,0.12)"):"rgba(255,255,255,0.03)",
                border:`1.5px solid ${sel?(isNone?"#4CAF50":"#ef4444"):"rgba(255,255,255,0.08)"}`,
                color:sel?(isNone?"#4CAF50":"#ef4444"):"#94a3b8",fontSize:12,fontWeight:sel?700:500,cursor:"pointer",fontFamily:"inherit",
                transition:"all 0.2s ease",
              }}>
                {isNone?"✓ ":""}{t.label}
              </button>;
            })}
          </div>
          
          <label style={{...S.label,marginBottom:6}}>Précisions (optionnel)</label>
          <input value={profile.injuryExtra} onChange={e=>setProfile(p=>({...p,injuryExtra:e.target.value}))} placeholder="Ex: Tendinite chronique, post-opération épaule..." style={{...S.input,fontSize:11}}/>
        </div>}

        {/* STEP 3: Priorités / Expert Feel + Marques */}
        {wizardStep===3&&<div style={{animation:"fadeIn 0.3s ease"}}>
          {detectPlayerMode(profile)==="expert" ? (<>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:4,fontFamily:"'Outfit'"}}>🎾 Tes sensations raquette</div>
          <p style={{fontSize:11,color:"#a855f7",margin:"0 0 14px",lineHeight:1.5,fontWeight:600}}>⚡ Mode Pro — matching par propriétés physiques</p>

          {/* Toucher */}
          <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:4,textTransform:"uppercase"}}>🤚 Toucher</div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[{v:"sec",l:"Sec"},{v:"medium",l:"Medium"},{v:"souple",l:"Souple"}].map(o=>{
              const sel=profile.expertToucher===o.v;
              return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertToucher:o.v}))} style={{flex:1,padding:"8px 6px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:sel?700:500,background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",border:`1.5px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,color:sel?"#c084fc":"#94a3b8",transition:"all 0.2s"}}>{o.l}</button>;
            })}
          </div>
          {/* Réactivité */}
          <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:4,textTransform:"uppercase"}}>⚡ Réactivité</div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[{v:"explosive",l:"Explosive"},{v:"progressive",l:"Progressive"}].map(o=>{
              const sel=profile.expertReactivite===o.v;
              return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertReactivite:o.v}))} style={{flex:1,padding:"8px 6px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:sel?700:500,background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",border:`1.5px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,color:sel?"#c084fc":"#94a3b8",transition:"all 0.2s"}}>{o.l}</button>;
            })}
          </div>
          {/* Poids */}
          <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:4,textTransform:"uppercase"}}>⚖️ Poids en main</div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[{v:"lourd",l:"Lourd"},{v:"equilibre",l:"Équilibré"},{v:"leger",l:"Léger"}].map(o=>{
              const sel=profile.expertPoids===o.v;
              return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertPoids:o.v}))} style={{flex:1,padding:"8px 6px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:sel?700:500,background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",border:`1.5px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,color:sel?"#c084fc":"#94a3b8",transition:"all 0.2s"}}>{o.l}</button>;
            })}
          </div>
          {/* Forme */}
          <div style={{fontSize:10,fontWeight:700,color:"#c084fc",marginBottom:4,textTransform:"uppercase"}}>🔷 Forme</div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[{v:"diamant",l:"Diamant"},{v:"goutte",l:"Goutte"},{v:"ronde",l:"Ronde"},{v:"indifferent",l:"Indiff."}].map(o=>{
              const sel=profile.expertForme===o.v;
              return <button key={o.v} onClick={()=>setProfile(p=>({...p,expertForme:o.v}))} style={{flex:1,padding:"8px 4px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:sel?700:500,background:sel?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)",border:`1.5px solid ${sel?"#a855f7":"rgba(255,255,255,0.08)"}`,color:sel?"#c084fc":"#94a3b8",transition:"all 0.2s"}}>{o.l}</button>;
            })}
          </div>
          </>) : (<>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:4,fontFamily:"'Outfit'"}}>🎯 Qu'est-ce que tu cherches ?</div>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 14px",lineHeight:1.5}}>Ces critères pondèrent le score global. Les suggestions seront triées en fonction de tes priorités.</p>
          
          <div style={{fontSize:11,fontWeight:700,color:"#4CAF50",marginBottom:6}}>Priorités dans ta raquette</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
            {PRIORITY_TAGS.map(t=>{
              const sel = profile.priorityTags.includes(t.id);
              return <button key={t.id} onClick={()=>toggleTag("priorityTags",t.id)} className="pa-tag" style={{
                padding:"10px 14px",borderRadius:12,
                background:sel?"rgba(76,175,80,0.12)":"rgba(255,255,255,0.03)",
                border:`1.5px solid ${sel?"#4CAF50":"rgba(255,255,255,0.08)"}`,
                color:sel?"#4CAF50":"#94a3b8",fontSize:12,fontWeight:sel?700:500,cursor:"pointer",fontFamily:"inherit",
                transition:"all 0.2s ease",
              }}>
                {t.label}
              </button>;
            })}
          </div>
          <input value={profile.priorityExtra} onChange={e=>setProfile(p=>({...p,priorityExtra:e.target.value}))} placeholder="Ex: Budget max 200€, raquette pas trop lourde..." style={{...S.input,fontSize:11,marginBottom:16}}/>
          </>)}

          <div style={{fontSize:11,fontWeight:700,color:"#9C27B0",marginBottom:6}}>🏷 Marques préférées <span style={{fontWeight:400,color:"#64748b"}}>(optionnel — vide = toutes)</span></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {BRAND_TAGS.map(t=>{
              const sel = profile.brandTags.includes(t.id);
              return <button key={t.id} onClick={()=>toggleTag("brandTags",t.id)} className="pa-tag" style={{
                padding:"8px 12px",borderRadius:10,
                background:sel?"rgba(156,39,176,0.12)":"rgba(255,255,255,0.03)",
                border:`1.5px solid ${sel?"#9C27B0":"rgba(255,255,255,0.08)"}`,
                color:sel?"#CE93D8":"#94a3b8",fontSize:11,fontWeight:sel?700:500,cursor:"pointer",fontFamily:"inherit",
                transition:"all 0.2s ease",
              }}>
                {t.label}
              </button>;
            })}
          </div>
        </div>}

        {/* Navigation buttons */}
        <div style={{display:"flex",gap:8,marginTop:20,alignItems:"center"}}>
          {wizardStep>0&&<button onClick={()=>setWizardStep(s=>s-1)} style={{...S.btn(false),flex:1,padding:"12px 0",borderRadius:12,fontSize:12}}>
            ← Précédent
          </button>}
          {wizardStep<3&&<button onClick={()=>{
            if(wizardStep===0&&!profileName.trim()){alert(groupRole==="vendeur"?"Entrez le prénom du joueur":"Donne un nom à ton profil pour continuer");return;}
            setWizardStep(s=>s+1);
          }} style={{
            flex:2,padding:"12px 0",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
            background:"linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))",
            border:"1px solid rgba(249,115,22,0.35)",color:"#f97316",transition:"all 0.2s ease",
          }}>
            Suivant →
          </button>}
          {wizardStep===3&&<button onClick={()=>{
            if(!profileName.trim()){alert(groupRole==="vendeur"?"Retournez à l'étape 1 pour entrer le prénom":"Retourne à l'étape 1 pour nommer ton profil");return;}
            const list = saveNamedProfile(profileName.trim(), profile);
            setSavedProfiles(list);
            cloudSyncProfile(profileName.trim(), profile, false);
            setPanel(null);
            if(rackets.length>0) reanalyzeAll();
          }} style={{
            ...S.btnGreen,flex:2,padding:"14px 0",borderRadius:12,fontSize:14,
            background:"linear-gradient(135deg,rgba(76,175,80,0.25),rgba(76,175,80,0.15))",
          }}>
            ✅ Sauvegarder{rackets.length>0?" & Ré-analyser":""}
          </button>}
        </div>
        {error&&<div style={{fontSize:11,color:"#ef4444",marginTop:8}}>{error}</div>}
      </div>}

      {/* ============================================================ */}
      {/* MANAGE PANEL */}
      {/* ============================================================ */}
      {panel==="manage"&&<div style={S.card}>
        <div style={S.title}>🗑 GÉRER LES RAQUETTES</div>
        {rackets.length===0&&<p style={{color:"#64748b",fontSize:11,textAlign:"center",padding:"12px 0"}}>Aucune raquette. Utilise "🎯 Suggère-moi" ou "+ Ajouter" pour commencer.</p>}
        {rackets.map(r=>(
          <div key={r.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:r.color}}/>
              <span style={{fontSize:11,color:"#e2e8f0"}}>{r.name}</span>
            </div>
            <button onClick={()=>removeRacket(r.id)} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,padding:"3px 8px",color:"#ef4444",fontSize:10,cursor:"pointer",fontWeight:600,fontFamily:"inherit"}}>Supprimer</button>
          </div>
        ))}
        {rackets.length>1&&<button onClick={()=>{setConfirmModal({message:"Supprimer toutes les raquettes ?",onConfirm:()=>{setRackets([]);setSelected([]);setConfirmModal(null);},onCancel:()=>setConfirmModal(null)});}} style={{...S.btn(false),width:"100%",marginTop:12,padding:"8px 0",fontSize:11,color:"#ef4444",borderColor:"rgba(239,68,68,0.3)"}}>🗑 Tout effacer</button>}
        
        {/* Local DB management */}
        <div style={{marginTop:16,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",marginBottom:8,letterSpacing:"0.04em"}}>🗃️ BASE DE DONNÉES</div>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}>
            <div style={{flex:1,background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"6px 10px",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:9,color:"#64748b"}}>Embarquées</div>
              <div style={{fontSize:16,fontWeight:700,color:"#f97316",fontFamily:"'Outfit'"}}>{RACKETS_DB.length}</div>
            </div>
            <div style={{fontSize:14,color:"#334155"}}>+</div>
            <div style={{flex:1,background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"6px 10px",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:9,color:"#64748b"}}>Apprises (local)</div>
              <div style={{fontSize:16,fontWeight:700,color:localDBCount>0?"#22c55e":"#334155",fontFamily:"'Outfit'"}}>{localDBCount}</div>
            </div>
            <div style={{fontSize:14,color:"#334155"}}>=</div>
            <div style={{flex:1,background:"rgba(249,115,22,0.05)",borderRadius:8,padding:"6px 10px",border:"1px solid rgba(249,115,22,0.15)"}}>
              <div style={{fontSize:9,color:"#f97316"}}>Total</div>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",fontFamily:"'Outfit'"}}>{totalDBCount}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={exportLocalDB} disabled={localDBCount===0} style={{...S.btn(false),flex:1,padding:"7px 0",fontSize:10,opacity:localDBCount===0?0.4:1,cursor:localDBCount===0?"default":"pointer"}}>📤 Exporter local ({localDBCount})</button>
            <button onClick={clearLocalDB} disabled={localDBCount===0} style={{...S.btn(false),flex:1,padding:"7px 0",fontSize:10,color:"#ef4444",borderColor:"rgba(239,68,68,0.2)",opacity:localDBCount===0?0.4:1,cursor:localDBCount===0?"default":"pointer"}}>🧹 Vider local</button>
          </div>
          <p style={{fontSize:8,color:"#475569",margin:"6px 0 0",lineHeight:1.4}}>Les raquettes « apprises » sont celles trouvées via recherche web. Exporte-les pour les intégrer à la base embarquée.</p>
        </div>
      </div>}

      {/* ============================================================ */}
      {/* RACKET GRID */}
      {/* ============================================================ */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:20}}>
        {rackets.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"30px 16px",color:"#64748b",fontSize:12}}>
          <div style={{fontSize:32,marginBottom:8}}>🎾</div>
          <p style={{margin:"0 0 4px",fontWeight:600,color:"#94a3b8"}}>Aucune raquette</p>
          <p style={{margin:0}}>Clique sur <strong>🎯 Suggère-moi</strong> pour des recommandations personnalisées<br/>ou <strong>+ Ajouter</strong> pour chercher un modèle précis</p>
        </div>}
        {rackets.map(r=>{
          const isSel=selected.includes(r.id); const fy=fyConfig[computeForYou(r.scores, profile, r)]||fyConfig.partial;
          return(<button key={r.id} className="pa-card" onClick={()=>toggleRacket(r.id)}
            onMouseEnter={()=>setHoveredRacket(r.id)} onMouseLeave={()=>setHoveredRacket(null)}
            style={{
            background:isSel?`linear-gradient(165deg,${r.color}18,${r.color}08,transparent)`:"rgba(255,255,255,0.02)",
            border:`2px solid ${isSel?r.color+"cc":"rgba(255,255,255,0.06)"}`,borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"left",position:"relative",fontFamily:"'Inter',sans-serif",
            boxShadow:isSel?`0 4px 16px ${r.color}22`:"0 2px 8px rgba(0,0,0,0.15)",
            transform:hoveredRacket===r.id?"translateY(-3px) scale(1.02)":"none",
            transition:"all 0.2s ease",
          }}>
            <div className="pa-badge" style={{position:"absolute",top:-8,right:8,background:fy.bg+"dd",border:`1px solid ${fy.border}`,borderRadius:20,padding:"2px 8px",fontSize:7,fontWeight:700,color:"#fff",letterSpacing:"0.03em",boxShadow:`0 2px 8px ${fy.bg}44`}}>{fy.text}</div>
            {r.imageUrl&&<img src={proxyImg(r.imageUrl)} alt="" style={{width:38,height:38,objectFit:"contain",borderRadius:6,marginBottom:4,background:"rgba(255,255,255,0.06)"}} onError={e=>{e.target.style.display='none'}}/>}
            <div style={{width:8,height:8,borderRadius:"50%",background:r.color,marginBottom:6,boxShadow:isSel?`0 0 8px ${r.color}`:"none",transition:"box-shadow 0.2s ease"}}/>
            <div style={{fontSize:11,fontWeight:700,color:isSel?"#fff":"#94a3b8",lineHeight:1.3,transition:"color 0.2s ease"}}>{r.shortName}</div>
            <div style={{fontSize:9,color:"#475569",marginTop:3}}>{r.shape} · {r.weight}</div>
            <div style={{fontSize:9,color:"#475569"}}>{r.brand} · {r.price}</div>
            {r._incomplete&&<div onClick={e=>{e.stopPropagation();rescoreRacket(r.id)}} style={{position:"absolute",bottom:4,right:4,background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.4)",borderRadius:6,padding:"2px 6px",fontSize:8,color:"#f97316",fontWeight:700,cursor:"pointer"}}>🔄 Re-scorer</div>}
            <div onClick={e=>{e.stopPropagation();openRacketSheet(r,"app")}} style={{fontSize:8,color:"#f97316",marginTop:4,cursor:"pointer",fontWeight:600,opacity:0.7}}>📋 Fiche</div>
          </button>);
        })}
      </div>

      {/* Arena button — only when 2+ rackets selected */}
      {selRackets.length>=2&&<button onClick={()=>setShowArena(true)} style={{
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",
        padding:"14px 20px",marginBottom:18,borderRadius:14,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
        background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1),rgba(236,72,153,0.08))",
        border:"1.5px solid rgba(124,58,237,0.35)",
        transition:"all 0.3s ease",
        boxShadow:"0 4px 24px rgba(124,58,237,0.15)",
      }}
      onMouseEnter={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.18),rgba(236,72,153,0.12))";e.currentTarget.style.boxShadow="0 6px 32px rgba(124,58,237,0.25)";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1),rgba(236,72,153,0.08))";e.currentTarget.style.boxShadow="0 4px 24px rgba(124,58,237,0.15)";e.currentTarget.style.transform="none";}}>
        <span style={{fontSize:18}}>⚔️</span>
        <span style={{fontSize:13,fontWeight:700,color:"#c4b5fd",letterSpacing:"-0.01em"}}>Entrer dans l'Arène</span>
        <span style={{fontSize:10,color:"#7c3aed",fontWeight:600,background:"rgba(124,58,237,0.15)",padding:"2px 8px",borderRadius:8}}>{selRackets.length} raquettes</span>
      </button>}

      {/* ============================================================ */}
      {/* CHART TABS */}
      {/* ============================================================ */}
      <div style={{display:"flex",gap:2,marginBottom:18,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,border:"1px solid rgba(255,255,255,0.04)"}}>
        {[["radar","🕸 Radar"],["bars","📊 Barres"],["table","📋 Détails"],["fit","🎯 Pertinence"]].map(([k,l])=>(
          <button key={k} className={`pa-tab ${tab===k?"pa-tab-active":""}`} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 0",background:tab===k?"rgba(255,255,255,0.06)":"transparent",border:"none",borderRadius:9,color:tab===k?"#fff":"#64748b",fontSize:11,fontWeight:tab===k?700:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",letterSpacing:"-0.01em",transition:"all 0.2s ease"}}>{l}</button>
        ))}
      </div>

      {tab==="radar"&&<div style={{...S.card,padding:"16px 12px",position:"relative",overflow:"hidden"}}>
        <style>{`
          @keyframes racketFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @media (max-width: 700px) {
            .pa-radar-layout { flex-direction: column !important; min-height: auto !important; }
            .pa-radar-showcase { display: none !important; }
            .pa-radar-chart { min-height: 340px !important; width: 100% !important; flex: none !important; }
          }
        `}</style>
        <div className="pa-radar-layout" style={{display:"flex",alignItems:"center",gap:0,minHeight:400}}>
          {/* LEFT — Racket showcase image */}
          <div className="pa-radar-showcase" style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400}}>
            {(()=>{
              const hr = hoveredRacket ? selRackets.find(r=>r.id===hoveredRacket) : null;
              if(!hr || !hr.imageUrl) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",opacity:0.3}}>
                <div style={{width:100,height:100,borderRadius:"50%",border:"2px dashed rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                  <span style={{fontSize:32,opacity:0.4}}>👆</span>
                </div>
                <div style={{fontSize:10,color:"#334155",textAlign:"center",lineHeight:1.4}}>Survole une raquette<br/>pour voir son visuel</div>
              </div>;
              return <div key={hr.id} style={{animation:"racketFadeIn 0.3s ease-out",textAlign:"center"}}>
                <div style={{
                  background:"rgba(255,255,255,0.03)", border:`2px solid ${hr.color}40`,
                  borderRadius:20, padding:20,
                  boxShadow:`0 0 40px ${hr.color}15, inset 0 0 20px ${hr.color}08`,
                  transition:"border-color 0.3s ease",
                }}>
                  <img src={proxyImg(hr.imageUrl)} alt={hr.name} style={{
                    width:240, height:280, objectFit:"contain", display:"block", margin:"0 auto",
                    filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
                  }} onError={e=>{e.target.style.display='none'}}/>
                </div>
                <div style={{marginTop:12}}>
                  <div style={{fontSize:13,fontWeight:700,color:hr.color,lineHeight:1.2}}>{hr.name}</div>
                  <div style={{fontSize:10,color:"#64748b",marginTop:4}}>{hr.shape} · {hr.weight}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{hr.brand}{hr.price&&hr.price!=="—"?` · ${hr.price}`:""}</div>
                  {hr.player&&hr.player!=="—"&&<div style={{fontSize:9,color:"#475569",marginTop:3}}>🎾 {hr.player}</div>}
                </div>
              </div>;
            })()}
          </div>

          {/* RIGHT — Radar chart (takes remaining space) */}
          <div className="pa-radar-chart" style={{flex:1,minWidth:0,position:"relative"}}>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData} cx="50%" cy="48%" outerRadius="68%">
                <PolarGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" gridType="polygon"/>
                <PolarAngleAxis dataKey="attribute" tick={{fill:"#94a3b8",fontSize:10,fontWeight:600,fontFamily:"Inter"}}/>
                <PolarRadiusAxis angle={90} domain={[0,10]} tick={{fill:"#64748b",fontSize:9,fontWeight:500}} tickCount={6} axisLine={false}/>
                {/* Perfect 10/10 reference hexagon */}
                <Radar name="— 10/10 —" dataKey="— 10/10 —" stroke="rgba(255,255,255,0.25)" fill="none"
                  strokeWidth={1.5} strokeDasharray="6 3" strokeOpacity={1} fillOpacity={0} dot={false} legendType="none"/>
                {selRackets.map((r,i)=>{
                  const isHovered = hoveredRacket === r.id;
                  const anyHovered = hoveredRacket !== null;
                  return(<Radar key={r.id} name={r.shortName} dataKey={r.shortName} stroke={r.color}
                    fill={r.color}
                    fillOpacity={isHovered ? 0.35 : anyHovered ? 0.03 : 0.08+i*0.03}
                    strokeWidth={isHovered ? 3.5 : anyHovered ? 1 : 2.5}
                    strokeOpacity={isHovered ? 1 : anyHovered ? 0.3 : 1}
                  />);
                })}
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize:9,color:"#94a3b8",paddingTop:6,fontFamily:"Inter",lineHeight:"18px"}}/>
              </RadarChart>
            </ResponsiveContainer>
            {/* Legend hint for the reference hexagon */}
            <div style={{position:"absolute",top:8,right:12,fontSize:9,color:"#475569",display:"flex",alignItems:"center",gap:5}}>
              <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 2"/></svg>
              <span>Score parfait 10/10</span>
            </div>
          </div>
        </div>
      </div>}

      {tab==="bars"&&<div style={{...S.card,padding:20}}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={radarData} layout="vertical" margin={{left:80,right:20}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis type="number" domain={[0,10]} tick={{fill:"#475569",fontSize:9,fontFamily:"Inter"}}/>
            <YAxis dataKey="attribute" type="category" tick={{fill:"#94a3b8",fontSize:10,fontWeight:600,fontFamily:"Inter"}} width={75}/>
            <Tooltip contentStyle={{background:"#1a2236",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,fontSize:11,fontFamily:"Inter",boxShadow:"0 8px 24px rgba(0,0,0,0.4)"}}/>
            {selRackets.map(r=>(<Bar key={r.id} dataKey={r.shortName} fill={r.color} radius={[0,5,5,0]} barSize={10}/>))}
          </BarChart>
        </ResponsiveContainer>
      </div>}

      {tab==="table"&&<div style={{...S.card,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:10}}>
          <thead><tr>
            <th style={{textAlign:"left",padding:"8px 6px",color:"#475569",borderBottom:"2px solid rgba(255,255,255,0.06)",fontSize:9,letterSpacing:"0.03em"}}/>
            {selRackets.map(r=>(<th key={r.id} style={{textAlign:"center",padding:"8px 4px",color:r.color,fontWeight:700,borderBottom:"2px solid rgba(255,255,255,0.06)",fontSize:9,minWidth:85,fontFamily:"'Outfit'",letterSpacing:"0.02em"}}>{r.shortName}</th>))}
          </tr></thead>
          <tbody>
            {[{l:"Marque",k:"brand"},{l:"Forme",k:"shape"},{l:"Poids",k:"weight"},{l:"Équilibre",k:"balance"},{l:"Surface",k:"surface"},{l:"Mousse",k:"core"},{l:"Joueur",k:"player"},{l:"Prix indicatif",k:"price"}].map((row,i)=>(
              <tr key={row.k} className="pa-row" style={{background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
                <td style={{padding:"6px 6px",color:"#94a3b8",fontWeight:600,fontSize:10}}>{row.l}</td>
                {selRackets.map(r=>(<td key={r.id} style={{padding:"6px 4px",textAlign:"center",color:"#cbd5e1",fontSize:10}}>{r[row.k]}</td>))}
              </tr>
            ))}
            <tr><td colSpan={selRackets.length+1} style={{padding:"12px 6px 4px",color:"#f97316",fontWeight:700,fontSize:10,borderTop:"2px solid rgba(249,115,22,0.15)",fontFamily:"'Outfit'",letterSpacing:"0.04em",textTransform:"uppercase"}}>Notes brutes /10</td></tr>
            {selRackets.some(r=>r.refSource)&&<tr><td style={{padding:"2px 6px",fontSize:8,color:"#334155",fontStyle:"italic"}}>Source</td>
              {selRackets.map(r=>(<td key={r.id} style={{padding:"2px 4px",textAlign:"center",fontSize:7,color:"#334155",fontStyle:"italic"}}>{r.refSource||"Règles méca."}</td>))}
            </tr>}
            {ATTRS.map((attr,i)=>{
              const mx=Math.max(...selRackets.map(r=>r.scores[attr]));
              return(<tr key={attr} className="pa-row" style={{background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
                <td style={{padding:"6px 6px",color:"#94a3b8",fontWeight:600}}>{attr}</td>
                {selRackets.map(r=>{const v=r.scores[attr];const best=v===mx&&selRackets.length>1;
                  return(<td key={r.id} style={{padding:"6px 4px",textAlign:"center"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <span style={{color:best?"#4ade80":"#cbd5e1",fontWeight:best?700:500,fontFamily:"'Outfit'",fontSize:12}}>{v}</span>
                      <div style={{width:"70%",height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                        <div style={{width:`${v*10}%`,height:"100%",borderRadius:2,background:v>=8?r.color:v>=6.5?"#64748b":"#ef444466",transition:"width 0.4s ease"}}/>
                      </div>
                    </div>
                  </td>);})}
              </tr>);
            })}
            {(()=>{
              const avgs = selRackets.map(r=>Math.round((ATTRS.reduce((s,a)=>s+r.scores[a],0)/ATTRS.length)*10)/10);
              const mxA = Math.max(...avgs);
              return(<tr style={{borderTop:"2px solid rgba(249,115,22,0.2)",background:"rgba(249,115,22,0.04)"}}>
                <td style={{padding:"10px 6px",color:"#f97316",fontWeight:800,fontSize:11,fontFamily:"'Outfit'"}}>⭐ MOYENNE</td>
                {selRackets.map((r,i)=>{const a=avgs[i];const best=a===mxA&&selRackets.length>1;
                  return(<td key={r.id} style={{padding:"10px 4px",textAlign:"center",color:best?"#4ade80":"#f97316",fontWeight:800,fontSize:14,fontFamily:"'Outfit'"}}>{a}<span style={{fontSize:9,color:"#64748b",fontWeight:500}}>/10</span></td>);})}
              </tr>);
            })()}
          </tbody>
        </table>
      </div>}

      {/* ============================================================ */}
      {/* PERTINENCE TAB — profile-weighted analysis + print */}
      {/* ============================================================ */}
      {tab==="fit"&&<>
        <style>{`
          @media print {
            * { box-sizing: border-box !important; }
            html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
            body * { visibility: hidden !important; }
            #print-pertinence, #print-pertinence * { visibility: visible !important; }
            #print-pertinence {
              position: absolute !important; left: 0 !important; top: 0 !important;
              width: 100% !important; max-width: 100% !important;
              padding: 8mm 8mm !important;
              background: white !important; color: #1a1a1a !important;
              overflow: visible !important; font-size: 10px !important;
              -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
            }
            #print-pertinence .print-header { display: block !important; }
            #print-pertinence .print-section-title { display: block !important; }
            #print-pertinence .no-print { display: none !important; }
            #print-pertinence .print-radar-section { display: flex !important; gap: 12px !important; align-items: stretch !important; }
            #print-pertinence .print-radar-section > div:first-child { background: #f0f4ff !important; border: 1.5px solid #818cf8 !important; border-radius: 10px !important; padding: 8px 0 0 !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
            #print-pertinence .print-radar-section .recharts-polar-grid line,
            #print-pertinence .print-radar-section .recharts-polar-grid polygon,
            #print-pertinence .print-radar-section .recharts-polar-grid-concentric-polygon { stroke: #c7d2fe !important; stroke-opacity: 1 !important; }
            #print-pertinence .print-radar-section .recharts-polygon { stroke-width: 2.5px !important; fill-opacity: 0.25 !important; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
            #print-pertinence .print-radar-section .recharts-polar-angle-axis-tick text { fill: #374151 !important; }
            #print-pertinence .print-card {
              border: 1px solid #e2e8f0 !important; background: #fafafa !important;
              color: #1a1a1a !important; page-break-inside: avoid; break-inside: avoid;
              overflow: hidden !important; max-width: 100% !important;
              margin-bottom: 8px !important; border-radius: 10px !important;
            }
            #print-pertinence .print-card-gold {
              background: linear-gradient(135deg, #fffbeb, #fef3c7) !important;
              border: 2px solid #d4a017 !important;
              box-shadow: 0 2px 12px rgba(184,134,11,0.12) !important;
              margin-bottom: 12px !important;
            }
            #print-pertinence .print-card-silver {
              background: #f8fafc !important;
              border: 1.5px solid #94a3b8 !important;
              margin-bottom: 10px !important;
            }
            #print-pertinence .print-card-bronze {
              background: #fefaf5 !important;
              border: 1.5px solid #cd7f32 !important;
              margin-bottom: 10px !important;
            }
            #print-pertinence .print-card * { color: #1a1a1a !important; }
            #print-pertinence .print-card-gold .print-medal-label { color: #8b6914 !important; }
            #print-pertinence .print-card-silver .print-medal-label { color: #64748b !important; }
            #print-pertinence .print-card-bronze .print-medal-label { color: #92400e !important; }
            #print-pertinence .print-bar-bg { background: #e5e7eb !important; height: 6px !important; border-radius: 3px !important; }
            #print-pertinence .print-bar-fill-green { background: #22c55e !important; }
            #print-pertinence .print-bar-fill-gray { background: #9ca3af !important; }
            #print-pertinence .print-bar-fill-red { background: #ef4444 !important; }
            #print-pertinence .print-bar-fill-yellow { background: #f59e0b !important; }
            #print-pertinence .print-score-green { color: #16a34a !important; }
            #print-pertinence .print-score-yellow { color: #d97706 !important; }
            #print-pertinence .print-score-red { color: #dc2626 !important; }
            #print-pertinence .print-badge { border: 1px solid #666 !important; padding: 3px 8px !important; border-radius: 6px !important; font-size: 8px !important; font-weight: 700 !important; }
            #print-pertinence .print-badge-green { background: #dcfce7 !important; color: #166534 !important; border-color: #22c55e !important; }
            #print-pertinence .print-badge-orange { background: #fff7ed !important; color: #9a3412 !important; border-color: #f97316 !important; }
            #print-pertinence .print-badge-red { background: #fef2f2 !important; color: #991b1b !important; border-color: #ef4444 !important; }
            #print-pertinence .print-profile-box { border: 1.5px solid #f97316 !important; background: #fff7ed !important; padding: 12px !important; border-radius: 10px !important; }
            #print-pertinence .print-warn { color: #dc2626 !important; }
            #print-pertinence .print-verdict { color: #374151 !important; font-style: normal !important; }
            #print-pertinence .print-deep-analysis { background: #f0f4ff !important; border: 1.5px solid #818cf8 !important; border-radius: 8px !important; padding: 10px 12px !important; margin-bottom: 12px !important; page-break-inside: avoid; break-inside: avoid; }
            #print-pertinence .print-deep-analysis * { color: #374151 !important; }
            #print-pertinence .print-smart-verdict { background: #f0fdf4 !important; border: 1.5px solid #22c55e !important; border-radius: 8px !important; padding: 10px 12px !important; margin-bottom: 12px !important; font-size: 10px !important; line-height: 1.7 !important; }
            #print-pertinence .print-smart-verdict, #print-pertinence .print-smart-verdict * { color: #374151 !important; }
            #print-pertinence .print-smart-verdict strong { color: #111827 !important; font-weight: 700 !important; }
            #print-pertinence .print-smart-verdict p { margin: 0 !important; }
            #print-pertinence .print-deep-analysis .deep-title { color: #4338ca !important; font-weight: 700 !important; font-size: 11px !important; margin-bottom: 6px !important; }
            #print-pertinence .print-section-divider { border-top: 2px solid #e5e7eb !important; margin: 16px 0 10px !important; padding-top: 8px !important; }
            #print-pertinence .print-footer-wrap { page-break-before: avoid; break-before: avoid; page-break-inside: avoid; break-inside: avoid; }
            #print-pertinence .print-racket-img { width: 60px !important; height: 72px !important; object-fit: contain !important; border-radius: 8px !important; background: #f1f5f9 !important; padding: 4px !important; }
            #print-pertinence .print-racket-img-sm { width: 40px !important; height: 48px !important; }
            @page { margin: 8mm 6mm; size: A4; }
          }
        `}</style>
        <div id="print-pertinence" style={S.card}>
          {/* ===== PRINT HEADER — professional branding ===== */}
          <div className="print-header" style={{display:"none",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"3px solid #f97316",paddingBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
                  <rect width="44" height="44" rx="10" fill="#f97316"/>
                  <ellipse cx="22" cy="18" rx="10" ry="12" stroke="#fff" strokeWidth="2.2" fill="none"/>
                  <line x1="22" y1="10" x2="22" y2="26" stroke="#fff" strokeWidth="1.2" opacity="0.5"/>
                  <line x1="14" y1="18" x2="30" y2="18" stroke="#fff" strokeWidth="1.2" opacity="0.5"/>
                  <line x1="22" y1="30" x2="22" y2="38" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="33" cy="32" r="3.5" fill="#fff" opacity="0.9"/>
                </svg>
                <div>
                  <div style={{fontSize:18,fontWeight:800,color:"#f97316",fontFamily:"'Outfit'",letterSpacing:"-0.01em"}}>PADEL ANALYZER</div>
                  <div style={{fontSize:9,color:"#64748b",marginTop:1}}>Analyse de pertinence personnalisée</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#1a1a1a"}}>{profileName || "Analyse joueur"}</div>
                <div style={{fontSize:9,color:"#64748b",marginTop:2}}>{new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>
              </div>
            </div>
          </div>

          {/* ===== SCREEN: Print button + profile name ===== */}
          <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}} className="no-print">
            <div style={{flex:1,fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{profileName ? `👤 ${profileName}` : <span style={{color:"#475569",fontWeight:400,fontSize:11}}>Définis un nom dans 👤 Profil → 💾 Sauvegarder</span>}</div>
            <button onClick={()=>window.print()} style={{padding:"8px 16px",background:"rgba(249,115,22,0.2)",border:"1px solid #f97316",borderRadius:8,color:"#f97316",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>🖨 Imprimer</button>
          </div>

          {/* ===== PROFILE BOX ===== */}
          <div className="print-profile-box" style={{background:"rgba(249,115,22,0.06)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:10,padding:12,marginBottom:12,boxSizing:"border-box"}}>
            <p style={{fontSize:10,color:"#f97316",fontWeight:700,margin:"0 0 3px"}}>👤 Profil actif :</p>
            <p style={{fontSize:9,color:"#94a3b8",margin:0,lineHeight:1.5}}>{profileText}</p>
            <p style={{fontSize:8,color:"#475569",margin:"4px 0 0"}}>{(()=>{
              const w = { Puissance:1, Contrôle:1, Confort:1, Spin:1, Maniabilité:1, Tolérance:1 };
              const prioMap = { confort:{Confort:1.5}, polyvalence:{Contrôle:0.5,Maniabilité:0.5,Tolérance:0.5}, puissance:{Puissance:1.5}, controle:{Contrôle:1.5}, spin:{Spin:1.5}, legerete:{Maniabilité:1.5}, protection:{Confort:1.5}, reprise:{Confort:1.5,Tolérance:1.0,Maniabilité:0.5} };
              const styleMap = { offensif:{Puissance:0.5}, defensif:{Contrôle:0.5,Tolérance:0.5}, tactique:{Contrôle:0.5,Maniabilité:0.3}, puissant:{Puissance:0.5,Spin:0.3}, veloce:{Maniabilité:0.8}, endurant:{Confort:0.5,Tolérance:0.3}, contre:{Tolérance:0.5,Contrôle:0.3}, polyvalent:{Contrôle:0.3,Tolérance:0.3}, technique:{Contrôle:0.5,Spin:0.3} };
              const ordM3 = [1.4, 1.0, 0.7, 0.5, 0.5];
              (profile.priorityTags||[]).forEach((tag,idx)=>{ const b=prioMap[tag]; const m=ordM3[Math.min(idx,ordM3.length-1)]; if(b) for(const[k,v] of Object.entries(b)) w[k]=(w[k]||1)+v*m; });
              for (const tag of (profile.styleTags||[])) { const b=styleMap[tag]; if(b) for(const[k,v] of Object.entries(b)) w[k]=(w[k]||1)+v; }
              const ARM=["dos","poignet","coude","epaule"]; const LEG=["genou","cheville","mollet","hanche","achille"];
              if((profile.injuryTags||[]).some(t=>ARM.includes(t))) w.Confort+=2;
              if((profile.injuryTags||[]).some(t=>LEG.includes(t))) w.Maniabilité+=1.5;
              const h=Number(profile.height)||0;
              if(h>0&&h<170) w.Maniabilité+=0.5;
              if(h>=185) w.Puissance+=0.3;
              const age=Number(profile.age)||0;
              if(age>=40){w.Confort+=0.5;w.Tolérance+=0.3;}
              if(age>=50){w.Confort+=0.5;w.Maniabilité+=0.5;w.Tolérance+=0.3;}
              if(age>=60){w.Confort+=0.5;w.Tolérance+=0.5;}
              const hand=profile.hand||"Droitier"; const side=profile.side||"Droite";
              const isAtk=(hand==="Droitier"&&side==="Gauche")||(hand==="Gaucher"&&side==="Droite");
              const isCon=(hand==="Droitier"&&side==="Droite")||(hand==="Gaucher"&&side==="Gauche");
              if(isAtk){w.Puissance+=0.5;w.Spin+=0.3;}
              if(isCon){w.Contrôle+=0.5;w.Tolérance+=0.3;}
              const sorted = Object.entries(w).sort((a,b)=>b[1]-a[1]);
              const top = sorted.filter(([,v])=>v>1.5).map(([k,v])=>`${k} ~${Math.round(v)}x`);
              return top.length ? `Critères renforcés : ${top.join(", ")}.` : "";
            })()}</p>
          </div>

          {/* ===== IDEAL PROFILE RADAR + BEST RACKET OVERLAY ===== */}
          {(()=>{
            try {
            const w2 = { Puissance:1, Contrôle:1, Confort:1, Spin:1, Maniabilité:1, Tolérance:1 };
            const prioMap2 = { confort:{Confort:1.5}, polyvalence:{Contrôle:0.5,Maniabilité:0.5,Tolérance:0.5}, puissance:{Puissance:1.5}, controle:{Contrôle:1.5}, spin:{Spin:1.5}, legerete:{Maniabilité:1.5}, protection:{Confort:1.5}, reprise:{Confort:1.5,Tolérance:1.0,Maniabilité:0.5} };
            const styleMap2 = { offensif:{Puissance:0.5}, defensif:{Contrôle:0.5,Tolérance:0.5}, tactique:{Contrôle:0.5,Maniabilité:0.3}, puissant:{Puissance:0.5,Spin:0.3}, veloce:{Maniabilité:0.8}, endurant:{Confort:0.5,Tolérance:0.3}, contre:{Tolérance:0.5,Contrôle:0.3}, polyvalent:{Contrôle:0.3,Tolérance:0.3}, technique:{Contrôle:0.5,Spin:0.3} };
            for (const tag of (profile.priorityTags||[])) { const b=prioMap2[tag]; if(b) for(const[k,v] of Object.entries(b)) w2[k]=(w2[k]||1)+v; }
            for (const tag of (profile.styleTags||[])) { const b=styleMap2[tag]; if(b) for(const[k,v] of Object.entries(b)) w2[k]=(w2[k]||1)+v; }
            const maxW2 = Math.max(...Object.values(w2));
            const idealRadar2 = ATTRS.map(a=>({ attribute: a, "Raquette idéale": Math.round((w2[a]/maxW2)*10*10)/10 }));
            
            // Best racket overlay
            const ranked = rackets.map(r=>({...r, globalScore:computeGlobalScore(r.scores, profile, r)})).sort((a,b)=>b.globalScore-a.globalScore);
            const bestShort = ranked.length>0 ? (ranked[0].shortName || ranked[0].name?.slice(0,28) || "N°1") : "";
            if(ranked.length>0) {
              idealRadar2.forEach(pt => { pt["🥇 "+bestShort] = Number(ranked[0].scores?.[pt.attribute])||0; });
            }
            
            return <div style={{display:"flex",gap:12,marginBottom:12,alignItems:"stretch"}} className="print-radar-section">
              <div style={{flex:"1 1 50%",background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:10,padding:"8px 0 0",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{fontSize:9,fontWeight:700,color:"#a5b4fc",textAlign:"center",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>📊 Raquette idéale{ranked.length>0?` vs ${bestShort}`:""}</div>
                <RadarChart width={340} height={220} data={idealRadar2} margin={{top:10,right:50,bottom:10,left:50}}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                    <PolarAngleAxis dataKey="attribute" tick={{fill:"#94a3b8",fontSize:8}}/>
                    <PolarRadiusAxis angle={90} domain={[0,10]} tick={false} axisLine={false}/>
                    <Radar name="Raquette idéale" dataKey="Raquette idéale" stroke="#6366f1" fill="#6366f1" fillOpacity={0.12} strokeWidth={2} strokeDasharray="6 3"/>
                    {ranked.length>0&&<Radar name={"🥇 "+bestShort} dataKey={"🥇 "+bestShort} stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2}/>}
                    <Legend wrapperStyle={{fontSize:8,color:"#94a3b8",paddingTop:2}}/>
                </RadarChart>
              </div>
              {/* Quick stats panel */}
              <div style={{flex:"1 1 50%",display:"flex",flexDirection:"column",gap:8}}>
                {ranked.slice(0,3).map((r,i)=>{
                  const medals=["🥇","🥈","🥉"];
                  const gs = r.globalScore;
                  const fy2 = computeForYou(r.scores, profile, r);
                  const fyC = fy2==="recommended"?"#22c55e":fy2==="no"?"#ef4444":"#FF9800";
                  return <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:i===0?"rgba(249,115,22,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${i===0?"rgba(249,115,22,0.2)":"rgba(255,255,255,0.06)"}`,borderRadius:10,flex:1}}>
                    <span style={{fontSize:18}}>{medals[i]}</span>
                    {r.imageUrl&&<img src={proxyImg(r.imageUrl)} alt="" className="print-racket-img-sm" style={{width:32,height:40,objectFit:"contain",borderRadius:6,background:"rgba(255,255,255,0.06)",flexShrink:0}} onError={e=>{e.target.style.display='none'}}/>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#e2e8f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.shortName}</div>
                      <div style={{fontSize:8,color:"#64748b"}}>{r.brand} · {r.shape}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:14,fontWeight:800,color:gs>=7.5?"#4ade80":gs>=6.5?"#fbbf24":"#f87171",fontFamily:"'Outfit'",lineHeight:1}}>{fmtPct(gs)}</div>
                      <div style={{fontSize:7,color:fyC,fontWeight:700,marginTop:2}}>{fy2==="recommended"?"RECO":fy2==="no"?"NON":"JOUABLE"}</div>
                    </div>
                  </div>;
                })}
              </div>
            </div>;
            } catch(e) { console.error("[Pertinence:radar]", e); return null; }
          })()}

          {/* ===== SMART COACH VERDICT — "En bref" ===== */}
          {(()=>{
            try {
            const ranked = rackets.map(r=>({...r, globalScore:computeGlobalScore(r.scores, profile, r)})).sort((a,b)=>b.globalScore-a.globalScore);
            if(!ranked.length) return null;
            const best = ranked[0];
            const second = ranked[1];
            
            // Priority attribute mapping
            const prioAttrMap = {puissance:'Puissance',controle:'Contrôle',confort:'Confort',spin:'Spin',legerete:'Maniabilité',protection:'Confort',reprise:'Confort',polyvalence:'Contrôle'};
            const prioTags = profile.priorityTags||[];
            const prioAttrs = [...new Set(prioTags.map(t=>prioAttrMap[t]).filter(Boolean))];
            const prioLabels = prioTags.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            
            // Injury context
            const ARM_INJ = ["dos","poignet","coude","epaule"];
            const LEG_INJ = ["genou","cheville","mollet","hanche","achille"];
            const injTags = profile.injuryTags||[];
            const hasArmInj = injTags.some(t=>ARM_INJ.includes(t));
            const hasLegInj = injTags.some(t=>LEG_INJ.includes(t));
            const injLabels = injTags.filter(t=>t!=="aucune").map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            
            // Find best's top 2 priority scores
            const bestPrioScores = prioAttrs.map(a=>({attr:a, val:best.scores[a]||0})).sort((a,b)=>b.val-a.val);
            
            // Find best's weakest score overall
            const bestWeakest = ATTRS.map(a=>({attr:a, val:best.scores[a]||0})).sort((a,b)=>a.val-b.val)[0];
            
            // Gap with #2
            const gap = second ? (best.globalScore - second.globalScore) : 0;
            
            // Build the verdict lines
            const lines = [];
            
            // Line 1: The recommendation with why
            if (prioLabels.length > 0) {
              const prioStr = prioLabels.length === 1 ? prioLabels[0] : prioLabels.slice(0,-1).join(", ") + " et " + prioLabels[prioLabels.length-1];
              if (bestPrioScores.length > 0 && bestPrioScores[0].val >= 7.5) {
                lines.push(`Avec tes priorités ${prioStr}, la **${best.name}** (${fmtPct(best.globalScore)}) s'impose : elle affiche ${bestPrioScores.map(s=>`${s.attr} à ${s.val}`).join(", ")}.`);
              } else if (bestPrioScores.length > 0) {
                lines.push(`Pour tes priorités ${prioStr}, la **${best.name}** (${fmtPct(best.globalScore)}) offre le meilleur compromis du lot avec ${bestPrioScores.map(s=>`${s.attr} à ${s.val}`).join(", ")}.`);
              } else {
                lines.push(`La **${best.name}** (${fmtPct(best.globalScore)}) est la plus adaptée à ton profil.`);
              }
            } else {
              lines.push(`La **${best.name}** (${fmtPct(best.globalScore)}) est la plus adaptée à ton profil.`);
            }
            
            // Line 2: Injury warning or comfort note
            if (hasArmInj) {
              const comfortBest = best.scores.Confort||0;
              if (comfortBest >= 7.5) {
                lines.push(`Bon point pour ton ${injLabels.join("/")} : son Confort à ${comfortBest} devrait ménager tes articulations.`);
              } else if (comfortBest >= 6) {
                lines.push(`Attention ${injLabels.join("/")} : son Confort à ${comfortBest} est correct mais pas optimal — surveille tes sensations.`);
              } else {
                lines.push(`⚠ Point de vigilance ${injLabels.join("/")} : Confort à ${comfortBest} seulement — risque de douleurs sur longues sessions.`);
              }
            } else if (hasLegInj) {
              const manBest = best.scores["Maniabilité"]||0;
              if (manBest >= 7) {
                lines.push(`Avec ta fragilité ${injLabels.join("/")}, sa Maniabilité à ${manBest} te permet de compenser sans forcer.`);
              } else {
                lines.push(`Attention ${injLabels.join("/")} : sa Maniabilité à ${manBest} demandera plus d'efforts en déplacement.`);
              }
            }
            
            // Line 3: Comparison with #2 (if exists and meaningful gap)
            if (second) {
              if (gap >= 0.5) {
                // Clear winner — find what #2 lacks
                const secondWorse = prioAttrs.length > 0 
                  ? prioAttrs.map(a=>({attr:a, diff: (best.scores[a]||0)-(second.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0]
                  : ATTRS.map(a=>({attr:a, diff: (best.scores[a]||0)-(second.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0];
                if (secondWorse) {
                  lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) suit mais perd du terrain en ${secondWorse.attr} (${second.scores[secondWorse.attr]} vs ${best.scores[secondWorse.attr]}).`);
                } else {
                  lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) est une alternative solide.`);
                }
              } else if (gap >= 0.2) {
                // Close call — find what #2 does better
                const secondBetter = ATTRS.map(a=>({attr:a, diff: (second.scores[a]||0)-(best.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0];
                if (secondBetter) {
                  lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) talonne de près et pousse même plus fort en ${secondBetter.attr} (${second.scores[secondBetter.attr]} vs ${best.scores[secondBetter.attr]}) — à essayer aussi.`);
                } else {
                  lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) est au coude-à-coude — les deux méritent un essai.`);
                }
              } else {
                // Virtually tied — find what differentiates them
                const secondBetter2 = ATTRS.map(a=>({attr:a, diff: (second.scores[a]||0)-(best.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0];
                const bestBetter2 = ATTRS.map(a=>({attr:a, diff: (best.scores[a]||0)-(second.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0];
                if (secondBetter2 && bestBetter2) {
                  lines.push(`Quasi ex-æquo avec la **${second.name}** (${fmtPct(second.globalScore)}) — elle pousse en ${secondBetter2.attr} (${second.scores[secondBetter2.attr]}), la n°1 domine en ${bestBetter2.attr} (${best.scores[bestBetter2.attr]}). Deux profils complémentaires à tester.`);
                } else {
                  lines.push(`Quasi ex-æquo avec la **${second.name}** (${fmtPct(second.globalScore)}) — profils très proches, la différence se jouera au toucher et à l'équilibre en main.`);
                }
              }
            }
            
            // Render as plain text — no inline <strong> tags that Chrome PDF fragments
            const plainText = lines.map(l => l.replace(/\*\*/g, "")).join(" ");
            
            return <div className="print-smart-verdict" style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:8,padding:"10px 12px",marginBottom:12,fontSize:10,color:"#94a3b8",lineHeight:1.6}}>
              <div style={{fontWeight:700,color:"#4ade80",marginBottom:4,fontSize:11}}>🎯 Notre verdict</div>
              <p style={{margin:0}}>{plainText}</p>
            </div>;
            } catch(e) { console.error("[Pertinence:verdict]", e); return null; }
          })()}

          {/* ===== DEEP ANALYSIS — Profile Intelligence ===== */}
          {(()=>{
            try {
            const ranked = rackets.map(r=>({...r, globalScore:computeGlobalScore(r.scores, profile, r)})).sort((a,b)=>b.globalScore-a.globalScore);
            if(ranked.length<2) return null;
            const deepLines = generateDeepAnalysis(profile, ranked, ATTRS);
            if(!deepLines.length) return null;
            const renderBold = (text, idx) => {
              const parts = text.split(/(\*\*[^*]+\*\*)/g);
              return <p key={idx} style={{margin:"0 0 6px",fontSize:9,color:"#94a3b8",lineHeight:1.6}}>
                {parts.map((p,j) => p.startsWith("**") ? <strong key={j} style={{color:"#e2e8f0"}}>{p.replace(/\*\*/g,"")}</strong> : p)}
              </p>;
            };
            return <div className="print-deep-analysis" style={{background:"rgba(99,102,241,0.05)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:8,padding:"10px 12px",marginBottom:12}}>
              <div className="deep-title" style={{fontWeight:700,color:"#a5b4fc",marginBottom:6,fontSize:11}}>🔬 Analyse du profil</div>
              {deepLines.map((l,i) => renderBold(l,i))}
            </div>;
            } catch(e) { console.error("[Pertinence:deep]", e); return null; }
          })()}

          {/* ===== PODIUM SECTION TITLE ===== */}
          {rackets.length>=3&&<div className="print-section-title" style={{display:"none",fontSize:12,fontWeight:800,color:"#1a1a1a",marginBottom:8,paddingBottom:4}}>
            🏆 PODIUM — Top 3
          </div>}

          {/* ===== PERTINENCE RANKING ===== */}
          {(()=>{
            try {
            const ranked = rackets.map(r=>({...r, globalScore:computeGlobalScore(r.scores, profile, r)})).sort((a,b)=>b.globalScore-a.globalScore);
            const cards = [];
            ranked.forEach((r,i)=>{
              // Insert section divider after top 3
              if(i===3 && ranked.length>3) {
                cards.push(<div key="divider" className="print-section-divider" style={{borderTop:"2px solid rgba(255,255,255,0.06)",margin:"16px 0 10px",paddingTop:8}}>
                  <div className="print-section-title" style={{display:"none",fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>📋 AUTRES RAQUETTES ANALYSÉES</div>
                </div>);
              }

              const forYouVal = computeForYou(r.scores, profile, r);
              const fy = fyConfig[forYouVal]||fyConfig.partial;
              const gs = r.globalScore;
              const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
              const cardClass = "print-card" + (i===0?" print-card-gold":i===1?" print-card-silver":i===2?" print-card-bronze":"");
              const badgeClass = forYouVal==="recommended"?"print-badge-green":forYouVal==="no"?"print-badge-red":"print-badge-orange";
              const scoreClass = gs>=7.5?"print-score-green":gs>=6.5?"print-score-yellow":"print-score-red";
              
              const ARM_INJ = ["dos","poignet","coude","epaule"];
              const LEG_INJ = ["genou","cheville","mollet","hanche","achille"];
              const ptags = profile.injuryTags||[];
              const hasArmInj = ptags.some(t=>ARM_INJ.includes(t));
              const hasLegInj = ptags.some(t=>LEG_INJ.includes(t));
              const criticalLow = hasArmInj && r.scores.Confort < 7;
              
              const isPodium = i<3;
              
              cards.push(<div key={r.id} className={cardClass} style={{
                background: i===0 ? "rgba(250,204,21,0.08)" : i===1 ? "rgba(148,163,184,0.06)" : i===2 ? "rgba(217,119,6,0.06)" : "rgba(255,255,255,0.02)",
                border: i===0 ? "2px solid rgba(250,204,21,0.5)" : i===1 ? "2px solid rgba(148,163,184,0.4)" : i===2 ? "2px solid rgba(217,119,6,0.35)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius:12, padding: isPodium ? "14px 16px" : "10px 12px", marginBottom: isPodium ? 12 : 6, boxSizing:"border-box", overflow:"hidden",
                pageBreakInside:"avoid", breakInside:"avoid",
              }}>
                {/* Card header: medal + image + name + badge + score */}
                <div style={{display:"flex",alignItems:"center",gap:isPodium?12:8,marginBottom:isPodium?10:6}}>
                  {medal&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,minWidth:40}}>
                    <span style={{fontSize:i===0?32:26,lineHeight:1}}>{medal}</span>
                    <span className="print-medal-label" style={{fontSize:7,fontWeight:800,letterSpacing:"0.02em",color:i===0?"#b8860b":i===1?"#6b7280":"#92400e",marginTop:2,whiteSpace:"nowrap"}}>{i===0?"MEILLEUR":i===1?"2ᵉ choix":"3ᵉ choix"}</span>
                  </div>}
                  {r.imageUrl&&<img src={proxyImg(r.imageUrl)} alt="" className={isPodium?"print-racket-img":"print-racket-img-sm"} style={{
                    width:isPodium?60:36, height:isPodium?72:44, objectFit:"contain", borderRadius:isPodium?10:6, flexShrink:0,
                    background:isPodium?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.04)", padding:isPodium?4:2,
                    border:isPodium?`1px solid ${i===0?"rgba(250,204,21,0.3)":i===1?"rgba(148,163,184,0.2)":"rgba(217,119,6,0.2)"}`:"none",
                  }} onError={e=>{e.target.style.display='none'}}/>}
                  {!medal&&!r.imageUrl&&<div style={{width:10,height:10,borderRadius:"50%",background:r.color,border:"1px solid #999",flexShrink:0,printColorAdjust:"exact",WebkitPrintColorAdjust:"exact"}}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize: i===0 ? 15 : isPodium ? 13 : 11,fontWeight:800,color:"#e2e8f0"}}>{r.name}</span>
                      <span className={`print-badge ${badgeClass}`} style={{background:fy.bg,border:`1px solid ${fy.border}`,borderRadius:6,padding:"3px 8px",fontSize:7,fontWeight:700,color:"#fff",flexShrink:0,whiteSpace:"nowrap"}}>{fy.text}</span>
                    </div>
                    <div style={{fontSize:isPodium?9:8,color:"#64748b",marginTop:3}}>
                      {r.shape} · {r.weight} · {r.brand}{r.player && r.player !== "—" ? ` · 🎾 ${r.player}` : ""}{r.price && r.price !== "—" ? ` · ${r.price}` : ""}
                    </div>
                  </div>
                  <div className={scoreClass} style={{fontSize: i===0 ? 28 : isPodium ? 22 : 16, fontWeight:800, color:gs>=7.5?"#4ade80":gs>=6.5?"#fbbf24":"#f87171", fontFamily:"'Outfit'", lineHeight:1, flexShrink:0, marginLeft:8}}>
                    {fmtPct(gs)}
                  </div>
                </div>
                
                {/* Score bars — 2 rows of 3, thicker for podium */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:isPodium?"6px 14px":"4px 10px",marginBottom:isPodium?8:5}}>
                  {ATTRS.map(attr=>{
                    const v = r.scores[attr];
                    const isKey = (attr==="Confort"&&hasArmInj) || 
                      (attr==="Maniabilité"&&(hasLegInj||(profile.styleTags||[]).includes("veloce"))) ||
                      (profile.priorityTags||[]).some(t=>(t==="confort"&&attr==="Confort")||(t==="polyvalence"&&["Contrôle","Tolérance","Maniabilité"].includes(attr))||(t==="puissance"&&attr==="Puissance")||(t==="controle"&&attr==="Contrôle")||(t==="spin"&&attr==="Spin")||(t==="legerete"&&attr==="Maniabilité")||(t==="protection"&&attr==="Confort")||(t==="reprise"&&["Confort","Tolérance","Maniabilité"].includes(attr)));
                    const low = hasArmInj && attr==="Confort" && v<7;
                    const barH = isPodium ? 7 : 4;
                    const barClass = low?"print-bar-fill-red":v>=7.5?"print-bar-fill-green":v>=6?"print-bar-fill-gray":"print-bar-fill-yellow";
                    return(<div key={attr} style={{minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:isPodium?9:8,color:isKey?"#f97316":"#64748b",fontWeight:isKey?700:500}}>{isKey?"★ ":""}{attr}</span>
                        <span style={{fontSize:isPodium?10:9,color:low?"#f87171":v>=7.5?"#4ade80":v>=6?"#cbd5e1":"#fbbf24",fontWeight:700,flexShrink:0,marginLeft:4}}>{v}</span>
                      </div>
                      <div className="print-bar-bg" style={{height:barH,background:"rgba(255,255,255,0.06)",borderRadius:barH/2,marginTop:2}}>
                        <div className={barClass} style={{height:barH,borderRadius:barH/2,width:`${v*10}%`,background:low?"#f87171":v>=7.5?"#4ade80":v>=6?"#64748b":"#fbbf24",printColorAdjust:"exact",WebkitPrintColorAdjust:"exact"}}/>
                      </div>
                    </div>);
                  })}
                </div>
                
                {/* Warnings and verdict */}
                {criticalLow&&<div className="print-warn" style={{fontSize:9,color:"#f87171",fontWeight:600,marginBottom:3}}>⚠ Confort insuffisant ({r.scores.Confort}/10) pour blessures {ptags.filter(t=>ARM_INJ.includes(t)).map(t=>({dos:"Dos",poignet:"Poignet",coude:"Coude",epaule:"Épaule"}[t])).join("/")} — risque de douleurs</div>}
                <div className="print-verdict" style={{fontSize:isPodium?10:9,color:"#94a3b8",lineHeight:1.6}}>{r.verdict}</div>
              </div>);
            });
            return cards;
            } catch(e) { console.error("[Pertinence:ranking]", e); return null; }
          })()}

          {/* ===== 🎯 DISCOVERY: Priority-based picks from DB ===== */}
          {(()=>{
            try {
            const prioTagIds = profile.priorityTags||[];
            if (!prioTagIds.length || !rackets.length) return null;
            
            const prioAttrMap = {puissance:'Puissance',controle:'Contrôle',confort:'Confort',spin:'Spin',legerete:'Maniabilité',protection:'Confort',reprise:'Confort',polyvalence:'Contrôle'};
            const prioAttrs = [...new Set(prioTagIds.map(t=>prioAttrMap[t]).filter(Boolean))];
            const prioLabels = prioTagIds.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            if (!prioAttrs.length) return null;
            
            // Get existing racket names to exclude (normalized) — IDs don't match because user rackets have timestamp suffixes
            const existingNames = new Set(rackets.map(r=>(r.name||"").toLowerCase().trim()));
            
            // Filter DB pool by level category (same logic as matchFromDB)
            const age = Number(profile.age)||0;
            const ht = Number(profile.height)||0;
            const isJunior = (age>0&&age<15)||(ht>0&&ht<150);
            let pool;
            if (isJunior) {
              pool = getMergedDB().filter(r=>r.category==='junior');
            } else {
              const lvl = profile.level||'Débutant';
              const catMap = {'Débutant':['debutant','intermediaire'],'Intermédiaire':['intermediaire','debutant','avance','expert'],'Avancé':['avance','intermediaire','expert'],'Expert':['expert','avance','intermediaire']};
              const cats = catMap[lvl]||['debutant','intermediaire'];
              pool = getMergedDB().filter(r=>cats.includes(r.category));
            }
            
            // Exclude already analyzed rackets
            pool = pool.filter(r=>!existingNames.has((r.name||"").toLowerCase().trim()));
            
            // Filter by brand preferences if any
            const brandPref = (profile.brandTags||[]).map(id=>BRAND_TAGS.find(t=>t.id===id)?.label?.toLowerCase()).filter(Boolean);
            if (brandPref.length) {
              const brandPool = pool.filter(r=>brandPref.includes(r.brand.toLowerCase()));
              const otherTop = pool.filter(r=>!brandPref.includes(r.brand.toLowerCase()))
                .map(r=>({...r, _pa: prioAttrs.reduce((s,k)=>(s+(r.scores[k]||0)),0)/prioAttrs.length}))
                .sort((a,b)=>b._pa-a._pa).slice(0,2);
              pool = [...brandPool, ...otherTop];
            }
            
            // Score by priority attributes average (70%) + global score (30%)
            const scored = pool.map(r=>{
              const prioAvg = prioAttrs.reduce((s,k)=>(s+(r.scores[k]||0)),0)/prioAttrs.length;
              const gs = computeGlobalScore(r.scores, profile, r);
              return {...r, _prioAvg: Math.round(prioAvg*10)/10, _prioScore: prioAvg*0.7 + gs*0.3, globalScore: gs};
            });
            scored.sort((a,b)=>b.globalScore-a.globalScore);
            const picks = scored.slice(0, 4);
            if (!picks.length) return null;
            
            const prioTitle = prioLabels.join(' & ');
            
            return <>
              <div className="print-section-divider" style={{borderTop:"2px solid rgba(249,115,22,0.15)",margin:"16px 0 8px",paddingTop:8}}>
                <div className="no-print" style={{fontSize:12,fontWeight:800,color:"#f97316",marginBottom:4}}>🎯 À DÉCOUVRIR — Top {prioTitle}</div>
                <div className="print-section-title" style={{display:"none",fontSize:11,fontWeight:700,color:"#f97316",marginBottom:4}}>🎯 À DÉCOUVRIR — Top {prioTitle}</div>
                <div className="no-print" style={{fontSize:9,color:"#64748b",marginBottom:8}}>Raquettes de la base hors sélection, classées par {prioLabels.join(' + ')}</div>
              </div>
              {picks.map((r,idx)=>{
                const gs = r.globalScore;
                const forYouVal = computeForYou(r.scores, profile, r);
                const fy = fyConfig[forYouVal]||fyConfig.partial;
                const badgeClass = forYouVal==="recommended"?"print-badge-green":forYouVal==="no"?"print-badge-red":"print-badge-orange";
                return <div key={"disco-"+r.id} className="print-card" style={{
                  background:"rgba(249,115,22,0.04)", border:"1px solid rgba(249,115,22,0.2)",
                  borderRadius:12, padding:"12px 14px", marginBottom:8, boxSizing:"border-box", overflow:"hidden",
                  borderLeft:"5px solid rgba(249,115,22,0.5)", pageBreakInside:"avoid", breakInside:"avoid",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,minWidth:28}}>
                      <span style={{fontSize:18,lineHeight:1}}>🎯</span>
                    </div>
                    {r.imageUrl&&<img src={proxyImg(r.imageUrl)} alt="" className="print-racket-img-sm" style={{width:40,height:48,objectFit:"contain",borderRadius:8,flexShrink:0,background:"rgba(255,255,255,0.06)",padding:2}} onError={e=>{e.target.style.display='none'}}/>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{r.name}</span>
                        <span className={`print-badge ${badgeClass}`} style={{background:fy.bg,border:`1px solid ${fy.border}`,borderRadius:6,padding:"3px 8px",fontSize:7,fontWeight:700,color:"#fff",flexShrink:0,whiteSpace:"nowrap"}}>{fy.text}</span>
                        <span style={{background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.3)",borderRadius:6,padding:"3px 8px",fontSize:7,fontWeight:700,color:"#f97316",flexShrink:0,whiteSpace:"nowrap"}}>★ {r._prioAvg}/10</span>
                      </div>
                      <div style={{fontSize:9,color:"#64748b",marginTop:3}}>
                        {r.shape} · {r.weight} · {r.brand}{r.player && r.player !== "—" ? ` · 🎾 ${r.player}` : ""}{r.price && r.price !== "—" ? ` · ${r.price}` : ""}
                      </div>
                    </div>
                    <div style={{fontSize:18,fontWeight:800,color:gs>=7.5?"#4ade80":gs>=6.5?"#fbbf24":"#f87171",fontFamily:"'Outfit'",lineHeight:1,flexShrink:0,marginLeft:8}}>
                      {fmtPct(gs)}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"5px 12px",marginBottom:6}}>
                    {ATTRS.map(attr=>{
                      const v = r.scores[attr];
                      const isKey = prioAttrs.includes(attr);
                      return <div key={attr} style={{minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:9,color:isKey?"#f97316":"#64748b",fontWeight:isKey?700:500}}>{isKey?"★ ":""}{attr}</span>
                          <span style={{fontSize:10,color:v>=7.5?"#4ade80":v>=6?"#cbd5e1":"#fbbf24",fontWeight:700,flexShrink:0,marginLeft:4}}>{v}</span>
                        </div>
                        <div className="print-bar-bg" style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,marginTop:2}}>
                          <div className={v>=7.5?"print-bar-fill-green":v>=6?"print-bar-fill-gray":"print-bar-fill-yellow"} style={{height:6,borderRadius:3,width:`${v*10}%`,background:v>=7.5?"#4ade80":v>=6?"#64748b":"#fbbf24",printColorAdjust:"exact",WebkitPrintColorAdjust:"exact"}}/>
                        </div>
                      </div>;
                    })}
                  </div>
                  <div className="print-verdict" style={{fontSize:10,color:"#94a3b8",lineHeight:1.6}}>{r.verdict}</div>
                </div>;
              })}
            </>;
            } catch(e) { console.error("[Pertinence:discovery]", e); return null; }
          })()}

          {/* ===== PRINT FOOTER ===== */}
          <div className="print-footer-wrap print-header" style={{display:"none",marginTop:16,borderTop:"2px solid #e5e7eb",paddingTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <svg width="18" height="18" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="44" height="44" rx="10" fill="#f97316"/>
                  <ellipse cx="22" cy="18" rx="10" ry="12" stroke="#fff" strokeWidth="2.5" fill="none"/>
                  <line x1="22" y1="30" x2="22" y2="38" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="33" cy="32" r="3.5" fill="#fff" opacity="0.9"/>
                </svg>
                <span style={{fontSize:8,color:"#999"}}><span style={{color:"#f97316",fontWeight:700}}>Padel Analyzer</span> V12 · Scoring hybride calibré</span>
              </div>
              <div style={{fontSize:8,color:"#999",textAlign:"right"}}>
                {new Date().toLocaleDateString('fr-FR')} · Prix indicatifs — vérifier en boutique
              </div>
            </div>
          </div>
        </div>
      </>}


      {/* ============================================================ */}
      {/* LEXIQUE */}
      {/* ============================================================ */}
      <div style={{...S.card,marginTop:4}}>
        <div style={S.title}>📖 Lexique des critères</div>
        {ATTRS.map(a=>(<div key={a} onClick={()=>setOpenAttr(o=>o===a?null:a)} style={{padding:"8px 10px",marginBottom:3,borderRadius:10,background:openAttr===a?"rgba(249,115,22,0.06)":"transparent",cursor:"pointer",transition:"background 0.15s ease"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{a}</span><span style={{fontSize:9,color:"#475569",transition:"transform 0.2s ease",transform:openAttr===a?"rotate(90deg)":"none"}}>▸</span></div>
          {openAttr===a&&<div style={{fontSize:10,color:"#94a3b8",marginTop:5,lineHeight:1.6,animation:"fadeIn 0.2s ease"}}>{explanations[a]}</div>}
        </div>))}
      </div>

      <div style={{textAlign:"center",marginTop:18,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.04)",fontSize:8,color:"#334155",letterSpacing:"0.05em"}}>
        <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> V12 · Analyse personnalisée · {new Date().toLocaleDateString('fr-FR')}<br/><span style={{fontSize:7,opacity:0.7}}>Prix indicatifs — vérifier en boutique</span>
      </div>
      </>}

      {/* ============================================================ */}
      {/* ARENA OVERLAY — Full-screen immersive comparator */}
      {/* ============================================================ */}
      {showArena&&(()=>{
        const r2 = selRackets;
        if(r2.length<2){setShowArena(false);return null;}

        // Compute all data
        const scored = r2.map(r=>({
          ...r,
          _gs: computeGlobalScore(r.scores, profile, r),
          _fy: computeForYou(r.scores, profile, r),
        }));
        scored.sort((a,b)=>b._gs-a._gs);
        const champion = scored[0];

        // Per-attribute winners
        const attrWinners = {};
        ATTRS.forEach(a=>{
          let mx=0;
          r2.forEach(r=>{const v=Number(r.scores[a])||0;if(v>mx)mx=v;});
          attrWinners[a]=r2.filter(r=>(Number(r.scores[a])||0)===mx&&r2.some(x=>(Number(x.scores[a])||0)<mx)).map(r=>r.id);
        });
        scored.forEach(r=>{r._wins=ATTRS.filter(a=>attrWinners[a].includes(r.id)).length;});

        const compareRadar = ATTRS.map(a=>{const pt={attribute:a};r2.forEach(r=>{pt[r.shortName]=Number(r.scores[a])||0;});return pt;});
        const fyConfig4={recommended:{text:"RECOMMANDÉ",color:"#4CAF50"},partial:{text:"JOUABLE",color:"#FF9800"},no:{text:"DÉCONSEILLÉ",color:"#ef4444"}};

        const specRows = [
          {label:"Forme",key:"shape"},{label:"Poids",key:"weight"},{label:"Balance",key:"balance"},
          {label:"Surface",key:"surface"},{label:"Noyau",key:"core"},{label:"Prix",key:"price"},
        ];

        return (
        <div style={{
          position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,
          background:"radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.15), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.1), transparent 50%), linear-gradient(180deg, #0a0a1a 0%, #0f0a24 30%, #120a2e 60%, #0a0a1a 100%)",
          overflowY:"auto", overflowX:"hidden",
        }}>
          <style>{`
            @keyframes arenaSlideIn { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
            @keyframes arenaFadeIn { from{opacity:0} to{opacity:1} }
            @keyframes arenaPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
            @keyframes vsGlow { 0%,100%{text-shadow:0 0 20px rgba(124,58,237,0.5),0 0 40px rgba(236,72,153,0.3)} 50%{text-shadow:0 0 40px rgba(124,58,237,0.8),0 0 80px rgba(236,72,153,0.5)} }
            @keyframes barGrow { from{width:0} }
            @keyframes crownDrop { from{opacity:0;transform:translateY(-20px) scale(0.5)} to{opacity:1;transform:translateY(0) scale(1)} }
            @keyframes starPop { 0%{transform:scale(0) rotate(-180deg);opacity:0} 60%{transform:scale(1.3) rotate(10deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
          `}</style>

          {/* Ambient particles */}
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
            {[...Array(12)].map((_,i)=>(
              <div key={i} style={{
                position:"absolute",
                width:Math.random()*3+1,height:Math.random()*3+1,
                borderRadius:"50%",
                background:i%3===0?"rgba(124,58,237,0.4)":i%3===1?"rgba(236,72,153,0.3)":"rgba(99,102,241,0.3)",
                left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,
                animation:`arenaPulse ${3+Math.random()*4}s ease-in-out infinite`,
                animationDelay:`${Math.random()*3}s`,
              }}/>
            ))}
          </div>

          <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto",padding:"20px 16px 40px"}}>

            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,animation:"arenaFadeIn 0.4s ease"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>⚔️</span>
                <div>
                  <h1 style={{fontFamily:"'Outfit'",fontSize:22,fontWeight:800,background:"linear-gradient(135deg,#c4b5fd,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0,letterSpacing:"-0.02em"}}>L'ARÈNE</h1>
                  <div style={{fontSize:9,color:"#7c3aed",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Comparateur immersif</div>
                </div>
              </div>
              <button onClick={()=>setShowArena(false)} style={{width:40,height:40,borderRadius:12,border:"1px solid rgba(124,58,237,0.3)",background:"rgba(124,58,237,0.1)",color:"#c4b5fd",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.25)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(124,58,237,0.1)";}}>✕</button>
            </div>

            {/* VS CARDS — fighting game style */}
            <div style={{display:"flex",alignItems:"stretch",gap:0,marginBottom:28,animation:"arenaSlideIn 0.6s ease"}}>
              {scored.map((r,i)=>{
                const isChamp = r.id===champion.id;
                const fy = fyConfig4[r._fy]||fyConfig4.partial;
                return (
                  <React.Fragment key={r.id}>
                    {i>0&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,width:50,zIndex:2}}>
                      <div style={{fontFamily:"'Outfit'",fontSize:20,fontWeight:900,color:"#7c3aed",animation:"vsGlow 2s ease-in-out infinite",textAlign:"center",lineHeight:1}}>VS</div>
                    </div>}
                    <div style={{
                      flex:1,minWidth:0,
                      background: isChamp
                        ? "linear-gradient(165deg,rgba(124,58,237,0.12),rgba(236,72,153,0.06),rgba(0,0,0,0.2))"
                        : "rgba(255,255,255,0.02)",
                      border:`1.5px solid ${isChamp?"rgba(124,58,237,0.4)":"rgba(255,255,255,0.06)"}`,
                      borderRadius:18,padding:"20px 14px",textAlign:"center",position:"relative",
                      boxShadow:isChamp?"0 0 40px rgba(124,58,237,0.1)":"none",
                      transition:"all 0.3s",
                    }}>
                      {isChamp&&scored.length>1&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",animation:"crownDrop 0.6s ease 0.8s both"}}>
                        <span style={{fontSize:22}}>👑</span>
                      </div>}
                      {r.imageUrl&&<img src={proxyImg(r.imageUrl)} alt="" style={{width:64,height:80,objectFit:"contain",margin:"0 auto 8px",display:"block",filter:isChamp?"drop-shadow(0 4px 16px rgba(124,58,237,0.3))":"none",borderRadius:8}} onError={e=>{e.target.style.display='none'}}/>}
                      <div style={{width:10,height:10,borderRadius:"50%",background:r.color,margin:"0 auto 6px",boxShadow:`0 0 12px ${r.color}60`}}/>
                      <div style={{fontSize:13,fontWeight:700,color:isChamp?"#e2e8f0":"#94a3b8",lineHeight:1.2}}>{r.shortName}</div>
                      <div style={{fontSize:9,color:"#64748b",marginTop:3}}>{r.brand}</div>
                      <div style={{fontSize:24,fontWeight:800,color:isChamp?"#c4b5fd":"#475569",fontFamily:"'Outfit'",marginTop:8}}>{r._gs.toFixed(1)}<span style={{fontSize:10,color:"#64748b"}}>/10</span></div>
                      <div style={{marginTop:4}}>
                        <span style={{fontSize:8,fontWeight:700,color:fy.color,background:`${fy.color}15`,border:`1px solid ${fy.color}30`,borderRadius:6,padding:"2px 8px"}}>{fy.text}</span>
                      </div>
                      <div style={{fontSize:10,color:"#7c3aed",fontWeight:600,marginTop:6}}>{r._wins} critère{r._wins>1?"s":""} gagné{r._wins>1?"s":""}</div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* RADAR DUEL */}
            <div style={{background:"rgba(124,58,237,0.04)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:20,padding:16,marginBottom:20,animation:"arenaSlideIn 0.6s ease 0.2s both"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textAlign:"center",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Radar comparatif</div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={compareRadar} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="rgba(124,58,237,0.12)" gridType="polygon"/>
                  <PolarAngleAxis dataKey="attribute" tick={{fill:"#a78bfa",fontSize:10,fontWeight:600}}/>
                  <PolarRadiusAxis angle={90} domain={[0,10]} tick={{fill:"#4c1d95",fontSize:8}} tickCount={6} axisLine={false}/>
                  {r2.map((r,i)=>(
                    <Radar key={r.id} name={r.shortName} dataKey={r.shortName} stroke={r.color} fill={r.color} fillOpacity={0.1} strokeWidth={2.5}/>
                  ))}
                  <Legend wrapperStyle={{fontSize:10,color:"#a78bfa",paddingTop:6}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* ATTRIBUTE DUEL BARS */}
            <div style={{background:"rgba(124,58,237,0.04)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:20,padding:16,marginBottom:20,animation:"arenaSlideIn 0.6s ease 0.3s both"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textAlign:"center",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Duel par critère</div>
              {ATTRS.map((attr,ai)=>{
                const vals = r2.map(r=>({r,v:Number(r.scores[attr])||0}));
                const maxV = Math.max(...vals.map(x=>x.v));
                return <div key={attr} style={{marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#c4b5fd",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span>{attr}</span>
                    {attrWinners[attr].length===1&&<span style={{fontSize:8,color:"#7c3aed",background:"rgba(124,58,237,0.15)",padding:"1px 6px",borderRadius:4}}>👑 {r2.find(r=>r.id===attrWinners[attr][0])?.shortName}</span>}
                    {attrWinners[attr].length===0&&<span style={{fontSize:8,color:"#475569"}}>Égalité</span>}
                  </div>
                  {vals.map(({r,v})=>{
                    const isW = attrWinners[attr].includes(r.id);
                    return <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:r.color,flexShrink:0,boxShadow:isW?`0 0 8px ${r.color}`:""}}/>
                      <div style={{width:55,fontSize:9,color:"#94a3b8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flexShrink:0}}>{r.shortName}</div>
                      <div style={{flex:1,height:8,background:"rgba(124,58,237,0.08)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${v*10}%`,background:isW?"linear-gradient(90deg,#7c3aed,#ec4899)":r.color,borderRadius:4,animation:`barGrow 0.8s ease ${0.3+ai*0.05}s both`,opacity:isW?1:0.5}}/>
                      </div>
                      <div style={{width:32,textAlign:"right",fontSize:11,fontWeight:isW?800:500,color:isW?"#c4b5fd":"#64748b",fontFamily:"'Outfit'"}}>{v.toFixed(1)}</div>
                    </div>;
                  })}
                </div>;
              })}
            </div>

            {/* SPECS COMPARISON */}
            <div style={{background:"rgba(124,58,237,0.04)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:20,padding:16,marginBottom:20,animation:"arenaSlideIn 0.6s ease 0.4s both",overflowX:"auto"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textAlign:"center",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Fiche technique</div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  <th style={{padding:"6px 8px",textAlign:"left",color:"#4c1d95",fontSize:9,fontWeight:600}}></th>
                  {scored.map(r=>(
                    <th key={r.id} style={{padding:"6px 8px",textAlign:"center"}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:r.color,margin:"0 auto 3px"}}/>
                      <span style={{fontSize:10,fontWeight:700,color:r.id===champion.id?"#c4b5fd":"#64748b"}}>{r.shortName}</span>
                    </th>
                  ))}
                </tr></thead>
                <tbody>
                  {specRows.map(({label,key},si)=>(
                    <tr key={key} style={{background:si%2===0?"rgba(124,58,237,0.03)":"transparent"}}>
                      <td style={{padding:"5px 8px",fontSize:9,color:"#a78bfa",fontWeight:600}}>{label}</td>
                      {scored.map(r=>(
                        <td key={r.id} style={{padding:"5px 8px",textAlign:"center",fontSize:10,color:"#cbd5e1"}}>{r[key]||"—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VERDICT FINAL */}
            <div style={{background:"linear-gradient(135deg,rgba(124,58,237,0.1),rgba(236,72,153,0.06))",border:"1.5px solid rgba(124,58,237,0.3)",borderRadius:20,padding:20,textAlign:"center",animation:"arenaSlideIn 0.6s ease 0.5s both",boxShadow:"0 8px 40px rgba(124,58,237,0.1)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>🏆 Verdict de l'Arène</div>
              <div style={{animation:"starPop 0.5s ease 1.2s both"}}>
                <span style={{fontSize:36}}>👑</span>
              </div>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:4}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:champion.color,boxShadow:`0 0 16px ${champion.color}60`}}/>
                <span style={{fontSize:20,fontWeight:800,color:"#e2e8f0",fontFamily:"'Outfit'"}}>{champion.shortName}</span>
              </div>
              <div style={{fontSize:26,fontWeight:900,color:"#c4b5fd",fontFamily:"'Outfit'",marginTop:2}}>{champion._gs.toFixed(1)}<span style={{fontSize:12,color:"#7c3aed"}}>/10</span></div>
              <div style={{fontSize:11,color:"#a78bfa",marginTop:4}}>
                Meilleure correspondance pour <strong style={{color:"#c4b5fd"}}>{profileName}</strong>
              </div>
              <div style={{fontSize:10,color:"#7c3aed",marginTop:2}}>{champion._wins} critère{champion._wins>1?"s":""} remporté{champion._wins>1?"s":""} sur {ATTRS.length}</div>

              {/* Podium */}
              <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:16,flexWrap:"wrap"}}>
                {scored.map((r,i)=>(
                  <div key={r.id} style={{
                    display:"flex",alignItems:"center",gap:6,
                    padding:"6px 14px",
                    background:i===0?"rgba(124,58,237,0.15)":"rgba(255,255,255,0.02)",
                    border:`1px solid ${i===0?"rgba(124,58,237,0.4)":"rgba(255,255,255,0.06)"}`,
                    borderRadius:10,
                  }}>
                    <span style={{fontSize:14}}>{["🥇","🥈","🥉","4️⃣"][i]||""}</span>
                    <div style={{width:8,height:8,borderRadius:"50%",background:r.color}}/>
                    <span style={{fontSize:10,fontWeight:i===0?700:500,color:i===0?"#c4b5fd":"#94a3b8"}}>{r.shortName}</span>
                    <span style={{fontSize:11,fontWeight:800,color:i===0?"#c4b5fd":"#64748b",fontFamily:"'Outfit'"}}>{r._gs.toFixed(1)}</span>
                  </div>
                ))}
              </div>

              {/* Exit */}
              <button onClick={()=>setShowArena(false)} style={{
                marginTop:20,padding:"12px 32px",borderRadius:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
                background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.35)",
                color:"#c4b5fd",fontSize:12,fontWeight:700,transition:"all 0.2s",
              }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.25)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(124,58,237,0.15)";}}>
                ← Retour à l'analyse
              </button>
            </div>

          </div>
        </div>
        );
      })()}

      {/* ============================================================ */}
      {/* CUSTOM CONFIRM MODAL */}
      {/* ============================================================ */}
      {confirmModal&&<div onClick={()=>confirmModal.onCancel()} style={{
        position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",
        display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,animation:"fadeIn 0.2s ease",
      }}>
        <div onClick={e=>e.stopPropagation()} style={{
          background:"#1a1f2e",border:"1px solid rgba(255,255,255,0.12)",borderRadius:20,
          padding:"28px 24px 22px",maxWidth:340,width:"90%",textAlign:"center",
          boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"fadeIn 0.25s ease",
        }}>
          <div style={{fontSize:32,marginBottom:12}}>🗑</div>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",marginBottom:6}}>{confirmModal.message}</div>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 20px"}}>Cette action est irréversible.</p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>confirmModal.onCancel()} style={{
              flex:1,padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#94a3b8",
            }}>Annuler</button>
            <button onClick={()=>confirmModal.onConfirm()} style={{
              flex:1,padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
              background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.4)",color:"#ef4444",
            }}>Supprimer</button>
          </div>
        </div>
      </div>}

      {/* PASSWORD MODAL */}
      {passwordModal&&<div onClick={()=>{setPasswordModal(null);setPinInput("");setPinError("");}} style={{
        position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",
        display:"flex",alignItems:"center",justifyContent:"center",zIndex:2100,animation:"fadeIn 0.2s ease",
      }}>
        <div onClick={e=>e.stopPropagation()} style={{
          background:"#1a1f2e",border:"1px solid rgba(255,255,255,0.12)",borderRadius:20,
          padding:"28px 24px 22px",maxWidth:340,width:"90%",textAlign:"center",
          boxShadow:"0 20px 60px rgba(0,0,0,0.5)",animation:"fadeIn 0.25s ease",
        }}>
          <div style={{fontSize:32,marginBottom:12}}>{(passwordModal.mode==="setpin"||(!getAdminPin()&&passwordModal.mode!=="setpin"))?"🔑":"🔒"}</div>
          <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",marginBottom:6}}>
            {(passwordModal.mode==="setpin"||(!getAdminPin()&&passwordModal.mode!=="setpin"))
              ?"Créer un code administrateur"
              :"Code administrateur requis"}
          </div>
          <p style={{fontSize:11,color:"#64748b",margin:"0 0 16px"}}>
            {(passwordModal.mode==="setpin"||(!getAdminPin()&&passwordModal.mode!=="setpin"))
              ?"Ce code unique protégera tous les profils verrouillés."
              :`Entrez le code pour ${passwordModal.mode==="unlock-toggle"?"déverrouiller":"accéder au"} profil "${passwordModal.profileName}".`}
          </p>
          <input type="text" inputMode="numeric" value={pinInput} autoComplete="off" data-1p-ignore data-lpignore="true" data-form-type="other" name={"pa-pin-"+Date.now()} onChange={e=>{setPinInput(e.target.value);setPinError("");}}
            onKeyDown={e=>{if(e.key==="Enter"){
              const needsSetPin = passwordModal.mode==="setpin" || !getAdminPin();
              if(needsSetPin){
                if(pinInput.length<4){setPinError("4 caractères minimum");return;}
                setAdminPin(pinInput);passwordModal.onSuccess();setPinInput("");setPinError("");
              } else {
                if(pinInput===getAdminPin()){passwordModal.onSuccess();setPinInput("");setPinError("");}
                else{setPinError("Code incorrect");}
              }
            }}}
            placeholder={(passwordModal.mode==="setpin"||!getAdminPin())?"Code (4+ caractères)":"Entrer le code"}
            autoFocus
            style={{width:"100%",padding:"12px 14px",borderRadius:12,fontSize:18,fontWeight:700,textAlign:"center",letterSpacing:"0.3em",WebkitTextSecurity:"disc",
              background:"rgba(255,255,255,0.06)",border:`1px solid ${pinError?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.12)"}`,
              color:"#f1f5f9",fontFamily:"'Outfit',sans-serif",outline:"none",boxSizing:"border-box",
            }}/>
          {pinError&&<div style={{fontSize:11,color:"#ef4444",marginTop:8,fontWeight:600}}>{pinError}</div>}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={()=>{setPasswordModal(null);setPinInput("");setPinError("");}} style={{
              flex:1,padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#94a3b8",
            }}>Annuler</button>
            <button onClick={()=>{
              const needsSetPin = passwordModal.mode==="setpin" || !getAdminPin();
              if(needsSetPin){
                if(pinInput.length<4){setPinError("4 caractères minimum");return;}
                setAdminPin(pinInput);passwordModal.onSuccess();setPinInput("");setPinError("");
              } else {
                if(pinInput===getAdminPin()){passwordModal.onSuccess();setPinInput("");setPinError("");}
                else{setPinError("Code incorrect");}
              }
            }} style={{
              flex:1,padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",
              background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.4)",color:"#a5b4fc",
            }}>{(passwordModal.mode==="setpin"||!getAdminPin())?"Créer":"Valider"}</button>
          </div>
        </div>
      </div>}

    </div>
  );

  // ============================================================
  // HELPER: Render a suggestion card with checkbox
  // ============================================================
  function renderSuggestCard(s, realIdx, checked, isTopPick) {
    const isPrio = s.category === "priority";
    const accentColor = isPrio ? "#fbbf24" : "#f97316";
    return (
      <div key={realIdx} onClick={()=>!s._added&&toggleSuggestCheck(realIdx)} style={{
        background:s._added?"rgba(76,175,80,0.08)":checked?`${isPrio?"rgba(251,191,36,0.12)":"rgba(249,115,22,0.12)"}`:"rgba(255,255,255,0.04)",
        border:`1px solid ${s._added?"#4CAF50":checked?accentColor:"rgba(255,255,255,0.1)"}`,
        borderRadius:10,padding:"10px 12px",marginBottom:6,
        cursor:s._added?"default":"pointer",opacity:s._added?0.7:1,
        transition:"all 0.2s",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {!s._added&&<div style={{
              width:18,height:18,borderRadius:4,
              border:`2px solid ${checked?accentColor:"rgba(255,255,255,0.2)"}`,
              background:checked?`${accentColor}33`:"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,color:accentColor,fontWeight:700,flexShrink:0,
            }}>{checked?"✓":""}</div>}
            <div>
              <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>
                {isTopPick&&!s._added?"⭐ ":isPrio&&!s._added?"⚡ ":""}{s.name}
              </div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>{s.brand} · {s.shape} · {s.weight} · {s.price}</div>
            </div>
          </div>
          {s._added&&<span style={{fontSize:9,background:"#1B5E20",border:"1px solid #4CAF50",borderRadius:4,padding:"2px 6px",color:"#fff",fontWeight:700,flexShrink:0}}>AJOUTÉE ✓</span>}
        </div>
        <div style={{fontSize:10,color:"#cbd5e1",marginTop:5,lineHeight:1.4,fontStyle:"italic",marginLeft:s._added?0:26}}>{s.description}</div>
        {s._error&&<div style={{fontSize:9,color:"#ef4444",marginTop:3,marginLeft:26}}>⚠ Erreur: {s._error}</div>}
      </div>
    );
  }
}
