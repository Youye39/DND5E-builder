import SavingThrowComponent from "./SavingThrowComponent";
import SectionContainer from "../../../shared/components/SectionContainer";

interface SavingThrowPanelProps {
  className?: string;
  attributes?: Record<string, number>;
  proficiencyBonus?: number;
}

function getModifier(attrValue: number): number {
  return Math.floor((attrValue - 10) / 2);
}

export default function SavingThrowPanel({ className, attributes, proficiencyBonus = 2 }: SavingThrowPanelProps) {
  const strMod = getModifier(attributes?.str_value ?? 10);
  const dexMod = getModifier(attributes?.dex_value ?? 10);
  const conMod = getModifier(attributes?.con_value ?? 10);
  const intMod = getModifier(attributes?.int_value ?? 10);
  const wisMod = getModifier(attributes?.wis_value ?? 10);
  const chaMod = getModifier(attributes?.cha_value ?? 10);

  return (
    <SectionContainer title="豁免" className={`${className || ""} w-[223px] h-[208px]`}>
      <div className="absolute top-[14px] left-[16px] right-[16px] flex flex-col gap-[12px]">
        <SavingThrowComponent label="力量" modifier={strMod} proficiencyBonus={proficiencyBonus} />
        <SavingThrowComponent label="敏捷" modifier={dexMod} proficiencyBonus={proficiencyBonus} />
        <SavingThrowComponent label="体质" modifier={conMod} proficiencyBonus={proficiencyBonus} />
        <SavingThrowComponent label="智力" modifier={intMod} proficiencyBonus={proficiencyBonus} />
        <SavingThrowComponent label="感知" modifier={wisMod} proficiencyBonus={proficiencyBonus} />
        <SavingThrowComponent label="魅力" modifier={chaMod} proficiencyBonus={proficiencyBonus} />
      </div>
    </SectionContainer>
  );
}
