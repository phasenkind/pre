import {
  MARTIAL_TYPES,
  PLACEHOLDER_TYPES,
  CHECKTYPE_SUPPORTED_TYPES,
  getDamageOptions
} from "./data.js";

import {
  calculateStaffTier,
  calculateMartialTier,
  calculatePlaceholderTier
} from "./tiers.js";

function el(id) {
  return document.getElementById(id);
}

export function setupUI() {
  el("itemType").addEventListener("change", showFields);
  el("checkType").addEventListener("change", checkTypeChanged);
  el("no_req_slider").addEventListener("input", noReqChanged);

  el("staff_inherent").addEventListener("change", inherentChanged);
  el("staff_attr").addEventListener("change", hctAttributeChanged);

  el("weapon_inherent").addEventListener("change", weaponInherentChanged);

  ["axe_damage", "sword_damage", "hammer_damage", "bow_damage", "weapon_damage_percent"].forEach(id => {
    const node = el(id);
    if (node) {
      node.addEventListener("change", updateSpecialQuestionVisibility);
    }
  });

  el("checkItemButton").addEventListener("click", checkItem);

  showFields();
}

function getNoReqValue() {
  const slider = el("no_req_slider");
  if (!slider) return "";

  if (slider.value === "0") return "yes";
  if (slider.value === "2") return "no";
  return "";
}

function hasChosenNoReq() {
  return getNoReqValue() !== "";
}

function resetResults() {
  el("result").innerText = "";
  el("debug").innerText = "";
}

function hideAllItemFields() {
  document.querySelectorAll(".itemFields").forEach(div => {
    div.classList.add("hidden");
  });
}

function resetAllFields() {
  document.querySelectorAll(".itemFields select").forEach(select => {
    select.value = "";
  });

  el("no_req_slider").value = "1";

  if (el("axe_piercing")) el("axe_piercing").checked = false;
  if (el("sword_short")) el("sword_short").checked = false;

  el("hctAttributeDiv").classList.add("hidden");
  el("hctPercentDiv").classList.add("hidden");
  el("staff_attr").value = "";
  el("staff_hct_percent").value = "";

  el("weapon_inherent").value = "";
  el("weapon_damage_percent").innerHTML = '<option value="">-- Select --</option>';
  el("weaponDamagePercentDiv").classList.add("hidden");

  const specialQuestionFields = el("specialQuestionFields");
  const axePiercingRow = el("axePiercingRow");
  const swordShortRow = el("swordShortRow");

  if (specialQuestionFields) specialQuestionFields.classList.add("hidden");
  if (axePiercingRow) axePiercingRow.classList.add("hidden");
  if (swordShortRow) swordShortRow.classList.add("hidden");

  const disclaimerEl = el("itemDisclaimer");
  if (disclaimerEl) {
    disclaimerEl.classList.add("hidden");
    disclaimerEl.innerText = "";
  }

  resetResults();
}

function updateItemDisclaimer() {
  const type = el("itemType").value;
  const checkType = el("checkType").value;
  const disclaimerEl = el("itemDisclaimer");

  if (!disclaimerEl) return;

  const messages = [];

  if (checkType === "weapon") {
    if (type === "staff" || type === "wand") {
      messages.push("High damage range might increase the item tier, but is not taken into consideration here for simplicity's sake.");
    }

    if (MARTIAL_TYPES.includes(type)) {
      messages.push("Low attribute requirement might increase the item tier, but is not taken into consideration here for simplicity's sake.");
    }

    if (type === "axe") {
      messages.push("Blue Sickles and Tribal Axes carry value at 6-12 no-req with an inherent, 6-15 with an inherent, and 6-16 regardless of inherent.");
    }
  }

  if (messages.length === 0) {
    disclaimerEl.classList.add("hidden");
    disclaimerEl.innerText = "";
    return;
  }

  disclaimerEl.classList.remove("hidden");
  disclaimerEl.innerText = messages.join("\n\n");
}

