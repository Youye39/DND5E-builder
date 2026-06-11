import React, { useState } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { WeaponData } from "../../../data/weaponState";

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

interface TooltipProps {
  weapon: WeaponData;
  mouseY: number;
  cardLeft: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// ─── Hit Tooltip ──────────────────────────────────────────────────────────────

const ATTRIBUTE_LABELS: Record<string, string> = { str: "力量", dex: "敏捷", custom: "自定义" };

export function HitTooltip({ weapon, mouseY: initY, cardLeft: initLeft, onMouseEnter, onMouseLeave }: TooltipProps) {
  const [pos] = useState(() => ({ left: initLeft - 20, top: initY + 12 }));
  return ReactDOM.createPortal(
    <div
      style={{ ...tooltipBase, left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ ...T, fontWeight: 600, fontSize: "13px", marginBottom: 6 }}>攻击</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={SMALL}>属性</span>
        <span style={T}>{ATTRIBUTE_LABELS[weapon.attackAttr] || weapon.attackAttr}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={SMALL}>熟练</span>
        <span style={T}>{weapon.proficient ? "是" : "否"}</span>
      </div>
      {weapon.extraAttackBonus && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={SMALL}>额外加值</span>
          <span style={T}>{weapon.extraAttackBonus}</span>
        </div>
      )}
    </div>,
    document.body
  );
}

// ─── Damage Tooltip ───────────────────────────────────────────────────────────

export function DamageTooltip({ weapon, mouseY: initY, cardLeft: initLeft, onMouseEnter, onMouseLeave }: TooltipProps) {
  const [pos] = useState(() => ({ left: initLeft - 20, top: initY + 12 }));
  return ReactDOM.createPortal(
    <div
      style={{ ...tooltipBase, left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ ...T, fontWeight: 600, fontSize: "13px", marginBottom: 6 }}>伤害</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={SMALL}>基础</span>
        <span style={T}>{weapon.damageDice || "—"} + {weapon.damageMod || "0"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={SMALL}>类型</span>
        <span style={T}>{weapon.damageType}</span>
      </div>
      {weapon.extraDamages.length > 0 && (
        <div>
          <div style={{ ...SMALL, marginBottom: 3 }}>额外</div>
          {weapon.extraDamages.map((ed) => (
            <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={MUTED}>{ed.type}</span>
              <span style={T}>{ed.dice}</span>
            </div>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
