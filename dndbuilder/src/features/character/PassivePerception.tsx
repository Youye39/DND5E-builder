interface PassivePerceptionProps {
  /** 察觉技能的总加值（含属性调整值 + 熟练/专精加值） */
  perceptionTotal?: number;
}

export default function PassivePerception({
  perceptionTotal = 0
}: PassivePerceptionProps) {
  const passivePerceptionValue = 10 + perceptionTotal;

  return (
    <div className="h-[44px] relative w-[358px]" data-name="被动感知（察觉）" style={{ left: '-1px' }}>
      <div className="absolute bg-white inset-[2.27%_0] rounded-[2px]">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-[207px] text-[12px] text-black text-center top-[21px] w-[316px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">被动感知（察觉）</p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_-1px_0px_0px_black,0px_1px_0px_0px_black]" />
      </div>
      <div className="absolute contents inset-[0_81.84%_0_1.68%]">
        <div className="absolute bg-white inset-[0_81.84%_0_1.68%]">
          <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-2px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
        </div>
        <div className="absolute bg-sheet-content-bg inset-[18.18%_83.52%_18.18%_3.35%]" />
        <div className="[word-break:break-word] absolute flex flex-col font-serif-regular font-normal inset-[2.27%_81.84%_2.27%_1.68%] justify-center leading-[0] text-[21px] text-black text-center" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{passivePerceptionValue}</p>
        </div>
      </div>
    </div>
  );
}