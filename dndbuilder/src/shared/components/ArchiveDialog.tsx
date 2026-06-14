// ============================================================================
// 存档管理对话框（优化版）
// ============================================================================

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../dialogs/dialog";
import { useCharacter } from "../storage/CharacterContext";
import {
  deleteCharacter as deleteStorageCharacter,
  renameCharacter,
  duplicateCharacter,
} from "../storage/storageService";
import { sheetColors } from "../../shared/tokens/colors";

interface ArchiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArchiveDialog({ open, onOpenChange }: ArchiveDialogProps) {
  const {
    saveList,
    currentId,
    switchCharacter,
    newCharacter,
    refreshSaveList,
  } = useCharacter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // 每次打开时刷新列表
  useEffect(() => {
    if (open) refreshSaveList();
  }, [open, refreshSaveList]);

  const handleSwitch = (id: string) => {
    switchCharacter(id);
    onOpenChange(false);
  };

  const handleNew = () => {
    newCharacter(`角色 ${saveList.length + 1}`);
    onOpenChange(false);
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleFinishRename = () => {
    if (editingId && editName.trim()) {
      renameCharacter(editingId, editName.trim());
      refreshSaveList();
    }
    setEditingId(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateCharacter(id);
    refreshSaveList();
  };

  const handleDelete = (id: string) => {
    deleteStorageCharacter(id);
    setConfirmDelete(null);
    refreshSaveList();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md !rounded-[10px] !p-5"
        style={{ borderColor: sheetColors.borderPlaceholder }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-base"
            style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}
          >
            存档管理
          </DialogTitle>
        </DialogHeader>

        {/* 滚动区域：右侧留出空间避免挤压 */}
        <div
          className="w-[485px] space-y-2 pr-1 max-h-[55vh] overflow-y-scroll group/scroll"
        >
          {saveList.length === 0 && (
            <p
              className="text-sm text-center py-4"
              style={{ color: sheetColors.textPlaceholder, fontFamily: "var(--font-serif-regular)" }}
            >
              暂无存档
            </p>
          )}

          {saveList.map((save) => {
            const isCurrent = save.id === currentId;
            const isEditing = editingId === save.id;

            return (
              <div
                key={save.id}
                className="rounded-[2px] border px-3.5 py-2.5 transition-colors cursor-pointer"
                style={{
                  backgroundColor: isCurrent
                    ? sheetColors.contentBg
                    : sheetColors.cardBg,
                  borderColor: sheetColors.borderLight,
                }}
                onClick={() => !isEditing && !isCurrent && handleSwitch(save.id)}
                onMouseEnter={(e) => {
                  if (!isCurrent && !isEditing) e.currentTarget.style.backgroundColor = sheetColors.contentBg;
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent && !isEditing) e.currentTarget.style.backgroundColor = sheetColors.cardBg;
                }}
              >
                <div className="flex items-center justify-between">
                  {/* 名称 + 时间 */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleFinishRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleFinishRename();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="w-full bg-transparent outline-none border-0 p-0 leading-[16px] h-[16px]"
                        style={{
                          fontSize: "13px",
                          fontFamily: "var(--font-serif-medium)",
                          color: sheetColors.textPrimary,
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(save.id, save.name);
                        }}
                      >
                        <span
                          className="truncate"
                          style={{
                            fontSize: "13px",
                            fontFamily: "var(--font-serif-medium)",
                            color: sheetColors.textPrimary,
                          }}
                        >
                          {save.name}
                        </span>
                        {isCurrent && (
                          <span
                            className="px-1.5 py-0.5 rounded-[2px]"
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-serif-regular)",
                              backgroundColor: sheetColors.buttonDarkBg,
                              color: sheetColors.textWhite,
                            }}
                          >
                            当前
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className="mt-0.5"
                      style={{
                        fontSize: "11px",
                        fontFamily: "var(--font-serif-regular)",
                        color: sheetColors.textPlaceholder,
                      }}
                    >
                      {new Date(save.updatedAt).toLocaleString("zh-CN")}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div
                    className="flex items-center gap-1 ml-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {confirmDelete === save.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(save.id)}
                          className="px-2 py-1 rounded-[2px] text-white"
                          style={{
                            fontSize: "12px",
                            fontFamily: "var(--font-serif-medium)",
                            backgroundColor: "black",
                          }}
                        >
                          确认删除
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 rounded-[2px]"
                          style={{
                            fontSize: "12px",
                            fontFamily: "var(--font-serif-medium)",
                            backgroundColor: sheetColors.contentBg,
                            color: sheetColors.textMedium,
                          }}
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleDuplicate(save.id)}
                          className="px-2 py-1 rounded-[2px]"
                          style={{
                            fontSize: "12px",
                            fontFamily: "var(--font-serif-regular)",
                            color: sheetColors.textPlaceholder,
                          }}
                        >
                          复制
                        </button>
                        <button
                          onClick={() => setConfirmDelete(save.id)}
                          className="px-2 py-1 rounded-[2px]"
                          style={{
                            fontSize: "12px",
                            fontFamily: "var(--font-serif-regular)",
                            color: sheetColors.textPlaceholder,
                          }}
                        >
                          删除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 新建按钮 */}
          <button
            onClick={handleNew}
            className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-[2px] border border-dashed transition-colors cursor-pointer"
            style={{
              borderColor: sheetColors.borderLight,
              backgroundColor: sheetColors.cardBg,
            }}
          >
            <span
              className="leading-none"
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-serif-regular)",
                color: sheetColors.textPlaceholder,
              }}
            >
              +
            </span>
            <span
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-serif-regular)",
                color: sheetColors.textLighter,
              }}
            >
              新建角色存档
            </span>
          </button>
        </div>

        {/* 细滑轨 — 匹配 ScrollArea 组件样式 */}
        <style>{`
          .group\\/scroll::-webkit-scrollbar { width: 3px; display: block; }
          .group\\/scroll::-webkit-scrollbar-track { background: transparent; }
          .group\\/scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 1.5px; }
          .group\\/scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .group\\/scroll:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); }
          .group\\/scroll:hover { scrollbar-color: rgba(0,0,0,0.3) transparent; }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
