// ============================================================================
// 导出格式转换服务
// ============================================================================

import type { CharacterData } from "./types";
import { ARMOR_OPTIONS } from "../../../data/armorOptions";
import type { ArmorOption } from "../../../data/armorOptions";

// ─── 技能中文名 → 英文 key 映射 ──────────────────────────────────────────────
const SKILL_MAP: Record<string, string> = {
  "运动": "ath", "特技": "acr", "巧手": "slt", "隐匿": "ste",
  "调查": "inv", "奥秘": "arc", "历史": "his", "自然": "nat", "宗教": "rel",
  "察觉": "prc", "洞悉": "ins", "驯兽": "ani", "医药": "med", "求生": "sur",
  "游说": "per", "欺瞒": "dec", "威吓": "itm", "表演": "prf",
};
const SKILL_NAMES_CN = ["运动","特技","巧手","隐匿","调查","奥秘","历史","自然","宗教","察觉","洞悉","驯兽","医药","求生","游说","欺瞒","威吓","表演"];

function attrMod(value: number): number {
  return Math.floor((value - 10) / 2);
}

// ────────────────────────────────────────────────────────────────────────────
// 枭熊（Owlbear Rodeo）格式
// ────────────────────────────────────────────────────────────────────────────

// 语言 ID → 中文名
import languagesData from "../../../data/languages.json";
const LANG_CN: Record<string, string> = {};
for (const group of languagesData) {
  for (const opt of group.options) LANG_CN[opt.id] = opt.label;
}

// 工具 ID → 中文名
import toolsData from "../../../data/tools.json";
const TOOL_CN: Record<string, string> = {};
for (const group of toolsData) {
  for (const opt of group.options) TOOL_CN[opt.id] = opt.label;
}

// 学派 ID → 中文名
const SCHOOL_CN: Record<string, string> = {
  abjuration: "防护", conjuration: "咒法", divination: "预言",
  enchantment: "附魔", evocation: "塑能", illusion: "幻术",
  necromancy: "死灵", transmutation: "变化",
};