function showFields() {
  const type = el("itemType").value;
  const checkTypeContainer = el("checkTypeContainer");
  const noReqContainer = el("noReqContainer");
  const checkButton = el("checkItemButton");
  const martialSharedFields = el("martialSharedFields");

  resetAllFields();
  hideAllItemFields();

  checkTypeContainer.classList.toggle("hidden", !CHECKTYPE_SUPPORTED_TYPES.includes(type));
  noReqContainer.classList.add("hidden");
  martialSharedFields.classList.add("hidden");
  checkButton.classList.add("hidden");

  if (!type) {
    updateItemDisclaimer();
    return;
  }

  if (PLACEHOLDER_TYPES.includes(type)) {
    document.querySelectorAll(".itemFields").forEach(div => {
      const types = div.dataset.type?.split(",") || [];
      div.classList.toggle("hidden", !types.includes(type));
    });
    checkButton.classList.remove("hidden");
    updateItemDisclaimer();
    return;
  }

  updateItemDisclaimer();
}

function checkTypeChanged() {
  const type = el("itemType").value;
  const checkType = el("checkType").value;

  hideAllItemFields();
  el("noReqContainer").classList.add("hidden");
  el("martialSharedFields").classList.add("hidden");
  el("checkItemButton").classList.add("hidden");
  resetResults();

  if (!type || !checkType) {
    updateItemDisclaimer();
    return;
  }

  if (checkType === "weapon") {
    el("noReqContainer").classList.remove("hidden");
    el("checkItemButton").classList.remove("hidden");
  }
  
  else if (checkType === "prefix") {
    el("prefixPlaceholder").classList.remove("hidden");
    el("checkItemButton").classList.remove("hidden");
  }
  
  else if (checkType === "suffix") {
    el("suffixPlaceholder").classList.remove("hidden");
    el("checkItemButton").classList.remove("hidden");
  }

  updateItemDisclaimer();
}

function noReqChanged() {
  const type = el("itemType").value;
  const checkType = el("checkType").value;
  const noReqChosen = hasChosenNoReq();
  const checkButton = el("checkItemButton");
  const martialSharedFields = el("martialSharedFields");

  hideAllItemFields();
  martialSharedFields.classList.add("hidden");
  checkButton.classList.toggle("hidden", !(type && checkType));

  if (!type || checkType !== "weapon" || !noReqChosen) {
    resetResults();
    updateSpecialQuestionVisibility();
    updateItemDisclaimer();
    return;
  }

  document.querySelectorAll(".itemFields").forEach(div => {
    const types = div.dataset.type?.split(",") || [];
    div.classList.toggle("hidden", !types.includes(type));
  });

  if (type === "staff") {
    populateHSR();
    populateEnergy();
  }

  if (MARTIAL_TYPES.includes(type)) {
    martialSharedFields.classList.remove("hidden");
    populateWeaponDamage(type);
  }

  resetResults();
  updateSpecialQuestionVisibility();
  updateItemDisclaimer();
}

function populateHSR() {
  const noReq = getNoReqValue() === "yes";
  const hsrSelect = el("staff_hsr");
  const previousValue = hsrSelect.value;

  hsrSelect.innerHTML = '<option value="">-- Select --</option>';

  const values = noReq ? [11, 12, 13, 14] : [11, 12, 13, 14, 15, 16];
  values.forEach(v => hsrSelect.add(new Option(v, v)));

  if (values.map(String).includes(previousValue)) {
    hsrSelect.value = previousValue;
  }
}

function populateEnergy() {
  const noReq = getNoReqValue() === "yes";
  const energySelect = el("staff_energy");
  const previousValue = energySelect.value;

  energySelect.innerHTML = '<option value="">-- Select --</option>';

  const values = noReq ? [5, 6] : [5, 6, 7, 8];
  values.forEach(v => energySelect.add(new Option(v, v)));

  if (values.map(String).includes(previousValue)) {
    energySelect.value = previousValue;
  }
}

