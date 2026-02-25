# PADEL ANALYZER — État du projet V10.7
## Date : 25 février 2026

---

## FICHIERS ESSENTIELS

| Fichier | Rôle | Notes |
|---|---|---|
| **bundle.js** | Build déployable V10.5 patché | C'est le VRAI code en production. 1.1 MB |
| **PadelAnalyzer.jsx** | Source reconstruit (scoring V10+, UI V8) | Pour développement futur. 4311 lignes |
| **rackets-db.json** | Base de données 211 raquettes | |
| **entry.jsx** / **index.html** / **manifest.json** / **package.json** / **vercel.json** | Config | |

### ⚠️ IMPORTANT : Désynchronisation bundle ↔ JSX
- Le **bundle.js** = bundle original V10.5 avec un seul patch (bug bL). **C'est celui à déployer.**
- Le **PadelAnalyzer.jsx** = reconstruction depuis V8.0 + scoring avancé extrait du bundle. Le scoring est correct mais l'UI est celle de V8.0. **Ne pas recompiler le bundle depuis ce JSX** sans d'abord synchroniser l'UI.
- Pour rebuild futur : `npx esbuild entry.jsx --bundle --outfile=bundle.js --format=esm --jsx=automatic --define:process.env.NODE_ENV="production" --loader:.json=json`

---

## ARCHITECTURE (V10.5+)

App React mono-fichier, 100% client-side avec API Anthropic via serverless proxy (/api/chat).
D�ployé sur Vercel via GitHub (Bidoux972/padel-analyzer).

### Scoring Engine (V10+ Priority-First) :
- **computeGabaritIndex(profile)** : 0-1 scale basé sur BMI, genre, âge, fitness, taille. PRO/ELITE override (Expert+Athlétique → floor 0.55)
- **computeGlobalScore(scores, profile, racket)** : Split 65% priorités / 35% secondaires + bonuses shape/brand/womanLine + hard filters
- **computeForYou(scores, profile, racket)** : recommended/partial/no

### Profil joueur :
age, height, weight, genre (Homme/Femme), fitness (athletique/actif/occasionnel), level, hand, side, styleTags, injuryTags, priorityTags, brandTags, frequency, competition

---

## BASE DE DONNÉES : 211 raquettes

Head(40), Babolat(29), Bullpadel(27), Adidas(24), Nox(19), Wilson(17), Siux(13), Starvie(11), Varlion(9), Dunlop(6), Oxdog(4), Drop Shot(3), Royal Padel(3), Pro Kennex(3), Kuikma(2), Vermont(1)
Catégories : expert(33), avancé(70), intermédiaire(59), débutant(25), junior(24)

---

## CORRECTIONS V10.7

1. ✅ **Bug `bL.join` corrigé** — Variable non définie dans generateDeepAnalysis → `Gt.join`. Patché dans le bundle.
2. ✅ **JSX source reconstruit** — Gabarit index, scoring priority-first, genre/fitness, womanLine filters, PRO/ELITE restaurés dans le source.

---

## BUGS CONNUS / TODO

- [ ] Synchroniser le JSX source avec l'UI du bundle (le JSX a l'UI V8, le bundle a l'UI V10.5)
- [ ] Metalbone Youth peut scorer haut pour adultes (catégorie "intermediaire" au lieu de "junior")
- [ ] generateDeepAnalysis utilise l'ancien système de poids pour les explications textuelles
- [ ] Images juniors cassées (URLs padelful)
- [ ] Pro validation script à adapter au scoring priority-first

---

## POUR NOUVELLE CONVERSATION

Uploader : **ETAT_PROJET_V10.7.md** + **PadelAnalyzer.jsx** + **rackets-db.json** + **bundle.js**
Dire : "On continue Padel Analyzer V10.7. Voici le contexte et les sources."
