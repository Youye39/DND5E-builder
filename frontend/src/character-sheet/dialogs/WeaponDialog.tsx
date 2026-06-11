import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import type { WeaponData, ExtraDamage, ExtraProperty } from "../../../data/weaponState";
import { DEFAULT_WEAPON, ATTACK_ATTRS } from "../../../data/weaponState";
import weaponPresets from "../../../data/weaponPresets.json";
import weaponTags from "../../../data/weaponTags.json";
import { ArrowIcon } from "../../assets/arrow";
import DamageRow from "../weapons/DamageRow";
import PropertyRow from "../weapons/components/PropertyRow";
import TagSection from "../weapons/components/TagSection";
import ScrollArea from "../../shared/components/ScrollArea";
import ButtonComponent from "../../shared/components/ButtonComponent";

import type { WeaponPreset, WeaponTag } from "../weapons/components/types";

const PRESETS = weaponPresets as WeaponPreset[];
const TAGS = weaponTags as WeaponTag[];

interface WeaponDialogProps {
  open: boolean;
  initialData: WeaponData;
  slotIndex: number;
  onSave: (index: number, data: WeaponData) => void;
  onClose: () => void;
  abilityModifiers?: { str: number; dex: number };
}

const FVAR = "'CTGR' 0, 'wdth' 100";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function calcAbilityMod(attr: "str" | "dex" | "custom", mods?: { str: number; dex: number }): string {
  if (attr === "custom" || !mods) return "—";
  const val = mods[attr];
  const mod = Math.floor((val - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

const presetGroups: { label: string; options: WeaponPreset[] }[] = [
  {
    label: "简易近战武器",
    options: PRESETS.filter((p) =>
      ["club", "dagger", "greatclub", "handaxe", "javelin", "lighthammer", "mace", "quarterstaff", "sickle", "spear"].includes(p.id)
    ),
  },
  {
    label: "简易远程武器",
    options: PRESETS.filter((p) => ["lightcrossbow", "dart", "shortbow", "sling"].includes(p.id)),
  },
  {
    label: "军用近战武器",
    options: PRESETS.filter((p) =>
      ["battleaxe", "flail", "glaive", "greataxe", "greatsword", "halberd", "lance", "longsword", "maul", "morningstar", "pike", "rapier", "scimitar", "shortsword", "trident", "warpick", "warhammer", "whip"].includes(p.id)
    ),
  },
  {
    label: "军用远程武器",
    options: PRESETS.filter((p) => ["blowgun", "handcrossbow", "heavycrossbow", "longbow", "net"].includes(p.id)),
  },
];

const T: React.CSSProperties = {
  fontSize: "12px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const LABEL: React.CSSProperties = {
  ...T, fontFamily: "var(--font-serif-medium)", fontSize: "12px", color: sheetColors.textPlaceholder, letterSpacing: "0.04em", marginBottom: 6, marginTop: 14,
};
const MUTED: React.CSSProperties = { ...T, color: sheetColors.textLighter };

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={LABEL}>{children}</div>;
}

function GhostInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        ...T, border: "1px solid transparent", borderRadius: "2px",
        padding: "2px 4px", outline: "none", backgroundColor: "transparent",
        transition: "border-color 0.15s, background 0.15s",
        ...(props.style ?? {}),
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
      onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; } }}
      onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; }}
    />
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ ...MUTED, fontSize: "12px", border: `1px dashed ${sheetColors.iconDisabled}`, borderRadius: "2px", padding: "3px 10px", background: "transparent", cursor: "pointer", marginTop: 6 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = sheetColors.textSecondary; e.currentTarget.style.color = sheetColors.textSecondary; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = sheetColors.iconDisabled; e.currentTarget.style.color = sheetColors.textLighter; }}
    >
      {children}
    </button>
  );
}

// ─── Preset dropdown ──────────────────────────────────────────────────────────

