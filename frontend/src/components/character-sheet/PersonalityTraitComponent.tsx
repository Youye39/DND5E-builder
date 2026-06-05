import { useState } from "react";

interface PersonalityTraitComponentProps {
  className?: string;
  label: string;
  initialValue?: string;
  onValueChange?: (value: string) => void;
}

export default function PersonalityTraitComponent({
  className,
  label,
  initialValue = "",
  onValueChange
}: PersonalityTraitComponentProps) {
  const [value, setValue] = useState(initialValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={className || "bg-white h-[107px] relative rounded-[2px] w-[330px]"} data-name="个性特点">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bg-[#efefef] bottom-[24px] h-[73px] left-[9px] overflow-clip w-[312px]">
          <textarea
            value={value}
            onChange={handleInputChange}
            className="absolute font-['Noto_Serif:Regular','Noto_Sans_CJK:Regular','Noto_Sans_KR:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal h-[63px] leading-[normal] left-[5px] text-[16px] text-black top-[5px] w-[302px] bg-transparent border-none outline-none resize-none"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
            placeholder=""
          />
        </div>
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Medium','Noto_Sans_CJK:Medium',sans-serif] font-medium justify-center leading-[0] left-[100px] right-[101px] text-[10px] text-black text-center top-[95px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{label}</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}
