// ============================================================================
// 自定义项管理对话框
// ============================================================================

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../shared/dialogs/dialog";
import { sheetColors } from "../shared/tokens/colors";
import {
  EDITABLE_FILES,
  getDefaultRaw,
  loadCustomRaw,
  saveCustomRaw,
  removeCustom,
  hasCustom,
} from "../shared/storage/customDataService";

interface CustomItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomItemDialog({ open, onOpenChange }: CustomItemDialogProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  // 打开时选中第一个并加载内容
  useEffect(() => {
    if (open) {
      const first = EDITABLE_FILES[0]?.key ?? null;
      setSelected(first);
      setSaved(false);
      if (first) loadFile(first);
    }
  }, [open]);

  const loadFile = (key: string) => {
    const custom = loadCustomRaw(key);
    if (custom !== null) {
      setContent(custom);
    } else {
      setContent(getDefaultRaw(key));
    }
  };

  const handleSelect = (key: string) => {
    setSelected(key);
    setSaved(false);
    loadFile(key);
  };

  const handleSave = () => {
    if (!selected) return;
    try {
      JSON.parse(content); // 验证 JSON 合法性
      saveCustomRaw(selected, content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("JSON 格式错误，请检查后重试。");
    }
  };

  const handleRestore = () => {
    if (!selected) return;
    removeCustom(selected);
    setContent(getDefaultRaw(selected));
    setSaved(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!rounded-[10px] !p-5"
        style={{ borderColor: sheetColors.borderPlaceholder, maxWidth: "640px" }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-base"
            style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}
          >
            自定义项管理
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4" style={{ minHeight: "300px" }}>
          {/* 左侧文件列表 */}
          <div
            className="w-[160px] shrink-0 space-y-1 overflow-y-auto max-h-[55vh] group/scroll"
            style={{ scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}
          >
            <style>{`
              .group\\/scroll::-webkit-scrollbar { width: 3px; display: block; }
              .group\\/scroll::-webkit-scrollbar-track { background: transparent; }
              .group\\/scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 1.5px; }
              .group\\/scroll:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); }
              .editor-scroll::-webkit-scrollbar { width: 6px; display: block; }
              .editor-scroll::-webkit-scrollbar-track { background: transparent; }
              .editor-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
              .editor-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.35); }
            `}</style>
            {EDITABLE_FILES.map((f) => (
              <div
                key={f.key}
                onClick={() => handleSelect(f.key)}
                className="rounded-[2px] px-3 py-2 cursor-pointer transition-colors"
                style={{
                  fontSize: "13px",
                  backgroundColor: selected === f.key ? sheetColors.contentBg : "transparent",
                  color: sheetColors.textDark,
                  fontFamily: "var(--font-serif-regular)",
                }}
                onMouseEnter={(e) => {
                  if (selected !== f.key) e.currentTarget.style.backgroundColor = sheetColors.contentBg;
                }}
                onMouseLeave={(e) => {
                  if (selected !== f.key) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{f.label}</span>
                  {hasCustom(f.key) && (
                    <span
                      className="shrink-0 ml-1 px-1.5 py-0.5 rounded-[2px] text-[10px]"
                      style={{
                        backgroundColor: sheetColors.buttonDarkBg,
                        color: sheetColors.textWhite,
                        fontFamily: "var(--font-serif-regular)",
                      }}
                    >
                      自定义
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 右侧编辑区 */}
          <div className="flex-1 flex flex-col min-w-0">
            {selected ? (
              <>
                <div className="flex items-center justify-between" style={{ paddingTop: "0px", marginBottom: "8px" }}>
                  <div />
                  <div className="flex gap-2">
                    <button
                      onClick={handleRestore}
                      className="rounded-[2px] text-xs cursor-pointer transition-colors"
                      style={{
                        padding: "5px 12px",
                        border: "1px solid var(--color-border)",
                        color: sheetColors.textDark,
                        fontFamily: "var(--font-serif-medium)",
                        backgroundColor: sheetColors.cardBg,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.color = "#000"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = sheetColors.textDark; }}
                    >
                      恢复默认
                    </button>
                    <button
                      onClick={handleSave}
                      className="rounded-[2px] text-white text-xs cursor-pointer transition-colors"
                      style={{
                        padding: "5px 16px",
                        backgroundColor: sheetColors.buttonDarkBg,
                        fontFamily: "var(--font-serif-medium)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
                    >
                      {saved ? "已保存" : "保存"}
                    </button>
                  </div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border rounded-[2px] p-2 outline-none resize-none editor-scroll"
                  style={{
                    flex: 1,
                    minHeight: "250px",
                    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    borderColor: sheetColors.borderLight,
                    color: sheetColors.textDark,
                    backgroundColor: sheetColors.cardBg,
                    scrollbarWidth: "thin",
                  }}
                  spellCheck={false}
                />
              </>
            ) : (
              <div
                className="flex items-center justify-center h-full text-sm"
                style={{ color: sheetColors.textPlaceholder, fontFamily: "var(--font-serif-regular)" }}
              >
                请从左侧选择一个文件
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
