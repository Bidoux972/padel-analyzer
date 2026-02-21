import { useState, useCallback, useEffect } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import RACKETS_DB from "./rackets-db.json";

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
  styleTags: [],
  styleExtra: "",
  injuryTags: [],
  injuryExtra: "",
  priorityTags: [],
  priorityExtra: "",
  brandTags: [],
  frequency: "Occasionnel (<1x/semaine)", competition: false,
};

const INITIAL_RACKETS = [];

// Load saved rackets from localStorage
function loadSavedRackets() {
  try {
    const raw = localStorage.getItem('padel_rackets');
    if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr) && arr.length) return arr; }
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

const ATTRS = ["Puissance","Contrôle","Confort","Spin","Maniabilité","Tolérance"];
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
  const prioStr = [...priorities, p.priorityExtra].filter(Boolean).join(", ") || "Non précisé";
  const brandStr = brands.length ? brands.join(", ") : "Toutes marques";
  const physique = [p.age ? `${p.age} ans` : null, p.height ? `${p.height}cm` : null, p.weight ? `${p.weight}kg` : null].filter(Boolean).join(", ");
  return `Joueur: ${physique || "Non renseigné"}. Niveau: ${p.level}. Main: ${p.hand||"Droitier"}. Côté: ${p.side}. Style: ${styleStr}. Blessures: ${injuryStr}. Fréquence: ${p.frequency}. Compétition: ${p.competition?"Oui":"Non"}. Priorité: ${prioStr}. Marques préférées: ${brandStr}.`;
}

// Weighted global score /10 based on player profile
function computeGlobalScore(scores, profile) {
  // Base weights (equal)
  const w = { Puissance:1, Contrôle:1, Confort:1, Spin:1, Maniabilité:1, Tolérance:1 };
  
  // Priority tags boost relevant criteria
  const prioMap = {
    confort: { Confort:1.5 },
    polyvalence: { Contrôle:0.5, Maniabilité:0.5, Tolérance:0.5 },
    puissance: { Puissance:1.5 },
    controle: { Contrôle:1.5 },
    spin: { Spin:1.5 },
    legerete: { Maniabilité:1.5 },
    protection: { Confort:1.5 },
    reprise: { Confort:1.5, Tolérance:1.0, Maniabilité:0.5 },
  };
  for (const tag of (profile.priorityTags||[])) {
    const boosts = prioMap[tag];
    if (boosts) for (const [k,v] of Object.entries(boosts)) w[k] = (w[k]||1)+v;
  }
  
  // Style tags influence
  const styleMap = {
    offensif: { Puissance:0.5 },
    defensif: { Contrôle:0.5, Tolérance:0.5 },
    tactique: { Contrôle:0.5, Maniabilité:0.3 },
    puissant: { Puissance:0.5, Spin:0.3 },
    veloce: { Maniabilité:0.8 },
    endurant: { Confort:0.5, Tolérance:0.3 },
    contre: { Tolérance:0.5, Contrôle:0.3 },
    polyvalent: { Contrôle:0.3, Tolérance:0.3 },
    technique: { Contrôle:0.5, Spin:0.3 },
  };
  for (const tag of (profile.styleTags||[])) {
    const boosts = styleMap[tag];
    if (boosts) for (const [k,v] of Object.entries(boosts)) w[k] = (w[k]||1)+v;
  }
  
  // Injuries → arm injuries boost Confort, leg injuries boost Maniabilité
  const ARM_INJURIES = ["dos","poignet","coude","epaule"];
  const LEG_INJURIES = ["genou","cheville","mollet","hanche","achille"];
  const tags = profile.injuryTags||[];
  const hasArmInjury = tags.some(t=>ARM_INJURIES.includes(t));
  const hasLegInjury = tags.some(t=>LEG_INJURIES.includes(t));
  if (hasArmInjury) w.Confort = (w.Confort||1) + 2;
  if (hasLegInjury) w.Maniabilité = (w.Maniabilité||1) + 1.5;
  
  // Height influence — shorter players need more maniabilité, taller tolerate more power
  const h = Number(profile.height)||0;
  if (h > 0 && h < 170) w.Maniabilité = (w.Maniabilité||1) + 0.5;
  if (h >= 185) w.Puissance = (w.Puissance||1) + 0.3;
  
  // Age influence — older players need more comfort, tolerance, maniability
  const age = Number(profile.age)||0;
  if (age >= 40) { w.Confort = (w.Confort||1) + 0.5; w.Tolérance = (w.Tolérance||1) + 0.3; }
  if (age >= 50) { w.Confort = (w.Confort||1) + 0.5; w.Maniabilité = (w.Maniabilité||1) + 0.5; w.Tolérance = (w.Tolérance||1) + 0.3; }
  if (age >= 60) { w.Confort = (w.Confort||1) + 0.5; w.Tolérance = (w.Tolérance||1) + 0.5; }
  
  // Side + Hand → attacker vs constructor role
  // Forehand at center = attacker: Droitier+Gauche OR Gaucher+Droite
  // Backhand at center = constructor: Droitier+Droite OR Gaucher+Gauche
  const hand = profile.hand || "Droitier";
  const side = profile.side || "Droite";
  const isAttacker = (hand==="Droitier" && side==="Gauche") || (hand==="Gaucher" && side==="Droite");
  const isConstructor = (hand==="Droitier" && side==="Droite") || (hand==="Gaucher" && side==="Gauche");
  if (isAttacker) { w.Puissance = (w.Puissance||1) + 0.5; w.Spin = (w.Spin||1) + 0.3; }
  if (isConstructor) { w.Contrôle = (w.Contrôle||1) + 0.5; w.Tolérance = (w.Tolérance||1) + 0.3; }
  
  // Weighted average
  let total = 0, wSum = 0;
  for (const attr of ATTRS) {
    const weight = w[attr] || 1;
    total += (scores[attr]||0) * weight;
    wSum += weight;
  }
  return Math.round((total / wSum) * 10) / 10;
}

