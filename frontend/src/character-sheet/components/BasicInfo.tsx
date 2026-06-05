import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

interface BasicInfoProps {
  className?: string;
}

/** 职业/种族/背景 - 悬停灰色覆盖 + 弹出选择窗 */
function SelectableInfoField({
  label,
  value,
  left,
  top,
}: {
  label: string;
  value: string;
  left: number;
  top: number;
  onChange?: (value: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="absolute h-[54px] w-[180px]" style={{ left: `${left}px`, top: `${top}px` }}>
        <div
          className="absolute bg-white inset-[31.48%_0_1.85%_0] rounded-[2px] cursor-pointer transition-all hover:bg-[#e7e7e7]"
          onClick={() => setDialogOpen(true)}
        >
          <div className="overflow-clip relative rounded-[inherit] size-full">
            <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal h-[36px] justify-center leading-[0] left-[calc(50%-80px)] text-[18px] text-black top-1/2 w-[160px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
              <p className="leading-[normal]">{value || ""}</p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px]" />
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Serif:Medium','Noto_Sans_SC:Medium',sans-serif] font-medium inset-[0_1.67%_72.22%_1.67%] justify-center leading-[0] text-[#b3b3b3] text-[12px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">{label}</p>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择{label}</DialogTitle>
          </DialogHeader>
          <div className="py-4" />
        </DialogContent>
      </Dialog>
    </>
  );
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
            className="absolute inset-0 w-full h-full text-left px-[10px] font-['Noto_Serif:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal text-[18px] text-black bg-transparent border-none outline-none"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          />
        </div>
        <div aria-hidden="true" className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px]" />
      </div>
      <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Serif:Medium','Noto_Sans_SC:Medium',sans-serif] font-medium inset-[0_1.67%_72.22%_1.67%] justify-center leading-[0] text-[#b3b3b3] text-[12px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        <p className="leading-[normal]">{label}</p>
      </div>
    </div>
  );
}

export default function BasicInfo({ className }: BasicInfoProps) {
  const [infoFields, setInfoFields] = useState({
    职业: "",
    种族: "",
    背景: "",
    阵营: "",
    玩家名: "",
    经验值: "​",
  });

  const handleFieldChange = (field: string, value: string) => {
    setInfoFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`${className || ""}`} data-name="basic-info">
      <div className="absolute contents left-[396px] top-[30px]" data-name="character-info">
        <SelectableInfoField label="职业" value={infoFields.职业} left={396} top={30} onChange={(v) => handleFieldChange("职业", v)} />
        <SelectableInfoField label="种族" value={infoFields.种族} left={396} top={89} onChange={(v) => handleFieldChange("种族", v)} />
        <SelectableInfoField label="背景" value={infoFields.背景} left={589} top={30} onChange={(v) => handleFieldChange("背景", v)} />
        <InlineInfoField label="阵营" value={infoFields.阵营} left={589} top={89} onChange={(v) => handleFieldChange("阵营", v)} />
        <InlineInfoField label="玩家名" value={infoFields.玩家名} left={782} top={30} onChange={(v) => handleFieldChange("玩家名", v)} />
        <InlineInfoField label="经验值" value={infoFields.经验值} left={782} top={89} onChange={(v) => handleFieldChange("经验值", v)} />
      </div>
    </div>
  );
}
