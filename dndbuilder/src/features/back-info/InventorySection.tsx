import SectionContainer from "../../shared/ui/SectionContainer";
import EditableScrollArea from "../../shared/ui/EditableScrollArea";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface InventorySectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InventorySection({ value, onChange }: InventorySectionProps) {
  const { t } = useLanguage();
  return (
    <SectionContainer title={t('inventory.title')} className="h-[464px] left-[491px] top-[1068px] w-[679px]">
      <EditableScrollArea
        value={value}
        onChange={onChange}
        className="absolute bottom-[33px] left-[14px] h-[422px] w-[651px]"
        innerClassName="pl-[8px] pt-[5px] pb-[5px]"
      />
    </SectionContainer>
  );
}
