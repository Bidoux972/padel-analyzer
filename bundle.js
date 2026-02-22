var PadelApp = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // entry.jsx
  var import_react2 = __toESM(__require("react"));
  var import_client = __toESM(__require("react-dom/client"));

  // PadelAnalyzer.jsx
  var import_react = __toESM(__require("react"));
  var import_recharts = __require("recharts");

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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-adipower-multiweight-ctrl-3-4-2025-alex-ruiz.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-adipower-junior-3-4-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-adipower-light-3-4-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-adipower-multiweight-2023.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-3-4-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-3-4-hrd-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-youth-3-4-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-arrow-hit-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-arrow-hit-attack-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-arrow-hit-ctrl-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-arrow-hit-carbon-ctrl-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-arrow-hit-junior-pink-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-cross-it-light-2026-martita-ortega.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-cross-it-team-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-cross-it-team-light-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-drive-black-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-match-light-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-2026-ale-galan.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-ctrl-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-carbon-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-carbon-ctrl-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-hrd-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-team-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/adidas-metalbone-team-light-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-technical-viper-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-air-viper-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-alioth-mini-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-alioth-pro-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-contact-2023.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-counter-viper-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-rebel-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-revenge-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-technical-viper-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-air-viper-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-air-veron-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-air-viper-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-counter-veron-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-counter-viper-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-technical-veron-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-technical-viper-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-veron-3-0-2026-juan-lebron.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-vertuo-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-viper-3-0-2026-juan-lebron.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/babolat-viper-soft-3-0-2026-juan-lebron.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-04-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-flow-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-hack-03-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-hack-elite-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-hack-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-indiga-boy-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-03-2023.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-04-2025-juan-tello.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-elite-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-flow-legend-2026-alejandra-salazar.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-hack-04-2026-paquito-navarro.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-hack-04-comfort-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-hack-04-hybrid-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-icon-2026-juan-martin-diaz.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-neuron-02-2026-fede-chingotto.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-neuron-02-edge-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-05-2026-juan-tello.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-05-geo-2026-pablo-cardona.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-vertex-05-hybrid-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-xplo-2026-martin-di-nenno.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/bullpadel-xplo-comfort-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/drop-shot-conqueror-10-0-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/drop-shot-explorer-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/drop-shot-legend-4-0.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/dunlop-galactica-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/dunlop-galactica-pro-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/dunlop-rocket-ultra-yellow-2023.png",
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
      description: "Diamant l\xE9g\xE8re offensive. 12K Carbon + Soft EVA + Sonic Core Infinergy. Maniabilit\xE9 sans sacrifier puissance.",
      scores: {
        Puissance: 7.5,
        Contr\u00F4le: 7,
        Maniabilit\u00E9: 8,
        Confort: 7.5,
        Spin: 7.5,
        Tol\u00E9rance: 6.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/dunlop-fx-lite-2026.png",
      verdict: "Diamant l\xE9g\xE8re qui privil\xE9gie la maniabilit\xE9 sans sacrifier la frappe. Bon compromis pour attaquants qui veulent rester mobiles.",
      price: "170-230\u20AC"
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
      description: "Diamant puissance premium. 12K Carbon + Pro EVA + Force Bridge. Head heavy pour smashes d\xE9vastateurs.",
      scores: {
        Puissance: 9,
        Contr\u00F4le: 6.5,
        Maniabilit\u00E9: 6,
        Confort: 6,
        Spin: 7.5,
        Tol\u00E9rance: 5.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/dunlop-fx-pro-2026.png",
      verdict: "Arme offensive pure, balance haute et carbone 12K pour des smashes d\xE9vastateurs. R\xE9serv\xE9e aux bras solides et aux frappes engag\xE9es.",
      price: "200-260\u20AC"
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
      description: "Diamant accessible. SpinBoost + Power Holes + Force Bridge. Puissance contr\xF4l\xE9e pour progression.",
      scores: {
        Puissance: 7.5,
        Contr\u00F4le: 6,
        Maniabilit\u00E9: 7,
        Confort: 7.5,
        Spin: 7,
        Tol\u00E9rance: 6
      },
      imageUrl: "https://www.padelful.com/images/rackets/dunlop-fx-team-2026.png",
      verdict: "Entr\xE9e de gamme diamant accessible avec puissance contr\xF4l\xE9e. Bonne option pour progresser vers un jeu plus offensif sans se ruiner.",
      price: "130-180\u20AC"
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-pro-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-monster-kids-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-motion-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-motion-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-one-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-pro-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-gravity-motion-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-gravity-pro-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-gravity-team-light-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-one-ultralight-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-motion-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-one-x-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-pro-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-team-2025.png",
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
      imageUrl: "",
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
      imageUrl: "",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-coello-pro-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-coello-vibe-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-delta-elite-2022.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-delta-pro-2022.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-elite-ltd-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-evo-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-motion-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-one-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-pro-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-extreme-team-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-gravity-motion-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-gravity-pro-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-gravity-team-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-gravity-team-light-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-radical-motion-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-radical-pro-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-radical-team-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-radical-team-light-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-motion-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-one-x-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-pro-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-speed-team-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/head-vibe-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-ml10-pro-cup-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-genius-18k-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-genius-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-genius-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-genius-luxury-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-ml10-pro-cup-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-ml10-pro-cup-beginner-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-ml10-pro-cup-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-nerbo-wpt-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-luxury-genius-12k-alum-xtrem-2026-agustin-tapia.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-genius-12k-alum-xtrem-lite-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-luxury-genius-18k-alum-2026-agustin-tapia.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-at10-genius-attack-12k-alum-xtrem-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/nox-ventus-hybrid-12k-lite-2026.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/siux-electra-st3-junior-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/siux-beat-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/siux-diablo-black-carbon-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/siux-diablo-revolution-fucsia.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/siux-diablo-xtrem-carbon-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/siux-optimus-5.png",
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
      description: "Goutte interm\xE9diaire-avanc\xE9. Plus souple que le Pro, contr\xF4le et confort accrus. Progression Siux.",
      scores: {
        Puissance: 6.5,
        Contr\u00F4le: 7.5,
        Maniabilit\u00E9: 8,
        Confort: 8,
        Spin: 7,
        Tol\u00E9rance: 7.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/siux-diablo-elite-6-2026.png",
      verdict: "Goutte confortable et maniable, id\xE9ale pour monter en niveau en douceur. Polyvalente sans \xEAtre exceptionnelle dans un domaine.",
      price: "180-230\u20AC"
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
      description: "Goutte hybride polyvalente signature Libaak. Texture 3D + Ultra Soft EVA. Contr\xF4le-puissance \xE9quilibr\xE9.",
      scores: {
        Puissance: 7.5,
        Contr\u00F4le: 8,
        Maniabilit\u00E9: 7.5,
        Confort: 8,
        Spin: 8,
        Tol\u00E9rance: 7
      },
      imageUrl: "https://www.padelful.com/images/rackets/siux-diablo-pro-night-blue-2026.png",
      verdict: "Polyvalente haut de gamme avec un \xE9quilibre rare entre puissance et contr\xF4le. Son confort et son spin en font une valeur s\xFBre pour joueurs complets.",
      price: "300-350\u20AC",
      player: "Martin Di Nenno / Federico Libaak"
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
      description: "Goutte signature Stupaczuk. Anti-vibration + TeXtreme 18K. Puissance explosive avec polyvalence.",
      scores: {
        Puissance: 8.5,
        Contr\u00F4le: 7.5,
        Maniabilit\u00E9: 7,
        Confort: 7,
        Spin: 8,
        Tol\u00E9rance: 6.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/siux-electra-pro-fire-red-2026-franco-stupackzuk.png",
      verdict: "Puissance explosive en goutte d'eau \u2014 un profil rare. Le TeXtreme 18K frappe fort tout en gardant du contr\xF4le. Pour attaquants techniques.",
      price: "300-350\u20AC",
      player: "Franco Stupaczuk"
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
      description: "Diamant puissance max signature Augsburger. Balance haute + carbone TeXtreme. Offensif pur.",
      scores: {
        Puissance: 9.5,
        Contr\u00F4le: 6,
        Maniabilit\u00E9: 5.5,
        Confort: 5.5,
        Spin: 7.5,
        Tol\u00E9rance: 5
      },
      imageUrl: "https://www.padelful.com/images/rackets/siux-fenix-pro-black-2026-leo-ausburger.png",
      verdict: "Canon offensif sans concession : 9.5 en puissance mais confort et tol\xE9rance sacrifi\xE9s. Pour experts qui finissent les points au filet.",
      price: "300-350\u20AC",
      player: "Benjamin Augsburger"
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
      description: "Goutte polyvalente abordable. Contr\xF4le hybride et confort. Pour joueurs interm\xE9diaires ambitieux.",
      scores: {
        Puissance: 6.5,
        Contr\u00F4le: 7.5,
        Maniabilit\u00E9: 7.5,
        Confort: 8,
        Spin: 7,
        Tol\u00E9rance: 7.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/siux-pegasus-elite-4-2026.png",
      verdict: "Goutte polyvalente et confortable \xE0 prix contenu. Profil \xE9quilibr\xE9 sans pic \u2014 rassurante pour interm\xE9diaires qui cherchent de la r\xE9gularit\xE9.",
      price: "180-230\u20AC"
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
      description: "Goutte premium offensive. TeXtreme 18K + texture satin 3D. Puissance avec pr\xE9cision pour avanc\xE9s.",
      scores: {
        Puissance: 8,
        Contr\u00F4le: 7.5,
        Maniabilit\u00E9: 7,
        Confort: 7,
        Spin: 8,
        Tol\u00E9rance: 6.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/siux-pegasus-pro-storm-grey-2026.png",
      verdict: "Mont\xE9e en gamme avec TeXtreme 18K : plus de puissance et de spin que l'Elite. Pour avanc\xE9s qui veulent du mordant sans perdre en pr\xE9cision.",
      price: "300-350\u20AC"
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
      description: "Goutte signature Araujo, orientation f\xE9minine. Polyvalence puissance/contr\xF4le, poids mod\xE9r\xE9 pour maniabilit\xE9.",
      scores: {
        Puissance: 7.5,
        Contr\u00F4le: 8,
        Maniabilit\u00E9: 8,
        Confort: 7.5,
        Spin: 7.5,
        Tol\u00E9rance: 7
      },
      imageUrl: "https://www.padelful.com/images/rackets/siux-valkiria-pro-2026.png",
      verdict: "Polyvalente signature Araujo, poids contenu pour une maniabilit\xE9 sup\xE9rieure. Excellent ratio puissance/contr\xF4le, accessible aux gabarits l\xE9gers.",
      price: "280-350\u20AC",
      player: "Delfina Araujo"
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
      imageUrl: "https://www.padelful.com/images/rackets/starvie-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/starvie-metheora-galaxy-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/starvie-metheora-warrior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/starvie-raptor-2025.png",
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
      description: "Hybride flagship puissance. 24K Carbon Master + Dynamic Star ajustable. Anti-Vibe. Pour experts offensifs.",
      scores: {
        Puissance: 9,
        Contr\u00F4le: 7,
        Maniabilit\u00E9: 6.5,
        Confort: 6.5,
        Spin: 8,
        Tol\u00E9rance: 6
      },
      imageUrl: "https://www.padelful.com/images/rackets/star-vie-black-titan-2026.png",
      verdict: "Flagship hybride avec carbone 24K et syst\xE8me Dynamic Star. Puissance expert avec un contr\xF4le surprenant pour ce niveau de frappe.",
      price: "240-300\u20AC"
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
      description: "Goutte polyvalente iconique renouvel\xE9e. Dynamic Star + Spin Boost Tech Pro + Anti-Vibe. All-court avanc\xE9.",
      scores: {
        Puissance: 7,
        Contr\u00F4le: 8,
        Maniabilit\u00E9: 7.5,
        Confort: 7.5,
        Spin: 8,
        Tol\u00E9rance: 7.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/star-vie-raptor-2026-plus.png",
      verdict: "Goutte all-court renouvel\xE9e : spin et contr\xF4le en vedette avec un confort correct. Polyvalente fiable pour joueurs avanc\xE9s complets.",
      price: "200-260\u20AC"
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
      description: "Diamant \xE9quilibr\xE9e. Plus souple que Power, bon compromis puissance/contr\xF4le. TriTech Core + Z-Shock.",
      scores: {
        Puissance: 8,
        Contr\u00F4le: 7,
        Maniabilit\u00E9: 6.5,
        Confort: 7,
        Spin: 7.5,
        Tol\u00E9rance: 6.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/star-vie-triton-balance-2026-plus.png",
      verdict: "Diamant temp\xE9r\xE9e \u2014 plus souple que la Power avec un meilleur \xE9quilibre puissance/contr\xF4le. Bon compromis pour attaquants qui veulent de la marge.",
      price: "200-260\u20AC"
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
      description: "Diamant puissance explosive. 18K Carbon Hybrid + H-EVA Power haute densit\xE9 + TriTech Core. Attaquant pur.",
      scores: {
        Puissance: 9.5,
        Contr\u00F4le: 6,
        Maniabilit\u00E9: 5.5,
        Confort: 5.5,
        Spin: 7.5,
        Tol\u00E9rance: 5
      },
      imageUrl: "https://www.padelful.com/images/rackets/star-vie-triton-power-2026-plus.png",
      verdict: "Diamant brutale : 9.5 en puissance, carbone 18K hybride. R\xE9serv\xE9e aux experts physiques qui assument un jeu 100% offensif.",
      price: "220-280\u20AC"
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
      imageUrl: "https://www.padelful.com/images/rackets/varlion-bourne-carbon-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/varlion-canas-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/varlion-canas-w-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/varlion-lethal-weapon-carbon-2025.png",
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
      description: "Hybride Bourne puissance/contr\xF4le. Prisma Frame + Summum grip long 14.5cm. Polyvalence offensive.",
      scores: {
        Puissance: 8,
        Contr\u00F4le: 7,
        Maniabilit\u00E9: 7,
        Confort: 7,
        Spin: 7.5,
        Tol\u00E9rance: 6.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/varlion-bourne-carbon-ti-2023.png",
      verdict: "Hybride offensive avec grip long 14.5cm. Bonne puissance avec suffisamment de contr\xF4le pour construire avant de conclure.",
      price: "180-250\u20AC"
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
      description: "Ronde d\xE9butante confort. Ergoholes sweet spot \xE9largi + Handlesafety. L\xE9g\xE8re et tol\xE9rante.",
      scores: {
        Puissance: 4,
        Contr\u00F4le: 8,
        Maniabilit\u00E9: 9,
        Confort: 9.5,
        Spin: 5,
        Tol\u00E9rance: 9
      },
      imageUrl: "https://www.padelful.com/images/rackets/varlion-lw-8-8-orquidea-2026.png",
      verdict: "Ronde ultra-confortable et tol\xE9rante, parfaite pour d\xE9buter. Sweet spot g\xE9n\xE9reux, poids plume \u2014 z\xE9ro stress sur le bras.",
      price: "60-100\u20AC"
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
      description: "Ronde contr\xF4le Lethal Weapon. Summum grip + Slice Texture. Pr\xE9cision d\xE9fensive pour tacticiens.",
      scores: {
        Puissance: 6,
        Contr\u00F4le: 9,
        Maniabilit\u00E9: 7.5,
        Confort: 7.5,
        Spin: 7.5,
        Tol\u00E9rance: 8.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/varlion-lw-carbon-ti-2023.png",
      verdict: "Ronde de pr\xE9cision chirurgicale : contr\xF4le \xE0 9 et tol\xE9rance \xE0 8.5. Le choix des tacticiens et constructeurs de points patients.",
      price: "180-250\u20AC"
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
      imageUrl: "https://www.padelful.com/images/rackets/vermont-origin-junior-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/wilson-minions-junior-face-2024.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/wilson-bela-elite-pro-v2-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/wilson-bela-elite-v2.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/wilson-bela-pro-v2-2025.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/wilson-blade-junior-v2.png",
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
      imageUrl: "https://www.padelful.com/images/rackets/wilson-ultra-v2-2025.png",
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
      description: "Ronde confort-first pour d\xE9butants. Fibre de verre + EVA souple. Timing facile, l\xE9g\xE8re, gateway Wilson.",
      scores: {
        Puissance: 4.5,
        Contr\u00F4le: 8,
        Maniabilit\u00E9: 9,
        Confort: 9.5,
        Spin: 5,
        Tol\u00E9rance: 9
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-accent-2026.png",
      verdict: "Porte d'entr\xE9e Wilson : l\xE9g\xE8re, confortable, tr\xE8s tol\xE9rante. Id\xE9ale pour d\xE9couvrir le padel sans se soucier de la technique.",
      price: "60-100\u20AC"
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
      description: "Version all\xE9g\xE9e de la Bela V3. Maniabilit\xE9 accrue sans perdre le spin et la puissance. Id\xE9ale progression.",
      scores: {
        Puissance: 6.5,
        Contr\u00F4le: 7,
        Maniabilit\u00E9: 8.5,
        Confort: 8,
        Spin: 7.5,
        Tol\u00E9rance: 7.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-bela-ls-v3-2025.png",
      verdict: "Version all\xE9g\xE9e de la Bela : maniabilit\xE9 boost\xE9e \xE0 8.5 tout en gardant le spin. Parfaite pour progresser avec le confort en plus.",
      price: "180-250\u20AC",
      player: "Fernando Belastegu\xEDn"
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
      description: "Diamant offensive signature Bela. C2 Tubular Construction + 24K Carbon + DuoGrid. Puissance max pour joueurs confirm\xE9s.",
      scores: {
        Puissance: 9,
        Contr\u00F4le: 7,
        Maniabilit\u00E9: 6,
        Confort: 6,
        Spin: 8,
        Tol\u00E9rance: 5.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-bela-pro-v3-2025.png",
      verdict: "Diamant signature Bela, carbone 24K et construction tubulaire. Puissance maximale pour experts \u2014 exige un bon niveau technique.",
      price: "220-300\u20AC",
      player: "Fernando Belastegu\xEDn"
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
      description: "Goutte versatile co-design Bela. V-Bridge + Spin2 Texture + DuoGrid Holes. Polyvalence attaque/d\xE9fense.",
      scores: {
        Puissance: 7.5,
        Contr\u00F4le: 7.5,
        Maniabilit\u00E9: 7,
        Confort: 7,
        Spin: 8,
        Tol\u00E9rance: 7
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-bela-v3-2025.png",
      verdict: "Co-design Bela en goutte versatile : spin \xE0 8 et bon \xE9quilibre global. Polyvalente fiable qui s'adapte \xE0 tous les styles de jeu.",
      price: "200-280\u20AC",
      player: "Fernando Belastegu\xEDn"
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
      description: "Goutte toucher doux et pr\xE9cision. Dwell time long pour touches et d\xE9fenses. Polyvalence attaque/d\xE9fense.",
      scores: {
        Puissance: 7,
        Contr\u00F4le: 8,
        Maniabilit\u00E9: 7.5,
        Confort: 8,
        Spin: 7.5,
        Tol\u00E9rance: 7.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-blade-pro-v2-oro.png",
      verdict: "Toucher doux et dwell time long pour un contr\xF4le pr\xE9cis. Excellente en d\xE9fense et en construction \u2014 la patte du tacticien.",
      price: "200-280\u20AC"
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
      description: "Goutte polyvalente interm\xE9diaire. Feel doux et sweet spot tol\xE9rant. Transition vers jeu technique.",
      scores: {
        Puissance: 6,
        Contr\u00F4le: 7,
        Maniabilit\u00E9: 8,
        Confort: 8.5,
        Spin: 6.5,
        Tol\u00E9rance: 8
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-blade-team-2026.png",
      verdict: "Goutte douce et tol\xE9rante pour interm\xE9diaires. Sweet spot g\xE9n\xE9reux, bon confort \u2014 transition id\xE9ale vers un jeu plus technique.",
      price: "100-150\u20AC"
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
      description: "Ronde pr\xE9cision chirurgicale. Sweet spot central, r\xE9ponse crisp. Pour constructeurs de points tactiques.",
      scores: {
        Puissance: 6,
        Contr\u00F4le: 9,
        Maniabilit\u00E9: 7.5,
        Confort: 7,
        Spin: 7,
        Tol\u00E9rance: 8
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-pro-staff-v2-azul.png",
      verdict: "Ronde contr\xF4le pur : r\xE9ponse nette et pr\xE9cision chirurgicale. Pour constructeurs patients qui placent chaque balle avec intention.",
      price: "200-280\u20AC"
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
      description: "Diamant puissance explosive. Infinity Edge sweet spot \xE9largi + Power Pillar stabilit\xE9. Finisseur agressif.",
      scores: {
        Puissance: 9.5,
        Contr\u00F4le: 6,
        Maniabilit\u00E9: 5.5,
        Confort: 6,
        Spin: 7.5,
        Tol\u00E9rance: 6
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-ultra-pro-v2.png",
      verdict: "Diamant explosive \xE0 9.5 en puissance avec sweet spot \xE9largi. Finisseur agressif \u2014 demande du physique et de la pr\xE9cision.",
      price: "220-300\u20AC"
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
      description: "Diamant puissance accessible. Infinity Edge pour sweet spot large. Progression vers jeu offensif.",
      scores: {
        Puissance: 7.5,
        Contr\u00F4le: 6.5,
        Maniabilit\u00E9: 7,
        Confort: 7.5,
        Spin: 6.5,
        Tol\u00E9rance: 6.5
      },
      imageUrl: "https://www.padelful.com/images/rackets/wilson-ultra-team-2026.png",
      verdict: "Diamant accessible avec sweet spot large Infinity Edge. Bonne porte d'entr\xE9e vers le jeu offensif sans trop de risque.",
      price: "120-170\u20AC"
    }
  ];

  // PadelAnalyzer.jsx
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
    frequency: "Occasionnel (1-2x/mois)",
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
  var ATTRS = ["Puissance", "Contr\xF4le", "Confort", "Spin", "Maniabilit\xE9", "Tol\xE9rance"];
  function proxyImg(url) {
    return url || null;
  }
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
    return total / wSum;
  }
  function fmtPct(score) {
    return (score * 10).toFixed(2) + "%";
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
  function generateDeepAnalysis(profile, ranked, attrs) {
    if (!ranked.length) return [];
    const best = ranked[0], second = ranked[1], bestScore = best.globalScore;
    const lines = [];
    const styles = profile.styleTags || [], priorities = profile.priorityTags || [];
    const brands = profile.brandTags || [], injuries = (profile.injuryTags || []).filter((t) => t !== "aucune");
    const OFF_S = ["offensif", "puissant"], DEF_S = ["defensif", "contre", "endurant"], TECH_S = ["tactique", "technique"];
    const offC = styles.filter((s) => OFF_S.includes(s)).length, defC = styles.filter((s) => DEF_S.includes(s)).length;
    const techC = styles.filter((s) => TECH_S.includes(s)).length;
    const POW_P = ["puissance", "spin"], CTL_P = ["controle", "confort", "protection", "reprise"];
    const offP = priorities.filter((p) => POW_P.includes(p)).length, defP = priorities.filter((p) => CTL_P.includes(p)).length;
    const hasTension = offP > 0 && defC >= 2 || defP > 0 && offC >= 2;
    const isComplex = styles.length >= 4 || styles.length >= 3 && hasTension;
    const w = {};
    attrs.forEach((a) => w[a] = 1);
    const PM = { confort: { Confort: 1.5 }, polyvalence: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.5, Tol\u00E9rance: 0.5 }, puissance: { Puissance: 1.5 }, controle: { Contr\u00F4le: 1.5 }, spin: { Spin: 1.5 }, legerete: { Maniabilit\u00E9: 1.5 }, protection: { Confort: 1.5 }, reprise: { Confort: 1.5, Tol\u00E9rance: 1, Maniabilit\u00E9: 0.5 } };
    priorities.forEach((t) => {
      const b = PM[t];
      if (b) Object.entries(b).forEach(([k, v]) => w[k] = (w[k] || 1) + v);
    });
    const SM = { offensif: { Puissance: 0.5 }, defensif: { Contr\u00F4le: 0.5, Tol\u00E9rance: 0.5 }, tactique: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.3 }, puissant: { Puissance: 0.5, Spin: 0.3 }, veloce: { Maniabilit\u00E9: 0.8 }, endurant: { Confort: 0.5, Tol\u00E9rance: 0.3 }, contre: { Tol\u00E9rance: 0.5, Contr\u00F4le: 0.3 }, polyvalent: { Contr\u00F4le: 0.3, Tol\u00E9rance: 0.3 }, technique: { Contr\u00F4le: 0.5, Spin: 0.3 } };
    styles.forEach((t) => {
      const b = SM[t];
      if (b) Object.entries(b).forEach(([k, v]) => w[k] = (w[k] || 1) + v);
    });
    const ARM_I = ["dos", "poignet", "coude", "epaule"], LEG_I = ["genou", "cheville", "mollet", "hanche", "achille"];
    if (injuries.some((t) => ARM_I.includes(t))) w.Confort += 2;
    if (injuries.some((t) => LEG_I.includes(t))) w.Maniabilit\u00E9 += 1.5;
    const h = Number(profile.height) || 0, age = Number(profile.age) || 0;
    if (h > 0 && h < 170) w.Maniabilit\u00E9 += 0.5;
    if (h >= 185) w.Puissance += 0.3;
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
    const hand = profile.hand || "Droitier", side = profile.side || "Droite";
    const isAtt = hand === "Droitier" && side === "Gauche" || hand === "Gaucher" && side === "Droite";
    const isCon = hand === "Droitier" && side === "Droite" || hand === "Gaucher" && side === "Gauche";
    if (isAtt) {
      w.Puissance += 0.5;
      w.Spin += 0.3;
    }
    if (isCon) {
      w.Contr\u00F4le += 0.5;
      w.Tol\u00E9rance += 0.3;
    }
    const wT = Object.values(w).reduce((s, v) => s + v, 0);
    const wS = attrs.map((a) => ({ attr: a, weight: w[a], pct: Math.round(w[a] / wT * 100) })).sort((a, b) => b.weight - a.weight);
    const top2 = wS.slice(0, 2), top2pct = top2.reduce((s, x) => s + x.pct, 0), rest4pct = 100 - top2pct;
    const t3C = ranked.slice(0, Math.min(3, ranked.length)).reduce((s, r) => s + (r.scores["Contr\xF4le"] || 0), 0) / Math.min(3, ranked.length);
    const t3P = ranked.slice(0, Math.min(3, ranked.length)).reduce((s, r) => s + (r.scores.Puissance || 0), 0) / Math.min(3, ranked.length);
    const t3CtrlOriented = t3C > t3P + 0.5;
    const wSaysPow = top2[0].attr === "Puissance" || top2[1].attr === "Puissance";
    const paradox = wSaysPow && t3CtrlOriented;
    const SL = { defensif: "D\xE9fensif/Mur", veloce: "V\xE9loce", endurant: "Endurant", contre: "Contre-attaquant", technique: "Technique", puissant: "Puissant/Frappeur", offensif: "Offensif", tactique: "Tactique", polyvalent: "Polyvalent" };
    const PL = { puissance: "Puissance", spin: "Spin", controle: "Contr\xF4le", confort: "Confort", legerete: "L\xE9g\xE8ret\xE9", protection: "Protection bras", reprise: "Reprise en douceur", polyvalence: "Polyvalence" };
    if (isComplex && hasTension) {
      const ds = styles.filter((s) => DEF_S.includes(s)).map((s) => SL[s] || s).join(", ");
      const op = priorities.filter((p) => POW_P.includes(p)).map((p) => PL[p] || p).join(" et ");
      const ts = styles.filter((s) => TECH_S.includes(s)).map((s) => SL[s] || s);
      let extra = ts.length ? `, plus ${ts.join(" et ")} qui renforce${ts.length > 1 ? "nt" : ""} le Contr\xF4le` : "";
      lines.push(`Profil exigeant : ${styles.length} styles dont ${defC} d\xE9fensifs (${ds})${extra}, face \xE0 des priorit\xE9s offensives (${op}). Le syst\xE8me doit arbitrer entre ces deux tendances.`);
    } else if (isComplex) {
      lines.push(`Profil riche avec ${styles.length} styles. L'algorithme croise tous ces param\xE8tres pour pond\xE9rer les 6 crit\xE8res. Plus le profil est diversifi\xE9, plus le score plafond baisse \u2014 aucune raquette ne peut exceller partout.`);
    } else if (offC > 0 && defC === 0) {
      lines.push(`Profil offensif cibl\xE9. L'algorithme surpond\xE8re Puissance et Spin \u2014 les diamants lourdes devraient dominer.`);
    } else if (defC > 0 && offC === 0) {
      lines.push(`Profil orient\xE9 d\xE9fense et contr\xF4le. Les rondes et hybrides vont naturellement dominer le classement.`);
    } else {
      lines.push(`Profil \xE9quilibr\xE9. Le classement refl\xE9tera un compromis entre les styles d\xE9clar\xE9s.`);
    }
    const wStr = wS.map((x) => `${x.attr} \xD7${x.weight.toFixed(1)}`).join(", ");
    if (paradox) {
      lines.push(`Pond\xE9ration : ${wStr}. ${top2[0].attr} et ${top2[1].attr} ont le poids le plus fort (${top2pct}% \xE0 eux deux), mais les 4 autres crit\xE8res p\xE8sent collectivement ${rest4pct}%. Cons\xE9quence : une raquette qui score 8-9 en Contr\xF4le, Confort, Tol\xE9rance et Maniabilit\xE9 compense un 7 en Puissance \u2014 c'est pourquoi des raquettes plut\xF4t contr\xF4le dominent malgr\xE9 des priorit\xE9s offensives.`);
    } else {
      lines.push(`Pond\xE9ration : ${wStr}. Les crit\xE8res dominants ${top2[0].attr} et ${top2[1].attr} (${top2pct}% du total) orientent le classement.`);
    }
    if (bestScore < 78) {
      lines.push(`Score plafond \xE0 ${bestScore.toFixed(1)}% : normal pour un profil ${isComplex ? "\xE0 " + styles.length + " styles" : "avec ces param\xE8tres"}. ${isComplex ? "Quand les styles tirent dans des directions diff\xE9rentes, a" : "A"}ucune raquette du march\xE9 ne peut satisfaire tous les crit\xE8res \xE0 la fois \u2014 ${bestScore.toFixed(0)}% signifie meilleur compromis r\xE9aliste, pas un choix m\xE9diocre.`);
    } else if (bestScore >= 85) {
      lines.push(`Score \xE9lev\xE9 \xE0 ${bestScore.toFixed(1)}% : profil coh\xE9rent, la n\xB01 r\xE9pond bien \xE0 l'ensemble des crit\xE8res.${second && bestScore - second.globalScore >= 1 ? " L'avance est nette." : ""}`);
    } else {
      lines.push(`Score \xE0 ${bestScore.toFixed(1)}% : bon compromis.${second && bestScore - second.globalScore < 0.5 ? " Le peloton de t\xEAte est tr\xE8s serr\xE9 \u2014 le ressenti en main fera la diff\xE9rence." : ""}`);
    }
    if (brands.length > 0) {
      const bInTop3 = ranked.slice(0, 3).some((r) => brands.some((b) => (r.brand || "").toLowerCase().replace(/\s/g, "").includes(b)));
      const bestBR = ranked.find((r) => brands.some((b) => (r.brand || "").toLowerCase().replace(/\s/g, "").includes(b)));
      const bL = brands.map((b) => b.charAt(0).toUpperCase() + b.slice(1));
      if (!bInTop3 && bestBR) {
        const gap = bestScore - bestBR.globalScore;
        lines.push(`Marque pr\xE9f\xE9r\xE9e ${bL.join("/")} absente du Top 3 : la meilleure est la ${bestBR.name} \xE0 ${bestBR.globalScore.toFixed(1)}% (${gap.toFixed(1)} pts sous la n\xB01). L'\xE9cart technique ne peut pas \xEAtre combl\xE9 par un simple bonus marque \u2014 le classement reste objectif. La section "\xC0 D\xE9couvrir" met en avant les ${bL.join("/")} les plus pertinentes.`);
      } else if (bInTop3) {
        lines.push(`${bL.join("/")} est repr\xE9sent\xE9e dans le Top 3 \u2014 la marque pr\xE9f\xE9r\xE9e propose des mod\xE8les techniquement adapt\xE9s au profil.`);
      }
    }
    if (ranked.length >= 3) {
      const shapes = ranked.slice(0, 3).map((r) => r.shape).filter(Boolean);
      const uniq = [...new Set(shapes)];
      if (uniq.length === 1 && uniq[0] === "Ronde") lines.push(`Les 3 finalistes sont des rondes : forme offrant le meilleur compromis contr\xF4le/tol\xE9rance, coh\xE9rent quand ces crit\xE8res p\xE8sent lourd.`);
      else if (uniq.length === 1 && uniq[0] === "Diamant") lines.push(`Les 3 finalistes sont des diamants : logique pour un profil puissance pure.`);
      else if (uniq.length >= 2) lines.push(`Le podium m\xE9lange ${uniq.join(" et ")} \u2014 le profil est assez polyvalent pour que diff\xE9rentes g\xE9om\xE9tries scorent bien.`);
    }
    return lines;
  }
  function PadelAnalyzer() {
    const [rackets, setRackets] = (0, import_react.useState)(() => {
      const saved = loadSavedRackets();
      return saved.length ? saved : INITIAL_RACKETS;
    });
    const [selected, setSelected] = (0, import_react.useState)(() => {
      const saved = loadSavedRackets();
      return saved.length ? saved.slice(0, Math.min(saved.length, 4)).map((r) => r.id) : [];
    });
    const [tab, setTab] = (0, import_react.useState)("radar");
    const [showArena, setShowArena] = (0, import_react.useState)(false);
    const [openAttr, setOpenAttr] = (0, import_react.useState)(null);
    const [profile, setProfile] = (0, import_react.useState)(() => loadSavedProfile());
    const [panel, setPanel] = (0, import_react.useState)(null);
    const [searchQ, setSearchQ] = (0, import_react.useState)("");
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [loadMsg, setLoadMsg] = (0, import_react.useState)("");
    const [error, setError] = (0, import_react.useState)("");
    const [suggestions, setSuggestions] = (0, import_react.useState)(null);
    const [suggestResults, setSuggestResults] = (0, import_react.useState)(null);
    const [suggestChecked, setSuggestChecked] = (0, import_react.useState)(/* @__PURE__ */ new Set());
    const [addingBatch, setAddingBatch] = (0, import_react.useState)(false);
    const [batchProgress, setBatchProgress] = (0, import_react.useState)("");
    const [profileName, setProfileName] = (0, import_react.useState)(() => {
      const p = loadSavedProfile();
      return p._name || "";
    });
    const [savedProfiles, setSavedProfiles] = (0, import_react.useState)(() => loadProfilesList());
    const [profileSearchTerm, setProfileSearchTerm] = (0, import_react.useState)("");
    const [activeProfileIdx, setActiveProfileIdx] = (0, import_react.useState)(0);
    const carouselRef = (0, import_react.useRef)(null);
    const [hoveredRacket, setHoveredRacket] = (0, import_react.useState)(null);
    const [localDBCount, setLocalDBCount] = (0, import_react.useState)(() => {
      try {
        return JSON.parse(localStorage.getItem("padel_db_extra") || "[]").length;
      } catch {
        return 0;
      }
    });
    const [screen, setScreen] = (0, import_react.useState)(() => {
      const p = loadSavedProfile();
      return p._name ? "dashboard" : "home";
    });
    const [wizardStep, setWizardStep] = (0, import_react.useState)(0);
    (0, import_react.useEffect)(() => {
      saveRackets(rackets);
    }, [rackets]);
    (0, import_react.useEffect)(() => {
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
    const selectHomeProfile = (sp) => {
      setProfile({ ...INITIAL_PROFILE, ...sp.profile });
      setProfileName(sp.name);
      setPanel(null);
      setScreen("dashboard");
    };
    const createNewProfile = () => {
      setProfile({ ...INITIAL_PROFILE });
      setProfileName("");
      setWizardStep(0);
      setPanel(null);
      setScreen("onboarding");
    };
    const disconnect = () => {
      setPanel(null);
      setRackets([]);
      setSelected([]);
      setSuggestResults(null);
      setSuggestChecked(/* @__PURE__ */ new Set());
      setError("");
      setScreen("home");
    };
    const launchAnalysis = (top3Rackets) => {
      if (top3Rackets && top3Rackets.length) {
        const loaded = top3Rackets.map((r, i) => {
          const color = COLORS_POOL[i % COLORS_POOL.length];
          return {
            id: r.id + "-" + Date.now() + "-" + i,
            name: r.name,
            shortName: r.shortName || r.name.slice(0, 28),
            brand: r.brand,
            shape: r.shape,
            weight: r.weight,
            balance: r.balance || "\u2014",
            surface: r.surface || "\u2014",
            core: r.core || "\u2014",
            price: r.price || "\u2014",
            player: r.player || "\u2014",
            color,
            imageUrl: r.imageUrl || null,
            scores: r.scores,
            verdict: r.verdict || "Analyse non disponible",
            forYou: "partial",
            refSource: "Base Padel Analyzer",
            _fromDB: true,
            _incomplete: false
          };
        });
        setRackets(loaded);
        setSelected(loaded.slice(0, 4).map((r) => r.id));
      }
      setPanel(null);
      setScreen("app");
    };
    const goToApp = () => {
      setPanel(null);
      setScreen("app");
    };
    const goToDashboard = () => {
      setPanel(null);
      setScreen("dashboard");
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
    const searchRackets = (0, import_react.useCallback)(async () => {
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
    const selectSuggestion = (0, import_react.useCallback)(async (idx) => {
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
    const suggestRackets = (0, import_react.useCallback)(async () => {
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
    const addCheckedSuggestions = (0, import_react.useCallback)(async () => {
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
    const reanalyzeAll = (0, import_react.useCallback)(async () => {
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
    return /* @__PURE__ */ import_react.default.createElement("div", { style: S.root }, /* @__PURE__ */ import_react.default.createElement("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap", rel: "stylesheet" }), /* @__PURE__ */ import_react.default.createElement("style", null, `
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .pa-card { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
        .pa-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .pa-carousel::-webkit-scrollbar { display: none; }
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
      `), screen === "home" && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", animation: "fadeIn 0.5s ease", padding: "0 16px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 24, animation: "fadeIn 0.6s ease" } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: "80", height: "80", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { filter: "drop-shadow(0 8px 24px rgba(249,115,22,0.35))" } }, /* @__PURE__ */ import_react.default.createElement("defs", null, /* @__PURE__ */ import_react.default.createElement("linearGradient", { id: "logoGradHome", x1: "0", y1: "0", x2: "44", y2: "44" }, /* @__PURE__ */ import_react.default.createElement("stop", { offset: "0%", stopColor: "#f97316" }), /* @__PURE__ */ import_react.default.createElement("stop", { offset: "100%", stopColor: "#ef4444" }))), /* @__PURE__ */ import_react.default.createElement("rect", { width: "44", height: "44", rx: "10", fill: "url(#logoGradHome)" }), /* @__PURE__ */ import_react.default.createElement("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.2", fill: "none" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "10", x2: "22", y2: "26", stroke: "#fff", strokeWidth: "1.2", opacity: "0.4" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "14", y1: "18", x2: "30", y2: "18", stroke: "#fff", strokeWidth: "1.2", opacity: "0.4" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.85" }))), /* @__PURE__ */ import_react.default.createElement("h1", { style: { fontFamily: "'Outfit'", fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 6px", letterSpacing: "-0.03em", textAlign: "center" } }, "PADEL ANALYZER"), /* @__PURE__ */ import_react.default.createElement("p", { style: { color: "#64748b", fontSize: 13, margin: "0 0 8px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500, textAlign: "center" } }, "Ton conseiller raquette intelligent"), /* @__PURE__ */ import_react.default.createElement("p", { style: { color: "#475569", fontSize: 11, margin: "0 0 36px", textAlign: "center", maxWidth: 340, lineHeight: 1.5 } }, "Analyse ton profil, explore ", rackets_db_default.length, "+ raquettes, trouve la pala parfaite pour ton jeu."), savedProfiles.length > 0 && (() => {
      const profileSearch = profileSearchTerm;
      const filtered = savedProfiles.filter((sp) => !profileSearch || sp.name.toLowerCase().includes(profileSearch.toLowerCase()));
      const CARD_W = 210;
      const GAP = 14;
      const scrollToIdx = (idx) => {
        const el = carouselRef.current;
        if (!el) return;
        const target = idx * (CARD_W + GAP);
        el.scrollTo({ left: target, behavior: "smooth" });
        setActiveProfileIdx(idx);
      };
      const handleScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        const idx = Math.round(el.scrollLeft / (CARD_W + GAP));
        setActiveProfileIdx(Math.max(0, Math.min(idx, filtered.length - 1)));
      };
      const scrollDir = (dir) => {
        const next = dir === "left" ? activeProfileIdx - 1 : activeProfileIdx + 1;
        if (next >= 0 && next < filtered.length) scrollToIdx(next);
        else if (next < 0) scrollToIdx(filtered.length - 1);
        else scrollToIdx(0);
      };
      return /* @__PURE__ */ import_react.default.createElement("div", { style: { width: "100%", maxWidth: 560, marginBottom: 24 } }, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12, textAlign: "center" } }, "\u{1F464} Mes profils ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#64748b", fontWeight: 400 } }, "(", savedProfiles.length, ")")), savedProfiles.length >= 4 && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 12 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "relative", width: "100%", maxWidth: 280 } }, /* @__PURE__ */ import_react.default.createElement(
        "input",
        {
          type: "text",
          placeholder: "Rechercher un profil\u2026",
          value: profileSearch,
          onChange: (e) => {
            setProfileSearchTerm(e.target.value);
            setActiveProfileIdx(0);
          },
          style: { width: "100%", padding: "8px 12px 8px 32px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0", fontSize: 12, fontFamily: "'Inter',sans-serif", outline: "none", boxSizing: "border-box" }
        }
      ), /* @__PURE__ */ import_react.default.createElement("span", { style: { position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#64748b", pointerEvents: "none" } }, "\u{1F50D}"), profileSearch && /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
        setProfileSearchTerm("");
        setActiveProfileIdx(0);
      }, style: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", padding: 2 } }, "\u2715"))), /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "relative", display: "flex", alignItems: "center", gap: 4 } }, filtered.length > 1 && /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => scrollDir("left"),
          "aria-label": "Pr\xE9c\xE9dent",
          style: {
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "#e2e8f0",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: "'Inter',sans-serif",
            transition: "all 0.2s",
            backdropFilter: "blur(8px)"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "rgba(249,115,22,0.15)";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }
        },
        "\u2039"
      ), /* @__PURE__ */ import_react.default.createElement("div", { ref: carouselRef, className: "pa-carousel", onScroll: handleScroll, style: {
        display: "flex",
        gap: GAP,
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
        flex: 1,
        padding: "6px 0 10px",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch"
      }, onKeyDown: (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollDir("left");
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollDir("right");
        }
      }, tabIndex: 0 }, /* @__PURE__ */ import_react.default.createElement("div", { style: { minWidth: `calc(50% - ${CARD_W / 2}px)`, flexShrink: 0 }, "aria-hidden": "true" }), filtered.map((sp, i) => {
        const p = sp.profile || {};
        const styles = (p.styleTags || []).map((id) => STYLE_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
        const injuries = (p.injuryTags || []).filter((t) => t !== "aucune").map((id) => INJURY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
        const isJunior = p.age && parseInt(p.age) < 16;
        const levelColors = { D\u00E9butant: "#4CAF50", Interm\u00E9diaire: "#FF9800", Avanc\u00E9: "#ef4444", Comp\u00E9tition: "#9C27B0" };
        const desc = [p.side && `C\xF4t\xE9 ${p.side}`, p.hand].filter(Boolean).join(" \xB7 ");
        const stylesStr = styles.length ? styles.slice(0, 2).join(", ") : "";
        const isActive = i === activeProfileIdx;
        return /* @__PURE__ */ import_react.default.createElement("button", { key: sp.name, onClick: () => selectHomeProfile(sp), style: {
          background: isActive ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.03)",
          border: isActive ? "1px solid rgba(249,115,22,0.35)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: "22px 16px 16px",
          cursor: "pointer",
          textAlign: "center",
          fontFamily: "'Inter',sans-serif",
          minWidth: CARD_W,
          maxWidth: CARD_W,
          flexShrink: 0,
          scrollSnapAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: isActive ? "scale(1.03)" : "scale(0.97)",
          opacity: isActive ? 1 : 0.7,
          boxShadow: isActive ? "0 4px 20px rgba(249,115,22,0.15)" : "none"
        } }, /* @__PURE__ */ import_react.default.createElement("div", { style: {
          width: 56,
          height: 56,
          borderRadius: 16,
          background: isActive ? "linear-gradient(135deg,rgba(249,115,22,0.35),rgba(239,68,68,0.25))" : "linear-gradient(135deg,rgba(249,115,22,0.18),rgba(239,68,68,0.12))",
          border: isActive ? "2px solid rgba(249,115,22,0.5)" : "1px solid rgba(249,115,22,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 700,
          color: isActive ? "#f97316" : "#94a3b8",
          flexShrink: 0,
          transition: "all 0.3s"
        } }, sp.name.charAt(0).toUpperCase()), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: isActive ? "#f1f5f9" : "#cbd5e1", lineHeight: 1.2, transition: "color 0.3s" } }, sp.name), p.level && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, fontWeight: 600, color: levelColors[p.level] || "#64748b", background: `${levelColors[p.level] || "#64748b"}18`, padding: "2px 10px", borderRadius: 10, letterSpacing: "0.03em", textTransform: "uppercase" } }, p.level, isJunior ? " \xB7 Junior" : ""), desc && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#64748b", lineHeight: 1.3 } }, desc), stylesStr && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#94a3b8", fontStyle: "italic" } }, stylesStr), injuries.length > 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#ef4444", opacity: 0.8 } }, "\u{1FA79} ", injuries.join(", ")), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 6, fontSize: 10, color: isActive ? "#f97316" : "#64748b", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", transition: "color 0.3s" } }, isActive ? "\u25B6 Ouvrir" : "Ouvrir \u2192"));
      }), /* @__PURE__ */ import_react.default.createElement("div", { style: { minWidth: `calc(50% - ${CARD_W / 2}px)`, flexShrink: 0 }, "aria-hidden": "true" })), filtered.length > 1 && /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => scrollDir("right"),
          "aria-label": "Suivant",
          style: {
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "#e2e8f0",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: "'Inter',sans-serif",
            transition: "all 0.2s",
            backdropFilter: "blur(8px)"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "rgba(249,115,22,0.15)";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }
        },
        "\u203A"
      )), filtered.length > 1 && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 7, marginTop: 10 } }, filtered.map((_, i) => /* @__PURE__ */ import_react.default.createElement("button", { key: i, onClick: () => scrollToIdx(i), "aria-label": `Profil ${i + 1}`, style: {
        width: i === activeProfileIdx ? 18 : 7,
        height: 7,
        borderRadius: 4,
        border: "none",
        cursor: "pointer",
        padding: 0,
        background: i === activeProfileIdx ? "#f97316" : "rgba(255,255,255,0.15)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)"
      } }))), filtered.length > 1 && /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 8, color: "#334155", textAlign: "center", marginTop: 6, letterSpacing: "0.04em" } }, "\u2190 \u2192 Fl\xE8ches ou swipe pour naviguer"), profileSearch && filtered.length === 0 && /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#64748b", textAlign: "center", marginTop: 8 } }, 'Aucun profil trouv\xE9 pour "', profileSearch, '"'));
    })(), /* @__PURE__ */ import_react.default.createElement("button", { onClick: createNewProfile, style: {
      padding: "14px 28px",
      background: "linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))",
      border: "1px solid rgba(249,115,22,0.35)",
      borderRadius: 14,
      color: "#f97316",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Inter',sans-serif",
      transition: "all 0.2s ease",
      letterSpacing: "-0.01em",
      width: "100%",
      maxWidth: 400
    } }, "+ Nouveau profil"), savedProfiles.length === 0 && /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#475569", marginTop: 12, textAlign: "center", lineHeight: 1.5 } }, "Cr\xE9e ton premier profil pour commencer l'analyse"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 40, fontSize: 8, color: "#334155", letterSpacing: "0.05em", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "'Outfit'", fontWeight: 600 } }, "PADEL ANALYZER"), " V8.0 \xB7 ", rackets_db_default.length, " raquettes \xB7 Scoring hybride IA")), screen === "onboarding" && (() => {
      const hasName = profileName.trim().length > 0;
      const hasGabarit = Number(profile.age) > 0 || Number(profile.height) > 0;
      const hasLevel = !!profile.level;
      const hasHandSide = !!profile.hand && !!profile.side;
      const hasStyle = (profile.styleTags || []).length > 0;
      const hasInjury = (profile.injuryTags || []).length > 0;
      const hasPriority = (profile.priorityTags || []).length > 0;
      const showGabarit = hasName;
      const showLevel = hasName && hasGabarit;
      const showHandSide = showLevel && hasLevel;
      const showStyle = showHandSide && hasHandSide;
      const showInjury = showStyle && hasStyle;
      const showPriority = showInjury && hasInjury;
      const showBrands = showPriority && hasPriority;
      const showSave = showPriority && hasPriority && hasName;
      const filledCount = [hasName, hasGabarit, hasLevel && hasHandSide, hasStyle, hasInjury, hasPriority].filter(Boolean).length;
      const totalSteps = 6;
      const progress = filledCount / totalSteps;
      const sectionAnim = (delay) => ({
        animation: `fadeSlideIn 0.5s ease ${delay}ms both`
      });
      const sectionStyle = {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "18px 16px",
        marginBottom: 14
      };
      const isJuniorOnboard = Number(profile.age) > 0 && Number(profile.age) < 15 || Number(profile.height) > 0 && Number(profile.height) < 150;
      return /* @__PURE__ */ import_react.default.createElement("div", { style: { maxWidth: 520, margin: "0 auto", animation: "fadeIn 0.4s ease" } }, /* @__PURE__ */ import_react.default.createElement("style", null, `
            @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          `), /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "center", marginBottom: 20 } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: "40", height: "40", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { filter: "drop-shadow(0 6px 16px rgba(249,115,22,0.3))", marginBottom: 8 } }, /* @__PURE__ */ import_react.default.createElement("defs", null, /* @__PURE__ */ import_react.default.createElement("linearGradient", { id: "logoGradOnb", x1: "0", y1: "0", x2: "44", y2: "44" }, /* @__PURE__ */ import_react.default.createElement("stop", { offset: "0%", stopColor: "#f97316" }), /* @__PURE__ */ import_react.default.createElement("stop", { offset: "100%", stopColor: "#ef4444" }))), /* @__PURE__ */ import_react.default.createElement("rect", { width: "44", height: "44", rx: "10", fill: "url(#logoGradOnb)" }), /* @__PURE__ */ import_react.default.createElement("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.2", fill: "none" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.85" })), /* @__PURE__ */ import_react.default.createElement("h1", { style: { fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 4px" } }, "Cr\xE9er ton profil"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#64748b", margin: 0 } }, "R\xE9ponds aux questions \u2014 on s'occupe du reste.")), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 20, padding: "0 4px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { height: "100%", background: "linear-gradient(90deg,#f97316,#ef4444)", borderRadius: 2, transition: "width 0.6s cubic-bezier(.4,0,.2,1)", width: `${progress * 100}%` } })), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, color: "#64748b" } }, filledCount, "/", totalSteps, " sections"), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, color: progress === 1 ? "#4CAF50" : "#64748b", fontWeight: progress === 1 ? 700 : 400 } }, progress === 1 ? "\u2705 Profil complet !" : ""))), /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(0) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1F464} Comment tu t'appelles ?"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Le nom de ton profil joueur."), /* @__PURE__ */ import_react.default.createElement("input", { value: profileName, onChange: (e) => setProfileName(e.target.value), placeholder: "Ex: Bidou, Noah, Maman...", style: { ...S.input, fontSize: 13, padding: "12px 14px" }, autoFocus: true })), showGabarit && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(100) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1F4CF} Ton gabarit"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Pour adapter le poids et la taille de la raquette."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "\xC2ge"), /* @__PURE__ */ import_react.default.createElement("input", { type: "number", value: profile.age, onChange: (e) => setProfile((p) => ({ ...p, age: Number(e.target.value) })), placeholder: "49", style: S.input })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Taille (cm)"), /* @__PURE__ */ import_react.default.createElement("input", { type: "number", value: profile.height, onChange: (e) => setProfile((p) => ({ ...p, height: Number(e.target.value) })), placeholder: "175", style: S.input })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Poids (kg)"), /* @__PURE__ */ import_react.default.createElement("input", { type: "number", value: profile.weight, onChange: (e) => setProfile((p) => ({ ...p, weight: Number(e.target.value) })), placeholder: "80", style: S.input }))), isJuniorOnboard && /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: "8px 10px", marginTop: 10, fontSize: 10, color: "#60a5fa", fontWeight: 600 } }, "\u{1F9D2} Profil junior d\xE9tect\xE9 \u2014 recommandations adapt\xE9es"), Number(profile.age) >= 50 && /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 10px", marginTop: 10, fontSize: 10, color: "#fbbf24", fontWeight: 600 } }, "\u{1F464} Profil 50+ \u2014 Confort et Maniabilit\xE9 renforc\xE9s")), showLevel && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(100) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1F3C6} Ton niveau"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Le niveau d\xE9termine la gamme de raquettes propos\xE9es."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Niveau"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.level, onChange: (e) => setProfile((p) => ({ ...p, level: e.target.value })), style: S.select }, LEVEL_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o.value, value: o.value }, o.label, " \u2014 ", o.desc)))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Fr\xE9quence"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.frequency, onChange: (e) => setProfile((p) => ({ ...p, frequency: e.target.value })), style: S.select }, FREQ_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o.value, value: o.value }, o.label, " \u2014 ", o.desc)))))), showHandSide && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(100) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1F91A} Ta prise de jeu"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Main + c\xF4t\xE9 = on d\xE9tecte ton r\xF4le (attaquant ou constructeur)."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Main"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.hand, onChange: (e) => setProfile((p) => ({ ...p, hand: e.target.value })), style: S.select }, HAND_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "C\xF4t\xE9 de jeu"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.side, onChange: (e) => setProfile((p) => ({ ...p, side: e.target.value })), style: S.select }, SIDE_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Comp\xE9tition"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.competition ? "oui" : "non", onChange: (e) => setProfile((p) => ({ ...p, competition: e.target.value === "oui" })), style: S.select }, /* @__PURE__ */ import_react.default.createElement("option", { value: "non" }, "Non"), /* @__PURE__ */ import_react.default.createElement("option", { value: "oui" }, "Oui")))), (() => {
        const h = profile.hand || "Droitier", s = profile.side || "Droite";
        const atk = h === "Droitier" && s === "Gauche" || h === "Gaucher" && s === "Droite";
        const cst = h === "Droitier" && s === "Droite" || h === "Gaucher" && s === "Gauche";
        const role = s === "Les deux" ? "Polyvalent" : atk ? "Attaquant (coup droit au centre)" : "Constructeur (revers au centre)";
        const roleColor = atk ? "#f97316" : cst ? "#6366f1" : "#94a3b8";
        return /* @__PURE__ */ import_react.default.createElement("div", { style: { background: `${roleColor}12`, border: `1px solid ${roleColor}30`, borderRadius: 8, padding: "8px 10px", marginTop: 10, fontSize: 10, color: roleColor, fontWeight: 600 } }, "\u{1F3AF} R\xF4le d\xE9tect\xE9 : ", role);
      })()), showStyle && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(100) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1F3BE} Comment tu joues ?"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Ton style influence le scoring. S\xE9lectionne tout ce qui te correspond."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, STYLE_TAGS.map((t) => {
        const sel = profile.styleTags.includes(t.id);
        return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("styleTags", t.id), style: {
          padding: "8px 12px",
          borderRadius: 10,
          background: sel ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
          border: `1.5px solid ${sel ? "#f97316" : "rgba(255,255,255,0.08)"}`,
          color: sel ? "#f97316" : "#94a3b8",
          fontSize: 11,
          fontWeight: sel ? 700 : 500,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s ease",
          textAlign: "left"
        } }, /* @__PURE__ */ import_react.default.createElement("div", null, t.label), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 8, color: sel ? "#fb923c" : "#475569", marginTop: 1, fontWeight: 400 } }, t.tip));
      }))), showInjury && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(100) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1FA79} Ton corps"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Les blessures boostent le crit\xE8re ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#ef4444" } }, "Confort"), " dans les verdicts."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, INJURY_TAGS.map((t) => {
        const sel = profile.injuryTags.includes(t.id);
        const isNone = t.id === "aucune";
        return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("injuryTags", t.id), style: {
          padding: "8px 12px",
          borderRadius: 10,
          background: sel ? isNone ? "rgba(76,175,80,0.15)" : "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
          border: `1.5px solid ${sel ? isNone ? "#4CAF50" : "#ef4444" : "rgba(255,255,255,0.08)"}`,
          color: sel ? isNone ? "#4CAF50" : "#ef4444" : "#94a3b8",
          fontSize: 11,
          fontWeight: sel ? 700 : 500,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s ease"
        } }, isNone ? "\u2713 " : "", t.label);
      }))), showPriority && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(100) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1F3AF} Qu'est-ce que tu cherches ?"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Ces crit\xE8res pond\xE8rent le score global de chaque raquette."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 } }, PRIORITY_TAGS.map((t) => {
        const sel = profile.priorityTags.includes(t.id);
        return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("priorityTags", t.id), style: {
          padding: "8px 12px",
          borderRadius: 10,
          background: sel ? "rgba(76,175,80,0.12)" : "rgba(255,255,255,0.03)",
          border: `1.5px solid ${sel ? "#4CAF50" : "rgba(255,255,255,0.08)"}`,
          color: sel ? "#4CAF50" : "#94a3b8",
          fontSize: 11,
          fontWeight: sel ? 700 : 500,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s ease"
        } }, t.label);
      }))), showBrands && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionStyle, ...sectionAnim(100) } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 3, fontFamily: "'Outfit'" } }, "\u{1F3F7} Marques pr\xE9f\xE9r\xE9es ", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontWeight: 400, fontSize: 11, color: "#64748b" } }, "(optionnel)")), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px" } }, "Laisse vide pour voir toutes les marques."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, BRAND_TAGS.map((t) => {
        const sel = profile.brandTags.includes(t.id);
        return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("brandTags", t.id), style: {
          padding: "7px 10px",
          borderRadius: 8,
          background: sel ? "rgba(156,39,176,0.12)" : "rgba(255,255,255,0.03)",
          border: `1.5px solid ${sel ? "#9C27B0" : "rgba(255,255,255,0.08)"}`,
          color: sel ? "#CE93D8" : "#94a3b8",
          fontSize: 10,
          fontWeight: sel ? 700 : 500,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s ease"
        } }, t.label);
      }))), showSave && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...sectionAnim(200), marginBottom: 20 } }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
        if (!profileName.trim()) {
          alert("Donne un nom \xE0 ton profil");
          return;
        }
        const list = saveNamedProfile(profileName.trim(), profile);
        setSavedProfiles(list);
        setScreen("dashboard");
      }, style: {
        width: "100%",
        padding: "16px",
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 800,
        cursor: "pointer",
        fontFamily: "'Outfit',sans-serif",
        background: "linear-gradient(135deg,rgba(76,175,80,0.25),rgba(76,175,80,0.12))",
        border: "1.5px solid rgba(76,175,80,0.4)",
        color: "#4CAF50",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 20px rgba(76,175,80,0.15)"
      } }, "\u2705 C'est parti \u2014 Voir mon dashboard")), /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "center", marginBottom: 30 } }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setScreen("home"), style: { background: "none", border: "none", color: "#475569", fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: "6px 12px" } }, "\u2190 Retour \xE0 l'accueil")));
    })(), screen === "dashboard" && (() => {
      const age = Number(profile.age) || 0;
      const ht = Number(profile.height) || 0;
      const isJunior = age > 0 && age < 15 || ht > 0 && ht < 150;
      let pool = isJunior ? rackets_db_default.filter((r) => r.category === "junior") : (() => {
        const lvl = profile.level || "D\xE9butant";
        const catMap = { "D\xE9butant": ["debutant", "intermediaire"], "Interm\xE9diaire": ["intermediaire", "debutant", "avance"], "Avanc\xE9": ["avance", "intermediaire", "expert"], "Expert": ["expert", "avance"] };
        return rackets_db_default.filter((r) => (catMap[lvl] || ["debutant", "intermediaire"]).includes(r.category));
      })();
      const brandPref = (profile.brandTags || []).map((id) => BRAND_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      const scored = pool.map((r) => ({ ...r, _gs: computeGlobalScore(r.scores, profile), _fy: computeForYou(r.scores, profile) }));
      scored.sort((a, b) => b._gs - a._gs);
      const top3 = scored.slice(0, 3);
      const w = { Puissance: 1, Contr\u00F4le: 1, Confort: 1, Spin: 1, Maniabilit\u00E9: 1, Tol\u00E9rance: 1 };
      const prioMap = { confort: { Confort: 1.5 }, polyvalence: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.5, Tol\u00E9rance: 0.5 }, puissance: { Puissance: 1.5 }, controle: { Contr\u00F4le: 1.5 }, spin: { Spin: 1.5 }, legerete: { Maniabilit\u00E9: 1.5 }, protection: { Confort: 1.5 }, reprise: { Confort: 1.5, Tol\u00E9rance: 1, Maniabilit\u00E9: 0.5 } };
      for (const tag of profile.priorityTags || []) {
        const boosts = prioMap[tag];
        if (boosts) for (const [k, v] of Object.entries(boosts)) w[k] = (w[k] || 1) + v;
      }
      const styleMap = { offensif: { Puissance: 0.5 }, defensif: { Contr\u00F4le: 0.5, Tol\u00E9rance: 0.5 }, tactique: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.3 }, puissant: { Puissance: 0.5, Spin: 0.3 }, veloce: { Maniabilit\u00E9: 0.8 }, endurant: { Confort: 0.5, Tol\u00E9rance: 0.3 }, contre: { Tol\u00E9rance: 0.5, Contr\u00F4le: 0.3 }, polyvalent: { Contr\u00F4le: 0.3, Tol\u00E9rance: 0.3 }, technique: { Contr\u00F4le: 0.5, Spin: 0.3 } };
      for (const tag of profile.styleTags || []) {
        const boosts = styleMap[tag];
        if (boosts) for (const [k, v] of Object.entries(boosts)) w[k] = (w[k] || 1) + v;
      }
      const maxW = Math.max(...Object.values(w));
      const idealRadar = ATTRS.map((a) => ({ attribute: a, Id\u00E9al: Math.round(w[a] / maxW * 10 * 10) / 10 }));
      const levelColors = { D\u00E9butant: "#4CAF50", Interm\u00E9diaire: "#FF9800", Avanc\u00E9: "#ef4444", Comp\u00E9tition: "#9C27B0", Expert: "#9C27B0" };
      const styles = (profile.styleTags || []).map((id) => STYLE_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      const injuries = (profile.injuryTags || []).filter((t) => t !== "aucune").map((id) => INJURY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      const priorities = (profile.priorityTags || []).map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      const hand = profile.hand || "Droitier";
      const side = profile.side || "Droite";
      const isAttacker = hand === "Droitier" && side === "Gauche" || hand === "Gaucher" && side === "Droite";
      const role = side === "Les deux" ? "Polyvalent" : isAttacker ? "Attaquant" : "Constructeur";
      const hasSession = rackets.length > 0;
      const fyConfig2 = { recommended: { text: "RECOMMAND\xC9", bg: "#1B5E20", border: "#4CAF50", color: "#4CAF50" }, partial: { text: "JOUABLE", bg: "#E65100", border: "#FF9800", color: "#FF9800" }, no: { text: "D\xC9CONSEILL\xC9", bg: "#B71C1C", border: "#E53935", color: "#E53935" } };
      return /* @__PURE__ */ import_react.default.createElement("div", { style: { maxWidth: 1020, margin: "0 auto", padding: "0 24px", animation: "fadeIn 0.5s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { flexShrink: 0, filter: "drop-shadow(0 4px 12px rgba(249,115,22,0.3))" } }, /* @__PURE__ */ import_react.default.createElement("defs", null, /* @__PURE__ */ import_react.default.createElement("linearGradient", { id: "logoGradDash", x1: "0", y1: "0", x2: "44", y2: "44" }, /* @__PURE__ */ import_react.default.createElement("stop", { offset: "0%", stopColor: "#f97316" }), /* @__PURE__ */ import_react.default.createElement("stop", { offset: "100%", stopColor: "#ef4444" }))), /* @__PURE__ */ import_react.default.createElement("rect", { width: "44", height: "44", rx: "10", fill: "url(#logoGradDash)" }), /* @__PURE__ */ import_react.default.createElement("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.2", fill: "none" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.85" })), /* @__PURE__ */ import_react.default.createElement("h1", { style: { fontFamily: "'Outfit'", fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 } }, "PADEL ANALYZER")), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "16px 22px", marginBottom: 20, animation: "fadeIn 0.3s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,rgba(249,115,22,0.3),rgba(239,68,68,0.2))", border: "2px solid rgba(249,115,22,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#f97316", flexShrink: 0 } }, profileName.charAt(0).toUpperCase()), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 18, fontWeight: 700, color: "#f1f5f9" } }, profileName), profile.level && /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: levelColors[profile.level] || "#64748b", background: `${levelColors[profile.level] || "#64748b"}18`, padding: "3px 10px", borderRadius: 8, textTransform: "uppercase" } }, profile.level, isJunior ? " \xB7 Junior" : ""), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#94a3b8" } }, hand, " \xB7 C\xF4t\xE9 ", side), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#a5b4fc", fontWeight: 600 } }, "\u{1F3AF} ", role)), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 } }, styles.map((s) => /* @__PURE__ */ import_react.default.createElement("span", { key: s, style: { fontSize: 10, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, padding: "2px 8px", color: "#a5b4fc" } }, s)), priorities.map((p) => /* @__PURE__ */ import_react.default.createElement("span", { key: p, style: { fontSize: 10, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 8, padding: "2px 8px", color: "#f97316" } }, p)), injuries.map((inj) => /* @__PURE__ */ import_react.default.createElement("span", { key: inj, style: { fontSize: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "2px 8px", color: "#ef4444" } }, "\u{1FA79} ", inj)))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
        setScreen("home");
      }, style: { background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 8px", color: "#64748b", fontSize: 10, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }, title: "Changer de profil" }, "\u{1F465}"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: disconnect, style: { background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 8px", color: "#64748b", fontSize: 10, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }, title: "D\xE9connexion" }, "\u23FB")))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 20, marginBottom: 20, alignItems: "stretch" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: "0 0 400px", display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "14px 12px", flex: 1, animation: "fadeIn 0.4s ease" } }, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center", marginBottom: 4, marginTop: 0 } }, "\u{1F4CA} Raquette id\xE9ale pour ", profileName), /* @__PURE__ */ import_react.default.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: 195 }, /* @__PURE__ */ import_react.default.createElement(import_recharts.RadarChart, { data: idealRadar, margin: { top: 10, right: 34, bottom: 8, left: 34 } }, /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarGrid, { stroke: "rgba(255,255,255,0.08)" }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarAngleAxis, { dataKey: "attribute", tick: { fill: "#94a3b8", fontSize: 10 } }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarRadiusAxis, { angle: 90, domain: [0, 10], tick: false, axisLine: false }), /* @__PURE__ */ import_react.default.createElement(import_recharts.Radar, { name: "Id\xE9al", dataKey: "Id\xE9al", stroke: "#f97316", fill: "#f97316", fillOpacity: 0.15, strokeWidth: 2 })))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 10px", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: "#f97316", fontFamily: "'Outfit'" } }, pool.length), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" } }, "Compatibles")), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 10px", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 28, fontWeight: 800, color: "#4CAF50", fontFamily: "'Outfit'" } }, scored.filter((r) => r._fy === "recommended").length), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" } }, "Recommand\xE9es")), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 10px", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 20, fontWeight: 800, color: "#a5b4fc", fontFamily: "'Outfit'" } }, top3.length > 0 ? top3[0]._gs.toFixed(1) : "\u2014", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#64748b" } }, "/10")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" } }, "Meilleur score")))), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "18px 20px", animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center", marginTop: 0, marginBottom: 4 } }, "\u{1F3C6} Top 3 absolu pour ", profileName), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#475569", textAlign: "center", margin: "0 0 14px", lineHeight: 1.4 } }, "Sur ", scored.length, " raquettes compatibles", brandPref.length > 0 ? /* @__PURE__ */ import_react.default.createElement("span", null, " \xB7 Toutes marques confondues") : ""), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, flex: 1 } }, top3.map((r, i) => {
        const fy = fyConfig2[r._fy] || fyConfig2.partial;
        const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
        return /* @__PURE__ */ import_react.default.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: i === 0 ? "rgba(249,115,22,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${i === 0 ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, transition: "all 0.2s" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 22, flexShrink: 0, width: 28, textAlign: "center" } }, medals[i]), r.imageUrl && /* @__PURE__ */ import_react.default.createElement("img", { src: proxyImg(r.imageUrl), alt: "", style: { width: 48, height: 48, objectFit: "contain", borderRadius: 8, background: "rgba(255,255,255,0.06)", flexShrink: 0 }, onError: (e) => {
          e.target.style.display = "none";
        } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r.name), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 2 } }, r.brand, " \xB7 ", r.shape, " \xB7 ", r.weight), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 3 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, fontWeight: 600, color: fy.color, background: `${fy.bg}30`, border: `1px solid ${fy.border}40`, borderRadius: 6, padding: "2px 7px", textTransform: "uppercase" } }, fy.text), r.price && r.price !== "\u2014" && /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, color: "#64748b" } }, r.price))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: i === 0 ? "#f97316" : "#cbd5e1", fontFamily: "'Outfit'" } }, r._gs.toFixed(1)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 8, color: "#64748b", textTransform: "uppercase" } }, "Score")));
      })), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 12, padding: "10px 14px", background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 12 } }, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#a5b4fc", margin: "0 0 3px", fontWeight: 600 } }, "\u{1F4A1} Comment lire ce classement ?"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: 0, lineHeight: 1.6 } }, "Calcul\xE9 sur ", rackets_db_default.length, " raquettes en croisant profil, style et priorit\xE9s. Lance l'analyse d\xE9taill\xE9e pour les scores par crit\xE8re, radars comparatifs et l'Ar\xE8ne.")))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 14, animation: "fadeIn 0.6s ease" } }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => launchAnalysis(top3), style: { flex: "1 1 220px", padding: "14px", background: "linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))", border: "1px solid rgba(249,115,22,0.35)", borderRadius: 14, color: "#f97316", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", letterSpacing: "-0.01em", textAlign: "center" } }, "\u{1F4CA} Analyser ce Top 3 en d\xE9tail"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
        setPanel("suggest");
        goToApp();
      }, style: { flex: "1 1 180px", padding: "14px 16px", background: "rgba(76,175,80,0.08)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: 14, color: "#4CAF50", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", null, "\u{1F3AF} Sugg\xE8re-moi d'autres"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", fontWeight: 400, marginTop: 3 } }, brandPref.length > 0 ? `Priorit\xE9 ${brandPref.join(", ")}` : "Recommandations IA")), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
        goToApp();
      }, style: { flex: "1 1 180px", padding: "14px 16px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 14, color: "#a5b4fc", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", null, hasSession ? "\u{1F4CA} Reprendre l'analyse" : "\u{1F4CA} Explorer la base"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", fontWeight: 400, marginTop: 3 } }, hasSession ? "Session en cours" : "Comparer, radars, PDF")), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
        setWizardStep(0);
        setPanel("profile");
        goToApp();
      }, style: { flex: "0 1 150px", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#94a3b8", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", null, "\u270F\uFE0F Modifier profil"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", fontWeight: 400, marginTop: 3 } }, "Affiner les r\xE9sultats"))), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 7, color: "#334155", letterSpacing: "0.05em", textAlign: "center", marginTop: 8 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "'Outfit'", fontWeight: 600 } }, "PADEL ANALYZER"), " V8.0 \xB7 ", rackets_db_default.length, " raquettes \xB7 Scoring hybride IA"));
    })(), screen === "app" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { flexShrink: 0, filter: "drop-shadow(0 4px 12px rgba(249,115,22,0.3))" } }, /* @__PURE__ */ import_react.default.createElement("defs", null, /* @__PURE__ */ import_react.default.createElement("linearGradient", { id: "logoGrad", x1: "0", y1: "0", x2: "44", y2: "44" }, /* @__PURE__ */ import_react.default.createElement("stop", { offset: "0%", stopColor: "#f97316" }), /* @__PURE__ */ import_react.default.createElement("stop", { offset: "100%", stopColor: "#ef4444" }))), /* @__PURE__ */ import_react.default.createElement("rect", { width: "44", height: "44", rx: "10", fill: "url(#logoGrad)" }), /* @__PURE__ */ import_react.default.createElement("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.2", fill: "none" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "10", x2: "22", y2: "26", stroke: "#fff", strokeWidth: "1.2", opacity: "0.4" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "14", y1: "18", x2: "30", y2: "18", stroke: "#fff", strokeWidth: "1.2", opacity: "0.4" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.85" })), /* @__PURE__ */ import_react.default.createElement("h1", { style: { fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" } }, "PADEL ANALYZER")), /* @__PURE__ */ import_react.default.createElement("p", { style: { color: "#475569", fontSize: 10, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 } }, "Recherche web \xB7 Notation calibr\xE9e \xB7 Profil personnalisable"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 8, color: "#334155", marginTop: 4, fontFamily: "'Outfit'", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("span", null, "V8.0"), /* @__PURE__ */ import_react.default.createElement("span", { style: { background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 10, padding: "1px 7px", color: "#f97316", fontSize: 8, fontWeight: 600 } }, "\u{1F5C3}\uFE0F ", rackets_db_default.length, localDBCount > 0 && /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#22c55e" } }, " + ", localDBCount))), profileName && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20, padding: "4px 12px 4px 6px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,rgba(249,115,22,0.25),rgba(239,68,68,0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#f97316", flexShrink: 0 } }, profileName.charAt(0).toUpperCase()), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: "#a5b4fc" } }, profileName)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: goToDashboard, style: { background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 20, padding: "4px 10px", color: "#f97316", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11 } }, "\u{1F3E0}"), " Dashboard"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: disconnect, style: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "4px 10px", color: "#64748b", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 12 } }, "\u23FB"), " D\xE9connexion"))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" } }, [["suggest", "\u{1F3AF} Sugg\xE8re-moi"], ["add", "+ Ajouter"], ["profile", "\u{1F464} Profil"], ["manage", "\u{1F5D1} G\xE9rer"]].map(([k, l]) => /* @__PURE__ */ import_react.default.createElement("button", { key: k, onClick: () => {
      if (k === "profile") setWizardStep(0);
      setPanel((p) => p === k ? null : k);
    }, style: { ...S.btn(panel === k), borderRadius: 20 } }, l))), panel === "suggest" && /* @__PURE__ */ import_react.default.createElement("div", { style: S.card }, /* @__PURE__ */ import_react.default.createElement("div", { style: S.title }, "\u{1F3AF} RAQUETTES SUGG\xC9R\xC9ES POUR TON PROFIL"), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 10, padding: 10, marginBottom: 10 } }, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#f97316", fontWeight: 700, margin: "0 0 4px" } }, "Ton profil :"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 9, color: "#94a3b8", margin: 0, lineHeight: 1.5 } }, profileText)), !suggestResults && !loading && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 10px", lineHeight: 1.4 } }, "Recherche des raquettes les plus adapt\xE9es \xE0 ton profil : ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f97316", fontWeight: 600 } }, "\u2B50 Coups de c\u0153ur"), " (meilleures correspondances) et ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#fbbf24", fontWeight: 600 } }, "\u26A1 Alternatives Priorit\xE9"), " (orient\xE9es ", profile.priorityTags.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean).join(", ") || "tes priorit\xE9s", "). Coche celles qui t'int\xE9ressent puis valide en un clic."), /* @__PURE__ */ import_react.default.createElement("button", { onClick: suggestRackets, style: S.btnGreen }, "\u{1F50D} Lancer la recherche")), loadMsg && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#f97316", marginTop: 10, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" } }, "\u23F3"), /* @__PURE__ */ import_react.default.createElement("span", null, loadMsg), /* @__PURE__ */ import_react.default.createElement("style", null, `@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`)), error && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#ef4444", marginTop: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 10px", lineHeight: 1.4 } }, error), batchProgress && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 12, color: "#4CAF50", marginTop: 8, fontWeight: 600 } }, batchProgress), suggestResults && /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 6 } }, (() => {
      const hearts = suggestResults.filter((s) => s.category === "heart");
      const prios = suggestResults.filter((s) => s.category === "priority");
      const hasCategories = hearts.length > 0 || prios.length > 0;
      const topPicks = hasCategories ? hearts : suggestResults.slice(0, 4);
      const prioAlts = hasCategories ? prios : [];
      const others = hasCategories ? suggestResults.filter((s) => s.category !== "heart" && s.category !== "priority") : suggestResults.slice(4);
      const prioLabels = profile.priorityTags.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, topPicks.length > 0 && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 6 } }, "\u2B50 Coups de c\u0153ur \u2014 meilleures correspondances :"), topPicks.map((s) => {
        const ri = suggestResults.indexOf(s);
        return renderSuggestCard(s, ri, suggestChecked.has(ri), true);
      })), prioAlts.length > 0 && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#fbbf24", fontWeight: 700, marginBottom: 4, marginTop: 14 } }, "\u26A1 Alternatives Priorit\xE9 \u2014 ", prioLabels.join(", "), " :"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 9, color: "#64748b", marginBottom: 6 } }, "Raquettes orient\xE9es vers tes priorit\xE9s, confort parfois limit\xE9 \u2014 \xE0 tester avant d'acheter."), prioAlts.map((s) => {
        const ri = suggestResults.indexOf(s);
        return renderSuggestCard(s, ri, suggestChecked.has(ri), false);
      })), others.length > 0 && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 6, marginTop: 12 } }, "\u{1F4CB} Autres suggestions :"), others.map((s) => {
        const ri = suggestResults.indexOf(s);
        return renderSuggestCard(s, ri, suggestChecked.has(ri), false);
      })));
    })(), !addingBatch && suggestResults && suggestResults.length > 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
      const allIdxs = suggestResults.map((_, i) => i).filter((i) => !suggestResults[i]._added);
      const allSelected = allIdxs.every((i) => suggestChecked.has(i));
      if (allSelected) setSuggestChecked(/* @__PURE__ */ new Set());
      else setSuggestChecked(new Set(allIdxs));
    }, style: { ...S.btn(false), padding: "8px 14px", fontSize: 11 } }, suggestResults.filter((_, i) => !suggestResults[i]._added).every((_, i) => suggestChecked.has(i)) ? "\u2610 Tout d\xE9s\xE9lectionner" : "\u2611 Tout s\xE9lectionner"), suggestChecked.size > 0 && /* @__PURE__ */ import_react.default.createElement("button", { onClick: addCheckedSuggestions, style: { ...S.btnGreen, flex: 1, padding: "8px 14px" } }, "\u2705 Ajouter ", suggestChecked.size, " raquette", suggestChecked.size > 1 ? "s" : "", " au comparateur")), addingBatch && /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "center", padding: "12px 0", color: "#f97316", fontSize: 12, fontWeight: 600 } }, batchProgress), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
      setSuggestResults(null);
      setSuggestChecked(/* @__PURE__ */ new Set());
      setError("");
    }, style: { ...S.btn(false), marginTop: 8, width: "100%", padding: "8px 0", fontSize: 11 } }, "\u{1F504} Relancer une nouvelle recherche"))), panel === "add" && /* @__PURE__ */ import_react.default.createElement("div", { style: S.card }, /* @__PURE__ */ import_react.default.createElement("div", { style: S.title }, "\u{1F50D} RECHERCHER UNE RAQUETTE"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#64748b", margin: "0 0 8px", lineHeight: 1.4 } }, 'Tape un nom m\xEAme approximatif : "nox tapia 12k", "bullpadel paquito", "babolat lebron"...'), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ import_react.default.createElement("input", { value: searchQ, onChange: (e) => setSearchQ(e.target.value), onKeyDown: (e) => e.key === "Enter" && !loading && searchRackets(), placeholder: "Ex: nox tapia 12k, adidas metalbone...", style: { ...S.input, flex: 1 } }), /* @__PURE__ */ import_react.default.createElement("button", { onClick: searchRackets, disabled: loading || !searchQ.trim(), style: { ...S.btn(true), opacity: loading ? 0.5 : 1, minWidth: 80 } }, loading && !suggestions ? "..." : "Chercher")), loadMsg && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#f97316", marginTop: 8 } }, loadMsg), error && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#ef4444", marginTop: 8 } }, error), suggestions && /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 } }, "\u{1F4CB} R\xE9sultats \u2014 clique sur celle que tu veux ajouter :"), suggestions.map((s, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, onClick: () => !s._disabled && selectSuggestion(i), style: {
      background: s._selected ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${s._selected ? "#f97316" : "rgba(255,255,255,0.1)"}`,
      borderRadius: 10,
      padding: "10px 12px",
      marginBottom: 6,
      cursor: s._disabled ? "default" : "pointer",
      opacity: s._disabled && !s._selected ? 0.3 : 1,
      transition: "all 0.2s"
    } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#e2e8f0" } }, s.name), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#94a3b8", marginTop: 2 } }, s.brand, " \xB7 ", s.shape, " \xB7 ", s.weight), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#64748b", marginTop: 1 } }, s.description))))), panel === "profile" && /* @__PURE__ */ import_react.default.createElement("div", { style: S.card }, (() => {
      const STEPS = [
        { icon: "\u{1F464}", label: "Identit\xE9" },
        { icon: "\u{1F3BE}", label: "Jeu" },
        { icon: "\u{1FA79}", label: "Corps" },
        { icon: "\u{1F3AF}", label: "Priorit\xE9s" }
      ];
      return /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", padding: "0 4px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "absolute", top: 16, left: 24, right: 24, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, zIndex: 0 } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "absolute", top: 16, left: 24, height: 2, background: "linear-gradient(90deg,#f97316,#ef4444)", borderRadius: 1, zIndex: 1, transition: "width 0.4s cubic-bezier(.4,0,.2,1)", width: `${wizardStep / (STEPS.length - 1) * Math.max(0, 100 - 16)}%` } }), STEPS.map((s, i) => /* @__PURE__ */ import_react.default.createElement("button", { key: i, onClick: () => setWizardStep(i), style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        zIndex: 2,
        fontFamily: "inherit"
      } }, /* @__PURE__ */ import_react.default.createElement("div", { style: {
        width: 32,
        height: 32,
        borderRadius: 10,
        background: i <= wizardStep ? "linear-gradient(135deg,rgba(249,115,22,0.25),rgba(239,68,68,0.2))" : "rgba(255,255,255,0.04)",
        border: `2px solid ${i <= wizardStep ? "#f97316" : "rgba(255,255,255,0.1)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        transition: "all 0.3s ease",
        boxShadow: i === wizardStep ? "0 0 12px rgba(249,115,22,0.3)" : "none",
        transform: i === wizardStep ? "scale(1.1)" : "scale(1)"
      } }, s.icon), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, fontWeight: i === wizardStep ? 700 : 500, color: i <= wizardStep ? "#f97316" : "#475569", transition: "color 0.3s ease" } }, s.label)))));
    })(), savedProfiles.length > 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12, justifyContent: "center" } }, savedProfiles.map((sp) => /* @__PURE__ */ import_react.default.createElement("button", { key: sp.name, onClick: () => {
      setProfile({ ...INITIAL_PROFILE, ...sp.profile });
      setProfileName(sp.name);
      setWizardStep(0);
    }, style: { padding: "4px 10px", background: profileName === sp.name ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${profileName === sp.name ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, color: profileName === sp.name ? "#a5b4fc" : "#94a3b8", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } }, sp.name))), wizardStep === 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { animation: "fadeIn 0.3s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 4, fontFamily: "'Outfit'" } }, "\u{1F464} Qui es-tu ?"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 } }, "Ces infos permettent d'adapter les recommandations \xE0 ton gabarit et ton niveau."), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Nom du profil"), /* @__PURE__ */ import_react.default.createElement("input", { value: profileName, onChange: (e) => setProfileName(e.target.value), placeholder: "Ex: Bidou, Noah, Maman...", style: { ...S.input, fontSize: 13, padding: "11px 14px" } })), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "\xC2ge"), /* @__PURE__ */ import_react.default.createElement("input", { type: "number", value: profile.age, onChange: (e) => setProfile((p) => ({ ...p, age: Number(e.target.value) })), placeholder: "49", style: S.input })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Taille (cm)"), /* @__PURE__ */ import_react.default.createElement("input", { type: "number", value: profile.height, onChange: (e) => setProfile((p) => ({ ...p, height: Number(e.target.value) })), placeholder: "175", style: S.input })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Poids (kg)"), /* @__PURE__ */ import_react.default.createElement("input", { type: "number", value: profile.weight, onChange: (e) => setProfile((p) => ({ ...p, weight: Number(e.target.value) })), placeholder: "80", style: S.input }))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Niveau"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.level, onChange: (e) => setProfile((p) => ({ ...p, level: e.target.value })), style: S.select }, LEVEL_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o.value, value: o.value }, o.label, " \u2014 ", o.desc)))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Fr\xE9quence"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.frequency, onChange: (e) => setProfile((p) => ({ ...p, frequency: e.target.value })), style: S.select }, FREQ_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o.value, value: o.value }, o.label, " \u2014 ", o.desc))))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Main"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.hand, onChange: (e) => setProfile((p) => ({ ...p, hand: e.target.value })), style: S.select }, HAND_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "C\xF4t\xE9 de jeu"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.side, onChange: (e) => setProfile((p) => ({ ...p, side: e.target.value })), style: S.select }, SIDE_OPTIONS.map((o) => /* @__PURE__ */ import_react.default.createElement("option", { key: o, value: o }, o)))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("label", { style: S.label }, "Comp\xE9tition"), /* @__PURE__ */ import_react.default.createElement("select", { value: profile.competition ? "oui" : "non", onChange: (e) => setProfile((p) => ({ ...p, competition: e.target.value === "oui" })), style: S.select }, /* @__PURE__ */ import_react.default.createElement("option", { value: "non" }, "Non"), /* @__PURE__ */ import_react.default.createElement("option", { value: "oui" }, "Oui")))), (Number(profile.age) > 0 && Number(profile.age) < 15 || Number(profile.height) > 0 && Number(profile.height) < 150) && /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: "8px 10px", marginTop: 12, fontSize: 10, color: "#60a5fa", fontWeight: 600 } }, "\u{1F9D2} Profil junior d\xE9tect\xE9 \u2014 recommandations adapt\xE9es (poids l\xE9ger, grip r\xE9duit)"), Number(profile.age) >= 50 && /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "8px 10px", marginTop: 12, fontSize: 10, color: "#fbbf24", fontWeight: 600 } }, "\u{1F464} Profil 50+ \u2014 Confort, Tol\xE9rance et Maniabilit\xE9 renforc\xE9s automatiquement")), wizardStep === 1 && /* @__PURE__ */ import_react.default.createElement("div", { style: { animation: "fadeIn 0.3s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 4, fontFamily: "'Outfit'" } }, "\u{1F3BE} Comment tu joues ?"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 } }, "Ton style de jeu influence directement quels crit\xE8res sont prioritaires dans le scoring. S\xE9lectionne tout ce qui te correspond."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 } }, STYLE_TAGS.map((t) => {
      const sel = profile.styleTags.includes(t.id);
      return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("styleTags", t.id), className: "pa-tag", style: {
        padding: "10px 14px",
        borderRadius: 12,
        background: sel ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${sel ? "#f97316" : "rgba(255,255,255,0.08)"}`,
        color: sel ? "#f97316" : "#94a3b8",
        fontSize: 12,
        fontWeight: sel ? 700 : 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s ease",
        textAlign: "left"
      } }, /* @__PURE__ */ import_react.default.createElement("div", null, t.label), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: sel ? "#fb923c" : "#475569", marginTop: 2, fontWeight: 400 } }, t.tip));
    })), /* @__PURE__ */ import_react.default.createElement("label", { style: { ...S.label, marginBottom: 6 } }, "Pr\xE9cisions (optionnel)"), /* @__PURE__ */ import_react.default.createElement("input", { value: profile.styleExtra, onChange: (e) => setProfile((p) => ({ ...p, styleExtra: e.target.value })), placeholder: "Ex: Je monte beaucoup au filet, je joue avec du lift...", style: { ...S.input, fontSize: 11 } })), wizardStep === 2 && /* @__PURE__ */ import_react.default.createElement("div", { style: { animation: "fadeIn 0.3s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 4, fontFamily: "'Outfit'" } }, "\u{1FA79} Ton corps"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 } }, "Les blessures et contraintes physiques impactent directement le crit\xE8re ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#ef4444" } }, "Confort"), " dans les verdicts. Une raquette inadapt\xE9e peut aggraver les douleurs."), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 } }, INJURY_TAGS.map((t) => {
      const sel = profile.injuryTags.includes(t.id);
      const isNone = t.id === "aucune";
      return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("injuryTags", t.id), className: "pa-tag", style: {
        padding: "10px 14px",
        borderRadius: 12,
        background: sel ? isNone ? "rgba(76,175,80,0.15)" : "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${sel ? isNone ? "#4CAF50" : "#ef4444" : "rgba(255,255,255,0.08)"}`,
        color: sel ? isNone ? "#4CAF50" : "#ef4444" : "#94a3b8",
        fontSize: 12,
        fontWeight: sel ? 700 : 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s ease"
      } }, isNone ? "\u2713 " : "", t.label);
    })), /* @__PURE__ */ import_react.default.createElement("label", { style: { ...S.label, marginBottom: 6 } }, "Pr\xE9cisions (optionnel)"), /* @__PURE__ */ import_react.default.createElement("input", { value: profile.injuryExtra, onChange: (e) => setProfile((p) => ({ ...p, injuryExtra: e.target.value })), placeholder: "Ex: Tendinite chronique, post-op\xE9ration \xE9paule...", style: { ...S.input, fontSize: 11 } })), wizardStep === 3 && /* @__PURE__ */ import_react.default.createElement("div", { style: { animation: "fadeIn 0.3s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 4, fontFamily: "'Outfit'" } }, "\u{1F3AF} Qu'est-ce que tu cherches ?"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 11, color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 } }, "Ces crit\xE8res pond\xE8rent le score global. Les suggestions seront tri\xE9es en fonction de tes priorit\xE9s."), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#4CAF50", marginBottom: 6 } }, "Priorit\xE9s dans ta raquette"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 } }, PRIORITY_TAGS.map((t) => {
      const sel = profile.priorityTags.includes(t.id);
      return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("priorityTags", t.id), className: "pa-tag", style: {
        padding: "10px 14px",
        borderRadius: 12,
        background: sel ? "rgba(76,175,80,0.12)" : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${sel ? "#4CAF50" : "rgba(255,255,255,0.08)"}`,
        color: sel ? "#4CAF50" : "#94a3b8",
        fontSize: 12,
        fontWeight: sel ? 700 : 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s ease"
      } }, t.label);
    })), /* @__PURE__ */ import_react.default.createElement("input", { value: profile.priorityExtra, onChange: (e) => setProfile((p) => ({ ...p, priorityExtra: e.target.value })), placeholder: "Ex: Budget max 200\u20AC, raquette pas trop lourde...", style: { ...S.input, fontSize: 11, marginBottom: 16 } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#9C27B0", marginBottom: 6 } }, "\u{1F3F7} Marques pr\xE9f\xE9r\xE9es ", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontWeight: 400, color: "#64748b" } }, "(optionnel \u2014 vide = toutes)")), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, BRAND_TAGS.map((t) => {
      const sel = profile.brandTags.includes(t.id);
      return /* @__PURE__ */ import_react.default.createElement("button", { key: t.id, onClick: () => toggleTag("brandTags", t.id), className: "pa-tag", style: {
        padding: "8px 12px",
        borderRadius: 10,
        background: sel ? "rgba(156,39,176,0.12)" : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${sel ? "#9C27B0" : "rgba(255,255,255,0.08)"}`,
        color: sel ? "#CE93D8" : "#94a3b8",
        fontSize: 11,
        fontWeight: sel ? 700 : 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s ease"
      } }, t.label);
    }))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20, alignItems: "center" } }, wizardStep > 0 && /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setWizardStep((s) => s - 1), style: { ...S.btn(false), flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 12 } }, "\u2190 Pr\xE9c\xE9dent"), wizardStep < 3 && /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
      if (wizardStep === 0 && !profileName.trim()) {
        alert("Donne un nom \xE0 ton profil pour continuer");
        return;
      }
      setWizardStep((s) => s + 1);
    }, style: {
      flex: 2,
      padding: "12px 0",
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      background: "linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))",
      border: "1px solid rgba(249,115,22,0.35)",
      color: "#f97316",
      transition: "all 0.2s ease"
    } }, "Suivant \u2192"), wizardStep === 3 && /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
      if (!profileName.trim()) {
        alert("Retourne \xE0 l'\xE9tape 1 pour nommer ton profil");
        return;
      }
      const list = saveNamedProfile(profileName.trim(), profile);
      setSavedProfiles(list);
      setPanel(null);
      if (rackets.length > 0) reanalyzeAll();
    }, style: {
      ...S.btnGreen,
      flex: 2,
      padding: "14px 0",
      borderRadius: 12,
      fontSize: 14,
      background: "linear-gradient(135deg,rgba(76,175,80,0.25),rgba(76,175,80,0.15))"
    } }, "\u2705 Sauvegarder", rackets.length > 0 ? " & R\xE9-analyser" : "")), error && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#ef4444", marginTop: 8 } }, error)), panel === "manage" && /* @__PURE__ */ import_react.default.createElement("div", { style: S.card }, /* @__PURE__ */ import_react.default.createElement("div", { style: S.title }, "\u{1F5D1} G\xC9RER LES RAQUETTES"), rackets.length === 0 && /* @__PURE__ */ import_react.default.createElement("p", { style: { color: "#64748b", fontSize: 11, textAlign: "center", padding: "12px 0" } }, 'Aucune raquette. Utilise "\u{1F3AF} Sugg\xE8re-moi" ou "+ Ajouter" pour commencer.'), rackets.map((r) => /* @__PURE__ */ import_react.default.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: r.color } }), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#e2e8f0" } }, r.name)), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => removeRacket(r.id), style: { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "3px 8px", color: "#ef4444", fontSize: 10, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" } }, "Supprimer"))), rackets.length > 1 && /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => {
      if (confirm("Supprimer toutes les raquettes ?")) {
        setRackets([]);
        setSelected([]);
      }
    }, style: { ...S.btn(false), width: "100%", marginTop: 12, padding: "8px 0", fontSize: 11, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" } }, "\u{1F5D1} Tout effacer"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" } }, "\u{1F5C3}\uFE0F BASE DE DONN\xC9ES"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.06)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b" } }, "Embarqu\xE9es"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "#f97316", fontFamily: "'Outfit'" } }, rackets_db_default.length)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 14, color: "#334155" } }, "+"), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.06)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b" } }, "Apprises (local)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: localDBCount > 0 ? "#22c55e" : "#334155", fontFamily: "'Outfit'" } }, localDBCount)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 14, color: "#334155" } }, "="), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, background: "rgba(249,115,22,0.05)", borderRadius: 8, padding: "6px 10px", border: "1px solid rgba(249,115,22,0.15)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#f97316" } }, "Total"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Outfit'" } }, rackets_db_default.length + localDBCount))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ import_react.default.createElement("button", { onClick: exportLocalDB, disabled: localDBCount === 0, style: { ...S.btn(false), flex: 1, padding: "7px 0", fontSize: 10, opacity: localDBCount === 0 ? 0.4 : 1, cursor: localDBCount === 0 ? "default" : "pointer" } }, "\u{1F4E4} Exporter local (", localDBCount, ")"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: clearLocalDB, disabled: localDBCount === 0, style: { ...S.btn(false), flex: 1, padding: "7px 0", fontSize: 10, color: "#ef4444", borderColor: "rgba(239,68,68,0.2)", opacity: localDBCount === 0 ? 0.4 : 1, cursor: localDBCount === 0 ? "default" : "pointer" } }, "\u{1F9F9} Vider local")), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 8, color: "#475569", margin: "6px 0 0", lineHeight: 1.4 } }, "Les raquettes \xAB apprises \xBB sont celles trouv\xE9es via recherche web. Exporte-les pour les int\xE9grer \xE0 la base embarqu\xE9e."))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10, marginBottom: 20 } }, rackets.length === 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { gridColumn: "1/-1", textAlign: "center", padding: "30px 16px", color: "#64748b", fontSize: 12 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 32, marginBottom: 8 } }, "\u{1F3BE}"), /* @__PURE__ */ import_react.default.createElement("p", { style: { margin: "0 0 4px", fontWeight: 600, color: "#94a3b8" } }, "Aucune raquette"), /* @__PURE__ */ import_react.default.createElement("p", { style: { margin: 0 } }, "Clique sur ", /* @__PURE__ */ import_react.default.createElement("strong", null, "\u{1F3AF} Sugg\xE8re-moi"), " pour des recommandations personnalis\xE9es", /* @__PURE__ */ import_react.default.createElement("br", null), "ou ", /* @__PURE__ */ import_react.default.createElement("strong", null, "+ Ajouter"), " pour chercher un mod\xE8le pr\xE9cis")), rackets.map((r) => {
      const isSel = selected.includes(r.id);
      const fy = fyConfig[computeForYou(r.scores, profile)] || fyConfig.partial;
      return /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          key: r.id,
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
          }
        },
        /* @__PURE__ */ import_react.default.createElement("div", { className: "pa-badge", style: { position: "absolute", top: -8, right: 8, background: fy.bg + "dd", border: `1px solid ${fy.border}`, borderRadius: 20, padding: "2px 8px", fontSize: 7, fontWeight: 700, color: "#fff", letterSpacing: "0.03em", boxShadow: `0 2px 8px ${fy.bg}44` } }, fy.text),
        r.imageUrl && /* @__PURE__ */ import_react.default.createElement("img", { src: proxyImg(r.imageUrl), alt: "", style: { width: 38, height: 38, objectFit: "contain", borderRadius: 6, marginBottom: 4, background: "rgba(255,255,255,0.06)" }, onError: (e) => {
          e.target.style.display = "none";
        } }),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: r.color, marginBottom: 6, boxShadow: isSel ? `0 0 8px ${r.color}` : "none", transition: "box-shadow 0.2s ease" } }),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: isSel ? "#fff" : "#94a3b8", lineHeight: 1.3, transition: "color 0.2s ease" } }, r.shortName),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#475569", marginTop: 3 } }, r.shape, " \xB7 ", r.weight),
        /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#475569" } }, r.brand, " \xB7 ", r.price),
        r._incomplete && /* @__PURE__ */ import_react.default.createElement("div", { onClick: (e) => {
          e.stopPropagation();
          rescoreRacket(r.id);
        }, style: { position: "absolute", bottom: 4, right: 4, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: 6, padding: "2px 6px", fontSize: 8, color: "#f97316", fontWeight: 700, cursor: "pointer" } }, "\u{1F504} Re-scorer")
      );
    })), selRackets.length >= 2 && /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        onClick: () => setShowArena(true),
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "14px 20px",
          marginBottom: 18,
          borderRadius: 14,
          cursor: "pointer",
          fontFamily: "'Outfit',sans-serif",
          background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1),rgba(236,72,153,0.08))",
          border: "1.5px solid rgba(124,58,237,0.35)",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 24px rgba(124,58,237,0.15)"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(79,70,229,0.18),rgba(236,72,153,0.12))";
          e.currentTarget.style.boxShadow = "0 6px 32px rgba(124,58,237,0.25)";
          e.currentTarget.style.transform = "translateY(-1px)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1),rgba(236,72,153,0.08))";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.15)";
          e.currentTarget.style.transform = "none";
        }
      },
      /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 18 } }, "\u2694\uFE0F"),
      /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "#c4b5fd", letterSpacing: "-0.01em" } }, "Entrer dans l'Ar\xE8ne"),
      /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, color: "#7c3aed", fontWeight: 600, background: "rgba(124,58,237,0.15)", padding: "2px 8px", borderRadius: 8 } }, selRackets.length, " raquettes")
    ), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 2, marginBottom: 18, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.04)" } }, [["radar", "\u{1F578} Radar"], ["bars", "\u{1F4CA} Barres"], ["table", "\u{1F4CB} D\xE9tails"], ["fit", "\u{1F3AF} Pertinence"]].map(([k, l]) => /* @__PURE__ */ import_react.default.createElement("button", { key: k, className: `pa-tab ${tab === k ? "pa-tab-active" : ""}`, onClick: () => setTab(k), style: { flex: 1, padding: "9px 0", background: tab === k ? "rgba(255,255,255,0.06)" : "transparent", border: "none", borderRadius: 9, color: tab === k ? "#fff" : "#64748b", fontSize: 11, fontWeight: tab === k ? 700 : 500, cursor: "pointer", fontFamily: "'Inter',sans-serif", letterSpacing: "-0.01em", transition: "all 0.2s ease" } }, l))), tab === "radar" && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...S.card, padding: 20, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ import_react.default.createElement("style", null, `
          @keyframes racketFadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 0, minHeight: 400 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 280, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 } }, (() => {
      const hr = hoveredRacket ? selRackets.find((r) => r.id === hoveredRacket) : null;
      if (!hr || !hr.imageUrl) return /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.3 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 100, height: 100, borderRadius: "50%", border: "2px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 32, opacity: 0.4 } }, "\u{1F446}")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#334155", textAlign: "center", lineHeight: 1.4 } }, "Survole une raquette", /* @__PURE__ */ import_react.default.createElement("br", null), "pour voir son visuel"));
      return /* @__PURE__ */ import_react.default.createElement("div", { key: hr.id, style: { animation: "racketFadeIn 0.3s ease-out", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: {
        background: "rgba(255,255,255,0.03)",
        border: `2px solid ${hr.color}40`,
        borderRadius: 20,
        padding: 20,
        boxShadow: `0 0 40px ${hr.color}15, inset 0 0 20px ${hr.color}08`,
        transition: "border-color 0.3s ease"
      } }, /* @__PURE__ */ import_react.default.createElement("img", { src: proxyImg(hr.imageUrl), alt: hr.name, style: {
        width: 240,
        height: 280,
        objectFit: "contain",
        display: "block",
        margin: "0 auto",
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))"
      }, onError: (e) => {
        e.target.style.display = "none";
      } })), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: hr.color, lineHeight: 1.2 } }, hr.name), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#64748b", marginTop: 4 } }, hr.shape, " \xB7 ", hr.weight), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#64748b" } }, hr.brand, hr.price && hr.price !== "\u2014" ? ` \xB7 ${hr.price}` : ""), hr.player && hr.player !== "\u2014" && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#475569", marginTop: 3 } }, "\u{1F3BE} ", hr.player)));
    })()), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, minWidth: 0, position: "relative" } }, /* @__PURE__ */ import_react.default.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: 400 }, /* @__PURE__ */ import_react.default.createElement(import_recharts.RadarChart, { data: radarData, cx: "50%", cy: "50%", outerRadius: "75%" }, /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarGrid, { stroke: "rgba(255,255,255,0.12)", strokeDasharray: "3 3", gridType: "polygon" }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarAngleAxis, { dataKey: "attribute", tick: { fill: "#94a3b8", fontSize: 11, fontWeight: 600, fontFamily: "Inter" } }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarRadiusAxis, { angle: 90, domain: [0, 10], tick: { fill: "#64748b", fontSize: 9, fontWeight: 500 }, tickCount: 6, axisLine: false }), /* @__PURE__ */ import_react.default.createElement(
      import_recharts.Radar,
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
    ), selRackets.map((r, i) => {
      const isHovered = hoveredRacket === r.id;
      const anyHovered = hoveredRacket !== null;
      return /* @__PURE__ */ import_react.default.createElement(
        import_recharts.Radar,
        {
          key: r.id,
          name: r.shortName,
          dataKey: r.shortName,
          stroke: r.color,
          fill: r.color,
          fillOpacity: isHovered ? 0.35 : anyHovered ? 0.03 : 0.08 + i * 0.03,
          strokeWidth: isHovered ? 3.5 : anyHovered ? 1 : 2.5,
          strokeOpacity: isHovered ? 1 : anyHovered ? 0.3 : 1
        }
      );
    }), /* @__PURE__ */ import_react.default.createElement(import_recharts.Legend, { wrapperStyle: { fontSize: 10, color: "#94a3b8", paddingTop: 10, fontFamily: "Inter" } }))), /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "absolute", top: 8, right: 12, fontSize: 9, color: "#475569", display: "flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: "20", height: "8" }, /* @__PURE__ */ import_react.default.createElement("line", { x1: "0", y1: "4", x2: "20", y2: "4", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1.5", strokeDasharray: "4 2" })), /* @__PURE__ */ import_react.default.createElement("span", null, "Score parfait 10/10"))))), tab === "bars" && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...S.card, padding: 20 } }, /* @__PURE__ */ import_react.default.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: 360 }, /* @__PURE__ */ import_react.default.createElement(import_recharts.BarChart, { data: radarData, layout: "vertical", margin: { left: 80, right: 20 } }, /* @__PURE__ */ import_react.default.createElement(import_recharts.CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.04)" }), /* @__PURE__ */ import_react.default.createElement(import_recharts.XAxis, { type: "number", domain: [0, 10], tick: { fill: "#475569", fontSize: 9, fontFamily: "Inter" } }), /* @__PURE__ */ import_react.default.createElement(import_recharts.YAxis, { dataKey: "attribute", type: "category", tick: { fill: "#94a3b8", fontSize: 10, fontWeight: 600, fontFamily: "Inter" }, width: 75 }), /* @__PURE__ */ import_react.default.createElement(import_recharts.Tooltip, { contentStyle: { background: "#1a2236", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 11, fontFamily: "Inter", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" } }), selRackets.map((r) => /* @__PURE__ */ import_react.default.createElement(import_recharts.Bar, { key: r.id, dataKey: r.shortName, fill: r.color, radius: [0, 5, 5, 0], barSize: 10 }))))), tab === "table" && /* @__PURE__ */ import_react.default.createElement("div", { style: { ...S.card, overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 10 } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("th", { style: { textAlign: "left", padding: "8px 6px", color: "#475569", borderBottom: "2px solid rgba(255,255,255,0.06)", fontSize: 9, letterSpacing: "0.03em" } }), selRackets.map((r) => /* @__PURE__ */ import_react.default.createElement("th", { key: r.id, style: { textAlign: "center", padding: "8px 4px", color: r.color, fontWeight: 700, borderBottom: "2px solid rgba(255,255,255,0.06)", fontSize: 9, minWidth: 85, fontFamily: "'Outfit'", letterSpacing: "0.02em" } }, r.shortName)))), /* @__PURE__ */ import_react.default.createElement("tbody", null, [{ l: "Marque", k: "brand" }, { l: "Forme", k: "shape" }, { l: "Poids", k: "weight" }, { l: "\xC9quilibre", k: "balance" }, { l: "Surface", k: "surface" }, { l: "Mousse", k: "core" }, { l: "Joueur", k: "player" }, { l: "Prix indicatif", k: "price" }].map((row, i) => /* @__PURE__ */ import_react.default.createElement("tr", { key: row.k, className: "pa-row", style: { background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 6px", color: "#94a3b8", fontWeight: 600, fontSize: 10 } }, row.l), selRackets.map((r) => /* @__PURE__ */ import_react.default.createElement("td", { key: r.id, style: { padding: "6px 4px", textAlign: "center", color: "#cbd5e1", fontSize: 10 } }, r[row.k])))), /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", { colSpan: selRackets.length + 1, style: { padding: "12px 6px 4px", color: "#f97316", fontWeight: 700, fontSize: 10, borderTop: "2px solid rgba(249,115,22,0.15)", fontFamily: "'Outfit'", letterSpacing: "0.04em", textTransform: "uppercase" } }, "Notes brutes /10")), selRackets.some((r) => r.refSource) && /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "2px 6px", fontSize: 8, color: "#334155", fontStyle: "italic" } }, "Source"), selRackets.map((r) => /* @__PURE__ */ import_react.default.createElement("td", { key: r.id, style: { padding: "2px 4px", textAlign: "center", fontSize: 7, color: "#334155", fontStyle: "italic" } }, r.refSource || "R\xE8gles m\xE9ca."))), ATTRS.map((attr, i) => {
      const mx = Math.max(...selRackets.map((r) => r.scores[attr]));
      return /* @__PURE__ */ import_react.default.createElement("tr", { key: attr, className: "pa-row", style: { background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "6px 6px", color: "#94a3b8", fontWeight: 600 } }, attr), selRackets.map((r) => {
        const v = r.scores[attr];
        const best = v === mx && selRackets.length > 1;
        return /* @__PURE__ */ import_react.default.createElement("td", { key: r.id, style: { padding: "6px 4px", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: best ? "#4ade80" : "#cbd5e1", fontWeight: best ? 700 : 500, fontFamily: "'Outfit'", fontSize: 12 } }, v), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: "70%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: `${v * 10}%`, height: "100%", borderRadius: 2, background: v >= 8 ? r.color : v >= 6.5 ? "#64748b" : "#ef444466", transition: "width 0.4s ease" } }))));
      }));
    }), (() => {
      const avgs = selRackets.map((r) => Math.round(ATTRS.reduce((s, a) => s + r.scores[a], 0) / ATTRS.length * 10) / 10);
      const mxA = Math.max(...avgs);
      return /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderTop: "2px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.04)" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "10px 6px", color: "#f97316", fontWeight: 800, fontSize: 11, fontFamily: "'Outfit'" } }, "\u2B50 MOYENNE"), selRackets.map((r, i) => {
        const a = avgs[i];
        const best = a === mxA && selRackets.length > 1;
        return /* @__PURE__ */ import_react.default.createElement("td", { key: r.id, style: { padding: "10px 4px", textAlign: "center", color: best ? "#4ade80" : "#f97316", fontWeight: 800, fontSize: 14, fontFamily: "'Outfit'" } }, a, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, color: "#64748b", fontWeight: 500 } }, "/10"));
      }));
    })()))), tab === "fit" && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("style", null, `
          @media print {
            * { box-sizing: border-box !important; }
            body * { visibility: hidden !important; }
            #print-pertinence, #print-pertinence * { visibility: visible !important; }
            #print-pertinence {
              position: absolute !important; left: 0 !important; top: 0 !important;
              width: 100% !important; max-width: 100% !important;
              padding: 8mm 8mm !important;
              background: white !important; color: #1a1a1a !important;
              overflow: visible !important; font-size: 10px !important;
            }
            #print-pertinence .print-header { display: block !important; }
            #print-pertinence .print-section-title { display: block !important; }
            #print-pertinence .no-print { display: none !important; }
            #print-pertinence .print-radar-section { display: flex !important; }
            #print-pertinence .print-card {
              border: 1px solid #e2e8f0 !important; background: #fafafa !important;
              color: #1a1a1a !important; page-break-inside: avoid; break-inside: avoid;
              overflow: hidden !important; max-width: 100% !important;
              margin-bottom: 8px !important; border-radius: 10px !important;
            }
            #print-pertinence .print-card-gold {
              background: linear-gradient(135deg, #fffbeb, #fef3c7) !important;
              border: 2px solid #d4a017 !important;
              box-shadow: 0 2px 12px rgba(184,134,11,0.12) !important;
              margin-bottom: 12px !important;
            }
            #print-pertinence .print-card-silver {
              background: #f8fafc !important;
              border: 1.5px solid #94a3b8 !important;
              margin-bottom: 10px !important;
            }
            #print-pertinence .print-card-bronze {
              background: #fefaf5 !important;
              border: 1.5px solid #cd7f32 !important;
              margin-bottom: 10px !important;
            }
            #print-pertinence .print-card * { color: #1a1a1a !important; }
            #print-pertinence .print-card-gold .print-medal-label { color: #8b6914 !important; }
            #print-pertinence .print-card-silver .print-medal-label { color: #64748b !important; }
            #print-pertinence .print-card-bronze .print-medal-label { color: #92400e !important; }
            #print-pertinence .print-bar-bg { background: #e5e7eb !important; height: 6px !important; border-radius: 3px !important; }
            #print-pertinence .print-bar-fill-green { background: #22c55e !important; }
            #print-pertinence .print-bar-fill-gray { background: #9ca3af !important; }
            #print-pertinence .print-bar-fill-red { background: #ef4444 !important; }
            #print-pertinence .print-bar-fill-yellow { background: #f59e0b !important; }
            #print-pertinence .print-score-green { color: #16a34a !important; }
            #print-pertinence .print-score-yellow { color: #d97706 !important; }
            #print-pertinence .print-score-red { color: #dc2626 !important; }
            #print-pertinence .print-badge { border: 1px solid #666 !important; padding: 3px 8px !important; border-radius: 6px !important; font-size: 8px !important; font-weight: 700 !important; }
            #print-pertinence .print-badge-green { background: #dcfce7 !important; color: #166534 !important; border-color: #22c55e !important; }
            #print-pertinence .print-badge-orange { background: #fff7ed !important; color: #9a3412 !important; border-color: #f97316 !important; }
            #print-pertinence .print-badge-red { background: #fef2f2 !important; color: #991b1b !important; border-color: #ef4444 !important; }
            #print-pertinence .print-profile-box { border: 1.5px solid #f97316 !important; background: #fff7ed !important; padding: 12px !important; border-radius: 10px !important; }
            #print-pertinence .print-warn { color: #dc2626 !important; }
            #print-pertinence .print-verdict { color: #374151 !important; font-style: normal !important; }
            #print-pertinence .print-deep-analysis { background: #f0f4ff !important; border: 1.5px solid #818cf8 !important; border-radius: 8px !important; padding: 10px 12px !important; margin-bottom: 12px !important; page-break-inside: avoid; break-inside: avoid; }
            #print-pertinence .print-deep-analysis * { color: #374151 !important; }
            #print-pertinence .print-deep-analysis .deep-title { color: #4338ca !important; font-weight: 700 !important; font-size: 11px !important; margin-bottom: 6px !important; }
            #print-pertinence .print-section-divider { border-top: 2px solid #e5e7eb !important; margin: 16px 0 10px !important; padding-top: 8px !important; }
            #print-pertinence .print-footer-wrap { page-break-before: avoid; break-before: avoid; page-break-inside: avoid; break-inside: avoid; }
            #print-pertinence .print-racket-img { width: 60px !important; height: 72px !important; object-fit: contain !important; border-radius: 8px !important; background: #f1f5f9 !important; padding: 4px !important; }
            #print-pertinence .print-racket-img-sm { width: 40px !important; height: 48px !important; }
            @page { margin: 8mm 6mm; size: A4; }
          }
        `), /* @__PURE__ */ import_react.default.createElement("div", { id: "print-pertinence", style: S.card }, /* @__PURE__ */ import_react.default.createElement("div", { className: "print-header", style: { display: "none", marginBottom: 14 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #f97316", paddingBottom: 10 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { flexShrink: 0 } }, /* @__PURE__ */ import_react.default.createElement("rect", { width: "44", height: "44", rx: "10", fill: "#f97316" }), /* @__PURE__ */ import_react.default.createElement("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.2", fill: "none" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "10", x2: "22", y2: "26", stroke: "#fff", strokeWidth: "1.2", opacity: "0.5" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "14", y1: "18", x2: "30", y2: "18", stroke: "#fff", strokeWidth: "1.2", opacity: "0.5" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.9" })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "#f97316", fontFamily: "'Outfit'", letterSpacing: "-0.01em" } }, "PADEL ANALYZER"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", marginTop: 1 } }, "Analyse de pertinence personnalis\xE9e"))), /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#1a1a1a" } }, profileName || "Analyse joueur"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", marginTop: 2 } }, (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }))))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }, className: "no-print" }, /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, fontSize: 12, fontWeight: 700, color: "#e2e8f0" } }, profileName ? `\u{1F464} ${profileName}` : /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#475569", fontWeight: 400, fontSize: 11 } }, "D\xE9finis un nom dans \u{1F464} Profil \u2192 \u{1F4BE} Sauvegarder")), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => window.print(), style: { padding: "8px 16px", background: "rgba(249,115,22,0.2)", border: "1px solid #f97316", borderRadius: 8, color: "#f97316", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" } }, "\u{1F5A8} Imprimer")), /* @__PURE__ */ import_react.default.createElement("div", { className: "print-profile-box", style: { background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 10, padding: 12, marginBottom: 12, boxSizing: "border-box" } }, /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 10, color: "#f97316", fontWeight: 700, margin: "0 0 3px" } }, "\u{1F464} Profil actif :"), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 9, color: "#94a3b8", margin: 0, lineHeight: 1.5 } }, profileText), /* @__PURE__ */ import_react.default.createElement("p", { style: { fontSize: 8, color: "#475569", margin: "4px 0 0" } }, (() => {
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
    })())), (() => {
      const w2 = { Puissance: 1, Contr\u00F4le: 1, Confort: 1, Spin: 1, Maniabilit\u00E9: 1, Tol\u00E9rance: 1 };
      const prioMap2 = { confort: { Confort: 1.5 }, polyvalence: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.5, Tol\u00E9rance: 0.5 }, puissance: { Puissance: 1.5 }, controle: { Contr\u00F4le: 1.5 }, spin: { Spin: 1.5 }, legerete: { Maniabilit\u00E9: 1.5 }, protection: { Confort: 1.5 }, reprise: { Confort: 1.5, Tol\u00E9rance: 1, Maniabilit\u00E9: 0.5 } };
      const styleMap2 = { offensif: { Puissance: 0.5 }, defensif: { Contr\u00F4le: 0.5, Tol\u00E9rance: 0.5 }, tactique: { Contr\u00F4le: 0.5, Maniabilit\u00E9: 0.3 }, puissant: { Puissance: 0.5, Spin: 0.3 }, veloce: { Maniabilit\u00E9: 0.8 }, endurant: { Confort: 0.5, Tol\u00E9rance: 0.3 }, contre: { Tol\u00E9rance: 0.5, Contr\u00F4le: 0.3 }, polyvalent: { Contr\u00F4le: 0.3, Tol\u00E9rance: 0.3 }, technique: { Contr\u00F4le: 0.5, Spin: 0.3 } };
      for (const tag of profile.priorityTags || []) {
        const b = prioMap2[tag];
        if (b) for (const [k, v] of Object.entries(b)) w2[k] = (w2[k] || 1) + v;
      }
      for (const tag of profile.styleTags || []) {
        const b = styleMap2[tag];
        if (b) for (const [k, v] of Object.entries(b)) w2[k] = (w2[k] || 1) + v;
      }
      const maxW2 = Math.max(...Object.values(w2));
      const idealRadar2 = ATTRS.map((a) => ({ attribute: a, "Raquette id\xE9ale": Math.round(w2[a] / maxW2 * 10 * 10) / 10 }));
      const ranked = rackets.map((r) => ({ ...r, globalScore: computeGlobalScore(r.scores, profile) })).sort((a, b) => b.globalScore - a.globalScore);
      if (ranked.length > 0) {
        idealRadar2.forEach((pt) => {
          pt["\u{1F947} " + ranked[0].shortName] = Number(ranked[0].scores[pt.attribute]) || 0;
        });
      }
      return /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 12, alignItems: "stretch" }, className: "print-radar-section" }, /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: "1 1 50%", background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 10, padding: "8px 4px 4px", minHeight: 200 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, fontWeight: 700, color: "#a5b4fc", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 } }, "\u{1F4CA} Raquette id\xE9ale", ranked.length > 0 ? ` vs ${ranked[0].shortName}` : ""), /* @__PURE__ */ import_react.default.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: 190 }, /* @__PURE__ */ import_react.default.createElement(import_recharts.RadarChart, { data: idealRadar2, margin: { top: 8, right: 30, bottom: 4, left: 30 } }, /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarGrid, { stroke: "rgba(255,255,255,0.08)" }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarAngleAxis, { dataKey: "attribute", tick: { fill: "#94a3b8", fontSize: 8 } }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarRadiusAxis, { angle: 90, domain: [0, 10], tick: false, axisLine: false }), /* @__PURE__ */ import_react.default.createElement(import_recharts.Radar, { name: "Raquette id\xE9ale", dataKey: "Raquette id\xE9ale", stroke: "#6366f1", fill: "#6366f1", fillOpacity: 0.12, strokeWidth: 2, strokeDasharray: "6 3" }), ranked.length > 0 && /* @__PURE__ */ import_react.default.createElement(import_recharts.Radar, { name: "\u{1F947} " + ranked[0].shortName, dataKey: "\u{1F947} " + ranked[0].shortName, stroke: "#f97316", fill: "#f97316", fillOpacity: 0.15, strokeWidth: 2 }), /* @__PURE__ */ import_react.default.createElement(import_recharts.Legend, { wrapperStyle: { fontSize: 8, color: "#94a3b8", paddingTop: 2 } })))), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: "1 1 50%", display: "flex", flexDirection: "column", gap: 8 } }, ranked.slice(0, 3).map((r, i) => {
        const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
        const gs = r.globalScore;
        const fy2 = computeForYou(r.scores, profile);
        const fyC = fy2 === "recommended" ? "#22c55e" : fy2 === "no" ? "#ef4444" : "#FF9800";
        return /* @__PURE__ */ import_react.default.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: i === 0 ? "rgba(249,115,22,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${i === 0 ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, flex: 1 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 18 } }, medals[i]), r.imageUrl && /* @__PURE__ */ import_react.default.createElement("img", { src: proxyImg(r.imageUrl), alt: "", className: "print-racket-img-sm", style: { width: 32, height: 40, objectFit: "contain", borderRadius: 6, background: "rgba(255,255,255,0.06)", flexShrink: 0 }, onError: (e) => {
          e.target.style.display = "none";
        } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r.shortName), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 8, color: "#64748b" } }, r.brand, " \xB7 ", r.shape)), /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "right", flexShrink: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: gs >= 7.5 ? "#4ade80" : gs >= 6.5 ? "#fbbf24" : "#f87171", fontFamily: "'Outfit'", lineHeight: 1 } }, fmtPct(gs)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 7, color: fyC, fontWeight: 700, marginTop: 2 } }, fy2 === "recommended" ? "RECO" : fy2 === "no" ? "NON" : "JOUABLE")));
      })));
    })(), (() => {
      const ranked = rackets.map((r) => ({ ...r, globalScore: computeGlobalScore(r.scores, profile) })).sort((a, b) => b.globalScore - a.globalScore);
      if (!ranked.length) return null;
      const best = ranked[0];
      const second = ranked[1];
      const prioAttrMap = { puissance: "Puissance", controle: "Contr\xF4le", confort: "Confort", spin: "Spin", legerete: "Maniabilit\xE9", protection: "Confort", reprise: "Confort", polyvalence: "Contr\xF4le" };
      const prioTags = profile.priorityTags || [];
      const prioAttrs = [...new Set(prioTags.map((t) => prioAttrMap[t]).filter(Boolean))];
      const prioLabels = prioTags.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      const ARM_INJ = ["dos", "poignet", "coude", "epaule"];
      const LEG_INJ = ["genou", "cheville", "mollet", "hanche", "achille"];
      const injTags = profile.injuryTags || [];
      const hasArmInj = injTags.some((t) => ARM_INJ.includes(t));
      const hasLegInj = injTags.some((t) => LEG_INJ.includes(t));
      const injLabels = injTags.filter((t) => t !== "aucune").map((id) => INJURY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      const bestPrioScores = prioAttrs.map((a) => ({ attr: a, val: best.scores[a] || 0 })).sort((a, b) => b.val - a.val);
      const bestWeakest = ATTRS.map((a) => ({ attr: a, val: best.scores[a] || 0 })).sort((a, b) => a.val - b.val)[0];
      const gap = second ? best.globalScore - second.globalScore : 0;
      const lines = [];
      if (prioLabels.length > 0) {
        const prioStr = prioLabels.length === 1 ? prioLabels[0] : prioLabels.slice(0, -1).join(", ") + " et " + prioLabels[prioLabels.length - 1];
        if (bestPrioScores.length > 0 && bestPrioScores[0].val >= 7.5) {
          lines.push(`Avec tes priorit\xE9s ${prioStr}, la **${best.name}** (${fmtPct(best.globalScore)}) s'impose : elle affiche ${bestPrioScores.map((s) => `${s.attr} \xE0 ${s.val}`).join(", ")}.`);
        } else if (bestPrioScores.length > 0) {
          lines.push(`Pour tes priorit\xE9s ${prioStr}, la **${best.name}** (${fmtPct(best.globalScore)}) offre le meilleur compromis du lot avec ${bestPrioScores.map((s) => `${s.attr} \xE0 ${s.val}`).join(", ")}.`);
        } else {
          lines.push(`La **${best.name}** (${fmtPct(best.globalScore)}) est la plus adapt\xE9e \xE0 ton profil.`);
        }
      } else {
        lines.push(`La **${best.name}** (${fmtPct(best.globalScore)}) est la plus adapt\xE9e \xE0 ton profil.`);
      }
      if (hasArmInj) {
        const comfortBest = best.scores.Confort || 0;
        if (comfortBest >= 7.5) {
          lines.push(`Bon point pour ton ${injLabels.join("/")} : son Confort \xE0 ${comfortBest} devrait m\xE9nager tes articulations.`);
        } else if (comfortBest >= 6) {
          lines.push(`Attention ${injLabels.join("/")} : son Confort \xE0 ${comfortBest} est correct mais pas optimal \u2014 surveille tes sensations.`);
        } else {
          lines.push(`\u26A0 Point de vigilance ${injLabels.join("/")} : Confort \xE0 ${comfortBest} seulement \u2014 risque de douleurs sur longues sessions.`);
        }
      } else if (hasLegInj) {
        const manBest = best.scores["Maniabilit\xE9"] || 0;
        if (manBest >= 7) {
          lines.push(`Avec ta fragilit\xE9 ${injLabels.join("/")}, sa Maniabilit\xE9 \xE0 ${manBest} te permet de compenser sans forcer.`);
        } else {
          lines.push(`Attention ${injLabels.join("/")} : sa Maniabilit\xE9 \xE0 ${manBest} demandera plus d'efforts en d\xE9placement.`);
        }
      }
      if (second) {
        if (gap >= 0.5) {
          const secondWorse = prioAttrs.length > 0 ? prioAttrs.map((a) => ({ attr: a, diff: (best.scores[a] || 0) - (second.scores[a] || 0) })).filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff)[0] : ATTRS.map((a) => ({ attr: a, diff: (best.scores[a] || 0) - (second.scores[a] || 0) })).filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff)[0];
          if (secondWorse) {
            lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) suit mais perd du terrain en ${secondWorse.attr} (${second.scores[secondWorse.attr]} vs ${best.scores[secondWorse.attr]}).`);
          } else {
            lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) est une alternative solide.`);
          }
        } else if (gap >= 0.2) {
          const secondBetter = ATTRS.map((a) => ({ attr: a, diff: (second.scores[a] || 0) - (best.scores[a] || 0) })).filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff)[0];
          if (secondBetter) {
            lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) talonne de pr\xE8s et pousse m\xEAme plus fort en ${secondBetter.attr} (${second.scores[secondBetter.attr]} vs ${best.scores[secondBetter.attr]}) \u2014 \xE0 essayer aussi.`);
          } else {
            lines.push(`La **${second.name}** (${fmtPct(second.globalScore)}) est au coude-\xE0-coude \u2014 les deux m\xE9ritent un essai.`);
          }
        } else {
          const secondBetter2 = ATTRS.map((a) => ({ attr: a, diff: (second.scores[a] || 0) - (best.scores[a] || 0) })).filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff)[0];
          const bestBetter2 = ATTRS.map((a) => ({ attr: a, diff: (best.scores[a] || 0) - (second.scores[a] || 0) })).filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff)[0];
          if (secondBetter2 && bestBetter2) {
            lines.push(`Quasi ex-\xE6quo avec la **${second.name}** (${fmtPct(second.globalScore)}) \u2014 elle pousse en ${secondBetter2.attr} (${second.scores[secondBetter2.attr]}), la n\xB01 domine en ${bestBetter2.attr} (${best.scores[bestBetter2.attr]}). Deux profils compl\xE9mentaires \xE0 tester.`);
          } else {
            lines.push(`Quasi ex-\xE6quo avec la **${second.name}** (${fmtPct(second.globalScore)}) \u2014 profils tr\xE8s proches, la diff\xE9rence se jouera au toucher et \xE0 l'\xE9quilibre en main.`);
          }
        }
      }
      const renderLine = (text, idx) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return /* @__PURE__ */ import_react.default.createElement("span", { key: idx }, parts.map(
          (p, j) => p.startsWith("**") ? /* @__PURE__ */ import_react.default.createElement("strong", { key: j, style: { color: "#e2e8f0" } }, p.replace(/\*\*/g, "")) : p
        ), idx < lines.length - 1 ? " " : "");
      };
      return /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 10, color: "#94a3b8", lineHeight: 1.6 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontWeight: 700, color: "#4ade80", marginBottom: 4, fontSize: 11 } }, "\u{1F3AF} Notre verdict"), lines.map((l, i) => renderLine(l, i)));
    })(), (() => {
      const ranked = rackets.map((r) => ({ ...r, globalScore: computeGlobalScore(r.scores, profile) })).sort((a, b) => b.globalScore - a.globalScore);
      if (ranked.length < 2) return null;
      const deepLines = generateDeepAnalysis(profile, ranked, ATTRS);
      if (!deepLines.length) return null;
      const renderBold = (text, idx) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return /* @__PURE__ */ import_react.default.createElement("p", { key: idx, style: { margin: "0 0 6px", fontSize: 9, color: "#94a3b8", lineHeight: 1.6 } }, parts.map((p, j) => p.startsWith("**") ? /* @__PURE__ */ import_react.default.createElement("strong", { key: j, style: { color: "#e2e8f0" } }, p.replace(/\*\*/g, "")) : p));
      };
      return /* @__PURE__ */ import_react.default.createElement("div", { className: "print-deep-analysis", style: { background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 8, padding: "10px 12px", marginBottom: 12 } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "deep-title", style: { fontWeight: 700, color: "#a5b4fc", marginBottom: 6, fontSize: 11 } }, "\u{1F52C} Analyse du profil"), deepLines.map((l, i) => renderBold(l, i)));
    })(), rackets.length >= 3 && /* @__PURE__ */ import_react.default.createElement("div", { className: "print-section-title", style: { display: "none", fontSize: 12, fontWeight: 800, color: "#1a1a1a", marginBottom: 8, paddingBottom: 4 } }, "\u{1F3C6} PODIUM \u2014 Top 3"), (() => {
      const ranked = rackets.map((r) => ({ ...r, globalScore: computeGlobalScore(r.scores, profile) })).sort((a, b) => b.globalScore - a.globalScore);
      const cards = [];
      ranked.forEach((r, i) => {
        if (i === 3 && ranked.length > 3) {
          cards.push(/* @__PURE__ */ import_react.default.createElement("div", { key: "divider", className: "print-section-divider", style: { borderTop: "2px solid rgba(255,255,255,0.06)", margin: "16px 0 10px", paddingTop: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "print-section-title", style: { display: "none", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 } }, "\u{1F4CB} AUTRES RAQUETTES ANALYS\xC9ES")));
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
        const isPodium = i < 3;
        cards.push(/* @__PURE__ */ import_react.default.createElement("div", { key: r.id, className: cardClass, style: {
          background: i === 0 ? "rgba(250,204,21,0.08)" : i === 1 ? "rgba(148,163,184,0.06)" : i === 2 ? "rgba(217,119,6,0.06)" : "rgba(255,255,255,0.02)",
          border: i === 0 ? "2px solid rgba(250,204,21,0.5)" : i === 1 ? "2px solid rgba(148,163,184,0.4)" : i === 2 ? "2px solid rgba(217,119,6,0.35)" : "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: isPodium ? "14px 16px" : "10px 12px",
          marginBottom: isPodium ? 12 : 6,
          boxSizing: "border-box",
          overflow: "hidden",
          pageBreakInside: "avoid",
          breakInside: "avoid"
        } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: isPodium ? 12 : 8, marginBottom: isPodium ? 10 : 6 } }, medal && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, minWidth: 40 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: i === 0 ? 32 : 26, lineHeight: 1 } }, medal), /* @__PURE__ */ import_react.default.createElement("span", { className: "print-medal-label", style: { fontSize: 7, fontWeight: 800, letterSpacing: "0.02em", color: i === 0 ? "#b8860b" : i === 1 ? "#6b7280" : "#92400e", marginTop: 2, whiteSpace: "nowrap" } }, i === 0 ? "MEILLEUR" : i === 1 ? "2\u1D49 choix" : "3\u1D49 choix")), r.imageUrl && /* @__PURE__ */ import_react.default.createElement("img", { src: proxyImg(r.imageUrl), alt: "", className: isPodium ? "print-racket-img" : "print-racket-img-sm", style: {
          width: isPodium ? 60 : 36,
          height: isPodium ? 72 : 44,
          objectFit: "contain",
          borderRadius: isPodium ? 10 : 6,
          flexShrink: 0,
          background: isPodium ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
          padding: isPodium ? 4 : 2,
          border: isPodium ? `1px solid ${i === 0 ? "rgba(250,204,21,0.3)" : i === 1 ? "rgba(148,163,184,0.2)" : "rgba(217,119,6,0.2)"}` : "none"
        }, onError: (e) => {
          e.target.style.display = "none";
        } }), !medal && !r.imageUrl && /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: r.color, border: "1px solid #999", flexShrink: 0, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: i === 0 ? 15 : isPodium ? 13 : 11, fontWeight: 800, color: "#e2e8f0" } }, r.name), /* @__PURE__ */ import_react.default.createElement("span", { className: `print-badge ${badgeClass}`, style: { background: fy.bg, border: `1px solid ${fy.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 7, fontWeight: 700, color: "#fff", flexShrink: 0, whiteSpace: "nowrap" } }, fy.text)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: isPodium ? 9 : 8, color: "#64748b", marginTop: 3 } }, r.shape, " \xB7 ", r.weight, " \xB7 ", r.brand, r.player && r.player !== "\u2014" ? ` \xB7 \u{1F3BE} ${r.player}` : "", r.price && r.price !== "\u2014" ? ` \xB7 ${r.price}` : "")), /* @__PURE__ */ import_react.default.createElement("div", { className: scoreClass, style: { fontSize: i === 0 ? 28 : isPodium ? 22 : 16, fontWeight: 800, color: gs >= 7.5 ? "#4ade80" : gs >= 6.5 ? "#fbbf24" : "#f87171", fontFamily: "'Outfit'", lineHeight: 1, flexShrink: 0, marginLeft: 8 } }, fmtPct(gs))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: isPodium ? "6px 14px" : "4px 10px", marginBottom: isPodium ? 8 : 5 } }, ATTRS.map((attr) => {
          const v = r.scores[attr];
          const isKey = attr === "Confort" && hasArmInj || attr === "Maniabilit\xE9" && (hasLegInj || (profile.styleTags || []).includes("veloce")) || (profile.priorityTags || []).some((t) => t === "confort" && attr === "Confort" || t === "polyvalence" && ["Contr\xF4le", "Tol\xE9rance", "Maniabilit\xE9"].includes(attr) || t === "puissance" && attr === "Puissance" || t === "controle" && attr === "Contr\xF4le" || t === "spin" && attr === "Spin" || t === "legerete" && attr === "Maniabilit\xE9" || t === "protection" && attr === "Confort" || t === "reprise" && ["Confort", "Tol\xE9rance", "Maniabilit\xE9"].includes(attr));
          const low = hasArmInj && attr === "Confort" && v < 7;
          const barH = isPodium ? 7 : 4;
          const barClass = low ? "print-bar-fill-red" : v >= 7.5 ? "print-bar-fill-green" : v >= 6 ? "print-bar-fill-gray" : "print-bar-fill-yellow";
          return /* @__PURE__ */ import_react.default.createElement("div", { key: attr, style: { minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: isPodium ? 9 : 8, color: isKey ? "#f97316" : "#64748b", fontWeight: isKey ? 700 : 500 } }, isKey ? "\u2605 " : "", attr), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: isPodium ? 10 : 9, color: low ? "#f87171" : v >= 7.5 ? "#4ade80" : v >= 6 ? "#cbd5e1" : "#fbbf24", fontWeight: 700, flexShrink: 0, marginLeft: 4 } }, v)), /* @__PURE__ */ import_react.default.createElement("div", { className: "print-bar-bg", style: { height: barH, background: "rgba(255,255,255,0.06)", borderRadius: barH / 2, marginTop: 2 } }, /* @__PURE__ */ import_react.default.createElement("div", { className: barClass, style: { height: barH, borderRadius: barH / 2, width: `${v * 10}%`, background: low ? "#f87171" : v >= 7.5 ? "#4ade80" : v >= 6 ? "#64748b" : "#fbbf24", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } })));
        })), criticalLow && /* @__PURE__ */ import_react.default.createElement("div", { className: "print-warn", style: { fontSize: 9, color: "#f87171", fontWeight: 600, marginBottom: 3 } }, "\u26A0 Confort insuffisant (", r.scores.Confort, "/10) pour blessures ", ptags.filter((t) => ARM_INJ.includes(t)).map((t) => ({ dos: "Dos", poignet: "Poignet", coude: "Coude", epaule: "\xC9paule" })[t]).join("/"), " \u2014 risque de douleurs"), /* @__PURE__ */ import_react.default.createElement("div", { className: "print-verdict", style: { fontSize: isPodium ? 10 : 9, color: "#94a3b8", lineHeight: 1.6 } }, r.verdict)));
      });
      return cards;
    })(), (() => {
      const prioTagIds = profile.priorityTags || [];
      if (!prioTagIds.length || !rackets.length) return null;
      const prioAttrMap = { puissance: "Puissance", controle: "Contr\xF4le", confort: "Confort", spin: "Spin", legerete: "Maniabilit\xE9", protection: "Confort", reprise: "Confort", polyvalence: "Contr\xF4le" };
      const prioAttrs = [...new Set(prioTagIds.map((t) => prioAttrMap[t]).filter(Boolean))];
      const prioLabels = prioTagIds.map((id) => PRIORITY_TAGS.find((t) => t.id === id)?.label).filter(Boolean);
      if (!prioAttrs.length) return null;
      const existingIds = new Set(rackets.map((r) => r.id));
      const age = Number(profile.age) || 0;
      const ht = Number(profile.height) || 0;
      const isJunior = age > 0 && age < 15 || ht > 0 && ht < 150;
      let pool;
      if (isJunior) {
        pool = rackets_db_default.filter((r) => r.category === "junior");
      } else {
        const lvl = profile.level || "D\xE9butant";
        const catMap = { "D\xE9butant": ["debutant", "intermediaire"], "Interm\xE9diaire": ["intermediaire", "debutant", "avance"], "Avanc\xE9": ["avance", "intermediaire", "expert"], "Expert": ["expert", "avance"] };
        const cats = catMap[lvl] || ["debutant", "intermediaire"];
        pool = rackets_db_default.filter((r) => cats.includes(r.category));
      }
      pool = pool.filter((r) => !existingIds.has(r.id));
      const brandPref = profile.brandTags.map((id) => BRAND_TAGS.find((t) => t.id === id)?.label?.toLowerCase()).filter(Boolean);
      if (brandPref.length) {
        const brandPool = pool.filter((r) => brandPref.includes(r.brand.toLowerCase()));
        const otherTop = pool.filter((r) => !brandPref.includes(r.brand.toLowerCase())).map((r) => ({ ...r, _pa: prioAttrs.reduce((s, k) => s + (r.scores[k] || 0), 0) / prioAttrs.length })).sort((a, b) => b._pa - a._pa).slice(0, 2);
        pool = [...brandPool, ...otherTop];
      }
      const scored = pool.map((r) => {
        const prioAvg = prioAttrs.reduce((s, k) => s + (r.scores[k] || 0), 0) / prioAttrs.length;
        const gs = computeGlobalScore(r.scores, profile);
        return { ...r, _prioAvg: Math.round(prioAvg * 10) / 10, _prioScore: prioAvg * 0.7 + gs * 0.3, globalScore: gs };
      });
      scored.sort((a, b) => b.globalScore - a.globalScore);
      const picks = scored.slice(0, 4);
      if (!picks.length) return null;
      const prioTitle = prioLabels.join(" & ");
      return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "print-section-divider", style: { borderTop: "2px solid rgba(249,115,22,0.15)", margin: "16px 0 8px", paddingTop: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", { className: "no-print", style: { fontSize: 12, fontWeight: 800, color: "#f97316", marginBottom: 4 } }, "\u{1F3AF} \xC0 D\xC9COUVRIR \u2014 Top ", prioTitle), /* @__PURE__ */ import_react.default.createElement("div", { className: "print-section-title", style: { display: "none", fontSize: 11, fontWeight: 700, color: "#f97316", marginBottom: 4 } }, "\u{1F3AF} \xC0 D\xC9COUVRIR \u2014 Top ", prioTitle), /* @__PURE__ */ import_react.default.createElement("div", { className: "no-print", style: { fontSize: 9, color: "#64748b", marginBottom: 8 } }, "Raquettes de la base hors s\xE9lection, class\xE9es par ", prioLabels.join(" + "))), picks.map((r, idx) => {
        const gs = r.globalScore;
        const forYouVal = computeForYou(r.scores, profile);
        const fy = fyConfig[forYouVal] || fyConfig.partial;
        const badgeClass = forYouVal === "recommended" ? "print-badge-green" : forYouVal === "no" ? "print-badge-red" : "print-badge-orange";
        return /* @__PURE__ */ import_react.default.createElement("div", { key: "disco-" + r.id, className: "print-card", style: {
          background: "rgba(249,115,22,0.04)",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: 12,
          padding: "12px 14px",
          marginBottom: 8,
          boxSizing: "border-box",
          overflow: "hidden",
          borderLeft: "5px solid rgba(249,115,22,0.5)",
          pageBreakInside: "avoid",
          breakInside: "avoid"
        } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, minWidth: 28 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 18, lineHeight: 1 } }, "\u{1F3AF}")), r.imageUrl && /* @__PURE__ */ import_react.default.createElement("img", { src: proxyImg(r.imageUrl), alt: "", className: "print-racket-img-sm", style: { width: 40, height: 48, objectFit: "contain", borderRadius: 8, flexShrink: 0, background: "rgba(255,255,255,0.06)", padding: 2 }, onError: (e) => {
          e.target.style.display = "none";
        } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "#e2e8f0" } }, r.name), /* @__PURE__ */ import_react.default.createElement("span", { className: `print-badge ${badgeClass}`, style: { background: fy.bg, border: `1px solid ${fy.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 7, fontWeight: 700, color: "#fff", flexShrink: 0, whiteSpace: "nowrap" } }, fy.text), /* @__PURE__ */ import_react.default.createElement("span", { style: { background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 6, padding: "3px 8px", fontSize: 7, fontWeight: 700, color: "#f97316", flexShrink: 0, whiteSpace: "nowrap" } }, "\u2605 ", r._prioAvg, "/10")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", marginTop: 3 } }, r.shape, " \xB7 ", r.weight, " \xB7 ", r.brand, r.player && r.player !== "\u2014" ? ` \xB7 \u{1F3BE} ${r.player}` : "", r.price && r.price !== "\u2014" ? ` \xB7 ${r.price}` : "")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: gs >= 7.5 ? "#4ade80" : gs >= 6.5 ? "#fbbf24" : "#f87171", fontFamily: "'Outfit'", lineHeight: 1, flexShrink: 0, marginLeft: 8 } }, fmtPct(gs))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "5px 12px", marginBottom: 6 } }, ATTRS.map((attr) => {
          const v = r.scores[attr];
          const isKey = prioAttrs.includes(attr);
          return /* @__PURE__ */ import_react.default.createElement("div", { key: attr, style: { minWidth: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, color: isKey ? "#f97316" : "#64748b", fontWeight: isKey ? 700 : 500 } }, isKey ? "\u2605 " : "", attr), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, color: v >= 7.5 ? "#4ade80" : v >= 6 ? "#cbd5e1" : "#fbbf24", fontWeight: 700, flexShrink: 0, marginLeft: 4 } }, v)), /* @__PURE__ */ import_react.default.createElement("div", { className: "print-bar-bg", style: { height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginTop: 2 } }, /* @__PURE__ */ import_react.default.createElement("div", { className: v >= 7.5 ? "print-bar-fill-green" : v >= 6 ? "print-bar-fill-gray" : "print-bar-fill-yellow", style: { height: 6, borderRadius: 3, width: `${v * 10}%`, background: v >= 7.5 ? "#4ade80" : v >= 6 ? "#64748b" : "#fbbf24", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } })));
        })), /* @__PURE__ */ import_react.default.createElement("div", { className: "print-verdict", style: { fontSize: 10, color: "#94a3b8", lineHeight: 1.6 } }, r.verdict));
      }));
    })(), /* @__PURE__ */ import_react.default.createElement("div", { className: "print-footer-wrap print-header", style: { display: "none", marginTop: 16, borderTop: "2px solid #e5e7eb", paddingTop: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ import_react.default.createElement("svg", { width: "18", height: "18", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ import_react.default.createElement("rect", { width: "44", height: "44", rx: "10", fill: "#f97316" }), /* @__PURE__ */ import_react.default.createElement("ellipse", { cx: "22", cy: "18", rx: "10", ry: "12", stroke: "#fff", strokeWidth: "2.5", fill: "none" }), /* @__PURE__ */ import_react.default.createElement("line", { x1: "22", y1: "30", x2: "22", y2: "38", stroke: "#fff", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "33", cy: "32", r: "3.5", fill: "#fff", opacity: "0.9" })), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 8, color: "#999" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f97316", fontWeight: 700 } }, "Padel Analyzer"), " V8.0 \xB7 Scoring hybride calibr\xE9")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 8, color: "#999", textAlign: "right" } }, (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR"), " \xB7 Prix indicatifs \u2014 v\xE9rifier en boutique"))))), /* @__PURE__ */ import_react.default.createElement("div", { style: { ...S.card, marginTop: 4 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: S.title }, "\u{1F4D6} Lexique des crit\xE8res"), ATTRS.map((a) => /* @__PURE__ */ import_react.default.createElement("div", { key: a, onClick: () => setOpenAttr((o) => o === a ? null : a), style: { padding: "8px 10px", marginBottom: 3, borderRadius: 10, background: openAttr === a ? "rgba(249,115,22,0.06)" : "transparent", cursor: "pointer", transition: "background 0.15s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ import_react.default.createElement("span", null, a), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, color: "#475569", transition: "transform 0.2s ease", transform: openAttr === a ? "rotate(90deg)" : "none" } }, "\u25B8")), openAttr === a && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#94a3b8", marginTop: 5, lineHeight: 1.6, animation: "fadeIn 0.2s ease" } }, explanations[a])))), /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "center", marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 8, color: "#334155", letterSpacing: "0.05em" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontFamily: "'Outfit'", fontWeight: 600 } }, "PADEL ANALYZER"), " V8.0 \xB7 Analyse personnalis\xE9e \xB7 ", (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR"), /* @__PURE__ */ import_react.default.createElement("br", null), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 7, opacity: 0.7 } }, "Prix indicatifs \u2014 v\xE9rifier en boutique"))), showArena && (() => {
      const r2 = selRackets;
      if (r2.length < 2) {
        setShowArena(false);
        return null;
      }
      const scored = r2.map((r) => ({
        ...r,
        _gs: computeGlobalScore(r.scores, profile),
        _fy: computeForYou(r.scores, profile)
      }));
      scored.sort((a, b) => b._gs - a._gs);
      const champion = scored[0];
      const attrWinners = {};
      ATTRS.forEach((a) => {
        let mx = 0;
        r2.forEach((r) => {
          const v = Number(r.scores[a]) || 0;
          if (v > mx) mx = v;
        });
        attrWinners[a] = r2.filter((r) => (Number(r.scores[a]) || 0) === mx && r2.some((x) => (Number(x.scores[a]) || 0) < mx)).map((r) => r.id);
      });
      scored.forEach((r) => {
        r._wins = ATTRS.filter((a) => attrWinners[a].includes(r.id)).length;
      });
      const compareRadar = ATTRS.map((a) => {
        const pt = { attribute: a };
        r2.forEach((r) => {
          pt[r.shortName] = Number(r.scores[a]) || 0;
        });
        return pt;
      });
      const fyConfig4 = { recommended: { text: "RECOMMAND\xC9", color: "#4CAF50" }, partial: { text: "JOUABLE", color: "#FF9800" }, no: { text: "D\xC9CONSEILL\xC9", color: "#ef4444" } };
      const specRows = [
        { label: "Forme", key: "shape" },
        { label: "Poids", key: "weight" },
        { label: "Balance", key: "balance" },
        { label: "Surface", key: "surface" },
        { label: "Noyau", key: "core" },
        { label: "Prix", key: "price" }
      ];
      return /* @__PURE__ */ import_react.default.createElement("div", { style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.15), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.1), transparent 50%), linear-gradient(180deg, #0a0a1a 0%, #0f0a24 30%, #120a2e 60%, #0a0a1a 100%)",
        overflowY: "auto",
        overflowX: "hidden"
      } }, /* @__PURE__ */ import_react.default.createElement("style", null, `
            @keyframes arenaSlideIn { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
            @keyframes arenaFadeIn { from{opacity:0} to{opacity:1} }
            @keyframes arenaPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
            @keyframes vsGlow { 0%,100%{text-shadow:0 0 20px rgba(124,58,237,0.5),0 0 40px rgba(236,72,153,0.3)} 50%{text-shadow:0 0 40px rgba(124,58,237,0.8),0 0 80px rgba(236,72,153,0.5)} }
            @keyframes barGrow { from{width:0} }
            @keyframes crownDrop { from{opacity:0;transform:translateY(-20px) scale(0.5)} to{opacity:1;transform:translateY(0) scale(1)} }
            @keyframes starPop { 0%{transform:scale(0) rotate(-180deg);opacity:0} 60%{transform:scale(1.3) rotate(10deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
          `), /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 } }, [...Array(12)].map((_, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: {
        position: "absolute",
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        borderRadius: "50%",
        background: i % 3 === 0 ? "rgba(124,58,237,0.4)" : i % 3 === 1 ? "rgba(236,72,153,0.3)" : "rgba(99,102,241,0.3)",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `arenaPulse ${3 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 3}s`
      } }))), /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "20px 16px 40px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, animation: "arenaFadeIn 0.4s ease" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 24 } }, "\u2694\uFE0F"), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h1", { style: { fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#c4b5fd,#a78bfa,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" } }, "L'AR\xC8NE"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#7c3aed", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" } }, "Comparateur immersif"))), /* @__PURE__ */ import_react.default.createElement(
        "button",
        {
          onClick: () => setShowArena(false),
          style: { width: 40, height: 40, borderRadius: 12, border: "1px solid rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.1)", color: "#c4b5fd", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", transition: "all 0.2s" },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "rgba(124,58,237,0.25)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "rgba(124,58,237,0.1)";
          }
        },
        "\u2715"
      )), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "stretch", gap: 0, marginBottom: 28, animation: "arenaSlideIn 0.6s ease" } }, scored.map((r, i) => {
        const isChamp = r.id === champion.id;
        const fy = fyConfig4[r._fy] || fyConfig4.partial;
        return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, { key: r.id }, i > 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 50, zIndex: 2 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontFamily: "'Outfit'", fontSize: 20, fontWeight: 900, color: "#7c3aed", animation: "vsGlow 2s ease-in-out infinite", textAlign: "center", lineHeight: 1 } }, "VS")), /* @__PURE__ */ import_react.default.createElement("div", { style: {
          flex: 1,
          minWidth: 0,
          background: isChamp ? "linear-gradient(165deg,rgba(124,58,237,0.12),rgba(236,72,153,0.06),rgba(0,0,0,0.2))" : "rgba(255,255,255,0.02)",
          border: `1.5px solid ${isChamp ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 18,
          padding: "20px 14px",
          textAlign: "center",
          position: "relative",
          boxShadow: isChamp ? "0 0 40px rgba(124,58,237,0.1)" : "none",
          transition: "all 0.3s"
        } }, isChamp && scored.length > 1 && /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", animation: "crownDrop 0.6s ease 0.8s both" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 22 } }, "\u{1F451}")), r.imageUrl && /* @__PURE__ */ import_react.default.createElement("img", { src: proxyImg(r.imageUrl), alt: "", style: { width: 64, height: 80, objectFit: "contain", margin: "0 auto 8px", display: "block", filter: isChamp ? "drop-shadow(0 4px 16px rgba(124,58,237,0.3))" : "none", borderRadius: 8 }, onError: (e) => {
          e.target.style.display = "none";
        } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: r.color, margin: "0 auto 6px", boxShadow: `0 0 12px ${r.color}60` } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: isChamp ? "#e2e8f0" : "#94a3b8", lineHeight: 1.2 } }, r.shortName), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#64748b", marginTop: 3 } }, r.brand), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 24, fontWeight: 800, color: isChamp ? "#c4b5fd" : "#475569", fontFamily: "'Outfit'", marginTop: 8 } }, r._gs.toFixed(1), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, color: "#64748b" } }, "/10")), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 4 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 8, fontWeight: 700, color: fy.color, background: `${fy.color}15`, border: `1px solid ${fy.color}30`, borderRadius: 6, padding: "2px 8px" } }, fy.text)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#7c3aed", fontWeight: 600, marginTop: 6 } }, r._wins, " crit\xE8re", r._wins > 1 ? "s" : "", " gagn\xE9", r._wins > 1 ? "s" : "")));
      })), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 20, padding: 16, marginBottom: 20, animation: "arenaSlideIn 0.6s ease 0.2s both" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#7c3aed", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 } }, "Radar comparatif"), /* @__PURE__ */ import_react.default.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: 280 }, /* @__PURE__ */ import_react.default.createElement(import_recharts.RadarChart, { data: compareRadar, cx: "50%", cy: "50%", outerRadius: "70%" }, /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarGrid, { stroke: "rgba(124,58,237,0.12)", gridType: "polygon" }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarAngleAxis, { dataKey: "attribute", tick: { fill: "#a78bfa", fontSize: 10, fontWeight: 600 } }), /* @__PURE__ */ import_react.default.createElement(import_recharts.PolarRadiusAxis, { angle: 90, domain: [0, 10], tick: { fill: "#4c1d95", fontSize: 8 }, tickCount: 6, axisLine: false }), r2.map((r, i) => /* @__PURE__ */ import_react.default.createElement(import_recharts.Radar, { key: r.id, name: r.shortName, dataKey: r.shortName, stroke: r.color, fill: r.color, fillOpacity: 0.1, strokeWidth: 2.5 })), /* @__PURE__ */ import_react.default.createElement(import_recharts.Legend, { wrapperStyle: { fontSize: 10, color: "#a78bfa", paddingTop: 6 } })))), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 20, padding: 16, marginBottom: 20, animation: "arenaSlideIn 0.6s ease 0.3s both" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#7c3aed", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 } }, "Duel par crit\xE8re"), ATTRS.map((attr, ai) => {
        const vals = r2.map((r) => ({ r, v: Number(r.scores[attr]) || 0 }));
        const maxV = Math.max(...vals.map((x) => x.v));
        return /* @__PURE__ */ import_react.default.createElement("div", { key: attr, style: { marginBottom: 14 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#c4b5fd", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ import_react.default.createElement("span", null, attr), attrWinners[attr].length === 1 && /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 8, color: "#7c3aed", background: "rgba(124,58,237,0.15)", padding: "1px 6px", borderRadius: 4 } }, "\u{1F451} ", r2.find((r) => r.id === attrWinners[attr][0])?.shortName), attrWinners[attr].length === 0 && /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 8, color: "#475569" } }, "\xC9galit\xE9")), vals.map(({ r, v }) => {
          const isW = attrWinners[attr].includes(r.id);
          return /* @__PURE__ */ import_react.default.createElement("div", { key: r.id, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 3 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0, boxShadow: isW ? `0 0 8px ${r.color}` : "" } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 55, fontSize: 9, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 } }, r.shortName), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, height: 8, background: "rgba(124,58,237,0.08)", borderRadius: 4, overflow: "hidden" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { height: "100%", width: `${v * 10}%`, background: isW ? "linear-gradient(90deg,#7c3aed,#ec4899)" : r.color, borderRadius: 4, animation: `barGrow 0.8s ease ${0.3 + ai * 0.05}s both`, opacity: isW ? 1 : 0.5 } })), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 32, textAlign: "right", fontSize: 11, fontWeight: isW ? 800 : 500, color: isW ? "#c4b5fd" : "#64748b", fontFamily: "'Outfit'" } }, v.toFixed(1)));
        }));
      })), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 20, padding: 16, marginBottom: 20, animation: "arenaSlideIn 0.6s ease 0.4s both", overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#7c3aed", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 } }, "Fiche technique"), /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("th", { style: { padding: "6px 8px", textAlign: "left", color: "#4c1d95", fontSize: 9, fontWeight: 600 } }), scored.map((r) => /* @__PURE__ */ import_react.default.createElement("th", { key: r.id, style: { padding: "6px 8px", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: r.color, margin: "0 auto 3px" } }), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: r.id === champion.id ? "#c4b5fd" : "#64748b" } }, r.shortName))))), /* @__PURE__ */ import_react.default.createElement("tbody", null, specRows.map(({ label, key }, si) => /* @__PURE__ */ import_react.default.createElement("tr", { key, style: { background: si % 2 === 0 ? "rgba(124,58,237,0.03)" : "transparent" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", fontSize: 9, color: "#a78bfa", fontWeight: 600 } }, label), scored.map((r) => /* @__PURE__ */ import_react.default.createElement("td", { key: r.id, style: { padding: "5px 8px", textAlign: "center", fontSize: 10, color: "#cbd5e1" } }, r[key] || "\u2014"))))))), /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(236,72,153,0.06))", border: "1.5px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: 20, textAlign: "center", animation: "arenaSlideIn 0.6s ease 0.5s both", boxShadow: "0 8px 40px rgba(124,58,237,0.1)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 } }, "\u{1F3C6} Verdict de l'Ar\xE8ne"), /* @__PURE__ */ import_react.default.createElement("div", { style: { animation: "starPop 0.5s ease 1.2s both" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 36 } }, "\u{1F451}")), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, marginTop: 4 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 14, height: 14, borderRadius: "50%", background: champion.color, boxShadow: `0 0 16px ${champion.color}60` } }), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 20, fontWeight: 800, color: "#e2e8f0", fontFamily: "'Outfit'" } }, champion.shortName)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: "#c4b5fd", fontFamily: "'Outfit'", marginTop: 2 } }, champion._gs.toFixed(1), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 12, color: "#7c3aed" } }, "/10")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#a78bfa", marginTop: 4 } }, "Meilleure correspondance pour ", /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#c4b5fd" } }, profileName)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#7c3aed", marginTop: 2 } }, champion._wins, " crit\xE8re", champion._wins > 1 ? "s" : "", " remport\xE9", champion._wins > 1 ? "s" : "", " sur ", ATTRS.length), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 8, marginTop: 16, flexWrap: "wrap" } }, scored.map((r, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: r.id, style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        background: i === 0 ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${i === 0 ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 10
      } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 14 } }, ["\u{1F947}", "\u{1F948}", "\u{1F949}", "4\uFE0F\u20E3"][i] || ""), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: r.color } }), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#c4b5fd" : "#94a3b8" } }, r.shortName), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, fontWeight: 800, color: i === 0 ? "#c4b5fd" : "#64748b", fontFamily: "'Outfit'" } }, r._gs.toFixed(1))))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setShowArena(false), style: {
        marginTop: 20,
        padding: "12px 32px",
        borderRadius: 12,
        cursor: "pointer",
        fontFamily: "'Outfit',sans-serif",
        background: "rgba(124,58,237,0.15)",
        border: "1px solid rgba(124,58,237,0.35)",
        color: "#c4b5fd",
        fontSize: 12,
        fontWeight: 700,
        transition: "all 0.2s"
      }, onMouseEnter: (e) => {
        e.currentTarget.style.background = "rgba(124,58,237,0.25)";
      }, onMouseLeave: (e) => {
        e.currentTarget.style.background = "rgba(124,58,237,0.15)";
      } }, "\u2190 Retour \xE0 l'analyse"))));
    })());
    function renderSuggestCard(s, realIdx, checked, isTopPick) {
      const isPrio = s.category === "priority";
      const accentColor = isPrio ? "#fbbf24" : "#f97316";
      return /* @__PURE__ */ import_react.default.createElement("div", { key: realIdx, onClick: () => !s._added && toggleSuggestCheck(realIdx), style: {
        background: s._added ? "rgba(76,175,80,0.08)" : checked ? `${isPrio ? "rgba(251,191,36,0.12)" : "rgba(249,115,22,0.12)"}` : "rgba(255,255,255,0.04)",
        border: `1px solid ${s._added ? "#4CAF50" : checked ? accentColor : "rgba(255,255,255,0.1)"}`,
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 6,
        cursor: s._added ? "default" : "pointer",
        opacity: s._added ? 0.7 : 1,
        transition: "all 0.2s"
      } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, !s._added && /* @__PURE__ */ import_react.default.createElement("div", { style: {
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
      } }, checked ? "\u2713" : ""), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#e2e8f0" } }, isTopPick && !s._added ? "\u2B50 " : isPrio && !s._added ? "\u26A1 " : "", s.name), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#94a3b8", marginTop: 1 } }, s.brand, " \xB7 ", s.shape, " \xB7 ", s.weight, " \xB7 ", s.price))), s._added && /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, background: "#1B5E20", border: "1px solid #4CAF50", borderRadius: 4, padding: "2px 6px", color: "#fff", fontWeight: 700, flexShrink: 0 } }, "AJOUT\xC9E \u2713")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#cbd5e1", marginTop: 5, lineHeight: 1.4, fontStyle: "italic", marginLeft: s._added ? 0 : 26 } }, s.description), s._error && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#ef4444", marginTop: 3, marginLeft: 26 } }, "\u26A0 Erreur: ", s._error));
    }
  }

  // entry.jsx
  import_client.default.createRoot(document.getElementById("root")).render(/* @__PURE__ */ import_react2.default.createElement(PadelAnalyzer, null));
})();
