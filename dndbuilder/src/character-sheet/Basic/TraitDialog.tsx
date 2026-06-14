import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { TraitItem } from "../../shared/types/types";
import traitTagPresets from "../../../data/traitTagPresets.json";
import ScrollArea from "../../shared/components/ScrollArea";

const TAG_PRESETS = traitTagPresets as string[];

interface TraitDialogProps {
  open: boolean;
  initialTrait?: TraitItem;
  onSave: (trait: TraitItem) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const LABEL: React.CSSProperties = {
  ...T, fontFamily: "var(--font-serif-medium)", fontSize: "13px", color: sheetColors.textPlaceholder, letterSpacing: "0.04em", marginBottom: 6, marginTop: 14,
};

export default function TraitDialog({ open, initialTrait, onSave, onDelete, onClose }: TraitDialogProps) {
  const [data, setData] = useState<TraitItem>(() => initialTrait ?? { id: "", name: "", usage: "", description: "", tags: [] });

  // 当 initialTrait 变化时同步
  React.useEffect(() => {
    if (open) {
      setData(initialTrait ?? { id: "", name: "", usage: "", description: "", tags: [] });
    }
  }, [initialTrait, open]);

  const set = (field: keyof TraitItem, val: string) => setData(prev => ({ ...prev, [field]: val }));

  const handleSave = () => {
    const name = data.name.trim() || "新特质";
    onSave({ ...data, name });
    onClose();
  };
  const handleDelete = () => { onDelete?.(); onClose(); };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "420px", maxHeight: "500px", display: "flex", flexDirection: "column",
          backgroundColor: sheetColors.cardBg, borderRadius: "10px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden", fontVariationSettings: FVAR,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}`, flexShrink: 0 }}>
          <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>
            编辑特质
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-xs font-medium"
                style={{ padding: "5px 12px", border: "1px solid var(--color-border)", borderRadius: "2px", fontFamily: "var(--font-serif-medium)", backgroundColor: sheetColors.cardBg, color: sheetColors.textDark, cursor: "pointer", transition: "all 0.1s" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = sheetColors.textDark; }}
              >
                删除
              </button>
            )}
            <button
              onClick={handleSave}
              className="text-xs font-medium"
              style={{ padding: "5px 16px", border: `1px solid ${sheetColors.buttonDarkBg}`, borderRadius: "2px", fontFamily: "var(--font-serif-medium)", backgroundColor: sheetColors.buttonDarkBg, color: sheetColors.textWhite, cursor: "pointer", transition: "background 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
            >
              保存
            </button>
          </div>
        </div>

        {/* Body */}
        <ScrollArea style={{ flex: 1, padding: "6px 16px 16px", minHeight: 0 }}>
          {/* 名称 + 使用次数 同一行 */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: "none", width: "240px" }}>
              <div style={LABEL}>名称</div>
              <input
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="名称"
                style={{
                  ...T, width: "100%", boxSizing: "border-box",
                  border: "1px solid var(--color-border)", borderRadius: "2px",
                  padding: "6px 10px", outline: "none", backgroundColor: sheetColors.cardBg,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = sheetColors.borderInput)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ ...LABEL, width: 60 }}>使用次数</div>
              <input
                type="text"
                value={data.usage ?? ""}
                onChange={(e) => set("usage", e.target.value)}
                placeholder="（可选）"
                style={{
                  ...T, width: 64, boxSizing: "border-box",
                  border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                  padding: "2px 4px", outline: "none", backgroundColor: "transparent",
                  textAlign: "center",
                }}
              />
            </div>
          </div>

          {/* 标签 */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", minHeight: 26, marginTop: 8 }}>
            {(data.tags ?? []).map((tag, idx) => (
              <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", borderRadius: "2px", backgroundColor: sheetColors.hoverBg, fontSize: "11px", color: sheetColors.textDark, fontFamily: "var(--font-serif-regular)" }}>
                {tag}
                <span
                  onClick={() => setData(prev => ({ ...prev, tags: (prev.tags ?? []).filter((_, i) => i !== idx) }))}
                  style={{ cursor: "pointer", marginLeft: 2, color: sheetColors.textLighter }}
                >
                  ×
                </span>
              </span>
            ))}
            <TagDropdown onAdd={(tag) => {
              if (tag && !(data.tags ?? []).includes(tag)) {
                setData(prev => ({ ...prev, tags: [...(prev.tags ?? []), tag] }));
              }
            }} />
          </div>

          <textarea
            value={data.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="特性描述"
            rows={6}
            style={{
              ...T, width: "100%", resize: "vertical", boxSizing: "border-box",
              border: `1px solid ${sheetColors.hoverBg}`, borderRadius: "2px", padding: "4px 8px", marginTop: 8,
              outline: "none", backgroundColor: sheetColors.cardBg, fontSize: "13px",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = sheetColors.hoverBg; }}
          />
        </ScrollArea>
      </div>
    </div>,
    document.body
  );
}

// ═══ 标签下拉选择器 ═════════════════════════════════════════════════════════

function TagDropdown({ onAdd }: { onAdd: (tag: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const add = (tag: string) => {
    onAdd(tag);
    setIsOpen(false);
    setCustomText("");
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{ ...T, fontSize: "11px", color: sheetColors.textPlaceholder, cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        + 标签
      </span>
      {isOpen && (
        <div
          style={{
            position: "absolute", top: "100%", left: 0, zIndex: 100,
            backgroundColor: sheetColors.cardBg,
            border: "1px solid var(--color-border)",
            borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            minWidth: "120px", marginTop: 2, padding: "4px 0",
          }}
        >
          {/* 自定义输入 */}
          <CustomTagInput onAdd={add} inputRef={inputRef} customText={customText} setCustomText={setCustomText} />
          {/* 预设项 */}
          {TAG_PRESETS.map((tag) => (
            <div
              key={tag}
              onClick={() => add(tag)}
              style={{
                padding: "4px 10px", cursor: "pointer",
                ...T, fontSize: "13px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomTagInput({
  onAdd, inputRef, customText, setCustomText,
}: {
  onAdd: (tag: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  customText: string;
  setCustomText: (v: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "center", backgroundColor: hovered ? sheetColors.hoverBg : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        ref={inputRef}
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && customText.trim()) {
            onAdd(customText.trim());
          }
        }}
        placeholder="自定义"
        style={{
          ...T, fontSize: "13px", border: "none", borderRadius: 0,
          padding: "4px 10px", outline: "none", width: 100,
          background: "transparent", color: sheetColors.textDark,
        }}
      />
      <span
        onClick={() => customText.trim() && onAdd(customText.trim())}
        style={{ ...T, fontSize: "13px", padding: "4px 6px", cursor: "pointer", color: sheetColors.textPlaceholder, flexShrink: 0 }}
      >
        ✓
      </span>
    </div>
  );
}
