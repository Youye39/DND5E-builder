import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import svgPaths from "../assets/dnd.ts";
import { sheetColors } from "../shared/tokens/colors";
import ScrollArea from "../shared/ui/ScrollArea";
import AttributeComponent from "../features/character/AttributeComponent.tsx";
import PersonalityTraitComponent from "../features/character/PersonalityTraitComponent.tsx";
import ProficiencyBonusComponent from "../features/character/ProficiencyBonusComponent.tsx";
import SavingThrowPanel from "../features/character/SavingThrowPanel.tsx";
import SkillPanel from "../features/character/SkillPanel.tsx";
import AttackPanel from "../features/character/AttackPanel.tsx";
import ProficiencyPanel from "../features/character/ProficiencyPanel.tsx";
import EquipmentPanel from "../features/character/EquipmentPanel.tsx";
import TraitsPanel from "../features/character/TraitsPanel.tsx";
import DeathSaveComponent from "../features/character/DeathSaveComponent.tsx";
import CoinComponent from "../features/character/CoinComponent.tsx";
import PassivePerception from "../features/character/PassivePerception.tsx";
import LevelDisplay from "../features/character/LevelDisplay.tsx";
import CharacterName from "../features/character/CharacterName.tsx";
import BasicInfo from "../features/character/BasicInfo.tsx";
import CombatStatBox from "../features/character/CombatStatBox.tsx";
import HeaderBrand from "../shared/ui/logo";
import { useCharacter } from "../shared/storage/CharacterContext";
import type { Attributes } from "../shared/storage/types";
import classData from "../../data/classData.json";
import { ARMOR_OPTIONS } from "../../data/armorOptions.ts";
import type { ArmorOption } from "../../data/armorOptions.ts";

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};

// ============================================================================
// Logo 和图标组件
// ============================================================================

