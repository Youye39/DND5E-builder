import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../../shared/tokens/colors";
import { createDefaultItem } from "../../shared/types/types";
import type { Item, Feature } from "../../shared/types/types";
import ScrollArea from "../../shared/ui/ScrollArea";
import ButtonComponent from "../../shared/ui/ButtonComponent";
import { useCharacter } from "../../shared/storage/CharacterContext";
import weaponPresets from "../../../data/weaponPresets.json";
import weaponTags from "../../../data/weaponTags.json";
import damageTypes from "../../../data/damageTypes.json";
import type { WeaponPreset } from "./weapons/types";

const PRESETS = weaponPresets as WeaponPreset[];
const TAGS = weaponTags as { id: string; label: string }[];
const DAMAGE_TYPES = damageTypes as string[];

const ATTACK_ATTRS: { id: "str" | "dex" | "con" | "int" | "wis" | "cha"; label: string }[] = [
  { id: "str", label: "力量" },
  { id: "dex", label: "敏捷" },
  { id: "con", label: "体质" },
  { id: "int", label: "智力" },
  { id: "wis", label: "感知" },
  { id: "cha", label: "魅力" },
];

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

const FVAR = "'CTGR' 0, 'wdth' 100";

const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};
const LABEL: React.CSSProperties = {
  ...T, fontFamily: "var(--font-serif-medium)", fontSize: "13px", color: sheetColors.textPlaceholder, letterSpacing: "0.04em", marginBottom: 6, marginTop: 14,
};
const MUTED: React.CSSProperties = { ...T, color: sheetColors.textLighter };

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
      style={{ ...MUTED, fontSize: "13px", border: `1px dashed ${sheetColors.iconDisabled}`, borderRadius: "2px", padding: "3px 10px", background: "transparent", cursor: "pointer", marginTop: 6 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = sheetColors.textSecondary; e.currentTarget.style.color = sheetColors.textSecondary; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = sheetColors.iconDisabled; e.currentTarget.style.color = sheetColors.textLighter; }}
    >
      {children}
    </button>
  );
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Feature Row ─────────────────────────────────────────────────────────────

interface FeatureRowProps {
  feature: Feature;
  onUpdate: (id: string, field: keyof Omit<Feature, "id">, val: string) => void;
  onRemove: (id: string) => void;
}

function FeatureRow({ feature, onUpdate, onRemove }: FeatureRowProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4
    }}
  >
    {/* 名称 + 使用次数 */}
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <GhostInput
        type="text"
        value={feature.name}
        placeholder="特性名称"
        onChange={(e) => onUpdate(feature.id, "name", e.target.value)}
        style={{
          fontWeight: 600,
          paddingLeft: 8,
          paddingRight: 8,
          width: "auto",
          minWidth: 40,
          fieldSizing: "content",
        }}
      />
      <input
        type="text"
        value={feature.note ?? ""}
        onChange={(e) => onUpdate(feature.id, "note", e.target.value)}
        placeholder="次数"
        style={{
          ...T,
          fontSize: 12,
          width: 44,
          textAlign: "center",
          border: "none",
          borderBottom: "1px solid var(--color-border)",
          borderRadius: 0,
          padding: "1px 0",
          outline: "none",
          backgroundColor: "transparent",
          color: sheetColors.textPlaceholder
        }}
      />
    </div>
    {/* 删除按钮 */}
    <button
      onClick={() => onRemove(feature.id)}
      style={{
        ...T,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "0 4px",
        lineHeight: 1,
        color: sheetColors.textLighter
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = sheetColors.textMedium }}
      onMouseLeave={(e) => { e.currentTarget.style.color = sheetColors.textLighter }}
    >
      ×
    </button>
  </div>
      <textarea
        value={feature.description ?? ""}
        placeholder="特性描述"
        onChange={(e) => onUpdate(feature.id, "description", e.target.value)}
        rows={2}
        style={{
          ...T, width: "100%", resize: "vertical", boxSizing: "border-box",
          border: `1px solid ${sheetColors.hoverBg}`, borderRadius: "2px", padding: "4px 8px",
          outline: "none", backgroundColor: sheetColors.cardBg,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = sheetColors.hoverBg; }}
      />
    </div>
  );
}

// ═══ 标签选择器 ═════════════════════════════════════════════════════════

