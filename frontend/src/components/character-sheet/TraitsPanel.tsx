import { useState } from "react";
import SectionContainer from "../common/SectionContainer";

interface TraitsPanelProps {
  className?: string;
}

export default function TraitsPanel({ className }: TraitsPanelProps) {
  const [value, setValue] = useState("");

  return (
    <SectionContainer title="特性和特质" className={`${className || ""} w-[358px] h-[770px]`}>
      <div className="absolute top-[9px] left-[9px] right-[9px] bottom-[33px] bg-[#efefef] p-[5px]">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-full font-['Noto_Serif:Regular','Noto_Sans_JP:Regular',sans-serif] text-[18px] text-black leading-normal bg-transparent border-none outline-none resize-none"
        />
      </div>
    </SectionContainer>
  );
}
