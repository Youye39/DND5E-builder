import SectionContainer from "../../shared/ui/SectionContainer";
import EditableScrollArea from "../../shared/ui/EditableScrollArea";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface AdventureLogSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdventureLogSection({ value, onChange }: AdventureLogSectionProps) {
  const { t } = useLanguage();
  return (
    <SectionContainer title={t('adventureLog.title')} className="h-[463px] left-[491px] top-[587px] w-[679px]">
      <EditableScrollArea
        value={value}
        onChange={onChange}
        className="absolute bottom-[33px] left-[14px] h-[421px] w-[651px]"
        innerClassName="pl-[8px] pt-[5px] pb-[5px]"
      />
    </SectionContainer>
  );
}
