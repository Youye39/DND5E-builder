interface CoinComponentProps {
  className?: string;
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function CoinComponent({
  className,
  label,
  value = "",
  onValueChange
}: CoinComponentProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 仅允许数字
    if (/^\d*$/.test(newValue)) {
      onValueChange?.(newValue);
    }
  };

  return (
    <div className={className || "bg-white h-[58px] relative rounded-[2px] w-[56px]"} data-name="钱币">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal justify-center leading-[0] left-0 right-0 text-sheet-text-secondary text-[8px] text-center top-[10.5px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{label}</p>
        </div>
        <div className="absolute bg-sheet-content-bg left-[6px] right-[6px] top-[19px] h-[33px]">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full flex items-center justify-center font-serif-regular font-normal text-[14px] text-black text-center bg-transparent border-none outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
            min="0"
          />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_-1px_0px_0px_black]" />
    </div>
  );
}
