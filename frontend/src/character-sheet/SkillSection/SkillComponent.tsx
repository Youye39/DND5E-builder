import SkillButtonComponent from "./SkillButtonComponent";

interface SkillComponentProps {
  className?: string;
  skillName: string;
  attributeName: string;
  modifier: number;
  proficiencyBonus?: number;
  state?: 0 | 1 | 2;
  onStateChange?: (state: 0 | 1 | 2) => void;
}

export default function SkillComponent({
  className,
  skillName,
  attributeName,
  modifier,
  proficiencyBonus = 0,
  state = 0,
  onStateChange,
}: SkillComponentProps) {
  const totalModifier =
    state === 0
      ? modifier
      : state === 1
      ? modifier + proficiencyBonus
      : modifier + 2 * proficiencyBonus;

  const modifierText =
    totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;

  return (
    <div className={className || "h-[16px] relative w-[127px]"} data-name="技能">
      <div className="absolute contents inset-[0_59.84%_0_18.11%]">
        <div className="absolute bg-sheet-content-bg inset-[6.25%_60.63%_12.5%_18.9%]" />
        <div className="[word-break:break-word] absolute flex flex-col font-serif-regular font-normal inset-[0_59.84%_12.5%_18.11%] justify-center leading-[0] text-[10px] text-black text-center" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{modifierText}</p>
        </div>
        <div className="absolute bottom-0 left-[18.11%] right-[59.84%] top-full">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 1">
              <line id="Line 1" stroke="var(--stroke-0, black)" x2="28" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-serif-regular font-normal inset-[0_31.5%_0_48.03%] justify-center leading-[0] text-[12px] text-black text-center" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
        <p className="leading-[normal]">{skillName}</p>
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-serif-regular font-normal inset-[0_0_0_68.5%] justify-center leading-[0] text-sheet-text-secondary text-[10px] text-center" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
        <p className="leading-[normal]">（{attributeName}）</p>
      </div>
      <SkillButtonComponent state={state} onChange={onStateChange} />
    </div>
  );
}
