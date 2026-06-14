import { useState, useRef, useEffect, useCallback } from "react";

interface CombatStatBoxProps {
  label: string;
  value: string | number;
  editable?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
  onChange?: (val: string) => void;
}

export default function CombatStatBox({ label, value, editable, hoverable, onClick, onChange }: CombatStatBoxProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setEditValue(String(value));
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = useCallback((raw: string) => {
    setEditing(false);
    onChange?.(raw);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit(e.currentTarget.value);
    if (e.key === "Escape") { setEditValue(String(value)); setEditing(false); }
  };

  const handleClick = onClick ?? (editable ? () => {
    setEditValue(String(value));
    setEditing(true);
  } : undefined);

  const showHover = hoverable ?? (onClick ? true : editable ? true : false);

  return (
    <div
      className="bg-white h-[103px] rounded-[2px] w-[100px] transition-all"
      data-name={label}
    >
      <div className="overflow-clip relative rounded-[inherit] size-full" onClick={handleClick}>
        <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-0 text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{label}</p>
        </div>
        <div className="absolute bg-sheet-content-bg h-[62px] left-[9px] top-[10px] w-[82px]">
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 bg-transparent text-center font-serif-regular font-normal text-[36px] text-black outline-none border-none"
              style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
            />
          ) : (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center font-serif-regular font-normal text-[36px] text-black ${showHover ? "cursor-pointer hover:bg-sheet-hover-bg" : ""}`}
              style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
            >
              <p className="leading-[normal] m-0">{value}</p>
            </div>
          )}
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}
