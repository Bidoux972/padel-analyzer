# PadelAnalyzer V8.10 — Briefing complet

## Projet
App React single-file (PadelAnalyzer.jsx) de recommandation de raquettes de padel. Déployée sur Vercel.

## Architecture
- **PadelAnalyzer.jsx** (~4500 lignes) — Composant React unique, tout-en-un
- **rackets-db.json** (175 raquettes, enrichies avec womanLine tags)
- **entry.jsx** — Point d'entrée esbuild
- **index.html** — Shell HTML, charge bundle.js?v=8.10.0
- **bundle.js** — Build esbuild (1.0 MB, React inclus, minifié)

## Build
```bash
npx esbuild entry.jsx --bundle --format=iife --global-name=PadelApp --loader:.jsx=jsx --define:process.env.NODE_ENV="'production'" --outfile=bundle.js --minify
```

## Changements V8.10

### 1. Indice de gabarit (remplace paliers d'âge)
- Nouveaux champs profil : `gender` (Homme/Femme) + `fitness` (athletique/actif/occasionnel)
- `computeGabaritIndex(profile)` : genre + IMC contextualisé + âge progressif + fitness + taille → indice 0-1
- Suppression des paliers durs 40/50/60 → courbe progressive
- Le poids corporel est enfin utilisé dans le scoring
- Indicateur dynamique "Gabarit léger/moyen/costaud/puissant" dans le wizard

### 2. Raquettes femme (womanLine)
- 10 raquettes taguées `womanLine: true` (Arrow Hit, Flow, Varlion LW/W)
- Bonus d'affinité +0.08 à +0.15 pour gabarits légers (gIdx < 0.45)
- Pas de filtre exclusif : remontent naturellement pour gabarits légers

### 3. Impact fréquence de jeu
- `freqIndex(frequency)` : 0=occasionnel, 1=régulier, 2=assidu, 3=intensif
- Assidu/Intensif : boost Confort (+0.4/+0.8) + Tolérance (protection cumulative)
- Occasionnel : boost Tolérance + Maniabilité (pardon d'erreur)

### 4. Moteur de risque blessure
- `computeInjuryRisks(racket, profile)` : croise caractéristiques raquette × profil joueur
- 5 zones analysées : coude, poignet, épaule, dos, fatigue générale
- Facteurs : poids raquette, dureté mousse, équilibre, forme, antivibration, gabarit joueur, fréquence, âge, blessures existantes
- 3 niveaux de sévérité (1=attention, 2=risque, 3=danger)
- Pénalité automatique sur le score de pertinence (-0.12 par point de sévérité)

### 5. Affichage des alertes blessure
Visible dans 5 endroits :
- **Cartes comparateur (dashboard)** : badges compacts (icône + zone)
- **Reveal top 3** : alertes avec message explicatif
- **Détail suggestion/recherche** : alertes avant le bouton "Ajouter"
- **Pertinence tab (ranking)** : alertes complètes sous les barres de score
- **Impression PDF** : alertes visibles dans le récap imprimé

### 6. Recherche locale (V8.10 early)
- Recherche DB locale instantanée avant fallback IA web
- Fuzzy matching par tokens (name, shortName, brand, proPlayerInfo)
- Blueprint layout resserré (max-width 480px)

## Fonctions clés
- `computeGabaritIndex(profile)` → 0-1
- `freqIndex(frequency)` → 0-3
- `computeInjuryRisks(racket, profile)` → [{zone, icon, severity, message}]
- `riskColor(severity)` → couleur CSS
- `computeGlobalScore(scores, profile, racket)` → score /10
- `computeForYou(scores, profile)` → "recommended"|"partial"|"no"
