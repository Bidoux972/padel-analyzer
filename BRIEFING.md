# PadelAnalyzer V8.10 — Briefing pour nouvelle conversation

## Projet
App React single-file (PadelAnalyzer.jsx) de recommandation de raquettes de padel. Déployée sur Vercel.
URL : https://padel-analyzer.vercel.app (ou similaire)

## Architecture
- **PadelAnalyzer.jsx** (~4200 lignes) — Composant React unique, tout-en-un
- **rackets-db.json** (175 raquettes, enrichies avec editorial/techHighlights/targetProfile/proPlayerInfo)
- **entry.jsx** — Point d'entrée esbuild : `import PadelAnalyzer` + `createRoot().render()`
- **index.html** — Shell HTML minimal, charge bundle.js
- **bundle.js** — Build esbuild (1.0 MB, React inclus, minifié)

## Build
```bash
npx esbuild entry.jsx --bundle --format=iife --global-name=PadelApp --loader:.jsx=jsx --define:process.env.NODE_ENV="'production'" --outfile=bundle.js --minify
```
⚠️ NE PAS utiliser webpack (externals React = écran noir). Toujours esbuild.

## Fonctionnalités principales
1. **Wizard** : Création de profil joueur en 9 étapes
2. **Analyse** : Scoring hybride (algorithmique + IA) des raquettes vs profil
3. **Comparateur** : Jusqu'à 5 raquettes côte à côte
4. **Magazine** : Top 5 par catégorie (Puissance, Contrôle, Confort, Spin, Polyvalence, Q/P)
   - **Slides swipables** plein écran (swipe touch + flèches)
   - **Vue Blueprint** au clic : image centre + annotations tech gauche/droite
   - Toggle 2026/2025, navigation catégories avec dots
5. **Recherche** : Recherche raquette par nom (DB locale FIRST + fallback web IA)
6. **Suggestions** : Recommandations IA basées sur profil (DB first, web fallback)
7. **Profil verrouillé** : Code 4+ caractères pour protéger le profil

## Changements V8.10 (par rapport à V8.9)
- **Recherche locale DB prioritaire** : La recherche dans "+Ajouter" interroge d'abord la DB locale (instantané, scores exacts) avant de fallback vers l'IA web. Résout le problème "nox tapia" → 4×67% identiques.
- **Fuzzy search amélioré** : Recherche par tokens dans name, shortName, brand ET proPlayerInfo (ex: "tapia" match les AT10 via Agustín Tapia). Seuil 40% de tokens matchés.
- **Matching DB amélioré** : Remplacement du `.slice(0,12)` fragile par matching token-based + strip brand prefix pour les résultats web IA.
- **Blueprint layout resserré** : max-width 480px, annotations max-width 170px, gaps et paddings réduits. Plus de vide excessif sur écran large.
- **Cache buster** : index.html → bundle.js?v=8.10.0

## Bugs corrigés (V8.9 → rappel)
- **Q/P normalisé /10** : Score = (rawQP / maxQP) × 10, borné à 10 max
- **5 shapes corrigées** : Coello Pro (Diamant), Coello Team (Goutte d'eau→corrigé dans DB), etc.
- **catMap élargi** : Intermédiaire inclut maintenant "expert"
- **Vue Blueprint** : Layout 3 colonnes
- **Section +Ajouter enrichie** : Editorial + targetProfile + techHighlights

## Points d'attention
- Coello Pro shape = "Diamant" dans rackets-db.json (CORRECT) — si le déploiement affiche "Goutte d'eau", c'est un problème de build stale → rebuild obligatoire
- Le fuzzy search local ne gère pas encore les fautes d'orthographe (Levenshtein) — juste les tokens exacts
- La vue Blueprint peut encore être améliorée (plus visuel "éclaté technique")

## Profil utilisateur (Bidou)
- Joueur droitier, côté gauche, attaquant en coup droit au centre
- Douleurs au dos récentes
- Trésorier Tennis Club de la Plaine (Le Lamentin, Martinique)
- Gère aussi B. DISTRICARB S.A.R.L. (station TotalEnergies)
- Partenariat padel avec Jérémie Euphrasie en cours
- Communication directe, factuelle, pas de bavardage

## Fichiers nécessaires pour continuer
1. PadelAnalyzer.jsx (code source)
2. rackets-db.json (base de données 175 raquettes)
3. index.html (shell HTML)
4. entry.jsx (point d'entrée build)
5. Ce fichier BRIEFING.md (contexte)