function inherentChanged() {
  const inherent = el("staff_inherent").value;
  const hctDiv = el("hctAttributeDiv");
  const percentDiv = el("hctPercentDiv");

  if (inherent === "hct") {
    hctDiv.classList.remove("hidden");
  } else {
    hctDiv.classList.add("hidden");
    percentDiv.classList.add("hidden");
    el("staff_attr").value = "";
    el("staff_hct_percent").value = "";
  }
}

function hctAttributeChanged() {
  const attr = el("staff_attr").value;
  const percentDiv = el("hctPercentDiv");
  const percentSelect = el("staff_hct_percent");

  percentSelect.innerHTML = '<option value="">-- Select --</option>';

  if (!attr) {
    percentDiv.classList.add("hidden");
    return;
  }

  percentDiv.classList.remove("hidden");
  const values = attr === "generic" ? [8, 9] : [15, 16, 17, 18];
  values.forEach(v => percentSelect.add(new Option(v, v)));
}

function setSelectOptions(selectId, options) {
  const select = el(selectId);
  if (!select) return;

  select.innerHTML = '<option value="">-- Select --</option>';

  options.forEach(option => {
    if (typeof option === "string") {
      select.add(new Option(option, option));
    } else {
      select.add(new Option(option.label, option.value));
    }
  });
}

function populateWeaponDamage(type) {
  const noReq = getNoReqValue() === "yes";
  const options = getDamageOptions(type, noReq);
  setSelectOptions(`${type}_damage`, options);
}

function weaponInherentChanged() {
  const inherent = el("weapon_inherent").value;
  const percentDiv = el("weaponDamagePercentDiv");
  const percentSelect = el("weapon_damage_percent");

  percentSelect.innerHTML = '<option value="">-- Select --</option>';

  if (!inherent || inherent === "none") {
    percentDiv.classList.add("hidden");
    updateSpecialQuestionVisibility();
    return;
  }

  percentDiv.classList.remove("hidden");

  let values = [];
  if (["enchanted", "stance", "hexedfoes", "above50"].includes(inherent)) {
    values = [13, 14];
  } else if (["below50", "hexed"].includes(inherent)) {
    values = [15, 16, 17, 18];
  }

  values.forEach(v => percentSelect.add(new Option(v + "%", v)));

  updateSpecialQuestionVisibility();
}

function updateSpecialQuestionVisibility() {
  const type = el("itemType").value;
  const checkType = el("checkType").value;
  const specialQuestionFields = el("specialQuestionFields");
  const axePiercingRow = el("axePiercingRow");
  const swordShortRow = el("swordShortRow");

  if (!specialQuestionFields || !axePiercingRow || !swordShortRow) return;

  const damage = el(type + "_damage")?.value || "";
  const inherent = el("weapon_inherent")?.value || "";
  const percent = el("weapon_damage_percent")?.value || "";

  const isMartial = MARTIAL_TYPES.includes(type);
  const noReqChosen = hasChosenNoReq();

  if (!isMartial || !noReqChosen || checkType !== "weapon") {
    specialQuestionFields.classList.add("hidden");
    axePiercingRow.classList.add("hidden");
    swordShortRow.classList.add("hidden");
    el("axe_piercing").checked = false;
    el("sword_short").checked = false;
    return;
  }

  const baseFieldsComplete =
    damage &&
    inherent &&
    (inherent === "none" || percent);

  const showAxe = baseFieldsComplete && type === "axe";
  const showSword = baseFieldsComplete && type === "sword";

  specialQuestionFields.classList.toggle("hidden", !(showAxe || showSword));
  axePiercingRow.classList.toggle("hidden", !showAxe);
  swordShortRow.classList.toggle("hidden", !showSword);

  if (!showAxe) {
    el("axe_piercing").checked = false;
  }

  if (!showSword) {
    el("sword_short").checked = false;
  }
}