function TagPicker({ selectedTags, onToggle }: { selectedTags: string[]; onToggle: (tagId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const available = TAGS.filter(t => !selectedTags.includes(t.id));

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{ ...T, fontSize: "11px", color: sheetColors.textPlaceholder, cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        + 标签
      </span>
      {isOpen && (
        <div
          style={{
            position: "absolute", top: "100%", left: 0, zIndex: 100,
            backgroundColor: sheetColors.cardBg,
            border: "1px solid var(--color-border)",
            borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            minWidth: "120px", marginTop: 2,
          }}
        >
          {available.length === 0 ? (
            <div style={{ padding: "6px 10px", ...T, color: sheetColors.textPlaceholder, fontSize: "11px" }}>无更多标签</div>
          ) : (
            available.map((tag) => (
              <div
                key={tag.id}
                onClick={() => { onToggle(tag.id); setIsOpen(false); }}
                style={{
                  padding: "4px 10px", cursor: "pointer",
                  ...T, fontSize: "13px",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {tag.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Custom Select Dropdown ─────────────────────────────────────────────────

function CustomSelect({
  value,
  options,
  onChange,
  style,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", ...style }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...T,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 20px 4px 0",
          border: "none",
          borderBottom: "1px solid var(--color-border)",
          borderRadius: 0,
          outline: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23bbb'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 2px center",
        }}
      >
        {selected?.label ?? value}
      </div>
      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, zIndex: 100,
          backgroundColor: sheetColors.cardBg, border: "1px solid var(--color-border)",
          borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.10)", marginTop: 2,
          minWidth: "100%", whiteSpace: "nowrap",
        }}>
          <ScrollArea style={{ maxHeight: "180px" }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              style={{
                padding: "4px 10px", cursor: "pointer",
                ...T, fontSize: "13px",
                backgroundColor: opt.value === value ? sheetColors.hoverBg : "transparent",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = opt.value === value ? sheetColors.hoverBg : "transparent"; }}
            >
              {opt.label}
            </div>
          ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// ─── Main Dialog ─────────────────────────────────────────────────────────────

interface ItemDialogProps {
  open: boolean;
  initialItem?: Item;
  onSave: (item: Item) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function ItemDialog({ open, initialItem, onSave, onDelete, onClose }: ItemDialogProps) {
  const { character, updateCharacter } = useCharacter();
  const [data, setData] = useState<Item>(initialItem ?? createDefaultItem());

  useEffect(() => {
    if (open) {
      const base = initialItem ?? createDefaultItem();
      setData({ ...base, proficient: base.proficient ?? true });
    }
  }, [open, initialItem]);

  const set = <K extends keyof Item>(key: K, val: Item[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const [showPresets, setShowPresets] = useState(false);
  const presetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPresets) return;
    const handler = (e: MouseEvent) => {
      if (presetRef.current && !presetRef.current.contains(e.target as Node)) setShowPresets(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPresets]);

  const handlePresetSelect = (preset: WeaponPreset) => {
    setData((d) => ({
      ...d,
      name: d.name && d.name !== "新物品" && !PRESETS.some(p => p.label === d.name) ? d.name : preset.label,
      damageDice: preset.damageDice,
      damageType: preset.damageType,
      tags: [...preset.tags],
      attackAttr: preset.attackAttr,
      isWeapon: true,
      proficient: true,
    }));
    setShowPresets(false);
  };

  const toggleTag = (tagId: string) => {
    const tags = data.tags ?? [];
    set("tags", tags.includes(tagId) ? tags.filter((t) => t !== tagId) : [...tags, tagId]);
  };

  const addExtraDamage = () => {
    const ed = data.extraDamages ?? [];
    set("extraDamages", [...ed, { id: uid(), dice: "1d4", type: "挥砍" }]);
  };
  const updateExtraDamage = (id: string, field: "dice" | "type", val: string) => {
    const ed = data.extraDamages ?? [];
    set("extraDamages", ed.map((d) => d.id === id ? { ...d, [field]: val } : d));
  };
  const removeExtraDamage = (id: string) => {
    set("extraDamages", (data.extraDamages ?? []).filter((d) => d.id !== id));
  };

  // ── 伤害属性调整值（实时计算，仅用于显示，不修改存储值） ──
  const ATTR_TO_KEY: Record<string, string> = {
    str: "str_value",
    dex: "dex_value",
    con: "con_value",
    int: "int_value",
    wis: "wis_value",
    cha: "cha_value",
  };
  const damageModDisplay = useMemo(() => {
    if (!data.isWeapon || data.attackAttr === "custom") return null;
    const attrKey = data.attackAttr ? ATTR_TO_KEY[data.attackAttr] : null;
    if (!attrKey || !character) return null;
    const score = (character.attributes as any)[attrKey] ?? 10;
    const mod = Math.floor((score - 10) / 2);
    if (mod === 0) return null;
    return mod > 0 ? `+${mod}` : `${mod}`;
  }, [data.isWeapon, data.attackAttr, character]);

  const addFeature = () =>
    set("features", [...data.features, { id: uid(), name: "", note: "" }]);
  const updateFeature = (id: string, field: keyof Omit<Feature, "id">, val: string) =>
    set("features", data.features.map((f) => f.id === id ? { ...f, [field]: val } : f));
  const removeFeature = (id: string) =>
    set("features", data.features.filter((f) => f.id !== id));

  const handleSave = () => {
    const name = data.name.trim() || "新物品";
    onSave({ ...data, name });
    onClose();
  };
  const handleDelete = () => { onDelete?.(); onClose(); };

  if (!open) return null;

  const divider = <div style={{ height: 1, backgroundColor: sheetColors.contentBg, margin: "12px 0" }} />;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "500px", maxHeight: "560px", display: "flex", flexDirection: "column",
          backgroundColor: sheetColors.cardBg, borderRadius: "10px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden", fontVariationSettings: FVAR,
        }}
      >
        {/* ════ Header ════ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}`, flexShrink: 0 }}>
          <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>
            编辑物品
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDelete}
              className="text-xs font-medium"
              style={{ padding: "5px 12px", border: "1px solid var(--color-border)", borderRadius: "2px", fontFamily: "var(--font-serif-medium)", backgroundColor: sheetColors.cardBg, color: sheetColors.textDark, cursor: "pointer", transition: "all 0.1s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.pageBg; e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.color = "#000"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = sheetColors.textDark; }}
            >
              删除
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
        <ScrollArea style={{ flex: 1, padding: "6px 16px 16px", minHeight: 0 }}>
          {/* ── 名称 + 数量 ── */}
          <SectionLabel>名称</SectionLabel>
          <div style={{ display: "flex", gap: 12 }}>
            <div ref={presetRef} style={{ position: "relative", flex: 1 }}>
              <input
                value={data.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="物品名称"
                style={{
                  ...T, width: "100%", boxSizing: "border-box",
                  border: "1px solid var(--color-border)", borderRadius: "2px",
                  padding: "6px 10px", outline: "none", backgroundColor: sheetColors.cardBg,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = sheetColors.borderInput)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
              {data.isWeapon && (
                <>
                  <button
                    onClick={() => setShowPresets(!showPresets)}
                    style={{
                      position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                      border: "none", background: "transparent", cursor: "pointer",
                      padding: "2px 20px 2px 6px", ...T, color: sheetColors.textPlaceholder,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23bbb'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 2px center",
                      backgroundSize: "8px 5px",
                    }}
                  >
                    预设
                  </button>
                  {showPresets && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
                      backgroundColor: sheetColors.cardBg, border: "1px solid var(--color-border)",
                      borderRadius: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", marginTop: 2,
                    }}>
                      <ScrollArea style={{ maxHeight: "260px" }}>
                        {presetGroups.map((group) => (
                          <div key={group.label}>
                            <div style={{ padding: "6px 10px 2px", fontSize: "13px", color: sheetColors.textPlaceholder, fontFamily: "var(--font-serif-medium)" }}>
                              {group.label}
                            </div>
                            {group.options.map((preset) => (
                              <div
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset)}
                                style={{ padding: "4px 10px", fontSize: "13px", color: sheetColors.textDark, cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.hoverBg)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                              >
                                {preset.label}
                              </div>
                            ))}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ ...LABEL, margin: 0 }}>×</span>
              <input
                type="number"
                min={1}
                value={data.quantity}
                onChange={(e) => set("quantity", Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  ...T, width: 48, textAlign: "center",
                  border: "1px solid var(--color-border)", borderRadius: "2px",
                  padding: "6px 4px", outline: "none", backgroundColor: sheetColors.cardBg,
                }}
              />
            </div>
          </div>

          {/* ── 武器标签（仅在 isWeapon 时显示） ── */}
          {data.isWeapon && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, flexWrap: "wrap", minHeight: 26 }}>
              {(data.tags ?? []).map((tagId) => {
                const tag = TAGS.find((t) => t.id === tagId);
                return (
                  <span key={tagId} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", borderRadius: "2px", backgroundColor: sheetColors.hoverBg, fontSize: "11px", color: sheetColors.textDark, fontFamily: "var(--font-serif-regular)" }}>
                    {tag?.label ?? tagId}
                    <span onClick={() => toggleTag(tagId)} style={{ cursor: "pointer", marginLeft: 2, color: sheetColors.textLighter }}>×</span>
                  </span>
                );
              })}
              <TagPicker
                selectedTags={data.tags ?? []}
                onToggle={toggleTag}
              />
            </div>
          )}

          {/* ── 描述 ── */}
          <textarea
            value={data.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="物品描述（可选）"
            rows={2}
            style={{
              ...T, width: "100%", resize: "vertical", boxSizing: "border-box",
              border: `1px solid ${sheetColors.hoverBg}`, borderRadius: "2px", padding: "4px 8px", marginTop: 8,
              outline: "none", backgroundColor: sheetColors.cardBg,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = sheetColors.hoverBg; }}
          />

          {/* ── 武器攻击 + 伤害（仅在 isWeapon 时显示） ── */}
          {data.isWeapon && (
            <>
              {divider}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ ...LABEL, marginTop: 0 }}>攻击</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {/* 属性 + 熟练 同一行 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 12 }}>
                      <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap", width: 56, textAlign: "left", paddingRight: 8 }}>属性</span>
                      <CustomSelect
                        value={data.attackAttr ?? "str"}
                        options={ATTACK_ATTRS.map(a => ({ value: a.id, label: a.label }))}
                        onChange={(v) => set("attackAttr", v as any)}
                        style={{ width: 56 }}
                      />
                      <div style={{ flex: 0.5 }} />
                      <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap" }}>熟练</span>
                      <ButtonComponent checked={data.proficient ?? true} onChange={() => set("proficient", !(data.proficient ?? true))} />
                    </div>
                    {/* 额外加值 缩进 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 12 }}>
                      <span style={{ ...LABEL, margin: 0, whiteSpace: "nowrap", width: 56, textAlign: "right", paddingRight: 8 }}>额外加值</span>
                      <input
                        type="text"
                        value={data.extraAttackBonus ?? ""}
                        onChange={(e) => set("extraAttackBonus", e.target.value)}
                        style={{
                          ...T, width: 56, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
                          padding: "2px 4px", outline: "none", backgroundColor: "transparent",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ ...LABEL, marginTop: 0 }}>伤害</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 8 }}>
                    {/* 基础伤害 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 68, display: "flex", alignItems: "center", gap: 6 }}>
                        <GhostInput type="text" value={data.damageDice ?? "1d8"} onChange={(e) => set("damageDice", e.target.value)} style={{ width: 40 }} />
                        {damageModDisplay && (
                          <span style={{ ...MUTED, fontSize: "13px", whiteSpace: "nowrap", flexShrink: 0 }}>
                            {damageModDisplay}
                          </span>
                        )}
                      </div>
                      <CustomSelect
                        value={data.damageType ?? "挥砍"}
                        options={DAMAGE_TYPES.map(t => ({ value: t, label: t }))}
                        onChange={(v) => set("damageType", v)}
                        style={{ width: 72 }}
                      />
                    </div>
                  </div>
                  {/* 额外伤害 */}
                  <div style={{ marginTop: 6, paddingLeft: 8 }}>
                    {(data.extraDamages ?? []).map((ed) => (
                      <div key={ed.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 68, display: "flex", alignItems: "center" }}>
                          <GhostInput type="text" value={ed.dice} placeholder="1d6" onChange={(e) => updateExtraDamage(ed.id, "dice", e.target.value)} style={{ width: 62 }} />
                        </div>
                        <CustomSelect
                          value={ed.type}
                          options={DAMAGE_TYPES.map(t => ({ value: t, label: t }))}
                          onChange={(v) => updateExtraDamage(ed.id, "type", v)}
                          style={{ width: 72 }}
                        />
                        <button onClick={() => removeExtraDamage(ed.id)} style={{ ...T, border: "none", background: "transparent", cursor: "pointer", color: sheetColors.textLighter }}>×</button>
                      </div>
                    ))}
                    <AddButton onClick={addExtraDamage}>+ 额外伤害</AddButton>
                  </div>
                </div>
              </div>
            </>
          )}

          {divider}

          {/* ── 特性 ── */}
          <SectionLabel>特性</SectionLabel>
          {data.features.map((f) => (
            <FeatureRow
              key={f.id}
              feature={f}
              onUpdate={updateFeature}
              onRemove={removeFeature}
            />
          ))}
          <AddButton onClick={addFeature}>+ 添加特性</AddButton>

          {divider}

          {/* ── 是否为武器 ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <ButtonComponent
              checked={data.isWeapon}
              onChange={() => {
                if (data.isWeapon && character) {
                  const newEntries = character.attackEntries.filter(e => !(e.type === "weapon" && e.refId === data.id));
                  updateCharacter({ attackEntries: newEntries });
                }
                const next = !data.isWeapon;
                set("isWeapon", next);
                if (next) set("proficient", true);
              }}
            />
            <span style={{ ...T, color: sheetColors.textMedium, fontSize: "13px" }}>保存为攻击武器</span>
          </div>
        </ScrollArea>
      </div>
    </div>,
    document.body
  );
}
