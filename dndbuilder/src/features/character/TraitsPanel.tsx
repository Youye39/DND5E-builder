import { useState, useCallback, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import SectionContainer from "../../shared/ui/SectionContainer";
import ScrollArea from "../../shared/ui/ScrollArea";
import { useCharacter } from "../../shared/storage/CharacterContext";
import { createDefaultTrait } from "../../shared/types/types";
import type { TraitItem } from "../../shared/types/types";
import { sheetColors } from "../../shared/tokens/colors";
import TraitDialog from "./TraitDialog";
import { TraitTooltip } from "./TraitTooltip";
import { useInteractionHandler } from "../../shared/dialogs/useInteractionHandler";

interface TraitsPanelProps {
  className?: string;
}

export default function TraitsPanel({ className }: TraitsPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const traitList = character?.traitList ?? [];
  const setTraitList = (list: TraitItem[]) => updateCharacter({ traitList: list });

  const [inputText, setInputText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ left: 0, top: 0 });
  const [contextMenu, setContextMenu] = useState<{ index: number; x: number; y: number } | null>(null);
  const [subContextMenu, setSubContextMenu] = useState<{ parentIndex: number; subIndex: number; x: number; y: number } | null>(null);
  const [focusedUsageIndex, setFocusedUsageIndex] = useState<number | null>(null);
  const [focusedSubUsage, setFocusedSubUsage] = useState<{ parentIndex: number; subIndex: number } | null>(null);
  const [hoveredSubKey, setHoveredSubKey] = useState<{ parentIndex: number; subIndex: number } | null>(null);
  const [hoveredSubPos, setHoveredSubPos] = useState({ left: 0, top: 0 });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLCanvasElement | null>(null);

  const {
    onMouseEnter: hookMouseEnter,
    onMouseLeave: hookMouseLeave,
    onClick,
    onTipMouseEnter,
    cancelHide,
  } = useInteractionHandler({
    onOpenDialog: () => setDialogOpen(true),
    onHideTip: () => setHoveredIndex(null),
    tipDelay: 0,
    hideDelay: 150,
  });

  // ── 长按拖拽排序 ──
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragClientPos, setDragClientPos] = useState({ x: 0, y: 0 });
  const dragStartYRef = useRef(0);
  const traitsContainerRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const placeholderIndexRef = useRef<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const TRAIT_ITEM_H = 26;
  const TRAIT_GAP = 0;
  const TRAIT_SLOT = TRAIT_ITEM_H + TRAIT_GAP;

  const onTraitMouseDown = (e: React.MouseEvent, index: number) => {
    if ((e.target as HTMLElement).closest('input, textarea, [contenteditable]')) return;

    longPressTimer.current = setTimeout(() => {
      setDragIndex(index);
      setPlaceholderIndex(index);
      dragIndexRef.current = index;
      placeholderIndexRef.current = index;
      dragStartYRef.current = e.clientY;
      setDragY(0);
      setDragClientPos({ x: e.clientX, y: e.clientY });
    }, 100);

    const onMouseMove = (ev: MouseEvent) => {
      if (dragIndexRef.current === null) {
        if (Math.abs(ev.clientY - e.clientY) > 5) {
          if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
        }
        return;
      }
      const delta = ev.clientY - dragStartYRef.current;
      setDragY(delta);
      setDragClientPos({ x: ev.clientX, y: ev.clientY });

      if (traitsContainerRef.current) {
        const rect = traitsContainerRef.current.getBoundingClientRect();
        const offsetY = ev.clientY - rect.top + traitsContainerRef.current.scrollTop;
        // 每个条目占 (1 + 选项数) 个 slot，用 Math.round 算出鼠标所在的 raw slot
        const slotCounts = traitList.map(t => 1 + (t.subTraits?.length ?? 0));
        const totalSlots = slotCounts.reduce((a, b) => a + b, 0);
        const rawSlot = Math.round(offsetY / TRAIT_SLOT);
        const clampedSlot = Math.max(0, Math.min(rawSlot, totalSlots));
        // slot → 特质索引映射
        let cum = 0;
        let hitIdx = traitList.length;
        for (let j = 0; j < traitList.length; j++) {
          cum += slotCounts[j];
          if (clampedSlot < cum) { hitIdx = j; break; }
        }
        setPlaceholderIndex(hitIdx);
        placeholderIndexRef.current = hitIdx;
      }
    };

    const onMouseUp = () => {
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      const di = dragIndexRef.current;
      const pi = placeholderIndexRef.current;
      if (di !== null && pi !== null && di !== pi) {
        const next = [...traitList];
        const [item] = next.splice(di, 1);
        next.splice(pi, 0, item);
        setTraitList(next);
      }
      setDragIndex(null);
      setPlaceholderIndex(null);
      dragIndexRef.current = null;
      placeholderIndexRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const getTraitTransform = (index: number) => {
    if (dragIndex === null || placeholderIndex === null) return 'none';
    if (index === dragIndex) return `translateY(${dragY}px)`;
    if (
      index > Math.min(dragIndex, placeholderIndex) &&
      index <= Math.max(dragIndex, placeholderIndex)
    ) {
      const slotCount = 1 + (traitList[dragIndex]?.subTraits?.length ?? 0);
      return `translateY(${dragIndex < placeholderIndex ? -slotCount * TRAIT_SLOT : slotCount * TRAIT_SLOT}px)`;
    }
    return 'none';
  };

  // 用 Canvas 精确测量文本宽度
  const getTextPixelWidth = useCallback((text: string): number => {
    if (!text) return 24;
    if (!measureRef.current) {
      measureRef.current = document.createElement('canvas');
    }
    const ctx = measureRef.current.getContext('2d');
    if (!ctx) return text.length * 12 + 8;
    // 匹配实际 CSS font-family 以得到准确的测量结果
    ctx.font = '18px "Noto Serif", "Noto Sans SC", "Noto Sans CJK SC", serif';
    return Math.max(24, Math.ceil(ctx.measureText(text).width) + 6);
  }, []);

  // 迁移：旧的 traits 字符串 → traitList
  useEffect(() => {
    const oldTraits = character?.traits;
    if (oldTraits && oldTraits.trim() && (!character?.traitList || character.traitList.length === 0)) {
      const names = oldTraits.split(/[、,，\n]+/).map(s => s.trim()).filter(Boolean);
      if (names.length > 0) {
        updateCharacter({
          traitList: names.map(name => createDefaultTrait(name)),
          traits: "",
        });
      }
    }
  }, []);

  const commitInput = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    const names = text.split(/[、,，\n]+/).map(s => s.trim()).filter(Boolean);
    if (names.length === 0) return;
    const newTraits = names.map(name => createDefaultTrait(name));
    setTraitList([...traitList, ...newTraits]);
    setInputText("");
  }, [inputText, traitList, setTraitList]);

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitInput();
    }
  }, [commitInput]);

  const handleSave = (trait: TraitItem) => {
    const newList = [...traitList];
    if (editingIndex !== null) {
      newList[editingIndex] = trait;
    } else {
      newList.push(trait);
    }
    setTraitList(newList);
  };

  const handleDeleteTrait = useCallback((index: number) => {
    const newList = traitList.filter((_, i) => i !== index);
    setTraitList(newList);
    setContextMenu(null);
  }, [traitList, setTraitList]);

  const handleContextMenu = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ index, x: e.clientX, y: e.clientY });
  }, []);

  const handleSubContextMenu = useCallback((e: React.MouseEvent, parentIndex: number, subIndex: number) => {
    e.preventDefault();
    setSubContextMenu({ parentIndex, subIndex, x: e.clientX, y: e.clientY });
  }, []);

  const handleDeleteSubTrait = useCallback((parentIndex: number, subIndex: number) => {
    const newList = [...traitList];
    const parent = { ...newList[parentIndex] };
    parent.subTraits = (parent.subTraits ?? []).filter((_, si) => si !== subIndex);
    newList[parentIndex] = parent;
    setTraitList(newList);
    setSubContextMenu(null);
  }, [traitList, setTraitList]);

  // ── Tooltip ──
  const handleItemEnter = useCallback((i: number, e: React.MouseEvent) => {
    setHoveredIndex(i);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({ left: rect.left, top: rect.top });
    hookMouseEnter(e);
  }, [hookMouseEnter]);

  const handleSubItemEnter = useCallback((parentIndex: number, subIndex: number, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredSubPos({ left: rect.left, top: rect.top });
    setHoveredSubKey({ parentIndex, subIndex });
    hookMouseEnter(e);
  }, [hookMouseEnter]);

  const handleSubItemLeave = useCallback(() => {
    hookMouseLeave();
    setHoveredSubKey(null);
  }, [hookMouseLeave]);

  const hoveredTrait = hoveredIndex !== null ? traitList[hoveredIndex] ?? null : null;
  const hoveredSubTrait = hoveredSubKey !== null
    ? traitList[hoveredSubKey.parentIndex]?.subTraits?.[hoveredSubKey.subIndex] ?? null
    : null;

  return (
    <>
      <SectionContainer title="特性和特质" className={`${className || ""} w-[358px] h-[770px]`}>
        <ScrollArea className="absolute top-[9px] left-[9px] right-[9px] bottom-[33px] bg-sheet-content-bg rounded-[2px] overflow-x-hidden">
          <div ref={traitsContainerRef} className="pl-[8px] pt-[5px] pb-[5px] min-h-full select-none">
            {traitList.map((trait, i) => (
              <div
                key={trait.id}
                style={{
                  transform: i !== dragIndex ? getTraitTransform(i) : 'none',
                  opacity: i === dragIndex ? 0 : 1,
                  transition: dragIndex !== null && i !== dragIndex ? 'transform 0.15s ease' : 'none',
                }}
                onMouseDown={(e) => onTraitMouseDown(e, i)}
              >
                {/* 母特质 */}
                <div
                  className="flex items-baseline max-w-full leading-normal"
                >
                  <span
                  onClick={() => { setEditingIndex(i); onClick(); }}
                  onContextMenu={(e) => handleContextMenu(e, i)}
                  onMouseEnter={(e) => handleItemEnter(i, e)}
                  onMouseLeave={hookMouseLeave}
                  className="min-w-0 flex-1 font-serif-regular-cjk text-[18px] text-black leading-normal cursor-pointer hover:bg-sheet-hover-bg rounded-[1px] px-[2px] truncate"
                  >
                    {trait.name}
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-[18px]">
                    {trait.usage || focusedUsageIndex === i ? "（" : ""}
                    <input
                      type="text"
                      value={trait.usage ?? ""}
                      onChange={(e) => {
                        const newList = [...traitList];
                        newList[i] = { ...newList[i], usage: e.target.value || undefined };
                        setTraitList(newList);
                      }}
                      onFocus={() => setFocusedUsageIndex(i)}
                      onBlur={() => setFocusedUsageIndex(null)}
                      className="p-0 border-none bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{
                        fontVariationSettings: "'CTGR' 0, 'wdth' 100",
                        width: `${getTextPixelWidth(trait.usage ?? "")}px`,
                        font: "inherit",
                        color: "inherit",
                        lineHeight: "normal",
                        verticalAlign: "baseline",
                        maxWidth: "160px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {trait.usage || focusedUsageIndex === i ? "） " : ""}
                  </span>
                </div>
                {/* 特质选项 */}
                {(trait.subTraits ?? []).map((sub, si) => {
                  const isUsageFocused = focusedSubUsage?.parentIndex === i && focusedSubUsage?.subIndex === si;
                  return (
                    <div
                      key={sub.id}
                      className="flex items-baseline max-w-full leading-normal pl-[24px]"
                      onContextMenu={(e) => handleSubContextMenu(e, i, si)}
                    >
                      <span
                        onClick={() => { setEditingIndex(i); onClick(); }}
                        onMouseEnter={(e) => handleSubItemEnter(i, si, e)}
                        onMouseLeave={handleSubItemLeave}
                        className="min-w-0 flex-1 font-serif-regular-cjk text-[18px] text-black leading-normal cursor-pointer hover:bg-sheet-hover-bg rounded-[1px] px-[2px] truncate"
                      >
                        {sub.name}
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[18px] text-black">
                        {sub.usage || isUsageFocused ? "（" : ""}
                        <input
                          type="text"
                          value={sub.usage ?? ""}
                          onChange={(e) => {
                            const newList = [...traitList];
                            const parent = { ...newList[i] };
                            const newSubs = [...(parent.subTraits ?? [])];
                            newSubs[si] = { ...newSubs[si], usage: e.target.value || undefined };
                            parent.subTraits = newSubs;
                            newList[i] = parent;
                            setTraitList(newList);
                          }}
                          onFocus={() => setFocusedSubUsage({ parentIndex: i, subIndex: si })}
                          onBlur={() => setFocusedSubUsage(null)}
                          className="p-0 border-none bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{
                            fontVariationSettings: "'CTGR' 0, 'wdth' 100",
                            width: `${getTextPixelWidth(sub.usage ?? "")}px`,
                            font: "inherit",
                            color: "inherit",
                            lineHeight: "normal",
                            verticalAlign: "baseline",
                            maxWidth: "160px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {sub.usage || isUsageFocused ? "） " : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={commitInput}
              placeholder={traitList.length === 0 ? "输入特性" : "添加特性"}
              rows={1}
              className="block w-full bg-transparent border-none outline-none resize-none overflow-hidden font-serif-regular-cjk text-[18px] text-black placeholder:text-sheet-text-placeholder leading-normal"
              style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }}
            />
          </div>
        </ScrollArea>
      </SectionContainer>

      {/* Dialog */}
      {dialogOpen && (
        <TraitDialog
          open={dialogOpen}
          initialTrait={editingIndex !== null ? traitList[editingIndex] : undefined}
          onSave={handleSave}
          onDelete={editingIndex !== null ? () => handleDeleteTrait(editingIndex) : undefined}
          onClose={() => setDialogOpen(false)}
        />
      )}

      {/* Tooltip */}
      <TraitTooltip
        trait={hoveredTrait}
        subTrait={hoveredSubTrait}
        mouseY={hoveredSubTrait ? hoveredSubPos.top : hoverPos.top}
        cardLeft={hoveredSubTrait ? hoveredSubPos.left : hoverPos.left}
        onMouseEnter={hoveredSubTrait ? cancelHide : onTipMouseEnter}
        onMouseLeave={hoveredSubTrait ? handleSubItemLeave : hookMouseLeave}
      />

      {/* 拖拽浮动层 */}
      {dragIndex !== null && traitsContainerRef.current && (() => {
        const trait = traitList[dragIndex];
        const subCount = trait?.subTraits?.length ?? 0;
        const floatH = TRAIT_ITEM_H + subCount * TRAIT_ITEM_H;
        return ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              left: traitsContainerRef.current?.getBoundingClientRect().left ?? 0,
              top: dragClientPos.y - 13,
              width: 358,
              height: floatH,
              zIndex: 9999,
              pointerEvents: 'none',
              backgroundColor: 'white',
              borderRadius: '2px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              transform: 'scale(0.8)',
              transformOrigin: 'top left',
              padding: '0 8px',
              fontSize: '18px',
              fontFamily: 'var(--font-serif-regular-cjk)',
            }}
          >
            <div style={{ lineHeight: `${TRAIT_ITEM_H}px`, display: 'flex', alignItems: 'baseline' }}>
              <span className="truncate">{trait?.name ?? ''}</span>
            </div>
            {(trait?.subTraits ?? []).map(sub => (
              <div key={sub.id} style={{ lineHeight: `${TRAIT_ITEM_H}px`, display: 'flex', alignItems: 'baseline', paddingLeft: 28, color: '#666' }}>
                <span className="truncate">{sub.name}</span>
              </div>
            ))}
          </div>,
          document.body
        );
      })()}

      {/* 特质选项右键删除菜单 */}
      {subContextMenu && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setSubContextMenu(null)}
          onContextMenu={(e) => { e.preventDefault(); setSubContextMenu(null); }}
        >
          <div
            style={{
              position: "fixed",
              left: subContextMenu.x,
              top: subContextMenu.y,
              backgroundColor: sheetColors.cardBg,
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              minWidth: "100px",
              zIndex: 10000,
              padding: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => handleDeleteSubTrait(subContextMenu.parentIndex, subContextMenu.subIndex)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                color: sheetColors.textDark,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              删除
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 右键删除菜单 */}
      {contextMenu && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setContextMenu(null)}
          onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
        >
          <div
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              backgroundColor: sheetColors.cardBg,
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              minWidth: "100px",
              zIndex: 10000,
              padding: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => handleDeleteTrait(contextMenu.index)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                color: sheetColors.textDark,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              删除
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
