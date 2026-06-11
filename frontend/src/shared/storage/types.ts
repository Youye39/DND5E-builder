// ============================================================================
// 角色卡数据模型 —— 用于 localStorage 持久化
// ============================================================================

import type { WeaponData } from "../../../data/weaponState";
import type { CharacterInfoData } from "../../character-sheet-back/components/CharacterInfoSection";

/** 六项属性 */
export interface Attributes {
  str_value: number;
  dex_value: number;
  con_value: number;
  int_value: number;
  wis_value: number;
  cha_value: number;
}

/** 法术位盒子 */
export interface SpellBoxData {
  level: number;
  spellCount: number;
  filledSlots: number;
  isCantrip: boolean;
  col: number;
  row: number;
}

/** 熟练项 */
export interface Proficiencies {
  armor: string[];
  weapon: string[];
  tool: string[];
  language: string[];
}

/** 金币 */
export interface Coins {
  cp: string;
  sp: string;
  ep: string;
  gp: string;
  pp: string;
}

/** 个性特征 */
export interface Personality {
  个性特点: string;
  理想: string;
  牵绊: string;
  缺点: string;
}

/** 死亡豁免 */
export interface DeathSaves {
  success: number;
  failure: number;
}

/** 豁免检定熟练状态（6项） */
export type SavingThrowKey = "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";
export type SavingThrows = Record<SavingThrowKey, boolean>;

/** 技能熟练状态：0=无, 1=熟练, 2=专精（技能按照 D&D 5e 标准18项） */
export type SkillState = 0 | 1 | 2;
export type Skills = Record<string, SkillState>;

/** 全部角色卡数据 */
export interface CharacterData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;

  // ---- 角色卡正面 ----
  attributes: Attributes;
  level: number | "";
  proficiencyBonus: number;
  basicInfo: Record<string, string>; // 职业/种族/背景/阵营/玩家名/经验值
  personality: Personality;
  coins: Coins;
  equipment: string;
  traits: string;
  weapons: WeaponData[];
  proficiencies: Proficiencies;
  deathSaves: DeathSaves;
  savingThrows: SavingThrows;
  skills: Skills;

  // ---- 角色卡背面 ----
  characterInfo: CharacterInfoData;
  backstory: string;
  inventory: string;
  adventureLog: string;
  date: string;

  // ---- 法术页 ----
  spellBoxes: SpellBoxData[];
  customHeights: Record<number, number>;
}

/** 存档管理器 */
export interface SaveArchive {
  currentId: string | null;
  saves: CharacterData[];
}

// ============================================================================
// 默认值
// ============================================================================

export function createDefaultAttributes(): Attributes {
  return {
    str_value: 10,
    dex_value: 10,
    con_value: 10,
    int_value: 10,
    wis_value: 10,
    cha_value: 10,
  };
}

export function createDefaultCharacterInfo(name: string): CharacterInfoData {
  return {
    name,
    gender: "",
    age: "",
    height: "",
    weight: "",
    eyeColor: "",
    skinColor: "",
    hairColor: "",
    appearance: "",
    appearanceImageId: "",
    emblem: "",
    organization: "",
  };
}

let _idCounter = Date.now();
export function generateId(): string {
  return `char_${++_idCounter}`;
}

export function createDefaultCharacter(name = "新角色"): CharacterData {
  return {
    id: generateId(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    attributes: createDefaultAttributes(),
    level: 1,
    proficiencyBonus: 2,
    basicInfo: {
      职业: "",
      种族: "",
      背景: "",
      阵营: "",
      玩家名: "",
      经验值: "",
    },
    personality: {
      个性特点: "",
      理想: "",
      牵绊: "",
      缺点: "",
    },
    coins: { cp: "", sp: "", ep: "", gp: "", pp: "" },
    equipment: "",
    traits: "",
    weapons: [],
    proficiencies: { armor: [], weapon: [], tool: [], language: [] },
    deathSaves: { success: 0, failure: 0 },
    savingThrows: {
      strength: false,
      dexterity: false,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false,
    },
    skills: {},
    characterInfo: createDefaultCharacterInfo(name),
    backstory: "",
    inventory: "",
    adventureLog: "",
    date: "1501 DR",
    spellBoxes: [
      { level: 0, spellCount: 6, filledSlots: 0, isCantrip: true, col: 0, row: 0 },
      { level: 1, spellCount: 13, filledSlots: 4, isCantrip: false, col: 0, row: 1 },
      { level: 2, spellCount: 13, filledSlots: 4, isCantrip: false, col: 0, row: 2 },
      { level: 3, spellCount: 14, filledSlots: 3, isCantrip: false, col: 1, row: 0 },
      { level: 4, spellCount: 9, filledSlots: 4, isCantrip: false, col: 1, row: 1 },
      { level: 5, spellCount: 9, filledSlots: 2, isCantrip: false, col: 1, row: 2 },
      { level: 6, spellCount: 9, filledSlots: 1, isCantrip: false, col: 2, row: 0 },
      { level: 7, spellCount: 8, filledSlots: 1, isCantrip: false, col: 2, row: 1 },
      { level: 8, spellCount: 7, filledSlots: 1, isCantrip: false, col: 2, row: 2 },
      { level: 9, spellCount: 6, filledSlots: 0, isCantrip: false, col: 2, row: 3 },
    ],
    customHeights: {},
  };
}
