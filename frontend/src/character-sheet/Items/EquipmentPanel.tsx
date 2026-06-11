import SectionContainer from "../../shared/components/SectionContainer";
import EditableScrollArea from "../../shared/components/EditableScrollArea";
import { useCharacter } from "../../shared/storage/CharacterContext";

interface EquipmentPanelProps {
  className?: string;
}

export default function EquipmentPanel({ className }: EquipmentPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const value = character?.equipment ?? "";

  return (
    <SectionContainer title="装备" className={`${className || ""} w-[358px] h-[437px]`}>
      <EditableScrollArea
        value={value}
        onChange={(v) => updateCharacter({ equipment: v })}
        className="absolute top-[56px] left-[9px] right-[9px] bottom-[33px]"
        
        innerClassName="pl-[8px] pt-[5px] pb-[5px]"
      />
    </SectionContainer>
  );
}
