import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import ScrollArea from "../../shared/components/ScrollArea";

export interface MultiSelectOption {
  id: string;
  label: string;
}

export interface OptionGroup {
  label: string;
  options: MultiSelectOption[];
}

interface MultiSelectDialogProps {
  open: boolean;
  title: string;
  groups: OptionGroup[];
  selected: string[];          // array of selected option ids
  onSave: (selected: string[]) => void;
  onClose: () => void;
}

export function MultiSelectDialog({
  open,
  title,
  groups,
  selected,
  onSave,
  onClose,
}: MultiSelectDialogProps) {
  const [draft, setDraft] = useState<string[]>([]);

  // Sync draft when dialog opens
  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  const toggle = (id: string) => {
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = (group: OptionGroup) => {
    const allIds = group.options.map((o) => o.id);
    const allSelected = allIds.every((id) => draft.includes(id));
    if (allSelected) {
      setDraft((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setDraft((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const handleClear = () => {
    onSave([]);
    onClose();
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "560px",
          maxHeight: "560px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: sheetColors.cardBg,
          borderRadius: "10px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden",
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: `1px solid ${sheetColors.hoverBg}`,
            flexShrink: 0,
          }}
        >
          <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>
            {title}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleClear}
              className="text-xs font-medium"
              style={{
                padding: "5px 12px",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                fontFamily: "var(--font-serif-medium)",
                backgroundColor: sheetColors.cardBg,
                color: sheetColors.textDark,
                cursor: "pointer",
                transition: "all 0.1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; }}
            >
              清空
            </button>
            <button
              onClick={handleSave}
              className="text-xs font-medium"
              style={{
                padding: "5px 16px",
                border: `1px solid ${sheetColors.buttonDarkBg}`,
                borderRadius: "2px",
                fontFamily: "var(--font-serif-medium)",
                backgroundColor: sheetColors.buttonDarkBg,
                color: sheetColors.textWhite,
                cursor: "pointer",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
            >
              保存
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <ScrollArea
          style={{ flex: 1, padding: "14px 16px 16px", minHeight: 0 }}
        >
          {groups.map((group, gi) => (
            <div key={group.label} style={{ marginBottom: gi < groups.length - 1 ? "16px" : 0 }}>
              {/* Group label + 全选 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div
                  className="text-xs font-medium"
                  style={{
                    fontFamily: "var(--font-serif-medium)",
                    color: sheetColors.textPlaceholder,
                    letterSpacing: "0.04em",
                  }}
                >
                  {group.label}
                </div>
                <button
                  onClick={() => toggleAll(group)}
                  className="text-[10px]"
                  style={{
                    fontFamily: "var(--font-serif-regular)",
                    padding: "2px 8px",
                    border: "none",
                    borderRadius: "2px",
                    backgroundColor: group.options.every((o) => draft.includes(o.id)) ? sheetColors.hoverBg : "transparent",
                    color: group.options.every((o) => draft.includes(o.id)) ? sheetColors.textSecondary : sheetColors.textPlaceholder,
                    cursor: "pointer",
                    transition: "all 0.1s",
                  }}
                >
                  全选
                </button>
              </div>
              {/* Option chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {group.options.map((opt) => {
                  const active = draft.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggle(opt.id)}
                      className="text-xs"
                      style={{
                        padding: "5px 12px",
                        fontFamily: "var(--font-serif-regular)",
                        borderRadius: "2px",
                        border: active ? `1px solid ${sheetColors.buttonDarkBg}` : "1px solid var(--color-border)",
                        backgroundColor: active ? sheetColors.buttonDarkBg : sheetColors.cardBg,
                        color: active ? sheetColors.textWhite : sheetColors.textDark,
                        cursor: "pointer",
                        transition: "all 0.1s",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = sheetColors.pageBg;
                          e.currentTarget.style.borderColor = sheetColors.borderLight;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = sheetColors.cardBg;
                          e.currentTarget.style.borderColor = "var(--color-border)";
                        }
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>,
    document.body
  );
}
