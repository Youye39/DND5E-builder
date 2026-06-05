import FunctionButton from "./FunctionButton";

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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 z-50">
      <FunctionButton label="导出文件" onClick={onExportFileClick} />
      <FunctionButton label="车卡指引" onClick={onBuildGuideClick} />
      <FunctionButton label="存档管理" onClick={onArchiveManageClick} />
      <FunctionButton label="自定义项管理" onClick={onCustomItemClick} />
    </div>
  );
}
