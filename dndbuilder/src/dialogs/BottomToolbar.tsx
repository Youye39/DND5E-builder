import FunctionButton from "../shared/ui/FunctionButton";

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
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-3 w-[calc(100vw-24px)] max-w-[340px] md:flex md:items-center md:justify-center md:gap-6 md:w-auto md:max-w-none z-50">
      <FunctionButton label="导出文件" onClick={onExportFileClick} />
      <FunctionButton label="车卡指引" onClick={onBuildGuideClick} />
      <FunctionButton label="存档管理" onClick={onArchiveManageClick} />
      <FunctionButton label="自定义项管理" onClick={onCustomItemClick} />
    </div>
  );
}
