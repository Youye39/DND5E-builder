import SavingThrowComponent from "./SavingThrowComponent";
import SectionContainer from "../../shared/components/SectionContainer";
import { useCharacter } from "../../shared/storage/CharacterContext";
import type { Attributes, SavingThrowKey, SavingThrows } from "../../shared/storage/types";

interface SavingThrowPanelProps {
  className?: string;
  attributes?: Attributes;
  proficiencyBonus?: number;
}

function getModifier(attrValue: number): number {
  return Math.floor((attrValue - 10) / 2);
}

const SAVE_LABEL_MAP: Record<SavingThrowKey, string> = {
  strength: "力量",
  dexterity: "敏捷",
  constitution: "体质",
  intelligence: "智力",
  wisdom: "感知",
  charisma: "魅力",
};

const SAVE_ATTR_MAP: Record<SavingThrowKey, string> = {
  strength: "str_value",
  dexterity: "dex_value",
  constitution: "con_value",
  intelligence: "int_value",
  wisdom: "wis_value",
  charisma: "cha_value",
};

export default function SavingThrowPanel({ className, attributes: propAttributes, proficiencyBonus: propBonus }: SavingThrowPanelProps) {
  const ctx = useCharacter();
  const char = ctx.character;

  const attrs = propAttributes ?? char?.attributes ?? {};
  const bonus = propBonus ?? char?.proficiencyBonus ?? 2;
  const savingThrows: SavingThrows = char?.savingThrows ?? {
    strength: false, dexterity: false, constitution: false,
    intelligence: false, wisdom: false, charisma: false,
  };

  const handleCheckedChange = (key: SavingThrowKey, checked: boolean) => {
    ctx.updateCharacter({ savingThrows: { ...savingThrows, [key]: checked } });
  };

  return (
    <SectionContainer title="豁免" className={`${className || ""} w-[223px] h-[208px]`}>
      <div className="absolute top-[14px] left-[16px] right-[16px] flex flex-col gap-[12px]">
        {(Object.keys(SAVE_LABEL_MAP) as SavingThrowKey[]).map((key) => {
          const attrKey = SAVE_ATTR_MAP[key] as keyof typeof attrs;
          const mod = getModifier(attrs[attrKey] ?? 10);
          return (
            <SavingThrowComponent
              key={key}
              label={SAVE_LABEL_MAP[key]}
              modifier={mod}
              proficiencyBonus={bonus}
              checked={savingThrows[key]}
              onCheckedChange={(v) => handleCheckedChange(key, v)}
            />
          );
        })}
      </div>
    </SectionContainer>
  );
}
