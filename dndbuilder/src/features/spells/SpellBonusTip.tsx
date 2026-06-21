import React, { useState } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { ExtraBonus } from "../../shared/types/types";

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const TOOLTIP_W = 200;
const tooltipBase: React.CSSProperties = {
  position: "fixed", width: TOOLTIP_W,
  backgroundColor: sheetColors.cardBg, borderRadius: "8px",
  border: "1px solid var(--color-border)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  padding: "10px 12px", zIndex: 9998, fontVariationSettings: FVAR,
  pointerEvents: "auto",
};

interface SpellBonusTooltipProps {
  extras: ExtraBonus[];
  onUpdate: (extras: ExtraBonus[]) => void;
  mouseY: number;
  cardLeft: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocusLock?: () => void;
  onFocusUnlock?: () => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function SpellBonusTooltip({
  extras, onUpdate,
  mouseY: initY, cardLeft: initLeft,
  onMouseEnter, onMouseLeave,
  onFocusLock, onFocusUnlock,
}: SpellBonusTooltipProps) {
  const [pos] = useState(() => ({
    left: Math.max(8, Math.min(initLeft, window.innerWidth - TOOLTIP_W - 8)),
    top: initY,
  }));

  const updateValue = (id: string, value: string) => {
    onUpdate(extras.map((e) => e.id === id ? { ...e, value } : e));
  };

  const remove = (id: string) => {
    onUpdate(extras.filter((e) => e.id !== id));
  };

  const add = () => {
    onUpdate([...extras, { id: uid(), value: "", source: "" }]);
  };

  const handleInputEnter = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = sheetColors.borderLight;
    e.currentTarget.style.backgroundColor = sheetColors.cardBg;
  };
  const handleInputLeave = (e: React.MouseEvent<HTMLInputElement>) => {
    if (document.activeElement !== e.currentTarget) {
      e.currentTarget.style.borderColor = "transparent";
      e.currentTarget.style.backgroundColor = "transparent";
    }
  };
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = sheetColors.borderInput;
    e.currentTarget.style.backgroundColor = sheetColors.cardBg;
  };
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "transparent";
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return ReactDOM.createPortal(
    <div
      style={{ ...tooltipBase, left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 额外加值 */}
      <div style={{ ...T, fontFamily: "var(--font-serif-medium)", fontSize: "13px", color: sheetColors.textPlaceholder, letterSpacing: "0.04em", marginBottom: 6 }}>额外加值</div>
      {extras.map((eb) => (
        <div key={eb.id} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
          <input
            type="text"
            value={eb.value}
            placeholder="+1"
            onChange={(e) => updateValue(eb.id, e.target.value)}
            onMouseEnter={handleInputEnter}
            onMouseLeave={handleInputLeave}
            onFocus={(e) => { handleInputFocus(e); onFocusLock?.(); }}
            onBlur={(e) => { handleInputBlur(e); onFocusUnlock?.(); }}
            style={{
              ...T, width: 56,
              border: "1px solid transparent", borderRadius: "2px",
              padding: "2px 4px", outline: "none", backgroundColor: "transparent",
              transition: "border-color 0.15s, background 0.15s",
            }}
          />
          <input
            type="text"
            value={eb.source ?? ""}
            placeholder="来源"
            onChange={(e) => onUpdate(extras.map((ex) => ex.id === eb.id ? { ...ex, source: e.target.value } : ex))}
            onFocus={() => onFocusLock?.()}
            onBlur={() => onFocusUnlock?.()}
            style={{
              ...T, flex: 1, minWidth: 0,
              border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
              padding: "2px 4px", outline: "none", backgroundColor: "transparent",
            }}
          />
          <button
            onClick={() => remove(eb.id)}
            style={{ ...T, border: "none", background: "transparent", cursor: "pointer", padding: "0 4px", color: sheetColors.textLighter, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={add}
        style={{ ...T, color: sheetColors.textPlaceholder, border: `1px dashed ${sheetColors.iconDisabled}`,
          borderRadius: "2px", padding: "3px 10px", background: "transparent", cursor: "pointer", marginTop: 6,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = sheetColors.textSecondary; e.currentTarget.style.borderColor = sheetColors.textSecondary; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = sheetColors.textPlaceholder; e.currentTarget.style.borderColor = sheetColors.iconDisabled; }}
      >
        + 添加额外加值
      </button>
    </div>,
    document.body
  );
}