function PresetDropdown({ onSelect, onSelectSpell }: { onSelect: (preset: WeaponPreset) => void; onSelectSpell: () => void; onClose: () => void }) {
  return (
    <div
      style={{
        position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
        backgroundColor: sheetColors.cardBg, border: "1px solid var(--color-border)",
        borderRadius: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        marginTop: 2,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ScrollArea style={{ maxHeight: "260px" }}>
        {/* 法术选项 */}
        <div
          onClick={onSelectSpell}
          style={{
            padding: "6px 10px", fontSize: "12px", fontFamily: "var(--font-serif-regular)",
            color: sheetColors.textDark, cursor: "pointer",
            borderBottom: "1px solid var(--color-border)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.pageBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          法术
        </div>
        {presetGroups.map((group) => (
          <div key={group.label}>
            <div style={{ padding: "6px 10px 2px", fontSize: "12px", color: sheetColors.textPlaceholder, fontFamily: "var(--font-serif-medium)", letterSpacing: "0.04em" }}>
              {group.label}
            </div>
            {group.options.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onSelect(preset)}
                style={{
                  padding: "4px 10px", fontSize: "12px", fontFamily: "var(--font-serif-regular)",
                  color: sheetColors.textDark, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.pageBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {preset.label}
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

export function WeaponDialog({ open, initialData, slotIndex, onSave, onClose, abilityModifiers }: WeaponDialogProps) {
  const [data, setData] = useState<WeaponData>(initialData);
  const [showPresets, setShowPresets] = useState(false);
  const [spellAttackMode, setSpellAttackMode] = useState<"hit" | "save">("hit");
  const presetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setData(initialData);
      setSpellAttackMode("hit");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!showPresets) return;
    const handler = (e: MouseEvent) => {
      if (presetRef.current && !presetRef.current.contains(e.target as Node)) {
        setShowPresets(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPresets]);

  const set = <K extends keyof WeaponData>(key: K, val: WeaponData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const handlePresetSelect = (preset: WeaponPreset) => {
    setData((d) => ({
      ...d,
      name: preset.label,
      damageDice: preset.damageDice,
      damageType: preset.damageType,
      tags: [...preset.tags],
      attackAttr: preset.attackAttr,
      isSpell: false,
    }));
    setShowPresets(false);
  };

  const handleSpellSelect = () => {
    setData((d) => ({
      ...d,
      name: "法术",
      tags: [],
      isMagic: false,
      isSpell: true,
      proficient: false,
      extraAttackBonus: "",
      attackAttr: "custom",
    }));
    setSpellAttackMode("hit");
    setShowPresets(false);
  };

  const toggleTag = (tagId: string) => {
    setData((d) => ({
      ...d,
      tags: d.tags.includes(tagId) ? d.tags.filter((t) => t !== tagId) : [...d.tags, tagId],
    }));
  };

  const addExtraDamage = () =>
    set("extraDamages", [...data.extraDamages, { id: uid(), dice: "", type: "火焰" }]);
  const updateExtraDamage = (id: string, field: keyof Omit<ExtraDamage, "id">, val: string) =>
    set("extraDamages", data.extraDamages.map((ed) => ed.id === id ? { ...ed, [field]: val } : ed));
  const removeExtraDamage = (id: string) =>
    set("extraDamages", data.extraDamages.filter((ed) => ed.id !== id));

  const addExtraProperty = () =>
    set("extraProperties", [...data.extraProperties, { id: uid(), name: "", description: "", chargeText: "3/3" }]);
  const updateExtraProperty = (id: string, field: keyof Omit<ExtraProperty, "id">, val: string | number | null) =>
    set("extraProperties", data.extraProperties.map((ep) => ep.id === id ? { ...ep, [field]: val } : ep));
  const removeExtraProperty = (id: string) =>
    set("extraProperties", data.extraProperties.filter((ep) => ep.id !== id));

  const handleSave = () => { onSave(slotIndex, data); onClose(); };
  const handleClear = () => { onSave(slotIndex, { ...DEFAULT_WEAPON }); onClose(); };

  if (!open) return null;

  const divider = <div style={{ height: 1, backgroundColor: sheetColors.contentBg, margin: "12px 0" }} />;
  const attrMod = calcAbilityMod(data.attackAttr, abilityModifiers);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "560px", maxHeight: "560px", display: "flex", flexDirection: "column",
          backgroundColor: sheetColors.cardBg, borderRadius: "10px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden", fontVariationSettings: FVAR,
        }}
      >
        {/* ════ Header ════ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}`, flexShrink: 0 }}>
          <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>
            编辑
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleClear}
              className="text-xs font-medium"
              style={{ padding: "5px 12px", border: "1px solid var(--color-border)", borderRadius: "2px", fontFamily: "var(--font-serif-medium)", backgroundColor: sheetColors.cardBg, color: sheetColors.textDark, cursor: "pointer", transition: "all 0.1s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; }}
            >
              清空
            </button>
            <button
              onClick={handleSave}
              className="text-xs font-medium"
              style={{ padding: "5px 16px", border: `1px solid ${sheetColors.buttonDarkBg}`, borderRadius: "2px", fontFamily: "var(--font-serif-medium)", backgroundColor: sheetColors.buttonDarkBg, color: sheetColors.textWhite, cursor: "pointer", transition: "background 0.1s" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
            >
              保存
            </button>
          </div>
        </div>

        {/* ════ Body ════ */}
        <ScrollArea
          style={{ flex: 1, padding: "6px 16px 16px", minHeight: 0 }}
        >
          {/* ── Section 1: Weapon Name + Tags + Magic ── */}
          <SectionLabel>名称</SectionLabel>
          <div ref={presetRef} style={{ position: "relative" }}>
            <input
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="自定义"
              style={{
                ...T, width: "100%", boxSizing: "border-box",
                border: "1px solid var(--color-border)", borderRadius: "2px",
                padding: "6px 30px 6px 10px", outline: "none", backgroundColor: sheetColors.cardBg,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = sheetColors.borderInput)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
            <button
              onClick={() => setShowPresets(!showPresets)}
              style={{
                position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                border: "none", background: "transparent", cursor: "pointer", padding: "2px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ArrowIcon rotation={90} color={showPresets ? sheetColors.iconHover : sheetColors.iconDefault} />
            </button>
            {showPresets && <PresetDropdown onSelect={handlePresetSelect} onSelectSpell={handleSpellSelect} onClose={() => setShowPresets(false)} />}
          </div>

          {/* Tags + Magic (法术模式下隐藏) */}
          {!data.isSpell && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, flexWrap: "wrap", minHeight: 26 }}>
              <TagSection
                tags={data.tags}
                availableTags={TAGS}
                onToggleTag={toggleTag}
              />
              <div style={{ flex: 1, minWidth: 8 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, userSelect: "none", flexShrink: 0 }}>
                <ButtonComponent
                  checked={data.isMagic}
                  onChange={() => set("isMagic", !data.isMagic)}
                />
                <span style={{ ...T, color: sheetColors.textMedium, fontSize: "12px" }}>魔法武器</span>
              </div>
            </div>
          )}

          {divider}

          {/* ── 攻击 + 伤害 并列 ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* 左侧：攻击 */}
            <div>
              <SectionLabel>攻击</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap" }}>属性</span>
                  <select
                    value={data.attackAttr}
                    onChange={(e) => set("attackAttr", e.target.value as WeaponData["attackAttr"])}
                    style={{
                      ...T, flex: 1, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                      padding: "4px 24px 4px 0", outline: "none", backgroundColor: "transparent",
                      cursor: "pointer", appearance: "none" as const,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23bbb'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 2px center",
                    }}
                  >
                    {ATTACK_ATTRS.map((a) => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                </div>
                {data.isSpell ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}>
                        <ButtonComponent
                          checked={spellAttackMode === "hit"}
                          onChange={() => setSpellAttackMode("hit")}
                        />
                        <span style={{ ...T, color: sheetColors.textMedium, fontSize: "12px" }}>显示命中</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}>
                        <ButtonComponent
                          checked={spellAttackMode === "save"}
                          onChange={() => setSpellAttackMode("save")}
                        />
                        <span style={{ ...T, color: sheetColors.textMedium, fontSize: "12px" }}>显示豁免</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap" }}>熟练</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, userSelect: "none", padding: "4px 0" }}>
                        <ButtonComponent
                          checked={data.proficient}
                          onChange={() => set("proficient", !data.proficient)}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap" }}>额外加值</span>
                      <GhostInput
                        type="text"
                        value={data.extraAttackBonus}
                        placeholder="+1"
                        onChange={(e) => set("extraAttackBonus", e.target.value)}
                        style={{ width: 56 }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 右侧：伤害 */}
            <div>
              <SectionLabel>伤害</SectionLabel>
              <DamageRow
                dice={data.damageDice}
                onDiceChange={(val) => set("damageDice", val)}
                damageType={data.damageType}
                onTypeChange={(val) => set("damageType", val)}
                modifier={attrMod}
              />
              <div style={{ marginTop: 6 }}>
                {data.extraDamages.map((ed) => (
                  <DamageRow
                    key={ed.id}
                    dice={ed.dice}
                    onDiceChange={(val) => updateExtraDamage(ed.id, "dice", val)}
                    damageType={ed.type}
                    onTypeChange={(val) => updateExtraDamage(ed.id, "type", val)}
                    onRemove={() => removeExtraDamage(ed.id)}
                  />
                ))}
                <AddButton onClick={addExtraDamage}>+ 额外伤害</AddButton>
              </div>
            </div>
          </div>

          {divider}

          {/* ── Section 4: 特性 / 描述 ── */}
          {data.isSpell ? (
            <>
              <SectionLabel>描述</SectionLabel>
              <textarea
                value={data.spellDescription}
                onChange={(e) => set("spellDescription", e.target.value)}
                placeholder="输入法术描述"
                rows={3}
                style={{
                  ...T, width: "100%", resize: "vertical", boxSizing: "border-box",
                  border: `1px solid ${sheetColors.hoverBg}`, borderRadius: "2px", padding: "4px 8px",
                  outline: "none", backgroundColor: sheetColors.cardBg,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = sheetColors.hoverBg; }}
              />
            </>
          ) : (
            <>
              <SectionLabel>特性</SectionLabel>
              {data.extraProperties.map((ep) => (
                <PropertyRow
                  key={ep.id}
                  property={ep}
                  onUpdate={updateExtraProperty}
                  onRemove={removeExtraProperty}
                />
              ))}
              <AddButton onClick={addExtraProperty}>+ 添加特性</AddButton>
            </>
          )}
        </ScrollArea>
      </div>
    </div>,
    document.body
  );
}
