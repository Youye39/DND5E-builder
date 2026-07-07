import FunctionButton from "../shared/ui/FunctionButton";
import { useLanguage } from "../shared/i18n/LanguageContext";

interface BottomToolbarProps {
  onExportFileClick: () => void;
  onBuildGuideClick: () => void;
  onArchiveManageClick: () => void;
  onCustomItemClick: () => void;
}

export default function BottomToolbar({
  onExportFileClick,
  onBuildGuideClick,
  onArchiveManageClick,
  onCustomItemClick,
}: BottomToolbarProps) {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-3 w-[calc(100vw-24px)] max-w-[340px] md:flex md:items-center md:justify-center md:gap-6 md:w-auto md:max-w-none z-50">
      <FunctionButton label={t('toolbar.export')} onClick={onExportFileClick} />
      <FunctionButton label={t('toolbar.buildGuide')} onClick={onBuildGuideClick} />
      <FunctionButton label={t('toolbar.archive')} onClick={onArchiveManageClick} />
      <FunctionButton label={t('toolbar.customItems')} onClick={onCustomItemClick} />
    </div>
  );
}
