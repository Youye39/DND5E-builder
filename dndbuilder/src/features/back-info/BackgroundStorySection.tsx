import SectionContainer from "../../shared/ui/SectionContainer";
import EditableScrollArea from "../../shared/ui/EditableScrollArea";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface BackgroundStorySectionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BackgroundStorySection({ value, onChange }: BackgroundStorySectionProps) {
  const { t } = useLanguage();
  return (
    <SectionContainer title={t('backstory.title')} className="h-[945px] left-[55px] top-[587px] w-[415px]">
      <EditableScrollArea
        value={value}
        onChange={onChange}
        className="absolute top-[9px] left-[9px] w-[397px] h-[903px]"
        innerClassName="pl-[8px] pt-[5px] pb-[5px]"
      />
    </SectionContainer>
  );
}
