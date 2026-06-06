import { useState } from "react";

interface SlotIndicatorProps {
  totalSlots?: number;
  state?: number;
  onChange?: (state: number) => void;
}

function SlotButton({ filled }: { filled: boolean }) {
  return (
    <div className="relative size-[14px]">
      <svg
        className="absolute inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <circle cx="7" cy="7" fill="white" r="6.5" stroke="var(--color-sheet-svg-fill)" />
      </svg>
      <div
        className={`absolute left-[2px] rounded-[5px] size-[10px] top-[2px] ${
          filled ? "bg-white border-2 border-black border-solid" : "bg-black"
        }`}
      />
    </div>
  );
}

export default function SlotIndicator({
  totalSlots = 0,
  state: controlledState,
  onChange,
}: SlotIndicatorProps) {
  const [internalState, setInternalState] = useState(0);
  const currentState = controlledState ?? internalState;

  const handleClick = (n: number) => {
    const next = currentState === n ? 0 : n;
    if (controlledState === undefined) setInternalState(next);
    onChange?.(next);
  };

  return (
    <div className="absolute contents left-0 top-0">
      {Array.from({ length: totalSlots }).map((_, i) => {
        const n = i + 1; // 1-indexed
        return (
          <div
            key={i}
            className="absolute size-[14px] top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${70 + i * 16}px` }}
            onClick={() => handleClick(n)}
          >
            <SlotButton filled={i < currentState} />
          </div>
        );
      })}
    </div>
  );
}
