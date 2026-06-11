import { useRef, useEffect } from "react";

interface EditableScrollAreaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  innerClassName?: string;
  placeholder?: string;
}

export default function EditableScrollArea({
  value,
  onChange,
  className = "",
  innerClassName = "",
  placeholder = "",
}: EditableScrollAreaProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && divRef.current.textContent !== value) {
      divRef.current.textContent = value;
    }
  }, [value]);

  const handleInput = () => {
    if (divRef.current) {
      onChange(divRef.current.textContent || "");
    }
  };

  return (
    <div className={`group bg-sheet-content-bg overflow-y-auto ${className}`}>
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className={`font-serif-regular font-normal leading-[normal] text-[18px] text-black bg-transparent outline-none min-h-full [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-gray-400 ${innerClassName}`}
        style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100', whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      />
      <style>{`
        .group::-webkit-scrollbar { width: 3px; display: block; }
        .group::-webkit-scrollbar-track { background: transparent; }
        .group::-webkit-scrollbar-thumb { background: transparent; border-radius: 1.5px; }
        .group { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .group:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); }
        .group:hover { scrollbar-color: rgba(0,0,0,0.3) transparent; }
      `}</style>
    </div>
  );
}
