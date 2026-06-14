import { useCharacter } from "../shared/storage/CharacterContext";
import SpellBox from "../features/spells/SpellBox";
import Header from "../features/spells/Header";
import type { SpellData } from "../shared/types/types";
import classData from "../../data/classData.json";

const ROW_HEIGHT = 34;
const BASE_HEIGHT = 53;
const GAP = 15;
const MAX_COLUMN_TOTAL = 1277;
const MIN_HEIGHT = BASE_HEIGHT + ROW_HEIGHT; // 87 — at least 1 row

function snapHeight(rawHeight: number): number {
  const n = Math.round((rawHeight - BASE_HEIGHT) / ROW_HEIGHT);
  return BASE_HEIGHT + Math.max(1, n) * ROW_HEIGHT;
}

function getDefaultHeight(box: { spellCount: number }): number {
  return BASE_HEIGHT + Math.max(box.spellCount, 1) * ROW_HEIGHT;
}

function getBoxHeight(box: { level: number; spellCount: number }, customHeights: Record<number, number>): number {
  if (customHeights[box.level] !== undefined) return customHeights[box.level];
  return getDefaultHeight(box);
}

/**
 * Given a column's boxes (excluding the last one, whose height is auto-computed),
 * a target box being resized, and its requested snapped height,
 * compute a new `customHeights` map that satisfies column constraints:
 * - Total height + gaps + last‑box remainder ≤ MAX_COLUMN_TOTAL
 * - Lower boxes shrink (to minimum MIN_HEIGHT) to make room
 * - If impossible, the target box is clamped to the maximum that fits
 */
function adjustColumnHeights(
  columnBoxes: { level: number; spellCount: number; row: number }[],
  targetLevel: number,
  requestedHeight: number,
  currentHeights: Record<number, number>,
): Record<number, number> {
  // Work with non‑last boxes only
  const mainBoxes = columnBoxes.slice(0, -1);
  const result = { ...currentHeights, [targetLevel]: requestedHeight };

  // Build heights for non‑last boxes only
  const heights = mainBoxes.map((b) =>
    b.level === targetLevel ? requestedHeight : snapHeight(result[b.level] ?? getDefaultHeight(b)),
  );

  // Remaining space for the last box must be at least MIN_HEIGHT
  const available = MAX_COLUMN_TOTAL - MIN_HEIGHT;
  const total = heights.reduce((s, h) => s + h, 0) + (columnBoxes.length - 1) * GAP;

  if (total <= available) return result;

  // Overflow — shrink non‑last boxes below the target
  const targetIdx = mainBoxes.findIndex((b) => b.level === targetLevel);
  let overflow = total - available;

  for (let i = targetIdx + 1; i < mainBoxes.length && overflow > 0; i++) {
    const b = mainBoxes[i];
    const currentH = heights[i];
    const maxShrink = currentH - MIN_HEIGHT;
    if (maxShrink <= 0) continue;
    const shrink = Math.min(maxShrink, overflow);
    const newH = snapHeight(currentH - shrink);
    result[b.level] = newH;
    overflow -= currentH - newH;
  }

  if (overflow > 0) {
    // Still overflows — clamp the target (floor to never exceed available space)
    const othersTotal = mainBoxes.reduce((sum, b, i) => {
      if (i === targetIdx) return sum;
      return sum + (result[b.level] ?? getDefaultHeight(b));
    }, 0) + (columnBoxes.length - 1) * GAP;
    const maxTarget = available - othersTotal;
    const n = Math.max(1, Math.floor((maxTarget - BASE_HEIGHT) / ROW_HEIGHT));
    result[targetLevel] = BASE_HEIGHT + n * ROW_HEIGHT;
  }

  return result;
}

// 计算：在保证“下方每个盒子至少 MIN_HEIGHT（= BASE_HEIGHT + ROW_HEIGHT）”的前提下，
// 当前 targetLevel 理论上能达到的最大高度（向下取整到行高）
function computeMaxAllowedHeight(
  columnBoxes: { level: number; spellCount: number; row: number }[],
  targetLevel: number,
  customHeights: Record<number, number>,
): number {
  // 按 row 排序
  const sorted = [...columnBoxes].sort((a, b) => a.row - b.row);
  const targetIndex = sorted.findIndex(b => b.level === targetLevel);
  if (targetIndex === -1) return Infinity;

  const above = sorted.slice(0, targetIndex);
  const below = sorted.slice(targetIndex + 1);

  // 上方盒子保持当前高度
  const aboveTotal = above.reduce(
    (sum, b) => sum + getBoxHeight(b, customHeights),
    0,
  );

  // 下方所有盒子都压到 MIN_HEIGHT（包括最后一个）
  const belowMinTotal = below.length * MIN_HEIGHT;

  // 所有 gap
  const gapTotal = (sorted.length - 1) * GAP;

  // 剩余空间给目标盒子
  const maxTargetRaw = MAX_COLUMN_TOTAL - aboveTotal - belowMinTotal - gapTotal;

  // 向下取整到行高，并保证至少 MIN_HEIGHT
  const n = Math.max(1, Math.floor((maxTargetRaw - BASE_HEIGHT) / ROW_HEIGHT));
  return BASE_HEIGHT + n * ROW_HEIGHT;
}


