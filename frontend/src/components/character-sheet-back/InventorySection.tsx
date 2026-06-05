import SectionContainer from "../common/SectionContainer";
import EditableScrollArea from "../common/EditableScrollArea";

interface InventorySectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InventorySection({ value, onChange }: InventorySectionProps) {
  return (
    <SectionContainer title="库存与财宝" className="h-[464px] left-[491px] top-[1068px] w-[679px]">
      <EditableScrollArea
        value={value}
        onChange={onChange}
        className="absolute bottom-[33px] left-[14px] h-[422px] w-[651px]"
        innerClassName="pl-[8px] pt-[5px] pb-[5px]"
      />
    </SectionContainer>
  );
}
