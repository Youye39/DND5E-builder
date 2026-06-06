import { useState } from "react";

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
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const [isHoveringRight, setIsHoveringRight] = useState(false);
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
        <div
          onMouseEnter={() => setIsHoveringLeft(true)}
          onMouseLeave={() => setIsHoveringLeft(false)}
        >
          <button
            onClick={handleDecrement}
            className={`flex-shrink-0 w-[10px] h-[20px] flex items-center justify-center transition-opacity ${
              isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title="减少"
            style={{ transform: 'translateX(12px)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: 'rotate(180deg)' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M3.45539 1.78872C3.29268 1.95145 3.29268 2.21526 3.45539 2.37798L6.07742 5.00002L3.45539 7.62206C3.29268 7.78477 3.29268 8.0486 3.45539 8.21131C3.61809 8.37402 3.88193 8.37402 4.04463 8.21131L6.96131 5.29464C7.03944 5.21652 7.08334 5.11052 7.08334 5.00002C7.08334 4.88952 7.03944 4.78352 6.96131 4.7054L4.04463 1.78872C3.88193 1.62601 3.61809 1.62601 3.45539 1.78872Z" fill={isHovering && isHoveringLeft ? 'var(--color-sheet-icon-hover)' : 'var(--color-sheet-icon-default)'} className="transition-colors" />
            </svg>
          </button>
        </div>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          className="flex-shrink-0 w-16 h-12 font-serif-regular font-normal text-[36px] text-black text-center bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        />
        {/* 加按钮 */}
        <div
          onMouseEnter={() => setIsHoveringRight(true)}
          onMouseLeave={() => setIsHoveringRight(false)}
        >
          <button
            onClick={handleIncrement}
            className={`flex-shrink-0 w-[10px] h-[20px] flex items-center justify-center transition-opacity ${
              isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title="增加"
            style={{ transform: 'translateX(-12px)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.45539 1.78872C3.29268 1.95145 3.29268 2.21526 3.45539 2.37798L6.07742 5.00002L3.45539 7.62206C3.29268 7.78477 3.29268 8.0486 3.45539 8.21131C3.61809 8.37402 3.88193 8.37402 4.04463 8.21131L6.96131 5.29464C7.03944 5.21652 7.08334 5.11052 7.08334 5.00002C7.08334 4.88952 7.03944 4.78352 6.96131 4.7054L4.04463 1.78872C3.88193 1.62601 3.61809 1.62601 3.45539 1.78872Z" fill={isHovering && isHoveringRight ? 'var(--color-sheet-icon-hover)' : 'var(--color-sheet-icon-default)'} className="transition-colors" />
            </svg>
          </button>
        </div>
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

