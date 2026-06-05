import { useState } from "react";

interface LevelDisplayProps {
  level?: number | "";
  onLevelChange?: (level: number | "") => void;
}

export default function LevelDisplay({ level = 1, onLevelChange }: LevelDisplayProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);
  const [isHoveringRight, setIsHoveringRight] = useState(false);

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
      onMouseLeave={() => {
        setIsHovering(false);
        setIsHoveringLeft(false);
        setIsHoveringRight(false);
      }}
    >
      <div className="relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] absolute bottom-[91.5px] flex flex-col font-['Noto_Serif:Bold',sans-serif] font-bold justify-center leading-[0] left-0 right-0 text-[20px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">LEVEL</p>
        </div>
        <div className="absolute bg-[#efefef] h-[62px] left-[9px] top-[40px] w-[82px] overflow-visible">
          {/* 减按钮 */}
          <div
            className="absolute left-[2px] top-1/2 -translate-y-1/2 z-10"
            onMouseEnter={() => setIsHoveringLeft(true)}
            onMouseLeave={() => setIsHoveringLeft(false)}
          >
            <button
              onClick={handleDecrement}
              className={`flex items-center justify-center transition-opacity ${
                isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: 'rotate(180deg)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M3.45539 1.78872C3.29268 1.95145 3.29268 2.21526 3.45539 2.37798L6.07742 5.00002L3.45539 7.62206C3.29268 7.78477 3.29268 8.0486 3.45539 8.21131C3.61809 8.37402 3.88193 8.37402 4.04463 8.21131L6.96131 5.29464C7.03944 5.21652 7.08334 5.11052 7.08334 5.00002C7.08334 4.88952 7.03944 4.78352 6.96131 4.7054L4.04463 1.78872C3.88193 1.62601 3.61809 1.62601 3.45539 1.78872Z" fill={isHovering && isHoveringLeft ? "#595959" : "#b6b6b6"} className="transition-colors" />
              </svg>
            </button>
          </div>
          {/* 输入框 */}
          <input
            type="number"
            value={level}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full flex items-center justify-center font-['Noto_Serif:Regular',sans-serif] font-normal text-[36px] text-black text-center bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          />
          {/* 加按钮 */}
          <div
            className="absolute right-[2px] top-1/2 -translate-y-1/2 z-10"
            onMouseEnter={() => setIsHoveringRight(true)}
            onMouseLeave={() => setIsHoveringRight(false)}
          >
            <button
              onClick={handleIncrement}
              className={`flex items-center justify-center transition-opacity ${
                isHovering ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.45539 1.78872C3.29268 1.95145 3.29268 2.21526 3.45539 2.37798L6.07742 5.00002L3.45539 7.62206C3.29268 7.78477 3.29268 8.0486 3.45539 8.21131C3.61809 8.37402 3.88193 8.37402 4.04463 8.21131L6.96131 5.29464C7.03944 5.21652 7.08334 5.11052 7.08334 5.00002C7.08334 4.88952 7.03944 4.78352 6.96131 4.7054L4.04463 1.78872C3.88193 1.62601 3.61809 1.62601 3.45539 1.78872Z" fill={isHovering && isHoveringRight ? "#595959" : "#b6b6b6"} className="transition-colors" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

