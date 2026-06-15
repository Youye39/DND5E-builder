import { useState, useRef, useLayoutEffect } from "react";
import { MultiSelectDialog } from "../../shared/ui/MultiSelectDialog";
import type { OptionGroup } from "../../shared/ui/MultiSelectDialog";
import ScrollArea from "../../shared/ui/ScrollArea";
import SectionContainer from "../../shared/ui/SectionContainer";
import { useCharacter } from "../../shared/storage/CharacterContext";
import armorData    from "../../../data/armor.json";
import weaponsData  from "../../../data/weapons.json";
import toolsData    from "../../../data/tools.json";
import languagesData from "../../../data/languages.json";

const ARMOR_GROUPS    = armorData    as OptionGroup[];
const WEAPON_GROUPS   = weaponsData  as OptionGroup[];
const TOOL_GROUPS     = toolsData    as OptionGroup[];
const LANGUAGE_GROUPS = languagesData as OptionGroup[];

interface ProficiencyPanelProps {
  className?: string;
}

type DialogKey = "armor" | "weapon" | "tool" | "language" | null;

const items: { key: NonNullable<DialogKey>; label: string }[] = [
  { key: "armor", label: "护甲" },
  { key: "weapon", label: "武器" },
  { key: "tool", label: "工具" },
  { key: "language", label: "语言" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function idsToLabels(ids: string[], groups: OptionGroup[]): string {
  const selected = new Set(ids);
  const parts: string[] = [];

  for (const group of groups) {
    const groupIds = group.options.map((o) => o.id);
    const allSelected = groupIds.length > 0 && groupIds.every((id) => selected.has(id));

    if (allSelected) {
      // Whole group selected → show only the group label
      parts.push(group.label);
    } else {
      // Partial → show individual selected labels
      for (const opt of group.options) {
        if (selected.has(opt.id)) parts.push(opt.label);
      }
    }
  }

  return parts.length > 0 ? parts.join("、") : "无";
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProficiencyPanel({ className }: ProficiencyPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const proficiencies = character?.proficiencies ?? { armor: [], weapon: [], tool: [], language: [] };
  const { armor: armorIds, weapon: weaponIds, tool: toolIds, language: languageIds } = proficiencies;

  const setArmorIds    = (ids: string[]) => updateCharacter({ proficiencies: { ...proficiencies, armor: ids } });
  const setWeaponIds   = (ids: string[]) => updateCharacter({ proficiencies: { ...proficiencies, weapon: ids } });
  const setToolIds     = (ids: string[]) => updateCharacter({ proficiencies: { ...proficiencies, tool: ids } });
  const setLanguageIds = (ids: string[]) => updateCharacter({ proficiencies: { ...proficiencies, language: ids } });

  const [open, setOpen] = useState<DialogKey>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dialogProps: Record<NonNullable<DialogKey>, {
    title: string;
    groups: OptionGroup[];
    selected: string[];
    onSave: (s: string[]) => void;
  }> = {
    armor:    { title: "护甲熟练",     groups: ARMOR_GROUPS,    selected: armorIds,    onSave: setArmorIds    },
    weapon:   { title: "武器熟练",     groups: WEAPON_GROUPS,   selected: weaponIds,   onSave: setWeaponIds   },
    tool:     { title: "工具熟练",     groups: TOOL_GROUPS,     selected: toolIds,     onSave: setToolIds     },
    language: { title: "语言",         groups: LANGUAGE_GROUPS, selected: languageIds, onSave: setLanguageIds },
  };

  const current = open ? dialogProps[open] : null;

  // Detect whether content overflows so we can toggle right padding
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setNeedsScroll(el.scrollHeight > el.clientHeight);
    }
  }, [armorIds, weaponIds, toolIds, languageIds]);

  return (
    <>
      <SectionContainer title="其他熟练项和语言" className={`${className || ""} w-[358px] h-[288px]`}>
        <ScrollArea
          ref={scrollRef}
          className={`absolute top-[9px] left-[9px] right-[9px] bottom-[33px] bg-sheet-content-bg ${needsScroll ? "pl-[5px]" : "p-[5px]"}`}
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setOpen(item.key)}
              className="block w-full text-left font-serif-regular-cjk text-[18px] text-black leading-normal mb-0 border-none cursor-pointer hover:bg-sheet-hover-bg px-1"
            >
              {item.label}：{idsToLabels(dialogProps[item.key].selected, dialogProps[item.key].groups)}
            </button>
          ))}
        </ScrollArea>
      </SectionContainer>

      {/* 弹窗 */}
      {current && (
        <MultiSelectDialog
          open={open !== null}
          title={current.title}
          groups={current.groups}
          selected={current.selected}
          onSave={current.onSave}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
