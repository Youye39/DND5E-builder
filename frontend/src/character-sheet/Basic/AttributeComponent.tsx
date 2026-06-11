import { useState } from "react";
import StepperButton from "../weapons/StepperButton";

interface AttributeComponentProps {
  className?: string;
  label: string;
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

export default function AttributeComponent({
  className,
  label,
  initialValue = 10,
  onValueChange
}: AttributeComponentProps) {
  const [value, setValue] = useState<number | "">(initialValue);
  const [isHovering, setIsHovering] = useState(false);

  const calculateModifier = (attrValue: number | ""): string => {
    if (attrValue === "") return "+0";
    const modifier = Math.floor((attrValue - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setValue("");
      onValueChange?.(10);
    } else {
      const newValue = parseInt(inputValue);
      if (!isNaN(newValue)) {
        setValue(newValue);
        onValueChange?.(newValue);
      }
    }
  };

  const handleDecrement = () => {
    const currentValue = value === "" ? 10 : value;
    const newValue = Math.max(1, currentValue - 1);
    setValue(newValue);
    onValueChange?.(newValue);
  };

  const handleIncrement = () => {
    const currentValue = value === "" ? 10 : value;
    const newValue = Math.min(30, currentValue + 1);
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div 
      className={className || "h-[125px] relative w-[97px]"} 
      data-name="属性"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute bg-white border-2 border-black border-solid inset-[0_0_10.4%_0] overflow-clip rounded-[4px] shadow-[0px_-1px_0px_0px_black,0px_1.5px_0px_0px_black]">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium h-[17px] justify-center leading-[0] left-[46px] text-[12px] text-black text-center top-[13.5px] w-[44px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{label}</p>
        </div>
      </div>
      <div 
        className="absolute bg-sheet-content-bg inset-[23.2%_10.31%_32.8%_9.28%] overflow-visible flex items-center justify-center gap-2 group"
      >
        {/* 减按钮 */}
        <StepperButton
          direction="left"
          onClick={handleDecrement}
          visible={isHovering}
          className="flex-shrink-0"
        />
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          className="flex-shrink-0 w-16 h-12 font-serif-regular font-normal text-[36px] text-black text-center bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        />
        {/* 加按钮 */}
        <StepperButton
          direction="right"
          onClick={handleIncrement}
          visible={isHovering}
          className="flex-shrink-0"
        />
      </div>
      <div className="absolute contents inset-[72%_23.71%_0_22.68%]">
        <div className="absolute inset-[72%_23.71%_0_22.68%]">
          <div className="absolute inset-[-2.86%_-1.92%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 37">
              <ellipse cx="27" cy="18.5" fill="var(--fill-0, white)" rx="26" ry="17.5" stroke="var(--stroke-0, black)" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-serif-regular font-normal inset-[72%_23.71%_0_22.68%] justify-center leading-[0] text-[15px] text-black text-center" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{calculateModifier(value)}</p>
        </div>
      </div>
    </div>
  );
}

