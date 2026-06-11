import SectionContainer from "../../shared/components/SectionContainer";
import { useCharacter } from "../../shared/storage/CharacterContext";

interface TraitsPanelProps {
  className?: string;
}

export default function TraitsPanel({ className }: TraitsPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const value = character?.traits ?? "";

  return (
    <SectionContainer title="特性和特质" className={`${className || ""} w-[358px] h-[770px]`}>
      <div className="absolute top-[9px] left-[9px] right-[9px] bottom-[33px] bg-sheet-content-bg p-[5px]">
        <textarea
          value={value}
          onChange={(e) => updateCharacter({ traits: e.target.value })}
          className="w-full h-full font-serif-regular-cjk text-[18px] text-black leading-normal bg-transparent border-none outline-none resize-none"
        />
      </div>
    </SectionContainer>
  );
}
