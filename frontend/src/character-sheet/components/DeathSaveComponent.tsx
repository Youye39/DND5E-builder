import { useState } from "react";
import ButtonComponent from "../../shared/components/ButtonComponent";

interface DeathSaveComponentProps {
  className?: string;
  label: string;
}

function stateToChecks(state: number): [boolean, boolean, boolean] {
  return [state >= 1, state >= 2, state >= 3];
}

export default function DeathSaveComponent({
  className,
  label
}: DeathSaveComponentProps) {
  const [state, setState] = useState(0);
  const checks = stateToChecks(state);

  const handleClick = (n: 1 | 2 | 3) => {
    setState((prev) => (prev === n ? 0 : n));
  };

  return (
    <div className={className || "h-[14px] relative w-[80px]"} data-name="死豁">
      <div className="absolute bg-[#efefef] inset-[21.43%_8.75%_21.43%_51.25%]" />
      <div className="[word-break:break-word] absolute bottom-0 flex flex-col font-['Noto_Serif:Regular','Noto_Sans_CJK:Regular',sans-serif] font-normal justify-center leading-[0] left-0 right-3/4 text-[10px] text-black top-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        <p className="leading-[normal]">{label}</p>
      </div>
      <ButtonComponent
        className="absolute inset-[0_40%_0_42.5%]"
        checked={checks[0]}
        onChange={() => handleClick(1)}
      />
      <ButtonComponent
        className="absolute inset-[0_20%_0_62.5%]"
        checked={checks[1]}
        onChange={() => handleClick(2)}
      />
      <ButtonComponent
        className="absolute inset-[0_0_0_82.5%]"
        checked={checks[2]}
        onChange={() => handleClick(3)}
      />
    </div>
  );
}
