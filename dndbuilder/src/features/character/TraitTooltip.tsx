import React, { useState, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { TraitItem, SubTrait } from "../../shared/types/types";
import traitKeywords from "../../../data/traitKeywords.json";

const KEYWORD_PATTERNS = traitKeywords as string[];
const HIGHLIGHT_RE = new RegExp(`(${KEYWORD_PATTERNS.join('|')})`, 'g');

const FVAR = "'CTGR' 0, 'wdth' 100";
const TOOLTIP_W = 220;
const tooltipBase: React.CSSProperties = {
  position: "fixed", width: TOOLTIP_W,
  backgroundColor: sheetColors.cardBg, borderRadius: "8px",
  border: "1px solid var(--color-border)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
  padding: "10px 12px", zIndex: 10000, fontVariationSettings: FVAR,
  pointerEvents: "auto",
};

interface TraitTooltipProps {
  trait: TraitItem | null;
  subTrait?: SubTrait | null;
  mouseY: number;
  cardLeft: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const TraitTooltip = React.memo(function TraitTooltip({
  trait, subTrait, mouseY: initY, cardLeft: initLeft,
  onMouseEnter, onMouseLeave,
}: TraitTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!tooltipRef.current) return;
    setPos({
      left: Math.max(4, initLeft - TOOLTIP_W - 8),
      top: Math.max(4, Math.min(initY, window.innerHeight - 200)),
    });
  }, [initY, initLeft]);

  const showSub = subTrait && (!!subTrait.description || !!subTrait.name);
  const showParent = trait && !showSub && (!!trait.description || !!trait.name);
  const visible = showParent || showSub;
  if (!visible) return ReactDOM.createPortal(<div style={{ ...tooltipBase, left: pos.left, top: pos.top, display: "none" }} />, document.body);

  return ReactDOM.createPortal(
    <div
      ref={tooltipRef}
      style={{ ...tooltipBase, left: pos.left, top: pos.top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSub ? (
        <>
          {/* 特质选项名称 */}
          <div style={{ fontSize: "14px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR, fontWeight: 600, marginBottom: 4 }}>
            {subTrait!.name}
          </div>
          {/* 特质选项描述 */}
          {subTrait!.description && (
            <div style={{ fontSize: "12px", lineHeight: 1.5, whiteSpace: "pre-wrap", color: sheetColors.textLighter, fontFamily: "var(--font-serif-regular)", fontVariationSettings: FVAR }}>
              {subTrait!.description.split(HIGHLIGHT_RE).map((part, i) =>
                i % 2 === 1
                  ? <span key={i} style={{ color: sheetColors.textDark, fontWeight: 600 }}>{part}</span>
                  : <span key={i}>{part}</span>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* 特质名称 */}
          <div style={{ fontSize: "14px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR, fontWeight: 600, marginBottom: 4 }}>
            {trait!.name}
          </div>
          {/* 标签 */}
          {trait!.tags && trait!.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 6 }}>
              {trait!.tags.map((tag, idx) => (
                <span key={idx} style={{ padding: "1px 6px", borderRadius: "2px", backgroundColor: sheetColors.hoverBg, fontSize: "11px", color: sheetColors.textDark, fontFamily: "var(--font-serif-regular)" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* 描述 */}
          {trait!.description && (
            <div style={{ fontSize: "12px", lineHeight: 1.5, whiteSpace: "pre-wrap", color: sheetColors.textLighter, fontFamily: "var(--font-serif-regular)", fontVariationSettings: FVAR }}>
              {trait!.description.split(HIGHLIGHT_RE).map((part, i) =>
                i % 2 === 1
                  ? <span key={i} style={{ color: sheetColors.textDark, fontWeight: 600 }}>{part}</span>
                  : <span key={i}>{part}</span>
              )}
            </div>
          )}
        </>
      )}
    </div>,
    document.body
  );
},
(prevProps, nextProps) =>
  prevProps.trait?.id === nextProps.trait?.id &&
  prevProps.trait?.name === nextProps.trait?.name &&
  prevProps.trait?.description === nextProps.trait?.description &&
  prevProps.trait?.tags === nextProps.trait?.tags &&
  prevProps.mouseY === nextProps.mouseY &&
  prevProps.cardLeft === nextProps.cardLeft);