export default function SpellSheet() {
  const { character, updateCharacter } = useCharacter();

  if (!character) return null;

  const spellBoxes = character.spellBoxes ?? [];
  const customHeights = character.customHeights ?? {};
  const setCustomHeights = (heights: Record<number, number>) => updateCharacter({ customHeights: heights });

  const handleSpellsChange = (boxLevel: number, spells: SpellData[]) => {
    const nextBoxes = spellBoxes.map((b) =>
      b.level === boxLevel
        ? { ...b, spells, spellCount: Math.max(b.spellCount, spells.length) }
        : b
    );
    updateCharacter({ spellBoxes: nextBoxes });
  };

  const handleAddSpell = (boxLevel: number, spell: SpellData) => {
    const nextBoxes = spellBoxes.map((b) =>
      b.level === boxLevel
        ? { ...b, spells: [...b.spells, spell], spellCount: b.spellCount + 1 }
        : b
    );
    updateCharacter({ spellBoxes: nextBoxes });
  };

  // 根据 classData 计算指定法术环位的法术位数量
  const classId = character.basicInfo?.["职业_id"];
  const charLevel = typeof character.level === "number" ? character.level : 1;
  const classSpellData = classId ? (classData as Record<string, any>)[classId] : null;
  const spellSlotsData = classSpellData?.spellSlots ?? null;
  const getTotalSlots = (spellLevel: number): number => {
    // 优先使用自定义覆写
    const custom = character?.customSpellSlots?.[spellLevel];
    if (custom !== undefined) return custom;
    // 否则从 classData 读取
    if (!spellSlotsData || !Array.isArray(spellSlotsData)) return 0;
    const levelEntry = spellSlotsData.find((entry: any) => entry.level === charLevel);
    if (!levelEntry) return 0;
    return levelEntry.slots[spellLevel - 1] ?? 0;
  };

  return (
    <div className="absolute bg-white h-[1584px] left-0 overflow-clip top-[75px] w-[1224px]">
      <Header />

      {/* 已知戏法 / 已知法术 / 已准备法术 信息行 */}
      <div className="absolute top-[236px] left-[55px] w-[358px] pointer-events-none flex justify-between leading-none">
        <span className="font-serif-regular-cjk text-sheet-text-spell-placeholder text-[13px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          已知戏法：{spellBoxes.filter(b => b.isCantrip).flatMap(b => b.spells).filter(s => s.name.trim()).length}
        </span>
        <span className="font-serif-regular-cjk text-sheet-text-spell-placeholder text-[13px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          已知法术：{spellBoxes.filter(b => !b.isCantrip).flatMap(b => b.spells).filter(s => s.name.trim()).length}
        </span>
        <span className="font-serif-regular-cjk text-sheet-text-spell-placeholder text-[13px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          已准备法术：{spellBoxes.flatMap(b => b.spells).filter(s => s.prepared && s.name.trim()).length}
        </span>
      </div>

      {/* Spell boxes grid with proper spacing */}
      <div className="absolute left-[55px] top-[254px]">
        {spellBoxes.map((box, index) => {
          const left = box.col * (358 + 20); // 358px width + 20px gap

          // Detect the last box in this column
          const colBoxes = spellBoxes
            .filter((b) => b.col === box.col)
            .sort((a, b) => a.row - b.row);
          const isLastInColumn = colBoxes[colBoxes.length - 1].level === box.level;

          // Calculate top position based on previous boxes in same column
          let top = 0;
          for (let i = 0; i < index; i++) {
            if (spellBoxes[i].col === box.col && spellBoxes[i].row < box.row) {
              const prevHeight = getBoxHeight(spellBoxes[i], customHeights);
              top += prevHeight + GAP;
            }
          }

          // For the last box in column, auto-compute its height as the remainder
          let boxHeight: number | undefined;
          if (isLastInColumn) {
            const aboveTotal = colBoxes
              .filter((b) => b.row < box.row)
              .reduce((sum, b) => sum + getBoxHeight(b, customHeights), 0);
            const gapTotal = (colBoxes.length - 1) * GAP;
            boxHeight = snapHeight(MAX_COLUMN_TOTAL - aboveTotal - gapTotal);
          } else {
            boxHeight = customHeights[box.level];
          }

          return (
            <div
              key={box.level}
              className="absolute"
              style={{ left: `${left}px`, top: `${top}px` }}
            >
              <SpellBox
                level={box.level}
                isCantrip={box.isCantrip}
                spellCount={box.spellCount}
                spells={box.spells}
                totalSlots={getTotalSlots(box.level)}
                onSpellsChange={(spells) => handleSpellsChange(box.level, spells)}
                onAddSpell={(spell) => handleAddSpell(box.level, spell)}
                initialHeight={boxHeight}
                isLastInColumn={isLastInColumn}
                onResize={(newHeight) => {
                  setCustomHeights(
                    adjustColumnHeights(colBoxes, box.level, newHeight, customHeights)
                  );
                  const maxAllowedHeight = computeMaxAllowedHeight(colBoxes, box.level, customHeights);
                  return {
                    approvedHeight: newHeight,
                    maxAllowedHeight,
                  };
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
