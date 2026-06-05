interface FunctionButtonProps {
  label: string;
  onClick: () => void;
}

export default function FunctionButton({ label, onClick }: FunctionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#1e1e1e] h-[44px] overflow-clip relative rounded-[5px] shadow-[0px_0px_3px_0px_black] w-[160px] hover:bg-[#2a2a2a] transition-colors cursor-pointer"
      data-name="功能按钮"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="font-['Noto_Serif:Medium','Noto_Sans_CJK:Medium',sans-serif] justify-center text-[16px] text-white text-center leading-normal">
          {label}
        </p>
      </div>
    </button>
  );
}
