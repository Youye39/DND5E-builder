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
import { useLanguage } from "../../shared/i18n/LanguageContext";
import { idToDisplay } from "../../shared/i18n/displayUtils";

const ARMOR_GROUPS    = armorData    as OptionGroup[];
const WEAPON_GROUPS   = weaponsData  as OptionGroup[];
const TOOL_GROUPS     = toolsData    as OptionGroup[];
const LANGUAGE_GROUPS = languagesData as OptionGroup[];

interface ProficiencyPanelProps {
  className?: string;
}

type DialogKey = "armor" | "weapon" | "tool" | "language" | null;

const items: { key: NonNullable<DialogKey>; labelKey: string }[] = [
  { key: "armor", labelKey: "prof.armor" },
  { key: "weapon", labelKey: "prof.weapon" },
  { key: "tool", labelKey: "prof.tools" },
  { key: "language", labelKey: "prof.language" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function idsToLabels(
  ids: string[],
  groups: OptionGroup[],
  lang: string,
  tFn: (key: string) => string,
  groupIdsOrder?: string[],
): string {
  const selected = new Set(ids);
  const parts: string[] = [];
  const separator = ", ";

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const gid = groupIdsOrder ? groupIdsOrder[i] : (group as any).id ?? '';
    const groupIds_ = group.options.map((o) => o.id);
    const allSelected = groupIds_.length > 0 && groupIds_.every((id) => selected.has(id));

    if (allSelected) {
      parts.push(lang === 'en' ? idToDisplay(gid) : group.label);
    } else {
      for (const opt of group.options) {
        if (selected.has(opt.id)) {
          parts.push(lang === 'en' ? idToDisplay(opt.id) : opt.label);
        }
      }
    }
  }

  return parts.length > 0 ? parts.join(separator) : tFn('prof.none');
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProficiencyPanel({ className }: ProficiencyPanelProps) {
  const { t, lang } = useLanguage();
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

  /** tools.json 中各 group 的 id 与 JSON 中实际顺序匹配 */
  const TOOL_GROUP_IDS = ["special", "artisans", "musical", "gaming", "vehicles"];

  /** 将 groups 中各选项 label 替换为对应语言的文本 */
  function localizeGroups(groups: OptionGroup[], groupIds?: string[]): OptionGroup[] {
    return groups.map((g, i) => {
      const gid = groupIds ? groupIds[i] : (g as any).id ?? '';
      return {
        ...g,
        label: lang === 'en' ? idToDisplay(gid) : g.label,
        options: g.options.map(o => ({
          ...o,
          label: lang === 'en' ? idToDisplay(o.id) : o.label,
        })),
      };
    });
  }
  const dialogProps: Record<NonNullable<DialogKey>, {
    title: string;
    groups: OptionGroup[];
    selected: string[];
    onSave: (s: string[]) => void;
  }> = {
    armor:    { title: t('prof.armorTitle'),  groups: localizeGroups(ARMOR_GROUPS),       selected: armorIds,    onSave: setArmorIds    },
    weapon:   { title: t('prof.weaponTitle'), groups: localizeGroups(WEAPON_GROUPS),      selected: weaponIds,   onSave: setWeaponIds   },
    tool:     { title: t('prof.toolsTitle'),  groups: localizeGroups(TOOL_GROUPS, TOOL_GROUP_IDS), selected: toolIds, onSave: setToolIds },
    language: { title: t('prof.languageTitle'), groups: localizeGroups(LANGUAGE_GROUPS), selected: languageIds, onSave: setLanguageIds },
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
      <SectionContainer title={t('prof.panelTitle')} className={`${className || ""} w-[358px] h-[288px]`}>
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
              {t(item.labelKey)}：{idsToLabels(
                dialogProps[item.key].selected,
                dialogProps[item.key].groups,
                lang,
                t,
                item.key === 'tool' ? TOOL_GROUP_IDS : undefined,
              )}
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
