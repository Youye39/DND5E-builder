// ============================================================================
// 角色数据上下文 —— 所有页面共享同一份数据
// ============================================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  CharacterData,
  Attributes,
  Proficiencies,
  Coins,
  Personality,
  DeathSaves,
  SpellBoxData,
} from "./types";
import type { Item, AttackEntry } from "../types/types";
import {
  getCurrentCharacter,
  getSaveList,
  saveCharacter,
  createCharacter,
  switchCharacter as switchStorageCharacter,
} from "./storageService";

// ============================================================================
// Context 类型
// ============================================================================

interface CharacterContextValue {
  /** 当前角色数据（可能为 null，表示无存档） */
  character: CharacterData | null;

  /** 存档列表 */
  saveList: { id: string; name: string; updatedAt: number }[];

  /** 当前存档 ID */
  currentId: string | null;

  // ---- 通用更新 ----
  /** 直接替换整个 character 对象（慎用） */
  setCharacter: (data: CharacterData) => void;

  /** 深层合并更新（自动调 saveCharacter） */
  updateCharacter: (patch: Partial<CharacterData>) => void;

  // ---- 细分更新（提供便捷 API） ----
  setAttributes: (attrs: Attributes) => void;
  setLevel: (level: number | "") => void;
  setProficiencyBonus: (bonus: number) => void;
  setBasicInfo: (info: Record<string, string>) => void;
  setPersonality: (p: Personality) => void;
  setCoins: (coins: Coins) => void;
  setEquipment: (text: string) => void;
  setTraits: (text: string) => void;
  setWeapons: (weapons: any[]) => void;
  setProficiencies: (p: Proficiencies) => void;
  setDeathSaves: (d: DeathSaves) => void;
  setCharacterInfo: (info: any) => void;
  setBackstory: (text: string) => void;
  setInventory: (text: string) => void;
  setAdventureLog: (text: string) => void;
  setDate: (date: string) => void;
  setItems: (items: Item[]) => void;
  setAttackEntries: (entries: AttackEntry[]) => void;
  setSpellcastingAbility: (ability: "int" | "wis" | "cha") => void;
  setSpellBoxes: (boxes: SpellBoxData[]) => void;
  setCustomHeights: (heights: Record<number, number>) => void;

  // ---- 存档管理 ----
  switchCharacter: (id: string) => void;
  newCharacter: (name?: string) => void;
  refreshSaveList: () => void;
}

// ============================================================================
// 数据迁移 —— 兼容旧版本存档
// ============================================================================

/** 旧版中文技能名 → 新版英文技能 key 映射 */
const LEGACY_SKILL_KEYS: Record<string, string> = {
  "体操": "acrobatics",
  "驯兽": "animalHandling",
  "奥秘": "arcana",
  "运动": "athletics",
  "欺瞒": "deception",
  "历史": "history",
  "洞悉": "insight",
  "威吓": "intimidation",
  "调查": "investigation",
  "医药": "medicine",
  "自然": "nature",
  "察觉": "perception",
  "表演": "performance",
  "游说": "persuasion",
  "宗教": "religion",
  "巧手": "sleightOfHand",
  "隐匿": "stealth",
  "求生": "survival",
};