export function toOwlbearJSON(character: CharacterData): string {
  const attrs = character.attributes;
  const pb = character.proficiencyBonus || Math.floor(((typeof character.level === "number" ? character.level : 1) + 7) / 4);
  const abilityKeys = ["str", "dex", "con", "int", "wis", "cha"] as const;
  const cnAbilities: Record<string, string> = { str: "力量", dex: "敏捷", con: "体质", int: "智力", wis: "感知", cha: "魅力" };

  // ── 属性修正值（AC 计算等复用） ─────────────────────────────────
  const dexMod = attrMod(attrs.dex_value ?? 10);
  const conMod = attrMod(attrs.con_value ?? 10);
  const wisMod = attrMod(attrs.wis_value ?? 10);
  const strMod = attrMod(attrs.str_value ?? 10);
  const intMod = attrMod(attrs.int_value ?? 10);
  const chaMod = attrMod(attrs.cha_value ?? 10);

  // ── AC ──────────────────────────────────────────────────────────
  const selectedArmor_: ArmorOption | undefined = character.selectedArmorId
    ? ARMOR_OPTIONS.find(a => a.id === character.selectedArmorId)
    : undefined;
  const shieldBonus = character.hasShield ? 2 : 0;
  const armorExtra = parseInt(character.armorExtraBonus ?? "", 10) || 0;
  const shieldExtra = parseInt(character.shieldExtraBonus ?? "", 10) || 0;
  const acExtrasBonus = (character.acExtras ?? []).reduce((s, e) => s + (parseInt(e.bonus || "0", 10) || 0), 0);

  let finalAC: number;
  const isCustom = character.selectedArmorId === "custom";
  if (isCustom && character.customACFormula) {
    try {
      let expr = character.customACFormula
        .replace(/力量调整值/g, String(strMod))
        .replace(/敏捷调整值/g, String(dexMod))
        .replace(/体质调整值/g, String(conMod))
        .replace(/智力调整值/g, String(intMod))
        .replace(/感知调整值/g, String(wisMod))
        .replace(/魅力调整值/g, String(chaMod));
      const result = Function('"use strict"; return (' + expr + ')')();
      finalAC = (typeof result === "number" && isFinite(result) ? Math.max(1, Math.round(result)) : 10)
        + shieldBonus + armorExtra + shieldExtra + acExtrasBonus;
    } catch {
      finalAC = 10 + shieldBonus + armorExtra + shieldExtra + acExtrasBonus;
    }
  } else {
    const base = selectedArmor_ ? selectedArmor_.calcAC(dexMod, conMod, wisMod) : 10 + dexMod;
    finalAC = base + shieldBonus + armorExtra + shieldExtra + acExtrasBonus;
  }

  // ── 构建 abilities ─────────────────────────────────────────────
  const abilities: Record<string, any> = {};
  for (const k of abilityKeys) {
    const val = attrs[`${k}_value`] ?? 10;
    const mod = attrMod(val);
    const saveKey = k === "str" ? "strength" : k === "dex" ? "dexterity" : k === "con" ? "constitution" : k === "int" ? "intelligence" : k === "wis" ? "wisdom" : "charisma";
    const saveProf = character.savingThrows?.[saveKey];
    abilities[k] = {
      total: val, initial: val, background: 0, growth: 0, misc: 0,
      modifier: mod,
      save: { proficient: !!saveProf, bonus: saveProf ? mod + pb : mod, misc: 0 },
    };
  }

  // ── 技能 ────────────────────────────────────────────────────────
  const skills: any[] = [];
  const skillAbilityMap: Record<string, string> = {
    "运动":"str","特技":"dex","巧手":"dex","隐匿":"dex",
    "调查":"int","奥秘":"int","历史":"int","自然":"int","宗教":"int",
    "察觉":"wis","洞悉":"wis","驯兽":"wis","医药":"wis","求生":"wis",
    "游说":"cha","欺瞒":"cha","威吓":"cha","表演":"cha",
  };
  for (const name of SKILL_NAMES_CN) {
    const state = character.skills?.[name] ?? 0;
    const abil = skillAbilityMap[name] ?? "dex";
    const abilMod = attrMod((attrs as any)[`${abil}_value`] ?? 10);
    let total = abilMod;
    let prof: string;
    if (state === 2) { total += pb * 2; prof = "expertise"; }
    else if (state === 1) { total += pb; prof = "proficient"; }
    else { prof = "none"; }
    skills.push({ name, ability: abil, proficiency: prof, total, misc_bonus: 0 });
  }

  // ── 武备 ────────────────────────────────────────────────────────
  const weapons: any[] = [];
  for (const item of character.items ?? []) {
    if (item.isWeapon) {
      const atkBonus = item.attackAttr && item.attackAttr !== "custom"
        ? attrMod(attrs[`${item.attackAttr}_value`] ?? 10) + (item.proficient !== false ? pb : 0) + (parseInt(item.attackBonus ?? "0") || 0)
        : 0;
      const atkStr = atkBonus >= 0 ? `+${atkBonus}` : `${atkBonus}`;
      const dmgBonus = item.attackAttr && item.attackAttr !== "custom" ? attrMod((attrs as any)[`${item.attackAttr}_value`] ?? 10) : 0;
      const dmgStr = dmgBonus >= 0 ? `${item.damageDice ?? "1d4"}+${dmgBonus}` : `${item.damageDice ?? "1d4"}${dmgBonus}`;
      weapons.push({
        name: item.name, proficient: item.proficient !== false,
        attack_bonus: atkStr, damage: dmgStr, damage_type: item.damageType ?? "",
        extra_damage: null, extra_damage_type: null,
        mastery: null, mastery_effect: null,
        weight: null, ammo_type: null, properties: null,
      });
    }
  }

  // ── 护甲信息 ────────────────────────────────────────────────────
  const armorName = selectedArmor_ && selectedArmor_.id !== "unarmored" ? selectedArmor_.name : null;
  const dexCap = selectedArmor_
    ? (selectedArmor_.id === "hide" || selectedArmor_.id === "chain_shirt" || selectedArmor_.id === "scale_mail" || selectedArmor_.id === "breastplate" || selectedArmor_.id === "half_plate" ? 2 : null)
    : null;

  // ── 特性 ────────────────────────────────────────────────────────
  const classFeatures: any[] = [];
  const raceFeatures: any[] = [];
  const feats: any[] = [];
  let bgDescription = "";
  for (const t of character.traitList ?? []) {
    const tag = (t.tags ?? [])[0] ?? "";
    const item = { name: t.name, description: t.description ?? null, level: null };
    if (tag === "背景") {
      if (t.description) bgDescription = t.description;
    } else if (tag === "专长") feats.push(item);
    else if (tag === "种族") raceFeatures.push(item);
    else classFeatures.push(item);
  }

  // ── 语言/工具 ID → 中文名 ──────────────────────────────────────
  const languages = (character.proficiencies?.language ?? []).map(id => LANG_CN[id] ?? id);
  const toolProfs = (character.proficiencies?.tool ?? []).map(id => TOOL_CN[id] ?? id);

  // ── 年龄转数字 ──────────────────────────────────────────────────
  const ageNum = character.characterInfo?.age ? parseInt(character.characterInfo.age, 10) || null : null;

  // ── 法术位（来自 customSpellSlots / spellBoxes） ───────────────
  const spellSlots: Record<string, any> = {};
  const customSlots = character.customSpellSlots ?? {};
  // 用 customSpellSlots 确定 max，否则用 spellBoxes 的 spellCount 汇总
  const maxMap: Record<number, number> = {};
  for (const box of character.spellBoxes ?? []) {
    if (!box.isCantrip) {
      const prev = maxMap[box.level] ?? 0;
      maxMap[box.level] = prev + box.spellCount;
    }
  }
  const allLevels = new Set([
    ...Object.keys(customSlots).map(Number),
    ...Object.keys(maxMap).map(Number),
  ]);
  for (const lvl of allLevels) {
    const max = customSlots[lvl] ?? maxMap[lvl] ?? 0;
    if (max > 0) {
      spellSlots[String(lvl)] = { current: max, max };
    }
  }

  // ── 法术攻击加值 ────────────────────────────────────────────────
  const spellAtk = pb + attrMod(attrs[`${character.spellcastingAbility ?? "int"}_value`] ?? 10);

  const output: any = {
    schema_version: "0.3",
    meta: {
      template_name: character.name || "角色",
      template_version: "ver.",
      layout_version: "v1.0.12-2014mode",
      source_file: "",
      parsed_at: new Date().toISOString(),
    },
    identity: {
      character_name: character.name || "",
      display_name: character.name || "",
      player: character.basicInfo?.玩家名 ?? "",
      race: { name: character.basicInfo?.种族 ?? "", subrace: null },
      alignment: character.basicInfo?.阵营 ?? null,
      faith: null,
      age: ageNum,
      gender: character.characterInfo?.gender ?? "",
      height: character.characterInfo?.height ?? null,
      weight: character.characterInfo?.weight ?? null,
      hometown: null,
      languages,
      tool_proficiencies: toolProfs,
    },
    classes: [
      { role: "主职", name: character.basicInfo?.职业 ?? null, subclass: null, level: typeof character.level === "number" ? character.level : null },
      { role: "兼职1", name: null, subclass: null, level: null },
      { role: "兼职2", name: null, subclass: null, level: null },
    ],
    total_level: typeof character.level === "number" ? character.level : 1,
    abilities,
    core_stats: {
      proficiency_bonus: pb,
      initiative: dexMod,
      ac: finalAC,
      dc: 8 + pb + attrMod(attrs[`${character.spellcastingAbility ?? "int"}_value`] ?? 10),
      dc_ability: cnAbilities[character.spellcastingAbility ?? "int"] ?? "智力",
      passive_perception: 10 + wisMod + ((character.skills?.察觉 ?? 0) >= 1 ? pb : 0),
      speed: character.customSpeed ?? 30,
      size: "中型",
      hp: { current: character.currentHP ?? 0, max: character.currentHP ?? 0, temp: character.tempHP ?? 0 },
      hit_dice: { current: typeof character.level === "number" ? character.level : 1, max: typeof character.level === "number" ? character.level : 1, die_size: null },
    },
    defenses: { resistances: [], immunities: [], advantages: [], disadvantages: [] },
    skills,
    combat: {
      armor: { name: armorName, ac_base: finalAC, dex_bonus_cap: dexCap, attuned: false, weight: null, equipped: true },
      shield: { ac_bonus: shieldBonus, attuned: false, equipped: !!character.hasShield },
      weapons,
      other_equipment: character.items?.filter(i => !i.isWeapon).map(i => ({ name: i.name, quantity: i.quantity })) ?? [],
    },
    spellcasting: {
      spellcasting_ability: cnAbilities[character.spellcastingAbility ?? "int"] ?? "智力",
      save_dc: 8 + pb + attrMod(attrs[`${character.spellcastingAbility ?? "int"}_value`] ?? 10),
      attack_bonus: `D20${spellAtk >= 0 ? "+" : ""}${spellAtk}`,
      max_prepared: null,
      spell_slots: spellSlots,
      sorcery_points: null,
      always_known: [],
      cantrips_known: (character.spellBoxes ?? []).filter(b => b.isCantrip).flatMap(b => b.spells ?? []).filter(s => s.name).map(s => ({
        level: 0, name: s.name, description: s.description,
        meta: { school: SCHOOL_CN[s.school ?? ""] ?? s.school ?? "", casting_time: "", range: "", components: "", duration: "", concentration: !!s.concentration, ritual: !!s.ritual, english: "", source: null },
      })),
      prepared: (character.spellBoxes ?? []).filter(b => !b.isCantrip).flatMap(b => (b.spells ?? []).filter(s => s.name).map(s => ({
        level: b.level, name: s.name, group: 1,
        description: s.description,
        meta: { school: SCHOOL_CN[s.school ?? ""] ?? s.school ?? "", casting_time: "", range: "", components: "", duration: "", concentration: !!s.concentration, ritual: !!s.ritual, english: "", source: null },
      }))),
    },
    features: { class_features: classFeatures, race_features: raceFeatures, feats, fighting_style_feats: [], special_abilities: [] },
    special_resources: [],
    background: {
      background_name: character.basicInfo?.背景 ?? "",
      personality: character.personality?.个性特点 ?? null,
      appearance: character.characterInfo?.appearance ?? null,
      traits: null,
      ideals: character.personality?.理想 ?? null,
      bonds: character.personality?.牵绊 ?? null,
      flaws: character.personality?.缺点 ?? null,
      story: character.backstory ?? null,
      description: bgDescription,
    },
    inventory: {
      currency: (() => {
        const c = character.coins ?? { cp: "0", sp: "0", ep: "0", gp: "0", pp: "0" };
        const gp = parseInt(c.gp || "0");
        return {
          wallet: { gp, pp: parseInt(c.pp || "0"), ep: parseInt(c.ep || "0"), sp: parseInt(c.sp || "0"), cp: parseInt(c.cp || "0") },
          total_gp: gp,
          total_gp_raw: `${gp}GP`,
        };
      })(),
      encumbrance: { equipment_weight: 0, pack1_weight: 0, pack2_weight: 0, total_weight: 0, light_threshold: 0, heavy_threshold: 0, overloaded_threshold: 0, max_capacity: 0 },
      items: [],
      wondrous_items: [],
      consumables: [],
    },
    exports: { dice_bot: (() => {
      const sb: string[] = [];
      // 属性
      sb.push(`力量:${attrs.str_value ?? 10} 敏捷:${attrs.dex_value ?? 10} 体质:${attrs.con_value ?? 10} 智力:${attrs.int_value ?? 10} 感知:${attrs.wis_value ?? 10} 魅力:${attrs.cha_value ?? 10}`);
      // HP
      sb.push(`hp:${character.currentHP ?? 0} hpmax:${character.currentHP ?? 0}`);
      // 先攻 / AC / DC / PP / 熟练
      const dcVal = 8 + pb + attrMod(attrs[`${character.spellcastingAbility ?? "int"}_value`] ?? 10);
      const ppVal = 10 + wisMod + ((character.skills?.察觉 ?? 0) >= 1 ? pb : 0);
      sb.push(`先攻:${dexMod} ac:${finalAC} dc:${dcVal} pp:${ppVal} 熟练:${pb}`);
      // 技能
      const skillAbilityMap2: Record<string, string> = {
        "运动":"str","特技":"dex","巧手":"dex","隐匿":"dex",
        "调查":"int","奥秘":"int","历史":"int","自然":"int","宗教":"int",
        "察觉":"wis","洞悉":"wis","驯兽":"wis","医药":"wis","求生":"wis",
        "游说":"cha","欺瞒":"cha","威吓":"cha","表演":"cha",
      };
      for (const name of SKILL_NAMES_CN) {
        const state = character.skills?.[name] ?? 0;
        const abil = skillAbilityMap2[name] ?? "dex";
        const mod = attrMod((attrs as any)[`${abil}_value`] ?? 10);
        let total = mod;
        if (state === 2) total += pb * 2;
        else if (state === 1) total += pb;
        const suffix = state >= 1 ? "*" : "";
        sb.push(`${name}${suffix}:${total}`);
      }
      return `.st ${sb.join(" ")}`;
    })(), embedded_json: null },
  };

  return JSON.stringify(output, null, 2);
}

