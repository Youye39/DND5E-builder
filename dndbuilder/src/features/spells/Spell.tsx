import { useState, useRef } from "react";
import ButtonComponent from "../../shared/ui/ButtonComponent";
import type { SpellData } from "../../shared/types/types";
import { SpellDialog } from "./SpellDialog";
import SpellTip from "./SpellTip";
import { useInteractionHandler } from "../../shared/dialogs/useInteractionHandler";
const ABILITY_LABELS: Record<string, string> = { int: "智力", wis: "感知", cha: "魅力" };

interface SpellRowProps {
  spell?: SpellData;
  isCantrip?: boolean;
  onChange: (spell: SpellData) => void;
  onDelete?: () => void;
  isDragging?: boolean;
  onHover?: (e: React.MouseEvent) => void;
  onHoverLeave?: () => void;
}

export default function SpellRow({
  spell,
  isCantrip = false,
  onChange,
  onDelete,
  isDragging,
  onHover,
  onHoverLeave,
}: SpellRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUsage, setEditingUsage] = useState(false);
  const [concentrationFocused, setConcentrationFocused] = useState(false);
  const [tipPos, setTipPos] = useState({ mouseY: 0, cardLeft: 0 });

  const safe = spell ?? { id: "", name: "", description: "", isInnate: false };
  const enabled = !editingUsage && !isDragging;
  const tapTimestamp = useRef(0);

  const {
    tipVisible,
    onMouseEnter: hookMouseEnter,
    onMouseLeave: hookMouseLeave,
    onTipMouseEnter,
    onTipMouseLeave,
  } = useInteractionHandler({
    onShowTip: (pos) => setTipPos({ mouseY: pos.mouseY, cardLeft: pos.cardLeft }),
    enabled: enabled && !!safe.name,
  });

  const textLeft = isCantrip ? "left-[22px]" : "left-[30px]";
  const textWidth = isCantrip ? "" : "w-[306px]";
  const dividerLeft = isCantrip ? "left-[20px]" : "left-[30px]";
  const dividerViewBox = isCantrip ? "0 0 318 1" : "0 0 308 1";
  const dividerWidth = isCantrip ? "318" : "308";

  const handleUsageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    onChange({ ...safe, usage: e.target.value });
  };

  const handleUsageBlur = () => setEditingUsage(false);

  const handleUsageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") setEditingUsage(false);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    onHover?.(e);
    hookMouseEnter(e);
  };

  const handleMouseLeave = () => {
    onHoverLeave?.();
    hookMouseLeave();
  };

  const openDialog = () => {
    if (editingUsage || isDragging) return;
    const now = Date.now();
    if (now - tapTimestamp.current < 500) {
      tapTimestamp.current = 0;
      setIsDialogOpen(true);
    } else {
      tapTimestamp.current = now;
    }
  };

  return (
    <>
      <div
        className="bg-white h-[24px] overflow-clip relative w-[348px]"
        data-name={isCantrip ? "戏法" : "法术"}
      >
        {/* Button — 14×14 circle */}
        {!isCantrip && (
          <ButtonComponent
            className="absolute left-[12px] top-[5px] size-[14px] cursor-pointer"
            checked={safe.prepared ?? false}
            onChange={() => onChange({ ...safe, prepared: !safe.prepared })}
          />
        )}

        {/* Text area + tags */}
        <div
          className={`[word-break:break-word] absolute bg-white bottom-[3px] font-normal leading-[0] ${textLeft} overflow-clip top-0 right-[12px] ${textWidth}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* 法术名 — 可点击打开对话框 */}
          <div
            className="absolute inset-0 cursor-pointer hover:bg-sheet-hover-light/20"
            onClick={openDialog}
          >
            {safe.name ? (
              <div className="-translate-y-full absolute flex flex-col font-serif-regular-cjk h-[23px] justify-end left-[8px] text-[16px] text-black top-[22px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                <p className="leading-[normal]">
                  {safe.name}
                  {safe.ritual && <i>（仪式）</i>}
                </p>
              </div>
            ) : (
              <div className="-translate-y-full absolute flex flex-col font-serif-regular-cjk h-[23px] justify-end left-[8px] text-[16px] text-sheet-text-spell-placeholder top-[22px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                <p className="leading-[normal]"></p>
              </div>
            )}
          </div>

          {safe.isInnate && (
            <>
              <div
                className="-translate-y-1/2 absolute flex items-center text-[#595959] text-[12px] font-serif-regular leading-none top-[12px]"
                style={{ right: "36px", fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
              >
                {ABILITY_LABELS[safe.innateAbility ?? "int"]}
              </div>
              <div
                className="-translate-y-1/2 absolute flex items-center top-[12px]"
                style={{ right: "4px", fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                onClick={(e) => e.stopPropagation()}
              >
                {editingUsage ? (
                  <input
                    autoFocus
                    value={safe.usage ?? "1/1"}
                    onChange={handleUsageChange}
                    onBlur={handleUsageBlur}
                    onKeyDown={handleUsageKeyDown}
                    className="w-[36px] text-[12px] text-[#595959] font-serif-regular text-right leading-none bg-transparent border-none outline-none p-0 m-0 block"
                    style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                  />
                ) : (
                  <span
                    className="text-[#595959] text-[12px] font-serif-regular leading-none cursor-text hover:bg-sheet-hover-light/30 px-0.5"
                    onClick={(e) => { e.stopPropagation(); setEditingUsage(true); }}
                  >
                    {safe.usage ?? "1/1"}
                  </span>
                )}
              </div>
            </>
          )}

          {safe.concentration && (
            <div
              className={`-translate-y-1/2 absolute flex items-center text-[12px] font-serif-regular leading-none top-[12px] cursor-pointer rounded px-0.5 ${
                concentrationFocused ? "bg-gray-200" : ""
              }`}
              style={{
                right: safe.isInnate ? "74px" : "4px",
                color: "#595959",
                fontVariationSettings: '"CTGR" 0, "wdth" 100',
              }}
              onClick={(e) => { e.stopPropagation(); setConcentrationFocused(!concentrationFocused); }}
            >
              {concentrationFocused ? "专注中" : "专注"}
            </div>
          )}
        </div>

        {/* SpellTip */}
        {tipVisible && safe.name && (
          <SpellTip
            spell={safe}
            mouseY={tipPos.mouseY}
            cardLeft={tipPos.cardLeft}
            onChange={onChange}
            onMouseEnter={onTipMouseEnter}
            onMouseLeave={onTipMouseLeave}
          />
        )}

        {/* Bottom divider line */}

        {/* Bottom divider line */}
        <div className={`absolute ${dividerLeft} right-[10px] top-[23px] h-0`}>
          <div className="relative h-px">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox={dividerViewBox}>
              <line id="Line 2" stroke="var(--color-sheet-svg-stroke)" x2={dividerWidth} y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <SpellDialog
          open={isDialogOpen}
          initialSpell={spell}
          isCantrip={isCantrip}
          onSave={(s) => { onChange(s); setIsDialogOpen(false); }}
          onDelete={() => { onDelete?.(); setIsDialogOpen(false); }}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}

