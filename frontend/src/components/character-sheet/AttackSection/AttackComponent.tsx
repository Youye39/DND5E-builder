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
      ? "w-[130px] flex items-center bg-[#efefef] hover:bg-[#e7e7e7] cursor-pointer"
      : variant === 'toFill'
      ? "w-[130px] flex items-center bg-white border border-[#e7e7e7] rounded-[2px] hover:bg-[#f6f6f6] cursor-pointer"
      : "w-[130px] flex items-center bg-white";

  const bonusClass = variant === 'filled' ? "w-[61px] flex items-center bg-[#efefef]" : "w-[61px] flex items-center bg-white";
  const damageClass = variant === 'filled' ? "w-[130px] flex items-center bg-[#efefef]" : "w-[130px] flex items-center bg-white";

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
