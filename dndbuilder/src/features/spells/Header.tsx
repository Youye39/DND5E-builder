import { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import HeaderBrand from "../../shared/ui/logo";
import { useCharacter } from "../../shared/storage/CharacterContext";
import type { ExtraBonus } from "../../shared/types/types";
import SpellBonusTooltip from "./SpellBonusTip";
import { sheetColors } from "../../shared/tokens/colors";
import ScrollArea from "../../shared/ui/ScrollArea";
import classData from "../../../data/classData.json";

/** Shared shell for an info field (label + value box + border) */
function InfoFieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-[113px] relative w-[170px]" data-name="施法信息">
      <div className="absolute contents inset-0">
        <div className="absolute bg-white inset-[15.93%_0_0_0] rounded-[2px]">
          <div className="relative rounded-[inherit] size-full">
            {children}
          </div>
          <div aria-hidden className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[1px_0px_0px_0px_var(--color-sheet-border-secondary),-1px_0px_0px_0px_var(--color-sheet-border-secondary)]" />
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium inset-[0_0_86.73%_2.11%] justify-center leading-[0] text-[#b3b3b3] text-[14px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{label}</p>
        </div>
      </div>
    </div>
  );
}

/** Spellcasting ability with dropdown (portal to body to avoid overflow clipping) */
function AbilityField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const options = ["智力", "感知", "魅力"];

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 10000,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  return (
    <InfoFieldShell label="施法关键属性">
      <div
        ref={triggerRef}
        className="absolute bottom-[11px] h-[73px] right-[15px] w-[140px] cursor-pointer bg-sheet-content-bg hover:bg-sheet-hover-light/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular-cjk font-normal h-[73px] justify-center leading-[0] left-[70px] text-[40px] text-black text-center top-[36.5px] w-[140px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{value}</p>
        </div>
      </div>

      {isOpen && ReactDOM.createPortal(
        <div ref={menuRef} style={menuStyle} className="bg-white border border-sheet-border-placeholder rounded-[2px] shadow-lg">
          {options.map((opt) => (
            <div
              key={opt}
              tabIndex={0}
              className={`px-3 py-1.5 text-[14px] cursor-pointer hover:bg-[#e7e7e7] focus-visible:bg-[#e7e7e7] focus-visible:outline-none ${opt === value ? "bg-[#e7e7e7]" : ""}`}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") { onChange(opt); setIsOpen(false); } }}
            >
              {opt}
            </div>
          ))}
        </div>,
        document.body
      )}
    </InfoFieldShell>
  );
}

