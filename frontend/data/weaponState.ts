export interface ExtraDamage {
  id: string;
  dice: string;
  type: string;
}

export interface ExtraProperty {
  id: string;
  name: string;
  description: string;
  chargeText?: string;
}

export interface WeaponData {
  name: string;
  attackAttr: "str" | "dex" | "custom";
  attackBonus: string;
  damageDice: string;
  damageMod: string;
  damageType: string;
  isMagic: boolean;
  isSpell: boolean;
  proficient: boolean;
  extraAttackBonus: string;
  tags: string[];
  extraDamages: ExtraDamage[];
  extraProperties: ExtraProperty[];
  spellDescription: string;
}

export const DEFAULT_WEAPON: WeaponData = {
  name: "",
  attackAttr: "str",
  attackBonus: "",
  damageDice: "",
  damageMod: "",
  damageType: "挥砍",
  isMagic: false,
  isSpell: false,
  proficient: false,
  extraAttackBonus: "",
  tags: [],
  extraDamages: [],
  extraProperties: [],
  spellDescription: "",
};

export const DAMAGE_TYPES = [
  "挥砍", "穿刺", "钝击",
  "火焰", "冰冻", "闪电", "雷鸣",
  "酸液", "毒素", "精神", "放射", "黯蚀", "力场",
];

export const ATTACK_ATTRS: { id: WeaponData["attackAttr"]; label: string }[] = [
  { id: "str",    label: "力量" },
  { id: "dex",    label: "敏捷" },
  { id: "custom", label: "自定义" },
];

export const WEAPON_SLOT_COUNT = 7;

// Weapon row absolute positions within the 1224px (unscaled) character card
// 攻击 section: left=433, top=762. Row inner: left+=13, each row top offsets below.
export const WEAPON_ROW_POSITIONS = [
  { top: 785, left: 446, width: 331, height: 28 },
  { top: 821, left: 446, width: 331, height: 28 },
  { top: 857, left: 446, width: 331, height: 28 },
  { top: 893, left: 446, width: 331, height: 28 },
  { top: 929, left: 446, width: 331, height: 28 },
  { top: 965, left: 446, width: 331, height: 28 },
  { top: 1001, left: 446, width: 331, height: 28 },
];

// Column offsets within a weapon row (width=331)
export const WEAPON_COL = {
  name:   { left: 0,   width: 130 },  // inset right=60.73% → ~130px
  attack: { left: 135, width: 61  },  // inset 40.79% each side → 135–196px
  damage: { left: 201, width: 130 },  // inset left=60.73% → 201px to end
};
