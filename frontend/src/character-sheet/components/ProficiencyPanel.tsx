import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import SectionContainer from "../../shared/components/SectionContainer";

interface ProficiencyPanelProps {
  className?: string;
}

const items = [
  { key: "armor", label: "护甲" },
  { key: "weapon", label: "武器" },
  { key: "tool", label: "工具" },
  { key: "language", label: "语言" },
] as const;

export default function ProficiencyPanel({ className }: ProficiencyPanelProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const closeDialog = () => setActiveDialog(null);

  return (
    <>
      <SectionContainer title="其他熟练项和语言" className={`${className || ""} w-[358px] h-[288px]`}>
        <div className="absolute top-[9px] left-[9px] right-[9px] bottom-[33px] bg-[#efefef] p-[5px]">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveDialog(item.key)}
              className="block w-full text-left font-['Noto_Serif:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] text-[18px] text-black leading-normal mb-0 border-none cursor-pointer hover:bg-[#e7e7e7] px-1"
            >
              {item.label}：
            </button>
          ))}
        </div>
      </SectionContainer>

      {/* 弹窗 */}
      {items.map((item) => (
        <Dialog key={item.key} open={activeDialog === item.key} onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{item.label}</DialogTitle>
            </DialogHeader>
            <div className="min-h-[100px]" />
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