function getStaffCriteria() {
  return {
    noReq: getNoReqValue(),
    hsr: el("staff_hsr").value,
    energy: el("staff_energy").value,
    inherent: el("staff_inherent").value,
    attr: el("staff_attr").value,
    hctPercent: el("staff_hct_percent").value
  };
}

function getMartialCriteria(type) {
  let skin = "";

  if (type === "bow") {
    skin = el("bow_skin").value;
  }

  if (type === "axe") {
    skin = el("axe_piercing").checked ? "piercing" : "";
  }

  if (type === "sword") {
    skin = el("sword_short").checked ? "short" : "";
  }

  return {
    type,
    skin,
    noReq: getNoReqValue(),
    damage: el(type + "_damage").value,
    inherent: el("weapon_inherent").value,
    percent: el("weapon_damage_percent").value
  };
}

function renderResult(type, result) {
  const resultEl = el("result");
  const debugEl = el("debug");

  if (result.error) {
    resultEl.innerText = result.error;
    debugEl.innerText = "";
    return;
  }

  resultEl.innerText = `${result.tier}`;

  if (result.breakdown) {
    if (type === "staff") {
      debugEl.innerText =
        `⚠ Tier attribution logic is still being finalized.\n\n` +
        `Score: ${result.score} | ` +
        `HSR: ${result.breakdown.hsrScore} | ` +
        `Inherent Mult: ${result.breakdown.inherentMultiplier} | ` +
        `Attr: ${result.breakdown.attrBonus} | ` +
        `HCT%: ${result.breakdown.hctPercentBonus} | ` +
        `Mod Block: ${result.breakdown.modBlock} | ` +
        `Energy Mult: ${result.breakdown.energyBonus}`;
      return;
    }

    const skinPart =
      result.breakdown.skinMode === "bonus"
        ? `Skin Bonus: ${result.breakdown.skinValue} | `
        : result.breakdown.skinMode === "malus"
        ? `Skin Malus: ${result.breakdown.skinValue} | `
        : "";

    debugEl.innerText =
      `Score: ${result.score} | ` +
      `Damage: ${result.breakdown.damageScore} | ` +
      skinPart +
      `Inherent: ${result.breakdown.inherentBonus} | ` +
      `Percent: ${result.breakdown.percentBonus} | ` +
      `Base: ${result.breakdown.baseScore} | ` +
      `Multiplier: ${result.breakdown.modMultiplier}`;
  } else {
    debugEl.innerText = result.info || "";
  }
}

function checkItem() {
  const type = el("itemType").value;
  const checkType = el("checkType").value;
  const resultEl = el("result");
  const debugEl = el("debug");

  if (!type) {
    resultEl.innerText = "Please select an item type.";
    debugEl.innerText = "";
    return;
  }

  if (CHECKTYPE_SUPPORTED_TYPES.includes(type) && !checkType) {
    resultEl.innerText = "Please select a Check Type.";
    debugEl.innerText = "";
    return;
  }

  let result;

  if (PLACEHOLDER_TYPES.includes(type)) {
    result = calculatePlaceholderTier(type);
    renderResult(type, result);
    return;
  }

  if (checkType === "prefix" || checkType === "suffix") {
    result = {
      tier: "Logic not added yet.",
      info: `${checkType === "prefix" ? "Prefix" : "Suffix"} modifier logic has not been added yet.`
    };
    renderResult(type, result);
    return;
  }

  if (checkType === "weapon") {
    if (type === "staff") {
      result = calculateStaffTier(getStaffCriteria());
    } else if (MARTIAL_TYPES.includes(type)) {
      result = calculateMartialTier(type, getMartialCriteria(type));
    } else {
      result = { tier: "Logic not added yet." };
    }

    renderResult(type, result);
    return;
  }

  resultEl.innerText = "Logic not added yet.";
  debugEl.innerText = "";
}
