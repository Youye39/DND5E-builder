import { useState } from "react";
import { ArrowIcon } from "../../assets/arrow";

interface StepperButtonProps {
  direction?: "left" | "right" | "down";
  onClick: () => void;
  visible?: boolean;
  className?: string;
}

export default function StepperButton({ direction = "right", onClick, visible = true, className = "" }: StepperButtonProps) {
  const [hovered, setHovered] = useState(false);
  const rotation = direction === "left" ? 180 : direction === "down" ? 90 : 0;
  const color = hovered ? "var(--color-sheet-icon-hover)" : "var(--color-sheet-icon-default)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
    >
      <button
        onClick={onClick}
        className={`flex items-center justify-center transition-opacity ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
      >
        <ArrowIcon rotation={rotation} color={color} />
      </button>
    </div>
  );
}
