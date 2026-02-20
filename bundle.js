// PadelAnalyzer.jsx
import { useState, useCallback, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

// rackets-db.json
var rackets_db_default = [
  {
    id: "adidas-adipower-ctrl-2025",
    name: "Adidas Adipower CTRL 3.4 2025",
    shortName: "Adipower CTRL",
    brand: "Adidas",
    shape: "Ronde",
    weight: "365-375g",
    balance: "Moyen",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "200-270\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 8.5
    },
    verdict: "Ronde carbone pour le contr\xF4le pur. Grande tol\xE9rance gr\xE2ce \xE0 la forme ronde malgr\xE9 le carbone. Pour les d\xE9fenseurs avanc\xE9s."
  },
  {
    id: "adidas-adipower-jr-2025",
    name: "Adidas Adipower Junior 3.4 2025",
    shortName: "Adipower Jr 3.4",
    brand: "Adidas",
    shape: "Ronde",
    weight: "310-330g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "62-85\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 9
    },
    verdict: "Version junior de l'Adipower. Forme ronde tr\xE8s tol\xE9rante avec mousse EVA Soft pour un maximum de confort et de facilit\xE9 de jeu."
  },
  {
    id: "adidas-adipower-light-2025",
    name: "Adidas Adipower Light 3.4 2025",
    shortName: "Adipower Light",
    brand: "Adidas",
    shape: "Ronde",
    weight: "350-360g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "70-100\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 9
    },
    verdict: "Version light de l'Adipower, parfaite pour les d\xE9butants. Mousse EVA Soft pour un confort maximal et forme ronde tr\xE8s tol\xE9rante."
  },
  {
    id: "adidas-adipower-multiweight-2025",
    name: "Adidas Adipower Multiweight 2025",
    shortName: "Adipower Multi",
    brand: "Adidas",
    shape: "Goutte d'eau",
    weight: "355-375g",
    balance: "Moyen",
    surface: "Hybrid carbon/fiberglass",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "150-200\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Confort: 7,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Raquette polyvalente avec syst\xE8me de poids ajustable. Permet d'adapter l'\xE9quilibre selon son jeu, tr\xE8s bonne id\xE9e pour les joueurs en progression."
  },
  {
    id: "adidas-metalbone-2025",
    name: "Adidas Metalbone 3.4 2025",
    shortName: "Metalbone 3.4",
    brand: "Adidas",
    shape: "Diamant",
    weight: "360-375g",
    balance: "Haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "180-250\u20AC",
    player: "Ale Gal\xE1n",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 5.5,
      Confort: 5.5,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 5.5
    },
    verdict: "Diamant puissante inspir\xE9e d'Ale Gal\xE1n. Frappe explosive mais demande de la technique. Pour interm\xE9diaires confirm\xE9s \xE0 l'aise en attaque."
  },
  {
    id: "adidas-metalbone-hrd-2025",
    name: "Adidas Metalbone HRD 3.4 2025",
    shortName: "Metalbone HRD",
    brand: "Adidas",
    shape: "Diamant",
    weight: "365-380g",
    balance: "Haut",
    surface: "Carbon 18K",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "280-380\u20AC",
    player: "Ale Gal\xE1n",
    imageUrl: null,
    year: 2025,
    category: "expert",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 8,
      Maniabilit\u00E9: 5,
      Tol\u00E9rance: 5
    },
    verdict: "La plus puissante du march\xE9. Carbone 18K + EVA dure + balance haute = frappe d\xE9vastatrice. Attention : confort tr\xE8s limit\xE9, bras sensibles s'abstenir."
  },
  {
    id: "adidas-metalbone-youth-2025",
    name: "Adidas Metalbone Youth 3.4 2025",
    shortName: "Metalbone Youth",
    brand: "Adidas",
    shape: "Diamant",
    weight: "330-345g",
    balance: "Mi-haut",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "89-115\u20AC",
    player: "Ale Gal\xE1n",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 6,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 5.5
    },
    verdict: "Version junior de la Metalbone avec forme diamant pour une puissance maximale. Attention : tol\xE9rance limit\xE9e, convient mieux aux jeunes joueurs d\xE9j\xE0 \xE0 l'aise techniquement."
  },
  {
    id: "adidas-arrow-hit-2026",
    name: "Adidas Arrow Hit 2026",
    shortName: "Arrow Hit 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "360-375g",
    balance: "Moyen-Haut",
    surface: "Carbon Aluminized",
    core: "EVA Soft Performance",
    antivib: "IBS (Intelligent Balance System)",
    price: "250-310\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 6,
      Confort: 6.5,
      Spin: 7,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 5.5
    },
    verdict: "Nouvelle gamme Adidas avec balance intelligente ajustable (IBS). Diamant polyvalent et adaptable. Pour joueurs avanc\xE9s qui veulent personnaliser leur jeu."
  },
  {
    name: "Adidas Arrow Hit Attack 2026",
    shortName: "Arrow Hit Atk 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "360g",
    balance: "Haute (270mm)",
    surface: "Carbon Aluminized 16K + IBS",
    core: "Power Foam",
    antivib: true,
    price: "250-310\u20AC",
    player: "Avanc\xE9 offensif",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 6,
      Confort: 6,
      Spin: 7.5,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5.5
    },
    verdict: "Nouvelle gamme Adidas 2026. IBS pour ajustement balance. Diamant 16K puissance.",
    id: "adidas-arrow-hit-attack-2026"
  },
  {
    id: "adidas-arrow-hit-ctrl-2026",
    name: "Adidas Arrow Hit CTRL 2026",
    shortName: "Arrow Hit CTRL 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "360-370g",
    balance: "Moyen",
    surface: "Carbon Aluminized",
    core: "EVA Soft Performance",
    antivib: "IBS + MPS ribs",
    price: "250-310\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 9,
      Confort: 7.5,
      Spin: 7,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8
    },
    verdict: "Arrow Hit version contr\xF4le ronde. IBS et nervures MPS pour stabilit\xE9 maximale. Contact net et pr\xE9visible pour placement chirurgical."
  },
  {
    id: "adidas-arrow-hit-carbon-ctrl-2026",
    name: "Adidas Arrow Hit Carbon CTRL 2026",
    shortName: "Arrow Hit C.CTRL 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "360-370g",
    balance: "Moyen",
    surface: "Carbon 24K",
    core: "EVA Performance",
    antivib: "IBS + MPS ribs",
    price: "280-350\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 9.5,
      Confort: 7,
      Spin: 7.5,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7.5
    },
    verdict: "Contr\xF4le expert en full carbon 24K ronde. Structure extr\xEAmement rigide et stable. Pour joueurs d\xE9fensifs de haut niveau qui veulent placement millim\xE9tr\xE9."
  },
  {
    id: "adidas-arrow-hit-jr-pink-2026",
    name: "Adidas Arrow Hit Junior Pink 2026",
    shortName: "Arrow Hit Jr 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "310-330g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "100-115\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2026,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette junior Adidas avec construction fibre de verre et mousse souple. Forme ronde pour un maximum de tol\xE9rance et de contr\xF4le."
  },
  {
    name: "Adidas Cross It Light 2026",
    shortName: "Cross It Light 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "355g",
    balance: "Moyenne-haute (268mm)",
    surface: "Carbon Aluminized 24K + DAF",
    core: "Power Foam",
    antivib: true,
    price: "260-320\u20AC",
    player: "Avanc\xE9 offensif rapide",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8.5,
      Confort: 7.5,
      Spin: 7.5,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 8
    },
    verdict: "Raquette Martita Ortega. Dynamic Air Flow + 24K. L\xE9g\xE8re et maniable.",
    id: "adidas-cross-it-light-2026"
  },
  {
    name: "Adidas Cross It Team 2026",
    shortName: "Cross It Team 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "360g",
    balance: "Haute (270mm)",
    surface: "Fibre de verre + DAF",
    core: "Power Foam",
    antivib: true,
    price: "140-180\u20AC",
    player: "Interm\xE9diaire",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 6.5,
      Confort: 7.5,
      Spin: 7,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 6
    },
    verdict: "Cross It accessible. Diamant oversize + DAF. Bonne all-rounder interm\xE9diaire.",
    id: "adidas-cross-it-team-2026"
  },
  {
    id: "adidas-cross-it-team-light-2026",
    name: "Adidas Cross It Team Light 2026",
    shortName: "Cross It TL 26",
    brand: "Adidas",
    shape: "Hybride",
    weight: "340-355g",
    balance: "Moyen",
    surface: "Carbon Aluminized",
    core: "EVA Soft Performance",
    antivib: "Dynamic Air Flow",
    price: "150-200\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8.5,
      Spin: 7,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 8
    },
    verdict: "Hybride l\xE9g\xE8re orient\xE9e contr\xF4le. Dynamic Air Flow pour rapidit\xE9 et maniabilit\xE9. Confort et tol\xE9rance pour interm\xE9diaires en progression."
  },
  {
    id: "adidas-drive-black-2026",
    name: "Adidas Drive Black 2026",
    shortName: "Drive Black 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "340-355g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "EVA Soft Performance",
    antivib: "Standard",
    price: "50-80\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8,
      Confort: 9,
      Spin: 5,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 9
    },
    verdict: "Entr\xE9e de gamme Adidas. Ronde confortable et l\xE9g\xE8re pour d\xE9couvrir le padel. Fiberglass et EVA Soft pour maximum de tol\xE9rance sans effort."
  },
  {
    id: "adidas-match-light-2026",
    name: "Adidas Match Light 2026",
    shortName: "Match Light 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "330-345g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "EVA Soft",
    antivib: "Standard",
    price: "40-70\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 5,
      Contr\u00F4le: 8,
      Confort: 9.5,
      Spin: 4.5,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9.5
    },
    verdict: "La plus l\xE9g\xE8re et accessible d'Adidas. Parfaite pour premi\xE8res sessions. Confort maximal, aucune exigence technique."
  },
  {
    name: "Adidas Metalbone 2026",
    shortName: "Metalbone 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "355g",
    balance: "Haute (270mm)",
    surface: "Carbon Aluminized 16K + Spin Blade",
    core: "Power Foam",
    antivib: true,
    price: "300-380\u20AC",
    player: "Expert offensif customisable",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 8,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5.5
    },
    verdict: "Flagship Adidas Ale Gal\xE1n. Weight & Balance System pour personnalisation totale.",
    id: "adidas-metalbone-2026"
  },
  {
    id: "adidas-metalbone-ctrl-2026",
    name: "Adidas Metalbone CTRL 2026",
    shortName: "Metalbone CTRL 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "355-370g",
    balance: "Moyen",
    surface: "Carbon Aluminized 16K",
    core: "EVA Soft Performance",
    antivib: "Weight & Balance System",
    price: "300-370\u20AC",
    player: "Lorena Rufo",
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 9,
      Confort: 7.5,
      Spin: 7.5,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8
    },
    verdict: "Metalbone version contr\xF4le ronde. M\xEAme qualit\xE9 de construction avec focus sur pr\xE9cision et placement. Weight system personnalisable. Pour joueurs tactiques."
  },
  {
    name: "Adidas Metalbone Carbon 2026",
    shortName: "Metalbone Carbon 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "365g",
    balance: "Haute (270mm)",
    surface: "Carbone 6K + Spin Blade",
    core: "Power Foam",
    antivib: true,
    price: "250-310\u20AC",
    player: "Avanc\xE9 offensif",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 8,
      Maniabilit\u00E9: 5.5,
      Tol\u00E9rance: 5
    },
    verdict: "Metalbone 6K pour maniabilit\xE9 accrue. Bon compromis puissance-vitesse.",
    id: "adidas-metalbone-carbon-2026"
  },
  {
    id: "adidas-metalbone-carbon-ctrl-2026",
    name: "Adidas Metalbone Carbon CTRL 2026",
    shortName: "Metalbone C.CTRL 26",
    brand: "Adidas",
    shape: "Ronde",
    weight: "355-370g",
    balance: "Moyen",
    surface: "Carbon Aluminized 24K",
    core: "EVA Soft Performance",
    antivib: "Weight & Balance System",
    price: "320-390\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 9.5,
      Confort: 7,
      Spin: 8,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7.5
    },
    verdict: "Contr\xF4le premium en 24K Carbon ronde. Ultra-stable et pr\xE9cise. Pour experts d\xE9fensifs exigeants qui veulent construction rigide et sensation s\xE8che."
  },
  {
    name: "Adidas Metalbone HRD 2026",
    shortName: "Metalbone HRD 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "360g",
    balance: "Haute (272mm)",
    surface: "Carbon Aluminized 16K",
    core: "X-EVA hard",
    antivib: false,
    price: "320-400\u20AC",
    player: "Expert puissance dure",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 8.5,
      Maniabilit\u00E9: 5,
      Tol\u00E9rance: 5
    },
    verdict: "Metalbone hardcore. EVA Hard pour sortie de balle max. Puissance brute.",
    id: "adidas-metalbone-hrd-2026"
  },
  {
    name: "Adidas Metalbone Team 2026",
    shortName: "Metalbone Team 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "365g",
    balance: "Haute (270mm)",
    surface: "Fibre de verre + Spin Blade Gritt",
    core: "Power Foam",
    antivib: true,
    price: "150-200\u20AC",
    player: "Interm\xE9diaire offensif",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 7,
      Spin: 7.5,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 6.5
    },
    verdict: "Metalbone accessible. Fibre de verre pour tol\xE9rance, diamant pour puissance.",
    id: "adidas-metalbone-team-2026"
  },
  {
    name: "Adidas Metalbone Team Light 2026",
    shortName: "Metalbone TL 26",
    brand: "Adidas",
    shape: "Diamant",
    weight: "350g",
    balance: "Moyenne-haute (268mm)",
    surface: "Fibre de verre",
    core: "Power Foam",
    antivib: true,
    price: "130-170\u20AC",
    player: "Interm\xE9diaire l\xE9ger",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 8,
      Spin: 7,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 6.5
    },
    verdict: "Metalbone l\xE9g\xE8re pour progression. Fibre de verre + EVA Soft pour confort.",
    id: "adidas-metalbone-team-light-2026"
  },
  {
    id: "babolat-technical-viper-2024",
    name: "Babolat Technical Viper 2024",
    shortName: "Tech Viper 24",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "Vibrasorb",
    price: "200-270\u20AC",
    player: "Juan Lebr\xF3n",
    imageUrl: null,
    year: 2024,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Version 2024 de la Viper de Lebr\xF3n. M\xEAme qualit\xE9 technique \xE0 prix d\xE9stock\xE9. Excellent rapport qualit\xE9/prix pour joueurs avanc\xE9s."
  },
  {
    id: "babolat-air-viper-2025",
    name: "Babolat Air Viper 2025",
    shortName: "Air Viper 25",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "355-365g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "170-220\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Version all\xE9g\xE9e de la Viper avec un bon \xE9quilibre offensif/d\xE9fensif. Le carbone et le balance mi-haut offrent une frappe plus directe."
  },
  {
    id: "babolat-alioth-mini-jr-2025",
    name: "Babolat Alioth Mini Junior 2025",
    shortName: "Alioth Mini Jr 25",
    brand: "Babolat",
    shape: "Ronde",
    weight: "290g \xB110g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "90-100\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5,
      Contr\u00F4le: 9,
      Confort: 9,
      Spin: 6,
      Maniabilit\u00E9: 10,
      Tol\u00E9rance: 9
    },
    verdict: "La plus l\xE9g\xE8re du march\xE9 junior (290g), forme ronde tr\xE8s tol\xE9rante. Parfaite pour les enfants de 7-10 ans ou petits gabarits qui d\xE9couvrent le padel."
  },
  {
    id: "babolat-alioth-pro-jr-2025",
    name: "Babolat Alioth Pro Junior 2025",
    shortName: "Alioth Pro Jr 25",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "330g \xB110g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "140-150\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 7.5
    },
    verdict: "Raquette junior interm\xE9diaire avec forme goutte d'eau pour un peu plus de puissance. Bon compromis entre facilit\xE9 et performance pour les jeunes en progression."
  },
  {
    id: "babolat-contact-2025",
    name: "Babolat Contact 2025",
    shortName: "Contact 25",
    brand: "Babolat",
    shape: "Ronde",
    weight: "355-365g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "60-80\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 9
    },
    verdict: "Entr\xE9e de gamme Babolat, forme ronde tr\xE8s tol\xE9rante. Construction simple en fibre de verre pour d\xE9buter \xE0 petit prix."
  },
  {
    id: "babolat-counter-viper-2025",
    name: "Babolat Counter Viper 2025",
    shortName: "Counter Viper",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "360-370g",
    balance: "Moyen",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "Vibrasorb",
    price: "150-200\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Goutte d'eau polyvalente avec syst\xE8me anti-vibrations Vibrasorb. Bonne r\xE9partition des performances pour progresser sereinement."
  },
  {
    id: "babolat-rebel-2025",
    name: "Babolat Rebel 2025",
    shortName: "Rebel 25",
    brand: "Babolat",
    shape: "Diamant",
    weight: "370-385g",
    balance: "Haut",
    surface: "Carbon 18K",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "300-400\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 7.5,
      Maniabilit\u00E9: 5.5,
      Tol\u00E9rance: 5
    },
    verdict: "Diamant extr\xEAme Babolat. Carbone 18K brut pour une puissance maximale absolue. Z\xE9ro concession sur le confort."
  },
  {
    id: "babolat-revenge-2025",
    name: "Babolat Revenge 2025",
    shortName: "Revenge 25",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "355-365g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "70-90\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Goutte d'eau accessible avec fibre de verre pour un bon confort. Premier pas vers une raquette plus polyvalente."
  },
  {
    id: "babolat-viper-2025",
    name: "Babolat Technical Viper 2025",
    shortName: "Tech Viper 25",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "Vibrasorb",
    price: "250-320\u20AC",
    player: "Juan Lebr\xF3n",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Signature Juan Lebr\xF3n. Goutte d'eau technique avec surface textur\xE9e pour le spin. Le Vibrasorb att\xE9nue les vibrations du carbone."
  },
  {
    id: "babolat-viper-air-2025",
    name: "Babolat Viper Air 2025",
    shortName: "Viper Air 25",
    brand: "Babolat",
    shape: "Diamant",
    weight: "360-375g",
    balance: "Haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "220-280\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 5.5,
      Confort: 5.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 5
    },
    verdict: "Diamant offensive Babolat. Puissance brute avec carbone et balance haute. Pour les joueurs avanc\xE9s qui dominent au filet."
  },
  {
    name: "Babolat Air Veron 2026",
    shortName: "Air Veron 26",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "355g",
    balance: "Moyenne (262mm)",
    surface: "CarbonFlex hybrid",
    core: "Power Foam",
    antivib: true,
    price: "220-280\u20AC",
    player: "Interm\xE9diaire-Avanc\xE9 polyvalent",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 8,
      Spin: 7,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 7.5
    },
    verdict: "Polyvalente dynamique. CarbonFlex pour puissance facile. Excellente all-rounder.",
    id: "babolat-air-veron-2026"
  },
  {
    name: "Babolat Air Viper 2026",
    shortName: "Air Viper 26",
    brand: "Babolat",
    shape: "Goutte d'eau",
    weight: "355g",
    balance: "Moyenne-haute (268mm)",
    surface: "Carbone 16K",
    core: "X-EVA hard",
    antivib: true,
    price: "250-310\u20AC",
    player: "Avanc\xE9 offensif rapide",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 7,
      Confort: 7,
      Spin: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Viper a\xE9rodynamique. 16K + X-EVA pour r\xE9activit\xE9. Transitions filet-fond rapides.",
    id: "babolat-air-viper-2026"
  },
  {
    name: "Babolat Counter Veron 2026",
    shortName: "Counter Veron 26",
    brand: "Babolat",
    shape: "Ronde",
    weight: "365g",
    balance: "Haute (270mm)",
    surface: "CarbonFlex hybrid",
    core: "Power Foam",
    antivib: true,
    price: "200-260\u20AC",
    player: "Interm\xE9diaire-Avanc\xE9 contr\xF4le",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 9,
      Confort: 8,
      Spin: 7,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8.5
    },
    verdict: "Contr\xF4le accessible Babolat. CarbonFlex ronde pour tol\xE9rance maximale.",
    id: "babolat-counter-veron-2026"
  },
  {
    name: "Babolat Counter Viper 2026",
    shortName: "Counter Viper 26",
    brand: "Babolat",
    shape: "Ronde",
    weight: "365g",
    balance: "Haute (270mm)",
    surface: "Carbone 3K + Spin+",
    core: "Power Foam",
    antivib: true,
    price: "230-290\u20AC",
    player: "Avanc\xE9 d\xE9fensif-contre",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8.5,
      Confort: 7.5,
      Spin: 7.5,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8
    },
    verdict: "Ronde offensive. 3K carbon pour pr\xE9cision + balance haute pour punch en contre.",
    id: "babolat-counter-viper-2026"
  },
  {
    id: "babolat-technical-veron-2026",
    name: "Babolat Technical Veron 2026",
    shortName: "Technical Veron 26",
    brand: "Babolat",
    shape: "Diamant",
    weight: "360-370g",
    balance: "Moyen-Haut",
    surface: "CarbonFlex",
    core: "X-EVA",
    antivib: "Vibrabsorb",
    price: "250-310\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7.5,
      Confort: 7,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 6.5
    },
    verdict: "Diamant technique CarbonFlex. Plus tol\xE9rant que le Technical Viper avec bonne puissance offensive. Pour avanc\xE9s qui veulent de l'attaque avec du contr\xF4le."
  },
  {
    id: "babolat-technical-viper-2026",
    name: "Babolat Technical Viper 2026",
    shortName: "Technical Viper 26",
    brand: "Babolat",
    shape: "Diamant",
    weight: "365-375g",
    balance: "Haut",
    surface: "Carbon 12K",
    core: "X-EVA",
    antivib: "Vibrabsorb",
    price: "300-370\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 7,
      Confort: 6,
      Spin: 8.5,
      Maniabilit\u00E9: 5.5,
      Tol\u00E9rance: 6
    },
    verdict: "Diamant expert pour attaquants purs. Carbon 12K ultra-rigide et X-EVA pour sortie de balle explosive. Spin d\xE9vastateur gr\xE2ce au 3D Spin+."
  },
  {
    name: "Babolat Veron 3.0 Juan Lebr\xF3n 2026",
    shortName: "Veron 3.0 JL 26",
    brand: "Babolat",
    shape: "Diamant",
    weight: "360g",
    balance: "Haute (268mm)",
    surface: "CarbonFlex hybrid",
    core: "Power Foam",
    antivib: true,
    price: "280-340\u20AC",
    player: "Avanc\xE9 offensif polyvalent",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7.5,
      Confort: 7,
      Spin: 7.5,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 6.5
    },
    verdict: "Polyvalent offensif Lebr\xF3n. CarbonFlex pour tol\xE9rance + diamant pour punch.",
    id: "babolat-veron-3-0-juan-lebr-n-2026"
  },
  {
    name: "Babolat Vertuo 2026",
    shortName: "Vertuo 26",
    brand: "Babolat",
    shape: "Ronde",
    weight: "350g",
    balance: "Moyenne (262mm)",
    surface: "Fibre de verre",
    core: "Power Foam soft",
    antivib: true,
    price: "100-150\u20AC",
    player: "D\xE9butant",
    imageUrl: "",
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 5,
      Contr\u00F4le: 7.5,
      Confort: 9,
      Spin: 5.5,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 9
    },
    verdict: "Initiation Babolat. Ronde, l\xE9g\xE8re, fibre de verre. Maximum tol\xE9rance, prix accessible.",
    id: "babolat-vertuo-2026"
  },
  {
    name: "Babolat Viper 3.0 Juan Lebr\xF3n 2026",
    shortName: "Viper 3.0 JL 26",
    brand: "Babolat",
    shape: "Diamant",
    weight: "370g",
    balance: "Haute (272mm)",
    surface: "Carbone 3K + Carbon Power Layer",
    core: "X-EVA hard",
    antivib: true,
    price: "350-400\u20AC",
    player: "Expert puissance max",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 8,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5.5
    },
    verdict: "Arme de Juan Lebr\xF3n. 3K + X-EVA pour smash d\xE9vastateur. Puissance brute experts.",
    id: "babolat-viper-3-0-juan-lebr-n-2026"
  },
  {
    id: "babolat-viper-soft-3.0-lebron-2026",
    name: "Babolat Viper Soft 3.0 Juan Lebr\xF3n 2026",
    shortName: "Viper Soft 3.0 26",
    brand: "Babolat",
    shape: "Diamant",
    weight: "365g",
    balance: "Haut",
    surface: "3K Soft Carbon",
    core: "X-EVA + Comfort Layer",
    antivib: "Vibrabsorb",
    price: "320-390\u20AC",
    player: "Juan Lebr\xF3n",
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 7,
      Confort: 7,
      Spin: 8,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 6
    },
    verdict: "Viper avec couche confort suppl\xE9mentaire. M\xEAme puissance Lebr\xF3n avec toucher plus doux. Pour experts offensifs qui veulent m\xE9nager leur bras."
  },
  {
    id: "bullpadel-vertex-04-2024",
    name: "Bullpadel Vertex 04 2024",
    shortName: "Vertex 04 24",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "360-375g",
    balance: "Haut",
    surface: "Carbon 12K",
    core: "Hard EVA",
    antivib: "Vibradrive",
    price: "200-280\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2024,
    category: "avance",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 7,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5.5
    },
    verdict: "Vertex 2024 en d\xE9stockage. M\xEAme puissance d\xE9vastatrice que la 2025. Prix plus doux pour la m\xEAme performance."
  },
  {
    id: "bullpadel-flow-2025",
    name: "Bullpadel Flow 2025",
    shortName: "Flow 25",
    brand: "Bullpadel",
    shape: "Ronde",
    weight: "355-365g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "50-70\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette d\xE9butant Bullpadel, ronde et l\xE9g\xE8re. Construction robuste pour apprendre les bases."
  },
  {
    id: "bullpadel-hack-03-2025",
    name: "Bullpadel Hack 03 2025",
    shortName: "Hack 03 25",
    brand: "Bullpadel",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "Vibradrive",
    price: "160-210\u20AC",
    player: "Paquito Navarro",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "La Hack offre un bon compromis entre puissance et contr\xF4le. Le Vibradrive aide au confort mais le carbone reste ferme. Bonne raquette de progression."
  },
  {
    id: "bullpadel-hack-elite-2025",
    name: "Bullpadel Hack Elite 2025",
    shortName: "Hack Elite 25",
    brand: "Bullpadel",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "Vibradrive",
    price: "220-300\u20AC",
    player: "Paquito Navarro",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Version \xE9lite de la Hack de Paquito. Bon compromis puissance/contr\xF4le pour joueurs avanc\xE9s polyvalents."
  },
  {
    id: "bullpadel-hack-jr-2025",
    name: "Bullpadel Hack Junior 2025",
    shortName: "Hack Junior 25",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "340g",
    balance: "Mi-haut",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "58-95\u20AC",
    player: "Paquito Navarro",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 5.5,
      Confort: 7.5,
      Spin: 6,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 5
    },
    verdict: "Version junior offensive inspir\xE9e de Paquito Navarro. Forme diamant pour puissance maximale, mais confort et tol\xE9rance limit\xE9s. Pour jeunes joueurs offensifs."
  },
  {
    id: "bullpadel-indiga-boy-2025",
    name: "Bullpadel Indiga Boy 2025",
    shortName: "Indiga Boy 25",
    brand: "Bullpadel",
    shape: "Goutte d'eau",
    weight: "280g \xB110g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "55-65\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8,
      Confort: 9,
      Spin: 6,
      Maniabilit\u00E9: 10,
      Tol\u00E9rance: 7.5
    },
    verdict: "Ultra-l\xE9g\xE8re (280g) pour les plus jeunes. Forme goutte d'eau accessible avec excellent confort. La plus l\xE9g\xE8re de sa cat\xE9gorie."
  },
  {
    id: "bullpadel-vertex-03-2025",
    name: "Bullpadel Vertex 03 2025",
    shortName: "Vertex 03 25",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "360-375g",
    balance: "Haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "Vibradrive",
    price: "180-240\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 5.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 5.5
    },
    verdict: "Diamant puissante avec balance haut. Le Vibradrive att\xE9nue un peu les vibrations mais le confort reste moyen. Pour interm\xE9diaires offensifs."
  },
  {
    id: "bullpadel-vertex-04-2025",
    name: "Bullpadel Vertex 04 2025",
    shortName: "Vertex 04",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "360-375g",
    balance: "Haut",
    surface: "Carbon 12K",
    core: "Hard EVA",
    antivib: "Vibradrive",
    price: "250-350\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5
    },
    verdict: "La Vertex ultime. Carbone 12K + EVA dure pour une sortie de balle explosive. Confort minimal \u2014 r\xE9serv\xE9e aux experts avec bras solide."
  },
  {
    id: "bullpadel-vertex-elite-2025",
    name: "Bullpadel Vertex Elite 2025",
    shortName: "Vertex Elite",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "370-385g",
    balance: "Haut",
    surface: "Carbon 18K",
    core: "Hard EVA",
    antivib: "Vibradrive",
    price: "350-420\u20AC",
    player: "Ale Gal\xE1n",
    imageUrl: null,
    year: 2025,
    category: "expert",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 7,
      Maniabilit\u00E9: 5.5,
      Tol\u00E9rance: 5
    },
    verdict: "Le top absolu de Bullpadel. Carbone 18K + EVA Hard pour une puissance d\xE9vastatrice. Vibradrive aide un peu mais confort minimal."
  },
  {
    id: "bullpadel-vertex-jr-2025",
    name: "Bullpadel Vertex Junior 2025",
    shortName: "Vertex Junior 25",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "330-350g",
    balance: "Mi-haut",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "75-109\u20AC",
    player: "Juan Tello",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 5.5,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 5
    },
    verdict: "Version junior du best-seller Vertex. Forme diamant offensive avec bon confort gr\xE2ce \xE0 la fibre de verre, mais tol\xE9rance limit\xE9e aux frappes d\xE9centr\xE9es."
  },
  {
    name: "Bullpadel Flow Legend 2026",
    shortName: "Flow Legend 26",
    brand: "Bullpadel",
    shape: "Goutte d'eau",
    weight: "350g",
    balance: "Moyenne (262mm)",
    surface: "Xtend Carbon 3K + Fibrix",
    core: "MultiEva",
    antivib: true,
    price: "200-260\u20AC",
    player: "Avanc\xE9 l\xE9ger / femmes",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Confort: 7.5,
      Spin: 7.5,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "L\xE9g\xE8re et punchy. Inspir\xE9e par Alejandra Salazar. Id\xE9ale joueuses avanc\xE9es.",
    id: "bullpadel-flow-legend-2026"
  },
  {
    name: "Bullpadel Hack 04 2026",
    shortName: "Hack 04 26",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "370g",
    balance: "Haute (272mm)",
    surface: "TriCarbon 18K + Total Channel",
    core: "Tricore hard",
    antivib: true,
    price: "300-380\u20AC",
    player: "Expert puissance pure",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5
    },
    verdict: "Puissance max Bullpadel. TriCarbon 18K + Tricore. Raquette de Paquito Navarro.",
    id: "bullpadel-hack-04-2026"
  },
  {
    id: "bullpadel-hack-04-comfort-2026",
    name: "Bullpadel Hack 04 Comfort 2026",
    shortName: "Hack 04 Comfort 26",
    brand: "Bullpadel",
    shape: "Goutte d'eau",
    weight: "360-370g",
    balance: "Moyen",
    surface: "TriCarbon",
    core: "MultiEVA Soft",
    antivib: "Ease Vibe",
    price: "200-260\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7,
      Confort: 7,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 6
    },
    verdict: "ADN offensif Hack avec confort accru. Goutte d'eau et MultiEVA Soft pour sessions longues. \xC9quilibre attaque/confort pour interm\xE9diaires progressant."
  },
  {
    id: "bullpadel-hack-04-hybrid-2026",
    name: "Bullpadel Hack 04 Hybrid 2026",
    shortName: "Hack 04 Hybrid 26",
    brand: "Bullpadel",
    shape: "Hybride",
    weight: "365-375g",
    balance: "Moyen",
    surface: "18K Aluminised Carbon",
    core: "MultiEVA",
    antivib: "Ease Vibe + Total Channel",
    price: "260-330\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Confort: 7,
      Spin: 8,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7
    },
    verdict: "Hack format hybride pour contre-attaque. Puissance dynamique avec meilleur contr\xF4le d\xE9fensif. Pour joueurs avanc\xE9s offensifs polyvalents."
  },
  {
    id: "bullpadel-icon-2026",
    name: "Bullpadel Icon 2026",
    shortName: "Icon 26",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "365-375g",
    balance: "Haut",
    surface: "12K Xtend Carbon",
    core: "MultiEVA",
    antivib: "Ease Vibe",
    price: "300-380\u20AC",
    player: "Juan Mart\xEDn D\xEDaz",
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 7,
      Confort: 6.5,
      Spin: 8,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 6.5
    },
    verdict: "Hommage au l\xE9gendaire Juan Mart\xEDn D\xEDaz. Puissance et contr\xF4le premium pour joueurs d'\xE9lite qui cherchent l'excellence sur chaque point."
  },
  {
    name: "Bullpadel Neuron 02 2026",
    shortName: "Neuron 02 26",
    brand: "Bullpadel",
    shape: "Hybride",
    weight: "365g",
    balance: "Moyenne (265mm)",
    surface: "Xtend Carbon 3K + PrismLock",
    core: "MultiEva",
    antivib: true,
    price: "280-350\u20AC",
    player: "Avanc\xE9-Expert contr\xF4le",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8.5,
      Confort: 7.5,
      Spin: 8,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7
    },
    verdict: "Contr\xF4le structurel. PrismLock r\xE9duit torsions. Raquette de Chingotto.",
    id: "bullpadel-neuron-02-2026"
  },
  {
    id: "bullpadel-neuron-02-edge-2026",
    name: "Bullpadel Neuron 02 Edge 2026",
    shortName: "Neuron 02 Edge 26",
    brand: "Bullpadel",
    shape: "Hybride",
    weight: "365-375g",
    balance: "Moyen-Haut",
    surface: "3K Xtend Carbon",
    core: "MultiEVA",
    antivib: "PrismLock + Ease Vibe",
    price: "300-380\u20AC",
    player: "Federico Chingotto",
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 9,
      Confort: 7,
      Spin: 8.5,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 6.5
    },
    verdict: "Version pro du Neuron avec g\xE9om\xE9trie modifi\xE9e pour plus de punch. Pr\xE9cision de Chingotto avec boost offensif. Pour experts tactiques qui veulent aussi acc\xE9l\xE9rer."
  },
  {
    name: "Bullpadel Vertex 05 2026",
    shortName: "Vertex 05 26",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "365g",
    balance: "Haute (270mm)",
    surface: "Xtend Carbon 12K + CurvAktiv",
    core: "MultiEva",
    antivib: true,
    price: "300-380\u20AC",
    player: "Expert polyvalent offensif",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6.5,
      Confort: 5.5,
      Spin: 8,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5
    },
    verdict: "Flagship Bullpadel 2026. 12K + MultiEva pour puissance ET toucher. Raquette de Juan Tello.",
    id: "bullpadel-vertex-05-2026"
  },
  {
    id: "bullpadel-vertex-05-geo-2026",
    name: "Bullpadel Vertex 05 GEO 2026",
    shortName: "Vertex 05 GEO 26",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "365-375g",
    balance: "Haut",
    surface: "12K Xtend Carbon",
    core: "MultiEVA",
    antivib: "Ease Vibe",
    price: "300-380\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 6,
      Confort: 5,
      Spin: 8.5,
      Maniabilit\u00E9: 5.5,
      Tol\u00E9rance: 5.5
    },
    verdict: "Version la plus agressive du Vertex. G\xE9om\xE9trie optimis\xE9e pour surface de frappe \xE9largie et balance encore plus haute. Puissance brute maximale."
  },
  {
    name: "Bullpadel Vertex 05 Hybrid 2026",
    shortName: "Vertex 05 Hyb 26",
    brand: "Bullpadel",
    shape: "Hybride",
    weight: "365g",
    balance: "Moyenne (265mm)",
    surface: "Xtend Carbon 3K + Fibrix",
    core: "MultiEva",
    antivib: true,
    price: "260-320\u20AC",
    player: "Avanc\xE9 polyvalent",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Confort: 7,
      Spin: 8,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7
    },
    verdict: "Vertex en goutte d'eau. Plus de contr\xF4le et maniabilit\xE9. Joueurs complets c\xF4t\xE9 droit.",
    id: "bullpadel-vertex-05-hybrid-2026"
  },
  {
    name: "Bullpadel XPLO 2026",
    shortName: "XPLO 26",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "375g",
    balance: "Haute (274mm)",
    surface: "TriCarbon 18K",
    core: "Tricore hard",
    antivib: false,
    price: "320-400\u20AC",
    player: "Expert puissance explosive",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 8,
      Maniabilit\u00E9: 5,
      Tol\u00E9rance: 5
    },
    verdict: "Plus puissante Bullpadel. Raquette de Di Nenno. Diamant extreme, technique requise.",
    id: "bullpadel-xplo-2026"
  },
  {
    name: "Bullpadel XPLO Comfort 2026",
    shortName: "XPLO Comfort 26",
    brand: "Bullpadel",
    shape: "Diamant",
    weight: "365g",
    balance: "Haute (270mm)",
    surface: "TriCarbon 12K + Fibrix",
    core: "MultiEva",
    antivib: true,
    price: "280-340\u20AC",
    player: "Avanc\xE9 puissance confort",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 6.5,
      Confort: 7,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 6
    },
    verdict: "XPLO apprivois\xE9e. M\xEAme ADN avec plus de confort. Attaquants sensibles du bras.",
    id: "bullpadel-xplo-comfort-2026"
  },
  {
    id: "drop-shot-conqueror-2025",
    name: "Drop Shot Conqueror 10.0 2025",
    shortName: "Conqueror 10",
    brand: "Drop Shot",
    shape: "Diamant",
    weight: "365-380g",
    balance: "Haut",
    surface: "Carbon",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "200-280\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 6,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5
    },
    verdict: "Diamant offensive Drop Shot pour les joueurs de puissance. Carbone + EVA dure pour un maximum de sortie de balle."
  },
  {
    id: "drop-shot-junior-2025",
    name: "Drop Shot Explorer Junior 2025",
    shortName: "Explorer Jr 25",
    brand: "Drop Shot",
    shape: "Ronde",
    weight: "300-320g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "40-55\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Entr\xE9e de gamme junior Drop Shot. Simple, efficace et abordable pour d\xE9couvrir le padel."
  },
  {
    id: "drop-shot-legend-2025",
    name: "Drop Shot Legend 4.0 2025",
    shortName: "Legend 4.0",
    brand: "Drop Shot",
    shape: "Goutte d'eau",
    weight: "355-370g",
    balance: "Moyen",
    surface: "Hybrid carbon/fiberglass",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "120-160\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 7,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7.5
    },
    verdict: "Polyvalente et accessible, la Legend est un bon choix pour l'interm\xE9diaire qui veut progresser sans se sp\xE9cialiser."
  },
  {
    id: "dunlop-galactica-jr-2025",
    name: "Dunlop Galactica Junior 2025",
    shortName: "Galactica Jr",
    brand: "Dunlop",
    shape: "Ronde",
    weight: "310-330g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "45-65\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette junior Dunlop accessible et tol\xE9rante. Construction classique fibre de verre pour un apprentissage en douceur."
  },
  {
    id: "dunlop-galactica-pro-2025",
    name: "Dunlop Galactica Pro 2025",
    shortName: "Galactica Pro",
    brand: "Dunlop",
    shape: "Goutte d'eau",
    weight: "355-370g",
    balance: "Moyen",
    surface: "Hybrid carbon/fiberglass",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "130-170\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 7,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7.5
    },
    verdict: "Polyvalente Dunlop avec mix carbone/verre. Bon confort pour une raquette carbone, id\xE9ale pour progresser."
  },
  {
    id: "dunlop-rocket-ultra-2025",
    name: "Dunlop Rocket Ultra 2025",
    shortName: "Rocket Ultra",
    brand: "Dunlop",
    shape: "Ronde",
    weight: "350-360g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "55-75\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 9
    },
    verdict: "Ronde Dunlop l\xE9g\xE8re et maniable. Fibre de verre souple pour un apprentissage confortable."
  },
  {
    id: "dunlop-fx-lite-26",
    brand: "Dunlop",
    name: "Dunlop FX Lite 2026",
    shortName: "FX Lite 26",
    year: 2026,
    category: "avance",
    shape: "Diamant",
    weight: "350-360",
    balance: "moyen",
    surface: "12K Carbon",
    core: "Soft EVA",
    priceRange: "170-230\u20AC",
    description: "Diamant l\xE9g\xE8re offensive. 12K Carbon + Soft EVA + Sonic Core Infinergy. Maniabilit\xE9 sans sacrifier puissance.",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 8,
      Confort: 7.5,
      Spin: 7.5,
      Tol\u00E9rance: 6.5
    },
    imageUrl: null
  },
  {
    id: "dunlop-fx-pro-26",
    brand: "Dunlop",
    name: "Dunlop FX Pro 2026",
    shortName: "FX Pro 26",
    year: 2026,
    category: "expert",
    shape: "Diamant",
    weight: "365-375",
    balance: "haut",
    surface: "12K Carbon",
    core: "Pro EVA",
    priceRange: "200-260\u20AC",
    description: "Diamant puissance premium. 12K Carbon + Pro EVA + Force Bridge. Head heavy pour smashes d\xE9vastateurs.",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6.5,
      Maniabilit\u00E9: 6,
      Confort: 6,
      Spin: 7.5,
      Tol\u00E9rance: 5.5
    },
    imageUrl: null
  },
  {
    id: "dunlop-fx-team-26",
    brand: "Dunlop",
    name: "Dunlop FX Team 2026",
    shortName: "FX Team 26",
    year: 2026,
    category: "intermediaire",
    shape: "Diamant",
    weight: "360-370",
    balance: "moyen",
    surface: "Premium Carbon",
    core: "Pro EVA",
    priceRange: "130-180\u20AC",
    description: "Diamant accessible. SpinBoost + Power Holes + Force Bridge. Puissance contr\xF4l\xE9e pour progression.",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 6,
      Maniabilit\u00E9: 7,
      Confort: 7.5,
      Spin: 7,
      Tol\u00E9rance: 6
    },
    imageUrl: null
  },
  {
    id: "head-extreme-pro-2024",
    name: "Head Extreme Pro 2024",
    shortName: "Extreme Pro 24",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355-370g",
    balance: "Mi-haut",
    surface: "Carbon 3K",
    core: "Power foam",
    antivib: "Auxetic + Innegra",
    price: "180-250\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2024,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Version 2024 de l'Extreme Pro. M\xEAme ADN polyvalent avec Power Foam et double anti-vibrations. Excellent rapport qualit\xE9/prix en d\xE9stockage."
  },
  {
    id: "head-monster-kids-2024",
    name: "Head Monster Kids 2024",
    shortName: "Monster Kids 24",
    brand: "Head",
    shape: "Ronde",
    weight: "300g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "Innegra",
    price: "60-70\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2024,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 9,
      Spin: 6,
      Maniabilit\u00E9: 10,
      Tol\u00E9rance: 9
    },
    verdict: "Ultra-l\xE9g\xE8re et ultra-tol\xE9rante, la raquette parfaite pour les tout-petits ou vrais d\xE9butants. Z\xE9ro puissance mais un maximum de facilit\xE9 et de confort."
  },
  {
    id: "head-speed-motion-2024",
    name: "Head Speed Motion 2024",
    shortName: "Speed Motion 24",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355-365g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Comfort foam",
    antivib: "Innegra",
    price: "80-120\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2024,
    category: "debutant",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Ancienne Speed Motion \xE0 prix r\xE9duit. Fibre de verre et Innegra pour un excellent confort. Tr\xE8s bon choix d\xE9butant en promotion."
  },
  {
    id: "head-extreme-jr-2025",
    name: "Head Extreme Junior 2025",
    shortName: "Extreme Jr 25",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "320g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "Innegra",
    price: "120-140\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Confort: 9,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Version junior de l'Extreme avec mousse Power Foam dos\xE9e et anti-vibrations Innegra. Plus de puissance que la Speed Junior tout en gardant un excellent confort."
  },
  {
    id: "head-extreme-motion-2025",
    name: "Head Extreme Motion 2025",
    shortName: "Extreme Motion",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355-365g",
    balance: "Moyen",
    surface: "Hybrid carbon/fiberglass",
    core: "Comfort foam",
    antivib: "Auxetic 2.0",
    price: "130-170\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Raquette polyvalente et confortable pour d\xE9buter ou reprendre. Le syst\xE8me Auxetic 2.0 absorbe bien les vibrations, forme goutte d'eau \xE9quilibr\xE9e."
  },
  {
    id: "head-extreme-one-2025",
    name: "Head Extreme One 2025",
    shortName: "Extreme One 25",
    brand: "Head",
    shape: "Ronde",
    weight: "355-365g",
    balance: "Bas",
    surface: "Hybrid carbon/fiberglass",
    core: "Comfort foam",
    antivib: "Auxetic 2.0",
    price: "100-140\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 9
    },
    verdict: "Forme ronde ultra-tol\xE9rante avec anti-vibrations Auxetic. Le choix le plus s\xFBr pour un d\xE9butant adulte qui veut apprendre sans douleur."
  },
  {
    id: "head-extreme-pro-2025",
    name: "Head Extreme Pro 2025",
    shortName: "Extreme Pro 25",
    brand: "Head",
    shape: "Diamant",
    weight: "355-370g",
    balance: "Mi-haut",
    surface: "Hybrid carbon/fiberglass",
    core: "Power foam",
    antivib: "Auxetic 2.0 + Innegra",
    price: "200-260\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 8,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5
    },
    verdict: "Goutte d'eau polyvalente avec un bon compromis puissance/contr\xF4le. La mousse Power Foam apporte de la r\xE9activit\xE9 compens\xE9e par les anti-vibrations Auxetic."
  },
  {
    id: "head-gravity-motion-2025",
    name: "Head Gravity Motion 2025",
    shortName: "Gravity Motion 25",
    brand: "Head",
    shape: "Ronde",
    weight: "355g",
    balance: "Moyen (265mm)",
    surface: "Fiberglass",
    core: "Control Foam",
    antivib: "Auxetic 2.0",
    price: "150-200\u20AC",
    player: "Marina Guinart",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8,
      Confort: 8.5,
      Spin: 6.5,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 8.5
    },
    verdict: "Ronde l\xE9g\xE8re et tr\xE8s maniable. Fiberglass doux et large sweet spot. Excellente pour joueuses ou joueurs interm\xE9diaires cherchant contr\xF4le et confort maximal."
  },
  {
    id: "head-gravity-pro-2025",
    name: "Head Gravity Pro 2025",
    shortName: "Gravity Pro 25",
    brand: "Head",
    shape: "Ronde",
    weight: "365g",
    balance: "Moyen (265mm)",
    surface: "Carbon + Fiberglass Hybrid",
    core: "Control Foam",
    antivib: "Auxetic 2.0",
    price: "200-260\u20AC",
    player: "Daniel Windahl",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 9,
      Confort: 8,
      Spin: 7.5,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8
    },
    verdict: "R\xE9f\xE9rence contr\xF4le Head en forme ronde. Grand sweet spot, stable sur les blocks et les lobs. Pour joueurs de droite qui construisent le point avec patience et placement."
  },
  {
    id: "head-gravity-team-light-2025",
    name: "Head Gravity Team Light 2025",
    shortName: "Gravity Team Light 25",
    brand: "Head",
    shape: "Ronde",
    weight: "340g",
    balance: "Moyen-Haut (270mm)",
    surface: "Fiberglass",
    core: "Control Foam",
    antivib: "Graphene 360+",
    price: "100-140\u20AC",
    player: null,
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 7.5,
      Confort: 9,
      Spin: 5.5,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "La plus l\xE9g\xE8re de la gamme Gravity. Ronde ultra-confortable, id\xE9ale pour d\xE9butants, femmes et joueurs l\xE9gers. Facile \xE0 man\u0153uvrer avec bon contr\xF4le."
  },
  {
    id: "head-one-ultralight-2025",
    name: "Head One Ultralight 2025",
    shortName: "One Ultralight",
    brand: "Head",
    shape: "Ronde",
    weight: "300g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "Innegra",
    price: "107-165\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 9,
      Spin: 6,
      Maniabilit\u00E9: 10,
      Tol\u00E9rance: 9
    },
    verdict: "Ultra-l\xE9g\xE8re avec anti-vibrations Innegra. Forme ronde pour une tol\xE9rance maximale. Id\xE9ale pour les juniors ou adultes recherchant un poids plume."
  },
  {
    id: "head-speed-jr-2025",
    name: "Head Speed Junior 2025",
    shortName: "Speed Junior 25",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "310g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "Innegra",
    price: "65-105\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 9,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Raquette junior Head avec technologie anti-vibrations Innegra. Forme goutte d'eau pour un bon compromis puissance/contr\xF4le avec un confort sup\xE9rieur."
  },
  {
    id: "head-speed-motion-2025",
    name: "Head Speed Motion 2025",
    shortName: "Speed Motion 25",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355-365g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Comfort foam",
    antivib: "Innegra",
    price: "100-130\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Raquette d\xE9butant avec fibre de verre douce et anti-vibrations Innegra. Bon \xE9quilibre entre facilit\xE9 et progression."
  },
  {
    id: "head-speed-one-x-2025",
    name: "Head Speed One X 2025",
    shortName: "Speed One X 25",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "350g",
    balance: "Moyen",
    surface: "2D Carbon",
    core: "Power Foam",
    antivib: "DAMP+ + Auxetic 2.0",
    price: "280-340\u20AC",
    player: null,
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Confort: 8,
      Spin: 7.5,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 7.5
    },
    verdict: "Ultra-confortable gr\xE2ce au DAMP+ dans le c\u0153ur. Polyvalente l\xE9g\xE8re avec bon rendement. Pour joueurs confirm\xE9s qui cherchent sensations et protection du bras."
  },
  {
    id: "head-speed-pro-2025",
    name: "Head Speed Pro 2025",
    shortName: "Speed Pro 25",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355-370g",
    balance: "Moyen",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "Innegra",
    price: "180-230\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Raquette de vitesse avec bon \xE9quilibre. Le carbone offre de la r\xE9activit\xE9, l'Innegra adoucit les vibrations. Pour joueurs interm\xE9diaires cherchant la polyvalence."
  },
  {
    id: "head-speed-team-2025",
    name: "Head Speed Team 2025",
    shortName: "Speed Team 25",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "360g",
    balance: "Moyen (265mm)",
    surface: "Fiberglass",
    core: "Power Foam",
    antivib: "Auxetic 2.0",
    price: "140-180\u20AC",
    player: null,
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 8,
      Spin: 6.5,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8
    },
    verdict: "Polyvalente accessible en fiberglass. Bon \xE9quilibre puissance/contr\xF4le/confort pour joueurs interm\xE9diaires. Facile \xE0 prendre en main avec un toucher doux."
  },
  {
    id: "head-coello-junior-2026",
    name: "Head Coello Junior 2026",
    shortName: "Coello Junior 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "310-320g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "Innegra + Auxetic 2.0",
    price: "200-250\u20AC",
    player: "Arturo Coello",
    imageUrl: null,
    year: 2026,
    category: "junior",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Confort: 9,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Raquette junior haut de gamme avec technologies anti-vibrations premium. Tr\xE8s l\xE9g\xE8re et confortable, id\xE9ale pour l'apprentissage avec un excellent confort de frappe."
  },
  {
    id: "head-coello-motion-2026",
    name: "Head Coello Motion 2026",
    shortName: "Coello Motion",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon 3K",
    core: "Power foam",
    antivib: "Auxetic 2.0",
    price: "280-350\u20AC",
    player: "Arturo Coello",
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Signature Arturo Coello. Goutte d'eau \xE9quilibr\xE9e avec Power Foam et Auxetic pour un mix puissance/toucher de balle remarquable."
  },
  {
    id: "head-coello-pro-2026",
    name: "Head Coello Pro 2026",
    shortName: "Coello Pro 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon 3K",
    core: "Power foam",
    antivib: "Auxetic 2.0",
    price: "350-400\u20AC",
    player: "Arturo Coello",
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 8.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 6.5
    },
    verdict: "La raquette signature d'Arturo Coello version pro. Carbone 3K premium avec Dual Spin pour un effet d\xE9vastateur. R\xE9serv\xE9e aux experts."
  },
  {
    name: "Head Coello Team 2026",
    shortName: "Coello Team 26",
    brand: "Head",
    shape: "Diamant",
    weight: "360g",
    balance: "Haute (270mm)",
    surface: "Fibre de verre + Power Foam",
    core: "Power Foam",
    antivib: true,
    price: "200-260\u20AC",
    player: "Interm\xE9diaire-Avanc\xE9 offensif",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 6,
      Confort: 7,
      Spin: 7,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 6
    },
    verdict: "Version accessible de la gamme Coello. Diamant fibre de verre pour puissance facile et confort.",
    id: "head-coello-team-2026"
  },
  {
    name: "Head Coello Vibe 2026",
    shortName: "Coello Vibe 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355g",
    balance: "Moyenne",
    surface: "Fibre de verre",
    core: "Power Foam",
    antivib: true,
    price: "120-160\u20AC",
    player: "D\xE9butant-Interm\xE9diaire",
    imageUrl: "",
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8.5,
      Maniabilit\u00E9: 7,
      Confort: 8.5,
      Spin: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Entr\xE9e de gamme Coello premium. Oversized teardrop, large sweet spot, tol\xE9rante et confortable.",
    id: "head-coello-vibe-2026"
  },
  {
    id: "head-delta-elite-2026",
    name: "Head Delta Elite 2026",
    shortName: "Delta Elite 26",
    brand: "Head",
    shape: "Diamant",
    weight: "370-385g",
    balance: "Haut",
    surface: "Carbon 3K",
    core: "Hard EVA",
    antivib: "Auxetic 2.0",
    price: "350-420\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 7.5,
      Maniabilit\u00E9: 5,
      Tol\u00E9rance: 5
    },
    verdict: "Diamant ultime de Head. La plus puissante de la gamme avec carbone premium et EVA dure. Pour les attaquants d'\xE9lite exclusivement."
  },
  {
    id: "head-delta-pro-2026",
    name: "Head Delta Pro 2026",
    shortName: "Delta Pro 26",
    brand: "Head",
    shape: "Diamant",
    weight: "365-380g",
    balance: "Haut",
    surface: "Carbon 3K",
    core: "Power foam",
    antivib: "Auxetic 2.0",
    price: "300-380\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 7.5,
      Maniabilit\u00E9: 5.5,
      Tol\u00E9rance: 5
    },
    verdict: "Diamant ultra-offensive. Puissance maximale avec Power Foam et balance haute. R\xE9serv\xE9e aux attaquants confirm\xE9s avec bonne technique."
  },
  {
    id: "head-elite-ltd-2026",
    name: "Head Elite LTD 2026",
    shortName: "Elite LTD 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355g",
    balance: "Moyen",
    surface: "Hybrid Woven",
    core: "Power Foam",
    antivib: "Auxetic 2.0",
    price: "250-300\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Confort: 7.5,
      Spin: 7.5,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 7.5
    },
    verdict: "\xC9dition limit\xE9e 25\xE8me anniversaire Head Padel (1000 exemplaires). Polyvalente avec technologies modernes dans un design r\xE9tro ann\xE9es 80. Collector."
  },
  {
    id: "head-evo-extreme-2026",
    name: "Head Evo Extreme 2026",
    shortName: "Evo Extreme 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "340-360g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "EVA Soft",
    antivib: "Graphene 360+",
    price: "70-100\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 7,
      Confort: 9,
      Spin: 5,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette r\xE9cr\xE9ative ultra-accessible. Grand sweet spot, puissance facile et maximum de confort pour d\xE9buter sereinement et prendre du plaisir."
  },
  {
    name: "Head Extreme Motion 2026",
    shortName: "Extreme Motion 26",
    brand: "Head",
    shape: "Diamant",
    weight: "355g",
    balance: "Haute (268mm)",
    surface: "Carbone UD + Auxetic",
    core: "Power Foam",
    antivib: true,
    price: "220-280\u20AC",
    player: "Avanc\xE9 offensif",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 6,
      Maniabilit\u00E9: 6.5,
      Confort: 6.5,
      Spin: 8,
      Tol\u00E9rance: 6
    },
    verdict: "Extreme all\xE9g\xE9e. Diamant offensif + Auxetic pour punch et maniabilit\xE9. Vitesse de bras.",
    id: "head-extreme-motion-2026"
  },
  {
    name: "Head Extreme One 2026",
    shortName: "Extreme One 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "345g",
    balance: "Moyenne (262mm)",
    surface: "Carbone 2D + Extreme Spin",
    core: "Power Foam",
    antivib: true,
    price: "130-180\u20AC",
    player: "Interm\xE9diaire polyvalent",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 7.5,
      Spin: 7,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Plus l\xE9g\xE8re des Extreme. Goutte d'eau maniable avec carbone 2D. Bonne entr\xE9e gamme Extreme.",
    id: "head-extreme-one-2026"
  },
  {
    id: "head-extreme-pro-2026",
    name: "Head Extreme Pro 2026",
    shortName: "Extreme Pro 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon 3K",
    core: "Power foam",
    antivib: "Auxetic 2.0 + Innegra",
    price: "280-350\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "La r\xE9f\xE9rence polyvalente pour joueurs avanc\xE9s. Double anti-vibrations Auxetic+Innegra avec mousse Power Foam pour une frappe pr\xE9cise et puissante."
  },
  {
    name: "Head Extreme Team 2026",
    shortName: "Extreme Team 26",
    brand: "Head",
    shape: "Diamant",
    weight: "360g",
    balance: "Haute (268mm)",
    surface: "Fibre de verre + Extreme Spin",
    core: "Power Foam",
    antivib: true,
    price: "150-200\u20AC",
    player: "Interm\xE9diaire offensif",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 6.5,
      Maniabilit\u00E9: 5,
      Confort: 9,
      Spin: 6.5,
      Tol\u00E9rance: 6
    },
    verdict: "Diamant accessible avec fibre de verre pour tol\xE9rance. Puissance offensive pardonnante.",
    id: "head-extreme-team-2026"
  },
  {
    name: "Head Gravity Motion 2026",
    shortName: "Gravity Motion 26",
    brand: "Head",
    shape: "Ronde",
    weight: "355g",
    balance: "Moyenne (265mm)",
    surface: "Fibre de verre + Auxetic 2.0",
    core: "Control Foam",
    antivib: true,
    price: "170-220\u20AC",
    player: "Interm\xE9diaire contr\xF4le",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 9,
      Spin: 6.5,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 9
    },
    verdict: "Gravity all\xE9g\xE9e. Ronde fibre de verre pour sweet spot large et toucher doux.",
    id: "head-gravity-motion-2026"
  },
  {
    name: "Head Gravity Pro 2026",
    shortName: "Gravity Pro 26",
    brand: "Head",
    shape: "Ronde",
    weight: "365g",
    balance: "Moyenne (265mm)",
    surface: "Carbone Hybrid Woven + Auxetic 2.0",
    core: "Control Foam",
    antivib: true,
    price: "230-290\u20AC",
    player: "Avanc\xE9 d\xE9fensif-contr\xF4le",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 9,
      Confort: 8,
      Spin: 7,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8.5
    },
    verdict: "Reine du contr\xF4le Head. Ronde Hybrid Woven pour stabilit\xE9 et toucher premium.",
    id: "head-gravity-pro-2026"
  },
  {
    name: "Head Gravity Team 2026",
    shortName: "Gravity Team 26",
    brand: "Head",
    shape: "Ronde",
    weight: "360g",
    balance: "Moyenne (265mm)",
    surface: "Fibre de verre + Auxetic 2.0",
    core: "Control Foam",
    antivib: true,
    price: "140-180\u20AC",
    player: "Interm\xE9diaire",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6.5,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 8.5
    },
    verdict: "Contr\xF4le confortable. Fibre de verre + Auxetic 2.0 pour tol\xE9rance maximale.",
    id: "head-gravity-team-2026"
  },
  {
    name: "Head Gravity Team Light 2026",
    shortName: "Gravity Team Lt 26",
    brand: "Head",
    shape: "Ronde",
    weight: "340g",
    balance: "Moyenne-haute (270mm)",
    surface: "Fibre de verre",
    core: "Control Foam",
    antivib: true,
    price: "100-140\u20AC",
    player: "D\xE9butant",
    imageUrl: "",
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 5,
      Contr\u00F4le: 8,
      Confort: 9.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Ultra-l\xE9g\xE8re 340g. Ronde pardonnante pour d\xE9buter sans fatigue.",
    id: "head-gravity-team-light-2026"
  },
  {
    name: "Head Radical Motion 2026",
    shortName: "Radical Motion 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355g",
    balance: "Moyenne-basse (260mm)",
    surface: "Carbone 3K + Auxetic 2.0",
    core: "Control Foam",
    antivib: true,
    price: "230-290\u20AC",
    player: "Avanc\xE9 contr\xF4le rapide",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Maniabilit\u00E9: 7,
      Confort: 8,
      Spin: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Radical all\xE9g\xE9e pour joueurs techniques rapides. Pr\xE9cision + maniabilit\xE9.",
    id: "head-radical-motion-2026"
  },
  {
    name: "Head Radical Pro 2026",
    shortName: "Radical Pro 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "370g",
    balance: "Moyenne-basse (260mm)",
    surface: "Carbone 3K Double + Auxetic 2.0",
    core: "Control Foam",
    antivib: true,
    price: "280-350\u20AC",
    player: "Expert contr\xF4le-puissance",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Confort: 7,
      Spin: 8,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Flagship contr\xF4le Head 2026. 3K carbon + balance basse pour pr\xE9cision chirurgicale.",
    id: "head-radical-pro-2026"
  },
  {
    name: "Head Radical Team 2026",
    shortName: "Radical Team 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "365g",
    balance: "Basse (255mm)",
    surface: "Fibre de verre + Auxetic",
    core: "Control Foam",
    antivib: true,
    price: "180-230\u20AC",
    player: "Interm\xE9diaire-Avanc\xE9 contr\xF4le",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8,
      Spin: 7,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 8
    },
    verdict: "Contr\xF4le accessible. Fibre de verre + balance tr\xE8s basse pour maniabilit\xE9 max.",
    id: "head-radical-team-2026"
  },
  {
    name: "Head Radical Team Light 2026",
    shortName: "Radical Team Lt 26",
    brand: "Head",
    shape: "Ronde",
    weight: "350g",
    balance: "Basse (255mm)",
    surface: "Fibre de verre",
    core: "Control Foam",
    antivib: true,
    price: "130-170\u20AC",
    player: "D\xE9butant-Interm\xE9diaire",
    imageUrl: "",
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 7.5,
      Confort: 9,
      Spin: 6.5,
      Maniabilit\u00E9: 9,
      Tol\u00E9rance: 8.5
    },
    verdict: "Plus l\xE9g\xE8re Radical. Ronde + fibre de verre + balance basse = confort et contr\xF4le pour d\xE9buter.",
    id: "head-radical-team-light-2026"
  },
  {
    name: "Head Speed Motion 2026",
    shortName: "Speed Motion 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "355g",
    balance: "Moyenne (265mm)",
    surface: "Carbone Hybrid Woven + Auxetic 2.0",
    core: "Power Foam",
    antivib: true,
    price: "230-290\u20AC",
    player: "Avanc\xE9 polyvalent",
    imageUrl: "",
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Confort: 7.5,
      Spin: 7.5,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Polyvalente rapide. Hybrid Woven pour toucher pr\xE9cis. Couteau suisse Head 2026.",
    id: "head-speed-motion-2026"
  },
  {
    name: "Head Speed One X 2026",
    shortName: "Speed One X 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "350g",
    balance: "Moyenne (262mm)",
    surface: "Carbone 2D + DAMP+",
    core: "Power Foam",
    antivib: true,
    price: "160-210\u20AC",
    player: "Interm\xE9diaire confort",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Confort: 8,
      Spin: 7,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 7.5
    },
    verdict: "Confort maximal gamme Speed. DAMP+ pour absorption vibrations. Bras sensibles.",
    id: "head-speed-one-x-2026"
  },
  {
    id: "head-speed-pro-2026",
    name: "Head Speed Pro 2026",
    shortName: "Speed Pro 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Moyen",
    surface: "Carbon 3K",
    core: "Standard EVA",
    antivib: "Innegra",
    price: "250-310\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Confort: 6.5,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Raquette de vitesse avec excellent contr\xF4le. Le carbone 3K offre de la pr\xE9cision, l'Innegra prot\xE8ge le bras. Pour les joueurs techniques."
  },
  {
    name: "Head Speed Team 2026",
    shortName: "Speed Team 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "360g",
    balance: "Moyenne (265mm)",
    surface: "Fibre de verre + 3D Grain",
    core: "Power Foam",
    antivib: true,
    price: "150-200\u20AC",
    player: "Interm\xE9diaire polyvalent",
    imageUrl: "",
    year: 2026,
    category: "intermediaire",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8.5,
      Maniabilit\u00E9: 7,
      Confort: 8.5,
      Spin: 7.5,
      Tol\u00E9rance: 7
    },
    verdict: "Polyvalente confortable. Fibre de verre + Power Foam pour tol\xE9rance. Bonne all-rounder.",
    id: "head-speed-team-2026"
  },
  {
    id: "head-vibe-2026",
    name: "Head Vibe 2026",
    shortName: "Vibe 26",
    brand: "Head",
    shape: "Goutte d'eau",
    weight: "345-355g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "EVA Soft",
    antivib: "Graphene 360+",
    price: "70-100\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "debutant",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 7,
      Confort: 9,
      Spin: 5,
      Maniabilit\u00E9: 8.5,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette d\xE9butant polyvalente et l\xE9g\xE8re. Grand sweet spot et confort maximal pour d\xE9couvrir le padel en confiance."
  },
  {
    id: "nox-ml10-pro-cup-2024",
    name: "Nox ML10 Pro Cup 2024",
    shortName: "ML10 PC 24",
    brand: "Nox",
    shape: "Ronde",
    weight: "360-375g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "90-130\u20AC",
    player: "Miguel Lamperti",
    imageUrl: null,
    year: 2024,
    category: "intermediaire",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 7.5,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 9
    },
    verdict: "La ML10 2024, toujours aussi fiable. Contr\xF4le et tol\xE9rance exceptionnels \xE0 prix doux en fin de s\xE9rie."
  },
  {
    id: "nox-at10-genius-18k-2025",
    name: "Nox AT10 Genius 18K 2025",
    shortName: "AT10 18K",
    brand: "Nox",
    shape: "Ronde",
    weight: "365-375g",
    balance: "Moyen",
    surface: "Carbon 18K",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "280-370\u20AC",
    player: "Agust\xEDn Tapia",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8.5,
      Confort: 5.5,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 8
    },
    verdict: "La raquette d'Agust\xEDn Tapia version pro. Carbone 18K rigide pour une sortie de balle nette. Contr\xF4le exceptionnel mais confort limit\xE9."
  },
  {
    id: "nox-at10-genius-2025",
    name: "Nox AT10 Genius 2025",
    shortName: "AT10 Genius 25",
    brand: "Nox",
    shape: "Ronde",
    weight: "360-375g",
    balance: "Moyen",
    surface: "Hybrid carbon/fiberglass",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "170-230\u20AC",
    player: "Agust\xEDn Tapia",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8.5,
      Confort: 7,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 8.5
    },
    verdict: "La raquette d'Agust\xEDn Tapia en version interm\xE9diaire. Forme ronde pour un contr\xF4le exceptionnel et une grande tol\xE9rance."
  },
  {
    id: "nox-at10-genius-jr-2025",
    name: "Nox AT10 Genius Junior 2025",
    shortName: "AT10 Genius Jr",
    brand: "Nox",
    shape: "Ronde",
    weight: "300-325g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "60-70\u20AC",
    player: "Agust\xEDn Tapia",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Version junior de la raquette d'Agust\xEDn Tapia. Forme ronde tr\xE8s tol\xE9rante, id\xE9ale pour d\xE9velopper la technique et le contr\xF4le."
  },
  {
    id: "nox-at10-genius-luxury-2025",
    name: "Nox AT10 Genius Luxury 2025",
    shortName: "AT10 Luxury",
    brand: "Nox",
    shape: "Ronde",
    weight: "365-380g",
    balance: "Moyen",
    surface: "Carbon 18K",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "330-420\u20AC",
    player: "Agust\xEDn Tapia",
    imageUrl: null,
    year: 2025,
    category: "expert",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8.5,
      Confort: 5,
      Spin: 6,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 8
    },
    verdict: "La raquette de match d'Agust\xEDn Tapia. Carbone 18K ultra-rigide pour une sortie de balle chirurgicale. Contr\xF4le d'exception mais bras en acier requis."
  },
  {
    id: "nox-ml10-pro-cup-2025",
    name: "Nox ML10 Pro Cup 2025",
    shortName: "ML10 Pro Cup",
    brand: "Nox",
    shape: "Ronde",
    weight: "360-375g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "120-160\u20AC",
    player: "Miguel Lamperti",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 7.5,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 9
    },
    verdict: "L'iconique ML10, raquette la plus vendue au monde. Contr\xF4le et tol\xE9rance exceptionnels, fiable pour les joueurs de tous niveaux."
  },
  {
    id: "nox-ml10-beginner-2025",
    name: "Nox ML10 Pro Cup Beginner 2025",
    shortName: "ML10 Beginner",
    brand: "Nox",
    shape: "Ronde",
    weight: "355-365g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "50-75\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 9
    },
    verdict: "Version d\xE9butant de l'iconique ML10. Le choix classique et \xE9prouv\xE9 pour d\xE9buter le padel."
  },
  {
    id: "nox-ml10-jr-2025",
    name: "Nox ML10 Pro Cup Junior 2025",
    shortName: "ML10 Jr 25",
    brand: "Nox",
    shape: "Ronde",
    weight: "310-325g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "50-70\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Version junior de l'iconique ML10. Forme ronde ultra-tol\xE9rante, parfaite pour les premiers pas sur le court."
  },
  {
    id: "nox-nerbo-wpt-2025",
    name: "Nox Nerbo WPT 2025",
    shortName: "Nerbo WPT",
    brand: "Nox",
    shape: "Diamant",
    weight: "365-380g",
    balance: "Haut",
    surface: "Carbon",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "250-330\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 5,
      Spin: 6,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5
    },
    verdict: "Diamant de comp\xE9tition Nox. Puissance brute maximale. Pour les joueurs confirm\xE9s avec technique irr\xE9prochable."
  },
  {
    id: "nox-at10-luxury-genius-12k-xtrem-2026",
    name: "Nox AT10 Luxury Genius 12K Alum Xtrem 2026",
    shortName: "AT10 12K Xtrem 26",
    brand: "Nox",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Moyen-Haut",
    surface: "Carbon 12K Aluminis\xE9 Xtrem",
    core: "EVA HR3 Black",
    antivib: "Pulse System + EOS Tunnel",
    price: "280-350\u20AC",
    player: "Agust\xEDn Tapia",
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 8.5,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 6.5
    },
    verdict: "Version plus rigide du AT10. 12K Xtrem pour frappe plus s\xE8che et puissante. Toucher dur et r\xE9actif pour joueurs offensifs techniques."
  },
  {
    id: "nox-at10-luxury-genius-12k-xtrem-lite-2026",
    name: "Nox AT10 Luxury Genius 12K Xtrem Lite 2026",
    shortName: "AT10 12K Lite 26",
    brand: "Nox",
    shape: "Goutte d'eau",
    weight: "355-365g",
    balance: "Moyen",
    surface: "Carbon 12K Aluminis\xE9 Xtrem",
    core: "EVA HR4 White",
    antivib: "Pulse System + EOS Tunnel",
    price: "250-310\u20AC",
    player: "Agust\xEDn Tapia",
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7.5,
      Confort: 7.5,
      Spin: 8,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 7
    },
    verdict: "AT10 all\xE9g\xE9e pour maniabilit\xE9. M\xEAme qualit\xE9 Tapia avec moins de fatigue. Id\xE9ale joueuses ou joueurs techniques cherchant r\xE9activit\xE9 et confort."
  },
  {
    name: "Nox AT10 Luxury Genius 18K Alum 2026",
    shortName: "AT10 18K 26",
    brand: "Nox",
    shape: "Goutte d'eau",
    weight: "370g",
    balance: "Moyenne (265mm)",
    surface: "Carbone 18K Aluminis\xE9 + Dual Spin",
    core: "MultiEva",
    antivib: true,
    price: "350-420\u20AC",
    player: "Expert polyvalent",
    imageUrl: "",
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 7.5,
      Confort: 6.5,
      Spin: 8.5,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 6.5
    },
    verdict: "Raquette Agust\xEDn Tapia. 18K Aluminis\xE9 + Dual Spin. R\xE9f\xE9rence polyvalente expert.",
    id: "nox-at10-luxury-genius-18k-alum-2026"
  },
  {
    id: "nox-at10-luxury-attack-12k-xtrem-2026",
    name: "Nox AT10 Luxury Genius Attack 12K Xtrem 2026",
    shortName: "AT10 Attack 26",
    brand: "Nox",
    shape: "Diamant",
    weight: "360-375g",
    balance: "Haut",
    surface: "Carbon 12K Aluminis\xE9 Xtrem",
    core: "EVA HR3 Black",
    antivib: "Pulse System + EOS Tunnel",
    price: "300-370\u20AC",
    player: "Agust\xEDn Tapia",
    imageUrl: null,
    year: 2026,
    category: "expert",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 6,
      Confort: 5.5,
      Spin: 8.5,
      Maniabilit\u00E9: 5.5,
      Tol\u00E9rance: 5
    },
    verdict: "Version diamant offensive maximale de la gamme AT10. Puissance explosive pour joueurs de gauche experts. Dual Spin pour spin d\xE9vastateur."
  },
  {
    id: "nox-ventus-2026",
    name: "Nox Ventus 2026",
    shortName: "Ventus 26",
    brand: "Nox",
    shape: "Hybride",
    weight: "360-370g",
    balance: "Moyen",
    surface: "Carbon 12K",
    core: "EVA HR3",
    antivib: "Pulse System",
    price: "220-280\u20AC",
    player: null,
    imageUrl: null,
    year: 2026,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Confort: 7.5,
      Spin: 7.5,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Nouvelle gamme hybride polyvalente Nox. Bon \xE9quilibre puissance/contr\xF4le pour joueurs avanc\xE9s qui ne sont pas purement offensifs."
  },
  {
    id: "siux-electra-st3-jr-2024",
    name: "Siux Electra ST3 Junior 2024",
    shortName: "Electra ST3 Jr",
    brand: "Siux",
    shape: "Ronde",
    weight: "320g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "60-70\u20AC",
    player: "Franco Stupaczuk",
    imageUrl: null,
    year: 2024,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Version junior de la raquette de Franco Stupaczuk. Forme ronde tr\xE8s tol\xE9rante, construction fibre de verre l\xE9g\xE8re et durable pour l'apprentissage."
  },
  {
    id: "siux-beat-junior-2025",
    name: "Siux Beat Junior 2025",
    shortName: "Beat Junior 25",
    brand: "Siux",
    shape: "Ronde",
    weight: "300-330g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "53-75\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette junior accessible et tr\xE8s tol\xE9rante. Prix attractif pour une premi\xE8re raquette, construction solide en fibre de verre."
  },
  {
    id: "siux-diablo-black-2025",
    name: "Siux Diablo Black Carbon 2025",
    shortName: "Diablo Black",
    brand: "Siux",
    shape: "Goutte d'eau",
    weight: "370-380g",
    balance: "Mi-haut",
    surface: "Carbon 12K",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "280-360\u20AC",
    player: "Franco Stupaczuk",
    imageUrl: null,
    year: 2025,
    category: "expert",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7,
      Confort: 5,
      Spin: 7.5,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 6.5
    },
    verdict: "Raquette de Stupaczuk version comp\xE9tition. Carbone 12K rigide avec surface textur\xE9e pour spin+puissance. Experte et exigeante."
  },
  {
    id: "siux-diablo-revolution-2025",
    name: "Siux Diablo Revolution 2025",
    shortName: "Diablo Revol",
    brand: "Siux",
    shape: "Goutte d'eau",
    weight: "360-370g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "150-200\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Goutte d'eau avec surface textur\xE9e pour un bon spin. Le carbone offre de la r\xE9activit\xE9 pour les joueurs cherchant plus de mordant."
  },
  {
    id: "siux-diablo-xtrem-2025",
    name: "Siux Diablo Xtrem Carbon 2025",
    shortName: "Diablo Xtrem",
    brand: "Siux",
    shape: "Diamant",
    weight: "365-380g",
    balance: "Haut",
    surface: "Carbon 12K",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "220-300\u20AC",
    player: "Franco Stupaczuk",
    imageUrl: null,
    year: 2025,
    category: "expert",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 5.5,
      Confort: 4.5,
      Spin: 6,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 5
    },
    verdict: "Diamant extr\xEAme pour purs attaquants. Carbone 12K + EVA dure = sortie de balle explosive. Confort minimal, r\xE9serv\xE9e aux experts."
  },
  {
    id: "siux-optimus-2025",
    name: "Siux Optimus 2025",
    shortName: "Optimus 25",
    brand: "Siux",
    shape: "Ronde",
    weight: "355-365g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "50-65\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 9
    },
    verdict: "Entr\xE9e de gamme Siux abordable. Le strict n\xE9cessaire pour d\xE9buter le padel sans se ruiner."
  },
  {
    id: "siux-diablo-elite-26",
    brand: "Siux",
    name: "Siux Diablo Elite 6 2026",
    shortName: "Diablo Elite 6 26",
    year: 2026,
    category: "intermediaire",
    shape: "Goutte d'eau",
    weight: "355-375",
    balance: "moyen",
    surface: "3K Carbon",
    core: "EVA",
    priceRange: "180-230\u20AC",
    description: "Goutte interm\xE9diaire-avanc\xE9. Plus souple que le Pro, contr\xF4le et confort accrus. Progression Siux.",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 7.5,
      Maniabilit\u00E9: 8,
      Confort: 8,
      Spin: 7,
      Tol\u00E9rance: 7.5
    },
    imageUrl: null
  },
  {
    id: "siux-diablo-pro-26",
    brand: "Siux",
    name: "Siux Diablo Pro 2026",
    shortName: "Diablo Pro 26",
    year: 2026,
    category: "avance",
    shape: "Goutte d'eau",
    weight: "355-375",
    balance: "moyen",
    surface: "18K TeXtreme + 3K Carbon",
    core: "Ultra Soft EVA",
    priceRange: "300-350\u20AC",
    description: "Goutte hybride polyvalente signature Libaak. Texture 3D + Ultra Soft EVA. Contr\xF4le-puissance \xE9quilibr\xE9.",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Maniabilit\u00E9: 7.5,
      Confort: 8,
      Spin: 8,
      Tol\u00E9rance: 7
    },
    imageUrl: null
  },
  {
    id: "siux-electra-pro-26",
    brand: "Siux",
    name: "Siux Electra Pro 2026",
    shortName: "Electra Pro 26",
    year: 2026,
    category: "expert",
    shape: "Goutte d'eau",
    weight: "355-375",
    balance: "moyen-haut",
    surface: "18K TeXtreme Carbon",
    core: "EVA",
    priceRange: "300-350\u20AC",
    description: "Goutte signature Stupaczuk. Anti-vibration + TeXtreme 18K. Puissance explosive avec polyvalence.",
    scores: {
      Puissance: 8.5,
      Contr\u00F4le: 7.5,
      Maniabilit\u00E9: 7,
      Confort: 7,
      Spin: 8,
      Tol\u00E9rance: 6.5
    },
    imageUrl: null
  },
  {
    id: "siux-fenix-pro-26",
    brand: "Siux",
    name: "Siux Fenix Pro 2026",
    shortName: "Fenix Pro 26",
    year: 2026,
    category: "expert",
    shape: "Diamant",
    weight: "360-380",
    balance: "haut",
    surface: "18K TeXtreme Carbon",
    core: "Hard EVA",
    priceRange: "300-350\u20AC",
    description: "Diamant puissance max signature Augsburger. Balance haute + carbone TeXtreme. Offensif pur.",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 6,
      Maniabilit\u00E9: 5.5,
      Confort: 5.5,
      Spin: 7.5,
      Tol\u00E9rance: 5
    },
    imageUrl: null
  },
  {
    id: "siux-pegasus-elite-26",
    brand: "Siux",
    name: "Siux Pegasus Elite 4 2026",
    shortName: "Pegasus Elite 4 26",
    year: 2026,
    category: "intermediaire",
    shape: "Goutte d'eau",
    weight: "355-375",
    balance: "moyen",
    surface: "3K Carbon",
    core: "EVA",
    priceRange: "180-230\u20AC",
    description: "Goutte polyvalente abordable. Contr\xF4le hybride et confort. Pour joueurs interm\xE9diaires ambitieux.",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 7.5,
      Maniabilit\u00E9: 7.5,
      Confort: 8,
      Spin: 7,
      Tol\u00E9rance: 7.5
    },
    imageUrl: null
  },
  {
    id: "siux-pegasus-pro-26",
    brand: "Siux",
    name: "Siux Pegasus Pro 2026",
    shortName: "Pegasus Pro 26",
    year: 2026,
    category: "avance",
    shape: "Goutte d'eau",
    weight: "355-375",
    balance: "moyen-haut",
    surface: "18K TeXtreme Carbon",
    core: "EVA",
    priceRange: "300-350\u20AC",
    description: "Goutte premium offensive. TeXtreme 18K + texture satin 3D. Puissance avec pr\xE9cision pour avanc\xE9s.",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7.5,
      Maniabilit\u00E9: 7,
      Confort: 7,
      Spin: 8,
      Tol\u00E9rance: 6.5
    },
    imageUrl: null
  },
  {
    id: "siux-valkiria-pro-26",
    brand: "Siux",
    name: "Siux Valkiria Pro 2026",
    shortName: "Valkiria Pro 26",
    year: 2026,
    category: "avance",
    shape: "Goutte d'eau",
    weight: "345-365",
    balance: "moyen",
    surface: "18K TeXtreme Carbon",
    core: "EVA",
    priceRange: "280-350\u20AC",
    description: "Goutte signature Araujo, orientation f\xE9minine. Polyvalence puissance/contr\xF4le, poids mod\xE9r\xE9 pour maniabilit\xE9.",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 8,
      Maniabilit\u00E9: 8,
      Confort: 7.5,
      Spin: 7.5,
      Tol\u00E9rance: 7
    },
    imageUrl: null
  },
  {
    id: "starvie-junior-2025",
    name: "Starvie Junior 2025",
    shortName: "Starvie Jr 25",
    brand: "Starvie",
    shape: "Ronde",
    weight: "<330g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "80-90\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 8.5
    },
    verdict: "Raquette junior confortable et tol\xE9rante. Construction fibre de verre souple pour un apprentissage sans fatigue."
  },
  {
    id: "starvie-metheora-galaxy-2025",
    name: "Starvie Metheora Galaxy 2025",
    shortName: "Metheora Galaxy",
    brand: "Starvie",
    shape: "Goutte d'eau",
    weight: "365-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "250-320\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 7.5,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Goutte d'eau haut de gamme Starvie avec surface textur\xE9e pour le spin. Polyvalente et technique pour joueurs avanc\xE9s."
  },
  {
    id: "starvie-metheora-2025",
    name: "Starvie Metheora Warrior 2025",
    shortName: "Metheora",
    brand: "Starvie",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Moyen",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "140-180\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Goutte d'eau Starvie polyvalente. Construction carbone/EVA classique pour un jeu \xE9quilibr\xE9."
  },
  {
    id: "starvie-raptor-2025",
    name: "Starvie Raptor 2025",
    shortName: "Raptor 25",
    brand: "Starvie",
    shape: "Ronde",
    weight: "355-365g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "60-80\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 9
    },
    verdict: "Ronde Starvie confortable et tol\xE9rante. Id\xE9ale pour les joueurs occasionnels qui veulent du plaisir sans effort."
  },
  {
    id: "starvie-black-titan-26",
    brand: "Starvie",
    name: "StarVie Black Titan 2026",
    shortName: "Black Titan 26",
    year: 2026,
    category: "expert",
    shape: "Hybride",
    weight: "360-380",
    balance: "moyen-haut",
    surface: "24K Carbon Master",
    core: "H-EVA Power",
    priceRange: "240-300\u20AC",
    description: "Hybride flagship puissance. 24K Carbon Master + Dynamic Star ajustable. Anti-Vibe. Pour experts offensifs.",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 6.5,
      Confort: 6.5,
      Spin: 8,
      Tol\u00E9rance: 6
    },
    imageUrl: null
  },
  {
    id: "starvie-raptor-26",
    brand: "Starvie",
    name: "StarVie Raptor 2026",
    shortName: "Raptor 26",
    year: 2026,
    category: "avance",
    shape: "Goutte d'eau",
    weight: "355-375",
    balance: "moyen",
    surface: "3D Carbon",
    core: "M-EVA Balance",
    priceRange: "200-260\u20AC",
    description: "Goutte polyvalente iconique renouvel\xE9e. Dynamic Star + Spin Boost Tech Pro + Anti-Vibe. All-court avanc\xE9.",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Maniabilit\u00E9: 7.5,
      Confort: 7.5,
      Spin: 8,
      Tol\u00E9rance: 7.5
    },
    imageUrl: null
  },
  {
    id: "starvie-triton-balance-26",
    brand: "Starvie",
    name: "StarVie Triton Balance 2026",
    shortName: "Triton Balance 26",
    year: 2026,
    category: "avance",
    shape: "Diamant",
    weight: "360-375",
    balance: "moyen",
    surface: "18K Carbon Hybrid",
    core: "M-EVA Balance",
    priceRange: "200-260\u20AC",
    description: "Diamant \xE9quilibr\xE9e. Plus souple que Power, bon compromis puissance/contr\xF4le. TriTech Core + Z-Shock.",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 6.5,
      Confort: 7,
      Spin: 7.5,
      Tol\u00E9rance: 6.5
    },
    imageUrl: null
  },
  {
    id: "starvie-triton-power-26",
    brand: "Starvie",
    name: "StarVie Triton Power 2026",
    shortName: "Triton Power 26",
    year: 2026,
    category: "expert",
    shape: "Diamant",
    weight: "360-380",
    balance: "haut",
    surface: "18K Carbon Hybrid",
    core: "H-EVA Power",
    priceRange: "220-280\u20AC",
    description: "Diamant puissance explosive. 18K Carbon Hybrid + H-EVA Power haute densit\xE9 + TriTech Core. Attaquant pur.",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 6,
      Maniabilit\u00E9: 5.5,
      Confort: 5.5,
      Spin: 7.5,
      Tol\u00E9rance: 5
    },
    imageUrl: null
  },
  {
    id: "varlion-bourne-2025",
    name: "Varlion Bourne Carbon 2025",
    shortName: "Bourne Carbon",
    brand: "Varlion",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Moyen",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "140-180\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 7,
      Tol\u00E9rance: 7
    },
    verdict: "Goutte d'eau carbone Varlion. Construction solide et \xE9quilibr\xE9e pour les joueurs interm\xE9diaires polyvalents."
  },
  {
    id: "varlion-canas-jr-2025",
    name: "Varlion Ca\xF1as Junior 2025",
    shortName: "Ca\xF1as Junior",
    brand: "Varlion",
    shape: "Ronde",
    weight: "310-320g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "55-75\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette junior Varlion, marque historique du padel. Forme ronde classique pour un apprentissage confortable et progressif."
  },
  {
    id: "varlion-canas-w-2025",
    name: "Varlion Ca\xF1as W 2025",
    shortName: "Ca\xF1as W 25",
    brand: "Varlion",
    shape: "Ronde",
    weight: "350-360g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "60-80\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 9,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 8,
      Tol\u00E9rance: 9
    },
    verdict: "Version all\xE9g\xE9e de la Ca\xF1as, parfaite pour d\xE9buter. Marque historique du padel, construction fiable et confortable."
  },
  {
    id: "varlion-lw-carbon-2025",
    name: "Varlion Lethal Weapon Carbon 2025",
    shortName: "LW Carbon 25",
    brand: "Varlion",
    shape: "Goutte d'eau",
    weight: "365-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "220-290\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Goutte d'eau Varlion haut de gamme. Construction carbone traditionnelle pour joueurs avanc\xE9s polyvalents."
  },
  {
    id: "varlion-bourne-carbon-ti-26",
    brand: "Varlion",
    name: "Varlion Bourne Carbon Ti 2026",
    shortName: "Bourne C.Ti 26",
    year: 2026,
    category: "avance",
    shape: "Hybride",
    weight: "355-375",
    balance: "moyen-haut",
    surface: "Carbon + Titanium",
    core: "Pro-Touch EVA",
    priceRange: "180-250\u20AC",
    description: "Hybride Bourne puissance/contr\xF4le. Prisma Frame + Summum grip long 14.5cm. Polyvalence offensive.",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 7,
      Confort: 7,
      Spin: 7.5,
      Tol\u00E9rance: 6.5
    },
    imageUrl: null
  },
  {
    id: "varlion-lw-orquidea-26",
    brand: "Varlion",
    name: "Varlion LW 8.8 Orquidea 2026",
    shortName: "LW Orquidea 26",
    year: 2026,
    category: "debutant",
    shape: "Ronde",
    weight: "340-360",
    balance: "bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    priceRange: "60-100\u20AC",
    description: "Ronde d\xE9butante confort. Ergoholes sweet spot \xE9largi + Handlesafety. L\xE9g\xE8re et tol\xE9rante.",
    scores: {
      Puissance: 4,
      Contr\u00F4le: 8,
      Maniabilit\u00E9: 9,
      Confort: 9.5,
      Spin: 5,
      Tol\u00E9rance: 9
    },
    imageUrl: null
  },
  {
    id: "varlion-lw-carbon-ti-26",
    brand: "Varlion",
    name: "Varlion LW Carbon Ti 2026",
    shortName: "LW Carbon Ti 26",
    year: 2026,
    category: "avance",
    shape: "Ronde",
    weight: "355-375",
    balance: "bas",
    surface: "Carbon + Titanium",
    core: "Pro-Touch EVA",
    priceRange: "180-250\u20AC",
    description: "Ronde contr\xF4le Lethal Weapon. Summum grip + Slice Texture. Pr\xE9cision d\xE9fensive pour tacticiens.",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 9,
      Maniabilit\u00E9: 7.5,
      Confort: 7.5,
      Spin: 7.5,
      Tol\u00E9rance: 8.5
    },
    imageUrl: null
  },
  {
    id: "vermont-origin-jr-2025",
    name: "Vermont Origin Junior 2025",
    shortName: "Origin Jr 25",
    brand: "Vermont",
    shape: "Ronde",
    weight: "326g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "50-70\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 5.5,
      Contr\u00F4le: 8.5,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 9
    },
    verdict: "Raquette junior d'entr\xE9e de gamme tr\xE8s tol\xE9rante. Excellent rapport qualit\xE9/prix pour d\xE9buter sans se ruiner."
  },
  {
    id: "wilson-minions-jr-face-2024",
    name: "Wilson Minions Junior Face 2024",
    shortName: "Minions Jr Face",
    brand: "Wilson",
    shape: "Goutte d'eau",
    weight: "300g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "30-40\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2024,
    category: "junior",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 9.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Raquette junior entr\xE9e de gamme au design attractif. Construction fibre de verre simple mais efficace pour d\xE9buter. Excellent rapport qualit\xE9/prix."
  },
  {
    id: "wilson-bela-elite-pro-2025",
    name: "Wilson Bela Elite Pro V2 2025",
    shortName: "Bela Elite Pro",
    brand: "Wilson",
    shape: "Goutte d'eau",
    weight: "370-385g",
    balance: "Mi-haut",
    surface: "Carbon 12K",
    core: "Hard EVA",
    antivib: "\u2014",
    price: "300-380\u20AC",
    player: "Fernando Belastegu\xEDn",
    imageUrl: null,
    year: 2025,
    category: "expert",
    scores: {
      Puissance: 8,
      Contr\u00F4le: 7,
      Confort: 5,
      Spin: 6,
      Maniabilit\u00E9: 6,
      Tol\u00E9rance: 6.5
    },
    verdict: "Version comp\xE9tition de la raquette de Bela. Carbone 12K pour une frappe s\xE8che et pr\xE9cise. Exigeante physiquement."
  },
  {
    id: "wilson-bela-elite-v2-2025",
    name: "Wilson Bela Elite V2 2025",
    shortName: "Bela Elite V2",
    brand: "Wilson",
    shape: "Goutte d'eau",
    weight: "365-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "250-330\u20AC",
    player: "Fernando Belastegu\xEDn",
    imageUrl: null,
    year: 2025,
    category: "avance",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "La raquette de l\xE9gende de Bela en version \xE9lite. Goutte d'eau \xE9quilibr\xE9e pour les joueurs avanc\xE9s complets."
  },
  {
    id: "wilson-bela-pro-v2-2025",
    name: "Wilson Bela Pro V2 2025",
    shortName: "Bela Pro V2",
    brand: "Wilson",
    shape: "Goutte d'eau",
    weight: "360-375g",
    balance: "Mi-haut",
    surface: "Carbon",
    core: "Standard EVA",
    antivib: "\u2014",
    price: "180-240\u20AC",
    player: "Fernando Belastegu\xEDn",
    imageUrl: null,
    year: 2025,
    category: "intermediaire",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Confort: 6,
      Spin: 6,
      Maniabilit\u00E9: 6.5,
      Tol\u00E9rance: 7
    },
    verdict: "Raquette signature de la l\xE9gende Belastegu\xEDn. Bon compromis puissance/contr\xF4le mais confort limit\xE9 par le carbone. Pour interm\xE9diaires exigeants."
  },
  {
    id: "wilson-blade-jr-v2",
    name: "Wilson Blade Junior V2 2025",
    shortName: "Blade Jr V2",
    brand: "Wilson",
    shape: "Goutte d'eau",
    weight: "300g",
    balance: "Bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "79-102\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "junior",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 8,
      Confort: 8.5,
      Spin: 6,
      Maniabilit\u00E9: 10,
      Tol\u00E9rance: 7.5
    },
    verdict: "Ultra-l\xE9g\xE8re (300g) avec forme goutte d'eau pour un bon \xE9quilibre contr\xF4le/puissance. Fibre de verre confortable et tol\xE9rante pour l'apprentissage."
  },
  {
    id: "wilson-ultra-v2-2025",
    name: "Wilson Ultra V2 2025",
    shortName: "Ultra V2",
    brand: "Wilson",
    shape: "Goutte d'eau",
    weight: "355-365g",
    balance: "Moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    antivib: "\u2014",
    price: "60-85\u20AC",
    player: "\u2014",
    imageUrl: null,
    year: 2025,
    category: "debutant",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 8,
      Confort: 8,
      Spin: 6,
      Maniabilit\u00E9: 7.5,
      Tol\u00E9rance: 7.5
    },
    verdict: "Goutte d'eau Wilson accessible et polyvalente. Fibre de verre pour un bon confort de frappe."
  },
  {
    id: "wilson-accent-26",
    brand: "Wilson",
    name: "Wilson Accent 2026",
    shortName: "Accent 26",
    year: 2026,
    category: "debutant",
    shape: "Ronde",
    weight: "340-355",
    balance: "bas",
    surface: "Fiberglass",
    core: "Soft EVA",
    priceRange: "60-100\u20AC",
    description: "Ronde confort-first pour d\xE9butants. Fibre de verre + EVA souple. Timing facile, l\xE9g\xE8re, gateway Wilson.",
    scores: {
      Puissance: 4.5,
      Contr\u00F4le: 8,
      Maniabilit\u00E9: 9,
      Confort: 9.5,
      Spin: 5,
      Tol\u00E9rance: 9
    },
    imageUrl: null
  },
  {
    id: "wilson-bela-lt-v3-26",
    brand: "Wilson",
    name: "Wilson Bela LT V3 2026",
    shortName: "Bela LT V3 26",
    year: 2026,
    category: "intermediaire",
    shape: "Goutte d'eau",
    weight: "340-350",
    balance: "moyen",
    surface: "3K Carbon",
    core: "Power Foam EVA",
    priceRange: "180-250\u20AC",
    description: "Version all\xE9g\xE9e de la Bela V3. Maniabilit\xE9 accrue sans perdre le spin et la puissance. Id\xE9ale progression.",
    scores: {
      Puissance: 6.5,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 8.5,
      Confort: 8,
      Spin: 7.5,
      Tol\u00E9rance: 7.5
    },
    imageUrl: null
  },
  {
    id: "wilson-bela-pro-v3-26",
    brand: "Wilson",
    name: "Wilson Bela Pro V3 2026",
    shortName: "Bela Pro V3 26",
    year: 2026,
    category: "expert",
    shape: "Diamant",
    weight: "365-375",
    balance: "haut",
    surface: "24K Carbon",
    core: "Power Foam EVA",
    priceRange: "220-300\u20AC",
    description: "Diamant offensive signature Bela. C2 Tubular Construction + 24K Carbon + DuoGrid. Puissance max pour joueurs confirm\xE9s.",
    scores: {
      Puissance: 9,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 6,
      Confort: 6,
      Spin: 8,
      Tol\u00E9rance: 5.5
    },
    imageUrl: null
  },
  {
    id: "wilson-bela-v3-26",
    brand: "Wilson",
    name: "Wilson Bela V3 2026",
    shortName: "Bela V3 26",
    year: 2026,
    category: "avance",
    shape: "Goutte d'eau",
    weight: "360-370",
    balance: "moyen",
    surface: "3K Carbon",
    core: "Power Foam EVA",
    priceRange: "200-280\u20AC",
    description: "Goutte versatile co-design Bela. V-Bridge + Spin2 Texture + DuoGrid Holes. Polyvalence attaque/d\xE9fense.",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 7.5,
      Maniabilit\u00E9: 7,
      Confort: 7,
      Spin: 8,
      Tol\u00E9rance: 7
    },
    imageUrl: null
  },
  {
    id: "wilson-blade-pro-v2-26",
    brand: "Wilson",
    name: "Wilson Blade Pro V2 2026",
    shortName: "Blade Pro V2 26",
    year: 2026,
    category: "avance",
    shape: "Goutte d'eau",
    weight: "360-370",
    balance: "moyen",
    surface: "Carbon",
    core: "Soft EVA",
    priceRange: "200-280\u20AC",
    description: "Goutte toucher doux et pr\xE9cision. Dwell time long pour touches et d\xE9fenses. Polyvalence attaque/d\xE9fense.",
    scores: {
      Puissance: 7,
      Contr\u00F4le: 8,
      Maniabilit\u00E9: 7.5,
      Confort: 8,
      Spin: 7.5,
      Tol\u00E9rance: 7.5
    },
    imageUrl: null
  },
  {
    id: "wilson-blade-team-26",
    brand: "Wilson",
    name: "Wilson Blade Team 2026",
    shortName: "Blade Team 26",
    year: 2026,
    category: "intermediaire",
    shape: "Goutte d'eau",
    weight: "350-360",
    balance: "moyen",
    surface: "Fiberglass",
    core: "Soft EVA",
    priceRange: "100-150\u20AC",
    description: "Goutte polyvalente interm\xE9diaire. Feel doux et sweet spot tol\xE9rant. Transition vers jeu technique.",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 7,
      Maniabilit\u00E9: 8,
      Confort: 8.5,
      Spin: 6.5,
      Tol\u00E9rance: 8
    },
    imageUrl: null
  },
  {
    id: "wilson-prostaff-v2-26",
    brand: "Wilson",
    name: "Wilson Pro Staff V2 2026",
    shortName: "Pro Staff V2 26",
    year: 2026,
    category: "avance",
    shape: "Ronde",
    weight: "360-370",
    balance: "bas",
    surface: "Carbon",
    core: "Dense EVA",
    priceRange: "200-280\u20AC",
    description: "Ronde pr\xE9cision chirurgicale. Sweet spot central, r\xE9ponse crisp. Pour constructeurs de points tactiques.",
    scores: {
      Puissance: 6,
      Contr\u00F4le: 9,
      Maniabilit\u00E9: 7.5,
      Confort: 7,
      Spin: 7,
      Tol\u00E9rance: 8
    },
    imageUrl: null
  },
  {
    id: "wilson-ultra-pro-v2-26",
    brand: "Wilson",
    name: "Wilson Ultra Pro V2 2026",
    shortName: "Ultra Pro V2 26",
    year: 2026,
    category: "expert",
    shape: "Diamant",
    weight: "365-375",
    balance: "haut",
    surface: "Double Carbon Wall 2.0",
    core: "Pro EVA",
    priceRange: "220-300\u20AC",
    description: "Diamant puissance explosive. Infinity Edge sweet spot \xE9largi + Power Pillar stabilit\xE9. Finisseur agressif.",
    scores: {
      Puissance: 9.5,
      Contr\u00F4le: 6,
      Maniabilit\u00E9: 5.5,
      Confort: 6,
      Spin: 7.5,
      Tol\u00E9rance: 6
    },
    imageUrl: null
  },
  {
    id: "wilson-ultra-team-26",
    brand: "Wilson",
    name: "Wilson Ultra Team 2026",
    shortName: "Ultra Team 26",
    year: 2026,
    category: "intermediaire",
    shape: "Diamant",
    weight: "355-365",
    balance: "moyen-haut",
    surface: "Fiberglass/Carbon",
    core: "EVA",
    priceRange: "120-170\u20AC",
    description: "Diamant puissance accessible. Infinity Edge pour sweet spot large. Progression vers jeu offensif.",
    scores: {
      Puissance: 7.5,
      Contr\u00F4le: 6.5,
      Maniabilit\u00E9: 7,
      Confort: 7.5,
      Spin: 6.5,
      Tol\u00E9rance: 6.5
    },
    imageUrl: null
  }
];

