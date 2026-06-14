// ============================================================================
// localStorage 持久化服务
// ============================================================================

import type { CharacterData, SaveArchive } from "./types";
import { createDefaultCharacter } from "./types";
import { deleteImage } from "./imageStore";

const STORAGE_KEY = "dndbuilder_archive";

// ============================================================================
// 存档管理器读写
// ============================================================================

function readArchive(): SaveArchive {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SaveArchive;
  } catch {
    // corrupted data — reset
  }
  const initial: SaveArchive = { currentId: null, saves: [] };
  writeArchive(initial);
  return initial;
}

function writeArchive(archive: SaveArchive): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));
  } catch (e) {
    console.error("Failed to write archive to localStorage", e);
  }
}

// ============================================================================
// 存档 CRUD
// ============================================================================

/** 获取所有存档列表（不含详细数据） */
export function getSaveList(): { id: string; name: string; updatedAt: number }[] {
  const archive = readArchive();
  return archive.saves.map((s) => ({ id: s.id, name: s.name, updatedAt: s.updatedAt }));
}

/** 获取当前选中的存档 ID */
export function getCurrentId(): string | null {
  return readArchive().currentId;
}

/** 获取指定 ID 的完整角色数据 */
export function getCharacter(id: string): CharacterData | null {
  const archive = readArchive();
  return archive.saves.find((s) => s.id === id) ?? null;
}

/** 获取当前角色数据 */
export function getCurrentCharacter(): CharacterData | null {
  const archive = readArchive();
  if (!archive.currentId) return null;
  return archive.saves.find((s) => s.id === archive.currentId) ?? null;
}

/** 保存/更新角色数据（自动保存） */
export function saveCharacter(data: CharacterData): void {
  const archive = readArchive();
  const idx = archive.saves.findIndex((s) => s.id === data.id);
  const updated = { ...data, updatedAt: Date.now() };

  if (idx >= 0) {
    archive.saves[idx] = updated;
  } else {
    archive.saves.push(updated);
  }

  archive.currentId = data.id;
  writeArchive(archive);
}

/** 创建新角色存档 */
export function createCharacter(name?: string): CharacterData {
  const char = createDefaultCharacter(name);
  saveCharacter(char);
  return char;
}

/** 切换当前角色 */
export function switchCharacter(id: string): CharacterData | null {
  const archive = readArchive();
  const char = archive.saves.find((s) => s.id === id);
  if (!char) return null;
  archive.currentId = id;
  writeArchive(archive);
  return char;
}

/** 删除角色存档（同时清理 IndexedDB 中的图片） */
export function deleteCharacter(id: string): void {
  const archive = readArchive();
  const removed = archive.saves.find((s) => s.id === id);
  archive.saves = archive.saves.filter((s) => s.id !== id);
  if (archive.currentId === id) {
    archive.currentId = archive.saves.length > 0 ? archive.saves[0].id : null;
  }
  writeArchive(archive);

  // 异步清理关联的图片
  if (removed) {
    const imageIds = [
      removed.characterInfo?.emblem,
      removed.characterInfo?.appearanceImageId,
    ].filter(Boolean);
    imageIds.forEach((imgId) => deleteImage(imgId).catch(() => {}));
  }
}

/** 重命名角色 */
export function renameCharacter(id: string, newName: string): void {
  const archive = readArchive();
  const char = archive.saves.find((s) => s.id === id);
  if (char) {
    char.name = newName;
    char.updatedAt = Date.now();
    writeArchive(archive);
  }
}

/** 复制角色存档 */
export function duplicateCharacter(id: string): CharacterData | null {
  const archive = readArchive();
  const original = archive.saves.find((s) => s.id === id);
  if (!original) return null;
  const copy = {
    ...JSON.parse(JSON.stringify(original)),
    id: `char_${Date.now()}`,
    name: `${original.name} (副本)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  archive.saves.push(copy);
  writeArchive(archive);
  return copy;
}
