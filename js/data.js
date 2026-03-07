export const MARTIAL_TYPES = ["axe", "sword", "hammer", "bow"];
export const PLACEHOLDER_TYPES = ["wand", "shield", "focus", "misc"];
export const CHECKTYPE_SUPPORTED_TYPES = ["staff", "axe", "sword", "hammer", "bow"];

export const premiumStaffAttr = new Set(["fire", "death"]);
export const normalStaffAttr = new Set(["blood", "curses", "smite", "heal", "dom"]);
export const collectorStaffAttr = new Set(["air", "water", "earth", "prot", "divine", "illu"]);

export const staffReqHsrScores = {
  "11": 1,
  "12": 1.5,
  "13": 2,
  "14": 4,
  "15": 8,
  "16": 24
};

export const staffReqEnergyBonuses = {
  "5": 1,
  "6": 1.5,
  "7": 2,
  "8": 3
};

export const hardcodedMartialTierMappings = {
  axe: [
    {
      noReq: "yes",
      damage: "6-12",
      inherent: "above50",
      percent: "14",
      tier: "Highly Collectable"
    },
    {
      noReq: "yes",
      damage: "6-12",
      inherent: "hexed",
      percent: "18",
      tier: "Highly Collectable"
    },
    {
      noReq: "yes",
      damage: "",
      inherent: ["above50", "below50", "enchanted", "hexed", "stance", "hexedfoes"],
      percent: "",
      tier: "Collectable"
    }
  ],

  sword: [
    {
      noReq: "yes",
      damage: "8-10",
      inherent: "above50",
      percent: "14",
      tier: "Highly Collectable"
    },
    {
      noReq: "yes",
      damage: "8-10",
      inherent: "hexed",
      percent: "18",
      tier: "Highly Collectable"
    },
    {
      noReq: "yes",
      damage: "",
      inherent: ["above50", "below50", "enchanted", "hexed", "stance", "hexedfoes"],
      percent: "",
      tier: "Collectable"
    }
  ],

  hammer: [
    {
      noReq: "yes",
      damage: "11-15",
      inherent: "above50",
      percent: "14",
      tier: "Highly Collectable"
    },
    {
      noReq: "yes",
      damage: "11-15",
      inherent: "hexed",
      percent: "18",
      tier: "Highly Collectable"
    },
    {
      noReq: "yes",
      damage: "",
      inherent: ["above50", "below50", "enchanted", "hexed", "stance", "hexedfoes"],
      percent: "",
      tier: "Collectable"
    }
  ],

  bow: [
    {
      noReq: "yes",
      skin: ["horn", "flat", "recurve", "long"],
      damage: "9-13",
      inherent: ["above50", "stance"],
      percent: "14",
      tier: "Highly Collectable"
    },
    {
      noReq: "yes",
      skin: "",
      damage: "",
      inherent: ["above50", "below50", "enchanted", "hexed", "stance", "hexedfoes"],
      percent: "",
      tier: "Collectable"
    }
  ]
};

