# PADEL ANALYZER — État du projet V11
## Date : 25 février 2026

---

## CHANGEMENTS V11 (Scoring Engine)

### 3 Modes de scoring
| Mode | Détection | Logique |
|---|---|---|
| **Junior** | âge < 15 | Raquettes junior uniquement |
| **Jeune Pépite** | âge < 15 + Avancé + Actif minimum | Junior + adultes ≤350g |
| **Normal** | âge ≥ 15, Débutant→Avancé | Algo complet 65/35 + pénalité poids |
| **Expert (Tapia)** | Expert + Athlétique | 85% priorités + 15% secondaire |

### Nouvelles fonctions
- `detectPlayerMode(profile)` → "junior" | "pepite" | "expert" | "normal"
- `parseRacketWeight(str)` → nombre en grammes
- `idealRacketWeight(profile, gabarit)` → poids idéal en grammes
- `weightPenalty(racketWeight, idealWeight)` → malus progressif

### Corrections P6/P7/P8
- **P6** : Pénalité poids raquette pour femmes + bonus womanLine renforcé + malus raquettes lourdes non-womanLine
- **P7** : 3 modes séparés avec logiques distinctes (Expert ne voit pas débutant/intermédiaire)
- **P8** : Gabarit en courbe continue (gaussienne), plus de paliers fixes

### Gabarit V11 (continu)
- BMI → courbe gaussienne autour de l'optimal (22-25 homme, 20-23 femme)
- Âge → courbe progressive (-0.003/an 35-50, -0.006/an 50-65, -0.01/an 65+)
- Hauteur → proportionnel par cm vs référence genre
- Expert → floor 0.55 | Pépite → range 0.35-0.70

---

## FICHIERS

| Fichier | Rôle |
|---|---|
| **bundle.js** | Build V11 compilé (1.9MB) — À DÉPLOYER |
| **PadelAnalyzer.jsx** | Source V11 (4418 lignes) |
| **scoring-v11.js** | Moteur de scoring isolé (pour tests) |
| **test-scoring-v11.js** | Tests avec 8 profils réalistes |
| **rackets-db.json** | Base de données 211 raquettes |

Build : `npx esbuild entry.jsx --bundle --outfile=bundle.js --format=esm --jsx=automatic --define:process.env.NODE_ENV="production" --loader:.json=json`

---

## PROBLÈMES RESTANTS (à traiter)

- [ ] P1 — Ordre wizard (Prénom → Genre → Gabarit → Condition → Niveau)
- [ ] P2 — Textes genrés (féminin)
- [ ] P3 — Expert accessible sans restriction condition physique
- [ ] P4 — Rythme de jeu inutile en Expert
- [ ] P5 — Compétition inutile en Expert
- [ ] P9 — DB instable
- [ ] P10 — Ajout raquettes par nom + validation
- [ ] P11 — Veille auto nouvelles sorties

---

## POUR NOUVELLE CONVERSATION

Uploader : **ETAT_PROJET_V11.md** + **PadelAnalyzer.jsx** + **scoring-v11.js** + **rackets-db.json** + **bundle.js** + **PROBLEMES_V10.7.md**
