import { useState } from "react";
import HeaderBrand from "../common/logo";

/** Shared shell for an info field (label + value box + border) */
function InfoFieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-[113px] relative w-[170px]" data-name="施法信息">
      <div className="absolute contents inset-0">
        <div className="absolute bg-white inset-[15.93%_0_0_0] rounded-[2px]">
          <div className="relative rounded-[inherit] size-full">
            {children}
          </div>
          <div aria-hidden className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[1px_0px_0px_0px_#595959,-1px_0px_0px_0px_#595959]" />
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Serif:Medium','Noto_Sans_JP:Medium','Noto_Sans_SC:Medium',sans-serif] font-medium inset-[0_0_86.73%_2.11%] justify-center leading-[0] text-[#b3b3b3] text-[14px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{label}</p>
        </div>
      </div>
    </div>
  );
}

/** Static value display */
function StaticField({ label, value }: { label: string; value: string }) {
  return (
    <InfoFieldShell label={label}>
      <div className="absolute bg-[#efefef] bottom-[11px] h-[73px] overflow-clip right-[15px] w-[140px]">
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal h-[73px] justify-center leading-[0] left-[70px] text-[40px] text-black text-center top-[36.5px] w-[140px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{value}</p>
        </div>
      </div>
    </InfoFieldShell>
  );
}

/** Spellcasting ability with dropdown */
function AbilityField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["智力", "感知", "魅力"];

  return (
    <InfoFieldShell label="施法关键属性">
      <div
        className="absolute bottom-[11px] h-[73px] right-[15px] w-[140px] cursor-pointer bg-[#efefef] hover:bg-[#e7e7e7]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal h-[73px] justify-center leading-[0] left-[70px] text-[40px] text-black text-center top-[36.5px] w-[140px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{value}</p>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-10 bg-white border border-[#ccc] rounded-[2px] shadow-lg">
            {options.map((opt) => (
              <div
                key={opt}
                className={`px-3 py-1.5 text-[14px] cursor-pointer hover:bg-[#e7e7e7] ${opt === value ? "bg-[#efefef] font-bold" : ""}`}
                onClick={() => { onChange(opt); setIsOpen(false); }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </InfoFieldShell>
  );
}

export default function Header() {
  const [ability, setAbility] = useState("智力");

  return (
    <div className="absolute bg-black h-[179px] left-[55px] overflow-clip rounded-tl-[5px] rounded-tr-[5px] shadow-[0px_0px_2px_0px_black] top-[51px] w-[1114px]">
      {/* Group1 containing logo and character name */}
      <div className="absolute contents left-[29px] top-[29px]">
        {/* Group - D&D Logo and title */}
        <HeaderBrand className="absolute contents left-[29px] top-[97px]"/>

        {/* Component2 - Character name and label */}
        <div className="absolute bg-white inset-[26.26%_66.52%_44.13%_2.6%] rounded-[2px]">
          <div className="overflow-clip relative rounded-[inherit] size-full">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Noto_Serif:Regular',sans-serif] font-normal h-[53px] justify-center leading-[0] left-[173.5px] text-[24px] text-black text-center top-1/2 w-[327px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              <p className="leading-[normal]">占位符</p>
            </div>
          </div>
          <div aria-hidden className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px]" />
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Serif:Medium',sans-serif] font-medium inset-[16.2%_81.51%_75.42%_2.87%] justify-center leading-[0] text-[#b3b3b3] text-[14px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">施法职业</p>
        </div>
      </div>

      {/* Spellcasting ability — with dropdown */}
      <div className="absolute left-[448px] top-[29px]">
        <AbilityField value={ability} onChange={setAbility} />
      </div>

      {/* Spell save DC */}
      <div className="absolute left-[659px] top-[29px]">
        <StaticField label="法术豁免DC" value="8" />
      </div>

      {/* Spell attack bonus */}
      <div className="absolute left-[870px] top-[29px]">
        <StaticField label="法术攻击加值" value="+0" />
      </div>
    </div>
  );
}
