// =====================================================
// PADEL ANALYZER — SCORING ENGINE V11
// 3 modes: Junior/Pépite, Expert (Tapia), Normal
// Gabarit continu, pénalité poids, womanLine renforcé
// =====================================================

const ATTRS = ["Puissance", "Contrôle", "Confort", "Spin", "Maniabilité", "Tolérance"];

// === MODE DETECTION ===
// Returns: "junior" | "pepite" | "expert" | "normal"
function detectPlayerMode(profile) {
  const age = Number(profile.age) || 30;
  const level = (profile.level || "").toLowerCase();
  const fitness = (profile.fitness || "actif").toLowerCase();

  // --- JUNIOR / PEPITE ---
  if (age > 0 && age < 15) {
    const isAdvanced = level.includes("avanc") || level.includes("expert");
    const isActive = fitness === "athletique" || fitness === "actif";
    if (isAdvanced && isActive) return "pepite";
    return "junior";
  }

  // --- EXPERT (TAPIA) ---
  // Expert + Athlétique (ou Avancé + Athlétique si compétition)
  if (level.includes("expert") && fitness === "athletique") return "expert";

  // --- NORMAL ---
  return "normal";
}

// === GABARIT INDEX (CONTINU) ===
// Returns 0..1 — courbe continue, plus de paliers fixes
function computeGabaritIndex(profile) {
  const age = Number(profile.age) || 30;
  const weight = Number(profile.weight) || 0;
  const height = Number(profile.height) || 0;
  const genre = (profile.genre || "Homme").toLowerCase();
  const fitness = (profile.fitness || "actif").toLowerCase();

  // --- Base from BMI (continuous sigmoid-like curve) ---
  let base = 0.5;
  if (weight > 0 && height > 0) {
    const bmi = weight / (height / 100) ** 2;
    // Optimal BMI zone: 22-25 for men, 20-23 for women → peak ~0.55-0.60
    const optimalBmi = genre === "femme" ? 21.5 : 23.5;
    // Smooth bell curve around optimal BMI
    const deviation = (bmi - optimalBmi) / (genre === "femme" ? 6 : 7);
    base = 0.6 * Math.exp(-deviation * deviation) + 0.1;
    // Floor at 0.08, cap at 0.7
    base = Math.max(0.08, Math.min(0.7, base));
  } else if (weight > 0) {
    // Weight-only fallback (continuous)
    const optW = genre === "femme" ? 62 : 78;
    const dev = (weight - optW) / (genre === "femme" ? 20 : 25);
    base = 0.55 * Math.exp(-dev * dev) + 0.1;
    base = Math.max(0.08, Math.min(0.7, base));
  }

  // --- Gender modifier (continuous) ---
  const genderMod = genre === "femme" ? -0.10 : 0;

  // --- Age modifier (continuous curve, not steps) ---
  // Peak at 25, gradual decline after 35, steeper after 55
  let ageMod = 0;
  if (age < 25) {
    ageMod = 0.02 * (1 - (25 - age) / 15); // slight ramp up to 25
  } else if (age <= 35) {
    ageMod = 0; // plateau
  } else {
    // Smooth decline: -0.003 per year 35-50, -0.006 per year 50-65, -0.01 per year 65+
    const yearsOver35 = age - 35;
    if (yearsOver35 <= 15) {
      ageMod = -yearsOver35 * 0.003;
    } else if (yearsOver35 <= 30) {
      ageMod = -15 * 0.003 - (yearsOver35 - 15) * 0.006;
    } else {
      ageMod = -15 * 0.003 - 15 * 0.006 - (yearsOver35 - 30) * 0.01;
    }
  }

  // --- Fitness modifier ---
  const fitnessMod = fitness === "athletique" ? 0.15 : fitness === "actif" ? 0 : -0.12;

  // --- Height modifier (continuous) ---
  let heightMod = 0;
  if (height > 0) {
    const refHeight = genre === "femme" ? 165 : 178;
    heightMod = (height - refHeight) * 0.002; // +0.002 per cm above ref
    heightMod = Math.max(-0.08, Math.min(0.08, heightMod));
  }

  // --- Combine ---
  const raw = base + genderMod + ageMod + fitnessMod + heightMod;

  // --- Mode overrides ---
  const mode = detectPlayerMode(profile);
  if (mode === "expert") {
    return Math.max(0.55, Math.min(1, raw)); // floor at 0.55
  }
  if (mode === "pepite") {
    return Math.max(0.35, Math.min(0.7, raw)); // capped range for juniors avancés
  }

  return Math.max(0, Math.min(1, raw));
}