// PadelAnalyzer.jsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var LEVEL_OPTIONS = [
  { value: "D\xE9butant", label: "D\xE9butant", desc: "D\xE9couverte, < 1 an" },
  { value: "Interm\xE9diaire", label: "Interm\xE9diaire", desc: "Bases acquises, 1-3 ans" },
  { value: "Avanc\xE9", label: "Avanc\xE9", desc: "Technique solide, tactique" },
  { value: "Expert", label: "Expert", desc: "Comp\xE9titeur class\xE9" }
];
var SIDE_OPTIONS = ["Gauche", "Droite", "Les deux"];
var HAND_OPTIONS = ["Droitier", "Gaucher"];
var FREQ_OPTIONS = [
  { value: "Occasionnel (1-2x/mois)", label: "Occasionnel", desc: "1-2x/mois" },
  { value: "R\xE9gulier (1-2x/semaine)", label: "R\xE9gulier", desc: "1-2x/semaine" },
  { value: "Assidu (3-4x/semaine)", label: "Assidu", desc: "3-4x/semaine" },
  { value: "Intensif (5+/semaine)", label: "Intensif", desc: "5+/semaine" }
];
var BRAND_TAGS = [
  { id: "head", label: "Head" },
  { id: "bullpadel", label: "Bullpadel" },
  { id: "nox", label: "Nox" },
  { id: "babolat", label: "Babolat" },
  { id: "adidas", label: "Adidas" },
  { id: "siux", label: "Siux" },
  { id: "starvie", label: "StarVie" },
  { id: "wilson", label: "Wilson" }
];
var STYLE_TAGS = [
  { id: "offensif", label: "Offensif", tip: "Filet, vol\xE9es, conclure vite" },
  { id: "defensif", label: "D\xE9fensif / Mur", tip: "Lobs, patience, attend l'erreur" },
  { id: "tactique", label: "Tactique", tip: "Placement, construction, rythme" },
  { id: "puissant", label: "Puissant / Frappeur", tip: "Remates, frappes lourdes" },
  { id: "veloce", label: "V\xE9loce", tip: "Couverture terrain, rapidit\xE9" },
  { id: "endurant", label: "Endurant", tip: "Longs \xE9changes, r\xE9sistance" },
  { id: "contre", label: "Contre-attaquant", tip: "D\xE9fend puis retourne" },
  { id: "polyvalent", label: "Polyvalent", tip: "Mix attaque/d\xE9fense, adaptatif" },
  { id: "technique", label: "Technique", tip: "Pr\xE9cision, toucher de balle" }
];
var INJURY_TAGS = [
  { id: "dos", label: "Dos" },
  { id: "poignet", label: "Poignet" },
  { id: "coude", label: "Coude (tennis elbow)" },
  { id: "epaule", label: "\xC9paule" },
  { id: "genou", label: "Genou" },
  { id: "cheville", label: "Cheville" },
  { id: "mollet", label: "Mollet" },
  { id: "hanche", label: "Hanche" },
  { id: "achille", label: "Tendon d'Achille" },
  { id: "aucune", label: "Aucune" }
];
var PRIORITY_TAGS = [
  { id: "confort", label: "Confort" },
  { id: "polyvalence", label: "Polyvalence" },
  { id: "puissance", label: "Puissance" },
  { id: "controle", label: "Contr\xF4le" },
  { id: "spin", label: "Spin" },
  { id: "legerete", label: "L\xE9g\xE8ret\xE9" },
  { id: "protection", label: "Protection bras" },
  { id: "reprise", label: "Reprise en douceur" }
];
var INITIAL_PROFILE = {
  age: "",
  weight: "",
  height: "",
  level: "Interm\xE9diaire",
  side: "Droite",
  hand: "Droitier",
  styleTags: [],
  styleExtra: "",
  injuryTags: [],
  injuryExtra: "",
  priorityTags: [],
  priorityExtra: "",
  brandTags: [],
  frequency: "Occasionnel (<1x/semaine)",
  competition: false
};
var INITIAL_RACKETS = [];
function loadSavedRackets() {
  try {
    const raw = localStorage.getItem("padel_rackets");
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch {
  }
  return [];
}
function saveRackets(rackets) {
  try {
    localStorage.setItem("padel_rackets", JSON.stringify(rackets));
  } catch {
  }
}
function loadSavedProfile() {
  try {
    const raw = localStorage.getItem("padel_profile");
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p === "object") return { ...INITIAL_PROFILE, ...p };
    }
  } catch {
  }
  return INITIAL_PROFILE;
}
function loadProfilesList() {
  try {
    const raw = localStorage.getItem("padel_profiles_list");
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch {
  }
  return [];
}
function saveProfilesList(list) {
  try {
    localStorage.setItem("padel_profiles_list", JSON.stringify(list));
  } catch {
  }
}
function saveNamedProfile(name, profile) {
  const list = loadProfilesList();
  const existing = list.findIndex((p) => p.name === name);
  const entry = { name, profile: { ...profile }, savedAt: Date.now() };
  if (existing >= 0) list[existing] = entry;
  else list.push(entry);
  saveProfilesList(list);
  return list;
}
function deleteNamedProfile(name) {
  const list = loadProfilesList().filter((p) => p.name !== name);
  saveProfilesList(list);
  return list;
}
var ATTRS = ["Puissance", "Contr\xF4le", "Confort", "Spin", "Maniabilit\xE9", "Tol\xE9rance"];
var COLORS_POOL = ["#E53935", "#FF9800", "#E91E63", "#4CAF50", "#009688", "#2196F3", "#1565C0", "#9C27B0", "#00BCD4", "#FF5722", "#8BC34A", "#795548", "#607D8B", "#D4E157", "#F06292", "#4DD0E1", "#FFB74D", "#AED581", "#BA68C8", "#4FC3F7"];
var explanations = {
  Puissance: "Vitesse de sortie de balle pour un effort donn\xE9. Diamant > goutte > ronde. \xC9quilibre haut = plus d'inertie. Mousse r\xE9active = catapulte.",
  Contr\u00F4le: "Capacit\xE9 \xE0 placer la balle pr\xE9cis\xE9ment. Ronde > goutte > diamant. Sweet spot large = tol\xE9rant. \xC9quilibre bas = plus pr\xE9cis.",
  Confort: "Vibrations transmises au bras/dos. Mousse souple + fibre de verre + anti-vibrations = confort. Carbone rigide (12K, 18K) + mousse dure = inconfortable.",
  Spin: "Accroche de la surface sur la balle pour cr\xE9er de la rotation. Texture 3D, sable = plus de spin.",
  Maniabilit\u00E9: "Facilit\xE9 \xE0 bouger la raquette rapidement. Poids l\xE9ger + \xE9quilibre bas = r\xE9actif. >370g = p\xE9nalisant.",
  Tol\u00E9rance: "Performance sur frappes d\xE9centr\xE9es. Grand sweet spot + forme ronde/goutte = pardonne les erreurs. Diamant + carbone rigide = exigeant."
};
var fyConfig = {
  recommended: { text: "RECOMMAND\xC9", bg: "#1B5E20", border: "#4CAF50" },
  partial: { text: "JOUABLE", bg: "#E65100", border: "#FF9800" },
  no: { text: "D\xC9CONSEILL\xC9", bg: "#B71C1C", border: "#E53935" }
};
var SCORING_SYSTEM_PROMPT = `You are a padel racket technical analyst. Score rackets using a HYBRID approach: reference scores from review sites calibrated with mechanical guard-rails.

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

CONTR\xD4LE (control = shot placement precision):
- Shape base: Ronde=8.5, Hybride=8.0, Goutte d'eau=7.5, Diamant=5.5
- Surface modifier: Fiberglass/hybrid: +0.5, Pure carbon: 0, Very stiff carbon (12K+): -0.5
- Sweet spot modifier: Optimized/large: +0.5, Standard: 0
- GUARD-RAIL: Diamant shape CANNOT exceed 7.5 contr\xF4le (limited sweet spot)

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

MANIABILIT\xC9 (maneuverability = ease of quick movement):
- Weight base: <350g: 9.0, 350-355g: 8.0, 355-360g: 7.5, 360-365g: 7.0, 365-370g: 6.5, >370g: 6.0
- Balance modifier: Bas/Low: +1.0, Moyen/Medium: +0.5, Mi-haut: 0, Haut/High: -0.5
- Adjustable balance (Weight Balance system): +0.5

TOL\xC9RANCE (forgiveness on off-center hits):
- Shape base: Ronde=8.5, Hybride=8.0, Goutte d'eau=7.0, Diamant=5.0
- Sweet spot modifier: Optimized/large: +0.5, Standard: 0
- Surface modifier: Fiberglass (softer rebound): +0.5, Hybrid: 0, Stiff carbon: -0.5
- GUARD-RAIL: Diamant shape CANNOT exceed 6.5 tol\xE9rance

VERDICT RULES for player profile \u2014 use these padel-specific style tags:
- "Offensif" \u2192 needs power, rewards diamant/high balance
- "D\xE9fensif / Mur" \u2192 needs control + tolerance, rewards ronde/goutte
- "Tactique" \u2192 needs control + maneuverability
- "Puissant / Frappeur" \u2192 needs power + spin, rewards diamant
- "V\xE9loce" \u2192 needs maneuverability + light weight
- "Endurant" \u2192 needs comfort + tolerance (long rallies = more vibrations)
- "Contre-attaquant" \u2192 needs tolerance + control + decent power
- "Polyvalent" \u2192 needs balanced scores, no extreme weakness
- "Technique" \u2192 needs control + spin

Injury tags impact:
- "Dos" or "Poignet" or "Coude" \u2192 Confort MUST be >= 7 for "recommended"
- "Aucune" \u2192 no injury constraint

forYou classification:
- "recommended": Confort >= 7 if injuries exist, AND matches play style well
- "partial": Confort 5-7 with injuries, OR minor mismatch with style
- "no": Confort < 5 with injuries, OR shape+weight too demanding, OR requires high technique level for casual play

Write verdict in French, 2 sentences max. Be direct and honest about risks for the player's injuries.

Return ONLY valid JSON, no markdown, no backticks.`;
function getNextColor(rks) {
  const used = new Set(rks.map((r) => r.color));
  return COLORS_POOL.find((c) => !used.has(c)) || "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
function buildProfileText(p) {
  const styles = p.styleTags.map((id) => STYLE_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
  const injuries = p.injuryTags.map((id) => INJURY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
  const priorities = p.priorityTags.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
  const brands = p.brandTags.map((id) => BRAND_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
  const styleStr = [...styles, p.styleExtra].filter(Boolean).join(", ") || "Non pr\xE9cis\xE9";
  const injuryStr = [...injuries, p.injuryExtra].filter(Boolean).join(", ") || "Aucune";
  const prioStr = [...priorities, p.priorityExtra].filter(Boolean).join(", ") || "Non pr\xE9cis\xE9";
  const brandStr = brands.length ? brands.join(", ") : "Toutes marques";
  const physique = [p.age ? `${p.age} ans` : null, p.height ? `${p.height}cm` : null, p.weight ? `${p.weight}kg` : null].filter(Boolean).join(", ");
  return `Joueur: ${physique || "Non renseign\xE9"}. Niveau: ${p.level}. Main: ${p.hand || "Droitier"}. C\xF4t\xE9: ${p.side}. Style: ${styleStr}. Blessures: ${injuryStr}. Fr\xE9quence: ${p.frequency}. Comp\xE9tition: ${p.competition ? "Oui" : "Non"}. Priorit\xE9: ${prioStr}. Marques pr\xE9f\xE9r\xE9es: ${brandStr}.`;
}
function computeGlobalScore(scores, profile) {
  const w = { Puissance: 1, Contr\u00F4le: 1, Confort: 1, Spin: 1, Maniabilit\u00E9: 1, Tol\u00E9rance: 1 };
  const prioMap = {
    confort: { Confort: 1.5 },
    polyvalence: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.5, Tol\u00E9rance: 0.5 },
    puissance: { Puissance: 1.5 },
    controle: { Contr\u00F4le: 1.5 },
    spin: { Spin: 1.5 },
    legerete: { Maniabilit\u00E9: 1.5 },
    protection: { Confort: 1.5 },
    reprise: { Confort: 1.5, Tol\u00E9rance: 1, Maniabilit\u00E9: 0.5 }
  };
  for (const tag of profile.priorityTags || []) {
    const boosts = prioMap[tag];
    if (boosts) for (const [k, v] of Object.entries(boosts)) w[k] = (w[k] || 1) + v;
  }
  const styleMap = {
    offensif: { Puissance: 0.5 },
    defensif: { Contr\u00F4le: 0.5, Tol\u00E9rance: 0.5 },
    tactique: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.3 },
    puissant: { Puissance: 0.5, Spin: 0.3 },
    veloce: { Maniabilit\u00E9: 0.8 },
    endurant: { Confort: 0.5, Tol\u00E9rance: 0.3 },
    contre: { Tol\u00E9rance: 0.5, Contr\u00F4le: 0.3 },
    polyvalent: { Contr\u00F4le: 0.3, Tol\u00E9rance: 0.3 },
    technique: { Contr\u00F4le: 0.5, Spin: 0.3 }
  };
  for (const tag of profile.styleTags || []) {
    const boosts = styleMap[tag];
    if (boosts) for (const [k, v] of Object.entries(boosts)) w[k] = (w[k] || 1) + v;
  }
  const ARM_INJURIES = ["dos", "poignet", "coude", "epaule"];
  const LEG_INJURIES = ["genou", "cheville", "mollet", "hanche", "achille"];
  const tags = profile.injuryTags || [];
  const hasArmInjury = tags.some((t) => ARM_INJURIES.includes(t));
  const hasLegInjury = tags.some((t) => LEG_INJURIES.includes(t));
  if (hasArmInjury) w.Confort = (w.Confort || 1) + 2;
  if (hasLegInjury) w.Maniabilit\u00E9 = (w.Maniabilit\u00E9 || 1) + 1.5;
  const h = Number(profile.height) || 0;
  if (h > 0 && h < 170) w.Maniabilit\u00E9 = (w.Maniabilit\u00E9 || 1) + 0.5;
  if (h >= 185) w.Puissance = (w.Puissance || 1) + 0.3;
  const age = Number(profile.age) || 0;
  if (age >= 40) {
    w.Confort = (w.Confort || 1) + 0.5;
    w.Tol\u00E9rance = (w.Tol\u00E9rance || 1) + 0.3;
  }
  if (age >= 50) {
    w.Confort = (w.Confort || 1) + 0.5;
    w.Maniabilit\u00E9 = (w.Maniabilit\u00E9 || 1) + 0.5;
    w.Tol\u00E9rance = (w.Tol\u00E9rance || 1) + 0.3;
  }
  if (age >= 60) {
    w.Confort = (w.Confort || 1) + 0.5;
    w.Tol\u00E9rance = (w.Tol\u00E9rance || 1) + 0.5;
  }
  const hand = profile.hand || "Droitier";
  const side = profile.side || "Droite";
  const isAttacker = hand === "Droitier" && side === "Gauche" || hand === "Gaucher" && side === "Droite";
  const isConstructor = hand === "Droitier" && side === "Droite" || hand === "Gaucher" && side === "Gauche";
  if (isAttacker) {
    w.Puissance = (w.Puissance || 1) + 0.5;
    w.Spin = (w.Spin || 1) + 0.3;
  }
  if (isConstructor) {
    w.Contr\u00F4le = (w.Contr\u00F4le || 1) + 0.5;
    w.Tol\u00E9rance = (w.Tol\u00E9rance || 1) + 0.3;
  }
  let total = 0, wSum = 0;
  for (const attr of ATTRS) {
    const weight = w[attr] || 1;
    total += (scores[attr] || 0) * weight;
    wSum += weight;
  }
  return Math.round(total / wSum * 10) / 10;
}
function computeForYou(scores, profile) {
  const gs = computeGlobalScore(scores, profile);
  const ARM_INJURIES = ["dos", "poignet", "coude", "epaule"];
  const hasArmInjury = (profile.injuryTags || []).some((t) => ARM_INJURIES.includes(t));
  const comfortOk = !hasArmInjury || scores.Confort >= 7;
  if (gs >= 7 && comfortOk) return "recommended";
  if (hasArmInjury && scores.Confort < 7 && gs < 6) return "no";
  return "partial";
}
function TagGroup({ tags, selected, onToggle, color = "#f97316" }) {
  return /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, paddingLeft: 13 }, children: tags.map((t) => {
    const active = selected.includes(t.id);
    return /* @__PURE__ */ jsxs("button", { className: "pa-tag", onClick: () => onToggle(t.id), title: t.tip || "", style: {
      padding: "5px 12px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: 600,
      cursor: "pointer",
      background: active ? `${color}18` : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? color + "88" : "rgba(255,255,255,0.08)"}`,
      color: active ? color : "#64748b",
      fontFamily: "'Inter',sans-serif",
      boxShadow: active ? `0 2px 8px ${color}22` : "none"
    }, children: [
      active ? "\u2713 " : "",
      t.label
    ] }, t.id);
  }) });
}
function PadelAnalyzer() {
  const [rackets, setRackets] = useState(() => {
    const saved = loadSavedRackets();
    return saved.length ? saved : INITIAL_RACKETS;
  });
  const [selected, setSelected] = useState(() => {
    const saved = loadSavedRackets();
    return saved.length ? saved.slice(0, Math.min(saved.length, 4)).map((r) => r.id) : [];
  });
  const [tab, setTab] = useState("radar");
  const [openAttr, setOpenAttr] = useState(null);
  const [profile, setProfile] = useState(() => loadSavedProfile());
  const [panel, setPanel] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [suggestResults, setSuggestResults] = useState(null);
  const [suggestChecked, setSuggestChecked] = useState(/* @__PURE__ */ new Set());
  const [addingBatch, setAddingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState("");
  const [profileName, setProfileName] = useState(() => {
    const p = loadSavedProfile();
    return p._name || "";
  });
  const [savedProfiles, setSavedProfiles] = useState(() => loadProfilesList());
  const [hoveredRacket, setHoveredRacket] = useState(null);
  const [localDBCount, setLocalDBCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("padel_db_extra") || "[]").length;
    } catch {
      return 0;
    }
  });
  useEffect(() => {
    saveRackets(rackets);
  }, [rackets]);
  useEffect(() => {
    try {
      localStorage.setItem("padel_profile", JSON.stringify({ ...profile, _name: profileName }));
    } catch {
    }
  }, [profile, profileName]);
  const toggleRacket = (id) => {
    setSelected((p) => p.includes(id) ? p.length > 1 ? p.filter((r) => r !== id) : p : p.length < 4 ? [...p, id] : p);
  };
  const removeRacket = (id) => {
    setRackets((p) => p.filter((r) => r.id !== id));
    setSelected((p) => {
      const n = p.filter((r) => r !== id);
      return n.length ? n : rackets.filter((r) => r.id !== id).length ? [rackets.filter((r) => r.id !== id)[0].id] : [];
    });
  };
  const toggleTag = (field, id) => {
    setProfile((p) => {
      const cur = p[field];
      if (field === "injuryTags" && id === "aucune") return { ...p, [field]: cur.includes("aucune") ? [] : ["aucune"] };
      if (field === "injuryTags" && cur.includes("aucune")) return { ...p, [field]: [id] };
      return { ...p, [field]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };
  const selRackets = rackets.filter((r) => selected.includes(r.id));
  const radarData = ATTRS.map((a) => {
    const pt = { attribute: a, "\u2014 10/10 \u2014": 10 };
    selRackets.forEach((r) => {
      pt[r.shortName] = Number(r.scores[a]) || 0;
    });
    return pt;
  });
  const profileText = buildProfileText(profile);
  const rescoreRacket = async (id) => {
    const r = rackets.find((x) => x.id === id);
    if (!r) return;
    setLoading(true);
    setLoadMsg(`\u{1F504} Re-scoring ${r.shortName}...`);
    try {
      try {
        localStorage.removeItem(getCacheKey(r.name, r.brand));
      } catch {
      }
      const scored = await fetchAndScoreRacket(r.name, r.brand, r.color);
      setRackets((p) => p.map((x) => x.id === id ? { ...scored, id } : x));
    } catch (e) {
      setError("\u274C \xC9chec du re-scoring: " + e.message);
    } finally {
      setLoading(false);
      setLoadMsg("");
    }
  };
  function stripCiteTags(text) {
    return text.replace(/<\/?cite[^>]*>/gi, "").replace(/<\/?source[^>]*>/gi, "");
  }
  async function callAI(msgs, { webSearch = false, systemPrompt = null, maxTokens = 1500, retries = 4 } = {}) {
    const body = { model: "claude-sonnet-4-20250514", max_tokens: maxTokens, temperature: 0, messages: msgs };
    if (systemPrompt) body.system = systemPrompt;
    if (webSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12e4);
      try {
        const r = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timeout);
        if ((r.status === 529 || r.status === 429) && attempt < retries) {
          const waitSec = r.status === 429 ? 30 + attempt * 15 : 8 + attempt * 4;
          console.warn(`[API] ${r.status} rate limited, retry ${attempt + 1}/${retries} in ${waitSec}s...`);
          setLoadMsg?.(`\u23F3 Limite API atteinte \u2014 pause ${waitSec}s avant de reprendre (${attempt + 1}/${retries})...`);
          await new Promise((ok) => setTimeout(ok, waitSec * 1e3));
          continue;
        }
        if (!r.ok) {
          const errBody = await r.text().catch(() => "");
          throw new Error(`API ${r.status}: ${errBody.slice(0, 300)}`);
        }
        const d = await r.json();
        const raw = d.content?.filter((b) => b.type === "text").map((b) => b.text).join("\n") || "";
        return stripCiteTags(raw);
      } catch (e) {
        clearTimeout(timeout);
        if (e.name === "AbortError") throw new Error("Timeout \u2014 la requ\xEAte a pris trop de temps (>120s). R\xE9essaie.");
        if (attempt < retries && (e.message?.includes("529") || e.message?.includes("429") || e.message?.includes("Overloaded") || e.message?.includes("rate_limit"))) {
          const waitSec = 30 + attempt * 15;
          console.warn(`[API] Retry ${attempt + 1}/${retries} after error:`, e.message);
          await new Promise((ok) => setTimeout(ok, waitSec * 1e3));
          continue;
        }
        throw e;
      }
    }
  }
  function parseJ(t) {
    let c = t.replace(/```json|```/g, "").trim();
    c = c.replace(/<\/?[a-z][^>]*>/gi, "");
    try {
      const m = c.match(/[\[{][\s\S]*[\]}]/);
      if (m) return JSON.parse(m[0]);
    } catch {
    }
    try {
      const fixed = c.replace(/,\s*([}\]])/g, "$1");
      const m = fixed.match(/[\[{][\s\S]*[\]}]/);
      if (m) return JSON.parse(m[0]);
    } catch {
    }
    try {
      const fixed = c.replace(/(\{|,)\s*([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
      const m = fixed.match(/[\[{][\s\S]*[\]}]/);
      if (m) return JSON.parse(m[0]);
    } catch {
    }
    try {
      const fixed = c.replace(/'/g, '"');
      const m = fixed.match(/[\[{][\s\S]*[\]}]/);
      if (m) return JSON.parse(m[0]);
    } catch {
    }
    try {
      return JSON.parse(c);
    } catch {
    }
    throw new Error("Impossible de parser la r\xE9ponse. R\xE9essaie.");
  }
  const searchRackets = useCallback(async () => {
    if (!searchQ.trim()) return;
    setLoading(true);
    setError("");
    setSuggestions(null);
    setLoadMsg("\u{1F50D} Recherche en cours...");
    try {
      const txt = await callAI([{ role: "user", content: `Search the web for padel rackets matching: "${searchQ}". The user may have typed an approximate name, brand, player name, or partial model. Find the 2-4 most likely padel racket matches currently on sale (2024-2026 models).
For EACH match: exact full official name, brand, shape (Diamant/Goutte d'eau/Ronde/Hybride), approximate weight, one-line description in French.
Return ONLY a JSON array: [{"name":"...","brand":"...","shape":"...","weight":"...","description":"..."}]. No markdown.` }], { webSearch: true });
      const res = parseJ(txt);
      if (!Array.isArray(res) || !res.length) throw new Error("Aucun r\xE9sultat");
      setSuggestions(res);
    } catch (e) {
      setError("\u274C " + e.message + ". Essaie d'autres mots-cl\xE9s.");
    } finally {
      setLoading(false);
      setLoadMsg("");
    }
  }, [searchQ]);
  const selectSuggestion = useCallback(async (idx) => {
    const sug = suggestions[idx];
    if (!sug) return;
    setSuggestions((s) => s.map((x, i) => ({ ...x, _disabled: true, _selected: i === idx })));
    setLoading(true);
    setError("");
    setLoadMsg("\u{1F50D} R\xE9cup\xE9ration des specs...");
    try {
      const newR = await fetchAndScoreRacket(sug.name, sug.brand, getNextColor(rackets));
      setRackets((p) => [...p, newR]);
      setSelected((p) => p.length < 4 ? [...p, newR.id] : p);
      setSearchQ("");
      setSuggestions(null);
      setLoadMsg("\u2705 " + newR.name + " ajout\xE9e !");
      setTimeout(() => setLoadMsg(""), 2500);
    } catch (e) {
      setError("\u274C " + e.message);
      setSuggestions((s) => s?.map((x) => ({ ...x, _disabled: false, _selected: false })));
    } finally {
      setLoading(false);
    }
  }, [suggestions, rackets, profile, profileText]);
  function normalizeName(name) {
    return (name || "").toLowerCase().replace(/\b(head|bullpadel|adidas|wilson|babolat|nox|siux|starvie|varlion|drop shot|dunlop|star vie)\b/gi, "").replace(/\b(20\d{2})\b/g, "").replace(/\b(v\d+)\b/gi, "").replace(/[^a-z0-9]/g, "").replace(/\s+/g, "");
  }
  function getCacheKey(name, brand) {
    const n = normalizeName(name);
    const b = (brand || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    return "padel_score_" + b + "_" + n;
  }
  function getCachedScore(name, brand) {
    try {
      const raw = localStorage.getItem(getCacheKey(name, brand));
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (Date.now() - cached.ts > 7 * 24 * 60 * 60 * 1e3) {
        localStorage.removeItem(getCacheKey(name, brand));
        return null;
      }
      return cached.data;
    } catch {
      return null;
    }
  }
  function setCachedScore(name, brand, data) {
    try {
      localStorage.setItem(getCacheKey(name, brand), JSON.stringify({ ts: Date.now(), data }));
    } catch {
    }
  }
  function saveToLocalDB(racket) {
    try {
      const extra = JSON.parse(localStorage.getItem("padel_db_extra") || "[]");
      const nameLower = racket.name.toLowerCase();
      if (extra.some((r) => r.name.toLowerCase() === nameLower)) return;
      const avgScore = Object.values(racket.scores || {}).reduce((a, b) => a + b, 0) / 6;
      let category = "intermediaire";
      if (racket.name.toLowerCase().includes("junior") || racket.name.toLowerCase().includes("kids")) category = "junior";
      else if (avgScore >= 7.5) category = "expert";
      else if (avgScore >= 7) category = "avance";
      else if (avgScore <= 5.5) category = "debutant";
      extra.push({
        id: racket.id,
        name: racket.name,
        shortName: racket.shortName,
        brand: racket.brand,
        shape: racket.shape,
        weight: racket.weight,
        balance: racket.balance || "\u2014",
        surface: racket.surface || "\u2014",
        core: racket.core || "\u2014",
        price: racket.price || "\u2014",
        player: racket.player || "\u2014",
        imageUrl: racket.imageUrl || null,
        year: (/* @__PURE__ */ new Date()).getFullYear(),
        category,
        scores: racket.scores,
        verdict: racket.verdict || "\u2014"
      });
      localStorage.setItem("padel_db_extra", JSON.stringify(extra));
      setLocalDBCount(extra.length);
      console.log(`[DB+] Saved ${racket.name} to local DB supplement (total: ${extra.length})`);
    } catch (e) {
      console.warn("[DB+] Save failed:", e.message);
    }
  }
  function exportLocalDB() {
    try {
      const extra = JSON.parse(localStorage.getItem("padel_db_extra") || "[]");
      if (!extra.length) {
        alert("Aucune raquette apprise localement.");
        return;
      }
      const blob = new Blob([JSON.stringify(extra, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `padel-local-db-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erreur export: " + e.message);
    }
  }
  function clearLocalDB() {
    if (!confirm(`Supprimer les ${localDBCount} raquette(s) apprise(s) localement ?

La base embarqu\xE9e (${rackets_db_default.length}) n'est pas affect\xE9e.`)) return;
    try {
      localStorage.removeItem("padel_db_extra");
      setLocalDBCount(0);
    } catch {
    }
  }
  function loadRacketFromDB(name, brand, color) {
    let allDB = [...rackets_db_default];
    try {
      const extra = JSON.parse(localStorage.getItem("padel_db_extra") || "[]");
      if (Array.isArray(extra)) allDB = [...allDB, ...extra];
    } catch {
    }
    const nameLower = name.toLowerCase();
    const entry = allDB.find((r) => r.name.toLowerCase() === nameLower) || allDB.find((r) => nameLower.includes(r.name.toLowerCase().slice(0, 15)) || r.name.toLowerCase().includes(nameLower.slice(0, 15)));
    if (!entry) return null;
    return {
      id: entry.id + "-" + Date.now(),
      name: entry.name,
      shortName: entry.shortName || entry.name.slice(0, 28),
      brand: entry.brand,
      shape: entry.shape,
      weight: entry.weight,
      balance: entry.balance || "\u2014",
      surface: entry.surface || "\u2014",
      core: entry.core || "\u2014",
      price: entry.price || "\u2014",
      player: entry.player || "\u2014",
      color,
      imageUrl: entry.imageUrl || null,
      scores: entry.scores,
      verdict: entry.verdict || "Analyse non disponible",
      forYou: "partial",
      // Computed dynamically by computeForYou()
      refSource: "Base Padel Analyzer",
      _fromDB: true,
      _incomplete: false
    };
  }
  async function fetchAndScoreRacket(name, brand, assignedColor) {
    const cached = getCachedScore(name, brand);
    if (cached) {
      console.log(`[Cache] Hit for ${name} \u2014 using cached scores`);
      return { ...cached, color: assignedColor, id: cached.id + "-" + Date.now() };
    }
    const dbResult = loadRacketFromDB(name, brand, assignedColor);
    if (dbResult) {
      console.log(`[DB] Found ${name} in database \u2014 no API call needed`);
      setCachedScore(name, brand, dbResult);
      return dbResult;
    }
    const specsTxt = await callAI([{ role: "user", content: `Search the web for complete technical specs AND review scores of this padel racket: "${name}" by ${brand}.

PART A \u2014 TECHNICAL SPECS (search manufacturer site, retailers):
brand, full name, short display name (max 18 chars), shape (Diamant/Goutte d'eau/Ronde/Hybride), weight range in grams, balance (mm + Haut/Mi-haut/Moyen/Bas), hitting surface material (carbon, fiberglass, hybrid, 12K, 18K etc.), core/foam material (density: soft, medium, hard, reactive), anti-vibration tech if any, approximate price in \u20AC, pro player endorsement, product image URL.

IMAGE URL RULES: Find a DIRECT URL to a product photo of the racket (jpg/png/webp). Search retailers like PadelNuestro, Padel Reference, PadelZone, Amazon, Decathlon, or the manufacturer's site. The URL must point to an actual photo of THIS specific racket model \u2014 not a logo, banner, category page, or generic image. Look for URLs containing the racket model name. If you cannot find a reliable product photo URL, set imageUrl to null.

PART B \u2014 REFERENCE SCORES (search Esprit Padel Shop, PadelMania, Padel Reference, PadelZone, or any review site that gives scores/ratings):
Find existing ratings/scores for this racket. Look for: power/puissance, control/contr\xF4le, comfort/confort, spin/effet, maneuverability/maniabilit\xE9/manoeuvrabilit\xE9, tolerance/tol\xE9rance/sweet spot. These may be on /100, /10, /5, or star ratings.
If you find scores, convert ALL to /100 scale. If a site uses /10 multiply by 10, if /5 multiply by 20.
If NO review scores found, set refScores to null.

Return ONLY JSON:
{
  "brand":"...","name":"...","shortName":"...","shape":"...","weight":"...","balance":"...","surface":"...","core":"...","antivib":"...","price":"...","player":"...","imageUrl":"https://...",
  "refScores": {"puissance":85,"controle":70,"confort":65,"spin":75,"maniabilite":60,"tolerance":70,"source":"Esprit Padel Shop"} or null
}
No markdown.` }], { webSearch: true });
    const specs = parseJ(specsTxt);
    const hasRef = specs.refScores && typeof specs.refScores === "object";
    const refBlock = hasRef ? `
REFERENCE SCORES (from ${specs.refScores.source || "review site"}, scale /100):
Puissance: ${specs.refScores.puissance ?? "N/A"}, Contr\xF4le: ${specs.refScores.controle ?? "N/A"}, Confort: ${specs.refScores.confort ?? "N/A"}, Spin: ${specs.refScores.spin ?? "N/A"}, Maniabilit\xE9: ${specs.refScores.maniabilite ?? "N/A"}, Tol\xE9rance: ${specs.refScores.tolerance ?? "N/A"}

CALIBRATION METHOD:
1. Start from reference scores. Convert /100 to /10: score_base = (ref_score / 10) - 0.5. This applies a mild deflation since review sites tend to inflate (they rarely go below 60/100). Examples: 90\u21928.5, 80\u21927.5, 73\u21926.8, 65\u21926.0.
2. Apply GUARD-RAIL CAPS from mechanical rules (see system prompt). If a cap applies, use the LOWER of calibrated vs cap. For example: Diamant shape \u2192 Contr\xF4le capped at 7.5, Tol\xE9rance capped at 6.5. Stiff carbon + hard EVA \u2192 Confort max 6.0.
3. Apply GUARD-RAIL FLOORS from mechanical rules. For example: Fiberglass + soft foam + anti-vib \u2192 Confort minimum 7.0.
4. Round to nearest 0.5.
5. Final scores must respect both the relative ordering from reviews AND the absolute caps/floors from mechanical rules.` : `
NO REFERENCE SCORES FOUND. Use PURE MECHANICAL RULES from system prompt to calculate scores.`;
    const scoreTxt = await callAI([{ role: "user", content: `Score this padel racket's INTRINSIC properties. Do NOT consider any player profile \u2014 score the racket itself.

RACKET SPECS:
- Name: ${specs.name}
- Shape: ${specs.shape}
- Weight: ${specs.weight}
- Balance: ${specs.balance}
- Surface: ${specs.surface}
- Core/Foam: ${specs.core}
- Anti-vibration tech: ${specs.antivib || "none specified"}
${refBlock}

IMPORTANT: Scores must reflect the racket's own characteristics, NOT how well it fits any player. A heavy diamond racket scores high on Puissance and low on Maniabilit\xE9 regardless of who uses it.

Calculate each score step by step: state the reference score (if available), the calibrated score, any guard-rail cap, then the final score.

Return JSON: {"scores":{"Puissance":X,"Contr\xF4le":X,"Confort":X,"Spin":X,"Maniabilit\xE9":X,"Tol\xE9rance":X},"verdict":"French text describing the racket's character and best use case (2-3 sentences)","reasoning":"brief calculation notes","refSource":"${specs.refScores?.source || "none"}"}
No markdown, no backticks.` }], { systemPrompt: SCORING_SYSTEM_PROMPT });
    let analysis;
    try {
      analysis = parseJ(scoreTxt);
    } catch (e1) {
      console.warn(`[Score] Parse failed for ${specs.name}, retrying...`, e1.message);
      try {
        const retry = await callAI([{ role: "user", content: `Score this padel racket's INTRINSIC properties. Specs: ${specs.name}, ${specs.shape}, ${specs.weight}, ${specs.balance}, ${specs.surface}, ${specs.core}.
Return ONLY valid JSON: {"scores":{"Puissance":7,"Contr\xF4le":7,"Confort":7,"Spin":7,"Maniabilit\xE9":7,"Tol\xE9rance":7},"verdict":"French text describing the racket"}
No markdown, no backticks, no explanation.` }], { systemPrompt: SCORING_SYSTEM_PROMPT, maxTokens: 600 });
        analysis = parseJ(retry);
        console.log(`[Score] Retry succeeded for ${specs.name}`);
      } catch (e2) {
        console.warn(`[Score] Retry also failed for ${specs.name}:`, e2.message);
        analysis = { scores: {}, verdict: "Scoring automatique indisponible \u2014 clique \u{1F504} pour r\xE9essayer.", forYou: "partial", _incomplete: true };
      }
    }
    const newId = (specs.name || name).toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 35) + "-" + Date.now();
    const clean = (v) => !v || v === "null" || v === "undefined" || /not found|introuvable|n\/a|unknown/i.test(v) ? "\u2014" : String(v).trim();
    const result = {
      id: newId,
      name: specs.name || name,
      shortName: (specs.shortName || specs.name || name).slice(0, 28),
      brand: clean(specs.brand) || brand || "\u2014",
      shape: clean(specs.shape),
      weight: clean(specs.weight),
      balance: clean(specs.balance),
      surface: clean(specs.surface),
      core: clean(specs.core),
      price: clean(specs.price),
      player: clean(specs.player),
      color: assignedColor,
      imageUrl: specs.imageUrl || null,
      scores: Object.fromEntries(ATTRS.map((a) => [a, Math.round((Number(analysis.scores?.[a]) || 5) * 10) / 10])),
      verdict: analysis.verdict || "Analyse non disponible",
      forYou: "partial",
      // Will be computed dynamically by computeForYou() based on current profile
      refSource: analysis.refSource || specs.refScores?.source || null,
      _incomplete: analysis._incomplete || Object.keys(analysis.scores || {}).length < 6
    };
    setCachedScore(specs.name || name, specs.brand || brand, result);
    saveToLocalDB(result);
    return result;
  }
  function matchFromDB(profile2, existingNames) {
    const age = Number(profile2.age) || 0;
    const ht = Number(profile2.height) || 0;
    const isJunior = age > 0 && age < 15 || ht > 0 && ht < 150;
    const brandPref = profile2.brandTags.map((id) => BRAND_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
    let allDB = [...rackets_db_default];
    try {
      const extra = JSON.parse(localStorage.getItem("padel_db_extra") || "[]");
      if (Array.isArray(extra)) allDB = [...allDB, ...extra];
    } catch {
    }
    let pool;
    if (isJunior) {
      pool = allDB.filter((r) => r.category === "junior");
    } else {
      const lvl = profile2.level || "D\xE9butant";
      const catMap = { "D\xE9butant": ["debutant", "intermediaire"], "Interm\xE9diaire": ["intermediaire", "debutant", "avance"], "Avanc\xE9": ["avance", "intermediaire", "expert"], "Expert": ["expert", "avance"] };
      const cats = catMap[lvl] || ["debutant", "intermediaire"];
      pool = allDB.filter((r) => cats.includes(r.category));
    }
    const exLower = existingNames.map((n) => n.toLowerCase());
    pool = pool.filter((r) => !exLower.some((n) => r.name.toLowerCase().includes(n.slice(0, 12)) || n.includes(r.name.toLowerCase().slice(0, 12))));
    let brandPool = pool;
    if (brandPref.length) {
      const prefLower = brandPref.map((b) => b.toLowerCase());
      brandPool = pool.filter((r) => prefLower.includes(r.brand.toLowerCase()));
      const otherPool = pool.filter((r) => !prefLower.includes(r.brand.toLowerCase()));
      const otherTop = otherPool.sort((a, b) => computeGlobalScore(a.scores, profile2) - computeGlobalScore(b.scores, profile2)).reverse().slice(0, 2);
      brandPool = [...brandPool, ...otherTop];
    }
    const scored = brandPool.map((r) => ({ ...r, _globalScore: computeGlobalScore(r.scores, profile2) }));
    scored.sort((a, b) => b._globalScore - a._globalScore);
    const prioTags = profile2.priorityTags || [];
    const prioAttrs = [];
    if (prioTags.includes("puissance")) prioAttrs.push("Puissance");
    if (prioTags.includes("controle")) prioAttrs.push("Contr\xF4le");
    if (prioTags.includes("confort") || prioTags.includes("protection") || prioTags.includes("reprise")) prioAttrs.push("Confort");
    if (prioTags.includes("spin")) prioAttrs.push("Spin");
    if (prioTags.includes("legerete")) prioAttrs.push("Maniabilit\xE9");
    const heart = scored.slice(0, 5);
    const heartIds = new Set(heart.map((r) => r.id));
    let prioPool = scored.filter((r) => !heartIds.has(r.id));
    if (prioAttrs.length) {
      prioPool.sort((a, b) => {
        const avgA = prioAttrs.reduce((s, k) => s + (a.scores[k] || 0), 0) / prioAttrs.length;
        const avgB = prioAttrs.reduce((s, k) => s + (b.scores[k] || 0), 0) / prioAttrs.length;
        return avgB - avgA;
      });
    }
    const priority = prioPool.slice(0, 3);
    return { heart, priority, totalPool: pool.length };
  }
  const suggestRackets = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuggestResults(null);
    setSuggestChecked(/* @__PURE__ */ new Set());
    setLoadMsg("\u{1F3AF} Recherche dans la base de donn\xE9es...");
    const existingNames = rackets.map((r) => r.name);
    const brandPref = profile.brandTags.map((id) => BRAND_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
    const prioLabels = profile.priorityTags.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
    console.log("[Suggest] Starting. Existing:", existingNames, "Brands:", brandPref, "Priorities:", prioLabels);
    try {
      const dbMatch = matchFromDB(profile, existingNames);
      console.log("[DB] Pool:", dbMatch.totalPool, "Heart:", dbMatch.heart.length, "Priority:", dbMatch.priority.length);
      if (dbMatch.heart.length + dbMatch.priority.length >= 6) {
        const results = [
          ...dbMatch.heart.map((r) => ({ name: r.name, brand: r.brand, shape: r.shape, weight: r.weight, price: r.price, category: "heart", description: r.verdict, _fromDB: true })),
          ...dbMatch.priority.map((r) => ({ name: r.name, brand: r.brand, shape: r.shape, weight: r.weight, price: r.price, category: "priority", description: r.verdict, _fromDB: true }))
        ];
        console.log("[DB] Sufficient results:", results.length, "\u2014 skipping web search");
        setSuggestResults(results);
        setLoadMsg("\u2705 " + results.length + " raquettes trouv\xE9es instantan\xE9ment !");
        setTimeout(() => setLoadMsg(""), 2500);
        setLoading(false);
        return;
      }
      console.log("[DB] Only", dbMatch.heart.length + dbMatch.priority.length, "results \u2014 falling back to web search");
      setLoadMsg("\u{1F310} Recherche web compl\xE9mentaire...");
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1e3);
        setLoadMsg(`\u{1F310} Recherche web compl\xE9mentaire... (${elapsed}s)`);
      }, 1e3);
      try {
        const txt = await callAI([{ role: "user", content: `Search the web for padel rackets suitable for this player. Find 8 different models (2024-2026).

PLAYER: ${profileText}

EXCLUDED (already owned, do NOT include): ${existingNames.join("; ")}

${brandPref.length ? `PREFERRED BRANDS: ${brandPref.join(", ")}. Include 5+ from these brands and 1-2 from other brands.` : ""}

You MUST return TWO categories:

CATEGORY "heart" (4-5 rackets) \u2014 COUPS DE C\u0152UR: Best overall match for the player's FULL profile (style, level, side, priorities).${(profile.injuryTags || []).some((t) => t !== "aucune") ? " Player has injuries \u2014 prioritize comfort and safety. Avoid stiff carbon with hard EVA." : " No injuries \u2014 focus on best performance match for the player style and priorities."}

CATEGORY "priority" (3 rackets) \u2014 ALTERNATIVES PRIORIT\xC9: Rackets that specifically match the player's PRIORITY TAGS: ${prioLabels.join(", ")}. These can sacrifice some comfort for performance in the priority areas. ${prioLabels.includes("Puissance") ? "Include powerful rackets (diamond/drop shapes, high balance) even if comfort is lower." : ""} ${prioLabels.includes("Spin") ? "Include textured surface rackets for maximum spin." : ""} Still exclude truly dangerous choices (no comfort below 4/10). Add a warning in description if comfort is limited.

Key rules:
${(() => {
          const a = Number(profile.age) || 0;
          const ht = Number(profile.height) || 0;
          const isJunior = a > 0 && a < 15 || ht > 0 && ht < 150;
          const isSenior = a >= 50;
          const lines = [];
          if (isJunior) {
            lines.push("- JUNIOR PLAYER: Search specifically for JUNIOR/KIDS padel rackets. Weight 300-340g max. Price range 30-120\u20AC. Smaller grip. Do NOT suggest adult rackets.");
          } else if (profile.level === "Avanc\xE9" || profile.level === "Expert") {
            lines.push("- Avanc\xE9/Expert level \u2192 price range 200-400\u20AC.");
          } else if (profile.level === "Interm\xE9diaire") {
            lines.push("- Interm\xE9diaire level \u2192 price range 100-250\u20AC.");
          } else {
            lines.push("- D\xE9butant level \u2192 price range 50-150\u20AC. Prioritize round shapes, light weight, high tolerance.");
          }
          if (isSenior) lines.push("- Player is 50+ years old \u2192 prioritize lightweight rackets (340-360g), excellent comfort and vibration dampening.");
          lines.push("- V\xE9loce/Endurant \u2192 light weight preferred.");
          lines.push('- Each racket: name (exact official name), brand, shape, weight, price (\u20AC), category ("heart" or "priority"), description (2 sentences French: WHY it fits + warning if comfort limited).');
          return lines.join("\n");
        })()}

Return ONLY a JSON array, no markdown: [{"name":"...","brand":"...","shape":"...","weight":"...","price":"...","category":"heart","description":"..."}]` }], { webSearch: true, maxTokens: 2500 });
        const res = parseJ(txt);
        if (!Array.isArray(res) || !res.length) throw new Error("Aucune suggestion trouv\xE9e");
        console.log("[WebSearch] Got results:", res.length, res.map((r) => `${r.category}:${r.name}`));
        const filtered = res.filter((s) => !existingNames.some(
          (n) => n.toLowerCase().includes(s.name?.toLowerCase()?.slice(0, 15)) || s.name?.toLowerCase()?.includes(n.toLowerCase().slice(0, 15))
        ));
        setSuggestResults(filtered.length ? filtered : res);
        clearInterval(timer);
        setLoadMsg("");
      } catch (e) {
        clearInterval(timer);
        throw e;
      }
    } catch (e) {
      console.error("[Suggest] Failed:", e.message, e);
      setError("\u274C " + e.message);
    } finally {
      setLoading(false);
      setLoadMsg("");
    }
  }, [profile, profileText, rackets]);
  const toggleSuggestCheck = (idx) => {
    setSuggestChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };
  const addCheckedSuggestions = useCallback(async () => {
    if (!suggestResults || suggestChecked.size === 0) return;
    setAddingBatch(true);
    setError("");
    const toAdd = [...suggestChecked].sort((a, b) => a - b);
    const sugsToScore = toAdd.map((idx) => suggestResults[idx]).filter((s) => s && !s._added);
    if (!sugsToScore.length) {
      setAddingBatch(false);
      return;
    }
    const usedColors = new Set(rackets.map((r) => r.color));
    const availableColors = COLORS_POOL.filter((c) => !usedColors.has(c));
    while (availableColors.length < sugsToScore.length) {
      availableColors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 55%)`);
    }
    let added = 0;
    for (let i = 0; i < sugsToScore.length; i++) {
      const sug = sugsToScore[i];
      const color = availableColors[i] || `hsl(${i * 60}, 70%, 55%)`;
      setBatchProgress(`\u23F3 ${i + 1}/${sugsToScore.length} \u2014 ${sug.name}...`);
      try {
        let newR;
        if (sug._fromDB) {
          newR = loadRacketFromDB(sug.name, sug.brand, color);
          if (!newR) throw new Error("Raquette introuvable dans la base");
          console.log(`[DB] Loaded ${sug.name} directly \u2014 no API call`);
        } else {
          newR = await fetchAndScoreRacket(sug.name, sug.brand, color);
          saveToLocalDB(newR);
        }
        setRackets((p) => [...p, newR]);
        setSelected((p) => p.length < 4 ? [...p, newR.id] : p);
        const idx = toAdd[i];
        setSuggestResults((s) => s.map((x, j) => j === idx ? { ...x, _added: true } : x));
        added++;
        if (!sug._fromDB && i < sugsToScore.length - 1) await new Promise((ok) => setTimeout(ok, 3e3));
      } catch (e) {
        const idx = toAdd[i];
        setSuggestResults((s) => s.map((x, j) => j === idx ? { ...x, _error: e.message } : x));
      }
    }
    setBatchProgress(`\u2705 ${added} raquette${added > 1 ? "s" : ""} ajout\xE9e${added > 1 ? "s" : ""}!`);
    setSuggestChecked(/* @__PURE__ */ new Set());
    setTimeout(() => setBatchProgress(""), 3e3);
    setAddingBatch(false);
  }, [suggestResults, suggestChecked, rackets, profile, profileText]);
  const reanalyzeAll = useCallback(async () => {
    setLoading(true);
    setError("");
    setLoadMsg("\u{1F504} R\xE9-analyse en cours...");
    try {
      const txt = await callAI([{ role: "user", content: `Re-evaluate ALL these rackets for this player profile. Apply STRICT MECHANICAL RULES.

PLAYER: ${profileText}

RACKETS:
${rackets.map((r) => `- "${r.name}": shape=${r.shape}, weight=${r.weight}, balance=${r.balance}, surface=${r.surface}, core=${r.core}`).join("\n")}

For EACH racket provide ONLY forYou and verdict. Do NOT change the scores (those are mechanical).
Return JSON array: [{"name":"exact name","forYou":"recommended|partial|no","verdict":"2 sentences French"}]. No markdown.` }], { systemPrompt: SCORING_SYSTEM_PROMPT });
      const res = parseJ(txt);
      setRackets((p) => p.map((r) => {
        const m = res.find((x) => r.name.toLowerCase().includes(x.name?.toLowerCase()) || x.name?.toLowerCase().includes(r.name.toLowerCase()));
        return m ? { ...r, forYou: m.forYou, verdict: m.verdict } : r;
      }));
      setLoadMsg("\u2705 Profil mis \xE0 jour !");
      setTimeout(() => setLoadMsg(""), 2e3);
    } catch (e) {
      setError("\u274C " + e.message);
    } finally {
      setLoading(false);
    }
  }, [profile, rackets, profileText]);
  const S = {
    root: { fontFamily: "'Inter',sans-serif", background: "linear-gradient(160deg,#080c14,#0f1623,#0d1520,#0a0f1a)", color: "#e2e8f0", minHeight: "100vh", padding: "24px 16px", letterSpacing: "-0.01em" },
    card: { background: "rgba(255,255,255,0.025)", borderRadius: 16, padding: 18, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 18, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", animation: "fadeIn 0.3s ease" },
    title: { fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: "#f97316", marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" },
    btn: (a) => ({ padding: "8px 16px", background: a ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${a ? "#f97316" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: a ? "#f97316" : "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s cubic-bezier(.4,0,.2,1)", letterSpacing: "-0.01em" }),
    btnGreen: { padding: "12px 16px", background: "linear-gradient(135deg,rgba(76,175,80,0.2),rgba(76,175,80,0.1))", border: "1px solid rgba(76,175,80,0.4)", borderRadius: 12, color: "#4CAF50", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", width: "100%", transition: "all 0.2s ease", letterSpacing: "-0.01em" },
    input: { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#e2e8f0", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "'Inter',sans-serif", transition: "border-color 0.2s ease" },
    select: { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#e2e8f0", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "'Inter',sans-serif", appearance: "auto", transition: "border-color 0.2s ease" },
    label: { fontSize: 10, color: "#64748b", fontWeight: 600, marginBottom: 4, display: "block", letterSpacing: "0.02em", textTransform: "uppercase" },
    sectionLabel: { fontSize: 12, color: "#e2e8f0", fontWeight: 700, marginTop: 14, marginBottom: 3 }
  };
  return /* @__PURE__ */ jsxs("div", { style: S.root, children: [
    /* @__PURE__ */ jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap", rel: "stylesheet" }),
    /* @__PURE__ */ jsx("style", { children: `
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
      ` }),
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { flexShrink: 0, filter: "drop-shadow(0 4px 12px rgba(249,115,22,0.3))" }, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "logoGrad", x1: "0", y1: "0", x2: "44", y2: "44", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#f97316" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#ef4444" })
          ] }) }),
          /* @__PURE__ */ jsx("rect", { width: "44", height: "44", rx: "10", fill: "url(#logoGrad)" }),
          /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.2", fill: "none" }),
          /* @__PURE__ */ jsx("line", { x1: "22", y1: "10", x2: "22", y2: "26", stroke: "#fff", strokeWidth: "1.2", opacity: "0.4" }),
          /* @__PURE__ */ jsx("line", { x1: "14", y1: "18", x2: "30", y2: "18", stroke: "#fff", strokeWidth: "1.2", opacity: "0.4" }),
          /* @__PURE__ */ jsx("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "2.5", strokeLinecap: "round" }),
          /* @__PURE__ */ jsx("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.85" })
        ] }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }, children: "PADEL ANALYZER" })
      ] }),
      /* @__PURE__ */ jsx("p", { style: { color: "#475569", fontSize: 10, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }, children: "Recherche web \xB7 Notation calibr\xE9e \xB7 Profil personnalisable" }),
      /* @__PURE__ */ jsxs("div", { style: { fontSize: 8, color: "#334155", marginTop: 4, fontFamily: "'Outfit'", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx("span", { children: "V7.0" }),
        /* @__PURE__ */ jsxs("span", { style: { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 10, padding: "1px 7px", color: "#f97316", fontSize: 8, fontWeight: 600 }, children: [
          "\u{1F5C3}\uFE0F ",
          rackets_db_default.length,
          localDBCount > 0 && /* @__PURE__ */ jsxs("span", { style: { color: "#22c55e" }, children: [
            " + ",
            localDBCount
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }, children: [["suggest", "\u{1F3AF} Sugg\xE8re-moi"], ["add", "+ Ajouter"], ["profile", "\u{1F464} Profil"], ["manage", "\u{1F5D1} G\xE9rer"]].map(([k, l]) => /* @__PURE__ */ jsx("button", { onClick: () => setPanel((p) => p === k ? null : k), style: { ...S.btn(panel === k), borderRadius: 20 }, children: l }, k)) }),
    panel === "suggest" && /* @__PURE__ */ jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsx("div", { style: S.title, children: "\u{1F3AF} RAQUETTES SUGG\xC9R\xC9ES POUR TON PROFIL" }),
      /* @__PURE__ */ jsxs("div", { style: { background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 10, padding: 10, marginBottom: 10 }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 10, color: "#f97316", fontWeight: 700, margin: "0 0 4px" }, children: "Ton profil :" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#94a3b8", margin: 0, lineHeight: 1.5 }, children: profileText })
      ] }),
      !suggestResults && !loading && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px", lineHeight: 1.4 }, children: [
          "Recherche des raquettes les plus adapt\xE9es \xE0 ton profil : ",
          /* @__PURE__ */ jsx("span", { style: { color: "#f97316", fontWeight: 600 }, children: "\u2B50 Coups de c\u0153ur" }),
          " (meilleures correspondances) et ",
          /* @__PURE__ */ jsx("span", { style: { color: "#fbbf24", fontWeight: 600 }, children: "\u26A1 Alternatives Priorit\xE9" }),
          " (orient\xE9es ",
          profile.priorityTags.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean).join(", ") || "tes priorit\xE9s",
          "). Coche celles qui t'int\xE9ressent puis valide en un clic."
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: suggestRackets, style: S.btnGreen, children: "\u{1F50D} Lancer la recherche" })
      ] }),
      loadMsg && /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, color: "#f97316", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }, children: [
        /* @__PURE__ */ jsx("span", { style: { display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }, children: "\u23F3" }),
        /* @__PURE__ */ jsx("span", { children: loadMsg }),
        /* @__PURE__ */ jsx("style", { children: `@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }` })
      ] }),
      error && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#ef4444", marginTop: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 10px", lineHeight: 1.4 }, children: error }),
      batchProgress && /* @__PURE__ */ jsx("div", { style: { fontSize: 12, color: "#4CAF50", marginTop: 8, fontWeight: 600 }, children: batchProgress }),
      suggestResults && /* @__PURE__ */ jsxs("div", { style: { marginTop: 6 }, children: [
        (() => {
          const hearts = suggestResults.filter((s) => s.category === "heart");
          const prios = suggestResults.filter((s) => s.category === "priority");
          const hasCategories = hearts.length > 0 || prios.length > 0;
          const topPicks = hasCategories ? hearts : suggestResults.slice(0, 4);
          const prioAlts = hasCategories ? prios : [];
          const others = hasCategories ? suggestResults.filter((s) => s.category !== "heart" && s.category !== "priority") : suggestResults.slice(4);
          const prioLabels = profile.priorityTags.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            topPicks.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 6 }, children: "\u2B50 Coups de c\u0153ur \u2014 meilleures correspondances :" }),
              topPicks.map((s) => {
                const ri = suggestResults.indexOf(s);
                return renderSuggestCard(s, ri, suggestChecked.has(ri), true);
              })
            ] }),
            prioAlts.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("p", { style: { fontSize: 11, color: "#fbbf24", fontWeight: 700, marginBottom: 4, marginTop: 14 }, children: [
                "\u26A1 Alternatives Priorit\xE9 \u2014 ",
                prioLabels.join(", "),
                " :"
              ] }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#64748b", marginBottom: 6 }, children: "Raquettes orient\xE9es vers tes priorit\xE9s, confort parfois limit\xE9 \u2014 \xE0 tester avant d'acheter." }),
              prioAlts.map((s) => {
                const ri = suggestResults.indexOf(s);
                return renderSuggestCard(s, ri, suggestChecked.has(ri), false);
              })
            ] }),
            others.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { style: { fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 6, marginTop: 12 }, children: "\u{1F4CB} Autres suggestions :" }),
              others.map((s) => {
                const ri = suggestResults.indexOf(s);
                return renderSuggestCard(s, ri, suggestChecked.has(ri), false);
              })
            ] })
          ] });
        })(),
        !addingBatch && suggestResults && suggestResults.length > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => {
            const allIdxs = suggestResults.map((_, i) => i).filter((i) => !suggestResults[i]._added);
            const allSelected = allIdxs.every((i) => suggestChecked.has(i));
            if (allSelected) setSuggestChecked(/* @__PURE__ */ new Set());
            else setSuggestChecked(new Set(allIdxs));
          }, style: { ...S.btn(false), padding: "8px 14px", fontSize: 11 }, children: suggestResults.filter((_, i) => !suggestResults[i]._added).every((_, i) => suggestChecked.has(i)) ? "\u2610 Tout d\xE9s\xE9lectionner" : "\u2611 Tout s\xE9lectionner" }),
          suggestChecked.size > 0 && /* @__PURE__ */ jsxs("button", { onClick: addCheckedSuggestions, style: { ...S.btnGreen, flex: 1, padding: "8px 14px" }, children: [
            "\u2705 Ajouter ",
            suggestChecked.size,
            " raquette",
            suggestChecked.size > 1 ? "s" : "",
            " au comparateur"
          ] })
        ] }),
        addingBatch && /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: "12px 0", color: "#f97316", fontSize: 12, fontWeight: 600 }, children: batchProgress }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setSuggestResults(null);
          setSuggestChecked(/* @__PURE__ */ new Set());
          setError("");
        }, style: { ...S.btn(false), marginTop: 8, width: "100%", padding: "8px 0", fontSize: 11 }, children: "\u{1F504} Relancer une nouvelle recherche" })
      ] })
    ] }),
    panel === "add" && /* @__PURE__ */ jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsx("div", { style: S.title, children: "\u{1F50D} RECHERCHER UNE RAQUETTE" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 8px", lineHeight: 1.4 }, children: 'Tape un nom m\xEAme approximatif : "nox tapia 12k", "bullpadel paquito", "babolat lebron"...' }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
        /* @__PURE__ */ jsx("input", { value: searchQ, onChange: (e) => setSearchQ(e.target.value), onKeyDown: (e) => e.key === "Enter" && !loading && searchRackets(), placeholder: "Ex: nox tapia 12k, adidas metalbone...", style: { ...S.input, flex: 1 } }),
        /* @__PURE__ */ jsx("button", { onClick: searchRackets, disabled: loading || !searchQ.trim(), style: { ...S.btn(true), opacity: loading ? 0.5 : 1, minWidth: 80 }, children: loading && !suggestions ? "..." : "Chercher" })
      ] }),
      loadMsg && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#f97316", marginTop: 8 }, children: loadMsg }),
      error && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#ef4444", marginTop: 8 }, children: error }),
      suggestions && /* @__PURE__ */ jsxs("div", { style: { marginTop: 10 }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 }, children: "\u{1F4CB} R\xE9sultats \u2014 clique sur celle que tu veux ajouter :" }),
        suggestions.map((s, i) => /* @__PURE__ */ jsxs("div", { onClick: () => !s._disabled && selectSuggestion(i), style: {
          background: s._selected ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${s._selected ? "#f97316" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 10,
          padding: "10px 12px",
          marginBottom: 6,
          cursor: s._disabled ? "default" : "pointer",
          opacity: s._disabled && !s._selected ? 0.3 : 1,
          transition: "all 0.2s"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: 12, fontWeight: 700, color: "#e2e8f0" }, children: s.name }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 10, color: "#94a3b8", marginTop: 2 }, children: [
            s.brand,
            " \xB7 ",
            s.shape,
            " \xB7 ",
            s.weight
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 10, color: "#64748b", marginTop: 1 }, children: s.description })
        ] }, i))
      ] })
    ] }),
    panel === "profile" && /* @__PURE__ */ jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsx("div", { style: S.title, children: "\u{1F464} MON PROFIL JOUEUR" }),
      /* @__PURE__ */ jsxs("div", { style: { background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, padding: 10, marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
          /* @__PURE__ */ jsx("input", { value: profileName, onChange: (e) => setProfileName(e.target.value), placeholder: "Nom du profil (ex: Bidou Comp\xE9tition)", style: { ...S.input, flex: 1, fontSize: 11, margin: 0 } }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            if (!profileName.trim()) {
              alert("Donne un nom au profil d'abord");
              return;
            }
            const list = saveNamedProfile(profileName.trim(), profile);
            setSavedProfiles(list);
          }, style: { padding: "6px 12px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 8, color: "#818cf8", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }, children: "\u{1F4BE} Sauvegarder" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setProfile({ ...INITIAL_PROFILE });
            setProfileName("");
          }, style: { padding: "6px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#64748b", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }, children: "+ Nouveau" })
        ] }),
        savedProfiles.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: savedProfiles.map((sp) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setProfile({ ...INITIAL_PROFILE, ...sp.profile });
            setProfileName(sp.name);
          }, style: { padding: "4px 8px", background: profileName === sp.name ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${profileName === sp.name ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 6, color: profileName === sp.name ? "#a5b4fc" : "#94a3b8", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }, children: sp.name }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            if (!confirm(`Supprimer le profil "${sp.name}" ?`)) return;
            const list = deleteNamedProfile(sp.name);
            setSavedProfiles(list);
          }, style: { background: "none", border: "none", color: "#64748b", fontSize: 10, cursor: "pointer", padding: "2px", fontFamily: "inherit" }, children: "\u2715" })
        ] }, sp.name)) }),
        savedProfiles.length === 0 && /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#475569", margin: 0 }, children: "Aucun profil sauvegard\xE9. Remplis les champs puis clique \u{1F4BE} Sauvegarder." })
      ] }),
      (Number(profile.age) > 0 && Number(profile.age) < 15 || Number(profile.height) > 0 && Number(profile.height) < 150) && /* @__PURE__ */ jsx("div", { style: { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: "8px 10px", marginBottom: 10, fontSize: 10, color: "#60a5fa", fontWeight: 600 }, children: "\u{1F9D2} Profil junior d\xE9tect\xE9 \u2014 les suggestions proposeront des raquettes adapt\xE9es (poids l\xE9ger, grip r\xE9duit, prix ajust\xE9s)" }),
      Number(profile.age) >= 50 && /* @__PURE__ */ jsx("div", { style: { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 10px", marginBottom: 10, fontSize: 10, color: "#fbbf24", fontWeight: 600 }, children: "\u{1F464} Profil 50+ \u2014 le scoring renforce automatiquement Confort, Tol\xE9rance et Maniabilit\xE9" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px", lineHeight: 1.4 }, children: 'Configure ton profil puis clique "R\xE9-analyser" pour recalculer les verdicts.' }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "\xC2ge" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: profile.age, onChange: (e) => setProfile((p) => ({ ...p, age: Number(e.target.value) })), style: S.input })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "Taille (cm)" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: profile.height, onChange: (e) => setProfile((p) => ({ ...p, height: Number(e.target.value) })), placeholder: "175", style: S.input })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "Poids (kg)" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: profile.weight, onChange: (e) => setProfile((p) => ({ ...p, weight: Number(e.target.value) })), style: S.input })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "Niveau" }),
          /* @__PURE__ */ jsx("select", { value: profile.level, onChange: (e) => setProfile((p) => ({ ...p, level: e.target.value })), style: S.select, children: LEVEL_OPTIONS.map((o) => /* @__PURE__ */ jsxs("option", { value: o.value, children: [
            o.label,
            " \u2014 ",
            o.desc
          ] }, o.value)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "Main" }),
          /* @__PURE__ */ jsx("select", { value: profile.hand, onChange: (e) => setProfile((p) => ({ ...p, hand: e.target.value })), style: S.select, children: HAND_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: o }, o)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "C\xF4t\xE9 de jeu" }),
          /* @__PURE__ */ jsx("select", { value: profile.side, onChange: (e) => setProfile((p) => ({ ...p, side: e.target.value })), style: S.select, children: SIDE_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: o }, o)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "Fr\xE9quence" }),
          /* @__PURE__ */ jsx("select", { value: profile.frequency, onChange: (e) => setProfile((p) => ({ ...p, frequency: e.target.value })), style: S.select, children: FREQ_OPTIONS.map((o) => /* @__PURE__ */ jsxs("option", { value: o.value, children: [
            o.label,
            " \u2014 ",
            o.desc
          ] }, o.value)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: S.label, children: "Comp\xE9tition" }),
          /* @__PURE__ */ jsxs("select", { value: profile.competition ? "oui" : "non", onChange: (e) => setProfile((p) => ({ ...p, competition: e.target.value === "oui" })), style: S.select, children: [
            /* @__PURE__ */ jsx("option", { value: "non", children: "Non" }),
            /* @__PURE__ */ jsx("option", { value: "oui", children: "Oui" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pa-section", style: { borderColor: "#9C27B0" }, children: /* @__PURE__ */ jsx("div", { style: S.sectionLabel, children: "\u{1F3F7} Marques pr\xE9f\xE9r\xE9es" }) }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#475569", margin: "0 0 4px", paddingLeft: 13 }, children: "Les suggestions prioriseront ces marques (vide = toutes)" }),
      /* @__PURE__ */ jsx(TagGroup, { tags: BRAND_TAGS, selected: profile.brandTags, onToggle: (id) => toggleTag("brandTags", id), color: "#9C27B0" }),
      /* @__PURE__ */ jsx("div", { className: "pa-section", style: { borderColor: "#f97316" }, children: /* @__PURE__ */ jsx("div", { style: S.sectionLabel, children: "\u{1F3BE} Style de jeu" }) }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#475569", margin: "0 0 4px", paddingLeft: 13 }, children: "Clique sur les tags qui te correspondent" }),
      /* @__PURE__ */ jsx(TagGroup, { tags: STYLE_TAGS, selected: profile.styleTags, onToggle: (id) => toggleTag("styleTags", id), color: "#f97316" }),
      /* @__PURE__ */ jsx("input", { value: profile.styleExtra, onChange: (e) => setProfile((p) => ({ ...p, styleExtra: e.target.value })), placeholder: "Pr\xE9cisions libres (optionnel)...", style: { ...S.input, marginTop: 8, fontSize: 10 } }),
      /* @__PURE__ */ jsx("div", { className: "pa-section", style: { borderColor: "#ef4444" }, children: /* @__PURE__ */ jsx("div", { style: S.sectionLabel, children: "\u{1FA79} Blessures / Contraintes" }) }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#475569", margin: "0 0 4px", paddingLeft: 13 }, children: "Impacte directement le crit\xE8re Confort dans les verdicts" }),
      /* @__PURE__ */ jsx(TagGroup, { tags: INJURY_TAGS, selected: profile.injuryTags, onToggle: (id) => toggleTag("injuryTags", id), color: "#ef4444" }),
      /* @__PURE__ */ jsx("input", { value: profile.injuryExtra, onChange: (e) => setProfile((p) => ({ ...p, injuryExtra: e.target.value })), placeholder: "Pr\xE9cisions libres (optionnel)...", style: { ...S.input, marginTop: 8, fontSize: 10 } }),
      /* @__PURE__ */ jsx("div", { className: "pa-section", style: { borderColor: "#4CAF50" }, children: /* @__PURE__ */ jsx("div", { style: S.sectionLabel, children: "\u{1F3AF} Priorit\xE9" }) }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#475569", margin: "0 0 4px", paddingLeft: 13 }, children: "Ce que tu recherches en priorit\xE9 dans ta raquette" }),
      /* @__PURE__ */ jsx(TagGroup, { tags: PRIORITY_TAGS, selected: profile.priorityTags, onToggle: (id) => toggleTag("priorityTags", id), color: "#4CAF50" }),
      /* @__PURE__ */ jsx("input", { value: profile.priorityExtra, onChange: (e) => setProfile((p) => ({ ...p, priorityExtra: e.target.value })), placeholder: "Pr\xE9cisions libres (optionnel)...", style: { ...S.input, marginTop: 8, fontSize: 10 } }),
      /* @__PURE__ */ jsx("button", { onClick: reanalyzeAll, disabled: loading, style: { ...S.btnGreen, marginTop: 14 }, children: loading ? loadMsg || "..." : "\u{1F504} R\xE9-analyser toutes les raquettes" }),
      error && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#ef4444", marginTop: 8 }, children: error })
    ] }),
    panel === "manage" && /* @__PURE__ */ jsxs("div", { style: S.card, children: [
      /* @__PURE__ */ jsx("div", { style: S.title, children: "\u{1F5D1} G\xC9RER LES RAQUETTES" }),
      rackets.length === 0 && /* @__PURE__ */ jsx("p", { style: { color: "#64748b", fontSize: 11, textAlign: "center", padding: "12px 0" }, children: 'Aucune raquette. Utilise "\u{1F3AF} Sugg\xE8re-moi" ou "+ Ajouter" pour commencer.' }),
      rackets.map((r) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: r.color } }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 11, color: "#e2e8f0" }, children: r.name })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => removeRacket(r.id), style: { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "3px 8px", color: "#ef4444", fontSize: 10, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }, children: "Supprimer" })
      ] }, r.id)),
      rackets.length > 1 && /* @__PURE__ */ jsx("button", { onClick: () => {
        if (confirm("Supprimer toutes les raquettes ?")) {
          setRackets([]);
          setSelected([]);
        }
      }, style: { ...S.btn(false), width: "100%", marginTop: 12, padding: "8px 0", fontSize: 11, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }, children: "\u{1F5D1} Tout effacer" }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }, children: "\u{1F5C3}\uFE0F BASE DE DONN\xC9ES" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.06)" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 9, color: "#64748b" }, children: "Embarqu\xE9es" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: "#f97316", fontFamily: "'Outfit'" }, children: rackets_db_default.length })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 14, color: "#334155" }, children: "+" }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.06)" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 9, color: "#64748b" }, children: "Apprises (local)" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: localDBCount > 0 ? "#22c55e" : "#334155", fontFamily: "'Outfit'" }, children: localDBCount })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 14, color: "#334155" }, children: "=" }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, background: "rgba(249,115,22,0.05)", borderRadius: 8, padding: "6px 10px", border: "1px solid rgba(249,115,22,0.15)" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 9, color: "#f97316" }, children: "Total" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Outfit'" }, children: rackets_db_default.length + localDBCount })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ jsxs("button", { onClick: exportLocalDB, disabled: localDBCount === 0, style: { ...S.btn(false), flex: 1, padding: "7px 0", fontSize: 10, opacity: localDBCount === 0 ? 0.4 : 1, cursor: localDBCount === 0 ? "default" : "pointer" }, children: [
            "\u{1F4E4} Exporter local (",
            localDBCount,
            ")"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: clearLocalDB, disabled: localDBCount === 0, style: { ...S.btn(false), flex: 1, padding: "7px 0", fontSize: 10, color: "#ef4444", borderColor: "rgba(239,68,68,0.2)", opacity: localDBCount === 0 ? 0.4 : 1, cursor: localDBCount === 0 ? "default" : "pointer" }, children: "\u{1F9F9} Vider local" })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 8, color: "#475569", margin: "6px 0 0", lineHeight: 1.4 }, children: "Les raquettes \xAB apprises \xBB sont celles trouv\xE9es via recherche web. Exporte-les pour les int\xE9grer \xE0 la base embarqu\xE9e." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10, marginBottom: 20 }, children: [
      rackets.length === 0 && /* @__PURE__ */ jsxs("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: "30px 16px", color: "#64748b", fontSize: 12 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "\u{1F3BE}" }),
        /* @__PURE__ */ jsx("p", { style: { margin: "0 0 4px", fontWeight: 600, color: "#94a3b8" }, children: "Aucune raquette" }),
        /* @__PURE__ */ jsxs("p", { style: { margin: 0 }, children: [
          "Clique sur ",
          /* @__PURE__ */ jsx("strong", { children: "\u{1F3AF} Sugg\xE8re-moi" }),
          " pour des recommandations personnalis\xE9es",
          /* @__PURE__ */ jsx("br", {}),
          "ou ",
          /* @__PURE__ */ jsx("strong", { children: "+ Ajouter" }),
          " pour chercher un mod\xE8le pr\xE9cis"
        ] })
      ] }),
      rackets.map((r) => {
        const isSel = selected.includes(r.id);
        const fy = fyConfig[computeForYou(r.scores, profile)] || fyConfig.partial;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            className: "pa-card",
            onClick: () => toggleRacket(r.id),
            onMouseEnter: () => setHoveredRacket(r.id),
            onMouseLeave: () => setHoveredRacket(null),
            style: {
              background: isSel ? `linear-gradient(165deg,${r.color}18,${r.color}08,transparent)` : "rgba(255,255,255,0.02)",
              border: `2px solid ${isSel ? r.color + "cc" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 14,
              padding: "12px 10px",
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
              fontFamily: "'Inter',sans-serif",
              boxShadow: isSel ? `0 4px 16px ${r.color}22` : "0 2px 8px rgba(0,0,0,0.15)",
              transform: hoveredRacket === r.id ? "translateY(-3px) scale(1.02)" : "none",
              transition: "all 0.2s ease"
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "pa-badge", style: { position: "absolute", top: -8, right: 8, background: fy.bg + "dd", border: `1px solid ${fy.border}`, borderRadius: 20, padding: "2px 8px", fontSize: 7, fontWeight: 700, color: "#fff", letterSpacing: "0.03em", boxShadow: `0 2px 8px ${fy.bg}44` }, children: fy.text }),
              r.imageUrl && /* @__PURE__ */ jsx("img", { src: r.imageUrl, alt: "", style: { width: 38, height: 38, objectFit: "contain", borderRadius: 6, marginBottom: 4, background: "rgba(255,255,255,0.06)" }, onError: (e) => {
                e.target.style.display = "none";
              } }),
              /* @__PURE__ */ jsx("div", { style: { width: 8, height: 8, borderRadius: "50%", background: r.color, marginBottom: 6, boxShadow: isSel ? `0 0 8px ${r.color}` : "none", transition: "box-shadow 0.2s ease" } }),
              /* @__PURE__ */ jsx("div", { style: { fontSize: 11, fontWeight: 700, color: isSel ? "#fff" : "#94a3b8", lineHeight: 1.3, transition: "color 0.2s ease" }, children: r.shortName }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: 9, color: "#475569", marginTop: 3 }, children: [
                r.shape,
                " \xB7 ",
                r.weight
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: 9, color: "#475569" }, children: [
                r.brand,
                " \xB7 ",
                r.price
              ] }),
              r._incomplete && /* @__PURE__ */ jsx("div", { onClick: (e) => {
                e.stopPropagation();
                rescoreRacket(r.id);
              }, style: { position: "absolute", bottom: 4, right: 4, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: 6, padding: "2px 6px", fontSize: 8, color: "#f97316", fontWeight: 700, cursor: "pointer" }, children: "\u{1F504} Re-scorer" })
            ]
          },
          r.id
        );
      })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 2, marginBottom: 18, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.04)" }, children: [["radar", "\u{1F578} Radar"], ["bars", "\u{1F4CA} Barres"], ["table", "\u{1F4CB} D\xE9tails"], ["fit", "\u{1F3AF} Pertinence"]].map(([k, l]) => /* @__PURE__ */ jsx("button", { className: `pa-tab ${tab === k ? "pa-tab-active" : ""}`, onClick: () => setTab(k), style: { flex: 1, padding: "9px 0", background: tab === k ? "rgba(255,255,255,0.06)" : "transparent", border: "none", borderRadius: 9, color: tab === k ? "#fff" : "#64748b", fontSize: 11, fontWeight: tab === k ? 700 : 500, cursor: "pointer", fontFamily: "'Inter',sans-serif", letterSpacing: "-0.01em", transition: "all 0.2s ease" }, children: l }, k)) }),
    tab === "radar" && /* @__PURE__ */ jsxs("div", { style: { ...S.card, padding: 20, position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx("style", { children: `
          @keyframes racketFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        ` }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 0, minHeight: 400 }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 280, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }, children: (() => {
          const hr = hoveredRacket ? selRackets.find((r) => r.id === hoveredRacket) : null;
          if (!hr || !hr.imageUrl) return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.3 }, children: [
            /* @__PURE__ */ jsx("div", { style: { width: 100, height: 100, borderRadius: "50%", border: "2px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }, children: /* @__PURE__ */ jsx("span", { style: { fontSize: 32, opacity: 0.4 }, children: "\u{1F446}" }) }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 10, color: "#334155", textAlign: "center", lineHeight: 1.4 }, children: [
              "Survole une raquette",
              /* @__PURE__ */ jsx("br", {}),
              "pour voir son visuel"
            ] })
          ] });
          return /* @__PURE__ */ jsxs("div", { style: { animation: "racketFadeIn 0.3s ease-out", textAlign: "center" }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              background: "rgba(255,255,255,0.03)",
              border: `2px solid ${hr.color}40`,
              borderRadius: 20,
              padding: 20,
              boxShadow: `0 0 40px ${hr.color}15, inset 0 0 20px ${hr.color}08`,
              transition: "border-color 0.3s ease"
            }, children: /* @__PURE__ */ jsx("img", { src: hr.imageUrl, alt: hr.name, style: {
              width: 240,
              height: 280,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))"
            }, onError: (e) => {
              e.target.style.display = "none";
            } }) }),
            /* @__PURE__ */ jsxs("div", { style: { marginTop: 12 }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 13, fontWeight: 700, color: hr.color, lineHeight: 1.2 }, children: hr.name }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: 10, color: "#64748b", marginTop: 4 }, children: [
                hr.shape,
                " \xB7 ",
                hr.weight
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { fontSize: 10, color: "#64748b" }, children: [
                hr.brand,
                hr.price && hr.price !== "\u2014" ? ` \xB7 ${hr.price}` : ""
              ] }),
              hr.player && hr.player !== "\u2014" && /* @__PURE__ */ jsxs("div", { style: { fontSize: 9, color: "#475569", marginTop: 3 }, children: [
                "\u{1F3BE} ",
                hr.player
              ] })
            ] })
          ] }, hr.id);
        })() }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0, position: "relative" }, children: [
          /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 400, children: /* @__PURE__ */ jsxs(RadarChart, { data: radarData, cx: "50%", cy: "50%", outerRadius: "75%", children: [
            /* @__PURE__ */ jsx(PolarGrid, { stroke: "rgba(255,255,255,0.12)", strokeDasharray: "3 3", gridType: "polygon" }),
            /* @__PURE__ */ jsx(PolarAngleAxis, { dataKey: "attribute", tick: { fill: "#94a3b8", fontSize: 11, fontWeight: 600, fontFamily: "Inter" } }),
            /* @__PURE__ */ jsx(PolarRadiusAxis, { angle: 90, domain: [0, 10], tick: { fill: "#64748b", fontSize: 9, fontWeight: 500 }, tickCount: 6, axisLine: false }),
            /* @__PURE__ */ jsx(
              Radar,
              {
                name: "\u2014 10/10 \u2014",
                dataKey: "\u2014 10/10 \u2014",
                stroke: "rgba(255,255,255,0.25)",
                fill: "none",
                strokeWidth: 1.5,
                strokeDasharray: "6 3",
                strokeOpacity: 1,
                fillOpacity: 0,
                dot: false,
                legendType: "none"
              }
            ),
            selRackets.map((r, i) => {
              const isHovered = hoveredRacket === r.id;
              const anyHovered = hoveredRacket !== null;
              return /* @__PURE__ */ jsx(
                Radar,
                {
                  name: r.shortName,
                  dataKey: r.shortName,
                  stroke: r.color,
                  fill: r.color,
                  fillOpacity: isHovered ? 0.35 : anyHovered ? 0.03 : 0.08 + i * 0.03,
                  strokeWidth: isHovered ? 3.5 : anyHovered ? 1 : 2.5,
                  strokeOpacity: isHovered ? 1 : anyHovered ? 0.3 : 1
                },
                r.id
              );
            }),
            /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 10, color: "#94a3b8", paddingTop: 10, fontFamily: "Inter" } })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { style: { position: "absolute", top: 8, right: 12, fontSize: 9, color: "#475569", display: "flex", alignItems: "center", gap: 5 }, children: [
            /* @__PURE__ */ jsx("svg", { width: "20", height: "8", children: /* @__PURE__ */ jsx("line", { x1: "0", y1: "4", x2: "20", y2: "4", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1.5", strokeDasharray: "4 2" }) }),
            /* @__PURE__ */ jsx("span", { children: "Score parfait 10/10" })
          ] })
        ] })
      ] })
    ] }),
    tab === "bars" && /* @__PURE__ */ jsx("div", { style: { ...S.card, padding: 20 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 360, children: /* @__PURE__ */ jsxs(BarChart, { data: radarData, layout: "vertical", margin: { left: 80, right: 20 }, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.04)" }),
      /* @__PURE__ */ jsx(XAxis, { type: "number", domain: [0, 10], tick: { fill: "#475569", fontSize: 9, fontFamily: "Inter" } }),
      /* @__PURE__ */ jsx(YAxis, { dataKey: "attribute", type: "category", tick: { fill: "#94a3b8", fontSize: 10, fontWeight: 600, fontFamily: "Inter" }, width: 75 }),
      /* @__PURE__ */ jsx(Tooltip, { contentStyle: { background: "#1a2236", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 11, fontFamily: "Inter", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" } }),
      selRackets.map((r) => /* @__PURE__ */ jsx(Bar, { dataKey: r.shortName, fill: r.color, radius: [0, 5, 5, 0], barSize: 10 }, r.id))
    ] }) }) }),
    tab === "table" && /* @__PURE__ */ jsx("div", { style: { ...S.card, overflowX: "auto" }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 10 }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { style: { textAlign: "left", padding: "8px 6px", color: "#475569", borderBottom: "2px solid rgba(255,255,255,0.06)", fontSize: 9, letterSpacing: "0.03em" } }),
        selRackets.map((r) => /* @__PURE__ */ jsx("th", { style: { textAlign: "center", padding: "8px 4px", color: r.color, fontWeight: 700, borderBottom: "2px solid rgba(255,255,255,0.06)", fontSize: 9, minWidth: 85, fontFamily: "'Outfit'", letterSpacing: "0.02em" }, children: r.shortName }, r.id))
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        [{ l: "Marque", k: "brand" }, { l: "Forme", k: "shape" }, { l: "Poids", k: "weight" }, { l: "\xC9quilibre", k: "balance" }, { l: "Surface", k: "surface" }, { l: "Mousse", k: "core" }, { l: "Joueur", k: "player" }, { l: "Prix indicatif", k: "price" }].map((row, i) => /* @__PURE__ */ jsxs("tr", { className: "pa-row", style: { background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }, children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "6px 6px", color: "#94a3b8", fontWeight: 600, fontSize: 10 }, children: row.l }),
          selRackets.map((r) => /* @__PURE__ */ jsx("td", { style: { padding: "6px 4px", textAlign: "center", color: "#cbd5e1", fontSize: 10 }, children: r[row.k] }, r.id))
        ] }, row.k)),
        /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: selRackets.length + 1, style: { padding: "12px 6px 4px", color: "#f97316", fontWeight: 700, fontSize: 10, borderTop: "2px solid rgba(249,115,22,0.15)", fontFamily: "'Outfit'", letterSpacing: "0.04em", textTransform: "uppercase" }, children: "Notes brutes /10" }) }),
        selRackets.some((r) => r.refSource) && /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { style: { padding: "2px 6px", fontSize: 8, color: "#334155", fontStyle: "italic" }, children: "Source" }),
          selRackets.map((r) => /* @__PURE__ */ jsx("td", { style: { padding: "2px 4px", textAlign: "center", fontSize: 7, color: "#334155", fontStyle: "italic" }, children: r.refSource || "R\xE8gles m\xE9ca." }, r.id))
        ] }),
        ATTRS.map((attr, i) => {
          const mx = Math.max(...selRackets.map((r) => r.scores[attr]));
          return /* @__PURE__ */ jsxs("tr", { className: "pa-row", style: { background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }, children: [
            /* @__PURE__ */ jsx("td", { style: { padding: "6px 6px", color: "#94a3b8", fontWeight: 600 }, children: attr }),
            selRackets.map((r) => {
              const v = r.scores[attr];
              const best = v === mx && selRackets.length > 1;
              return /* @__PURE__ */ jsx("td", { style: { padding: "6px 4px", textAlign: "center" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }, children: [
                /* @__PURE__ */ jsx("span", { style: { color: best ? "#4ade80" : "#cbd5e1", fontWeight: best ? 700 : 500, fontFamily: "'Outfit'", fontSize: 12 }, children: v }),
                /* @__PURE__ */ jsx("div", { style: { width: "70%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }, children: /* @__PURE__ */ jsx("div", { style: { width: `${v * 10}%`, height: "100%", borderRadius: 2, background: v >= 8 ? r.color : v >= 6.5 ? "#64748b" : "#ef444466", transition: "width 0.4s ease" } }) })
              ] }) }, r.id);
            })
          ] }, attr);
        }),
        (() => {
          const avgs = selRackets.map((r) => Math.round(ATTRS.reduce((s, a) => s + r.scores[a], 0) / ATTRS.length * 10) / 10);
          const mxA = Math.max(...avgs);
          return /* @__PURE__ */ jsxs("tr", { style: { borderTop: "2px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.04)" }, children: [
            /* @__PURE__ */ jsx("td", { style: { padding: "10px 6px", color: "#f97316", fontWeight: 800, fontSize: 11, fontFamily: "'Outfit'" }, children: "\u2B50 MOYENNE" }),
            selRackets.map((r, i) => {
              const a = avgs[i];
              const best = a === mxA && selRackets.length > 1;
              return /* @__PURE__ */ jsxs("td", { style: { padding: "10px 4px", textAlign: "center", color: best ? "#4ade80" : "#f97316", fontWeight: 800, fontSize: 14, fontFamily: "'Outfit'" }, children: [
                a,
                /* @__PURE__ */ jsx("span", { style: { fontSize: 9, color: "#64748b", fontWeight: 500 }, children: "/10" })
              ] }, r.id);
            })
          ] });
        })()
      ] })
    ] }) }),
    tab === "fit" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { children: `
          @media print {
            * { box-sizing: border-box !important; }
            body * { visibility: hidden !important; }
            #print-pertinence, #print-pertinence * { visibility: visible !important; }
            #print-pertinence {
              position: absolute !important; left: 0 !important; top: 0 !important;
              width: 100% !important; max-width: 100% !important;
              padding: 10mm 8mm !important;
              background: white !important; color: #1a1a1a !important;
              overflow: hidden !important; font-size: 10px !important;
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
            @page { margin: 8mm 6mm; size: A4; }
          }
        ` }),
      /* @__PURE__ */ jsxs("div", { id: "print-pertinence", style: S.card, children: [
        /* @__PURE__ */ jsx("div", { className: "print-header", style: { display: "none", marginBottom: 14 }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #f97316", paddingBottom: 10 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ jsxs("svg", { width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { flexShrink: 0 }, children: [
              /* @__PURE__ */ jsx("rect", { width: "44", height: "44", rx: "10", fill: "#f97316" }),
              /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.2", fill: "none" }),
              /* @__PURE__ */ jsx("line", { x1: "22", y1: "10", x2: "22", y2: "26", stroke: "#fff", strokeWidth: "1.2", opacity: "0.5" }),
              /* @__PURE__ */ jsx("line", { x1: "14", y1: "18", x2: "30", y2: "18", stroke: "#fff", strokeWidth: "1.2", opacity: "0.5" }),
              /* @__PURE__ */ jsx("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "2.5", strokeLinecap: "round" }),
              /* @__PURE__ */ jsx("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.9" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: 18, fontWeight: 800, color: "#f97316", fontFamily: "'Outfit'", letterSpacing: "-0.01em" }, children: "PADEL ANALYZER" }),
              /* @__PURE__ */ jsx("div", { style: { fontSize: 9, color: "#64748b", marginTop: 1 }, children: "Analyse de pertinence personnalis\xE9e" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { textAlign: "right" }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" }, children: profileName || "Analyse joueur" }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: 9, color: "#64748b", marginTop: 2 }, children: (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }, className: "no-print", children: [
          /* @__PURE__ */ jsx("div", { style: { flex: 1, fontSize: 12, fontWeight: 700, color: "#e2e8f0" }, children: profileName ? `\u{1F464} ${profileName}` : /* @__PURE__ */ jsx("span", { style: { color: "#475569", fontWeight: 400, fontSize: 11 }, children: "D\xE9finis un nom dans \u{1F464} Profil \u2192 \u{1F4BE} Sauvegarder" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => window.print(), style: { padding: "8px 16px", background: "rgba(249,115,22,0.2)", border: "1px solid #f97316", borderRadius: 8, color: "#f97316", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }, children: "\u{1F5A8} Imprimer" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "print-profile-box", style: { background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 10, padding: 10, marginBottom: 10, boxSizing: "border-box" }, children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: 10, color: "#f97316", fontWeight: 700, margin: "0 0 3px" }, children: "\u{1F464} Profil actif :" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 9, color: "#94a3b8", margin: 0, lineHeight: 1.5 }, children: profileText }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 8, color: "#475569", margin: "4px 0 0" }, children: (() => {
            const w = { Puissance: 1, Contr\u00F4le: 1, Confort: 1, Spin: 1, Maniabilit\u00E9: 1, Tol\u00E9rance: 1 };
            const prioMap = { confort: { Confort: 1.5 }, polyvalence: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.5, Tol\u00E9rance: 0.5 }, puissance: { Puissance: 1.5 }, controle: { Contr\u00F4le: 1.5 }, spin: { Spin: 1.5 }, legerete: { Maniabilit\u00E9: 1.5 }, protection: { Confort: 1.5 }, reprise: { Confort: 1.5, Tol\u00E9rance: 1, Maniabilit\u00E9: 0.5 } };
            const styleMap = { offensif: { Puissance: 0.5 }, defensif: { Contr\u00F4le: 0.5, Tol\u00E9rance: 0.5 }, tactique: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.3 }, puissant: { Puissance: 0.5, Spin: 0.3 }, veloce: { Maniabilit\u00E9: 0.8 }, endurant: { Confort: 0.5, Tol\u00E9rance: 0.3 }, contre: { Tol\u00E9rance: 0.5, Contr\u00F4le: 0.3 }, polyvalent: { Contr\u00F4le: 0.3, Tol\u00E9rance: 0.3 }, technique: { Contr\u00F4le: 0.5, Spin: 0.3 } };
            for (const tag of profile.priorityTags || []) {
              const b = prioMap[tag];
              if (b) for (const [k, v] of Object.entries(b)) w[k] = (w[k] || 1) + v;
            }
            for (const tag of profile.styleTags || []) {
              const b = styleMap[tag];
              if (b) for (const [k, v] of Object.entries(b)) w[k] = (w[k] || 1) + v;
            }
            const ARM = ["dos", "poignet", "coude", "epaule"];
            const LEG = ["genou", "cheville", "mollet", "hanche", "achille"];
            if ((profile.injuryTags || []).some((t) => ARM.includes(t))) w.Confort += 2;
            if ((profile.injuryTags || []).some((t) => LEG.includes(t))) w.Maniabilit\u00E9 += 1.5;
            const h = Number(profile.height) || 0;
            if (h > 0 && h < 170) w.Maniabilit\u00E9 += 0.5;
            if (h >= 185) w.Puissance += 0.3;
            const age = Number(profile.age) || 0;
            if (age >= 40) {
              w.Confort += 0.5;
              w.Tol\u00E9rance += 0.3;
            }
            if (age >= 50) {
              w.Confort += 0.5;
              w.Maniabilit\u00E9 += 0.5;
              w.Tol\u00E9rance += 0.3;
            }
            if (age >= 60) {
              w.Confort += 0.5;
              w.Tol\u00E9rance += 0.5;
            }
            const hand = profile.hand || "Droitier";
            const side = profile.side || "Droite";
            const isAtk = hand === "Droitier" && side === "Gauche" || hand === "Gaucher" && side === "Droite";
            const isCon = hand === "Droitier" && side === "Droite" || hand === "Gaucher" && side === "Gauche";
            if (isAtk) {
              w.Puissance += 0.5;
              w.Spin += 0.3;
            }
            if (isCon) {
              w.Contr\u00F4le += 0.5;
              w.Tol\u00E9rance += 0.3;
            }
            const sorted = Object.entries(w).sort((a, b) => b[1] - a[1]);
            const top = sorted.filter(([, v]) => v > 1.5).map(([k, v]) => `${k} ~${Math.round(v)}x`);
            return top.length ? `Crit\xE8res renforc\xE9s : ${top.join(", ")}.` : "";
          })() })
        ] }),
        (() => {
          const ranked = rackets.map((r) => ({ ...r, globalScore: computeGlobalScore(r.scores, profile) })).sort((a, b) => b.globalScore - a.globalScore);
          if (!ranked.length) return null;
          const best = ranked[0];
          const bestFy = computeForYou(best.scores, profile);
          return /* @__PURE__ */ jsxs("div", { style: { background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8, padding: "8px 10px", marginBottom: 12, fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, color: "#4ade80" }, children: "\u{1F4CA} En bref : " }),
            "Sur ",
            ranked.length,
            " raquette",
            ranked.length > 1 ? "s" : "",
            " analys\xE9e",
            ranked.length > 1 ? "s" : "",
            ", la ",
            /* @__PURE__ */ jsx("strong", { style: { color: "#e2e8f0" }, children: best.name }),
            " (",
            best.globalScore,
            "/10) est la plus adapt\xE9e \xE0 ton profil.",
            ranked.length >= 2 && /* @__PURE__ */ jsxs(Fragment, { children: [
              " Suivie par ",
              /* @__PURE__ */ jsx("strong", { style: { color: "#e2e8f0" }, children: ranked[1].name }),
              " (",
              ranked[1].globalScore,
              "/10)",
              ranked.length >= 3 && /* @__PURE__ */ jsxs(Fragment, { children: [
                " et ",
                /* @__PURE__ */ jsx("strong", { style: { color: "#e2e8f0" }, children: ranked[2].name }),
                " (",
                ranked[2].globalScore,
                "/10)"
              ] }),
              "."
            ] })
          ] });
        })(),
        rackets.length >= 3 && /* @__PURE__ */ jsx("div", { className: "print-section-title", style: { display: "none", fontSize: 12, fontWeight: 800, color: "#1a1a1a", marginBottom: 8, paddingBottom: 4 }, children: "\u{1F3C6} PODIUM \u2014 Top 3" }),
        (() => {
          const ranked = rackets.map((r) => ({ ...r, globalScore: computeGlobalScore(r.scores, profile) })).sort((a, b) => b.globalScore - a.globalScore);
          const cards = [];
          ranked.forEach((r, i) => {
            if (i === 3 && ranked.length > 3) {
              cards.push(/* @__PURE__ */ jsx("div", { className: "print-section-divider", style: { borderTop: "2px solid rgba(255,255,255,0.06)", margin: "12px 0 8px", paddingTop: 6 }, children: /* @__PURE__ */ jsx("div", { className: "print-section-title", style: { display: "none", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }, children: "\u{1F4CB} AUTRES RAQUETTES ANALYS\xC9ES" }) }, "divider"));
            }
            const forYouVal = computeForYou(r.scores, profile);
            const fy = fyConfig[forYouVal] || fyConfig.partial;
            const gs = r.globalScore;
            const medal = i === 0 ? "\u{1F947}" : i === 1 ? "\u{1F948}" : i === 2 ? "\u{1F949}" : "";
            const cardClass = "print-card" + (i === 0 ? " print-card-gold" : i === 1 ? " print-card-silver" : i === 2 ? " print-card-bronze" : "");
            const badgeClass = forYouVal === "recommended" ? "print-badge-green" : forYouVal === "no" ? "print-badge-red" : "print-badge-orange";
            const scoreClass = gs >= 7.5 ? "print-score-green" : gs >= 6.5 ? "print-score-yellow" : "print-score-red";
            const ARM_INJ = ["dos", "poignet", "coude", "epaule"];
            const LEG_INJ = ["genou", "cheville", "mollet", "hanche", "achille"];
            const ptags = profile.injuryTags || [];
            const hasArmInj = ptags.some((t) => ARM_INJ.includes(t));
            const hasLegInj = ptags.some((t) => LEG_INJ.includes(t));
            const criticalLow = hasArmInj && r.scores.Confort < 7;
            cards.push(/* @__PURE__ */ jsxs("div", { className: cardClass, style: {
              background: i === 0 ? "rgba(250,204,21,0.08)" : i === 1 ? "rgba(148,163,184,0.06)" : i === 2 ? "rgba(217,119,6,0.06)" : "rgba(255,255,255,0.02)",
              border: i === 0 ? "2px solid rgba(250,204,21,0.5)" : i === 1 ? "2px solid rgba(148,163,184,0.4)" : i === 2 ? "2px solid rgba(217,119,6,0.35)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: i < 3 ? "12px 14px" : "10px 12px",
              marginBottom: i < 3 ? 10 : 6,
              boxSizing: "border-box",
              overflow: "hidden",
              pageBreakInside: "avoid",
              breakInside: "avoid",
              borderLeft: i === 0 ? "8px solid rgba(250,204,21,0.7)" : i === 1 ? "6px solid rgba(148,163,184,0.5)" : i === 2 ? "6px solid rgba(217,119,6,0.5)" : void 0
            }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }, children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }, children: [
                  medal && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, minWidth: 36 }, children: [
                    /* @__PURE__ */ jsx("span", { style: { fontSize: i === 0 ? 28 : 24, lineHeight: 1 }, children: medal }),
                    /* @__PURE__ */ jsx("span", { className: "print-medal-label", style: { fontSize: 7, fontWeight: 800, letterSpacing: "0.02em", color: i === 0 ? "#b8860b" : i === 1 ? "#6b7280" : "#92400e", marginTop: 2, whiteSpace: "nowrap" }, children: i === 0 ? "MEILLEUR" : i === 1 ? "2\u1D49 choix" : "3\u1D49 choix" })
                  ] }),
                  r.imageUrl && /* @__PURE__ */ jsx("img", { src: r.imageUrl, alt: "", style: { width: i < 3 ? 36 : 28, height: i < 3 ? 36 : 28, objectFit: "contain", borderRadius: 4, flexShrink: 0, background: "rgba(255,255,255,0.06)" }, onError: (e) => {
                    e.target.style.display = "none";
                  } }),
                  !medal && /* @__PURE__ */ jsx("div", { style: { width: 10, height: 10, borderRadius: "50%", background: r.color, border: "1px solid #999", flexShrink: 0, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } }),
                  /* @__PURE__ */ jsxs("div", { style: { minWidth: 0, flex: 1 }, children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { fontSize: i === 0 ? 14 : i < 3 ? 13 : 11, fontWeight: 700, color: "#e2e8f0" }, children: r.name }),
                      /* @__PURE__ */ jsx("span", { className: `print-badge ${badgeClass}`, style: { background: fy.bg, border: `1px solid ${fy.border}`, borderRadius: 4, padding: "2px 6px", fontSize: 7, fontWeight: 700, color: "#fff", flexShrink: 0, whiteSpace: "nowrap" }, children: fy.text })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { style: { fontSize: 8, color: "#64748b", marginTop: 2 }, children: [
                      r.shape,
                      " \xB7 ",
                      r.weight,
                      " \xB7 ",
                      r.brand,
                      r.player && r.player !== "\u2014" ? ` \xB7 \u{1F3BE} ${r.player}` : "",
                      r.price && r.price !== "\u2014" ? ` \xB7 ${r.price}` : ""
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: scoreClass, style: { fontSize: i === 0 ? 28 : i < 3 ? 24 : 18, fontWeight: 800, color: gs >= 7.5 ? "#4ade80" : gs >= 6.5 ? "#fbbf24" : "#f87171", fontFamily: "'Outfit'", lineHeight: 1, flexShrink: 0, marginLeft: 10 }, children: [
                  gs,
                  /* @__PURE__ */ jsx("span", { style: { fontSize: 10, color: "#64748b" }, children: "/10" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4px 10px", marginBottom: 6 }, children: ATTRS.map((attr) => {
                const v = r.scores[attr];
                const isKey = attr === "Confort" && hasArmInj || attr === "Maniabilit\xE9" && (hasLegInj || (profile.styleTags || []).includes("veloce")) || (profile.priorityTags || []).some((t) => t === "confort" && attr === "Confort" || t === "polyvalence" && ["Contr\xF4le", "Tol\xE9rance", "Maniabilit\xE9"].includes(attr) || t === "puissance" && attr === "Puissance" || t === "controle" && attr === "Contr\xF4le" || t === "spin" && attr === "Spin" || t === "legerete" && attr === "Maniabilit\xE9" || t === "protection" && attr === "Confort" || t === "reprise" && ["Confort", "Tol\xE9rance", "Maniabilit\xE9"].includes(attr));
                const low = hasArmInj && attr === "Confort" && v < 7;
                const barClass = low ? "print-bar-fill-red" : v >= 7.5 ? "print-bar-fill-green" : v >= 6 ? "print-bar-fill-gray" : "print-bar-fill-yellow";
                return /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxs("span", { style: { fontSize: 8, color: isKey ? "#f97316" : "#64748b", fontWeight: isKey ? 700 : 400 }, children: [
                      isKey ? "\u2605 " : "",
                      attr
                    ] }),
                    /* @__PURE__ */ jsx("span", { style: { fontSize: 9, color: low ? "#f87171" : v >= 7.5 ? "#4ade80" : v >= 6 ? "#cbd5e1" : "#fbbf24", fontWeight: 700, flexShrink: 0, marginLeft: 4 }, children: v })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "print-bar-bg", style: { height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginTop: 2 }, children: /* @__PURE__ */ jsx("div", { className: barClass, style: { height: 4, borderRadius: 2, width: `${v * 10}%`, background: low ? "#f87171" : v >= 7.5 ? "#4ade80" : v >= 6 ? "#64748b" : "#fbbf24", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } }) })
                ] }, attr);
              }) }),
              criticalLow && /* @__PURE__ */ jsxs("div", { className: "print-warn", style: { fontSize: 9, color: "#f87171", fontWeight: 600, marginBottom: 3 }, children: [
                "\u26A0 Confort insuffisant (",
                r.scores.Confort,
                "/10) pour blessures ",
                ptags.filter((t) => ARM_INJ.includes(t)).map((t) => ({ dos: "Dos", poignet: "Poignet", coude: "Coude", epaule: "\xC9paule" })[t]).join("/"),
                " \u2014 risque de douleurs"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "print-verdict", style: { fontSize: 9, color: "#94a3b8", lineHeight: 1.5 }, children: r.verdict })
            ] }, r.id));
          });
          return cards;
        })(),
        /* @__PURE__ */ jsx("div", { className: "print-header", style: { display: "none", marginTop: 16, borderTop: "2px solid #e5e7eb", paddingTop: 8 }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
              /* @__PURE__ */ jsx("rect", { width: "44", height: "44", rx: "10", fill: "#f97316" }),
              /* @__PURE__ */ jsx("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.5", fill: "none" }),
              /* @__PURE__ */ jsx("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "3", strokeLinecap: "round" }),
              /* @__PURE__ */ jsx("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.9" })
            ] }),
            /* @__PURE__ */ jsxs("span", { style: { fontSize: 8, color: "#999" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#f97316", fontWeight: 700 }, children: "Padel Analyzer" }),
              " V7.0 \xB7 Scoring hybride calibr\xE9"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { fontSize: 8, color: "#999", textAlign: "right" }, children: [
            (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR"),
            " \xB7 Prix indicatifs \u2014 v\xE9rifier en boutique"
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { ...S.card, marginTop: 4 }, children: [
      /* @__PURE__ */ jsx("div", { style: S.title, children: "\u{1F4D6} Lexique des crit\xE8res" }),
      ATTRS.map((a) => /* @__PURE__ */ jsxs("div", { onClick: () => setOpenAttr((o) => o === a ? null : a), style: { padding: "8px 10px", marginBottom: 3, borderRadius: 10, background: openAttr === a ? "rgba(249,115,22,0.06)" : "transparent", cursor: "pointer", transition: "background 0.15s ease" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 11, fontWeight: 700, color: "#e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx("span", { children: a }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 9, color: "#475569", transition: "transform 0.2s ease", transform: openAttr === a ? "rotate(90deg)" : "none" }, children: "\u25B8" })
        ] }),
        openAttr === a && /* @__PURE__ */ jsx("div", { style: { fontSize: 10, color: "#94a3b8", marginTop: 5, lineHeight: 1.6, animation: "fadeIn 0.2s ease" }, children: explanations[a] })
      ] }, a))
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 8, color: "#334155", letterSpacing: "0.05em" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Outfit'", fontWeight: 600 }, children: "PADEL ANALYZER" }),
      " V7.0 \xB7 Analyse personnalis\xE9e \xB7 ",
      (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR"),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("span", { style: { fontSize: 7, opacity: 0.7 }, children: "Prix indicatifs \u2014 v\xE9rifier en boutique" })
    ] })
  ] });
  function renderSuggestCard(s, realIdx, checked, isTopPick) {
    const isPrio = s.category === "priority";
    const accentColor = isPrio ? "#fbbf24" : "#f97316";
    return /* @__PURE__ */ jsxs("div", { onClick: () => !s._added && toggleSuggestCheck(realIdx), style: {
      background: s._added ? "rgba(76,175,80,0.08)" : checked ? `${isPrio ? "rgba(251,191,36,0.12)" : "rgba(249,115,22,0.12)"}` : "rgba(255,255,255,0.04)",
      border: `1px solid ${s._added ? "#4CAF50" : checked ? accentColor : "rgba(255,255,255,0.1)"}`,
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 6,
      cursor: s._added ? "default" : "pointer",
      opacity: s._added ? 0.7 : 1,
      transition: "all 0.2s"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          !s._added && /* @__PURE__ */ jsx("div", { style: {
            width: 18,
            height: 18,
            borderRadius: 4,
            border: `2px solid ${checked ? accentColor : "rgba(255,255,255,0.2)"}`,
            background: checked ? `${accentColor}33` : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: accentColor,
            fontWeight: 700,
            flexShrink: 0
          }, children: checked ? "\u2713" : "" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, fontWeight: 700, color: "#e2e8f0" }, children: [
              isTopPick && !s._added ? "\u2B50 " : isPrio && !s._added ? "\u26A1 " : "",
              s.name
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { fontSize: 10, color: "#94a3b8", marginTop: 1 }, children: [
              s.brand,
              " \xB7 ",
              s.shape,
              " \xB7 ",
              s.weight,
              " \xB7 ",
              s.price
            ] })
          ] })
        ] }),
        s._added && /* @__PURE__ */ jsx("span", { style: { fontSize: 9, background: "#1B5E20", border: "1px solid #4CAF50", borderRadius: 4, padding: "2px 6px", color: "#fff", fontWeight: 700, flexShrink: 0 }, children: "AJOUT\xC9E \u2713" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 10, color: "#cbd5e1", marginTop: 5, lineHeight: 1.4, fontStyle: "italic", marginLeft: s._added ? 0 : 26 }, children: s.description }),
      s._error && /* @__PURE__ */ jsxs("div", { style: { fontSize: 9, color: "#ef4444", marginTop: 3, marginLeft: 26 }, children: [
        "\u26A0 Erreur: ",
        s._error
      ] })
    ] }, realIdx);
  }
}
export {
  PadelAnalyzer as default
};