/** Clickable value field that opens a tooltip */
function ClickableField({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <div className="h-[113px] relative w-[170px] cursor-pointer" data-name="施法信息" onClick={onClick}>
      <div className="absolute contents inset-0">
        <div className="absolute bg-white inset-[15.93%_0_0_0] rounded-[2px]">
          <div className="relative rounded-[inherit] size-full">
            <div className="absolute bg-sheet-content-bg bottom-[11px] h-[73px] overflow-clip right-[15px] w-[140px] hover:bg-sheet-hover-light/20">
              <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular-cjk font-normal h-[73px] justify-center leading-[0] left-[70px] text-[40px] text-black text-center top-[36.5px] w-[140px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                <p className="leading-[normal]">{value}</p>
              </div>
            </div>
          </div>
          <div aria-hidden className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[1px_0px_0px_0px_var(--color-sheet-border-secondary),-1px_0px_0px_0px_var(--color-sheet-border-secondary)]" />
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium inset-[0_0_86.73%_2.11%] justify-center leading-[0] text-[#b3b3b3] text-[14px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { character, setSpellcastingAbility, updateCharacter } = useCharacter();
  const spellcastingAbility = character?.spellcastingAbility ?? "int";
  const abilityLabel: Record<string, string> = { int: "智力", wis: "感知", cha: "魅力" };
  const abilityReverse: Record<string, "int" | "wis" | "cha"> = { 智力: "int", 感知: "wis", 魅力: "cha" };

  // 内部用中文状态便于 UI 显示
  const [abilityDisplay, setAbilityDisplay] = useState(abilityLabel[spellcastingAbility] ?? "智力");

  // 计算施法属性调整值和法术攻击相关数值
  const attrs = character?.attributes;
  const attrMap: Record<string, "int_value" | "wis_value" | "cha_value"> = {
    int: "int_value", wis: "wis_value", cha: "cha_value",
  };
  const attrValue = attrs?.[attrMap[spellcastingAbility]] ?? 10;
  const abilityMod = Math.floor((attrValue - 10) / 2);
  const profBonus = character?.proficiencyBonus ?? 2;

  // 额外加值求和
  const sumExtras = (extras: ExtraBonus[]) =>
    extras.reduce((sum, eb) => sum + (parseInt(eb.value) || 0), 0);

  const saveDCExtras = character?.spellSaveDCExtras ?? [];
  const attackExtras = character?.spellAttackExtras ?? [];
  const saveDCExtraSum = sumExtras(saveDCExtras);
  const attackExtraSum = sumExtras(attackExtras);

  const attackBonus = abilityMod + profBonus + attackExtraSum;
  const saveDC = 8 + abilityMod + profBonus + saveDCExtraSum;

  // ── 法术位编辑弹窗 ──
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);

  // 从 classData 读取预设法术位
  const classId = character?.basicInfo?.["职业_id"];
  const charLevel = typeof character?.level === "number" ? character.level : 1;
  const classSpellData = classId ? (classData as Record<string, any>)[classId] : null;
  const spellSlotsData = classSpellData?.spellSlots ?? null;

  const getDefaultSlots = (spellLevel: number): number => {
    if (!spellSlotsData || !Array.isArray(spellSlotsData)) return 0;
    const levelEntry = spellSlotsData.find((entry: any) => entry.level === charLevel);
    if (!levelEntry) return 0;
    return levelEntry.slots[spellLevel - 1] ?? 0;
  };

  // 全部 9 个环位
  const ALL_LEVELS = [1, 4, 7, 2, 5, 8, 3, 6, 9];

  // 编辑中的值
  const [editSlots, setEditSlots] = useState<Record<number, string>>({});

  const openSlotDialog = useCallback(() => {
    const initial: Record<number, string> = {};
    for (const lvl of ALL_LEVELS) {
      const custom = character?.customSpellSlots?.[lvl];
      initial[lvl] = custom !== undefined ? String(custom) : String(getDefaultSlots(lvl));
    }
    setEditSlots(initial);
    setSlotDialogOpen(true);
  }, [character?.customSpellSlots, getDefaultSlots]);

  const handleSlotSave = () => {
    const result: Record<number, number> = {};
    for (const [lvl, val] of Object.entries(editSlots)) {
      const n = parseInt(val, 10);
      if (!isNaN(n) && n >= 0) result[Number(lvl)] = n;
    }
    updateCharacter({ customSpellSlots: result });
    setSlotDialogOpen(false);
  };

  // Tooltip 开关与定位
  const [tooltipType, setTooltipType] = useState<"saveDC" | "attack" | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideLocked = useRef(false);
  const saveRef = useRef<HTMLDivElement>(null);
  const attackRef = useRef<HTMLDivElement>(null);

  const scheduleHide = useCallback(() => {
    if (hideLocked.current) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setTooltipType(null), 200);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);

  const handleFocusLock = useCallback(() => { hideLocked.current = true; }, []);
  const handleFocusUnlock = useCallback(() => { hideLocked.current = false; }, []);

  const openTooltip = (type: "saveDC" | "attack") => {
    cancelHide();
    const ref = type === "saveDC" ? saveRef : attackRef;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setTooltipPos({ left: rect.left, top: rect.bottom + 4 });
    setTooltipType(type);
  };

  return (
    <div className="absolute bg-black h-[179px] left-[55px] overflow-clip rounded-tl-[5px] rounded-tr-[5px] shadow-[0px_0px_2px_0px_black] top-[51px] w-[1114px]">
      {/* Group1 containing logo and character name */}
      <div className="absolute contents left-[29px] top-[29px]">
        {/* Group - D&D Logo and title */}
        <HeaderBrand className="absolute contents left-[29px] top-[97px]"/>

        {/* Component2 - Character name and label */}
        <div className="absolute bg-white inset-[26.26%_66.52%_44.13%_2.6%] rounded-[2px] cursor-pointer" onClick={openSlotDialog}>
          <div className="overflow-clip relative rounded-[inherit] size-full">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[53px] justify-center leading-[0] left-[173.5px] text-[24px] text-black text-center top-1/2 w-[327px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              <p className="leading-[normal]">{character?.basicInfo?.职业 || ""}</p>
            </div>
          </div>
          <div aria-hidden className="absolute border-2 border-[#595959] border-solid inset-[-1px] pointer-events-none rounded-[3px]" />
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-serif-medium font-medium inset-[16.2%_81.51%_75.42%_2.87%] justify-center leading-[0] text-[#b3b3b3] text-[14px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          <p className="leading-[normal]">施法职业</p>
        </div>
      </div>

      {/* Spellcasting ability — with dropdown */}
      <div className="absolute left-[448px] top-[29px]">
        <AbilityField
        value={abilityDisplay}
        onChange={(v) => {
          setAbilityDisplay(v);
          const key = abilityReverse[v];
          if (key) setSpellcastingAbility(key);
        }}
      />
      </div>

      {/* Spell save DC — clickable + hover */}
      <div
        className="absolute left-[659px] top-[29px]" ref={saveRef}
        onMouseEnter={() => openTooltip("saveDC")}
        onMouseLeave={scheduleHide}
      >
        <ClickableField label="法术豁免DC" value={`${saveDC}`} onClick={() => openTooltip("saveDC")} />
      </div>

      {/* Spell attack bonus — clickable + hover */}
      <div
        className="absolute left-[870px] top-[29px]" ref={attackRef}
        onMouseEnter={() => openTooltip("attack")}
        onMouseLeave={scheduleHide}
      >
        <ClickableField label="法术攻击加值" value={`${attackBonus >= 0 ? "+" : ""}${attackBonus}`} onClick={() => openTooltip("attack")} />
      </div>

      {/* Tooltip: 法术豁免DC额外加值 */}
      {tooltipType === "saveDC" && (
        <SpellBonusTooltip
          extras={saveDCExtras}
          onUpdate={(extras) => updateCharacter({ spellSaveDCExtras: extras })}
          mouseY={tooltipPos.top}
          cardLeft={tooltipPos.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onFocusLock={handleFocusLock}
          onFocusUnlock={handleFocusUnlock}
        />
      )}

      {/* Tooltip: 法术攻击加值额外加值 */}
      {tooltipType === "attack" && (
        <SpellBonusTooltip
          extras={attackExtras}
          onUpdate={(extras) => updateCharacter({ spellAttackExtras: extras })}
          mouseY={tooltipPos.top}
          cardLeft={tooltipPos.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onFocusLock={handleFocusLock}
          onFocusUnlock={handleFocusUnlock}
        />
      )}

      {/* ════ 法术位编辑弹窗 ════ */}
      {slotDialogOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          onClick={(e) => e.target === e.currentTarget && setSlotDialogOpen(false)}
        >
          <div style={{
            width: "420px", maxHeight: "520px", display: "flex", flexDirection: "column",
            backgroundColor: sheetColors.cardBg, borderRadius: "10px",
            border: "1px solid var(--color-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07)",
            overflow: "hidden", fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}`, flexShrink: 0 }}>
              <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>编辑法术位</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    // 重置：重新从 JSON 读取默认法术位
                    const newEditSlots: Record<number, string> = {};
                    for (const lvl of ALL_LEVELS) {
                      const d = getDefaultSlots(lvl);
                      if (d > 0) newEditSlots[lvl] = String(d);
                    }
                    setEditSlots(newEditSlots);
                  }}
                  style={{ padding: "5px 12px", border: "1px solid var(--color-border)", borderRadius: "2px", fontFamily: "var(--font-serif-medium)", fontSize: "13px", backgroundColor: sheetColors.cardBg, color: sheetColors.textDark, cursor: "pointer", transition: "all 0.1s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.color = "#000"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = sheetColors.textDark; }}
                >
                  重置
                </button>
                <button
                  onClick={handleSlotSave}
                  style={{ padding: "5px 16px", border: `1px solid ${sheetColors.buttonDarkBg}`, borderRadius: "2px", fontFamily: "var(--font-serif-medium)", fontSize: "13px", backgroundColor: sheetColors.buttonDarkBg, color: sheetColors.textWhite, cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
                >
                  保存
                </button>
              </div>
            </div>

            {/* 法术位列表 — 每行三个 */}
            <ScrollArea style={{ flex: 1, padding: "6px 16px 16px", minHeight: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {ALL_LEVELS.map((lvl) => {
                  const defaultVal = getDefaultSlots(lvl);
                  const customVal = editSlots[lvl];
                  return (
                    <div key={lvl} style={{
                      flex: "0 0 calc(33.333% - 6px)", boxSizing: "border-box",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                      <span style={{ fontSize: "13px", fontFamily: "var(--font-serif-medium)", color: sheetColors.textPlaceholder, letterSpacing: "0.04em", flexShrink: 0, fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                        {lvl}环
                      </span>
                      <input
                        type="text"
                        value={customVal ?? String(defaultVal)}
                        onChange={(e) => setEditSlots(p => ({ ...p, [lvl]: e.target.value }))}
                        style={{
                          width: 48, textAlign: "center",
                          fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark,
                          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
                          border: "1px solid transparent", borderRadius: "2px",
                          padding: "2px 4px", outline: "none", backgroundColor: "transparent",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
                        onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; } }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; }}
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
