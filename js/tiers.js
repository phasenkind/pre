import {
  premiumStaffAttr,
  normalStaffAttr,
  collectorStaffAttr,
  staffReqHsrScores,
  staffReqEnergyBonuses,
  hardcodedMartialTierMappings,
  martialReqConfigs
} from "./data.js";

export function getStaffAttrBonus(attr) {
  if (!attr) return 1;
  if (attr === "generic") return 2;
  if (premiumStaffAttr.has(attr)) return 8;
  if (normalStaffAttr.has(attr)) return 4;
  if (collectorStaffAttr.has(attr)) return 2;
  return 1;
}

export function getStaffHctPercentBonus(attr, pct) {
  if (!pct) return 1;

  if (attr === "generic") {
    if (pct === "9") return 32;
    if (pct === "8") return 8;
    return 1;
  }

  if (pct === "18") return 16;
  if (pct === "17") return 4;
  if (pct === "16") return 2;
  if (pct === "15") return 2;
  return 1;
}

export function getHardcodedStaffTier(criteria) {
  const isNoReq = criteria.noReq === "yes";

  if (!isNoReq) return "";

  if (
    premiumStaffAttr.has(criteria.attr) &&
    criteria.energy === "6" &&
    criteria.hsr === "14" &&
    criteria.hctPercent === "18"
  ) {
    return "Highly Collectable";
  }

  if (
    (premiumStaffAttr.has(criteria.attr) && criteria.energy === "6" && criteria.hsr === "13" && criteria.hctPercent === "18") ||
    (premiumStaffAttr.has(criteria.attr) && criteria.energy === "5" && criteria.hsr === "14" && criteria.hctPercent === "18") ||
    (criteria.energy === "6" && criteria.hsr === "14" && criteria.hctPercent === "18") ||
    (criteria.energy === "6" && criteria.hsr === "14" && criteria.hctPercent === "9")
  ) {
    return "Collectable";
  }

  return "";
}

export function findTier(criteria, mappings, keys) {
  for (const mapping of mappings) {
    let matched = true;

    for (const key of keys) {
      const mappingValue = mapping[key] ?? "";
      const criteriaValue = criteria[key] ?? "";

      if (mappingValue === "") continue;

      if (Array.isArray(mappingValue)) {
        if (!mappingValue.includes(criteriaValue)) {
          matched = false;
          break;
        }
      } else if (mappingValue !== criteriaValue) {
        matched = false;
        break;
      }
    }

    if (matched) return mapping;
  }

  return { tier: "Junk" };
}

export function getHardcodedMartialTier(criteria) {
  const mappings = hardcodedMartialTierMappings[criteria.type] || [];
  if (mappings.length === 0) return "";

  const match = findTier(criteria, mappings, ["skin", "noReq", "damage", "inherent", "percent"]);

  if (!match || !match.tier || match.tier === "Junk") {
    return "";
  }

  return match.tier;
}

export function scoreStaff(criteria) {
  const hsrScore = staffReqHsrScores[criteria.hsr] ?? 0;
  const energyBonus = staffReqEnergyBonuses[criteria.energy] ?? 1;

  let inherentMultiplier = 1;
  let attrBonus = 1;
  let hctPercentBonus = 1;

  if (criteria.inherent === "none") {
    inherentMultiplier = 1;
  } else if (criteria.inherent === "reduces_duration") {
    inherentMultiplier = 1.2;
  } else if (criteria.inherent === "hct") {
    inherentMultiplier = 2;
    attrBonus = getStaffAttrBonus(criteria.attr);
    hctPercentBonus = getStaffHctPercentBonus(criteria.attr, criteria.hctPercent);
  }

  const modBlock = inherentMultiplier * attrBonus * hctPercentBonus;
  const totalScore = hsrScore * modBlock * energyBonus;

  return {
    totalScore,
    breakdown: {
      hsrScore,
      energyBonus,
      inherentMultiplier,
      attrBonus,
      hctPercentBonus,
      modBlock
    }
  };
}

export function staffScoreToTier(score) {
  if (score >= 6000) return "God Tier";
  if (score >= 3000) return "High End";
  if (score >= 2000) return "Mid Tier";
  if (score >= 50) return "Low End";
  return "Junk";
}

export function remapCollectorStaffTier(criteria, tier) {
  if (criteria.noReq === "yes") return tier;
  if (!collectorStaffAttr.has(criteria.attr)) return tier;

  if (tier === "God Tier" || tier === "High End") {
    return "Highly Collectable";
  }

  if (tier === "Mid Tier") {
    return "Collectable";
  }

  return tier;
}

