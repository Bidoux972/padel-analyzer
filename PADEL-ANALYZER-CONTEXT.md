# PADEL ANALYZER — Contexte Projet

> **Ce fichier est la "carte d'identité" du projet. Joins-le à toute nouvelle conversation Claude pour que je reprenne avec le même niveau de connaissance.**

## 🎯 Résumé

Application web React (single-page) d'analyse et recommandation de raquettes de padel. Déployée sur Vercel via GitHub Pages. Architecture "base embarquée + apprentissage local".

- **URL** : https://padel-analyzer-beta.vercel.app
- **Repo GitHub** : fichiers déployés = `index.html` + `bundle.js`
- **Version** : V7.0 (février 2026)
- **Base** : 149 raquettes embarquées (rackets-db.json) + localStorage pour raquettes apprises via web

## 👤 Utilisateur principal

Bidou — 49 ans, 92kg, gaucher, post-chikungunya (douleurs dos), joueur véloce/endurant côté gauche.
Teste aussi pour son fils Noah : 11 ans, 148cm, 42kg, débutant.
Raquettes possédées : Head Extreme Pro 2024 (x2), Head Coello Motion 2026.

## 🏗️ Architecture technique

### Fichiers
- `entry.jsx` — Point d'entrée React (5 lignes)
- `PadelAnalyzer.jsx` — Composant unique (~1700 lignes, tout-en-un)
- `rackets-db.json` — Base de données embarquée (149 raquettes, ~108KB)
- `bundle.js` — Build esbuild minifié (~736KB, contient React + Recharts + DB)
- `index.html` — Shell HTML minimal qui charge bundle.js

### Build
```bash
cd /home/claude/padel-vercel
npm install react react-dom recharts esbuild --save-dev
npx esbuild entry.jsx --bundle --minify --format=iife --target=es2020 \
  --outfile=/mnt/user-data/outputs/bundle.js \
  --loader:.jsx=jsx --loader:.json=json --jsx=automatic
```

### Déploiement
Upload `bundle.js` sur GitHub → Vercel auto-deploy.

## 🗃️ Structure de la base de données (rackets-db.json)

Chaque entrée est un objet JSON avec ces champs :

```json
{
  "id": "head-radical-pro-2026",
  "name": "Head Radical Pro 2026",
  "shortName": "Radical Pro 26",
  "brand": "Head",
  "shape": "Goutte d'eau",        // Diamant | Goutte d'eau | Ronde | Hybride
  "weight": "365-375g",
  "balance": "260mm (Moyen)",
  "surface": "3K Carbon",
  "core": "Power Foam + Auxetic 2.0",
  "antivib": "Auxetic 2.0",       // optionnel, "—" si absent
  "price": "280-350€",
  "player": "—",                   // signature joueur pro ou "—"
  "imageUrl": null,
  "year": 2026,
  "category": "avance",            // junior | debutant | intermediaire | avance | expert
  "scores": {
    "Puissance": 7.5,              // /10, pas de 0
    "Contrôle": 8.0,
    "Confort": 7.0,
    "Spin": 7.5,
    "Maniabilité": 7.0,
    "Tolérance": 6.5
  },
  "verdict": "Description en français, 1-2 phrases."
}
```

### Conventions de scoring
- 6 axes : Puissance, Contrôle, Confort, Spin, Maniabilité, Tolérance
- Scores de 4.0 à 10.0 (jamais 0, les guard-rails interdisent les scores < 4)
- **Expert** : scores moyens 7.5-9.5, au moins un axe ≥ 9
- **Avancé** : scores moyens 7.0-8.5
- **Intermédiaire** : scores moyens 6.0-7.5, bonne tolérance
- **Débutant** : Confort et Tolérance élevés (8+), Puissance modérée
- **Junior** : Maniabilité très haute (9+), poids léger, Confort élevé

