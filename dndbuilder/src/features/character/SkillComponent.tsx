import React, { useState } from "react";
import SkillButtonComponent from "./SkillButtonComponent";
import { useLanguage } from "../../shared/i18n/LanguageContext";

interface SkillComponentProps {
  className?: string;
  skillName: string;
  attributeName: string;
  modifier: number;
  proficiencyBonus?: number;
  state?: 0 | 1 | 2 | 3;
  onStateChange?: (state: 0 | 1 | 2 | 3) => void;
  customModifier?: string | null;
  onCustomModifierChange?: (value: string | null) => void;
}

export default function SkillComponent({
  className,
  skillName,
  attributeName,
  modifier,
  proficiencyBonus = 0,
  state = 0,
  onStateChange,
  customModifier = null,
  onCustomModifierChange,
}: SkillComponentProps) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState<string>(customModifier ?? "");

  // 计算自动加值
  const halfProf = Math.floor(proficiencyBonus / 2);
  const calculatedModifier =
    state === 0
      ? modifier
      : state === 1
      ? modifier + halfProf
      : state === 2
      ? modifier + proficiencyBonus
      : modifier + 2 * proficiencyBonus;

  // 验证和规范化输入
  const validateModifier = (input: string): string | null => {
    if (!input) return null;
    
    let normalized = input.trim();
    if (/^-?\d+$/.test(normalized)) {
      normalized = normalized.startsWith("-") ? normalized : `+${normalized}`;
    }
    
    if (/^[+-]\d+$/.test(normalized)) {
      return normalized;
    }
    return null;
  };

  // 获取最终显示的修饰符（始终是数字）
  const finalModifier = customModifier !== null && customModifier !== "" 
    ? parseInt(customModifier, 10) 
    : calculatedModifier;
  const modifierText = finalModifier >= 0 ? `+${finalModifier}` : `${finalModifier}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const validated = validateModifier(inputValue);
    
    if (!inputValue) {
      onCustomModifierChange?.(null);
      setInputValue("");
    } else if (validated) {
      const parsedValue = parseInt(validated, 10);
      if (parsedValue === calculatedModifier) {
        onCustomModifierChange?.(null);
        setInputValue("");
      } else {
        onCustomModifierChange?.(validated);
        setInputValue(validated);
      }
    } else {
      setInputValue("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  // 当 customModifier 从外部更新时，同步 inputValue
  React.useEffect(() => {
    setInputValue(customModifier ?? "");
  }, [customModifier]);

  return (
    <div className={className || "h-[16px] relative w-[200px]"} data-name="技能">
      <div className="absolute contents" style={{ top: 0, bottom: 0, left: "23px" }}>
        <div className="absolute bg-sheet-content-bg" style={{ top: "1px", right: "150px", bottom: "2px", left: "24px" }} />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="absolute text-[10px] text-black text-center font-serif-regular border-0 outline-none px-1 leading-[0] flex items-center justify-center placeholder:text-black"
          style={{ top: 0, right: "149px", bottom: "2px", left: "23px", fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          placeholder={modifierText}
        />
        <div className="absolute bottom-0" style={{ left: "23px", right: "149px", top: "auto" }}>
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 1">
              <line id="Line 1" stroke="var(--stroke-0, black)" x2="28" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-serif-regular font-normal justify-center leading-[0] text-[12px] text-black text-center" style={{ top: 0, right: "113px", bottom: 0, left: "61px", fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
        <p className="leading-[normal]">{skillName}</p>
      </div>
      <div className="absolute bottom-0 h-[16px] flex items-center justify-start" style={{ left: "87px" }}>
        <div className="[word-break:break-word] flex flex-col font-serif-regular font-normal justify-center leading-[0] text-sheet-text-secondary text-[10px] text-center flex-shrink-0 w-fit" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{t('skill.attrFormat', { attr: attributeName })}</p>
        </div>
      </div>
      {/* 自定义标签 - 仅在有自定义值时显示 */}
      {customModifier && (
        <div className="absolute bottom-0 h-[16px] flex items-center justify-end group" style={{ left: "150px" }}>
          <div className="[word-break:break-word] flex flex-col font-serif-regular font-normal justify-center leading-[0] text-sheet-text-secondary text-[10px] text-center flex-shrink-0 w-fit" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <p className="leading-[normal]">{t('skill.custom')}</p>
          </div>
          <button
            onClick={() => onCustomModifierChange?.(null)}
            className="ml-0 text-sheet-text-secondary text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-sheet-text-secondary bg-transparent border-0 p-0 leading-[0] w-2.5 h-4 flex items-center justify-center font-serif-regular flex-shrink-0"
          >
            ×
          </button>
        </div>
      )}
      <SkillButtonComponent state={state} onChange={onStateChange} />
    </div>
  );
}
