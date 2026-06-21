import SpellRow from "./Spell";
import type { SpellData } from "../../shared/types/types";

interface CantripProps {
  spell?: SpellData;
  onChange: (spell: SpellData) => void;
  onDelete?: () => void;
  isDragging?: boolean;
  onHover?: (e: React.MouseEvent) => void;
  onHoverLeave?: () => void;
  /** 所在列索引，用于 SpellTip 定位 */
  columnIndex?: number;
}

export default function Cantrip({ spell, onChange, onDelete, isDragging, onHover, onHoverLeave, columnIndex }: CantripProps) {
  return (
    <SpellRow
      spell={spell}
      isCantrip={true}
      onChange={onChange}
      onDelete={onDelete}
      isDragging={isDragging}
      onHover={onHover}
      onHoverLeave={onHoverLeave}
      columnIndex={columnIndex}
    />
  );
}

