import SkillComponent from "./SkillComponent";
import SectionContainer from "../../../shared/components/SectionContainer";

interface Attributes {
  str_value: number;
  dex_value: number;
  con_value: number;
  int_value: number;
  wis_value: number;
  cha_value: number;
}

const skills = [
  { name: "体操", attr: "敏捷", attrKey: "dex_value" as keyof Attributes },
  { name: "驯兽", attr: "感知", attrKey: "wis_value" as keyof Attributes },
  { name: "奥秘", attr: "智力", attrKey: "int_value" as keyof Attributes },
  { name: "运动", attr: "力量", attrKey: "str_value" as keyof Attributes },
  { name: "欺瞒", attr: "魅力", attrKey: "cha_value" as keyof Attributes },
  { name: "历史", attr: "智力", attrKey: "int_value" as keyof Attributes },
  { name: "洞悉", attr: "感知", attrKey: "wis_value" as keyof Attributes },
  { name: "威吓", attr: "魅力", attrKey: "cha_value" as keyof Attributes },
  { name: "调查", attr: "智力", attrKey: "int_value" as keyof Attributes },
  { name: "医药", attr: "感知", attrKey: "wis_value" as keyof Attributes },
  { name: "自然", attr: "智力", attrKey: "int_value" as keyof Attributes },
  { name: "察觉", attr: "感知", attrKey: "wis_value" as keyof Attributes },
  { name: "表演", attr: "魅力", attrKey: "cha_value" as keyof Attributes },
  { name: "游说", attr: "魅力", attrKey: "cha_value" as keyof Attributes },
  { name: "宗教", attr: "智力", attrKey: "int_value" as keyof Attributes },
  { name: "巧手", attr: "敏捷", attrKey: "dex_value" as keyof Attributes },
  { name: "隐匿", attr: "敏捷", attrKey: "dex_value" as keyof Attributes },
  { name: "求生", attr: "感知", attrKey: "wis_value" as keyof Attributes },
];

interface SkillPanelProps {
  className?: string;
  attributes?: Attributes;
  proficiencyBonus?: number;
  onPerceptionModifierChange?: (modifier: number) => void;
}

const calculateModifier = (attributeValue: number): number => {
  return Math.floor((attributeValue - 10) / 2);
};

export default function SkillPanel({ className, attributes, proficiencyBonus = 2, onPerceptionModifierChange }: SkillPanelProps) {
  // 提供默认属性值
  const defaultAttributes: Attributes = {
    str_value: 10,
    dex_value: 10,
    con_value: 10,
    int_value: 10,
    wis_value: 10,
    cha_value: 10,
  };
  const finalAttributes = attributes || defaultAttributes;
  return (
    <SectionContainer title="技能" className={`${className || ""} w-[223px] h-[544px]`}>
      <div className="absolute top-[14px] left-[16px] right-[16px] flex flex-col gap-[12px]">
        {skills.map((skill, index) => (
          <SkillComponent
            key={index}
            skillName={skill.name}
            attributeName={skill.attr}
            modifier={calculateModifier(finalAttributes[skill.attrKey])}
            proficiencyBonus={proficiencyBonus}
            onTotalModifierChange={skill.name === "察觉" ? onPerceptionModifierChange : undefined}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
