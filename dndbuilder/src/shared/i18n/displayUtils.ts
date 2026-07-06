// ============================================================================
// 统一的中英文显示工具 — 所有 JSON id/label 格式化逻辑集中于此
// ============================================================================

import damageTypes from "../../../data/damageTypes.json";

// ─── 伤害类型 ────────────────────────────────────────────────────────────────

const DT_LIST = damageTypes as { id: string; label: string }[];

/** 中文标签 → 英文 ID */
export const DAMAGE_LABEL_TO_ID: Record<string, string> = {};
/** 英文 ID → 中文标签 */
export const DAMAGE_ID_TO_LABEL: Record<string, string> = {};
for (const dt of DT_LIST) {
  DAMAGE_LABEL_TO_ID[dt.label] = dt.id;
  DAMAGE_ID_TO_LABEL[dt.id] = dt.label;
}

/**
 * 将伤害类型值统一转成 ID（兼容旧存档的中文标签）
 */
export function toDamageId(value: string): string {
  return DAMAGE_LABEL_TO_ID[value] ?? value;
}

/**
 * 显示伤害类型：英文显示 ID，中文从 JSON label 查找
 */
export function displayDamageType(value: string | undefined, lang: string): string {
  if (!value) return "—";
  const id = toDamageId(value);
  return lang === 'en' ? id : (DAMAGE_ID_TO_LABEL[id] ?? id);
}

// ─── ID → 显示名 ─────────────────────────────────────────────────────────────

/**
 * 将 JSON id 格式化为英文标题（首字母大写、下划线变空格）
 * 例: "studded_leather" → "Studded Leather", "simple melee" → "Simple Melee"
 */
export function idToDisplay(id: string): string {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * 通用双语显示：英文用 idToDisplay，中文用 JSON label
 */
export function displayLabel(id: string, label: string, lang: string): string {
  return lang === 'en' ? idToDisplay(id) : label;
}

// ─── 武器标签 ────────────────────────────────────────────────────────────────

const TAG_DISPLAY_OVERRIDE: Record<string, string> = {
  twohanded: "Two-Handed",
};

/**
 * 武器标签专名修正（仅英文）
 */
export function tagDisplayName(tagId: string, lang: string): string {
  if (lang !== 'en') return '';
  if (TAG_DISPLAY_OVERRIDE[tagId]) return TAG_DISPLAY_OVERRIDE[tagId];
  return tagId.charAt(0).toUpperCase() + tagId.slice(1);
}

// ─── 护甲类型 ────────────────────────────────────────────────────────────────

/**
 * 中文护甲类型 → 英文护甲类型
 */
export const ARMOR_TYPE_EN: Record<string, string> = {
  "无护甲": "Unarmored",
  "轻甲": "Light",
  "中甲": "Medium",
  "重甲": "Heavy",
  "特殊": "Special",
};

/**
 * 护甲公式英文化
 */
export function armorDisplayFormula(formula: string, lang: string): string {
  if (lang !== 'en') return formula;
  return formula
    .replace(/（最大2）/g, '(max 2)')
    .replace(/（[\w]+）/g, '')
    .replace(/[（）]/g, '')
    .replace(/力量调整值/g, 'STR')
    .replace(/敏捷调整值/g, 'DEX')
    .replace(/体质调整值/g, 'CON')
    .replace(/智力调整值/g, 'INT')
    .replace(/感知调整值/g, 'WIS')
    .replace(/魅力调整值/g, 'CHA');
}
