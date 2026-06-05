import { useState, useRef, useEffect } from "react";

interface CharacterNameProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function CharacterName({ value = "", onChange }: CharacterNameProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleStartEdit = () => {
    setEditValue(value);
    setEditing(true);
  };

  const handleFinishEdit = () => {
    setEditing(false);
    onChange?.(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFinishEdit();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className="absolute contents inset-[16.2%_66.52%_44.13%_2.6%]" data-name="character-name">
      <div
        className="absolute bg-white inset-[26.26%_66.52%_44.13%_2.6%] rounded-[2px] cursor-pointer transition-all"
        onClick={handleStartEdit}
      >
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFinishEdit}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full flex items-center justify-center font-['Noto_Serif:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal text-[24px] text-black text-center bg-transparent border-none outline-none"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          />
        </div>
        <div aria-hidden="true" className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px]" />
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Serif:Medium','Noto_Sans_JP:Medium',sans-serif] font-medium inset-[16.2%_81.51%_75.42%_2.87%] justify-center leading-[0] text-[#b3b3b3] text-[14px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        <p className="leading-[normal]">角色名</p>
      </div>
    </div>
  );
}
