import svgPaths from "../../assets/dnd.ts";

function DndLogo({ className = "" }) {
  return (
    <div className={`flex-shrink-0 size-[34px] ${className}`} data-name="dnd-logo">
      <svg
        className="block w-full h-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 34 34"
      >
        <path d={svgPaths.p1c70ba00} fill="var(--fill-0, #595959)" />
      </svg>
    </div>
  );
}


export default function HeaderBrand({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-[1px] ${className}`}>
      <div className="flex items-center gap-[0px] justify-start">
        <p className="font-['Noto_Serif:Bold',serif] font-bold text-[16px] text-[#595959] h-[21px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          DUNGEONS
        </p>
        <DndLogo className="-ml-[4px]"/>
        <p className="font-['Noto_Serif:Bold',serif] font-bold text-[16px] text-[#595959] h-[21px] -ml-[8px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          DRAGONS
        </p>
        <p className="font-['Noto_Serif:Medium',serif] font-medium text-[12px] text-[#595959] h-[18px] ml-[7px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          5e2014
        </p>
      </div>
      <p className="font-['Noto_Serif:Regular',serif] font-normal text-[10px] text-[#595959] h-[10px] -mt-[10px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        Builder Version 1.0
      </p>
    </div>
  );
}