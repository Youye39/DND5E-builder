interface CharacterInfoFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CharacterInfoField({ label, value, onChange, className = "" }: CharacterInfoFieldProps) {
  return (
    <div className={`absolute h-[51px] w-[209px] ${className}`} data-name="基本信息">
      <p
        className="[word-break:break-word] absolute bottom-[51px] font-['Noto_Serif:Regular',sans-serif] font-normal h-[17px] leading-[normal] left-[3px] text-[#595959] text-[12px] translate-y-full w-[206px]"
        style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
      >
        {label}
      </p>
      <div className="absolute bg-[#efefef] bottom-0 h-[34px] left-0 overflow-clip w-[209px]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular',sans-serif] font-normal h-[34px] justify-center leading-[0] left-[10px] text-[18px] text-black top-[17px] w-[199px] bg-transparent outline-none"
          style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
        />
      </div>
    </div>
  );
}
