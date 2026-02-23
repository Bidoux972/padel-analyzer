# PadelAnalyzer V8.10 — Briefing pour nouvelle conversation

## Projet
App React single-file (PadelAnalyzer.jsx) de recommandation de raquettes de padel. Déployée sur Vercel.

## Architecture
- **PadelAnalyzer.jsx** (~4350 lignes) — Composant React unique, tout-en-un
- **rackets-db.json** (175 raquettes, enrichies avec editorial/techHighlights/targetProfile/proPlayerInfo/womanLine)
- **entry.jsx** — Point d'entrée esbuild
- **index.html** — Shell HTML, charge bundle.js?v=8.10.0
- **bundle.js** — Build esbuild (1.0 MB, React inclus, minifié)

## Build
```bash
npx esbuild entry.jsx --bundle --format=iife --global-name=PadelApp --loader:.jsx=jsx --define:process.env.NODE_ENV="'production'" --outfile=bundle.js --minify
```
⚠️ NE PAS utiliser webpack (externals React = écran noir). Toujours esbuild.

## Fonctionnalités principales
1. **Wizard** : Création de profil joueur en 9 étapes (incluant genre + condition physique)
2. **Analyse** : Scoring hybride (algorithmique + IA) avec indice de gabarit
3. **Comparateur** : Jusqu'à 5 raquettes côte à côte
4. **Magazine** : Top 5 par catégorie (non impacté par profil — tri par scores bruts)
5. **Recherche** : DB locale first (fuzzy match) + fallback web IA
6. **Suggestions** : Recommandations IA basées sur profil (DB first, web fallback)
7. **Profil verrouillé** : Code 4+ caractères pour protéger le profil

## Changements V8.10 (majeurs)

### Indice de gabarit (remplace les paliers d'âge)
- **Nouveau champ profile**: `gender` (Homme/Femme) + `fitness` (athletique/actif/occasionnel)
- **`computeGabaritIndex(profile)`** : Combine genre + poids + taille + âge + condition physique → indice 0-1
  - 0 = gabarit très léger → boost Maniabilité + Confort + Tolérance
  - 1 = gabarit puissant → légère tolérance Puissance
- **Suppression des paliers durs** age>=40/50/60 → courbe progressive via gabarit index
- **Le poids corporel est enfin utilisé** (était collecté mais ignoré en V8.9)
- **Genre contextualisé** : Femme 55kg/165cm ≠ Homme 55kg/175cm (IMC contextualisé par genre)
- **Condition physique** compense l'âge : un joueur de 49 ans athlétique ≠ un joueur de 35 ans sédentaire
- **Indicateur dynamique** dans le wizard : "Gabarit léger/moyen/costaud/puissant"

### Raquettes femme (womanLine)
- **10 raquettes taguées `womanLine: true`** dans rackets-db.json :
  - Adidas Arrow Hit (5 modèles)
  - Bullpadel Flow (2 modèles)
  - Varlion LW/Cañas W (3 modèles)
- **Bonus d'affinité** dans `computeGlobalScore` : +0.08 à +0.15 points pour les gabarits légers (gIdx < 0.45)
- **Pas de filtre exclusif** : les raquettes femme apparaissent pour tous les profils, mais remontent naturellement pour les gabarits légers

### Recherche locale améliorée (V8.10 early)
- Recherche DB locale instantanée avant fallback IA web
- Fuzzy matching par tokens (name, shortName, brand, proPlayerInfo)
- Matching DB amélioré dans résultats (token-based au lieu de slice(0,12))
- Blueprint layout resserré (max-width 480px)

## Impacts sur les profils existants
- Les profils sauvegardés en localStorage sans `gender`/`fitness` fonctionnent normalement (defaults gracieux)
- Le scoring change légèrement par rapport à V8.9 (gabarit index vs paliers) — les résultats seront plus nuancés
- Un joueur de 49 ans en forme ne se retrouvera plus dans la catégorie "50+" automatiquement

## Magazine Top 5
- **Non impacté** : le Magazine trie par scores bruts d'attributs (Puissance, Contrôle, etc.), pas par profil
- Les catégories Polyvalence et Q/P utilisent des scores calculés mais sans composante profil

## Fichiers nécessaires pour continuer
1. PadelAnalyzer.jsx (code source)
2. rackets-db.json (base de données 175 raquettes + womanLine tags)
3. index.html (shell HTML)
4. entry.jsx (point d'entrée build)
5. Ce fichier BRIEFING.md (contexte)
