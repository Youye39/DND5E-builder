interface AttackComponentProps {
  name?: string;
  attackBonus?: string;
  damage?: string;
  variant?: 'filled' | 'toFill' | 'empty';
  onClick?: () => void;
  className?: string;
}

export default function AttackComponent({
  name = '',
  attackBonus = '',
  damage = '',
  variant = 'empty',
  onClick,
  className = '',
}: AttackComponentProps) {
  const nameClass =
    variant === 'filled'
      ? "w-[130px] flex items-center bg-sheet-content-bg hover:bg-sheet-hover-bg cursor-pointer"
      : variant === 'toFill'
      ? "w-[130px] flex items-center bg-white border border-sheet-hover-bg rounded-[2px] hover:bg-sheet-panel-bg cursor-pointer"
      : "w-[130px] flex items-center bg-white";

  const bonusClass = variant === 'filled' ? "w-[61px] flex items-center bg-sheet-content-bg" : "w-[61px] flex items-center bg-white";
  const damageClass = variant === 'filled' ? "w-[130px] flex items-center bg-sheet-content-bg" : "w-[130px] flex items-center bg-white";

  return (
    <div className={`flex h-[28px] gap-[5px] ${className}`}>
      <div className={nameClass} onClick={onClick}>
        <span className="pl-[5px] font-['Noto_Serif:Regular',sans-serif] text-[18px] text-black">{name}</span>
      </div>

      <div className={bonusClass}>
        <span className="pl-[5px] font-['Noto_Serif:Regular',sans-serif] text-[18px] text-black">{attackBonus}</span>
      </div>

      <div className={damageClass}>
        <span className="pl-[5px] font-['Noto_Serif:Regular',sans-serif] text-[18px] text-black">{damage}</span>
      </div>
    </div>
  );
}