// Dynamic verdict based on pertinence score + injury constraints
function computeForYou(scores, profile) {
  const gs = computeGlobalScore(scores, profile);
  const ARM_INJURIES = ["dos","poignet","coude","epaule"];
  const hasArmInjury = (profile.injuryTags||[]).some(t=>ARM_INJURIES.includes(t));
  const comfortOk = !hasArmInjury || scores.Confort >= 7;
  
  if (gs >= 7.0 && comfortOk) return "recommended";
  if (hasArmInjury && scores.Confort < 7 && gs < 6.0) return "no";
  return "partial";
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
  const [hoveredRacket, setHoveredRacket] = useState(null);
  const [localDBCount, setLocalDBCount] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('padel_db_extra')||'[]').length; } catch{ return 0; }
  });
  const [screen, setScreen] = useState(()=>{
    // If a profile name already exists, go straight to app
    const p = loadSavedProfile();
    return (p._name) ? "app" : "home";
  });

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
    setScreen("app");
  };
  // Home screen: create new profile
  const createNewProfile = () => {
    setProfile({...INITIAL_PROFILE});
    setProfileName("");
    setPanel("profile");
    setScreen("app");
  };
  // Disconnect: back to home
  const disconnect = () => {
    setPanel(null);
    setScreen("home");
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
          console.warn(`[API] ${r.status} rate limited, retry ${attempt+1}/${retries} in ${waitSec}s...`);
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
          console.warn(`[API] Retry ${attempt+1}/${retries} after error:`, e.message);
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
      // Check if already exists
      const nameLower = racket.name.toLowerCase();
      if (extra.some(r=>r.name.toLowerCase()===nameLower)) return;
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
      console.log(`[DB+] Saved ${racket.name} to local DB supplement (total: ${extra.length})`);
    } catch(e) { console.warn('[DB+] Save failed:', e.message); }
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
    if (!confirm(`Supprimer les ${localDBCount} raquette(s) apprise(s) localement ?\n\nLa base embarquée (${RACKETS_DB.length}) n'est pas affectée.`)) return;
    try { localStorage.removeItem('padel_db_extra'); setLocalDBCount(0); } catch{}
  }

  // Load a racket directly from DB (no API needed)
  function loadRacketFromDB(name, brand, color) {
    let allDB = [...RACKETS_DB];
    try { const extra = JSON.parse(localStorage.getItem('padel_db_extra')||'[]'); if(Array.isArray(extra)) allDB=[...allDB,...extra]; } catch{}
    
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
      console.log(`[Cache] Hit for ${name} — using cached scores`);
      return { ...cached, color: assignedColor, id: cached.id + '-' + Date.now() };
    }
    
    // Check DB second (embedded + local supplement)
    const dbResult = loadRacketFromDB(name, brand, assignedColor);
    if (dbResult) {
      console.log(`[DB] Found ${name} in database — no API call needed`);
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
      console.warn(`[Score] Parse failed for ${specs.name}, retrying...`, e1.message);
      try {
        const retry = await callAI([{role:"user",content:`Score this padel racket's INTRINSIC properties. Specs: ${specs.name}, ${specs.shape}, ${specs.weight}, ${specs.balance}, ${specs.surface}, ${specs.core}.
Return ONLY valid JSON: {"scores":{"Puissance":7,"Contrôle":7,"Confort":7,"Spin":7,"Maniabilité":7,"Tolérance":7},"verdict":"French text describing the racket"}
No markdown, no backticks, no explanation.`}], {systemPrompt: SCORING_SYSTEM_PROMPT, maxTokens:600});
        analysis = parseJ(retry);
        console.log(`[Score] Retry succeeded for ${specs.name}`);
      } catch(e2) {
        console.warn(`[Score] Retry also failed for ${specs.name}:`, e2.message);
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
    
    // Merge embedded DB + any localStorage supplements
    let allDB = [...RACKETS_DB];
    try {
      const extra = JSON.parse(localStorage.getItem('padel_db_extra')||'[]');
      if (Array.isArray(extra)) allDB = [...allDB, ...extra];
    } catch{}

    // Filter by category
    let pool;
    if (isJunior) {
      pool = allDB.filter(r=>r.category==='junior');
    } else {
      const lvl = profile.level||'Débutant';
      const catMap = {'Débutant':['debutant','intermediaire'],'Intermédiaire':['intermediaire','debutant','avance'],'Avancé':['avance','intermediaire','expert'],'Expert':['expert','avance']};
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
      const otherTop = otherPool.sort((a,b)=>computeGlobalScore(a.scores,profile)-computeGlobalScore(b.scores,profile)).reverse().slice(0,2);
      brandPool = [...brandPool, ...otherTop];
    }
    
    // Score all and sort
    const scored = brandPool.map(r=>({...r, _globalScore: computeGlobalScore(r.scores, profile)}));
    scored.sort((a,b)=>b._globalScore-a._globalScore);
    
    // Split into heart (top matches) and priority (match priority tags)
    const prioTags = (profile.priorityTags||[]);
    const prioAttrs = [];
    if (prioTags.includes('puissance')) prioAttrs.push('Puissance');
    if (prioTags.includes('controle')) prioAttrs.push('Contrôle');
    if (prioTags.includes('confort')||prioTags.includes('protection')||prioTags.includes('reprise')) prioAttrs.push('Confort');
    if (prioTags.includes('spin')) prioAttrs.push('Spin');
    if (prioTags.includes('legerete')) prioAttrs.push('Maniabilité');
    
    const heart = scored.slice(0, 5);
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
    const priority = prioPool.slice(0, 3);
    
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
    console.log("[Suggest] Starting. Existing:", existingNames, "Brands:", brandPref, "Priorities:", prioLabels);
    
    try {
      // Phase 1: Try DB first
      const dbMatch = matchFromDB(profile, existingNames);
      console.log("[DB] Pool:", dbMatch.totalPool, "Heart:", dbMatch.heart.length, "Priority:", dbMatch.priority.length);
      
      if (dbMatch.heart.length + dbMatch.priority.length >= 6) {
        // Enough results from DB — format as suggestions
        const results = [
          ...dbMatch.heart.map(r=>({name:r.name, brand:r.brand, shape:r.shape, weight:r.weight, price:r.price, category:"heart", description:r.verdict, _fromDB:true})),
          ...dbMatch.priority.map(r=>({name:r.name, brand:r.brand, shape:r.shape, weight:r.weight, price:r.price, category:"priority", description:r.verdict, _fromDB:true})),
        ];
        console.log("[DB] Sufficient results:", results.length, "— skipping web search");
        setSuggestResults(results);
        setLoadMsg("✅ " + results.length + " raquettes trouvées instantanément !");
        setTimeout(()=>setLoadMsg(""),2500);
        setLoading(false);
        return;
      }
      
      // Phase 2: Not enough from DB — use web search
      console.log("[DB] Only", dbMatch.heart.length + dbMatch.priority.length, "results — falling back to web search");
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

CATEGORY "priority" (3 rackets) — ALTERNATIVES PRIORITÉ: Rackets that specifically match the player's PRIORITY TAGS: ${prioLabels.join(', ')}. These can sacrifice some comfort for performance in the priority areas. ${prioLabels.includes('Puissance') ? 'Include powerful rackets (diamond/drop shapes, high balance) even if comfort is lower.' : ''} ${prioLabels.includes('Spin') ? 'Include textured surface rackets for maximum spin.' : ''} Still exclude truly dangerous choices (no comfort below 4/10). Add a warning in description if comfort is limited.

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
        console.log("[WebSearch] Got results:", res.length, res.map(r=>`${r.category}:${r.name}`));
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
          console.log(`[DB] Loaded ${sug.name} directly — no API call`);
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
        <p style={{color:"#64748b",fontSize:13,margin:"0 0 8px",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:500,textAlign:"center"}}>Ton conseiller raquette intelligent</p>
        <p style={{color:"#475569",fontSize:11,margin:"0 0 36px",textAlign:"center",maxWidth:340,lineHeight:1.5}}>Analyse ton profil, explore {RACKETS_DB.length}+ raquettes, trouve la pala parfaite pour ton jeu.</p>

        {/* Saved profiles */}
        {savedProfiles.length>0&&<div style={{width:"100%",maxWidth:400,marginBottom:24}}>
          <p style={{fontSize:10,color:"#94a3b8",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10,textAlign:"center"}}>👤 Mes profils</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {savedProfiles.map(sp=>{
              const p = sp.profile||{};
              const styles = (p.styleTags||[]).map(id=>STYLE_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
              const injuries = (p.injuryTags||[]).filter(t=>t!=="aucune").map(id=>INJURY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
              const desc = [p.level, p.side&&`Côté ${p.side}`, p.hand, styles.length?styles.slice(0,2).join(", "):null].filter(Boolean).join(" · ");
              return (
                <button key={sp.name} onClick={()=>selectHomeProfile(sp)} className="pa-card" style={{
                  background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 18px",
                  cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif",width:"100%",
                  display:"flex",alignItems:"center",gap:14,transition:"all 0.25s ease",
                }}>
                  <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))",border:"1px solid rgba(249,115,22,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                    {sp.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:2}}>{sp.name}</div>
                    <div style={{fontSize:11,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{desc}</div>
                    {injuries.length>0&&<div style={{fontSize:10,color:"#ef4444",marginTop:2,opacity:0.8}}>🩹 {injuries.join(", ")}</div>}
                  </div>
                  <div style={{color:"#475569",fontSize:18,flexShrink:0}}>→</div>
                </button>
              );
            })}
          </div>
        </div>}

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

        <div style={{marginTop:40,fontSize:8,color:"#334155",letterSpacing:"0.05em",textAlign:"center"}}>
          <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> V7.0 · {RACKETS_DB.length} raquettes · Scoring hybride IA
        </div>
      </div>}

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
        <div style={{fontSize:8,color:"#334155",marginTop:4,fontFamily:"'Outfit'",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span>V7.0</span><span style={{background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.2)",borderRadius:10,padding:"1px 7px",color:"#f97316",fontSize:8,fontWeight:600}}>🗃️ {RACKETS_DB.length}{localDBCount>0&&<span style={{color:"#22c55e"}}> + {localDBCount}</span>}</span></div>
        {/* Profile bar */}
        {profileName&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:20,padding:"4px 12px 4px 6px"}}>
            <div style={{width:22,height:22,borderRadius:7,background:"linear-gradient(135deg,rgba(249,115,22,0.25),rgba(239,68,68,0.2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#f97316",flexShrink:0}}>{profileName.charAt(0).toUpperCase()}</div>
            <span style={{fontSize:11,fontWeight:600,color:"#a5b4fc"}}>{profileName}</span>
          </div>
          <button onClick={disconnect} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"4px 10px",color:"#64748b",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:12}}>⏻</span> Déconnexion
          </button>
        </div>}
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {[["suggest","🎯 Suggère-moi"],["add","+ Ajouter"],["profile","👤 Profil"],["manage","🗑 Gérer"]].map(([k,l])=>(
          <button key={k} onClick={()=>setPanel(p=>p===k?null:k)} style={{...S.btn(panel===k),borderRadius:20}}>{l}</button>
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
          <p style={{fontSize:10,color:"#64748b",margin:"0 0 10px",lineHeight:1.4}}>Recherche des raquettes les plus adaptées à ton profil : <span style={{color:"#f97316",fontWeight:600}}>⭐ Coups de cœur</span> (meilleures correspondances) et <span style={{color:"#fbbf24",fontWeight:600}}>⚡ Alternatives Priorité</span> (orientées {profile.priorityTags.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean).join(', ')||"tes priorités"}). Coche celles qui t'intéressent puis valide en un clic.</p>
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
            return <>
              {topPicks.length>0&&<>
                <p style={{fontSize:11,color:"#f97316",fontWeight:700,marginBottom:6}}>⭐ Coups de cœur — meilleures correspondances :</p>
                {topPicks.map(s=>{
                  const ri = suggestResults.indexOf(s);
                  return renderSuggestCard(s, ri, suggestChecked.has(ri), true);
                })}
              </>}
              {prioAlts.length>0&&<>
                <p style={{fontSize:11,color:"#fbbf24",fontWeight:700,marginBottom:4,marginTop:14}}>⚡ Alternatives Priorité — {prioLabels.join(', ')} :</p>
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
          <p style={{fontSize:11,color:"#f97316",fontWeight:700,marginBottom:8}}>📋 Résultats — clique sur celle que tu veux ajouter :</p>
          {suggestions.map((s,i)=>(
            <div key={i} onClick={()=>!s._disabled&&selectSuggestion(i)} style={{
              background:s._selected?"rgba(249,115,22,0.15)":"rgba(255,255,255,0.04)",
              border:`1px solid ${s._selected?"#f97316":"rgba(255,255,255,0.1)"}`,
              borderRadius:10,padding:"10px 12px",marginBottom:6,
              cursor:s._disabled?"default":"pointer",opacity:s._disabled&&!s._selected?0.3:1,
              transition:"all 0.2s",
            }}>
              <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{s.name}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{s.brand} · {s.shape} · {s.weight}</div>
              <div style={{fontSize:10,color:"#64748b",marginTop:1}}>{s.description}</div>
            </div>
          ))}
        </div>}
      </div>}

      {/* ============================================================ */}
      {/* PROFILE PANEL */}
      {/* ============================================================ */}
      {panel==="profile"&&<div style={S.card}>
        <div style={S.title}>👤 MON PROFIL JOUEUR</div>
        
        {/* Multi-profile management */}
        <div style={{background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.15)",borderRadius:10,padding:10,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Nom du profil (ex: Bidou Compétition)" style={{...S.input,flex:1,fontSize:11,margin:0}}/>
            <button onClick={()=>{
              if(!profileName.trim()){alert("Donne un nom au profil d'abord");return;}
              const list = saveNamedProfile(profileName.trim(), profile);
              setSavedProfiles(list);
            }} style={{padding:"6px 12px",background:"rgba(99,102,241,0.2)",border:"1px solid rgba(99,102,241,0.4)",borderRadius:8,color:"#818cf8",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>💾 Sauvegarder</button>
            <button onClick={()=>{
              setProfile({...INITIAL_PROFILE});
              setProfileName("");
            }} style={{padding:"6px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#64748b",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>+ Nouveau</button>
          </div>
          {savedProfiles.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {savedProfiles.map(sp=>(
              <div key={sp.name} style={{display:"flex",alignItems:"center",gap:2}}>
                <button onClick={()=>{
                  setProfile({...INITIAL_PROFILE,...sp.profile});
                  setProfileName(sp.name);
                }} style={{padding:"4px 8px",background:profileName===sp.name?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.04)",border:`1px solid ${profileName===sp.name?"rgba(99,102,241,0.5)":"rgba(255,255,255,0.08)"}`,borderRadius:6,color:profileName===sp.name?"#a5b4fc":"#94a3b8",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{sp.name}</button>
                <button onClick={()=>{
                  if(!confirm(`Supprimer le profil "${sp.name}" ?`)) return;
                  const list = deleteNamedProfile(sp.name);
                  setSavedProfiles(list);
                }} style={{background:"none",border:"none",color:"#64748b",fontSize:10,cursor:"pointer",padding:"2px",fontFamily:"inherit"}}>✕</button>
              </div>
            ))}
          </div>}
          {savedProfiles.length===0&&<p style={{fontSize:9,color:"#475569",margin:0}}>Aucun profil sauvegardé. Remplis les champs puis clique 💾 Sauvegarder.</p>}
        </div>

        {/* Junior indicator */}
        {((Number(profile.age)>0&&Number(profile.age)<15)||(Number(profile.height)>0&&Number(profile.height)<150))&&
          <div style={{background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",borderRadius:8,padding:"8px 10px",marginBottom:10,fontSize:10,color:"#60a5fa",fontWeight:600}}>
            🧒 Profil junior détecté — les suggestions proposeront des raquettes adaptées (poids léger, grip réduit, prix ajustés)
          </div>
        }
        
        {/* Senior indicator */}
        {Number(profile.age)>=50&&
          <div style={{background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:8,padding:"8px 10px",marginBottom:10,fontSize:10,color:"#fbbf24",fontWeight:600}}>
            👤 Profil 50+ — le scoring renforce automatiquement Confort, Tolérance et Maniabilité
          </div>
        }

        <p style={{fontSize:10,color:"#64748b",margin:"0 0 10px",lineHeight:1.4}}>Configure ton profil puis clique "Ré-analyser" pour recalculer les verdicts.</p>
        
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <div><label style={S.label}>Âge</label>
          <input type="number" value={profile.age} onChange={e=>setProfile(p=>({...p,age:Number(e.target.value)}))} style={S.input}/></div>
          <div><label style={S.label}>Taille (cm)</label>
          <input type="number" value={profile.height} onChange={e=>setProfile(p=>({...p,height:Number(e.target.value)}))} placeholder="175" style={S.input}/></div>
          <div><label style={S.label}>Poids (kg)</label>
          <input type="number" value={profile.weight} onChange={e=>setProfile(p=>({...p,weight:Number(e.target.value)}))} style={S.input}/></div>
          <div><label style={S.label}>Niveau</label>
          <select value={profile.level} onChange={e=>setProfile(p=>({...p,level:e.target.value}))} style={S.select}>
            {LEVEL_OPTIONS.map(o=>(<option key={o.value} value={o.value}>{o.label} — {o.desc}</option>))}
          </select></div>
          <div><label style={S.label}>Main</label>
          <select value={profile.hand} onChange={e=>setProfile(p=>({...p,hand:e.target.value}))} style={S.select}>
            {HAND_OPTIONS.map(o=>(<option key={o} value={o}>{o}</option>))}
          </select></div>
          <div><label style={S.label}>Côté de jeu</label>
          <select value={profile.side} onChange={e=>setProfile(p=>({...p,side:e.target.value}))} style={S.select}>
            {SIDE_OPTIONS.map(o=>(<option key={o} value={o}>{o}</option>))}
          </select></div>
          <div><label style={S.label}>Fréquence</label>
          <select value={profile.frequency} onChange={e=>setProfile(p=>({...p,frequency:e.target.value}))} style={S.select}>
            {FREQ_OPTIONS.map(o=>(<option key={o.value} value={o.value}>{o.label} — {o.desc}</option>))}
          </select></div>
          <div><label style={S.label}>Compétition</label>
          <select value={profile.competition?"oui":"non"} onChange={e=>setProfile(p=>({...p,competition:e.target.value==="oui"}))} style={S.select}>
            <option value="non">Non</option><option value="oui">Oui</option>
          </select></div>
        </div>

        <div className="pa-section" style={{borderColor:"#9C27B0"}}><div style={S.sectionLabel}>🏷 Marques préférées</div></div>
        <p style={{fontSize:9,color:"#475569",margin:"0 0 4px",paddingLeft:13}}>Les suggestions prioriseront ces marques (vide = toutes)</p>
        <TagGroup tags={BRAND_TAGS} selected={profile.brandTags} onToggle={id=>toggleTag("brandTags",id)} color="#9C27B0"/>

        <div className="pa-section" style={{borderColor:"#f97316"}}><div style={S.sectionLabel}>🎾 Style de jeu</div></div>
        <p style={{fontSize:9,color:"#475569",margin:"0 0 4px",paddingLeft:13}}>Clique sur les tags qui te correspondent</p>
        <TagGroup tags={STYLE_TAGS} selected={profile.styleTags} onToggle={id=>toggleTag("styleTags",id)} color="#f97316"/>
        <input value={profile.styleExtra} onChange={e=>setProfile(p=>({...p,styleExtra:e.target.value}))} placeholder="Précisions libres (optionnel)..." style={{...S.input,marginTop:8,fontSize:10}}/>

        <div className="pa-section" style={{borderColor:"#ef4444"}}><div style={S.sectionLabel}>🩹 Blessures / Contraintes</div></div>
        <p style={{fontSize:9,color:"#475569",margin:"0 0 4px",paddingLeft:13}}>Impacte directement le critère Confort dans les verdicts</p>
        <TagGroup tags={INJURY_TAGS} selected={profile.injuryTags} onToggle={id=>toggleTag("injuryTags",id)} color="#ef4444"/>
        <input value={profile.injuryExtra} onChange={e=>setProfile(p=>({...p,injuryExtra:e.target.value}))} placeholder="Précisions libres (optionnel)..." style={{...S.input,marginTop:8,fontSize:10}}/>

        <div className="pa-section" style={{borderColor:"#4CAF50"}}><div style={S.sectionLabel}>🎯 Priorité</div></div>
        <p style={{fontSize:9,color:"#475569",margin:"0 0 4px",paddingLeft:13}}>Ce que tu recherches en priorité dans ta raquette</p>
        <TagGroup tags={PRIORITY_TAGS} selected={profile.priorityTags} onToggle={id=>toggleTag("priorityTags",id)} color="#4CAF50"/>
        <input value={profile.priorityExtra} onChange={e=>setProfile(p=>({...p,priorityExtra:e.target.value}))} placeholder="Précisions libres (optionnel)..." style={{...S.input,marginTop:8,fontSize:10}}/>

        <button onClick={reanalyzeAll} disabled={loading} style={{...S.btnGreen,marginTop:14}}>
          {loading?loadMsg||"...":"🔄 Ré-analyser toutes les raquettes"}
        </button>
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
        {rackets.length>1&&<button onClick={()=>{if(confirm("Supprimer toutes les raquettes ?")){setRackets([]);setSelected([]);}}} style={{...S.btn(false),width:"100%",marginTop:12,padding:"8px 0",fontSize:11,color:"#ef4444",borderColor:"rgba(239,68,68,0.3)"}}>🗑 Tout effacer</button>}
        
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
              <div style={{fontSize:16,fontWeight:700,color:"#fff",fontFamily:"'Outfit'"}}>{RACKETS_DB.length + localDBCount}</div>
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
          const isSel=selected.includes(r.id); const fy=fyConfig[computeForYou(r.scores, profile)]||fyConfig.partial;
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
            {r.imageUrl&&<img src={r.imageUrl} alt="" style={{width:38,height:38,objectFit:"contain",borderRadius:6,marginBottom:4,background:"rgba(255,255,255,0.06)"}} onError={e=>{e.target.style.display='none'}}/>}
            <div style={{width:8,height:8,borderRadius:"50%",background:r.color,marginBottom:6,boxShadow:isSel?`0 0 8px ${r.color}`:"none",transition:"box-shadow 0.2s ease"}}/>
            <div style={{fontSize:11,fontWeight:700,color:isSel?"#fff":"#94a3b8",lineHeight:1.3,transition:"color 0.2s ease"}}>{r.shortName}</div>
            <div style={{fontSize:9,color:"#475569",marginTop:3}}>{r.shape} · {r.weight}</div>
            <div style={{fontSize:9,color:"#475569"}}>{r.brand} · {r.price}</div>
            {r._incomplete&&<div onClick={e=>{e.stopPropagation();rescoreRacket(r.id)}} style={{position:"absolute",bottom:4,right:4,background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.4)",borderRadius:6,padding:"2px 6px",fontSize:8,color:"#f97316",fontWeight:700,cursor:"pointer"}}>🔄 Re-scorer</div>}
          </button>);
        })}
      </div>

      {/* ============================================================ */}
      {/* CHART TABS */}
      {/* ============================================================ */}
      <div style={{display:"flex",gap:2,marginBottom:18,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,border:"1px solid rgba(255,255,255,0.04)"}}>
        {[["radar","🕸 Radar"],["bars","📊 Barres"],["table","📋 Détails"],["fit","🎯 Pertinence"]].map(([k,l])=>(
          <button key={k} className={`pa-tab ${tab===k?"pa-tab-active":""}`} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 0",background:tab===k?"rgba(255,255,255,0.06)":"transparent",border:"none",borderRadius:9,color:tab===k?"#fff":"#64748b",fontSize:11,fontWeight:tab===k?700:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",letterSpacing:"-0.01em",transition:"all 0.2s ease"}}>{l}</button>
        ))}
      </div>

      {tab==="radar"&&<div style={{...S.card,padding:20,position:"relative",overflow:"hidden"}}>
        <style>{`
          @keyframes racketFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div style={{display:"flex",alignItems:"center",gap:0,minHeight:400}}>
          {/* LEFT — Racket showcase image */}
          <div style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:400}}>
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
                  <img src={hr.imageUrl} alt={hr.name} style={{
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
          <div style={{flex:1,minWidth:0,position:"relative"}}>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" gridType="polygon"/>
                <PolarAngleAxis dataKey="attribute" tick={{fill:"#94a3b8",fontSize:11,fontWeight:600,fontFamily:"Inter"}}/>
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
                <Legend wrapperStyle={{fontSize:10,color:"#94a3b8",paddingTop:10,fontFamily:"Inter"}}/>
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
            body * { visibility: hidden !important; }
            #print-pertinence, #print-pertinence * { visibility: visible !important; }
            #print-pertinence {
              position: absolute !important; left: 0 !important; top: 0 !important;
              width: 100% !important; max-width: 100% !important;
              padding: 10mm 8mm !important;
              background: white !important; color: #1a1a1a !important;
              overflow: visible !important; font-size: 10px !important;
            }
            #print-pertinence .print-header { display: block !important; }
            #print-pertinence .print-section-title { display: block !important; }
            #print-pertinence .no-print { display: none !important; }
            #print-pertinence .print-card {
              border: 1px solid #e2e8f0 !important; background: #fafafa !important;
              color: #1a1a1a !important; page-break-inside: avoid; break-inside: avoid;
              overflow: hidden !important; max-width: 100% !important;
              margin-bottom: 8px !important; border-radius: 8px !important;
            }
            #print-pertinence .print-card-gold {
              background: linear-gradient(135deg, #fefce8, #fef9c3) !important;
              background: #fef9e7 !important;
              border: 2px solid #b8860b !important; border-left: 8px solid #b8860b !important;
              box-shadow: 0 2px 12px rgba(184,134,11,0.15) !important;
              margin-bottom: 10px !important;
            }
            #print-pertinence .print-card-silver {
              background: #f1f5f9 !important;
              border: 1.5px solid #94a3b8 !important; border-left: 6px solid #94a3b8 !important;
              margin-bottom: 10px !important;
            }
            #print-pertinence .print-card-bronze {
              background: #fef3e2 !important;
              border: 1.5px solid #cd7f32 !important; border-left: 6px solid #cd7f32 !important;
              margin-bottom: 10px !important;
            }
            #print-pertinence .print-card * { color: #1a1a1a !important; }
            #print-pertinence .print-card-gold .print-medal-label { color: #8b6914 !important; }
            #print-pertinence .print-card-silver .print-medal-label { color: #64748b !important; }
            #print-pertinence .print-card-bronze .print-medal-label { color: #92400e !important; }
            #print-pertinence .print-bar-bg { background: #e5e7eb !important; height: 4px !important; }
            #print-pertinence .print-bar-fill-green { background: #22c55e !important; }
            #print-pertinence .print-bar-fill-gray { background: #9ca3af !important; }
            #print-pertinence .print-bar-fill-red { background: #ef4444 !important; }
            #print-pertinence .print-bar-fill-yellow { background: #f59e0b !important; }
            #print-pertinence .print-score-green { color: #16a34a !important; }
            #print-pertinence .print-score-yellow { color: #d97706 !important; }
            #print-pertinence .print-score-red { color: #dc2626 !important; }
            #print-pertinence .print-badge { border: 1px solid #666 !important; padding: 2px 7px !important; border-radius: 4px !important; font-size: 8px !important; font-weight: 700 !important; }
            #print-pertinence .print-badge-green { background: #dcfce7 !important; color: #166534 !important; border-color: #22c55e !important; }
            #print-pertinence .print-badge-orange { background: #fff7ed !important; color: #9a3412 !important; border-color: #f97316 !important; }
            #print-pertinence .print-badge-red { background: #fef2f2 !important; color: #991b1b !important; border-color: #ef4444 !important; }
            #print-pertinence .print-profile-box { border: 1px solid #f97316 !important; background: #fff7ed !important; padding: 10px !important; }
            #print-pertinence .print-warn { color: #dc2626 !important; }
            #print-pertinence .print-verdict { color: #374151 !important; font-style: normal !important; }
            #print-pertinence .print-section-divider { border-top: 2px solid #e5e7eb !important; margin: 14px 0 10px !important; padding-top: 8px !important; }
            #print-pertinence .print-footer-wrap { page-break-before: avoid; break-before: avoid; page-break-inside: avoid; break-inside: avoid; }
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
          <div className="print-profile-box" style={{background:"rgba(249,115,22,0.06)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:10,padding:10,marginBottom:10,boxSizing:"border-box"}}>
            <p style={{fontSize:10,color:"#f97316",fontWeight:700,margin:"0 0 3px"}}>👤 Profil actif :</p>
            <p style={{fontSize:9,color:"#94a3b8",margin:0,lineHeight:1.5}}>{profileText}</p>
            <p style={{fontSize:8,color:"#475569",margin:"4px 0 0"}}>{(()=>{
              const w = { Puissance:1, Contrôle:1, Confort:1, Spin:1, Maniabilité:1, Tolérance:1 };
              const prioMap = { confort:{Confort:1.5}, polyvalence:{Contrôle:0.5,Maniabilité:0.5,Tolérance:0.5}, puissance:{Puissance:1.5}, controle:{Contrôle:1.5}, spin:{Spin:1.5}, legerete:{Maniabilité:1.5}, protection:{Confort:1.5}, reprise:{Confort:1.5,Tolérance:1.0,Maniabilité:0.5} };
              const styleMap = { offensif:{Puissance:0.5}, defensif:{Contrôle:0.5,Tolérance:0.5}, tactique:{Contrôle:0.5,Maniabilité:0.3}, puissant:{Puissance:0.5,Spin:0.3}, veloce:{Maniabilité:0.8}, endurant:{Confort:0.5,Tolérance:0.3}, contre:{Tolérance:0.5,Contrôle:0.3}, polyvalent:{Contrôle:0.3,Tolérance:0.3}, technique:{Contrôle:0.5,Spin:0.3} };
              for (const tag of (profile.priorityTags||[])) { const b=prioMap[tag]; if(b) for(const[k,v] of Object.entries(b)) w[k]=(w[k]||1)+v; }
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

          {/* ===== SMART COACH VERDICT — "En bref" ===== */}
          {(()=>{
            const ranked = rackets.map(r=>({...r, globalScore:computeGlobalScore(r.scores, profile)})).sort((a,b)=>b.globalScore-a.globalScore);
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
            const gap = second ? Math.round((best.globalScore - second.globalScore)*10)/10 : 0;
            
            // Build the verdict lines
            const lines = [];
            
            // Line 1: The recommendation with why
            if (prioLabels.length > 0) {
              const prioStr = prioLabels.length === 1 ? prioLabels[0] : prioLabels.slice(0,-1).join(", ") + " et " + prioLabels[prioLabels.length-1];
              if (bestPrioScores.length > 0 && bestPrioScores[0].val >= 7.5) {
                lines.push(`Avec tes priorités ${prioStr}, la **${best.name}** (${best.globalScore}/10) s'impose : elle affiche ${bestPrioScores.map(s=>`${s.attr} à ${s.val}`).join(", ")}.`);
              } else if (bestPrioScores.length > 0) {
                lines.push(`Pour tes priorités ${prioStr}, la **${best.name}** (${best.globalScore}/10) offre le meilleur compromis du lot avec ${bestPrioScores.map(s=>`${s.attr} à ${s.val}`).join(", ")}.`);
              } else {
                lines.push(`La **${best.name}** (${best.globalScore}/10) est la plus adaptée à ton profil.`);
              }
            } else {
              lines.push(`La **${best.name}** (${best.globalScore}/10) est la plus adaptée à ton profil.`);
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
                  lines.push(`La **${second.name}** (${second.globalScore}/10) suit mais perd du terrain en ${secondWorse.attr} (${second.scores[secondWorse.attr]} vs ${best.scores[secondWorse.attr]}).`);
                } else {
                  lines.push(`La **${second.name}** (${second.globalScore}/10) est une alternative solide.`);
                }
              } else if (gap >= 0.2) {
                // Close call — find what #2 does better
                const secondBetter = ATTRS.map(a=>({attr:a, diff: (second.scores[a]||0)-(best.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0];
                if (secondBetter) {
                  lines.push(`La **${second.name}** (${second.globalScore}/10) talonne de près et pousse même plus fort en ${secondBetter.attr} (${second.scores[secondBetter.attr]} vs ${best.scores[secondBetter.attr]}) — à essayer aussi.`);
                } else {
                  lines.push(`La **${second.name}** (${second.globalScore}/10) est au coude-à-coude — les deux méritent un essai.`);
                }
              } else {
                // Virtually tied — find what differentiates them
                const secondBetter2 = ATTRS.map(a=>({attr:a, diff: (second.scores[a]||0)-(best.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0];
                const bestBetter2 = ATTRS.map(a=>({attr:a, diff: (best.scores[a]||0)-(second.scores[a]||0)})).filter(d=>d.diff>0).sort((a,b)=>b.diff-a.diff)[0];
                if (secondBetter2 && bestBetter2) {
                  lines.push(`Quasi ex-æquo avec la **${second.name}** (${second.globalScore}/10) — elle pousse en ${secondBetter2.attr} (${second.scores[secondBetter2.attr]}), la n°1 domine en ${bestBetter2.attr} (${best.scores[bestBetter2.attr]}). Deux profils complémentaires à tester.`);
                } else {
                  lines.push(`Quasi ex-æquo avec la **${second.name}** (${second.globalScore}/10) — profils très proches, la différence se jouera au toucher et à l'équilibre en main.`);
                }
              }
            }
            
            // Render with inline bold
            const renderLine = (text, idx) => {
              const parts = text.split(/(\*\*[^*]+\*\*)/g);
              return <span key={idx}>{parts.map((p,j) => 
                p.startsWith("**") ? <strong key={j} style={{color:"#e2e8f0"}}>{p.replace(/\*\*/g,"")}</strong> : p
              )}{idx < lines.length-1 ? " " : ""}</span>;
            };
            
            return <div style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:8,padding:"10px 12px",marginBottom:12,fontSize:10,color:"#94a3b8",lineHeight:1.6}}>
              <div style={{fontWeight:700,color:"#4ade80",marginBottom:4,fontSize:11}}>🎯 Notre verdict</div>
              {lines.map((l,i) => renderLine(l,i))}
            </div>;
          })()}

          {/* ===== PODIUM SECTION TITLE ===== */}
          {rackets.length>=3&&<div className="print-section-title" style={{display:"none",fontSize:12,fontWeight:800,color:"#1a1a1a",marginBottom:8,paddingBottom:4}}>
            🏆 PODIUM — Top 3
          </div>}

          {/* ===== PERTINENCE RANKING ===== */}
          {(()=>{
            const ranked = rackets.map(r=>({...r, globalScore:computeGlobalScore(r.scores, profile)})).sort((a,b)=>b.globalScore-a.globalScore);
            const cards = [];
            ranked.forEach((r,i)=>{
              // Insert section divider after top 3
              if(i===3 && ranked.length>3) {
                cards.push(<div key="divider" className="print-section-divider" style={{borderTop:"2px solid rgba(255,255,255,0.06)",margin:"12px 0 8px",paddingTop:6}}>
                  <div className="print-section-title" style={{display:"none",fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>📋 AUTRES RAQUETTES ANALYSÉES</div>
                </div>);
              }

              const forYouVal = computeForYou(r.scores, profile);
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
              
              cards.push(<div key={r.id} className={cardClass} style={{
                background: i===0 ? "rgba(250,204,21,0.08)" : i===1 ? "rgba(148,163,184,0.06)" : i===2 ? "rgba(217,119,6,0.06)" : "rgba(255,255,255,0.02)",
                border: i===0 ? "2px solid rgba(250,204,21,0.5)" : i===1 ? "2px solid rgba(148,163,184,0.4)" : i===2 ? "2px solid rgba(217,119,6,0.35)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius:10, padding: i<3 ? "12px 14px" : "10px 12px", marginBottom: i<3 ? 10 : 6, boxSizing:"border-box", overflow:"hidden",
                pageBreakInside:"avoid", breakInside:"avoid",
                borderLeft: i===0 ? "8px solid rgba(250,204,21,0.7)" : i===1 ? "6px solid rgba(148,163,184,0.5)" : i===2 ? "6px solid rgba(217,119,6,0.5)" : undefined,
              }}>
                {/* Card header: medal + name + badge + score */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                    {medal&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,minWidth:36}}>
                      <span style={{fontSize:i===0?28:24,lineHeight:1}}>{medal}</span>
                      <span className="print-medal-label" style={{fontSize:7,fontWeight:800,letterSpacing:"0.02em",color:i===0?"#b8860b":i===1?"#6b7280":"#92400e",marginTop:2,whiteSpace:"nowrap"}}>{i===0?"MEILLEUR":i===1?"2ᵉ choix":"3ᵉ choix"}</span>
                    </div>}
                    {r.imageUrl&&<img src={r.imageUrl} alt="" style={{width:i<3?36:28,height:i<3?36:28,objectFit:"contain",borderRadius:4,flexShrink:0,background:"rgba(255,255,255,0.06)"}} onError={e=>{e.target.style.display='none'}}/>}
                    {!medal&&<div style={{width:10,height:10,borderRadius:"50%",background:r.color,border:"1px solid #999",flexShrink:0,printColorAdjust:"exact",WebkitPrintColorAdjust:"exact"}}/>}
                    <div style={{minWidth:0,flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                        <span style={{fontSize: i===0 ? 14 : i<3 ? 13 : 11,fontWeight:700,color:"#e2e8f0"}}>{r.name}</span>
                        <span className={`print-badge ${badgeClass}`} style={{background:fy.bg,border:`1px solid ${fy.border}`,borderRadius:4,padding:"2px 6px",fontSize:7,fontWeight:700,color:"#fff",flexShrink:0,whiteSpace:"nowrap"}}>{fy.text}</span>
                      </div>
                      <div style={{fontSize:8,color:"#64748b",marginTop:2}}>
                        {r.shape} · {r.weight} · {r.brand}{r.player && r.player !== "—" ? ` · 🎾 ${r.player}` : ""}{r.price && r.price !== "—" ? ` · ${r.price}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className={scoreClass} style={{fontSize: i===0 ? 28 : i<3 ? 24 : 18,fontWeight:800,color:gs>=7.5?"#4ade80":gs>=6.5?"#fbbf24":"#f87171",fontFamily:"'Outfit'",lineHeight:1,flexShrink:0,marginLeft:10}}>
                    {gs}<span style={{fontSize:10,color:"#64748b"}}>/10</span>
                  </div>
                </div>
                
                {/* Score bars — 2 rows of 3 */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"4px 10px",marginBottom:6}}>
                  {ATTRS.map(attr=>{
                    const v = r.scores[attr];
                    const isKey = (attr==="Confort"&&hasArmInj) || 
                      (attr==="Maniabilité"&&(hasLegInj||(profile.styleTags||[]).includes("veloce"))) ||
                      (profile.priorityTags||[]).some(t=>(t==="confort"&&attr==="Confort")||(t==="polyvalence"&&["Contrôle","Tolérance","Maniabilité"].includes(attr))||(t==="puissance"&&attr==="Puissance")||(t==="controle"&&attr==="Contrôle")||(t==="spin"&&attr==="Spin")||(t==="legerete"&&attr==="Maniabilité")||(t==="protection"&&attr==="Confort")||(t==="reprise"&&["Confort","Tolérance","Maniabilité"].includes(attr)));
                    const low = hasArmInj && attr==="Confort" && v<7;
                    const barClass = low?"print-bar-fill-red":v>=7.5?"print-bar-fill-green":v>=6?"print-bar-fill-gray":"print-bar-fill-yellow";
                    return(<div key={attr} style={{minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:8,color:isKey?"#f97316":"#64748b",fontWeight:isKey?700:400}}>{isKey?"★ ":""}{attr}</span>
                        <span style={{fontSize:9,color:low?"#f87171":v>=7.5?"#4ade80":v>=6?"#cbd5e1":"#fbbf24",fontWeight:700,flexShrink:0,marginLeft:4}}>{v}</span>
                      </div>
                      <div className="print-bar-bg" style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginTop:2}}>
                        <div className={barClass} style={{height:4,borderRadius:2,width:`${v*10}%`,background:low?"#f87171":v>=7.5?"#4ade80":v>=6?"#64748b":"#fbbf24",printColorAdjust:"exact",WebkitPrintColorAdjust:"exact"}}/>
                      </div>
                    </div>);
                  })}
                </div>
                
                {/* Warnings and verdict */}
                {criticalLow&&<div className="print-warn" style={{fontSize:9,color:"#f87171",fontWeight:600,marginBottom:3}}>⚠ Confort insuffisant ({r.scores.Confort}/10) pour blessures {ptags.filter(t=>ARM_INJ.includes(t)).map(t=>({dos:"Dos",poignet:"Poignet",coude:"Coude",epaule:"Épaule"}[t])).join("/")} — risque de douleurs</div>}
                <div className="print-verdict" style={{fontSize:9,color:"#94a3b8",lineHeight:1.5}}>{r.verdict}</div>
              </div>);
            });
            return cards;
          })()}

          {/* ===== 🎯 DISCOVERY: Priority-based picks from DB ===== */}
          {(()=>{
            const prioTagIds = profile.priorityTags||[];
            if (!prioTagIds.length || !rackets.length) return null;
            
            const prioAttrMap = {puissance:'Puissance',controle:'Contrôle',confort:'Confort',spin:'Spin',legerete:'Maniabilité',protection:'Confort',reprise:'Confort',polyvalence:'Contrôle'};
            const prioAttrs = [...new Set(prioTagIds.map(t=>prioAttrMap[t]).filter(Boolean))];
            const prioLabels = prioTagIds.map(id=>PRIORITY_TAGS.find(t=>t.id===id)?.label).filter(Boolean);
            if (!prioAttrs.length) return null;
            
            // Get existing racket IDs to exclude
            const existingIds = new Set(rackets.map(r=>r.id));
            
            // Filter DB pool by level category (same logic as matchFromDB)
            const age = Number(profile.age)||0;
            const ht = Number(profile.height)||0;
            const isJunior = (age>0&&age<15)||(ht>0&&ht<150);
            let pool;
            if (isJunior) {
              pool = RACKETS_DB.filter(r=>r.category==='junior');
            } else {
              const lvl = profile.level||'Débutant';
              const catMap = {'Débutant':['debutant','intermediaire'],'Intermédiaire':['intermediaire','debutant','avance'],'Avancé':['avance','intermediaire','expert'],'Expert':['expert','avance']};
              const cats = catMap[lvl]||['debutant','intermediaire'];
              pool = RACKETS_DB.filter(r=>cats.includes(r.category));
            }
            
            // Exclude already analyzed rackets
            pool = pool.filter(r=>!existingIds.has(r.id));
            
            // Filter by brand preferences if any
            const brandPref = profile.brandTags.map(id=>BRAND_TAGS.find(t=>t.id===id)?.label?.toLowerCase()).filter(Boolean);
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
              const gs = computeGlobalScore(r.scores, profile);
              return {...r, _prioAvg: Math.round(prioAvg*10)/10, _prioScore: prioAvg*0.7 + gs*0.3, globalScore: gs};
            });
            scored.sort((a,b)=>b._prioScore-a._prioScore);
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
                const forYouVal = computeForYou(r.scores, profile);
                const fy = fyConfig[forYouVal]||fyConfig.partial;
                const badgeClass = forYouVal==="recommended"?"print-badge-green":forYouVal==="no"?"print-badge-red":"print-badge-orange";
                return <div key={"disco-"+r.id} className="print-card" style={{
                  background:"rgba(249,115,22,0.04)", border:"1px solid rgba(249,115,22,0.2)",
                  borderRadius:10, padding:"10px 12px", marginBottom:6, boxSizing:"border-box", overflow:"hidden",
                  borderLeft:"4px solid rgba(249,115,22,0.4)", pageBreakInside:"avoid", breakInside:"avoid",
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,minWidth:28}}>
                        <span style={{fontSize:16,lineHeight:1}}>🎯</span>
                      </div>
                      {r.imageUrl&&<img src={r.imageUrl} alt="" style={{width:28,height:28,objectFit:"contain",borderRadius:4,flexShrink:0,background:"rgba(255,255,255,0.06)"}} onError={e=>{e.target.style.display='none'}}/>}
                      <div style={{minWidth:0,flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,fontWeight:700,color:"#e2e8f0"}}>{r.name}</span>
                          <span className={`print-badge ${badgeClass}`} style={{background:fy.bg,border:`1px solid ${fy.border}`,borderRadius:4,padding:"2px 6px",fontSize:7,fontWeight:700,color:"#fff",flexShrink:0,whiteSpace:"nowrap"}}>{fy.text}</span>
                          <span style={{background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.3)",borderRadius:4,padding:"2px 6px",fontSize:7,fontWeight:700,color:"#f97316",flexShrink:0,whiteSpace:"nowrap"}}>★ {r._prioAvg}/10</span>
                        </div>
                        <div style={{fontSize:8,color:"#64748b",marginTop:2}}>
                          {r.shape} · {r.weight} · {r.brand}{r.player && r.player !== "—" ? ` · 🎾 ${r.player}` : ""}{r.price && r.price !== "—" ? ` · ${r.price}` : ""}
                        </div>
                      </div>
                    </div>
                    <div style={{fontSize:18,fontWeight:800,color:gs>=7.5?"#4ade80":gs>=6.5?"#fbbf24":"#f87171",fontFamily:"'Outfit'",lineHeight:1,flexShrink:0,marginLeft:10}}>
                      {gs}<span style={{fontSize:10,color:"#64748b"}}>/10</span>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"4px 10px",marginBottom:6}}>
                    {ATTRS.map(attr=>{
                      const v = r.scores[attr];
                      const isKey = prioAttrs.includes(attr);
                      return <div key={attr} style={{minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:8,color:isKey?"#f97316":"#64748b",fontWeight:isKey?700:400}}>{isKey?"★ ":""}{attr}</span>
                          <span style={{fontSize:9,color:v>=7.5?"#4ade80":v>=6?"#cbd5e1":"#fbbf24",fontWeight:700,flexShrink:0,marginLeft:4}}>{v}</span>
                        </div>
                        <div className="print-bar-bg" style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginTop:2}}>
                          <div className={v>=7.5?"print-bar-fill-green":v>=6?"print-bar-fill-gray":"print-bar-fill-yellow"} style={{height:4,borderRadius:2,width:`${v*10}%`,background:v>=7.5?"#4ade80":v>=6?"#64748b":"#fbbf24",printColorAdjust:"exact",WebkitPrintColorAdjust:"exact"}}/>
                        </div>
                      </div>;
                    })}
                  </div>
                  <div className="print-verdict" style={{fontSize:9,color:"#94a3b8",lineHeight:1.5}}>{r.verdict}</div>
                </div>;
              })}
            </>;
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
                <span style={{fontSize:8,color:"#999"}}><span style={{color:"#f97316",fontWeight:700}}>Padel Analyzer</span> V7.0 · Scoring hybride calibré</span>
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
        <span style={{fontFamily:"'Outfit'",fontWeight:600}}>PADEL ANALYZER</span> V7.0 · Analyse personnalisée · {new Date().toLocaleDateString('fr-FR')}<br/><span style={{fontSize:7,opacity:0.7}}>Prix indicatifs — vérifier en boutique</span>
      </div>
      </>}
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
