interface FunctionButtonProps {
  label: string;
  onClick: () => void;
}

export default function FunctionButton({ label, onClick }: FunctionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-sheet-button-dark-bg h-[44px] overflow-clip relative rounded-[5px] shadow-[0px_0px_3px_0px_black] w-[160px] hover:bg-sheet-button-dark-hover transition-colors cursor-pointer"
      data-name="功能按钮"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="font-serif-medium-cjk justify-center text-[16px] text-white text-center leading-normal">
          {label}
        </p>
      </div>
    </button>
  );
}
