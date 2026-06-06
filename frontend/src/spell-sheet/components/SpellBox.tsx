import { useRef, useCallback, useState, useLayoutEffect } from "react";
import svgPaths from "../../assets/flag";
import Cantrip from "./Cantrip";
import Spell from "./Spell";
import SlotIndicator from "./SlotIndicator";

interface SpellBoxProps {
  level: number;
  isCantrip?: boolean;
  spellCount: number;
  totalSlots?: number;
  initialHeight?: number;
  isLastInColumn?: boolean;

  // ⭐ 修改：onResize 返回 { approvedHeight, maxAllowedHeight }
  onResize?: (
    newHeight: number
  ) =>
    | {
        approvedHeight: number;
        maxAllowedHeight: number;
      }
    | void;
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
}: SpellBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // ⭐ 新增：父组件允许的最大高度（实时 clamp）
  const maxAllowedRef = useRef<number>(Infinity);

  const [dragHeight, setDragHeight] = useState<number | null>(null);

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
        className="group absolute left-0 top-[45px] right-0 overflow-y-auto"
        style={{ bottom: "18px" }}
      >
        <div className="flex flex-col gap-[10px]">
          {Array.from({ length: spellCount }).map((_, index) => (
            <div key={index} className="shrink-0">
              {isCantrip ? <Cantrip /> : <Spell />}
            </div>
          ))}
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
    </div>
  );
}
