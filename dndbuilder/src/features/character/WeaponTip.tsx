import React, { useState } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { Item } from "../../shared/types/types";

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const SMALL: React.CSSProperties = { ...T, fontSize: "12px", color: sheetColors.textPlaceholder };
// const MUTED: React.CSSProperties = { ...T, color: sheetColors.textLighter };
const LABEL: React.CSSProperties = { ...SMALL, fontFamily: "var(--font-serif-medium)", letterSpacing: "0.04em" };

const TOOLTIP_W = 220;
const tooltipBase: React.CSSProperties = {
  position: "fixed", width: TOOLTIP_W,
  backgroundColor: sheetColors.cardBg, borderRadius: "8px",
  border: "1px solid var(--color-border)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  padding: "10px 12px", zIndex: 9998, fontVariationSettings: FVAR,
  pointerEvents: "auto",
};

interface TooltipProps {
  weapon: Item;
  mouseY: number;
  cardLeft: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface DamageTooltipProps extends TooltipProps {
  /** 计算后的伤害加值字符串，如 "+5" 或 "-1" */
  computedMod?: string;
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
      <div style={{ ...T, fontWeight: 600, fontSize: "14px", marginBottom: 6 }}>攻击</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={LABEL}>属性</span>
        <span style={T}>{ATTRIBUTE_LABELS[weapon.attackAttr ?? "str"] || weapon.attackAttr}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={LABEL}>熟练</span>
        <span style={T}>{weapon.proficient ? "是" : "否"}</span>
      </div>
      {weapon.extraAttackBonus && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={LABEL}>额外加值</span>
          <span style={T}>{weapon.extraAttackBonus}</span>
        </div>
      )}
    </div>,
    document.body
  );
}

// ─── Damage Tooltip ───────────────────────────────────────────────────────────

export function DamageTooltip({ weapon, mouseY: initY, cardLeft: initLeft, onMouseEnter, onMouseLeave, computedMod }: DamageTooltipProps) {
  const [pos] = useState(() => ({ left: initLeft - 20, top: initY + 12 }));
  return ReactDOM.createPortal(
    <div
      style={{ ...tooltipBase, left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ ...T, fontWeight: 600, fontSize: "14px", marginBottom: 6 }}>伤害</div>
      <div style={LABEL}>基础</div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 12, marginBottom: 4 }}>
        <span style={T}>
          {weapon.damageDice || "—"}
          {computedMod ? ` ${computedMod.startsWith("+") || computedMod.startsWith("-") ? "" : "+"}${computedMod}` : ""}
        </span>
        <span style={T}>{weapon.damageType || "—"}</span>
      </div>
      {(weapon.extraDamages ?? []).length > 0 && (
        <div>
          <div style={LABEL}>额外</div>
          {(weapon.extraDamages ?? []).map((ed) => (
            <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", paddingLeft: 12, marginBottom: 2 }}>
              <span style={T}>{ed.dice}</span>
              <span style={T}>{ed.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
