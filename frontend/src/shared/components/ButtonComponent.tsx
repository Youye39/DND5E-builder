import { useState } from "react";

interface ButtonComponentProps {
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function ButtonComponent({
  className,
  checked: controlledChecked,
  onChange
}: ButtonComponentProps) {
  const [internalChecked, setInternalChecked] = useState(false);

  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleClick = () => {
    const newChecked = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  return (
    <div
      className={className || "relative size-[14px] cursor-pointer"}
      data-name="按钮"
      onClick={handleClick}
    >
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 14 14">
        {/* 外层灰底圆 */}
        <circle cx="7" cy="7" fill="var(--fill-0, #EFEFEF)" r="7" />
        {/* 内层白底 + 黑色描边 */}
        <circle cx="7" cy="7" fill="var(--fill-0, white)" r="5.5" stroke="var(--stroke-0, black)" />
        {/* 选中时的黑圆点 */}
        {isChecked && <circle cx="7" cy="7" fill="var(--fill-0, black)" r="3" />}
      </svg>
    </div>
  );
}
