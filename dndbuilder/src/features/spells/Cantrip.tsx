import SpellRow from "./Spell";
import type { SpellData } from "../../shared/types/types";

interface CantripProps {
  spell?: SpellData;
  onChange: (spell: SpellData) => void;
  onDelete?: () => void;
  isDragging?: boolean;
  onHover?: (e: React.MouseEvent) => void;
  onHoverLeave?: () => void;
}

export default function Cantrip({ spell, onChange, onDelete, isDragging, onHover, onHoverLeave }: CantripProps) {
  return (
    <SpellRow
      spell={spell}
      isCantrip={true}
      onChange={onChange}
      onDelete={onDelete}
      isDragging={isDragging}
      onHover={onHover}
      onHoverLeave={onHoverLeave}
    />
  );
}

