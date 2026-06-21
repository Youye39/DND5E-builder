import React, { useState } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { SpellData } from "../../shared/types/types";
import spellDescriptionLabels from "../../../data/spellDescriptionLabels.json";

const DESCRIPTON_LABELS = spellDescriptionLabels as string[];
// 构建正则：同时匹配所有标签（如 "施法时间：|施法距离：|..."）
const LABEL_PATTERN = new RegExp(`(${DESCRIPTON_LABELS.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const SMALL: React.CSSProperties = { ...T, fontSize: "11px", color: sheetColors.textPlaceholder };

const TOOLTIP_W = 240;

const SCHOOL_LABELS: Record<string, string> = {
  abjuration: "防护", conjuration: "咒法", divination: "预言",
  enchantment: "附魔", evocation: "塑能", illusion: "幻术",
  necromancy: "死灵", transmutation: "变化",
};

interface SpellTipProps {
  spell: SpellData;
  mouseY: number;
  /** 卡片左侧边缘的 X 坐标 */
  cardLeft: number;
  /** 若传入则跳过内部定位计算，直接使用此 left 值 */
  overrideLeft?: number;
  /** 若传入则跳过内部定位计算，直接使用此 top 值 */
  overrideTop?: number;
  /** 覆盖宽度 */
  overrideWidth?: number;
  onChange?: (spell: SpellData) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function SpellTip({ spell, mouseY: initY, cardLeft: initLeft, overrideLeft, overrideTop, overrideWidth, onMouseEnter, onMouseLeave, onChange }: SpellTipProps) {
  const hasOverride = overrideLeft !== undefined && overrideTop !== undefined;
  const w = overrideWidth ?? TOOLTIP_W;
  const [pos] = useState(() => {
    if (hasOverride) return { left: overrideLeft, top: overrideTop };
    // 屏幕 < 600px → 下方弹出；否则左侧弹出
    if (window.innerWidth < 600) {
      return {
        left: initLeft,
        top: initY + 4,
      };
    }
    return {
      left: initLeft - TOOLTIP_W - 8,
      top: Math.max(4, Math.min(initY - 10, window.innerHeight - 200)),
    };
  });
  const [localUsage, setLocalUsage] = useState<string | null>(null);

  if (!spell.name && !spell.description && !spell.school) return null;

  const displayUsage = localUsage ?? spell.usage ?? "1/1";

  const commitUsage = () => {
    if (localUsage !== null && onChange) {
      onChange({ ...spell, usage: localUsage || "1/1" });
    }
    setLocalUsage(null);
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed", width: w,
        left: pos.left, top: pos.top,
        backgroundColor: sheetColors.cardBg, borderRadius: "8px",
        border: "1px solid var(--color-border)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
        padding: "10px 12px", zIndex: 9998, fontVariationSettings: FVAR,
        pointerEvents: "auto",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 法术名 + 天生施法使用次数（同行右对齐） */}
      {spell.name && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ ...T, fontWeight: 600, fontSize: "14px" }}>{spell.name}</span>
          {spell.isInnate && (
            <span style={{ fontSize: "12px", whiteSpace: "nowrap", marginLeft: 8, display: "inline-flex", alignItems: "baseline", gap: 2 }}>
              <span style={{ ...SMALL, fontSize: "12px" }}>
                {spell.innateAbility ? `${ABILITY_LABELS[spell.innateAbility] ?? spell.innateAbility} ` : ""}
              </span>
              <input
                type="text"
                value={displayUsage}
                onChange={(e) => setLocalUsage(e.target.value)}
                onBlur={commitUsage}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { (e.target as HTMLInputElement).blur(); } }}
                onFocus={() => { if (localUsage === null) setLocalUsage(spell.usage ?? "1/1"); }}
                style={{
                  width: 36, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                  padding: "0 2px", outline: "none", backgroundColor: "transparent",
                  fontSize: "12px", color: sheetColors.textLighter, textAlign: "center",
                  fontFamily: "var(--font-serif-regular)", fontVariationSettings: FVAR,
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </span>
          )}
        </div>
      )}

      {/* 学派 + 仪式/专注 */}
      {(spell.school || spell.ritual || spell.concentration) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {spell.school && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 2,
              padding: "1px 6px", borderRadius: "2px",
              backgroundColor: sheetColors.hoverBg, color: sheetColors.textDark,
              fontSize: "11px", fontFamily: "var(--font-serif-regular)", lineHeight: 1.4,
            }}>
              {SCHOOL_LABELS[spell.school] ?? spell.school}
            </span>
          )}
          {spell.ritual && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 2,
              padding: "1px 6px", borderRadius: "2px",
              backgroundColor: sheetColors.hoverBg, color: sheetColors.textDark,
              fontSize: "11px", fontFamily: "var(--font-serif-regular)", lineHeight: 1.4,
            }}>
              仪式
            </span>
          )}
          {spell.concentration && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 2,
              padding: "1px 6px", borderRadius: "2px",
              backgroundColor: sheetColors.hoverBg, color: sheetColors.textDark,
              fontSize: "11px", fontFamily: "var(--font-serif-regular)", lineHeight: 1.4,
            }}>
              专注
            </span>
          )}
        </div>
      )}

      {/* 描述（自动高亮标签字段） */}
      {spell.description && (
        <div style={{ fontSize: "12px", lineHeight: 1.5, whiteSpace: "pre-wrap", color: sheetColors.textLighter, fontFamily: "var(--font-serif-regular)", fontVariationSettings: FVAR }}>
          {spell.description.split(LABEL_PATTERN).map((part, i) =>
            DESCRIPTON_LABELS.includes(part)
              ? <span key={i} style={{ color: sheetColors.textDark, fontWeight: 600 }}>{part}</span>
              : <span key={i}>{part}</span>
          )}
        </div>
      )}

    </div>,
    document.body
  );
}

const ABILITY_LABELS: Record<string, string> = { int: "智力", wis: "感知", cha: "魅力" };