export function scoreReqMartial(type, criteria) {
  const config = martialReqConfigs[type];
  if (!config) {
    return {
      totalScore: 0,
      breakdown: {
        damageScore: 0,
        skinValue: 1,
        inherentBonus: 1,
        percentBonus: 1,
        baseScore: 0,
        modMultiplier: 1,
        skinMode: "flat"
      }
    };
  }

  const damageScore = config.damageScores[criteria.damage] ?? 0;
  const inherentKey = criteria.inherent || "none";
  const inherentBonus = config.inherentBonuses[inherentKey] ?? 1;
  const percentBonus = config.percentBonuses[inherentKey]?.[criteria.percent] ?? 1;
  const skinValue = config.skinValues[criteria.skin] ?? 1;

  const baseScore = config.skinMode === "bonus"
    ? damageScore * skinValue
    : damageScore;

  const modMultiplier = inherentKey === "none"
    ? inherentBonus
    : inherentBonus * percentBonus;

  let totalScore = baseScore * modMultiplier;

  if (config.skinMode === "malus") {
    totalScore = totalScore / skinValue;
  }

  return {
    totalScore,
    breakdown: {
      damageScore,
      skinValue,
      inherentBonus,
      percentBonus,
      baseScore,
      modMultiplier,
      skinMode: config.skinMode
    }
  };
}

export function reqMartialScoreToTier(type, score) {
  const thresholds = martialReqConfigs[type]?.thresholds;
  if (!thresholds) return "Junk";

  if (score >= thresholds.god) return "God Tier";
  if (score >= thresholds.high) return "High End";
  if (score >= thresholds.mid) return "Mid Tier";
  if (score >= thresholds.low) return "Low End";
  return "Junk";
}

export function validateStaffInput(criteria) {
  if (!criteria.noReq) {
    return "Please choose Yes or No for No Req?.";
  }

  if (!criteria.hsr || !criteria.energy || !criteria.inherent) {
    return "Please complete all required staff fields.";
  }

  if (criteria.inherent === "hct" && !criteria.attr) {
    return "Please select the HCT attribute.";
  }

  if (criteria.inherent === "hct" && !criteria.hctPercent) {
    return "Please select the HCT %.";
  }

  return "";
}

export function validateMartialInput(criteria) {
  if (!criteria.noReq) {
    return "Please choose Yes or No for No Req?.";
  }

  if (criteria.type === "bow" && !criteria.skin) {
    return "Please select the bow skin.";
  }

  if (!criteria.damage) {
    return "Please select the damage range.";
  }

  if (!criteria.inherent) {
    return "Please select the inherent damage increase.";
  }

  if (criteria.inherent !== "none" && !criteria.percent) {
    return "Please select the damage increase %.";
  }

  return "";
}

export function calculateStaffTier(criteria) {
  const validationMessage = validateStaffInput(criteria);

  if (validationMessage) {
    return { error: validationMessage };
  }

  const normalizedCriteria = {
    ...criteria,
    attr: criteria.inherent === "hct" ? criteria.attr : "",
    hctPercent: criteria.inherent === "hct" ? criteria.hctPercent : ""
  };

  const hardcodedTier = getHardcodedStaffTier(normalizedCriteria);
  if (hardcodedTier) {
    return {
      tier: hardcodedTier,
      score: "hardcoded",
      breakdown: {
        hsrScore: "hardcoded",
        inherentMultiplier: "hardcoded",
        attrBonus: "hardcoded",
        hctPercentBonus: "hardcoded",
        modBlock: "hardcoded",
        energyBonus: "hardcoded"
      }
    };
  }

  const scoreResult = scoreStaff(normalizedCriteria);

  let tier = staffScoreToTier(scoreResult.totalScore);
  tier = remapCollectorStaffTier(normalizedCriteria, tier);

  return {
    tier,
    score: scoreResult.totalScore,
    breakdown: scoreResult.breakdown
  };
}

export function calculateMartialTier(type, criteria) {
  const validationMessage = validateMartialInput(criteria);

  if (validationMessage) {
    return { error: validationMessage };
  }

  const normalizedCriteria = {
    ...criteria,
    inherent: criteria.inherent === "none" ? "none" : criteria.inherent,
    percent: criteria.inherent === "none" ? "" : criteria.percent
  };

  const hardcodedTier = getHardcodedMartialTier(normalizedCriteria);
  if (hardcodedTier) {
    return {
      tier: hardcodedTier,
      score: "hardcoded"
    };
  }

  if (normalizedCriteria.noReq === "no") {
    const scoreResult = scoreReqMartial(type, normalizedCriteria);
    const tier = reqMartialScoreToTier(type, scoreResult.totalScore);

    return {
      tier,
      score: scoreResult.totalScore,
      breakdown: scoreResult.breakdown
    };
  }

  return { tier: "Junk" };
}

export function calculatePlaceholderTier(type) {
  return {
    tier: "Logic not added yet.",
    info: `${type} framework added, but scoring rules are not defined yet.`
  };
}