function ShortRestClock() {
  return (
    <div className="absolute left-[12px] size-[21px] top-[4px]" data-name="short-rest-icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="short-rest-icon">
          <path d={svgPaths.p248c1e80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function LongRestClock() {
  return (
    <div className="absolute left-[12px] size-[21px] top-[4px]" data-name="long-rest-icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="long-rest-icon">
          <path d={svgPaths.p27c46d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 头部区域
// ============================================================================


function BasicInfoSection({ level, onLevelChange, characterName, onCharacterNameChange }: { level?: number | ""; onLevelChange?: (lvl: number | "") => void; characterName?: string; onCharacterNameChange?: (name: string) => void }) {
  return (
    <div className="absolute bg-black h-[179px] left-[55px] overflow-clip rounded-tl-[5px] rounded-tr-[5px] shadow-[0px_0px_2px_0px_black] top-[51px] w-[1114px]" data-name="basic-info">
      <div className="absolute contents left-[29px] top-[29px]">
        <HeaderBrand className="absolute contents left-[29px] top-[97px]"/>
        <LevelDisplay level={level} onLevelChange={onLevelChange} />
        <BasicInfo />
        <CharacterName value={characterName} onChange={onCharacterNameChange} />
      </div>
    </div>
  );
}

// ============================================================================
// 战斗统计区
// ============================================================================

function CombatStatsRow({ attributes }: { attributes?: Attributes }) {
  const { character, updateCharacter } = useCharacter();
  const [armorDialogOpen, setArmorDialogOpen] = useState(false);

  const strMod = Math.floor(((attributes?.str_value ?? 10) - 10) / 2);
  const dexMod = Math.floor(((attributes?.dex_value ?? 10) - 10) / 2);
  const conMod = Math.floor(((attributes?.con_value ?? 10) - 10) / 2);
  const intMod = Math.floor(((attributes?.int_value ?? 10) - 10) / 2);
  const wisMod = Math.floor(((attributes?.wis_value ?? 10) - 10) / 2);
  const chaMod = Math.floor(((attributes?.cha_value ?? 10) - 10) / 2);
  const defaultInitiative = dexMod;
  const defaultSpeed = 30;

  const selectedArmor = useMemo(() => character?.selectedArmorId
    ? ARMOR_OPTIONS.find(a => a.id === character.selectedArmorId) ?? null
    : null, [character?.selectedArmorId]);
  const shieldBonus = character?.hasShield ? 2 : 0;
  const armorExtra = parseInt(character?.armorExtraBonus ?? "", 10) || 0;
  const shieldExtra = parseInt(character?.shieldExtraBonus ?? "", 10) || 0;
  const acExtrasBonus = (character?.acExtras ?? []).reduce((s, e) => s + (parseInt(e.bonus || "0", 10) || 0), 0);

  // 解析自定义公式：支持数字、+/-、xx调整值（必须在 acValue 之前定义）
  const evalFormula = (formula: string): number => {
    let expr = formula
      .replace(/力量调整值/g, String(strMod))
      .replace(/敏捷调整值/g, String(dexMod))
      .replace(/体质调整值/g, String(conMod))
      .replace(/智力调整值/g, String(intMod))
      .replace(/感知调整值/g, String(wisMod))
      .replace(/魅力调整值/g, String(chaMod));
    try {
      const result = Function('"use strict"; return (' + expr + ')')();
      return typeof result === "number" && isFinite(result) ? Math.max(1, Math.round(result)) : 10;
    } catch {
      return 10;
    }
  };

  const acValue = useMemo(() => {
    const isCustom = character?.selectedArmorId === "custom";
    const formula = character?.customACFormula;
    const extras = acExtrasBonus;
    if (isCustom && formula) {
      try { return evalFormula(formula) + shieldBonus + armorExtra + shieldExtra + extras; } catch { /* fall through */ }
    }
    const base = selectedArmor ? selectedArmor.calcAC(dexMod, conMod, wisMod) : 10 + dexMod;
    return base + shieldBonus + armorExtra + shieldExtra + extras;
  }, [selectedArmor, strMod, dexMod, conMod, intMod, wisMod, chaMod, shieldBonus, armorExtra, shieldExtra, acExtrasBonus, character?.selectedArmorId, character?.customACFormula]);

  const initValue = character?.customInitiative ?? defaultInitiative;
  const speedValue = character?.customSpeed ?? defaultSpeed;

  const handleACSelect = (armor: ArmorOption) => {
    const isSame = character?.selectedArmorId === armor.id;
    const patch: any = { selectedArmorId: armor.id };
    if (!isSame) {
      patch.armorExtraBonus = "";
    }
    updateCharacter(patch);
  };

  const handleArmorExtraChange = (val: string) => {
    updateCharacter({ armorExtraBonus: val.trim() });
  };

  const handleInitiativeChange = (val: string) => {
    const trimmed = val.trim();
    if (trimmed === "") { updateCharacter({ customInitiative: null }); return; }
    const n = parseInt(trimmed, 10) || 0;
    if (n === defaultInitiative) { updateCharacter({ customInitiative: null }); }
    else { updateCharacter({ customInitiative: n }); }
  };

  const handleSpeedChange = (val: string) => {
    const trimmed = val.trim();
    if (trimmed === "") { updateCharacter({ customSpeed: null }); return; }
    const n = parseInt(trimmed, 10) || 0;
    if (n === defaultSpeed) { updateCharacter({ customSpeed: null }); }
    else { updateCharacter({ customSpeed: n }); }
  };

  // 按 typeLabel 分组（盾牌单独处理）
  const armorGroups = useMemo(() => {
    const groups: { label: string; options: ArmorOption[] }[] = [];
    const seen = new Set<string>();
    for (const a of ARMOR_OPTIONS) {
      if (!seen.has(a.typeLabel)) {
        seen.add(a.typeLabel);
        groups.push({ label: a.typeLabel, options: ARMOR_OPTIONS.filter(o => o.typeLabel === a.typeLabel) });
      }
    }
    return groups;
  }, []);

  return (
    <div className="absolute contents">
      <div className="absolute left-[14px] top-[15px]">
        <CombatStatBox label="护甲等级" value={acValue} onClick={() => setArmorDialogOpen(true)} />
      </div>
      <div className="absolute left-[129px] top-[15px]">
        <CombatStatBox label="先攻" value={initValue >= 0 ? `+${initValue}` : `${initValue}`} editable hoverable={false} onChange={handleInitiativeChange} />
      </div>
      <div className="absolute left-[244px] top-[15px]">
        <CombatStatBox label="速度" value={speedValue} editable hoverable={false} onChange={handleSpeedChange} />
      </div>

      {/* 护甲选择弹窗 */}
      {armorDialogOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          onClick={(e) => e.target === e.currentTarget && setArmorDialogOpen(false)}
        >
          <div style={{
            width: "420px", maxHeight: "520px", display: "flex", flexDirection: "column",
            backgroundColor: sheetColors.cardBg, borderRadius: "10px",
            border: "1px solid var(--color-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07)",
            overflow: "hidden", fontVariationSettings: FVAR,
          }}>
            {/* Header: 参考 ItemDialog */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}`, flexShrink: 0 }}>
              <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>选择护甲</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    updateCharacter({ selectedArmorId: null, armorExtraBonus: "", customACFormula: "", acExtras: [] });
                    setArmorDialogOpen(false);
                  }}
                  style={{ padding: "5px 12px", border: "1px solid var(--color-border)", borderRadius: "2px", fontFamily: "var(--font-serif-medium)", fontSize: "13px", backgroundColor: sheetColors.cardBg, color: sheetColors.textDark, cursor: "pointer", transition: "all 0.1s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.color = "#000"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = sheetColors.textDark; }}
                >
                  清空
                </button>
                <button
                  onClick={() => setArmorDialogOpen(false)}
                  style={{ padding: "5px 16px", border: `1px solid ${sheetColors.buttonDarkBg}`, borderRadius: "2px", fontFamily: "var(--font-serif-medium)", fontSize: "13px", backgroundColor: sheetColors.buttonDarkBg, color: sheetColors.textWhite, cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
                >
                  保存
                </button>
              </div>
            </div>

            <ScrollArea style={{ flex: 1, padding: "6px 16px 16px", minHeight: 0 }}>
              {/* 附加项（多选、可自定义） */}
              <div style={{ marginTop: 14, marginBottom: 6, fontSize: "13px", color: sheetColors.textPlaceholder, fontFamily: "var(--font-serif-medium)", letterSpacing: "0.04em" }}>
                附加
              </div>
              {/* 预设项：盾牌 */}
              <div
                onClick={() => {
                  const extras = character?.acExtras ?? [];
                  const existing = extras.find(e => e.id === "shield");
                  updateCharacter({
                    acExtras: existing
                      ? extras.filter(e => e.id !== "shield")
                      : [...extras, { id: "shield", label: "盾牌", bonus: "2" }],
                  });
                }}
                style={{
                  padding: "4px 10px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: (character?.acExtras ?? []).some(e => e.id === "shield") ? sheetColors.contentBg : "transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.contentBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = (character?.acExtras ?? []).some(e => e.id === "shield") ? sheetColors.contentBg : "transparent"; }}
              >
                <span style={{ ...T, fontSize: "13px" }}>盾牌</span>
                {(character?.acExtras ?? []).some(e => e.id === "shield") && (
                  <input
                    type="text"
                    value={`+${character?.acExtras?.find(e => e.id === "shield")?.bonus ?? "2"}`}
                    onChange={(e) => {
                      const extras = [...(character?.acExtras ?? [])];
                      const idx = extras.findIndex(x => x.id === "shield");
                      if (idx >= 0) { extras[idx] = { ...extras[idx], bonus: e.target.value.replace(/^\+/, "") }; }
                      updateCharacter({ acExtras: extras });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      ...T, width: 32, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                      padding: "1px 2px", outline: "none", backgroundColor: "transparent", textAlign: "center",
                    }}
                  />
                )}
              </div>
              {/* 自定义附加项 */}
              {(character?.acExtras ?? []).filter(e => e.id !== "shield").map((ext) => {
                const text = ext.label || "自定义";
                // 估算文本像素宽度：中文字符≈13px，ASCII≈7px，加左右各 2px 空隙
                let pw = 0;
                for (const ch of text) pw += ch.charCodeAt(0) > 127 ? 13 : 7;
                const nameW = Math.max(40, pw + 4);
                return (
                <div key={ext.id} style={{
                  padding: "4px 10px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: sheetColors.contentBg,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
                    <input
                      type="text"
                      value={ext.label}
                      onChange={(e) => {
                        const extras = [...(character?.acExtras ?? [])];
                        const i = extras.findIndex(x => x.id === ext.id);
                        if (i >= 0) { extras[i] = { ...extras[i], label: e.target.value }; }
                        updateCharacter({ acExtras: extras });
                      }}
                      placeholder="自定义"
                      style={{
                        ...T, width: nameW, border: "none", borderRadius: 0,
                        padding: "1px 0", outline: "none", backgroundColor: "transparent",
                        color: ext.label ? sheetColors.textDark : sheetColors.textPlaceholder,
                      }}
                    />
                    <span
                      onClick={(e) => { e.stopPropagation(); updateCharacter({ acExtras: (character?.acExtras ?? []).filter(x => x.id !== ext.id) }); }}
                      style={{ ...T, fontSize: "12px", cursor: "pointer", color: sheetColors.textLighter, flexShrink: 0 }}
                    >
                      ×
                    </span>
                  </div>
                  <input
                    type="text"
                    value={`+${ext.bonus}`}
                    onChange={(e) => {
                      const extras = [...(character?.acExtras ?? [])];
                      const i = extras.findIndex(x => x.id === ext.id);
                      if (i >= 0) { extras[i] = { ...extras[i], bonus: e.target.value.replace(/^\+/, "") }; }
                      updateCharacter({ acExtras: extras });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      ...T, width: 32, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                      padding: "1px 2px", outline: "none", backgroundColor: "transparent", textAlign: "center",
                    }}
                  />
                </div>
                );
              })}
              <div
                onClick={() => {
                  const extras = character?.acExtras ?? [];
                  updateCharacter({
                    acExtras: [...extras, { id: `acextra_${Date.now()}`, label: "", bonus: "1" }],
                  });
                }}
                style={{ padding: "2px 10px", cursor: "pointer", ...T, fontSize: "12px", color: sheetColors.textPlaceholder }}
              >
                + 自定义
              </div>

              {/* 护甲列表 */}
              {armorGroups.map((group) => (
                <div key={group.label}>
                  <div style={{ marginTop: 14, marginBottom: 6, fontSize: "13px", color: sheetColors.textPlaceholder, fontFamily: "var(--font-serif-medium)", letterSpacing: "0.04em" }}>
                    {group.label}
                  </div>
                  {group.options.map((armor) => (
                    <div key={armor.id}>
                      <div
                        onClick={() => handleACSelect(armor)}
                        style={{
                          padding: "4px 10px", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          backgroundColor: character?.selectedArmorId === armor.id ? sheetColors.contentBg : "transparent",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.contentBg; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = character?.selectedArmorId === armor.id ? sheetColors.contentBg : "transparent"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ ...T, fontSize: "13px" }}>{armor.name}</span>
                          {character?.selectedArmorId === armor.id && (
                            armor.id === "custom" ? null : (
                              <input
                                type="text"
                                value={character?.armorExtraBonus ?? ""}
                                onChange={(e) => handleArmorExtraChange(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  ...T, width: 32, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                                  padding: "1px 2px", outline: "none", backgroundColor: "transparent", textAlign: "center",
                                }}
                              />
                            )
                          )}
                        </div>
                        {armor.id === "custom" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <input
                              type="text"
                              value={character?.customACFormula ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCharacter({ customACFormula: val });
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="自定义公式"
                              style={{
                                ...T, width: 160, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                                padding: "1px 4px", outline: "none", backgroundColor: "transparent", textAlign: "right",
                                color: sheetColors.textPlaceholder,
                                fontSize: "12px",
                              }}
                            />
                            <span style={{ ...T, fontSize: "12px", color: sheetColors.textPlaceholder }}>
                              = {character?.customACFormula ? evalFormula(character.customACFormula) : 10}
                            </span>
                          </div>
                        ) : (
                          <span style={{ ...T, fontSize: "12px", color: sheetColors.textPlaceholder }}>
                            {armor.formula} = {armor.calcAC(dexMod, conMod, wisMod)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ============================================================================
// 血量和临时血量区
// ============================================================================

function TempHPDisplay() {
  const { character, updateCharacter } = useCharacter();
  const tempHP = character?.tempHP ?? 0;
  const tempDisplay = tempHP === 0 ? "" : tempHP;

  const handleTempHPChange = (val: string) => {
    const trimmed = val.trim();
    if (trimmed === "") {
      updateCharacter({ tempHP: 0 });
    } else {
      updateCharacter({ tempHP: Math.max(0, parseInt(trimmed, 10) || 0) });
    }
  };

  return (
    <div className="absolute bg-white h-[103px] left-[14px] rounded-[2px] top-[268px] w-[330px]" data-name="temp-hp">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-0 text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">临时生命值</p>
        </div>
        <div className="absolute bg-sheet-content-bg h-[62px] left-[9px] top-[10px] w-[312px]" />
        <AutoFontInput
          value={tempDisplay}
          onChange={handleTempHPChange}
          maxSize={36}
          className="-translate-x-1/2 -translate-y-1/2 absolute bg-transparent text-center font-serif-regular font-normal text-black outline-none"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100", left: 165, width: 312, height: 60, top: 41, border: "none", padding: 0 }}
        />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function AutoFontInput({ value, onChange, className, style, maxSize = 48 }: {
  value: string | number;
  onChange: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  maxSize?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState(maxSize);
  const [editValue, setEditValue] = useState(String(value));

  useEffect(() => {
    setEditValue(String(value));
  }, [value]);

  const commit = useCallback((raw: string) => {
    onChange(raw);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      let size = maxSize;
      el.style.fontSize = size + "px";
      while (el.scrollWidth > el.clientWidth && size > 10) {
        size--;
        el.style.fontSize = size + "px";
      }
      setFontSize(size);
    });
  }, [onChange, maxSize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { commit(e.currentTarget.value); }
    if (e.key === "Escape") { setEditValue(String(value)); (e.target as HTMLInputElement).blur(); }
  };

  return (
    <input
      ref={ref}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onFocus={() => setEditValue(String(value))}
      onBlur={(e) => commit(e.target.value)}
      onKeyDown={handleKeyDown}
      className={className}
      style={{ ...style, fontSize }}
    />
  );
}

function HPDisplay() {
  const { character, updateCharacter } = useCharacter();

  // 计算默认生命值上限（用户未覆盖时使用）
  const computedMaxHP = useMemo(() => {
    if (!character) return 0;
    const classId = character.basicInfo["职业_id"];
    const classEntry = classId ? (classData as any)[classId] : null;
    if (!classEntry) return 0;
    const level = typeof character.level === "number" ? character.level : 1;
    const conMod = Math.floor((character.attributes.con_value - 10) / 2);
    const hp = (classEntry.hitpoints[1] + conMod) * level + classEntry.hitpoints[0] - classEntry.hitpoints[1];
    return Math.max(1, hp);
  }, [character]);

  // 实际使用的生命值上限（用户覆盖值优先）
  const maxHP = character?.customMaxHP ?? computedMaxHP;
  const curHP = character?.currentHP ?? maxHP;

  const handleCurHPChange = (val: string) => {
    const trimmed = val.trim();
    if (trimmed === "") {
      updateCharacter({ currentHP: 0 });
      return;
    }
    let newHP = Math.max(0, parseInt(trimmed, 10) || 0);
    if (newHP > maxHP) newHP = maxHP;
    updateCharacter({ currentHP: newHP });
  };

  const handleMaxHPChange = (val: string) => {
    const trimmed = val.trim();
    if (trimmed === "") {
      updateCharacter({ customMaxHP: null });
      return;
    }
    const newMax = Math.max(1, parseInt(trimmed, 10) || 0);
    if (newMax === computedMaxHP) {
      updateCharacter({ customMaxHP: null });
    } else {
      updateCharacter({ customMaxHP: newMax });
    }
  };

  const inputBase = "-translate-x-1/2 -translate-y-1/2 absolute bg-transparent text-center font-serif-regular font-normal text-black outline-none";

  return (
    <div className="absolute bg-white bottom-[234px] h-[124px] right-[14px] rounded-[2px] w-[330px]" data-name="hp">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-[165px] right-0 text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">生命值上限</p>
        </div>
        <div className="[word-break:break-word] absolute bottom-[16px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-[165px] text-[12px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">当前生命值</p>
        </div>
        <div className="absolute bg-sheet-content-bg h-[83px] left-[9px] top-[10px] w-[141px]" />
        <div className="absolute bg-[#efefef] h-[83px] left-[180px] top-[10px] w-[141px]" />
        <AutoFontInput
          value={curHP}
          onChange={handleCurHPChange}
          className={inputBase}
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100", left: 79, width: 130, height: 60, top: 50, border: "none", padding: 0 }}
        />
        <AutoFontInput
          value={maxHP}
          onChange={handleMaxHPChange}
          className={inputBase}
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100", left: 250, width: 130, height: 60, top: 50, border: "none", padding: 0 }}
        />
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[60px] justify-center leading-[0] left-[165px] text-[48px] text-black text-center top-[50px] w-[20px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
          <p className="leading-[normal]">/</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function HealthSection() {
  return (
    <div className="absolute contents left-[14px] top-[133px]">
      <TempHPDisplay />
      <HPDisplay />
    </div>
  );
}

// ============================================================================
// 休息和生命骰区
// ============================================================================

function RestIcon({ type, onShortRest, onLongRest, onPopupClose, shortRollLog, shortHealInfo, hitDieSize }: {
  type: "short" | "long";
  onShortRest?: () => void;
  onLongRest?: () => void;
  onPopupClose?: () => void;
  shortRollLog?: { value: number }[];
  shortHealInfo?: { diceSum: number; beforeHP: number; afterHP: number };
  hitDieSize?: number;
}) {
  const { character, updateCharacter } = useCharacter();
  const Icon = type === "short" ? ShortRestClock : LongRestClock;
  const label = type === "short" ? "短休" : "长休";
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (type === "long" && character) {
      const classId = character.basicInfo["职业_id"];
      const classEntry = classId ? (classData as any)[classId] : null;
      let maxHP = character.customMaxHP ?? 0;
      if (!character.customMaxHP && classEntry) {
        const level = typeof character.level === "number" ? character.level : 1;
        const conMod = Math.floor((character.attributes.con_value - 10) / 2);
        const hp = (classEntry.hitpoints[1] + conMod) * level + classEntry.hitpoints[0] - classEntry.hitpoints[1];
        maxHP = Math.max(1, hp);
      }
      updateCharacter({ currentHP: maxHP });
      onLongRest?.();
    }
    if (type === "short") {
      onShortRest?.();
      setShowPopup(true);
    }
  };

  // 鼠标离开按钮或弹窗时关闭
  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    const target = e.relatedTarget as Node | null;
    if (popupRef.current && popupRef.current.contains(target)) return;
    if (btnRef.current && btnRef.current.contains(target)) return;
    if (showPopup) {
      setShowPopup(false);
      onPopupClose?.();
    }
  }, [showPopup, onPopupClose]);

  // 计算弹窗内容
  const popupContent = useMemo(() => {
    if (!shortRollLog || shortRollLog.length === 0) return null;
    const count = shortRollLog.length;
    const diceSum = shortRollLog.reduce((s, r) => s + r.value, 0);
    return { hitDieText: `${count}d${hitDieSize ?? 6}`, diceSum };
  }, [shortRollLog]);

  // 弹窗定位
  const [popupPos, setPopupPos] = useState({ left: 0, top: 0 });
  useEffect(() => {
    if (!showPopup || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPopupPos({ left: rect.left, top: rect.top - 6 });
  }, [showPopup]);

  return (
    <div className="bg-black h-[42px] rounded-[2px] w-[45px]" data-name={`${type}-rest`}>
      <div className="overflow-visible relative rounded-[inherit] size-full">
        <div
          ref={btnRef}
          className="relative h-full w-full cursor-pointer transition-all duration-200 hover:scale-110 active:scale-100"
          onClick={handleClick}
          onMouseLeave={handleMouseLeave}
        >
          <Icon />
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-medium-cjk font-medium h-[8px] justify-center leading-[0] left-1/2 text-[10px] text-center text-white top-[calc(50%+10px)] w-[21px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">{label}</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_-1px_0px_0px_black,0px_1px_0px_0px_black]" />

      {/* 短休弹窗（portal 到 body，避免被裁剪） */}
      {type === "short" && showPopup && popupContent && shortHealInfo && shortRollLog && ReactDOM.createPortal(
        <div
          ref={popupRef}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "fixed",
            left: popupPos.left,
            top: popupPos.top,
            transform: "translateY(-100%)",
            zIndex: 9998,
            backgroundColor: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            padding: "8px 12px",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-serif-regular)",
            fontSize: "12px",
            color: "#333",
          }}
        >
          <div style={{ marginBottom: 4 }}>
            消耗：{popupContent.hitDieText}（{shortRollLog.map(r => r.value).join(" + ")} = {popupContent.diceSum}）
          </div>
          <div>
            {shortHealInfo.beforeHP} + {shortHealInfo.diceSum} = {shortHealInfo.afterHP}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function HitDiceDisplay({ remainingHitDice: forcedRemaining }: { remainingHitDice?: number }) {
  const { character } = useCharacter();
  const hitDiceText = useMemo(() => {
    if (!character) return "0";
    const classId = character.basicInfo["职业_id"];
    const classEntry = classId ? (classData as any)[classId] : null;
    if (!classEntry) return "0";
    const level = typeof character.level === "number" ? character.level : 1;
    const remaining = forcedRemaining ?? level;
    return `${remaining}d${classEntry.hitpoints[0]}`;
  }, [character, forcedRemaining]);

  return (
    <div className="absolute bg-white h-[90px] left-[62px] rounded-[2px] top-[386px] w-[149px]" data-name="hit-dice">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute contents right-[9px] top-[10px]">
          <div className="absolute bg-sheet-content-bg h-[56px] overflow-clip right-[9px] top-[10px] w-[131px]">
            <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-serif-regular font-normal h-[56px] justify-center leading-[0] left-[65.5px] text-[24px] text-black text-center top-[28px] w-[131px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
              <p className="leading-[normal]">{hitDiceText}</p>
            </div>
          </div>
          <div className="[word-break:break-word] absolute bottom-[12px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] right-[74.5px] text-[10px] text-black text-center translate-x-1/2 translate-y-1/2 w-[131px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">生命骰</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[-4px_0px_0px_0px_black,0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function DeathSaveDisplay() {
  const { character, updateCharacter } = useCharacter();
  const deathSaves = character?.deathSaves ?? { success: 0, failure: 0 };

  return (
    <div className="absolute bg-white h-[90px] left-[226px] rounded-[2px] top-[386px] w-[118px]" data-name="death-save">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[24px] left-[calc(50%-0.5px)] overflow-clip top-[calc(50%+33px)] w-[117px]">
          <div className="[word-break:break-word] absolute bottom-[12px] flex flex-col font-serif-medium-cjk font-medium justify-center leading-[0] left-0 right-0 text-[10px] text-black text-center translate-y-1/2" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
            <p className="leading-[normal]">死亡豁免</p>
          </div>
        </div>
        <DeathSaveComponent
          className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-1/2 top-[calc(50%-18px)] w-[80px]"
          label="成功"
          value={deathSaves.success}
          onChange={(v) => updateCharacter({ deathSaves: { ...deathSaves, success: v } })}
        />
        <DeathSaveComponent
          className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-1/2 top-[calc(50%+4px)] w-[80px]"
          label="失败"
          value={deathSaves.failure}
          onChange={(v) => updateCharacter({ deathSaves: { ...deathSaves, failure: v } })}
        />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none rounded-[3px] shadow-[0px_1px_0px_0px_black,0px_-1px_0px_0px_black]" />
    </div>
  );
}

function RestsAndDeathSection() {
  const { character, updateCharacter } = useCharacter();
  const [usedHitDice, setUsedHitDice] = useState(0);
  const [rollLog, setRollLog] = useState<{ value: number }[]>([]);

  const level = typeof character?.level === "number" ? character.level : 1;
  const classId = character?.basicInfo["职业_id"];
  const classEntry = classId ? (classData as any)[classId] : null;
  const hitDieSize = classEntry?.hitpoints[0] ?? 6;
  const totalHitDice = level;
  const remaining = Math.max(0, totalHitDice - usedHitDice);

  const [sessionStartHP, setSessionStartHP] = useState<number>();
  const [shortHealInfo, setShortHealInfo] = useState<{ diceSum: number; beforeHP: number; afterHP: number }>();

  const handleShortRest = useCallback(() => {
    if (remaining <= 0 || !character) return;
    const roll = Math.floor(Math.random() * hitDieSize) + 1;
    const newRollLog = [...rollLog, { value: roll }];
    const diceSum = newRollLog.reduce((s, r) => s + r.value, 0);

    // 首次点击时记录弹窗出现前的生命值
    if (sessionStartHP === undefined) {
      setSessionStartHP(character.currentHP ?? 0);
    }

    setUsedHitDice((prev) => prev + 1);
    setRollLog(newRollLog);

    // 回血
    const curHP = character.currentHP ?? 0;
    const conMod = Math.floor((character.attributes.con_value - 10) / 2);
    const computedHP = classEntry ? Math.max(1, (classEntry.hitpoints[1] + conMod) * level + classEntry.hitpoints[0] - classEntry.hitpoints[1]) : 999;
    const maxHP = character.customMaxHP ?? computedHP;
    const newHP = Math.min(curHP + roll, maxHP);
    updateCharacter({ currentHP: newHP });

    const baseHP = sessionStartHP ?? character.currentHP ?? 0;
    setShortHealInfo({ diceSum, beforeHP: baseHP, afterHP: newHP });
  }, [remaining, hitDieSize, character, classEntry, level, updateCharacter, rollLog, sessionStartHP]);

  const handlePopupClose = useCallback(() => {
    setRollLog([]);
    setShortHealInfo(undefined);
    setSessionStartHP(undefined);
  }, []);

  const handleLongRest = useCallback(() => {
    setUsedHitDice(0);
    setRollLog([]);
    setShortHealInfo(undefined);
    setSessionStartHP(undefined);
  }, []);

  return (
    <div className="absolute contents">
      <div className="absolute contents" data-name="rest">
        <div className="absolute left-[14px] top-[386px]">
          <RestIcon type="short" onShortRest={handleShortRest} onPopupClose={handlePopupClose} shortRollLog={rollLog} shortHealInfo={shortHealInfo} hitDieSize={hitDieSize} />
        </div>
        <div className="absolute left-[14px] top-[434px]">
          <RestIcon type="long" onLongRest={handleLongRest} />
        </div>
      </div>
      <HitDiceDisplay remainingHitDice={remaining} />
      <DeathSaveDisplay />
    </div>
  );
}

// ============================================================================
// 战斗面板容器
// ============================================================================

function CombatSection({ attributes }: { attributes?: Attributes }) {
  return (
    <div className="absolute bg-sheet-panel-bg h-[491px] left-[433px] overflow-clip shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] top-[254px] w-[358px]" data-name="combat">
      <CombatStatsRow attributes={attributes} />
      <HealthSection />
      <RestsAndDeathSection />
    </div>
  );
}

// ============================================================================
// 右侧面板：个性特征
// ============================================================================

function PersonalityPanel() {
  const { character, updateCharacter } = useCharacter();
  const personality = character?.personality ?? { 个性特点: "", 理想: "", 牵绊: "", 缺点: "" };

  const setPersonalityField = (field: string, val: string) => {
    updateCharacter({ personality: { ...personality, [field]: val } });
  };

  return (
    <div className="absolute bg-sheet-panel-bg h-[491px] left-[811px] overflow-clip shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] top-[254px] w-[358px]" data-name="personality">
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[15px] w-[330px]"
        label="个性特点"
        value={personality.个性特点}
        onValueChange={(v) => setPersonalityField("个性特点", v)}
      />
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[133px] w-[330px]"
        label="理想"
        value={personality.理想}
        onValueChange={(v) => setPersonalityField("理想", v)}
      />
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[251px] w-[330px]"
        label="牵绊"
        value={personality.牵绊}
        onValueChange={(v) => setPersonalityField("牵绊", v)}
      />
      <PersonalityTraitComponent
        className="absolute bg-white h-[107px] left-[14px] rounded-[2px] top-[369px] w-[330px]"
        label="缺点"
        value={personality.缺点}
        onValueChange={(v) => setPersonalityField("缺点", v)}
      />
    </div>
  );
}

// ============================================================================
// 下方面板：装备和金币
// ============================================================================

function CoinsGrid() {
  const { character, updateCharacter } = useCharacter();
  const coins = character?.coins ?? { cp: "", sp: "", ep: "", gp: "", pp: "" };

  const setCoin = (key: keyof typeof coins, val: string) => {
    updateCharacter({ coins: { ...coins, [key]: val } });
  };

  return (
    <div className="absolute contents left-[448px] top-[1083px]" data-name="coins">
      <CoinComponent
        className="absolute bg-white h-[58px] left-[448px] rounded-[2px] top-[1083px] w-[56px]"
        label="CP"
        value={coins.cp}
        onValueChange={(v) => setCoin("cp", v)}
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[516px] rounded-[2px] top-[1083px] w-[56px]"
        label="SP"
        value={coins.sp}
        onValueChange={(v) => setCoin("sp", v)}
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[584px] rounded-[2px] top-[1083px] w-[56px]"
        label="EP"
        value={coins.ep}
        onValueChange={(v) => setCoin("ep", v)}
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[652px] rounded-[2px] top-[1083px] w-[56px]"
        label="GP"
        value={coins.gp}
        onValueChange={(v) => setCoin("gp", v)}
      />
      <CoinComponent
        className="absolute bg-white h-[58px] left-[720px] rounded-[2px] top-[1083px] w-[56px]"
        label="PP"
        value={coins.pp}
        onValueChange={(v) => setCoin("pp", v)}
      />
    </div>
  );
}

function EquipmentAndCoinsSection() {
  return (
    <div className="absolute contents left-[433px] top-[1083px]" data-name="equipment-and-coins">
      <EquipmentPanel className="absolute left-[433px] top-[1095px]" />
      <CoinsGrid />
    </div>
  );
}

// ============================================================================
// 属性面板
// ============================================================================

function AttributesPanel({
  attributes,
  onAttributeChange,
}: {
  attributes?: Attributes;
  onAttributeChange?: (field: string, value: number) => void;
}) {
  const finalAttributes = attributes || {
    str_value: 10,
    dex_value: 10,
    con_value: 10,
    int_value: 10,
    wis_value: 10,
    cha_value: 10,
  };

  return (
    <div className="absolute bg-sheet-panel-bg h-[903px] left-[55px] overflow-clip shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] top-[254px] w-[121px]" data-name="attributes">
      <div className="absolute contents left-[12px] top-[29px]">
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[29px] w-[97px]" 
          label="力量" 
          initialValue={finalAttributes.str_value || 10}
          onValueChange={(val) => onAttributeChange?.('str_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[173px] w-[97px]" 
          label="敏捷" 
          initialValue={finalAttributes.dex_value || 10}
          onValueChange={(val) => onAttributeChange?.('dex_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[317px] w-[97px]" 
          label="体质" 
          initialValue={finalAttributes.con_value || 10}
          onValueChange={(val) => onAttributeChange?.('con_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[461px] w-[97px]" 
          label="智力" 
          initialValue={finalAttributes.int_value || 10}
          onValueChange={(val) => onAttributeChange?.('int_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[605px] w-[97px]" 
          label="感知" 
          initialValue={finalAttributes.wis_value || 10}
          onValueChange={(val) => onAttributeChange?.('wis_value', val)}
        />
        <AttributeComponent 
          className="absolute h-[125px] left-[12px] top-[749px] w-[97px]" 
          label="魅力" 
          initialValue={finalAttributes.cha_value || 10}
          onValueChange={(val) => onAttributeChange?.('cha_value', val)}
        />
      </div>
    </div>
  );
}

// ============================================================================
// 主要内容区
// ============================================================================

function SkillsPanel({
  attributes,
  proficiencyBonus,
}: {
  attributes?: Attributes;
  proficiencyBonus?: number;
}) {
  const finalAttributes = attributes
    ? {
        str_value: attributes.str_value || 10,
        dex_value: attributes.dex_value || 10,
        con_value: attributes.con_value || 10,
        int_value: attributes.int_value || 10,
        wis_value: attributes.wis_value || 10,
        cha_value: attributes.cha_value || 10,
      }
    : undefined;

  return(
    <SkillPanel
      className="absolute left-[190px] top-[613px]"
      attributes={finalAttributes}
      proficiencyBonus={proficiencyBonus ?? 2}
    />
  );
}

function CharacterCardContent() {
  const { character, setAttributes, setLevel, setProficiencyBonus, updateCharacter } = useCharacter();
  if (!character) return null;

  const { attributes, level, proficiencyBonus } = character;
  const wisdomMod = Math.floor(((attributes?.wis_value ?? 10) - 10) / 2);
  // 察觉技能总加值 = 属性调整值 + (熟练/专精加值)
  const perceptionSkillState = character.skills?.察觉 ?? 0;
  const perceptionTotal =
    perceptionSkillState === 0
      ? wisdomMod
      : perceptionSkillState === 1
        ? wisdomMod + (proficiencyBonus ?? 2)
        : wisdomMod + 2 * (proficiencyBonus ?? 2);

  const handleAttributeChange = (field: string, value: number) => {
    const updated = { ...attributes, [field]: value };
    setAttributes(updated);
  };

  // 等级变化时自动重算熟练加值
  const effectiveLevel = level === "" ? 1 : level;
  useEffect(() => {
    const calcBonus = Math.floor((effectiveLevel + 7) / 4);
    if (proficiencyBonus !== calcBonus) {
      setProficiencyBonus(calcBonus);
    }
  }, [effectiveLevel]);

  return (
    <div className="absolute bg-white h-[1584px] left-0 overflow-clip top-[75px] w-[1224px]" data-name="character-card">
      <BasicInfoSection level={level} onLevelChange={setLevel} characterName={character.name} onCharacterNameChange={(name) => {
        const updated = { ...character, name };
        updateCharacter({ name: updated.name, characterInfo: { ...character.characterInfo, name } });
      }} />
      <TraitsPanel className="absolute left-[811px] top-[762px]" />
      <PersonalityPanel />
      <EquipmentAndCoinsSection />
      <AttackPanel className="absolute left-[433px] top-[762px]" />
      <CombatSection attributes={attributes} />
      <ProficiencyPanel className="absolute left-[55px] top-[1244px]" />
      <SkillsPanel attributes={attributes} proficiencyBonus={proficiencyBonus} />
      <SavingThrowPanel className="absolute left-[190px] top-[383px]" attributes={attributes} proficiencyBonus={proficiencyBonus} />
      <AttributesPanel key={character.id} attributes={attributes} onAttributeChange={handleAttributeChange} />
      <div className="absolute h-[44px] left-[56px] rounded-[2px] top-[1178px] w-[358px]" data-name="passive-perception">
        <PassivePerception perceptionTotal={perceptionTotal} />
      </div>
      <ProficiencyBonusComponent
        className="absolute h-[44px] left-[190px] rounded-[2px] top-[318px] w-[223px]"
        label="熟练加值"
        level={level}
        initialValue={proficiencyBonus}
        showDice={false}
        showInput={true}
        onValueChange={setProficiencyBonus}
      />
      <ProficiencyBonusComponent
        className="absolute h-[44px] left-[190px] rounded-[2px] top-[255px] w-[223px]"
        label="激励"
        initialValue={0}
        showDice={true}
        diceClickable={true}
        showInput={false}
      />
    </div>
  );
}

// ============================================================================
// 主要导出组件
// ============================================================================

export default function CharacterSheet() {
  return (
    <div className="relative size-full">
      <CharacterCardContent />
    </div>
  );
}
