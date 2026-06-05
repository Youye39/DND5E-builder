import { useState } from "react";
import SectionContainer from "../common/SectionContainer";
import EditableScrollArea from "../common/EditableScrollArea";

interface EquipmentPanelProps {
  className?: string;
}

export default function EquipmentPanel({ className }: EquipmentPanelProps) {
  const [value, setValue] = useState("");

  return (
    <SectionContainer title="装备" className={`${className || ""} w-[358px] h-[437px]`}>
      <EditableScrollArea
        value={value}
        onChange={setValue}
        className="absolute top-[56px] left-[9px] right-[9px] bottom-[33px]"
        
        innerClassName="pl-[8px] pt-[5px] pb-[5px]"
// absolute bottom-[33px] left-[14px] h-[421px] w-[651px]
      />
    </SectionContainer>
  );
}
