interface DateDisplayProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateDisplay({ value, onChange }: DateDisplayProps) {
  return (
    <div className="absolute bg-black h-[20px] left-[1032px] rounded-tl-[2px] rounded-tr-[2px] top-[131px] w-[138px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-medium font-medium h-[20px] justify-center leading-[0] right-[14px] text-[12px] text-right text-white top-[10px] w-[110px] bg-transparent outline-none transition-colors hover:bg-sheet-button-dark-bg hover:text-sheet-content-bg"
          style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
        />
      </div>
      <div
        aria-hidden
        className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-tl-[3px] rounded-tr-[3px]"
      />
    </div>
  );
}
