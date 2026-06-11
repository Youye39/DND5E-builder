import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/dialogs/dialog";

interface CombatStatBoxProps {
  label: string;
  value: string | number;
  onClick?: () => void;
}

export default function CombatStatBox({ label, value, onClick }: CombatStatBoxProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = onClick ?? (label === "护甲等级" ? () => setDialogOpen(true) : undefined);

  return (
    <>
      <div
        className="bg-white h-[103px] rounded-[2px] w-[100px] cursor-pointer transition-all"
        data-name={label}
        onClick={handleClick}
      >
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-0 text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">{label}</p>
          </div>
          <div className="absolute bg-sheet-content-bg h-[62px] left-[9px] top-[10px] w-[82px] overflow-clip">
            <div
              className={`
                "absolute flex flex-col font-serif-regular font-normal h-[60px] justify-center leading-[0] left-[41px] text-[36px] text-black text-center top-[31px] w-[82px]
                ${label === "护甲等级" ? "hover:bg-sheet-hover-bg cursor-pointer" : ""}
            `}
              style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
            >
              <p className="leading-[normal]">{value}</p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
      </div>

      {label === "护甲等级" && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>选择护甲</DialogTitle>
            </DialogHeader>
            <div className="py-4" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
