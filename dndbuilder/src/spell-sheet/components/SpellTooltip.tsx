import React, { useState } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { SpellData } from "../../shared/types/types";

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const SMALL: React.CSSProperties = { ...T, fontSize: "11px", color: sheetColors.textPlaceholder };
const MUTED: React.CSSProperties = { ...T, color: sheetColors.textLighter };

const TOOLTIP_W = 240;
const tooltipBase: React.CSSProperties = {
  position: "fixed", width: TOOLTIP_W,
  backgroundColor: sheetColors.cardBg, borderRadius: "8px",
  border: "1px solid var(--color-border)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  padding: "10px 12px", zIndex: 10000, fontVariationSettings: FVAR,
  pointerEvents: "auto",
};

interface SpellTooltipProps {
  spell: SpellData;
  mouseY: number;
  cardLeft: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ABILITY_LABELS: Record<string, string> = { int: "智力", wis: "感知", cha: "魅力" };

export const SpellTooltip = React.memo(function SpellTooltip({
  spell, mouseY: initY, cardLeft: initLeft,
  onMouseEnter, onMouseLeave,
}: SpellTooltipProps) {
  const [pos] = useState(() => ({ left: Math.max(8, initLeft - TOOLTIP_W - 12), top: initY - 40 }));

  return ReactDOM.createPortal(
    <div
      style={{ ...tooltipBase, left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ ...T, fontWeight: 600, fontSize: "14px", marginBottom: 4 }}>
        {spell.name}
        {spell.isInnate && spell.usage && (
          <span style={{ ...MUTED, fontSize: "11px", fontWeight: 400, marginLeft: 6 }}>
            ({spell.usage})
          </span>
        )}
      </div>

      {spell.description && (
        <div style={{ ...MUTED, fontSize: "11px", lineHeight: 1.4, marginBottom: 6 }}>
          {spell.description}
        </div>
      )}

      {spell.isInnate && (
        <div style={{ ...SMALL, marginBottom: 2 }}>
          天生施法 · {ABILITY_LABELS[spell.innateAbility ?? "int"] ?? spell.innateAbility}
        </div>
      )}

      {(spell.damageDice || spell.damageType) && (
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {spell.damageDice && (
            <div>
              <span style={SMALL}>伤害：</span>
              <span style={T}>
                {spell.damageDice}
                {spell.damageType ? ` ${spell.damageType}` : ""}
              </span>
            </div>
          )}
          {spell.attackBonus !== undefined && (
            <div>
              <span style={SMALL}>攻击：</span>
              <span style={T}>+{spell.attackBonus}</span>
            </div>
          )}
        </div>
      )}
    </div>,
    document.body
  );
});
