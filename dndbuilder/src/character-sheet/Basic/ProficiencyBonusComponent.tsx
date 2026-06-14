import { useState, useEffect } from "react";

interface ProficiencyBonusComponentProps {
  className?: string;
  label: string;
  level?: number | "";
  initialValue?: number;
  onValueChange?: (value: number) => void;
  showDice?: boolean;
  diceClickable?: boolean;
  showInput?: boolean;
}

const svgPath = "M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z";

export default function ProficiencyBonusComponent({
  className,
  label,
  level = 1,
  initialValue,
  onValueChange,
  showDice = true,
  diceClickable = false,
  showInput = true
}: ProficiencyBonusComponentProps) {
  const effectiveLevel = level === "" ? 1 : level;
  const calculatedBonus = Math.floor((effectiveLevel + 7) / 4);

  // 跟随外部传入的 initialValue 更新（来自 Context 持久化数据）
  const [value, setValue] = useState<number | "">(
    initialValue !== undefined ? initialValue : calculatedBonus
  );
  const [diceActive, setDiceActive] = useState(false);
  const [pop, setPop] = useState(false);

  // 当 externalValue 变化时同步内部状态
  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  // 未提供 initialValue 时，跟随等级自动计算
  useEffect(() => {
    if (initialValue === undefined) {
      setValue(calculatedBonus);
      onValueChange?.(calculatedBonus);
    }
  }, [calculatedBonus]);

  const formatValue = (val: number | ""): string => {
    if (val === "") return "";
    return val >= 0 ? `+${val}` : `${val}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || inputValue === "-" || inputValue === "+") {
      setValue("");
      return;
    }
    const cleanValue = inputValue.replace(/^\+/, "");
    const newValue = parseInt(cleanValue);
    if (!isNaN(newValue)) {
      setValue(newValue);
      onValueChange?.(newValue);
    }
  };

  const handleDiceClick = () => {
    if (!diceClickable) return;

    setDiceActive(!diceActive);

    setPop(true);
    setTimeout(() => setPop(false), 150);
  };

  return (
    <div className={className} data-name="熟练加值">
      <div className="absolute bg-white inset-[2.27%_0] rounded-[2px]">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium h-[42px] justify-center leading-[0] left-[136px] text-[12px] text-black text-center top-[21px] w-[174px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">{label}</p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
      </div>

      {(showDice || showInput) && (
        <div
          className="absolute bg-white inset-[0_78.48%_0_1.79%] group"
          onClick={showDice ? handleDiceClick : undefined}
          style={{ cursor: showDice && diceClickable ? "pointer" : "default" }}
        >
          <div className="overflow-clip relative rounded-[inherit] size-full">
            {showInput && (
              <div className="absolute bg-sheet-content-bg inset-[18.18%_11.36%] overflow-clip">
                <input
                  type="text"
                  value={value === "" ? "" : formatValue(value)}
                  onChange={handleInputChange}
                  className="[word-break:break-word] absolute flex flex-col font-serif-regular font-normal inset-[-25%_-17.65%_-25%_-23.53%] justify-center leading-[0] text-[21px] text-black text-center bg-transparent border-none outline-none"
                  style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
                />
              </div>
            )}

            {showDice && (
              <div className="absolute contents inset-[11.36%]">
                <div
                  className={`absolute inset-[11.36%] transition-transform duration-150
                    ${pop ? "!scale-100" : "scale-100"}
                    group-hover:scale-105
                  `}
                  data-name="未着色"
                >
                  <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="-16 0 512 512">
                    <g filter={diceActive ? undefined : "url(#filter0_i_dice)"}>
                      <path
                        d={svgPath}
                        fill={diceActive ? 'var(--color-sheet-text-primary)' : 'white'}
                        fillOpacity={diceActive ? "1" : "0.1"}
                        stroke="var(--color-sheet-text-secondary)"
                        strokeWidth="8"
                      />
                    </g>
                    {!diceActive && (
                      <defs>
                        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="512" id="filter0_i_dice" width="512" x="-16" y="0">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                          <feOffset dx="0" dy="4" />
                          <feGaussianBlur stdDeviation="4" />
                          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                          <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
                        </filter>
                      </defs>
                    )}
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
        </div>
      )}
    </div>
  );
}
