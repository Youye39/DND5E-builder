import { useState, useRef, useEffect } from "react";
import { useCharacter } from "../../shared/storage/CharacterContext";
import classIdentifiers from "../../../data/classIdentifiers.json";

interface BasicInfoProps {
  className?: string;
}

function InlineInfoField({
  label,
  value,
  left,
  top,
  onChange,
}: {
  label: string;
  value: string;
  left: number;
  top: number;
  onChange?: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当外部 value 变化时（如切换存档），同步本地编辑值
  useEffect(() => {
    if (!editing) {
      setEditValue(value);
    }
  }, [value, editing]);

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
    <div className="absolute h-[54px] w-[180px]" style={{ left: `${left}px`, top: `${top}px` }}>
      <div
        className="absolute bg-white inset-[31.48%_0_1.85%_0] rounded-[2px] cursor-pointer transition-all"
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
            className="absolute inset-0 w-full h-full text-left px-[10px] font-serif-regular-cjk font-normal text-[18px] text-black bg-transparent border-none outline-none"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          />
        </div>
        <div aria-hidden="true" className="absolute border-2 border-sheet-border-secondary border-solid inset-[-1px] pointer-events-none rounded-[3px]" />
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium inset-[0_1.67%_72.22%_1.67%] justify-center leading-[0] text-sheet-text-placeholder text-[12px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        <p className="leading-[normal]">{label}</p>
      </div>
    </div>
  );
}

/** 从用户输入文字中识别对应的职业 ID */
function detectClassId(input: string): { classId: string; label: string } | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  for (const entry of classIdentifiers) {
    for (const label of entry.labels) {
      if (label.toLowerCase() === trimmed || label.toLowerCase().includes(trimmed) || trimmed.includes(label.toLowerCase())) {
        return { classId: entry.id, label: label };
      }
    }
  }
  return null;
}

export default function BasicInfo({ className }: BasicInfoProps) {
  const { character, updateCharacter } = useCharacter();
  const infoFields = character?.basicInfo ?? {
    职业: "",
    种族: "",
    背景: "",
    阵营: "",
    玩家名: "",
    经验值: "",
  };

  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...infoFields, [field]: value };
    // 职业字段：自动检测并存储 classId
    if (field === "职业") {
      const result = detectClassId(value);
      updated["职业_id"] = result?.classId ?? "";
    }
    updateCharacter({ basicInfo: updated });
  };

  return (
    <div className={`${className || ""}`} data-name="basic-info">
      <div className="absolute contents left-[396px] top-[30px]" data-name="character-info">
        <InlineInfoField label="职业" value={infoFields.职业} left={396} top={30} onChange={(v) => handleFieldChange("职业", v)} />
        <InlineInfoField label="种族" value={infoFields.种族} left={396} top={89} onChange={(v) => handleFieldChange("种族", v)} />
        <InlineInfoField label="背景" value={infoFields.背景} left={589} top={30} onChange={(v) => handleFieldChange("背景", v)} />
        <InlineInfoField label="阵营" value={infoFields.阵营} left={589} top={89} onChange={(v) => handleFieldChange("阵营", v)} />
        <InlineInfoField label="玩家名" value={infoFields.玩家名} left={782} top={30} onChange={(v) => handleFieldChange("玩家名", v)} />
        <InlineInfoField label="经验值" value={infoFields.经验值} left={782} top={89} onChange={(v) => handleFieldChange("经验值", v)} />
      </div>
    </div>
  );
}