// ────────────────────────────────────────────────────────────────────────────
// Foundry VTT 格式
// ────────────────────────────────────────────────────────────────────────────

// ── 熟练项键名映射（应用 → FVTT dnd5e 2.4.1） ──────────────────────────
const ARMOR_MAP: Record<string, string> = {
  "light": "lgt", "medium": "med", "heavy": "hvy", "shield": "shl",
};

const LANG_MAP: Record<string, string> = {
  "deep_speech": "deep", "thieves_cant": "cant",
};

const TOOL_MAP: Record<string, string> = {
  // 特殊工具 — FVTT 使用缩写
  "disguise": "disg", "forgery": "forg", "herbalism": "herb",
  "navigator": "navg", "poisoner": "pois", "thieves": "thief",
  // 赌具
  "dragonchess": "chess",
  // 载具
  "land_vehicle": "land", "water_vehicle": "water",
  // 剩下的（乐器、工匠工具）键名与 FVTT 一致，无需映射
};

function mapProfs(items: string[], map: Record<string, string>): string[] {
  const seen = new Set<string>();
  for (const item of items) {
    const mapped = map[item] ?? item;
    seen.add(mapped);
  }
  return [...seen];
}

export function toFVTTJSON(character: CharacterData): string {
  const attrs = character.attributes;
  const now = Date.now();

  // ── 计算最终 AC（与 UI 逻辑一致） ─────────────────────────────────
  const dexMod = Math.floor(((attrs.dex_value ?? 10) - 10) / 2);
  const conMod = Math.floor(((attrs.con_value ?? 10) - 10) / 2);
  const wisMod = Math.floor(((attrs.wis_value ?? 10) - 10) / 2);
  const strMod = Math.floor(((attrs.str_value ?? 10) - 10) / 2);
  const intMod = Math.floor(((attrs.int_value ?? 10) - 10) / 2);
  const chaMod = Math.floor(((attrs.cha_value ?? 10) - 10) / 2);

  const selectedArmor: ArmorOption | undefined = character.selectedArmorId
    ? ARMOR_OPTIONS.find(a => a.id === character.selectedArmorId)
    : undefined;
  const shieldBonus = character.hasShield ? 2 : 0;
  const armorExtra = parseInt(character.armorExtraBonus ?? "", 10) || 0;
  const shieldExtra = parseInt(character.shieldExtraBonus ?? "", 10) || 0;
  const acExtrasBonus = (character.acExtras ?? []).reduce((s, e) => s + (parseInt(e.bonus || "0", 10) || 0), 0);

  let finalAC: number;
  const isCustom = character.selectedArmorId === "custom";
  if (isCustom && character.customACFormula) {
    // 解析自定义公式（支持中文调整值替换）
    try {
      let expr = character.customACFormula
        .replace(/力量调整值/g, String(strMod))
        .replace(/敏捷调整值/g, String(dexMod))
        .replace(/体质调整值/g, String(conMod))
        .replace(/智力调整值/g, String(intMod))
        .replace(/感知调整值/g, String(wisMod))
        .replace(/魅力调整值/g, String(chaMod));
      const result = Function('"use strict"; return (' + expr + ')')();
      finalAC = (typeof result === "number" && isFinite(result) ? Math.max(1, Math.round(result)) : 10)
        + shieldBonus + armorExtra + shieldExtra + acExtrasBonus;
    } catch {
      finalAC = 10 + shieldBonus + armorExtra + shieldExtra + acExtrasBonus;
    }
  } else {
    const base = selectedArmor ? selectedArmor.calcAC(dexMod, conMod, wisMod) : 10 + dexMod;
    finalAC = base + shieldBonus + armorExtra + shieldExtra + acExtrasBonus;
  }

  const abilities: Record<string, any> = {};
  for (const k of ["str", "dex", "con", "int", "wis", "cha"] as const) {
    const val = attrs[`${k}_value`] ?? 10;
    const saveKey = k === "str" ? "strength" : k === "dex" ? "dexterity" : k === "con" ? "constitution" : k === "int" ? "intelligence" : k === "wis" ? "wisdom" : "charisma";
    const saveProf = character.savingThrows?.[saveKey] ? 1 : 0;
    abilities[k] = { value: val, proficient: saveProf, max: null, bonuses: { check: "", save: "", skill: "" } };
  }

  // 技能
  const skillAbilityMap: Record<string, string> = {
    "运动":"str","特技":"dex","巧手":"dex","隐匿":"dex",
    "调查":"int","奥秘":"int","历史":"int","自然":"int","宗教":"int",
    "察觉":"wis","洞悉":"wis","驯兽":"wis","医药":"wis","求生":"wis",
    "游说":"cha","欺瞒":"cha","威吓":"cha","表演":"cha",
  };
  const skills: Record<string, any> = {};
  for (const cn of SKILL_NAMES_CN) {
    const abil = skillAbilityMap[cn] ?? "dex";
    const state = character.skills?.[cn] ?? 0;
    skills[SKILL_MAP[cn]] = { value: state, ability: abil, bonuses: { check: "", pass: "", save: "" } };
  }

  const output: any = {
    name: character.name || "",
    type: "character",
    img: "icons/svg/item-bag.svg",
    system: {
      abilities,
      attributes: {
        ac: { flat: finalAC, calc: "flat", formula: "" },
        hp: {
          value: character.currentHP ?? 0, max: character.customMaxHP ?? 0, temp: character.tempHP ?? 0, tempmax: null,
          bonuses: { successes: 0, failures: 0 },
        },
        init: { ability: "", bonus: "" },
        movement: { burrow: null, climb: null, fly: null, swim: null, walk: character.customSpeed ?? 30, units: null, hover: false },
        attunement: { max: 3 },
        senses: { darkvision: 0, blindsight: null, tremorsense: null, truesight: null, units: null, special: "" },
        spellcasting: character.spellcastingAbility ?? "int",
        death: { success: character.deathSaves?.success ?? 0, failure: character.deathSaves?.failure ?? 0 },
        exhaustion: 0, inspiration: false,
      },
      details: {
        biography: { value: character.backstory ?? "", public: "" },
        alignment: character.basicInfo?.阵营 ?? "",
        race: character.basicInfo?.种族 ?? "",
        background: character.basicInfo?.背景 ?? "",
        originalClass: "",
        xp: { value: parseInt(character.basicInfo?.经验值 ?? "0") || 0 },
        appearance: character.characterInfo?.appearance ?? "",
        trait: character.personality?.个性特点 ?? "",
        ideal: character.personality?.理想 ?? "",
        bond: character.personality?.牵绊 ?? "",
        flaw: character.personality?.缺点 ?? "",
      },
      traits: {
        size: "med",
        di: { value: [], bypasses: [], custom: "" },
        dr: { value: [], bypasses: [], custom: "" },
        dv: { value: [], bypasses: [], custom: "" },
        ci: { value: [], custom: "" },
        languages: { value: mapProfs(character.proficiencies?.language ?? [], LANG_MAP), custom: "" },
        weaponProf: { value: character.proficiencies?.weapon ?? [], custom: "" },
        armorProf: { value: mapProfs(character.proficiencies?.armor ?? [], ARMOR_MAP), custom: "" },
      },
      currency: {
        pp: parseInt(character.coins?.pp || "0"),
        gp: parseInt(character.coins?.gp || "0"),
        ep: parseInt(character.coins?.ep || "0"),
        sp: parseInt(character.coins?.sp || "0"),
        cp: parseInt(character.coins?.cp || "0"),
      },
      skills,
      tools: (() => {
        const t: Record<string, any> = {};
        for (const tool of character.proficiencies?.tool ?? []) {
          const key = TOOL_MAP[tool] ?? tool;
          t[key] = { value: 1, ability: "int", bonuses: { check: "" } };
        }
        return t;
      })(),
      spells: (() => {
        const slots: Record<string, any> = {};
        for (const box of character.spellBoxes ?? []) {
          if (!box.isCantrip) {
            slots[`spell${box.level}`] = { value: box.spellCount, override: null };
          }
        }
        return slots;
      })(),
      bonuses: {
        mwak: { attack: "", damage: "" },
        rwak: { attack: "", damage: "" },
        msak: { attack: "", damage: "" },
        rsak: { attack: "", damage: "" },
        abilities: { check: "", save: "", skill: "" },
        spell: { dc: "" },
      },
      resources: {
        primary: { value: null, max: null, sr: false, lr: false, label: "" },
        secondary: { value: null, max: null, sr: false, lr: false, label: "" },
        tertiary: { value: null, max: null, sr: false, lr: false, label: "" },
      },
    },
    prototypeToken: {
      name: character.name || "",
      displayName: 30, actorLink: true, appendNumber: false, prependAdjective: false,
      texture: { src: "icons/svg/item-bag.svg", scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0, rotation: 0, tint: null },
      width: 1, height: 1, lockRotation: false, rotation: 0, alpha: 1, disposition: 1,
      displayBars: 50, bar1: { attribute: "attributes.hp" }, bar2: { attribute: null },
      light: { alpha: 0.5, angle: 360, bright: 0, coloration: 1, dim: 0, attenuation: 0.5, luminosity: 0.5, saturation: 0, contrast: 0, shadows: 0, animation: { type: null, speed: 5, intensity: 5, reverse: false }, darkness: { min: 0, max: 1 }, color: null },
      sight: { enabled: true, range: 0, angle: 360, visionMode: "basic", color: null, attenuation: 0.1, brightness: 0, saturation: 0, contrast: 0 },
      detectionModes: [], flags: {}, randomImg: false,
    },
    items: [],
    effects: [],
    folder: null,
    flags: {},
    _stats: {
      systemId: "dnd5e", systemVersion: "2.4.1", coreVersion: "11.315",
      createdTime: now, modifiedTime: now, lastModifiedBy: "",
    },
  };

  return JSON.stringify(output, null, 2);
}