// === PARSE RACKET WEIGHT ===
// "350-365g" → 357.5 | "360g" → 360 | "350-365" → 357.5
function parseRacketWeight(weightStr) {
  if (!weightStr) return null;
  const s = String(weightStr).replace(/g/gi, "").trim();
  const parts = s.split("-").map(Number).filter(n => !isNaN(n) && n > 0);
  if (parts.length === 2) return (parts[0] + parts[1]) / 2;
  if (parts.length === 1) return parts[0];
  return null;
}

// === IDEAL WEIGHT FOR PROFILE ===
// Returns ideal racket weight (grams) based on gabarit + gender
function idealRacketWeight(profile, gabaritIndex) {
  const genre = (profile.genre || "Homme").toLowerCase();
  const gab = gabaritIndex;

  if (genre === "femme") {
    // gab 0.1 → 320g, gab 0.3 → 340g, gab 0.5 → 350g, gab 0.7 → 360g
    return 310 + gab * 80; // linear: 310g to 390g
  } else {
    // gab 0.1 → 340g, gab 0.3 → 350g, gab 0.5 → 360g, gab 0.7 → 375g
    return 330 + gab * 70; // linear: 330g to 400g
  }
}

// === WEIGHT PENALTY ===
// Progressive penalty when racket is too heavy for the profile
// Returns 0 (no penalty) to -1.5 (way too heavy)
function weightPenalty(racketWeight, idealWeight) {
  if (!racketWeight || !idealWeight) return 0;
  const diff = racketWeight - idealWeight;
  if (diff <= 0) {
    // Racket is lighter than ideal: tiny bonus that caps at +0.1
    return Math.max(-0.1, diff * 0.005);
  }
  // Too heavy: progressive penalty
  // 5g over → -0.05, 10g → -0.15, 15g → -0.35, 20g → -0.6, 30g → -1.2
  return -Math.pow(diff / 10, 1.6) * 0.15;
}

