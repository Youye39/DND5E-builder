import { useState } from "react";
import StepperButton from "../../shared/ui/StepperButton";

interface LevelDisplayProps {
  level?: number | "";
  onLevelChange?: (level: number | "") => void;
}

export default function LevelDisplay({ level = 1, onLevelChange }: LevelDisplayProps) {
  const [isHovering, setIsHovering] = useState(false);

  const effectiveLevel = level === "" ? 1 : level;

  const handleDecrement = () => {
    const newValue = Math.max(1, effectiveLevel - 1);
    onLevelChange?.(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(20, effectiveLevel + 1);
    onLevelChange?.(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onLevelChange?.("");
    } else {
      const newValue = parseInt(inputValue);
      if (!isNaN(newValue)) {
        onLevelChange?.(Math.min(20, Math.max(1, newValue)));
      }
    }
  };

  return (
    <div
      className="absolute bg-white h-[112px] left-[985px] rounded-[2px] top-[30px] w-[100px]"
      data-name="level"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] absolute bottom-[91.5px] flex flex-col font-serif-bold font-bold justify-center leading-[0] left-0 right-0 text-[20px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">LEVEL</p>
        </div>
        <div className="absolute bg-sheet-content-bg h-[62px] left-[9px] top-[40px] w-[82px] overflow-visible">
          {/* 减按钮 */}
          <StepperButton
            direction="left"
            onClick={handleDecrement}
            visible={isHovering}
            className="absolute left-[2px] top-1/2 -translate-y-1/2 z-10"
          />
          {/* 输入框 */}
          <input
            type="number"
            value={level}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full flex items-center justify-center font-serif-regular font-normal text-[36px] text-black text-center bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          />
          <StepperButton
            direction="right"
            onClick={handleIncrement}
            visible={isHovering}
            className="absolute right-[2px] top-1/2 -translate-y-1/2 z-10"
          />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-sheet-border-secondary border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

