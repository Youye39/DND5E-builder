import { useState } from "react";

export default function Cantrip() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spellName, setSpellName] = useState("");

  return (
    <div className="bg-white h-[24px] overflow-clip relative w-[348px]" data-name="戏法">
      {/* Text area — click to open modal */}
      <div
        className="absolute bg-white bottom-[3px] left-[22px] overflow-clip right-[12px] top-0 hover:bg-[#b3b3b3]/20 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {spellName ? (
          <div className="-translate-y-full [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal h-[23px] justify-end leading-[0] left-[16px] text-[16px] text-black top-[22px] w-[316px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <p className="leading-[normal]">{spellName}</p>
          </div>
        ) : (
          <div className="-translate-y-full [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal h-[23px] justify-end leading-[0] left-[16px] text-[16px] text-[#ccc] top-[22px] w-[316px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <p className="leading-[normal]"></p>
          </div>
        )}
      </div>
      {/* Bottom divider line */}
      <div className="absolute left-[20px] right-[10px] top-[23px] h-0">
        <div className="relative h-px">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 318 1">
            <line id="Line 2" stroke="var(--stroke-0, #444444)" x2="318" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CantripModal
          spellName={spellName}
          onSubmit={(name) => {
            setSpellName(name);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

interface CantripModalProps {
  spellName: string;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

function CantripModal({ spellName, onSubmit, onClose }: CantripModalProps) {
  const [name, setName] = useState(spellName);

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
            placeholder="戏法名称"
            className="border border-[#ccc] rounded px-2 py-1 text-[14px] outline-none focus:border-black"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={onClose}
              className="px-3 py-1 text-[12px] text-[#595959] hover:text-black"
            >
              取消
            </button>
            <button
              onClick={() => onSubmit(name)}
              className="px-3 py-1 text-[12px] bg-black text-white rounded hover:bg-[#333]"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