// === MAIN SCORING ENGINE ===
function computeGlobalScore(scores, profile, racket) {
  if (!scores || typeof scores !== "object") return 0;
  const mode = detectPlayerMode(profile);
  const isMale = !profile.genre || profile.genre === "Homme";
  const isFemale = !isMale;
  const gab = computeGabaritIndex(profile);
  const rWeight = racket ? parseRacketWeight(racket.weight) : null;
  const idealW = idealRacketWeight(profile, gab);

  // =====================
  // HARD FILTERS (all modes)
  // =====================
  // Men can't get womanLine
  if (isMale && racket?.womanLine) return 0;
  // No junior rackets for adults (normal/expert)
  const isJuniorRacket = racket?.junior || racket?.category === "junior";
  if ((mode === "normal" || mode === "expert") && isJuniorRacket) return 0;

  // =====================
  // MODE: JUNIOR
  // =====================
  if (mode === "junior") {
    // Only junior rackets
    const isJuniorRacket = racket?.junior || racket?.category === "junior";
    if (!isJuniorRacket) return 0;
    // Simple scoring: average of all attrs
    let sum = 0, count = 0;
    for (const a of ATTRS) { sum += scores[a] || 0; count++; }
    let score = count > 0 ? sum / count : 5;
    // Small weight penalty (lighter is better for juniors)
    if (rWeight && rWeight > 340) score -= (rWeight - 340) * 0.02;
    // Brand preference
    const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
    if (brandPref.length && racket?.brand && brandPref.includes(racket.brand.toLowerCase())) {
      score += 0.10;
    }
    return Math.max(0, score);
  }

  // =====================
  // MODE: JEUNE PEPITE
  // =====================
  if (mode === "pepite") {
    // Junior rackets + adult rackets ≤350g
    const isJunior = racket?.junior || racket?.category === "junior";
    const isLightAdult = !isJunior && rWeight && rWeight <= 350;
    if (!isJunior && !isLightAdult) return 0; // too heavy adult → blocked

    // Priority-based scoring (like normal but simpler)
    const prioTags = profile.priorityTags || [];
    const prioAttrMap = {
      puissance: "Puissance", spin: "Spin", controle: "Contrôle",
      confort: "Confort", legerete: "Maniabilité", protection: "Confort",
      polyvalence: null, reprise: null,
    };
    let priorityAttrs = [...new Set(prioTags.map(t => prioAttrMap[t]).filter(Boolean))];
    if (prioTags.includes("polyvalence")) priorityAttrs = [...ATTRS];
    if (prioTags.includes("reprise")) priorityAttrs = [...new Set([...priorityAttrs, "Confort", "Tolérance", "Maniabilité"])];

    const secondaryAttrs = ATTRS.filter(a => !priorityAttrs.includes(a));

    let prioSum = 0;
    for (const a of priorityAttrs) prioSum += scores[a] || 0;
    const prioAvg = priorityAttrs.length ? prioSum / priorityAttrs.length : 5;

    let secSum = 0;
    for (const a of secondaryAttrs) secSum += scores[a] || 0;
    const secAvg = secondaryAttrs.length ? secSum / secondaryAttrs.length : 5;

    let score = prioAvg * 0.6 + secAvg * 0.4;

    // Bonus for light adult rackets (better tech than junior)
    if (isLightAdult) score += 0.15;
    // Mild weight penalty
    if (rWeight) {
      const pepiteIdeal = 335; // juniors ideally ~335g
      if (rWeight > pepiteIdeal) score -= (rWeight - pepiteIdeal) * 0.01;
    }
    // Brand preference
    const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
    if (brandPref.length && racket?.brand && brandPref.includes(racket.brand.toLowerCase())) {
      score += 0.10;
    }
    return Math.max(0, score);
  }

  // =====================
  // MODE: EXPERT (TAPIA)
  // =====================
  if (mode === "expert") {
    // Hard filter: no debutant/intermediaire rackets
    if (racket?.category === "debutant") return 0;
    if (racket?.category === "intermediaire") return 0;

    // Score = 85% priority attributes + 15% secondary
    const prioTags = profile.priorityTags || [];
    const prioAttrMap = {
      puissance: "Puissance", spin: "Spin", controle: "Contrôle",
      confort: "Confort", legerete: "Maniabilité", protection: "Confort",
      polyvalence: null, reprise: null,
    };
    let priorityAttrs = [...new Set(prioTags.map(t => prioAttrMap[t]).filter(Boolean))];
    if (prioTags.includes("polyvalence")) priorityAttrs = [...ATTRS];
    if (prioTags.includes("reprise")) priorityAttrs = [...new Set([...priorityAttrs, "Confort", "Tolérance", "Maniabilité"])];
    if (priorityAttrs.length === 0) priorityAttrs = [...ATTRS]; // fallback: all equal

    const secondaryAttrs = ATTRS.filter(a => !priorityAttrs.includes(a));

    let prioSum = 0;
    for (const a of priorityAttrs) prioSum += scores[a] || 0;
    const prioAvg = priorityAttrs.length ? prioSum / priorityAttrs.length : 5;

    let secSum = 0;
    for (const a of secondaryAttrs) secSum += scores[a] || 0;
    const secAvg = secondaryAttrs.length ? secSum / secondaryAttrs.length : 5;

    let score = prioAvg * 0.85 + secAvg * 0.15;

    // Shape affinity (strong for experts who know what they want)
    if (racket) {
      const rShape = (racket.shape || "").toLowerCase();
      const hand = profile.hand || "Droitier";
      const side = profile.side || "Droite";
      const isAttacker = (hand === "Droitier" && side === "Gauche") || (hand === "Gaucher" && side === "Droite");
      const wantsPower = prioTags.includes("puissance") || isAttacker;
      const wantsControl = prioTags.includes("controle") || prioTags.includes("protection");

      if (wantsPower) {
        if (rShape.includes("diamant")) score += 0.30;
        else if (rShape.includes("goutte") || rShape.includes("hybride")) score += 0.05;
        else if (rShape.includes("ronde")) score -= 0.30;
      } else if (wantsControl) {
        if (rShape.includes("ronde")) score += 0.30;
        else if (rShape.includes("hybride") || rShape.includes("goutte")) score += 0.05;
        else if (rShape.includes("diamant")) score -= 0.15;
      }
    }

    // Brand preference
    const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
    if (brandPref.length && racket?.brand && brandPref.includes(racket.brand.toLowerCase())) {
      score += 0.12;
    }

    // Homme/Femme differentiation for experts:
    // Women experts → womanLine avancé/expert get a strong bonus
    // Heavy rackets (>370g) get a mild penalty for women
    if (isFemale && racket) {
      if (racket.womanLine) {
        score += 0.30; // strong affinity for womanLine at expert level
      }
      if (rWeight && rWeight > 370) {
        score -= (rWeight - 370) * 0.015; // mild penalty above 370g
      }
    }

    return Math.max(0, score);
  }

  // =====================
  // MODE: NORMAL (Débutant → Avancé)
  // =====================
  // Full algorithm: gabarit + weight penalty + style + injuries + priorities

  // --- Hard filters ---
  if (profile.competition && racket?.category) {
    const lvl = (profile.level || "").toLowerCase();
    if (lvl.includes("avanc") && racket.category === "debutant") return 0;
  }

  // --- Priority attributes ---
  const prioTags = profile.priorityTags || [];
  const prioAttrMap = {
    puissance: "Puissance", spin: "Spin", controle: "Contrôle",
    confort: "Confort", legerete: "Maniabilité", protection: "Confort",
    polyvalence: null, reprise: null,
  };
  let priorityAttrs = [...new Set(prioTags.map(t => prioAttrMap[t]).filter(Boolean))];
  if (prioTags.includes("polyvalence")) priorityAttrs = [...ATTRS];
  if (prioTags.includes("reprise")) priorityAttrs = [...new Set([...priorityAttrs, "Confort", "Tolérance", "Maniabilité"])];

  const secondaryAttrs = ATTRS.filter(a => !priorityAttrs.includes(a));

  // --- Priority score (direct average) ---
  let prioSum = 0;
  for (const a of priorityAttrs) prioSum += scores[a] || 0;
  const prioAvg = priorityAttrs.length ? prioSum / priorityAttrs.length : 5;

  // --- Secondary score (weighted by style/injury/gabarit) ---
  const w = {};
  for (const a of secondaryAttrs) w[a] = 1;

  // Style influence on secondary weights
  const styleMap = {
    offensif: { Puissance: 0.2 },
    puissant: { Puissance: 0.3 },
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
    if (boosts) for (const [k, v] of Object.entries(boosts)) {
      if (w[k] !== undefined) w[k] += v;
    }
  }

  // Injury influence
  const ARM_INJURIES = ["dos", "poignet", "coude", "epaule"];
  const LEG_INJURIES = ["genou", "cheville", "mollet", "hanche", "achille"];
  const injTags = profile.injuryTags || [];
  if (injTags.some(t => ARM_INJURIES.includes(t))) {
    if (w.Confort !== undefined) w.Confort += 1.5;
    if (w.Tolérance !== undefined) w.Tolérance += 0.5;
  }
  if (injTags.some(t => LEG_INJURIES.includes(t))) {
    if (w.Maniabilité !== undefined) w.Maniabilité += 1;
  }

  // Gabarit influence on secondary (continuous, not steps)
  if (gab < 0.3) {
    const factor = (0.3 - gab) / 0.3; // 1.0 at gab=0, 0.0 at gab=0.3
    if (w.Maniabilité !== undefined) w.Maniabilité += 1.5 * factor;
    if (w.Confort !== undefined) w.Confort += 1.2 * factor;
    if (w.Tolérance !== undefined) w.Tolérance += 0.8 * factor;
  } else if (gab > 0.6) {
    const factor = (gab - 0.6) / 0.4; // 0.0 at gab=0.6, 1.0 at gab=1.0
    if (w.Puissance !== undefined) w.Puissance += 0.4 * factor;
  }

  // Weighted average of secondary
  let secTotal = 0, secWeight = 0;
  for (const a of secondaryAttrs) {
    const wt = w[a] || 1;
    secTotal += (scores[a] || 0) * wt;
    secWeight += wt;
  }
  const secAvg = secWeight > 0 ? secTotal / secWeight : 5;

  // --- Combined: 65% priority + 35% secondary ---
  let score = prioAvg * 0.65 + secAvg * 0.35;

  // === RACKET-LEVEL ADJUSTMENTS ===
  if (racket) {
    // --- Weight penalty (key fix for P6) ---
    const wPenalty = weightPenalty(rWeight, idealW);
    score += wPenalty;

    // --- Shape affinity ---
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

    // --- Brand preference ---
    const brandPref = (profile.brandTags || []).map(b => b.toLowerCase());
    if (brandPref.length && racket.brand && brandPref.includes(racket.brand.toLowerCase())) {
      score += 0.12;
    }

    // --- Competition mode penalty ---
    if (profile.competition && racket.category) {
      if (racket.category === "debutant") score -= 0.5;
      else if (racket.category === "intermediaire") score -= 0.08;
    }

    // --- WomanLine affinity for female profiles ---
    if (isFemale && racket.womanLine) {
      if (gab < 0.3) score += 0.25;
      else if (gab < 0.45) score += 0.18;
      else if (gab < 0.6) score += 0.10;
      else score += 0.05;
    }

    // --- Additional weight penalty for women on heavy non-womanLine rackets ---
    if (isFemale && !racket.womanLine && rWeight) {
      const femmeThreshold = 310 + gab * 80; // same as idealRacketWeight for women
      if (rWeight > femmeThreshold + 10) {
        score -= (rWeight - femmeThreshold - 10) * 0.01; // extra penalty
      }
    }
  }

  return Math.max(0, score);
}

// === FOR YOU VERDICT ===
function computeForYou(scores, profile, racket) {
  if (!scores || typeof scores !== "object") return "no";
  const gs = computeGlobalScore(scores, profile, racket);
  const ARM_INJURIES = ["dos", "poignet", "coude", "epaule"];
  const hasArmInjury = (profile.injuryTags || []).some(t => ARM_INJURIES.includes(t));
  const comfort = scores.Confort || 0;

  if (gs >= 7.0 && (!hasArmInjury || comfort >= 7)) return "recommended";
  if (hasArmInjury && comfort < 5 && gs < 6) return "no";
  if (gs < 4) return "no";
  return "partial";
}

// === EXPORTS for testing ===
if (typeof module !== "undefined") {
  module.exports = {
    detectPlayerMode,
    computeGabaritIndex,
    computeGlobalScore,
    computeForYou,
    parseRacketWeight,
    idealRacketWeight,
    weightPenalty,
    ATTRS,
  };
}