### Répartition actuelle (149 raquettes)
| Marque | Nb | Catégories |
|---|---|---|
| Head | 42 | Toutes gammes 2024-2026 (Coello, Extreme, Radical, Speed, Gravity, Delta) |
| Adidas | 24 | Metalbone, Arrow Hit, Cross It, Discovery |
| Bullpadel | 22 | Vertex, Hack, Neuron, XPLO, Icon |
| Babolat | 20 | Viper/Veron 3.0, Air, Counter, Technical |
| Nox | 14 | AT10 Luxury Genius, Ventus |
| Siux, Wilson | 6 chacun | |
| Starvie, Varlion | 4 chacun | |
| Dunlop, Drop Shot | 3 chacun | |
| Vermont | 1 | Junior |

### Convention d'ID
`{marque}-{modèle}-{année}` en kebab-case. Ex: `head-radical-pro-2026`, `bullpadel-vertex-05-2026`.

### Convention de formes (en français)
- **Diamant** = puissance max, point d'impact haut
- **Goutte d'eau** (teardrop) = polyvalente
- **Ronde** = contrôle max, sweet spot centré
- **Hybride** = entre goutte d'eau et diamant

## 🔄 Système de stockage à 3 niveaux

| Couche | Clé localStorage | Persistance | Contenu |
|---|---|---|---|
| DB embarquée | (dans bundle.js) | Permanente | 149 raquettes |
| DB locale apprise | `padel_db_extra` | Par navigateur | Raquettes trouvées via web |
| Cache API (7j) | `padel_cache_{name}_{brand}` | 7 jours | Scores individuels |

### Workflow de consolidation
1. L'utilisateur cherche des raquettes via le web → elles se stockent dans `padel_db_extra`
2. Le compteur dans l'app indique `149 + N` (N = apprises)
3. Bouton "📤 Exporter local" → télécharge un JSON
4. L'utilisateur envoie ce JSON à Claude
5. Claude fusionne dans `rackets-db.json`, déduplique, rebuild bundle
6. Les raquettes passent de "apprises" à "embarquées"

## 📋 Tâche type : "Intégrer un export local"

Quand l'utilisateur envoie un fichier `padel-local-db-YYYY-MM-DD.json` :

1. Lire le JSON exporté (array d'objets raquette)
2. Charger `rackets-db.json` existant
3. Pour chaque raquette exportée :
   - Vérifier si elle existe déjà (match par `name` case-insensitive)
   - Si non → l'ajouter avec un `id` propre selon la convention
   - Vérifier/corriger les scores (guard-rails : min 4, max 10)
   - Vérifier la catégorie (cohérence avec les scores)
   - Vérifier la forme (Diamant/Goutte d'eau/Ronde/Hybride)
4. Sauvegarder le JSON mis à jour
5. Rebuild le bundle (commande esbuild ci-dessus)
6. Fournir `bundle.js` + `rackets-db.json` à l'utilisateur

## 📋 Tâche type : "Ajouter les nouveautés d'une marque"

1. Recherche web des nouveaux modèles (sites officiels, retailers spécialisés)
2. Pour chaque modèle : extraire specs (poids, forme, surface, core, prix, joueur signature)
3. Attribuer les scores selon les conventions ci-dessus
4. Générer les entrées JSON avec ID, verdict en français
5. Fusionner, dédupliquer, rebuild

## ⚙️ Scoring engine (computeGlobalScore)

Le score global pondère les 6 axes selon le profil :
- **Priorités** : tag "puissance" → boost Puissance x1.5, etc.
- **Style** : "véloce" → boost Maniabilité, "endurant" → boost Confort
- **Blessures** : bras (dos/poignet/coude/épaule) → boost Confort +2, jambe → boost Maniabilité +1.5
- **Taille** : <170cm → boost Maniabilité, ≥185cm → boost Puissance
- **Âge** : 40+ → boost Confort, 50+ → boost Maniabilité+Tolérance, 60+ → boost Tolérance++
- **Côté + Main** : attaquant (coup droit au centre) → boost Puissance+Spin, constructeur → boost Contrôle+Tolérance

## 📌 Notes importantes

- L'app est **100% client-side** — pas de backend, pas de base de données serveur
- L'API utilisée pour le scoring web est l'API Anthropic (Claude) directement depuis le navigateur
- Le bundle contient React 18 + Recharts (charts) + la DB JSON
- Tous les verdicts sont en **français**
- Les prix sont en **euros**
- Le champ `imageUrl` est généralement `null` (pas d'images hébergées)
