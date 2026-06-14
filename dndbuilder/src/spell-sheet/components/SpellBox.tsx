import { useRef, useCallback, useState, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import svgPaths from "../../assets/flag";
import Cantrip from "./Cantrip";
import SpellRow from "./Spell";
import SlotIndicator from "./SlotIndicator";
import { SpellDialog } from "./SpellDialog";
import type { SpellData } from "../../shared/types/types";
import { createDefaultSpell } from "../../shared/types/types";

interface SpellBoxProps {
  level: number;
  isCantrip?: boolean;
  spellCount: number;
  totalSlots?: number;
  initialHeight?: number;
  isLastInColumn?: boolean;

  // 新增：法术数据
  spells?: SpellData[];
  onSpellsChange?: (spells: SpellData[]) => void;

  // ⭐ 修改：onResize 返回 { approvedHeight, maxAllowedHeight }
  onResize?: (
    newHeight: number
  ) =>
    | {
        approvedHeight: number;
        maxAllowedHeight: number;
      }
    | void;

  /** 添加新法术时的回调（由 SpellSheet 处理 spellCount 递增） */
  onAddSpell?: (spell: SpellData) => void;
}

const ROW_HEIGHT = 34;
const BASE_HEIGHT = 53;
const MIN_ROWS = 1;

function snapHeight(rawHeight: number): number {
  const n = Math.round((rawHeight - BASE_HEIGHT) / ROW_HEIGHT);
  const clamped = Math.max(MIN_ROWS, n);
  return BASE_HEIGHT + clamped * ROW_HEIGHT;
}

export default function SpellBox({
  level,
  isCantrip = false,
  spellCount,
  totalSlots = 4,
  initialHeight,
  isLastInColumn = false,
  onResize,
  spells: externalSpells,
  onSpellsChange,
  onAddSpell,
}: SpellBoxProps) {
  // 内部 spells 状态（用于未受控模式）
  const safeSpells = externalSpells ?? [];
  
  // 添加法术对话框
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleAddSpell = (spell: SpellData) => {
    onAddSpell?.(spell);
    setAddDialogOpen(false);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleSpellChange = (index: number, spell: SpellData) => {
    if (!onSpellsChange) return;
    const next = [...safeSpells];
    // 确保数组够长
    while (next.length <= index) {
      next.push(createDefaultSpell());
    }
    next[index] = spell;
    onSpellsChange(next);
  };
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // ⭐ 新增：父组件允许的最大高度（实时 clamp）
  const maxAllowedRef = useRef<number>(Infinity);

  const [dragHeight, setDragHeight] = useState<number | null>(null);

  // ── 拖拽排序（参考标准实现） ──
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragClientPos, setDragClientPos] = useState({ x: 0, y: 0 });
  const dragStartYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const placeholderIndexRef = useRef<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ITEM_H = 24;
  const ITEM_GAP = 10;
  const SLOT = ITEM_H + ITEM_GAP;

  const onMouseDown = (e: React.MouseEvent, index: number) => {
    if ((e.target as HTMLElement).closest('button, input, [contenteditable]')) return;

    // 100ms 后进入拖拽模式
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

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetY = ev.clientY - rect.top + containerRef.current.scrollTop;
        const total = Math.max(spellCount, safeSpells.length);
        const newIndex = Math.round(offsetY / SLOT);
        const clamped = Math.max(0, Math.min(newIndex, total - 1));
        setPlaceholderIndex(clamped);
        placeholderIndexRef.current = clamped;
      }
    };

    const onMouseUp = () => {
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      const di = dragIndexRef.current;
      const pi = placeholderIndexRef.current;
      if (di !== null && pi !== null && di !== pi) {
        const next = [...safeSpells];
        const [item] = next.splice(di, 1);
        next.splice(pi, 0, item);
        onSpellsChange?.(next);
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

  const getTransform = (index: number) => {
    if (dragIndex === null || placeholderIndex === null) return 'none';
    if (index === dragIndex) return `translateY(${dragY}px)`;
    if (
      index > Math.min(dragIndex, placeholderIndex) &&
      index <= Math.max(dragIndex, placeholderIndex)
    ) {
      return `translateY(${dragIndex < placeholderIndex ? -SLOT : SLOT}px)`;
    }
    return 'none';
  };

  const defaultHeight =
    BASE_HEIGHT + Math.max(spellCount, MIN_ROWS) * ROW_HEIGHT;
  const height = dragHeight ?? initialHeight ?? defaultHeight;

  // ⭐ 当父组件回传一个更小的 approvedHeight 时，更新 dragHeight
  useLayoutEffect(() => {
    if (draggingRef.current && initialHeight !== undefined) {
      if (initialHeight < maxAllowedRef.current) {
        maxAllowedRef.current = initialHeight;
      }
      setDragHeight(initialHeight);
    }
  }, [initialHeight]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      draggingRef.current = true;
      startYRef.current = e.clientY;

      const raw = initialHeight ?? defaultHeight;
      const snappedStart = snapHeight(raw);
      startHeightRef.current = snappedStart;

      // ⭐ 每次开始拖拽时重置最大允许高度
      maxAllowedRef.current = Infinity;

      setDragHeight(snappedStart);

      const handleMouseMove = (ev: MouseEvent) => {
        if (!draggingRef.current) return;

        const delta = ev.clientY - startYRef.current;
        let newHeight = startHeightRef.current + delta;

        // ⭐ 实时 clamp（使用 SpellSheet 计算的理论最大高度）
        newHeight = Math.min(newHeight, maxAllowedRef.current);

        const snapped = snapHeight(newHeight);
        setDragHeight(snapped);

        // ⭐ 接收 SpellSheet 返回的 maxAllowedHeight
        const res = onResize?.(snapped);
        if (res?.maxAllowedHeight !== undefined) {
          maxAllowedRef.current = res.maxAllowedHeight;
        }
      };

      const handleMouseUp = () => {
        draggingRef.current = false;
        setDragHeight(null);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [initialHeight, defaultHeight, onResize]
  );

  return (
    <div
      ref={boxRef}
      className="bg-white relative rounded-tl-[2px] rounded-tr-[2px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.25)] w-[358px] select-none"
      style={{ height: `${height}px` }}
    >
      {/* Spell entries — scrollable area */}
      <div
        ref={containerRef}
        className="group absolute left-0 top-[45px] right-0 overflow-y-auto"
        style={{ bottom: "18px" }}
      >
        <div className="flex flex-col gap-[10px]">
          {Array.from({ length: Math.max(spellCount, safeSpells.length) }).map((_, index) => {
            const spell = safeSpells[index];
            const changeHandler = (s: SpellData) => handleSpellChange(index, s);
            const deleteHandler = () => {
              const next = safeSpells.filter((_, i) => i !== index);
              onSpellsChange?.(next);
            };

            return (
              <div
                key={index}
                className="shrink-0"
                style={{
                  transform: index !== dragIndex ? getTransform(index) : 'none',
                  opacity: index === dragIndex ? 0 : 1,
                  zIndex: 'auto',
                  position: 'relative' as const,
                  transition: dragIndex !== null && index !== dragIndex ? 'transform 0.15s ease' : 'none',
                }}
                onMouseDown={(e) => onMouseDown(e, index)}
              >
                {isCantrip ? (
                  <Cantrip
                    spell={spell}
                    onChange={changeHandler}
                    onDelete={deleteHandler}
                    isDragging={dragIndex !== null}
                  />
                ) : (
                  <SpellRow
                    spell={spell}
                    onChange={changeHandler}
                    onDelete={deleteHandler}
                    isDragging={dragIndex !== null}
                  />
                )}
              </div>
            );
          })}

          {/* 添加法术按钮 */}
          {onAddSpell && (
            <div className="shrink-0">
              <button
                onClick={handleOpenAddDialog}
                className="flex items-center gap-1 w-full h-[24px] px-[30px] text-[13px] text-sheet-text-spell-placeholder hover:text-sheet-text-secondary hover:bg-sheet-hover-light/20 transition-colors cursor-pointer font-serif-regular-cjk text-left"
                style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
              >
                <span className="text-[16px] leading-none">+</span>
                <span className="leading-none">添加法术</span>
              </button>
            </div>
          )}
        </div>
        <style>{`
          .group::-webkit-scrollbar { width: 3px; display: block; }
          .group::-webkit-scrollbar-track { background: transparent; }
          .group::-webkit-scrollbar-thumb { background: transparent; border-radius: 1.5px; }
          .group { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .group:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); }
          .group:hover { scrollbar-color: rgba(0,0,0,0.3) transparent; }
        `}</style>
      </div>

      {/* Header */}
      <div className="absolute drop-shadow-[0px_-1px_0px_black] h-[39px] left-0 top-px w-[358px]">
        <div className="absolute bg-black inset-[0_0_38.46%_0] overflow-clip rounded-tl-[2px] rounded-tr-[2px]">
          {!isCantrip && (
            <SlotIndicator totalSlots={totalSlots} />
          )}
        </div>

        <div className="absolute inset-[0_83.52%_0_3.07%] overflow-clip">
          <div className="absolute h-[38px] left-px top-px w-[46px]">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 46 38"
            >
              <path d={svgPaths.p35ea5900} fill="var(--color-sheet-svg-fill)" />
            </svg>
          </div>
          <div
            className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-bold font-bold h-[30px] justify-center leading-[0] left-px right-px text-[20px] text-center text-white top-[16px]"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            <p className="leading-[normal]">{level}</p>
          </div>
        </div>
      </div>

      {/* Cantrip label */}
      {isCantrip && (
        <div
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-bold-cjk font-bold h-[24px] justify-center leading-[0] left-[70px] right-[258px] text-[12px] text-center text-white top-[13px]"
          style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
        >
          <p className="leading-[normal]">戏法</p>
        </div>
      )}

      {/* Resize handle — hidden for the last box in column */}
      {!isLastInColumn && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[6px] cursor-s-resize hover:bg-sheet-content-bg active:bg-sheet-hover-bg z-10"
          onMouseDown={handleMouseDown}
        />
      )}

      {/* 添加法术对话框 — 使用 SpellDialog */}
      {/* 拖拽浮动层 */}
      {dragIndex !== null && (() => {
        const spell = safeSpells[dragIndex];
        return ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              left: boxRef.current?.getBoundingClientRect().left ?? 0,
              top: dragClientPos.y - 12,
              width: 358,
              height: ITEM_H,
              zIndex: 9999,
              pointerEvents: 'none',
              backgroundColor: 'white',
              borderRadius: '2px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              transform: 'scale(0.8)',
              transformOrigin: 'top left',
            }}
          >
            {spell ? (
              isCantrip ? <Cantrip spell={spell} onChange={() => {}} /> : <SpellRow spell={spell} onChange={() => {}} />
            ) : (
              <div style={{ height: ITEM_H }} />
            )}
          </div>,
          document.body
        );
      })()}

      <SpellDialog
        open={addDialogOpen}
        initialSpell={createDefaultSpell()}
        isCantrip={isCantrip}
        onSave={handleAddSpell}
        onClose={handleCloseAddDialog}
      />
    </div>
  );
}
