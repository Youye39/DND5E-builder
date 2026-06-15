import { useState } from "react";
import ButtonComponent from "../../shared/ui/ButtonComponent";
import svgPaths from "../../assets/star";

interface SkillButtonComponentProps {
  className?: string;
  state?: 0 | 1 | 2;
  onChange?: (state: 0 | 1 | 2) => void;
}

export default function SkillButtonComponent({
  state: controlledState,
  onChange,
}: SkillButtonComponentProps) {
  const [internalState, setInternalState] = useState<0 | 1 | 2>(0);

  const currentState = controlledState !== undefined ? controlledState : internalState;

  const handleClick = () => {
    const nextState = ((currentState + 1) % 3) as 0 | 1 | 2;
    if (controlledState === undefined) {
      setInternalState(nextState);
    }
    onChange?.(nextState);
  };

  return (
    <div className="absolute inset-[6.25%_89.76%_6.25%_-0.79%]">
      {currentState === 2 ? (
        <div className="flex items-center justify-center size-full" onClick={handleClick}>
          <div className="relative shrink-0 size-[18px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="1.25 1.25 17.5 17.5">
              <path d={svgPaths.p3496b700} fill="var(--fill-0, black)" stroke="var(--stroke-0, #EFEFEF)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ) : (
        <ButtonComponent
          className="size-[14px]"
          checked={currentState === 1}
          onChange={() => handleClick()}
        />
      )}
    </div>
  );
}