/** 迁移旧版角色数据到当前版本 */
function migrateCharacterData(data: CharacterData): CharacterData {
  let changed = false;
  const result = { ...data };

  // 1. 技能键名迁移：中文 → 英文
  if (result.skills) {
    const migratedSkills: Record<string, 0 | 1 | 2 | 3> = {};
    for (const [key, val] of Object.entries(result.skills)) {
      const newKey = LEGACY_SKILL_KEYS[key] ?? key;
      migratedSkills[newKey] = val;
      if (newKey !== key) changed = true;
    }
    result.skills = migratedSkills;
  }
  if (result.skillCustomModifiers) {
    const migratedMods: Record<string, string | null> = {};
    for (const [key, val] of Object.entries(result.skillCustomModifiers)) {
      const newKey = LEGACY_SKILL_KEYS[key] ?? key;
      migratedMods[newKey] = val;
      if (newKey !== key) changed = true;
    }
    result.skillCustomModifiers = migratedMods;
  }

  if (changed) {
    result.updatedAt = Date.now();
    setTimeout(() => saveCharacter(result), 0);
  }

  return result;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function CharacterProvider({ children }: { children: ReactNode }) {
  // 首次加载时，如果无存档则自动创建默认角色
  const [character, setCharacterState] = useState<CharacterData | null>(() => {
    const existing = getCurrentCharacter();
    if (existing) return migrateCharacterData(existing);
    // 无存档 → 自动创建一个
    const fresh = createCharacter("New Character");
    return fresh;
  });
  const [saveList, setSaveList] = useState<
    { id: string; name: string; updatedAt: number }[]
  >(() => getSaveList());
  const [currentId, setCurrentId] = useState<string | null>(
    () => getCurrentCharacter()?.id ?? null
  );

  // ========================================================================
  // 核心：更新角色数据并自动保存
  // ========================================================================

  const updateCharacter = useCallback((patch: Partial<CharacterData>) => {
    setCharacterState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch, updatedAt: Date.now() };
      // 异步写入 localStorage，不阻塞 UI 渲染
      setTimeout(() => saveCharacter(next), 0);
      return next;
    });
  }, []);

  const setCharacter = useCallback((data: CharacterData) => {
    setCharacterState(data);
    setCurrentId(data.id);
    setTimeout(() => saveCharacter(data), 0);
  }, []);

  // ========================================================================
  // 细分更新方法
  // ========================================================================

  const setAttributes = useCallback(
    (attrs: Attributes) => updateCharacter({ attributes: attrs }),
    [updateCharacter]
  );
  const setLevel = useCallback(
    (level: number | "") => updateCharacter({ level }),
    [updateCharacter]
  );
  const setProficiencyBonus = useCallback(
    (proficiencyBonus: number) => updateCharacter({ proficiencyBonus }),
    [updateCharacter]
  );
  const setBasicInfo = useCallback(
    (basicInfo: Record<string, string>) => updateCharacter({ basicInfo }),
    [updateCharacter]
  );
  const setPersonality = useCallback(
    (personality: Personality) => updateCharacter({ personality }),
    [updateCharacter]
  );
  const setCoins = useCallback(
    (coins: Coins) => updateCharacter({ coins }),
    [updateCharacter]
  );
  const setEquipment = useCallback(
    (equipment: string) => updateCharacter({ equipment }),
    [updateCharacter]
  );
  const setTraits = useCallback(
    (traits: string) => updateCharacter({ traits }),
    [updateCharacter]
  );
  const setWeapons = useCallback(
    (weapons: any[]) => updateCharacter({ weapons: weapons as never[] }),
    [updateCharacter]
  );
  const setProficiencies = useCallback(
    (proficiencies: Proficiencies) => updateCharacter({ proficiencies }),
    [updateCharacter]
  );
  const setDeathSaves = useCallback(
    (deathSaves: DeathSaves) => updateCharacter({ deathSaves }),
    [updateCharacter]
  );
  const setCharacterInfo = useCallback(
    (characterInfo: any) => updateCharacter({ characterInfo }),
    [updateCharacter]
  );
  const setBackstory = useCallback(
    (backstory: string) => updateCharacter({ backstory }),
    [updateCharacter]
  );
  const setInventory = useCallback(
    (inventory: string) => updateCharacter({ inventory }),
    [updateCharacter]
  );
  const setAdventureLog = useCallback(
    (adventureLog: string) => updateCharacter({ adventureLog }),
    [updateCharacter]
  );
  const setDate = useCallback(
    (date: string) => updateCharacter({ date }),
    [updateCharacter]
  );
  const setSpellBoxes = useCallback(
    (spellBoxes: SpellBoxData[]) => updateCharacter({ spellBoxes }),
    [updateCharacter]
  );
  const setCustomHeights = useCallback(
    (customHeights: Record<number, number>) => updateCharacter({ customHeights }),
    [updateCharacter]
  );

  const setItems = useCallback(
    (items: Item[]) => updateCharacter({ items }),
    [updateCharacter]
  );
  const setAttackEntries = useCallback(
    (attackEntries: AttackEntry[]) => updateCharacter({ attackEntries }),
    [updateCharacter]
  );
  const setSpellcastingAbility = useCallback(
    (spellcastingAbility: "int" | "wis" | "cha") => updateCharacter({ spellcastingAbility }),
    [updateCharacter]
  );

  // ========================================================================
  // 存档管理
  // ========================================================================

  const refreshSaveList = useCallback(() => {
    setSaveList(getSaveList());
  }, []);

  const switchCharacterFn = useCallback(
    (id: string) => {
      const char = switchStorageCharacter(id);
      if (char) {
        setCharacterState(migrateCharacterData(char));
        setCurrentId(id);
        refreshSaveList();
      }
    },
    [refreshSaveList]
  );

  const newCharacter = useCallback(
    (name?: string) => {
      const char = createCharacter(name);
      setCharacterState(char);
      setCurrentId(char.id);
      refreshSaveList();
    },
    [refreshSaveList]
  );

  // 当 localStorage 外部变更时刷新（理论上仅当前 tab）
  useEffect(() => {
    refreshSaveList();
  }, [refreshSaveList]);

  const value: CharacterContextValue = {
    character,
    saveList,
    currentId,
    setCharacter,
    updateCharacter,
    setAttributes,
    setLevel,
    setProficiencyBonus,
    setBasicInfo,
    setPersonality,
    setCoins,
    setEquipment,
    setTraits,
    setWeapons,
    setProficiencies,
    setDeathSaves,
    setCharacterInfo,
    setBackstory,
    setInventory,
    setAdventureLog,
    setDate,
    setItems,
    setAttackEntries,
    setSpellcastingAbility,
    setSpellBoxes,
    setCustomHeights,
    switchCharacter: switchCharacterFn,
    newCharacter,
    refreshSaveList,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useCharacter(): CharacterContextValue {
  const ctx = useContext(CharacterContext);
  if (!ctx) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return ctx;
}

/** 便捷 hook —— 获取当前角色数据（非 null 版本，用于已确定有角色的场景） */
export function useCharacterData(): CharacterData {
  const { character } = useCharacter();
  if (!character) {
    // 如果没有角色，抛出一个可捕获的错误
    throw new Error("No character data available");
  }
  return character;
}
