// ============================================================================
// IndexedDB 图片存储服务
// 用于持久化用户上传的徽记、角色形象等图片文件
// ============================================================================

const DB_NAME = "dndbuilder_images";
const DB_VERSION = 1;
const STORE_NAME = "images";

/** 生成唯一图片 ID */
export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** 判断字符串是否为图片 ID */
export function isImageId(value: string): boolean {
  return value.startsWith("img_");
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============================================================================
// 公开 API
// ============================================================================

/** 将 Blob 存入 IndexedDB，返回图片 ID */
export async function saveImage(blob: Blob): Promise<string> {
  const db = await openDB();
  const id = generateImageId();
  return new Promise<string>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ id, blob });
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
  });
}

/** 通过图片 ID 从 IndexedDB 读取 Blob */
export async function loadImage(id: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result?.blob ?? null);
    request.onerror = () => reject(request.error);
  });
}

/** 删除图片 */
export async function deleteImage(id: string): Promise<void> {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** 将图片 ID 转换为可用的 object URL（调用方需在适当时机 revoke） */
export async function imageIdToUrl(id: string): Promise<string> {
  const blob = await loadImage(id);
  if (!blob) throw new Error(`Image not found: ${id}`);
  return URL.createObjectURL(blob);
}
