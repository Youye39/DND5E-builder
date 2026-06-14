import React, { useState, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { Item } from "../../shared/types/types";

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const TOOLTIP_W = 220;
const tooltipBase: React.CSSProperties = {
  position: "fixed", width: TOOLTIP_W,
  backgroundColor: sheetColors.cardBg, borderRadius: "8px",
  border: "1px solid var(--color-border)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  padding: "10px 12px", zIndex: 10000, fontVariationSettings: FVAR,
  pointerEvents: "auto",
};

interface ItemTooltipProps {
  item: Item;
  mouseY: number;
  cardLeft: number;
  /** 若传入则跳过内部定位计算，直接使用此 left 值（与 SpellTip 一致的定位方式） */
  overrideLeft?: number;
  /** 若传入则跳过内部定位计算，直接使用此 top 值 */
  overrideTop?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onChargeChange?: (featureId: string, note: string) => void;
  onFocusLock?: () => void;
  onFocusUnlock?: () => void;
}

export const ItemTooltip = React.memo(function ItemTooltip({
  item, mouseY: initY, cardLeft: initLeft,
  overrideLeft, overrideTop,
  onMouseEnter, onMouseLeave, onChargeChange, onFocusLock, onFocusUnlock,
}: ItemTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  // 若传入了 overrideLeft/overrideTop，直接用（与 SpellTip 一致的定位方式）
  const hasOverride = overrideLeft !== undefined && overrideTop !== undefined;
  useLayoutEffect(() => {
    if (hasOverride) return;
    if (!tooltipRef.current) return;
    const height = tooltipRef.current.offsetHeight;
    setPos({
      left: Math.max(8, Math.min(initLeft, window.innerWidth - TOOLTIP_W - 8)),
      top: initY - height - 2,
    });
  }, [initY, initLeft, hasOverride]);
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const [focusedFeatureId, setFocusedFeatureId] = useState<string | null>(null);

  if (item.features.length === 0 && !item.description) return null;

  const getNote = (f: typeof item.features[0]) =>
    localNotes[f.id] ?? f.note ?? "";

  const commitNote = (id: string) => {
    const val = localNotes[id];
    if (val !== undefined && onChargeChange) {
      onChargeChange(id, val);
      setLocalNotes((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  const displayLeft = overrideLeft ?? pos.left;
  const displayTop = overrideTop ?? pos.top;

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      style={{ ...tooltipBase, left: displayLeft, top: displayTop }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 物品名 */}
      <div style={{ ...T, fontWeight: 600, fontSize: "14px", marginBottom: 4 }}>
        {item.name}
      </div>

      {/* 描述 */}
      {item.description && (
        <div style={{ fontSize: "12px", lineHeight: 1.5, whiteSpace: "pre-wrap", color: sheetColors.textLighter, fontFamily: "var(--font-serif-regular)", fontVariationSettings: FVAR, marginBottom: 6 }}>{item.description}</div>
      )}

      {/* 特性列表 */}
      {item.features.length > 0 && (
        <>
          {item.features.map((f) => (
            <div key={f.id} style={{ marginBottom: 6 }}>
              {/* 特性名 (左) + usage (右) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {f.name && <span style={{ ...T, fontWeight: 600 }}>{f.name}</span>}
                <div style={{ flex: 1 }} />
                {getNote(f) || focusedFeatureId === f.id ? (
                  onChargeChange ? (
                    <input
                      type="text"
                      value={getNote(f)}
                      onChange={(e) => setLocalNotes((prev) => ({ ...prev, [f.id]: e.target.value }))}
                      onFocus={() => { setFocusedFeatureId(f.id); onFocusLock?.(); }}
                      onBlur={() => { setFocusedFeatureId(null); commitNote(f.id); onFocusUnlock?.(); }}
                      style={{ width: 36, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0, padding: "0 2px", outline: "none", backgroundColor: "transparent", fontSize: "12px", color: sheetColors.textLighter, textAlign: "center", fontFamily: "var(--font-serif-regular)", flexShrink: 0 }}
                    />
                  ) : (
                    <span style={{ fontSize: "12px", color: sheetColors.textLighter, fontFamily: "var(--font-serif-regular)", fontVariationSettings: FVAR, flexShrink: 0 }}>{f.note}</span>
                  )
                ) : null}
              </div>
              {/* 特性描述 */}
              {f.description && (
                <div style={{ fontSize: "12px", lineHeight: 1.5, whiteSpace: "pre-wrap", color: sheetColors.textLighter, fontFamily: "var(--font-serif-regular)", fontVariationSettings: FVAR, marginTop: 1 }}>{f.description}</div>
              )}
            </div>
          ))}
        </>
      )}
    </div>,
    document.body
  );
});
