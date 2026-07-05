import { useState } from "react";
import ButtonComponent from "../../shared/ui/ButtonComponent";
import svgPaths from "../../assets/star";

interface SkillButtonComponentProps {
  className?: string;
  state?: 0 | 1 | 2 | 3;
  onChange?: (state: 0 | 1 | 2 | 3) => void;
}

export default function SkillButtonComponent({
  state: controlledState,
  onChange,
}: SkillButtonComponentProps) {
  const [internalState, setInternalState] = useState<0 | 1 | 2 | 3>(0);

  const currentState = controlledState !== undefined ? controlledState : internalState;

  const handleClick = () => {
    const nextState = ((currentState + 1) % 4) as 0 | 1 | 2 | 3;
    if (controlledState === undefined) {
      setInternalState(nextState);
    }
    onChange?.(nextState);
  };

  return (
    <div className="absolute" style={{ top: "1px", left: "-1px", bottom: "1px", width: "14px" }}>
      {currentState === 3 ? (
        <div className="flex items-center justify-center size-full" onClick={handleClick}>
          <div className="relative shrink-0 size-[18px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="1.25 1.25 17.5 17.5">
              <path d={svgPaths.p3496b700} fill="var(--fill-0, black)" stroke="var(--stroke-0, #EFEFEF)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ) : currentState === 1 ? (
        <div className="relative size-[14px] cursor-pointer" data-name="半熟练按钮" onClick={handleClick}>
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 14 14">
            {/* 外层灰底圆 */}
            <circle cx="7" cy="7" fill="var(--color-sheet-content-bg)" r="7" />
            {/* 内层白底 + 黑色描边 */}
            <circle cx="7" cy="7" fill="var(--fill-0, white)" r="5.5" stroke="var(--stroke-0, black)" />
            {/* 半熟练时的灰色圆点 */}
            <circle cx="7" cy="7" fill="var(--color-sheet-text-placeholder, #b3b3b3)" r="3" />
          </svg>
        </div>
      ) : (
        <ButtonComponent
          className="relative size-[14px] cursor-pointer"
          checked={currentState === 2}
          onChange={() => handleClick()}
        />
      )}
    </div>
  );
}
