import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import AttackComponent from './AttackComponent';
import SectionContainer from "../../common/SectionContainer";

interface AttackPanelProps {
  className?: string;
}

export default function AttackPanel({ className }: AttackPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <>
      <SectionContainer title="攻击" className={`${className || ""} w-[358px] h-[304px]`}>
        {/* 表头 */}
        <div className="absolute top-[7px] left-[13px] right-[14px] flex text-[10px] text-[#595959] font-['Noto_Serif:Regular',sans-serif] gap-[5px]">
          <span className="w-[130px]">武器</span>
          <span className="w-[61px]">攻击加值</span>
          <span className="w-[130px]">伤害/类型</span>
        </div>

        {/* 武器列表 */}
        <div className="absolute top-[23px] left-[13px] right-[14px] flex flex-col gap-[8px]">
          {(() => {
            const weapons = [
              { variant: 'filled', name: '短剑', attackBonus: '+8', damage: '1d8+5挥砍' },
              { variant: 'toFill', name: '', attackBonus: '', damage: '' },
              { variant: 'empty', name: '', attackBonus: '', damage: '' },
            ];

            return weapons.map((w, i) => (
              <AttackComponent
                key={i}
                variant={w.variant as any}
                name={w.name}
                attackBonus={w.attackBonus}
                damage={w.damage}
                onClick={() => {
                  if (w.variant === 'toFill' || w.variant === 'filled') setOpenIndex(i);
                }}
              />
            ));
          })()}
        </div>
      </SectionContainer>

      <Dialog open={openIndex !== null} onOpenChange={(open) => { if (!open) setOpenIndex(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择武器</DialogTitle>
            <DialogDescription>在此处实现武器选择逻辑或显示占位内容。</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setOpenIndex(null)}>关闭</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
