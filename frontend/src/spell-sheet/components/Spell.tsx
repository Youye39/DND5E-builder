import { useState } from "react";
import ButtonComponent from "../../shared/components/ButtonComponent";

interface SpellModalProps {
  spellName: string;
  spellUsage: string;
  onSubmit: (name: string, usage: string) => void;
  onClose: () => void;
}

function SpellModal({ spellName, spellUsage, onSubmit, onClose }: SpellModalProps) {
  const [name, setName] = useState(spellName);
  const [usage, setUsage] = useState(spellUsage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[4px] shadow-lg p-4 min-w-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="法术名称"
            className="border border-[#ccc] rounded px-2 py-1 text-[14px] outline-none focus:border-black"
            autoFocus
          />
          <input
            type="text"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            placeholder="天生施法使用次数"
            className="border border-[#ccc] rounded px-2 py-1 text-[14px] outline-none focus:border-black"
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={onClose}
              className="px-3 py-1 text-[12px] text-sheet-text-secondary hover:text-black"
            >
              取消
            </button>
            <button
              onClick={() => onSubmit(name, usage)}
              className="px-3 py-1 text-[12px] bg-black text-white rounded hover:bg-sheet-text-dark"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Spell() {
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spellName, setSpellName] = useState("");
  const [spellUsage, setSpellUsage] = useState("");

  const handleModalSubmit = (name: string, usage: string) => {
    setSpellName(name);
    setSpellUsage(usage);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white h-[24px] overflow-clip relative w-[348px]" data-name="法术">
      {/* Button — 14×14 circle */}
      <ButtonComponent
        className="absolute left-[12px] top-[5px] size-[14px] cursor-pointer"
        checked={checked}
        onChange={setChecked}
      />
      {/* Text area — click to open modal */}
      <div
        className="[word-break:break-word] absolute bg-white bottom-[3px] font-normal leading-[0] left-[30px] overflow-clip top-0 w-[306px] hover:bg-sheet-hover-light/20 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {spellName ? (
          <div className="-translate-y-full absolute flex flex-col font-serif-regular-cjk h-[23px] justify-end left-[8px] text-[16px] text-black top-[22px] w-[316px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <p className="leading-[normal]">{spellName}</p>
          </div>
        ) : (
          <div className="-translate-y-full absolute flex flex-col font-serif-regular-cjk h-[23px] justify-end left-[8px] text-[16px] text-sheet-text-spell-placeholder top-[22px] w-[316px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <p className="leading-[normal]"></p>
          </div>
        )}
        {spellUsage && (
          <div className="-translate-y-1/2 absolute flex flex-col font-serif-regular justify-center right-2 text-[#595959] text-[12px] text-right top-[12px] w-[36px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <p className="leading-[normal]">{spellUsage}</p>
          </div>
        )}
      </div>
      {/* Bottom divider line */}
      <div className="absolute left-[30px] right-[10px] top-[23px] h-0">
        <div className="relative h-px">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 308 1">
            <line id="Line 2" stroke="var(--color-sheet-svg-stroke)" x2="308" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SpellModal
          spellName={spellName}
          spellUsage={spellUsage}
          onSubmit={handleModalSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
