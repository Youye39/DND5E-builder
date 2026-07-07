import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import { createDefaultSpell } from "../../shared/types/types";
import type { SpellData, ExtraBonus } from "../../shared/types/types";
import ScrollArea from "../../shared/ui/ScrollArea";
import ButtonComponent from "../../shared/ui/ButtonComponent";
import { useCharacter } from "../../shared/storage/CharacterContext";
import { useLanguage } from "../../shared/i18n/LanguageContext";
import { toDamageId, displayDamageType } from "../../shared/i18n/displayUtils";
import damageTypes from "../../../data/damageTypes.json";

const DAMAGE_TYPES = damageTypes as { id: string; label: string }[];
const FVAR = "'CTGR' 0, 'wdth' 100";

const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const LABEL: React.CSSProperties = {
  ...T, fontFamily: "var(--font-serif-medium)", fontSize: "13px", color: sheetColors.textPlaceholder, letterSpacing: "0.04em", marginBottom: 6, marginTop: 14,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={LABEL}>{children}</div>;
}

// ─── SpellDialog ─────────────────────────────────────────────────────────────

interface SpellDialogProps {
  open: boolean;
  initialSpell?: SpellData;
  isCantrip?: boolean;
  onSave: (spell: SpellData) => void;
  onDelete?: (spell: SpellData) => void;
  onClose: () => void;
}

const SCHOOLS: { id: string; label: string; labelKey: string }[] = [
  { id: "abjuration", label: "防护", labelKey: "school.abjuration" },
  { id: "conjuration", label: "咒法", labelKey: "school.conjuration" },
  { id: "divination", label: "预言", labelKey: "school.divination" },
  { id: "enchantment", label: "附魔", labelKey: "school.enchantment" },
  { id: "evocation", label: "塑能", labelKey: "school.evocation" },
  { id: "illusion", label: "幻术", labelKey: "school.illusion" },
  { id: "necromancy", label: "死灵", labelKey: "school.necromancy" },
  { id: "transmutation", label: "变化", labelKey: "school.transmutation" },
];

