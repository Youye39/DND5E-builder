import { useState } from "react";
import ButtonComponent from "../../common/ButtonComponent";

interface SavingThrowComponentProps {
  className?: string;
  label: string;
  modifier: number;
  proficiencyBonus?: number;
}

export default function SavingThrowComponent({
  className,
  label,
  modifier,
  proficiencyBonus = 0
}: SavingThrowComponentProps) {
  const [isProficient, setIsProficient] = useState(false);

  const totalModifier = isProficient ? modifier + proficiencyBonus : modifier;
  const modifierText = totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;

  return (
    <div className={className || "h-[16px] relative w-[87px]"} data-name="豁免">
      <div className="absolute contents inset-[0_41.38%_0_26.44%]">
        <div className="absolute bg-[#efefef] inset-[6.25%_42.53%_12.5%_27.59%]" />
        <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular',sans-serif] font-normal inset-[0_41.38%_12.5%_26.44%] justify-center leading-[0] text-[10px] text-black text-center" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{modifierText}</p>
        </div>
        <div className="absolute bottom-0 left-[26.44%] right-[41.38%] top-full">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 1">
              <line id="Line 1" stroke="var(--stroke-0, black)" x2="28" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular','Noto_Sans_CJK:Regular',sans-serif] font-normal inset-[0_0_0_70.11%] justify-center leading-[0] text-[12px] text-black text-center" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        <p className="leading-[normal]">{label}</p>
      </div>
      <ButtonComponent
        className="absolute inset-[6.25%_85.06%_6.25%_-1.15%]"
        checked={isProficient}
        onChange={setIsProficient}
      />
    </div>
  );
}
