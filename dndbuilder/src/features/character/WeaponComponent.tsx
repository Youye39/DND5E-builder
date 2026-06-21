import { useRef, useEffect, useState } from "react";
import { useIsTouchDevice } from "../../shared/touch/useDelayedTap";

interface AttackComponentProps {
  name?: string;
  attackBonus?: string;
  damage?: string;
  variant?: 'filled' | 'toFill';
  onClick?: () => void;
  onNameEnter?: (e: React.MouseEvent) => void;
  onAttackEnter?: (e: React.MouseEvent) => void;
  onDamageEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  className?: string;
}

function useAutoFontSize(
  containerRef: React.RefObject<HTMLDivElement | null>,
  textRef: React.RefObject<HTMLSpanElement | null>,
  maxSize: number,
  text: string,
) {
  const [fontSize, setFontSize] = useState(maxSize);
  useEffect(() => {
    requestAnimationFrame(() => {
      const container = containerRef.current;
      const el = textRef.current;
      if (!container || !el) return;
      let size = maxSize;
      el.style.fontSize = size + "px";
      // 测量文本实际宽度是否超过容器宽度
      while (el.scrollWidth > container.clientWidth && size > 10) {
        size--;
        el.style.fontSize = size + "px";
      }
      setFontSize(size);
    });
  }, [text, maxSize]);
  return fontSize;
}

export default function AttackComponent({
  name = '',
  attackBonus = '',
  damage = '',
  variant = 'toFill',
  onClick,
  onNameEnter,
  onAttackEnter,
  onDamageEnter,
  onMouseLeave,
  className = '',
}: AttackComponentProps) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const bonusRef = useRef<HTMLSpanElement>(null);
  const damageRef = useRef<HTMLSpanElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const bonusContainerRef = useRef<HTMLDivElement>(null);
  const damageContainerRef = useRef<HTMLDivElement>(null);
  const nameSize = useAutoFontSize(nameContainerRef, nameRef, 18, name);
  const bonusSize = useAutoFontSize(bonusContainerRef, bonusRef, 18, attackBonus);
  const damageSize = useAutoFontSize(damageContainerRef, damageRef, 18, damage);
  const isTouch = useIsTouchDevice();
  const tapTimestamp = useRef(0);

  const handleClick = () => {
    if (!onClick) return;
    if (!isTouch) { onClick(); return; }
    const now = Date.now();
    if (now - tapTimestamp.current < 500) {
      tapTimestamp.current = 0;
      onClick();
    } else {
      tapTimestamp.current = now;
    }
  };

  if (variant === 'toFill') {
    return (
      <div
        className={`h-[28px] ${className}`}
        onMouseEnter={onNameEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          onClick={handleClick}
          className="w-[331px] h-full flex items-center justify-center bg-white border border-dashed border-sheet-border-placeholder rounded-[2px] hover:bg-sheet-bg cursor-pointer"
        >
          <span className="text-[18px] text-sheet-text-placeholder leading-none">+</span>
        </div>
      </div>
    );
  }

  const nameClass = "w-[130px] flex items-center bg-sheet-content-bg hover:bg-sheet-hover-bg cursor-pointer overflow-hidden";
  const bonusClass = "w-[61px] flex items-center bg-sheet-content-bg hover:bg-sheet-hover-bg cursor-pointer overflow-hidden";
  const damageClass = "w-[130px] flex items-center bg-sheet-content-bg hover:bg-sheet-hover-bg cursor-pointer overflow-hidden";

  return (
    <div
      className={`flex h-[28px] gap-[5px] ${className}`}
      onMouseLeave={onMouseLeave}
    >
      <div ref={nameContainerRef} className={nameClass} onClick={handleClick} onMouseEnter={onNameEnter}>
        <span ref={nameRef} className="pl-[5px] font-['Noto_Serif:Regular',sans-serif] text-black leading-none whitespace-nowrap" style={{ fontSize: nameSize }}>{name}</span>
      </div>

      <div ref={bonusContainerRef} className={bonusClass} onClick={handleClick} onMouseEnter={onAttackEnter}>
        <span ref={bonusRef} className="pl-[5px] font-['Noto_Serif:Regular',sans-serif] text-black leading-none whitespace-nowrap" style={{ fontSize: bonusSize }}>{attackBonus}</span>
      </div>

      <div ref={damageContainerRef} className={damageClass} onClick={handleClick} onMouseEnter={onDamageEnter}>
        <span ref={damageRef} className="pl-[5px] font-['Noto_Serif:Regular',sans-serif] text-black leading-none whitespace-nowrap" style={{ fontSize: damageSize }}>{damage}</span>
      </div>
    </div>
  );
}