export const martialReqConfigs = {
  bow: {
    damageScores: {
      "11-16": 0,
      "11-17": 1,
      "11-18": 2,
      "11-19": 4,
      "12-18": 4,
      "12-19": 8,
      "12-20": 16,
      "12-21": 48
    },
    skinMode: "bonus",
    skinValues: {
      short: 1,
      long: 1.5,
      recurve: 2,
      flat: 2.5,
      horn: 3
    },
    inherentBonuses: {
      none: 1,
      hexedfoes: 1,
      below50: 1,
      enchanted: 1.5,
      hexed: 2,
      stance: 2.5,
      above50: 3
    },
    percentBonuses: {
      enchanted: { "13": 2, "14": 3 },
      stance:    { "13": 3, "14": 4 },
      above50:   { "13": 3, "14": 4 },
      hexedfoes: { "13": 2, "14": 3 },
      hexed:     { "15": 2, "16": 3, "17": 3, "18": 4 },
      below50:   { "15": 2, "16": 3, "17": 3, "18": 4 }
    },
    thresholds: {
      god: 400,
      high: 200,
      mid: 100,
      low: 20
    }
  },

  axe: {
    damageScores: {
      "6-15": 0,
      "6-16": 1,
      "6-17": 2,
      "6-18": 4,
      "6-19": 8,
      "7-18": 8,
      "6-20": 16,
      "7-19": 16,
      "7-20": 48
    },
    skinMode: "malus",
    skinValues: {
      "": 1,
      piercing: 3
    },
    inherentBonuses: {
      none: 1,
      hexedfoes: 1,
      below50: 1.5,
      enchanted: 2,
      stance: 3,
      hexed: 4,
      above50: 5
    },
    percentBonuses: {
      enchanted: { "13": 2, "14": 3 },
      stance:    { "13": 2, "14": 3 },
      above50:   { "13": 3, "14": 4 },
      hexedfoes: { "13": 2, "14": 3 },
      hexed:     { "15": 2, "16": 3, "17": 3, "18": 4 },
      below50:   { "15": 2, "16": 3, "17": 3, "18": 4 }
    },
    thresholds: {
      god: 250,
      high: 100,
      mid: 30,
      low: 6
    }
  },

  sword: {
    damageScores: {
      "10-13": 0,
      "10-14": 1,
      "11-14": 2,
      "11-15": 4,
      "11-16": 8,
      "12-16": 16,
      "12-17": 48
    },
    skinMode: "malus",
    skinValues: {
      "": 1,
      short: 2
    },
    inherentBonuses: {
      none: 1,
      hexedfoes: 1.5,
      below50: 1.5,
      enchanted: 2,
      stance: 3,
      hexed: 4,
      above50: 5
    },
    percentBonuses: {
      enchanted: { "13": 2, "14": 3 },
      stance:    { "13": 2, "14": 3 },
      above50:   { "13": 3, "14": 4 },
      hexedfoes: { "13": 2, "14": 3 },
      hexed:     { "15": 2, "16": 3, "17": 3, "18": 4 },
      below50:   { "15": 2, "16": 3, "17": 3, "18": 4 }
    },
    thresholds: {
      god: 250,
      high: 100,
      mid: 30,
      low: 6
    }
  },

  hammer: {
    damageScores: {
      "14-21": 0,
      "14-22": 1,
      "14-23": 2,
      "14-24": 4,
      "15-24": 8,
      "15-25": 16,
      "15-26": 48
    },
    skinMode: "flat",
    skinValues: {
      "": 1
    },
    inherentBonuses: {
      none: 1,
      hexedfoes: 1.5,
      below50: 1.5,
      enchanted: 2,
      stance: 3,
      hexed: 4,
      above50: 5
    },
    percentBonuses: {
      enchanted: { "13": 2, "14": 3 },
      stance:    { "13": 2, "14": 3 },
      above50:   { "13": 3, "14": 4 },
      hexedfoes: { "13": 2, "14": 3 },
      hexed:     { "15": 2, "16": 3, "17": 3, "18": 4 },
      below50:   { "15": 2, "16": 3, "17": 3, "18": 4 }
    },
    thresholds: {
      god: 250,
      high: 180,
      mid: 60,
      low: 30
    }
  }
};

export function getDamageOptions(type, noReq) {
  const damageOptions = {
    axe: {
      noReq: ["5-10", "5-11", "6-12"],
      req: [
        { value: "6-15", label: "6-15 or lower" },
        "6-16", "6-17", "6-18", "6-19", "6-20", "7-18", "7-19", "7-20"
      ]
    },
    sword: {
      noReq: ["6-9", "7-9", "7-10", "8-10"],
      req: [
        { value: "10-13", label: "10-13 or lower" },
        "10-14", "11-14", "11-15", "11-16", "12-16", "12-17"
      ]
    },
    hammer: {
      noReq: ["9-13", "9-14", "10-14", "10-15", "11-15"],
      req: [
        { value: "14-21", label: "14-21 or lower" },
        "14-22", "14-23", "14-24", "15-24", "15-25", "15-26"
      ]
    },
    bow: {
      noReq: ["7-11", "7-12", "8-12", "9-13"],
      req: [
        { value: "11-16", label: "11-16 or lower" },
        "11-17", "11-18", "11-19", "12-18", "12-19", "12-20", "12-21"
      ]
    }
  };

  if (!damageOptions[type]) return [];
  return noReq ? damageOptions[type].noReq : damageOptions[type].req;
}
