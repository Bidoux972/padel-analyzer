# PADEL ANALYZER — État du projet V10.7
## Date : 25 février 2026

---

## FICHIERS ESSENTIELS

| Fichier | Rôle | Taille |
|---|---|---|
| **PadelAnalyzer.jsx** | Code source principal React (4311 lignes) | ~292 KB |
| **rackets-db.json** | Base de données 211 raquettes | ~402 KB |
| **bundle.js** | Build prêt à déployer (ESM) | ~1.9 MB |
| **entry.jsx** | Point d'entrée esbuild | tiny |
| **index.html** | Page hôte PWA | ~4 KB |
| **manifest.json** / **package.json** / **vercel.json** | Config | tiny |

### Commande de build :
```bash
npm install
npx esbuild entry.jsx --bundle --outfile=bundle.js --format=esm --jsx=automatic --define:process.env.NODE_ENV=\"production\" --loader:.json=json
```

---

## ARCHITECTURE (V10.7)

App React mono-fichier, 100% client-side (PadelAnalyzer.jsx) avec API Anthropic via serverless proxy.

### Écrans :
home → wizard (7 étapes) → dashboard → app (pertinence/arène) → magazine

### Scoring Engine (V10+ Priority-First) :
- **computeGabaritIndex(profile)** : 0-1 scale basé sur BMI, genre, âge, fitness, taille
  - PRO/ELITE override : Expert+Athlétique → floor à 0.55
- **computeGlobalScore(scores, profile, racket)** : 
  - Split 65% priorités (moyenne directe) + 35% secondaires (moyenne pondérée)
  - Hard filters : womanLine (hommes), junior, category vs level
  - Bonuses : shape affinity (+0.25 diamant/ronde), brand (+0.12), womanLine femme
  - Competition mode : pénalise catégories inférieures
- **computeForYou(scores, profile, racket)** : recommended (≥7.0) / partial / no

### Critères (6 axes, 0-10) :
Puissance, Contrôle, Confort, Spin, Maniabilité, Tolérance

### Profil joueur :
- age, height, weight, genre (Homme/Femme), fitness (athletique/actif/occasionnel)
- level, hand, side, styleTags, injuryTags, priorityTags, brandTags
- frequency, competition (bool)

---

## BASE DE DONNÉES (211 raquettes)

| Marque | Nb |
|---|---|
| Head | 40 |
| Babolat | 29 |
| Bullpadel | 27 |
| Adidas | 24 |
| Nox | 19 |
| Wilson | 17 |
| Siux | 13 |
| Starvie | 11 |
| Varlion | 9 |
| Dunlop | 6 |
| Oxdog | 4 |
| Drop Shot, Royal Padel, Pro Kennex | 3 each |
| Kuikma | 2 |
| Vermont | 1 |

Par catégorie : expert(33), avancé(70), intermédiaire(59), débutant(25), junior(24)

---

## FONCTIONNALITÉS

1. **Wizard onboarding** (7 étapes) : Gabarit (+genre/fitness), Niveau, Main+Côté, Fréquence+Compétition, Style, Blessures+Priorités, Marques
2. **Dashboard** : Radar idéal, Top 3 absolu, stats (compatibles, recommandées, meilleur score)
3. **Pertinence** : Vue détaillée avec scores, radar comparatif, deep analysis prose, impression PDF
4. **Arène** : Vue comparative multi-raquettes (radar/barres/détails)
5. **Magazine** : Top 5 par catégorie (puissance, contrôle, confort, spin, polyvalence, rapport Q/P), slides swipable, vue technique détaillée
6. **Suggestions** : DB-first (matchFromDB) avec fallback web search IA
7. **Multi-profils** : Sauvegarde/switch/suppression, carrousel horizontal
8. **PRO/ELITE tier** : Badge violet pour Expert+Athlétique, gabarit override
9. **Export/Import** : Base locale, export JSON

---

## CORRECTIONS V10.7 (cette session)

1. ✅ **JSX synchronisé avec le bundle** — Le JSX source était resté à V8.0, le bundle était à V10.5+. Reconstruction complète.
2. ✅ **computeGabaritIndex restauré** — Fonction BMI + genre/fitness/âge/taille
3. ✅ **Scoring priority-first** — Split 65/35 au lieu de weighted average simple
4. ✅ **womanLine/junior hard filters** — computeGlobalScore retourne 0 pour incompatibles
5. ✅ **Competition mode** — Pénalise catégories inférieures pour joueurs compétiteurs
6. ✅ **Bug bL corrigé** — Variable `bL` non définie dans generateDeepAnalysis → `bOutLabels`
7. ✅ **Genre + Fitness dans wizard** — Nouveaux champs dans le profil et l'UI
8. ✅ **PRO/ELITE badge** — Affiché dans le wizard quand Expert+Athlétique

---

## BUGS CONNUS / TODO

- [ ] **Metalbone Youth #1 pour certains profils** — La raquette youth (330g) peut scorer haut pour adultes car catégorie "intermediaire" et non "junior". Vérifier si elle devrait être junior.
- [ ] **generateDeepAnalysis** utilise l'ancien système de poids (pas priority-first) pour les explications textuelles. Fonctionne pour l'affichage mais les explications peuvent être légèrement décalées par rapport au scoring réel.
- [ ] **Images juniors cassées** — URLs padelful ne couvrent pas les juniors
- [ ] **Pro validation** — L'ancien script pro-validation-final.js teste l'ancien scoring (weighted average), pas le nouveau priority-first. Il faudrait créer une validation adaptée au nouveau système.
- [ ] Mode conseiller boutique (roadmap)
- [ ] PWA offline (roadmap)

---

## POUR NOUVELLE CONVERSATION

Uploader ces fichiers :
1. **ETAT_PROJET_V10.7.md** (ce fichier)
2. **PadelAnalyzer.jsx** (source)
3. **rackets-db.json** (base)
4. **bundle.js** (optionnel, pour déploiement direct)

Puis dire : "On continue Padel Analyzer V10.7. Voici le contexte et les sources."
