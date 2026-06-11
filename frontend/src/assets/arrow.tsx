// SVG arrow path — points right by default.
// Apply CSS transform rotate() for other directions:
//   rotate(180deg) → left   (decrement)
//   rotate(90deg)  → down   (dropdown)
//   rotate(-90deg) → up     (increment, unused)
export const ARROW_PATH =
  "M3.45539 1.78872C3.29268 1.95145 3.29268 2.21526 3.45539 2.37798L6.07742 5.00002L3.45539 7.62206C3.29268 7.78477 3.29268 8.0486 3.45539 8.21131C3.61809 8.37402 3.88193 8.37402 4.04463 8.21131L6.96131 5.29464C7.03944 5.21652 7.08334 5.11052 7.08334 5.00002C7.08334 4.88952 7.03944 4.78352 6.96131 4.7054L4.04463 1.78872C3.88193 1.62601 3.61809 1.62601 3.45539 1.78872Z";

export function ArrowIcon({ rotation = 0, color = "var(--color-sheet-icon-default)", size = 10 }: { rotation?: number; color?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ transform: `rotate(${rotation}deg)` }}>
      <path fillRule="evenodd" clipRule="evenodd" d={ARROW_PATH} fill={color} />
    </svg>
  );
}
