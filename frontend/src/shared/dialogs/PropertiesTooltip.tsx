import React, { useState } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../tokens/colors";
import type { WeaponData } from "../../../data/weaponState";
import weaponTags from "../../../data/weaponTags.json";

interface WeaponTag { id: string; label: string }
const TAGS = weaponTags as WeaponTag[];

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const SMALL: React.CSSProperties = { ...T, fontSize: "11px", color: sheetColors.textPlaceholder };
const MUTED: React.CSSProperties = { ...T, color: sheetColors.textLighter };

const TOOLTIP_W = 220;
const tooltipBase: React.CSSProperties = {
  position: "fixed", width: TOOLTIP_W,
  backgroundColor: sheetColors.cardBg, borderRadius: "8px",
  border: "1px solid var(--color-border)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  padding: "10px 12px", zIndex: 10000, fontVariationSettings: FVAR,
  pointerEvents: "auto",
};

interface PropertiesTooltipProps {
  weapon: WeaponData;
  mouseY: number;
  cardLeft: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onChargeChange?: (propertyId: string, chargeText: string) => void;
  onFocusLock?: () => void;
  onFocusUnlock?: () => void;
}

export const PropertiesTooltip = React.memo(function PropertiesTooltip({
  weapon, mouseY: initY, cardLeft: initLeft,
  onMouseEnter, onMouseLeave, onChargeChange, onFocusLock, onFocusUnlock,
}: PropertiesTooltipProps) {
  const [pos] = useState(() => ({ left: Math.max(8, initLeft - TOOLTIP_W - 12), top: initY - 40 }));
  const [localCharges, setLocalCharges] = useState<Record<string, string>>({});

  if (weapon.extraProperties.length === 0) return null;

  const getCharge = (ep: typeof weapon.extraProperties[0]) =>
    localCharges[ep.id] ?? ep.chargeText ?? "3/3";

  const commitCharge = (id: string) => {
    const val = localCharges[id];
    if (val !== undefined && onChargeChange) {
      onChargeChange(id, val);
      setLocalCharges((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{ ...tooltipBase, left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ ...T, fontWeight: 600, fontSize: "14px", marginBottom: 4 }}>{weapon.name}</div>

      {weapon.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 6 }}>
          {weapon.tags.map((tagId) => {
            const tag = TAGS.find((t) => t.id === tagId);
            return tag ? (
              <span key={tagId} style={{ padding: "1px 5px", borderRadius: "2px", backgroundColor: sheetColors.hoverBg, color: sheetColors.textDark, fontSize: "10px", fontFamily: "var(--font-serif-regular)" }}>
                {tag.label}
              </span>
            ) : null;
          })}
        </div>
      )}

      <div style={{ ...SMALL, marginBottom: 4 }}>特性</div>
      {weapon.extraProperties.map((ep) => (
        <div key={ep.id} style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {ep.name && <span style={{ ...T, fontWeight: 600, fontSize: "12px" }}>{ep.name}</span>}
            {onChargeChange ? (
              <input
                type="text"
                value={getCharge(ep)}
                onChange={(e) => setLocalCharges((prev) => ({ ...prev, [ep.id]: e.target.value }))}
                onBlur={() => { commitCharge(ep.id); onFocusUnlock?.(); }}
                onFocus={() => onFocusLock?.()}
                style={{ width: 36, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0, padding: "0 2px", outline: "none", backgroundColor: "transparent", fontSize: "10px", color: sheetColors.textLighter, textAlign: "center", fontFamily: "var(--font-serif-regular)" }}
              />
            ) : (
              ep.chargeText && <span style={{ ...MUTED, fontSize: "10px" }}>({ep.chargeText})</span>
            )}
          </div>
          {ep.description && (
            <div style={{ ...MUTED, fontSize: "11px", lineHeight: 1.4, marginTop: 1 }}>{ep.description}</div>
          )}
        </div>
      ))}
    </div>,
    document.body
  );
});
