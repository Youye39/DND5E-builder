// ============================================================================
// 自定义数据服务 —— 在 localStorage 中存储用户对 data/ 下 JSON 文件的修改
// ============================================================================

import defaultTraitKeywords from "../../../data/traitKeywords.json";
import defaultTraitTagPresets from "../../../data/traitTagPresets.json";
import defaultTools from "../../../data/tools.json";
import defaultWeaponPresets from "../../../data/weaponPresets.json";
import defaultWeaponTags from "../../../data/weaponTags.json";
import defaultLanguages from "../../../data/languages.json";

const STORAGE_PREFIX = "customData_";

/** 可编辑的数据文件列表 */
export const EDITABLE_FILES = [
  { key: "tools", label: "工具选项" },
  { key: "languages", label: "语言选项" },
  { key: "weaponPresets", label: "武器预设" },
  { key: "weaponTags", label: "武器标签预设" },
  { key: "traitKeywords", label: "特性关键词高亮" },
  { key: "traitTagPresets", label: "特质标签预设" },
] as const;

/** 默认文件内容映射（构建时导入的 JSON） */
const DEFAULT_CONTENT: Record<string, unknown> = {
  traitKeywords: defaultTraitKeywords,
  traitTagPresets: defaultTraitTagPresets,
  tools: defaultTools,
  weaponPresets: defaultWeaponPresets,
  weaponTags: defaultWeaponTags,
  languages: defaultLanguages,
};

/** 获取某文件的默认 JSON 内容（格式化后的字符串） */
export function getDefaultRaw(key: string): string {
  const data = DEFAULT_CONTENT[key];
  if (data === undefined) return "[]";
  return JSON.stringify(data, null, 2);
}

/** 从 localStorage 读取自定义内容，若不存在则返回 null */
export function loadCustomRaw(key: string): string | null {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    return null;
  }
}

/** 保存自定义内容到 localStorage */
export function saveCustomRaw(key: string, content: string): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, content);
  } catch (e) {
    console.error("保存自定义数据失败:", e);
  }
}

/** 删除自定义内容（恢复默认） */
export function removeCustom(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // ignore
  }
}

/** 检查是否有自定义内容 */
export function hasCustom(key: string): boolean {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
  } catch {
    return false;
  }
}

/**
 * 获取最终数据（含自定义覆盖）：
 * 返回解析后的 JS 值。组件可将此结果当作原本的 JSON import 使用。
 */
export function getCustomData<T = unknown>(key: string): T {
  const custom = loadCustomRaw(key);
  if (custom !== null) {
    try {
      return JSON.parse(custom) as T;
    } catch {
      // 解析失败则回退
    }
  }
  return DEFAULT_CONTENT[key] as T;
}