export function SpellDialog({
  open, initialSpell, isCantrip = false,
  onSave, onDelete, onClose,
}: SpellDialogProps) {
  const { t, lang } = useLanguage();
  const { character, updateCharacter } = useCharacter();
  const [data, setData] = useState<SpellData>(initialSpell ?? createDefaultSpell());
  const [showAbilityPicker, setShowAbilityPicker] = useState(false);
  const mouseDownOnOverlay = useRef(false);
  const [showSchoolPicker, setShowSchoolPicker] = useState(false);

  useEffect(() => {
    if (open) {
      const init = initialSpell ?? createDefaultSpell();
      if (!init.school) init.school = "abjuration";
      setData(init);
      setShowAbilityPicker(false);
      setShowSchoolPicker(false);
    }
  }, [open, initialSpell]);

  const set = <K extends keyof SpellData>(key: K, val: SpellData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const handleDelete = () => {
    // 删除对应攻击栏条目
    if (character) {
      const newEntries = character.attackEntries.filter(e => !(e.type === "spell" && e.refId === data.id));
      updateCharacter({ attackEntries: newEntries });
    }
    onDelete?.(data);
    onClose();
  };

  const handleSave = () => {
    const finalName = data.name.trim() || "新法术";
    onSave({ ...data, name: finalName });
    onClose();
  };

  if (!open) return null;

  const divider = <div style={{ height: 1, backgroundColor: sheetColors.contentBg, margin: "12px 0" }} />;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      onMouseDown={(e) => { mouseDownOnOverlay.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (e.target === e.currentTarget && mouseDownOnOverlay.current) onClose(); }}
    >
      <div
        style={{
          width: "460px", maxHeight: "520px", display: "flex", flexDirection: "column",
          backgroundColor: sheetColors.cardBg, borderRadius: "10px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden", fontVariationSettings: FVAR,
        }}
      >
        {/* ════ Header ════ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}`, flexShrink: 0 }}>
          <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>
            {isCantrip ? t('spell.editCantrip') : t('spell.editSpell')}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDelete}
              style={{ padding: "5px 12px", border: "1px solid var(--color-border)", borderRadius: "2px", fontFamily: "var(--font-serif-medium)", fontSize: "13px", backgroundColor: sheetColors.cardBg, color: sheetColors.textDark, cursor: "pointer", transition: "all 0.1s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.color = "#000"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = sheetColors.textDark; }}
            >
              {t('spell.delete')}
            </button>
            <button
              onClick={handleSave}
              style={{ padding: "5px 16px", border: `1px solid ${sheetColors.buttonDarkBg}`, borderRadius: "2px", fontFamily: "var(--font-serif-medium)", fontSize: "13px", backgroundColor: sheetColors.buttonDarkBg, color: sheetColors.textWhite, cursor: "pointer", transition: "background 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
            >
              {t('spell.save')}
            </button>
          </div>
        </div>

        {/* ════ Body ════ */}
        <ScrollArea style={{ flex: 1, padding: "6px 16px 16px", minHeight: 0 }}>
          {/* ── 法术名称 ── */}
          <SectionLabel>{t('item.name')}</SectionLabel>
          <input
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={t('spell.spellName')}
            style={{
              ...T, width: "100%", boxSizing: "border-box",
              border: "1px solid var(--color-border)", borderRadius: "2px",
              padding: "6px 10px", outline: "none", backgroundColor: sheetColors.cardBg,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = sheetColors.borderInput)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
          />

          {/* ── 学派 + 仪式 + 专注（名称下方同行） ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, minHeight: 28 }}>
            {/* 左侧：学派标签（可点击切换学派） */}
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <span
                onClick={() => setShowSchoolPicker(!showSchoolPicker)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  padding: "1px 6px", borderRadius: "2px", cursor: "pointer",
                  backgroundColor: sheetColors.hoverBg, color: sheetColors.textDark,
                  fontSize: "11px", fontFamily: "var(--font-serif-regular)", lineHeight: 1.4,
                }}
              >
                {t(SCHOOLS.find((s) => s.id === data.school)?.labelKey ?? "school.abjuration")}
              </span>
              {showSchoolPicker && (
                <div
                  style={{
                    position: "absolute", zIndex: 100, left: 0, top: "100%", marginTop: 2,
                    backgroundColor: sheetColors.cardBg, border: "1px solid var(--color-border)",
                    borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                    minWidth: "120px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {SCHOOLS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => { set("school", s.id); setShowSchoolPicker(false); }}
                      style={{
                        padding: "4px 10px", cursor: "pointer",
                        ...T, backgroundColor: data.school === s.id ? sheetColors.hoverBg : "transparent",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.hoverBg)}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = data.school === s.id ? sheetColors.hoverBg : "transparent"; }}
                    >
                      {t(s.labelKey)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧：仪式 + 专注 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, marginLeft: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}>
                <ButtonComponent
                  checked={!!data.ritual}
                  onChange={() => set("ritual", !data.ritual)}
                />
                <span style={{ ...T, color: sheetColors.textMedium }}>{t('spell.ritual')}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}>
                <ButtonComponent
                  checked={!!data.concentration}
                  onChange={() => set("concentration", !data.concentration)}
                />
                <span style={{ ...T, color: sheetColors.textMedium }}>{t('spell.concentration')}</span>
              </div>
            </div>
          </div>

          {/* ── 法术描述 ── */}
          <SectionLabel>{t('spell.description')}</SectionLabel>
          <textarea
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder={t('spell.spellDescription')}
            rows={3}
            style={{
              ...T, width: "100%", resize: "vertical", boxSizing: "border-box",
              border: `1px solid ${sheetColors.hoverBg}`, borderRadius: "2px", padding: "4px 8px",
              outline: "none", backgroundColor: sheetColors.cardBg,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = sheetColors.hoverBg; }}
          />

          {divider}

          {/* ── 天生施法 ── */}
          <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <ButtonComponent
                  checked={data.isInnate}
                  onChange={() => {
                    const newVal = !data.isInnate;
                    set("isInnate", newVal);
                    if (!newVal) {
                      set("usage", undefined);
                      set("innateAbility", undefined);
                    }
                  }}
                />
                <span style={{ ...T, color: sheetColors.textMedium, fontSize: "13px" }}>{t('spell.innate')}</span>
              </div>

              {data.isInnate && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 20 }}>
                  {/* 施法属性 + 计算值 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap" }}>{t('spell.innateAbility')}</span>
                    <button
                      onClick={() => setShowAbilityPicker(!showAbilityPicker)}
                      style={{
                        ...T, width: 60, textAlign: "center",
                        border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                        padding: "2px 0", outline: "none",
                        backgroundColor: "transparent", cursor: "pointer", position: "relative",
                      }}
                    >
                      {t('ability.' + (data.innateAbility ?? 'int'))}
                      {showAbilityPicker && (
                        <div style={{
                          position: "absolute", top: "100%", right: 0, zIndex: 10,
                          width: "100%", minWidth: "max-content",
                          backgroundColor: sheetColors.cardBg, border: "1px solid var(--color-border)",
                          borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                          textAlign: "center",
                        }}>
                          {(["int", "wis", "cha"] as const).map((a) => (
                            <div
                              key={a}
                              onClick={() => { set("innateAbility", a); setShowAbilityPicker(false); }}
                              style={{
                                padding: "4px 12px", cursor: "pointer",
                                ...T, backgroundColor: (data.innateAbility ?? "int") === a ? sheetColors.hoverBg : "transparent",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                            >
                              {t('ability.' + a)}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>

                    {/* 法术豁免DC */}
                    <span style={{ ...LABEL, margin: "0 0 0 12px", whiteSpace: "nowrap" }}>{t('spell.saveDCField')}</span>
                    <span style={{ ...T, minWidth: 28, textAlign: "center" }}>
                      {(() => {
                        if (!character) return "—";
                        const innateAbility = data.innateAbility ?? "int";
                        const attrMap: Record<string, "int_value" | "wis_value" | "cha_value"> = {
                          int: "int_value", wis: "wis_value", cha: "cha_value",
                        };
                        const innateScore = character.attributes[attrMap[innateAbility]] ?? 10;
                        const innateMod = Math.floor((innateScore - 10) / 2);
                        const prof = character.proficiencyBonus ?? 2;
                        const saveExtras = (character.spellSaveDCExtras ?? []).reduce((s: number, eb: ExtraBonus) => s + (parseInt(eb.value) || 0), 0);
                        const dc = 8 + prof + saveExtras + innateMod;
                        return `${dc}`;
                      })()}
                    </span>

                    {/* 法术攻击加值 */}
                    <span style={{ ...LABEL, margin: "0 0 0 8px", whiteSpace: "nowrap" }}>{t('spell.attackBonusField')}</span>
                    <span style={{ ...T, minWidth: 28, textAlign: "center" }}>
                      {(() => {
                        if (!character) return "—";
                        const innateAbility = data.innateAbility ?? "int";
                        const attrMap: Record<string, "int_value" | "wis_value" | "cha_value"> = {
                          int: "int_value", wis: "wis_value", cha: "cha_value",
                        };
                        const innateScore = character.attributes[attrMap[innateAbility]] ?? 10;
                        const innateMod = Math.floor((innateScore - 10) / 2);
                        const prof = character.proficiencyBonus ?? 2;
                        const attackExtras = (character.spellAttackExtras ?? []).reduce((s: number, eb: ExtraBonus) => s + (parseInt(eb.value) || 0), 0);
                        const bonus = prof + attackExtras + innateMod;
                        return bonus >= 0 ? `+${bonus}` : `${bonus}`;
                      })()}
                    </span>
                  </div>

                  {/* 使用次数 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap" }}>{t('spell.usage')}</span>
                    <input
                      type="text"
                      value={data.usage ?? "1/1"}
                      onChange={(e) => set("usage", e.target.value)}
                      placeholder="1/1"
                      style={{
                        ...T, width: 60, textAlign: "center",
                        border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                        padding: "2px 0", outline: "none", backgroundColor: "transparent",
                      }}
                    />
                  </div>
                </div>
              )}
          </div>

          {divider}

          {/* ── 伤害法术 ── */}
          <div style={{ marginBottom: 8 }}>
            {/* 第一行：复选框 + 显示 */}
            <div style={{ display: "flex", alignItems: "center", minHeight: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}>
                <ButtonComponent
                  checked={data.saveType !== undefined}
                  onChange={() => {
                    if (data.saveType !== undefined) {
                      set("saveType", undefined);
                      // 取消勾选时删除攻击栏对应条目
                      if (character) {
                        const newEntries = character.attackEntries.filter(e => !(e.type === "spell" && e.refId === data.id));
                        updateCharacter({ attackEntries: newEntries });
                      }
                    } else {
                      set("saveType", "attack");
                      if (!data.damageDice) set("damageDice", "1d10");
                      if (!data.damageType) set("damageType", "火焰");
                    }
                  }}
                />
                <span style={{ ...T, color: sheetColors.textMedium, fontSize: "13px" }}>{t('spell.saveAsDamage')}</span>
              </div>
              <div style={{ flex: 1 }} />
              {data.saveType !== undefined && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{ ...T, color: sheetColors.textPlaceholder, fontSize: "13px" }}>{t('spell.display')}</span>
                  <select
                    value={data.saveType || ""}
                    onChange={(e) => set("saveType", e.target.value as "attack" | "save" | "")}
                    style={{
                      ...T, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                    padding: "2px 20px 2px 0", outline: "none", backgroundColor: "transparent",
                    cursor: "pointer", appearance: "none" as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23bbb'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 2px center",
                  }}
                >
                  <option value="attack">{t('spell.attackBonusOption')}</option>
                  <option value="save">{t('spell.saveDCOption')}</option>
                  <option value="">{t('spell.blank')}</option>
                </select>
                </span>
              )}
            </div>

            {/* 第二行：伤害骰 + 伤害类型（勾选后才显示） ── */}
            {data.saveType !== undefined && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, marginTop: 4 }}>
                <input
                  type="text"
                  value={data.damageDice ?? "1d10"}
                  onChange={(e) => set("damageDice", e.target.value)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
                  onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; } }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; }}
                  style={{
                    ...T, width: 56,
                    border: "1px solid transparent", borderRadius: "2px",
                    padding: "2px 4px", outline: "none", backgroundColor: "transparent",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                />
                <select
                  value={toDamageId(data.damageType ?? "Fire")}
                  onChange={(e) => set("damageType", e.target.value)}
                  style={{
                    ...T, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                    padding: "2px 20px 2px 0", outline: "none", backgroundColor: "transparent",
                    cursor: "pointer", appearance: "none" as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23bbb'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 2px center",
                  }}
                >
                  {DAMAGE_TYPES.map((dt) => (
                    <option key={dt.id} value={dt.id}>{displayDamageType(dt.id, lang)}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>,
    document.body
  );
}
