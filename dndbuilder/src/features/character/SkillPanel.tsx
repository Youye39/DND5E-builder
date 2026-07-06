import SkillComponent from "./SkillComponent";
import SectionContainer from "../../shared/ui/SectionContainer";
import { useCharacter } from "../../shared/storage/CharacterContext";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface Attributes {
  str_value: number;
  dex_value: number;
  con_value: number;
  int_value: number;
  wis_value: number;
  cha_value: number;
}

const SKILL_ATTR_LABEL_KEY: Record<string, string> = {
  dex_value: "attr.dex",
  wis_value: "attr.wis",
  int_value: "attr.int",
  str_value: "attr.str",
  cha_value: "attr.cha",
};

const SKILL_ATTR_KEY: Record<string, keyof Attributes> = {
  acrobatics: "dex_value",
  animalHandling: "wis_value",
  arcana: "int_value",
  athletics: "str_value",
  deception: "cha_value",
  history: "int_value",
  insight: "wis_value",
  intimidation: "cha_value",
  investigation: "int_value",
  medicine: "wis_value",
  nature: "int_value",
  perception: "wis_value",
  performance: "cha_value",
  persuasion: "cha_value",
  religion: "int_value",
  sleightOfHand: "dex_value",
  stealth: "dex_value",
  survival: "wis_value",
};

const SKILL_KEYS = [
  "acrobatics", "animalHandling", "arcana", "athletics", "deception",
  "history", "insight", "intimidation", "investigation", "medicine",
  "nature", "perception", "performance", "persuasion", "religion",
  "sleightOfHand", "stealth", "survival",
] as const;

interface SkillPanelProps {
  className?: string;
  attributes?: Attributes;
  proficiencyBonus?: number;
}

const calculateModifier = (attributeValue: number): number => {
  return Math.floor((attributeValue - 10) / 2);
};

export default function SkillPanel({ className: propClassName, attributes: propAttributes, proficiencyBonus: propBonus }: SkillPanelProps) {
  // 优先从 context 读取属性值，避免多层回调传递
  const { t, lang } = useLanguage();
  const ctx = useCharacter();
  const char = ctx.character;

  const finalAttributes: Attributes = propAttributes ?? char?.attributes ?? {
    str_value: 10, dex_value: 10, con_value: 10,
    int_value: 10, wis_value: 10, cha_value: 10,
  };
  const proficiencyBonus = propBonus ?? char?.proficiencyBonus ?? 2;

  const skillStates: Record<string, 0 | 1 | 2 | 3 | 3> = char?.skills ?? {};
  const skillCustomModifiers = char?.skillCustomModifiers ?? {};

  const handleSkillStateChange = (skillKey: string, newState: 0 | 1 | 2 | 3) => {
    ctx.updateCharacter({ skills: { ...skillStates, [skillKey]: newState } });
  };

  const handleSkillCustomModifierChange = (skillKey: string, newValue: string | null) => {
    ctx.updateCharacter({ skillCustomModifiers: { ...skillCustomModifiers, [skillKey]: newValue } });
  };

  return (
    <SectionContainer title={t('skill.title')} className={`${propClassName || ""} w-[223px] h-[544px]`}>
      <div className="absolute top-[14px] left-[16px] right-[16px] flex flex-col gap-[12px]">
        {SKILL_KEYS.map((skillKey, index) => (
          <SkillComponent
            key={index}
            skillName={lang === 'en' ? t(`skill.abbr.${skillKey}`) : t(`skill.${skillKey}`)}
            attributeName={t(SKILL_ATTR_LABEL_KEY[SKILL_ATTR_KEY[skillKey]])}
            modifier={calculateModifier(finalAttributes[SKILL_ATTR_KEY[skillKey]])}
            proficiencyBonus={proficiencyBonus}
            state={skillStates[skillKey] ?? 0}
            onStateChange={(s) => handleSkillStateChange(skillKey, s)}
            customModifier={skillCustomModifiers[skillKey] ?? null}
            onCustomModifierChange={(val) => handleSkillCustomModifierChange(skillKey, val)}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
