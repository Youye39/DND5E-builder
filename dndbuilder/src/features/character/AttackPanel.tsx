import React from "react";
import ReactDOM from "react-dom";
import { useState, useCallback, useRef, useMemo } from 'react';
import { sheetColors } from "../../shared/tokens/colors";
import AttackComponent from './WeaponComponent';
import SectionContainer from "../../shared/ui/SectionContainer";
import { ItemTooltip } from "./ItemTooltip";
import { HitTooltip, DamageTooltip } from "./WeaponTip";
import ScrollArea from "../../shared/ui/ScrollArea";
import { useCharacter } from "../../shared/storage/CharacterContext";
import type { Item, AttackEntry, SpellData, ExtraBonus } from "../../shared/types/types";
import { ItemDialog } from "./ItemDialog";
import { SpellDialog } from "../spells/SpellDialog";
import SpellTip from "../spells/SpellTip";

interface AttackPanelProps {
  className?: string;
}

const FVAR = "'CTGR' 0, 'wdth' 100";
const T: React.CSSProperties = {
  fontSize: "13px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: FVAR,
};

// ═══ 辅助：计算攻击加值 ═════════════════════════════════════════════════

function calcAbilityModNum(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** 解析伤害字符串，分离骰子部分与固定数值部分 */
function parseDice(raw: string): { dice: string; flat: number } {
  const trimmed = raw.trim();
  if (!trimmed) return { dice: "", flat: 0 };
  // 纯数字 → 固定伤害
  if (/^\d+$/.test(trimmed)) return { dice: "", flat: parseInt(trimmed, 10) };
  // 含 "d" → 骰子表达式（可能带固定加值）
  const match = trimmed.match(/^(\d*d\d+)([+-]\d+)?$/);
  if (match) return { dice: match[1], flat: parseInt(match[2] || "0", 10) || 0 };
  // 无法识别，整体作为骰子串
  return { dice: trimmed, flat: 0 };
}

/** 合并所有伤害来源（基础 + 额外），按伤害类型归类合并 */
function consolidateItemDamage(item: Item, attrs: AttrMap): string {
  if (!item.damageDice) return "";

  const groups: Record<string, { dice: string[]; flat: number }> = {};

  // 基础伤害
  const baseType = item.damageType || "—";
  if (!groups[baseType]) groups[baseType] = { dice: [], flat: 0 };
  groups[baseType].dice.push(item.damageDice);
  if (item.attackAttr && item.attackAttr !== "custom") {
    const key = ATTR_KEY_MAP[item.attackAttr];
    const attrScore = attrs[key] ?? 10;
    groups[baseType].flat += calcAbilityModNum(attrScore);
  }

  // 额外伤害
  for (const ed of item.extraDamages ?? []) {
    const t = ed.type || "—";
    if (!groups[t]) groups[t] = { dice: [], flat: 0 };
    const p = parseDice(ed.dice);
    if (p.dice) groups[t].dice.push(p.dice);
    groups[t].flat += p.flat;
  }

  // 格式化为字符串
  return Object.entries(groups)
    .filter(([, g]) => g.dice.length > 0 || g.flat !== 0)
    .map(([type, g]) => {
      const parts: string[] = [];
      if (g.dice.length > 0) parts.push(g.dice.join("+"));
      if (g.flat > 0) parts.push(`${g.flat}`);
      else if (g.flat < 0) parts.push(`${g.flat}`);
      return parts.join("+") + type;
    })
    .join("+") || "—";
}

type AttrMap = { str: number; dex: number; con: number; int: number; wis: number; cha: number };

const ATTR_KEY_MAP: Record<string, keyof AttrMap> = {
  str: "str", dex: "dex", con: "con",
  int: "int", wis: "wis", cha: "cha",
};

function getItemAttackBonus(item: Item, attrs: AttrMap, profBonus: number): string {
  if (item.attackAttr === "custom") return item.attackBonus || "—";
  const key = ATTR_KEY_MAP[item.attackAttr ?? "str"];
  const attrScore = attrs[key] ?? 10;
  const attrMod = calcAbilityModNum(attrScore);
  const prof = item.proficient ? profBonus : 0;
  const magic = item.isMagic ? 1 : 0;
  const extra = parseInt(item.extraAttackBonus || "0") || 0;
  const total = attrMod + prof + magic + extra;
  return total >= 0 ? `+${total}` : `${total}`;
}

function getSpellDamage(spell: SpellData): string {
  if (!spell.damageDice) return "";
  return spell.damageDice + (spell.damageType ?? "");
}

function getSpellAttackDisplay(
  spell: SpellData,
  spellcastingAbility: string,
  attrs: AttrMap,
  proficiencyBonus: number,
  spellAttackExtras: ExtraBonus[],
  spellSaveDCExtras: ExtraBonus[],
): string {
  if (!spell.saveType) return "";
  const innateAbility = (spell.innateAbility ?? spellcastingAbility) as keyof AttrMap;
  const score = attrs[innateAbility] ?? 10;
  const mod = Math.floor((score - 10) / 2);
  const prof = proficiencyBonus ?? 2;
  if (spell.saveType === "attack") {
    const extras = spellAttackExtras.reduce((s, eb) => s + (parseInt(eb.value) || 0), 0);
    const total = mod + prof + extras;
    return total >= 0 ? `+${total}` : `${total}`;
  } else {
    const extras = spellSaveDCExtras.reduce((s, eb) => s + (parseInt(eb.value) || 0), 0);
    const dc = 8 + mod + prof + extras;
    return `DC${dc}`;
  }
}

// ═══ 显示数据计算 ═══════════════════════════════════════════════════════

interface DisplayData {
  name: string;
  attackBonus: string;
  damage: string;
  item?: Item;
  spell?: SpellData;
}

// ═══ Tooltip 类型 ═══════════════════════════════════════════════════════

type HoverColumn = "name" | "attack" | "damage";

interface HoverState {
  index: number;
  column: HoverColumn;
  left: number;
  top: number;
}

// ═══ 主组件 ═════════════════════════════════════════════════════════════

export default function AttackPanel({ className }: AttackPanelProps) {
  const { character, updateCharacter } = useCharacter();
  if (!character) return null;

  const { items, attackEntries, attributes, proficiencyBonus, spellcastingAbility, spellBoxes, spellAttackExtras, spellSaveDCExtras } = character;

  // 收集所有法术
  const allSpells = useMemo(() => spellBoxes.flatMap(box => box.spells ?? []), [spellBoxes]);

  const attrs: AttrMap = {
    str: attributes.str_value,
    dex: attributes.dex_value,
    con: attributes.con_value,
    int: attributes.int_value,
    wis: attributes.wis_value,
    cha: attributes.cha_value,
  };

  // 确保至少有 1 个空条目
  const safeEntries = attackEntries.length > 0 ? attackEntries : [];

  const setAttackEntries = (entries: AttackEntry[]) => updateCharacter({ attackEntries: entries });
  const setItems = (newItems: Item[]) => updateCharacter({ items: newItems });

  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [spellDialogOpen, setSpellDialogOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState<SpellData | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [spellPickerOpen, setSpellPickerOpen] = useState(false);
  const [equipmentPickerOpen, setEquipmentPickerOpen] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideLocked = useRef(false);

  // ── 拖拽排序（参考 SpellBox） ──
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const dragStartYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const placeholderIndexRef = useRef<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const _dragHappened = useRef(false);

  const ITEM_H = 28;
  const ITEM_GAP = 8;
  const SLOT = ITEM_H + ITEM_GAP;

  // ── 右键菜单 ──
  const [contextMenu, setContextMenu] = useState<{ index: number; x: number; y: number } | null>(null);

  // ── 计算每个条目的显示数据 ──
  const displayList: DisplayData[] = useMemo(() => {
    const result: DisplayData[] = [];
    for (let i = 0; i < safeEntries.length; i++) {
      const entry = safeEntries[i];
      if (entry.type === "weapon") {
        const item = items.find(it => it.id === entry.refId);
        if (!item || !item.name) {
          result.push({ name: "", attackBonus: "", damage: "" });
          continue;
        }
        result.push({
          name: item.name,
          attackBonus: getItemAttackBonus(item, attrs, proficiencyBonus),
          damage: consolidateItemDamage(item, attrs),
          item,
        });
      } else {
        // spell
        const spell = allSpells.find(s => s.id === entry.refId);
        if (!spell || !spell.name) {
          result.push({ name: "", attackBonus: "", damage: "" });
          continue;
        }
        result.push({
          name: spell.name,
          attackBonus: getSpellAttackDisplay(spell, spellcastingAbility, attrs, proficiencyBonus, spellAttackExtras, spellSaveDCExtras),
          damage: getSpellDamage(spell),
          spell,
        });
      }
    }
    // 末尾始终留一个空行（+号）
    result.push({ name: "", attackBonus: "", damage: "" });
    return result;
  }, [safeEntries, items, allSpells, attrs, proficiencyBonus, spellcastingAbility, attributes, spellAttackExtras, spellSaveDCExtras]);

  // ── 保存物品条目 ──
  const handleSaveItem = useCallback((item: Item) => {
    const currentEntries = [...safeEntries];
    const currentItems = [...items];

    // 更新 items 列表
    const existingIdx = currentItems.findIndex(i => i.id === item.id);
    if (existingIdx >= 0) {
      currentItems[existingIdx] = item;
    } else {
      if (!item.id || item.id.startsWith("item_")) {
        item.id = `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      }
      currentItems.push(item);
    }

    if (item.isWeapon) {
      // 创建或更新 attack entry
      const newEntry: AttackEntry = { id: `attack_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type: "weapon", refId: item.id };
      if (editingIndex !== null && editingIndex < currentEntries.length) {
        currentEntries[editingIndex] = newEntry;
      } else {
        currentEntries.push(newEntry);
      }
    } else {
      // 取消武器 → 删除对应的 attack entry
      const filtered = currentEntries.filter(e => !(e.type === "weapon" && e.refId === item.id));
      setAttackEntries(filtered);
      setItems(currentItems);
      setItemDialogOpen(false);
      setEditingIndex(null);
      return;
    }

    setItems(currentItems);
    setAttackEntries(currentEntries);
    setItemDialogOpen(false);
    setEditingIndex(null);
  }, [safeEntries, items, editingIndex, setItems, setAttackEntries]);

  // ── 点击行 ↦ 打开对话框 ──
  const handleClick = useCallback((i: number) => {
    const entry = attackEntries[i];
    if (entry?.type === "spell") {
      const spell = allSpells.find(s => s.id === entry.refId);
      if (spell) {
        setEditingSpell(spell);
        setSpellDialogOpen(true);
      }
      return;
    }
    setEditingIndex(i);
    if (entry?.type === "weapon") {
      // 编辑已有武器 → 打开物品编辑
      const item = items.find(it => it.id === entry.refId);
      setEditingItem(item ?? null);
      setItemDialogOpen(true);
    } else {
      // 空行 → 显示选择模式
      setSelectMode(true);
    }
  }, [attackEntries, allSpells, items]);

  // ── Tooltip 管理 ──
  const scheduleHide = useCallback(() => {
    if (hideLocked.current) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHover(null), 200);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);

  const handleColumnEnter = useCallback((i: number, column: HoverColumn, e: React.MouseEvent) => {
    cancelHide();
    const rect = e.currentTarget.getBoundingClientRect();
    setHover({ index: i, column, left: rect.left, top: rect.top + rect.height / 2 });
  }, [cancelHide]);

  const handleFocusLock = useCallback(() => { hideLocked.current = true; }, []);
  const handleFocusUnlock = useCallback(() => { hideLocked.current = false; }, []);

  // ── 特性修改（装备同步） ──
  const handleChargeChange = useCallback((featureId: string, note: string) => {
    if (!hover || !displayList[hover.index]?.item) return;
    const targetItem = displayList[hover.index].item!;
    const newItems = items.map(it =>
      it.id === targetItem.id
        ? { ...it, features: it.features.map(f => f.id === featureId ? { ...f, note } : f) }
        : it
    );
    setItems(newItems);
  }, [hover, displayList, items, setItems]);

  // ── 拖拽排序逻辑 ──
  const onMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    if ((e.target as HTMLElement).closest('button, input, [contenteditable]')) return;

    longPressTimer.current = setTimeout(() => {
      setDragIndex(index);
      setPlaceholderIndex(index);
      dragIndexRef.current = index;
      placeholderIndexRef.current = index;
      dragStartYRef.current = e.clientY;
      setDragY(0);
    }, 100);

    const onMouseMove = (ev: MouseEvent) => {
      if (dragIndexRef.current === null) {
        if (Math.abs(ev.clientY - e.clientY) > 5) {
          if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
        }
        return;
      }
      const delta = ev.clientY - dragStartYRef.current;
      setDragY(delta);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetY = ev.clientY - rect.top + containerRef.current.scrollTop;
        const total = safeEntries.length;
        const newIndex = Math.round(offsetY / SLOT);
        const clamped = Math.max(0, Math.min(newIndex, total - 1));
        setPlaceholderIndex(clamped);
        placeholderIndexRef.current = clamped;
      }
    };

    const onMouseUp = () => {
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      const di = dragIndexRef.current;
      const pi = placeholderIndexRef.current;
      if (di !== null && pi !== null && di !== pi) {
        const next = [...safeEntries];
        const [item] = next.splice(di, 1);
        next.splice(pi, 0, item);
        setAttackEntries(next);
        _dragHappened.current = true;
      }
      setDragIndex(null);
      setPlaceholderIndex(null);
      dragIndexRef.current = null;
      placeholderIndexRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [safeEntries, setAttackEntries]);

  const getTransform = (index: number) => {
    if (dragIndex === null || placeholderIndex === null) return 'none';
    if (index === dragIndex) return `translateY(${dragY}px)`;
    if (
      index > Math.min(dragIndex, placeholderIndex) &&
      index <= Math.max(dragIndex, placeholderIndex)
    ) {
      return `translateY(${dragIndex < placeholderIndex ? -SLOT : SLOT}px)`;
    }
    return 'none';
  };

  // ── 右键删除 ──
  const handleContextMenu = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (index < safeEntries.length) {
      setContextMenu({ index, x: e.clientX, y: e.clientY });
    }
  }, [safeEntries.length]);

  const handleDeleteEntry = useCallback((index: number) => {
    const newEntries = safeEntries.filter((_, i) => i !== index);
    setAttackEntries(newEntries);
    setContextMenu(null);
  }, [safeEntries, setAttackEntries]);

  const currentDisplay = hover ? displayList[hover.index] : null;

  return (
    <>
      <SectionContainer title="攻击" className={`${className || ""} w-[358px] h-[304px]`}>
        <div className="absolute top-[7px] left-[13px] right-[14px] flex text-[10px] text-sheet-text-secondary font-serif-regular gap-[5px]">
          <span className="w-[130px]">武器/法术</span>
          <span className="w-[61px]">攻击加值</span>
          <span className="w-[130px]">伤害/类型</span>
        </div>

        <ScrollArea className="absolute top-[23px] left-[13px] right-[3px] bottom-[33px]">
          <div ref={containerRef} className="flex flex-col gap-[8px]">
            {displayList.map((d, i) => {
              const isLast = i === displayList.length - 1;
              const isDraggable = !isLast && d.name;
              return (
                <div
                  key={`${safeEntries[i]?.id ?? 'empty'}_${i}`}
                  onMouseDown={isDraggable ? (e) => onMouseDown(e, i) : undefined}
                  onContextMenu={!isLast ? (e) => handleContextMenu(e, i) : undefined}
                  onClick={() => {
                    if (_dragHappened.current) {
                      _dragHappened.current = false;
                      return;
                    }
                    handleClick(i);
                  }}
                  style={{
                    transform: isLast ? 'none' : getTransform(i),
                    transition: dragIndex !== null && !isLast ? 'transform 0.15s ease' : 'none',
                    position: 'relative',
                    zIndex: dragIndex === i ? 10 : 1,
                    cursor: isDraggable ? 'grab' : undefined,
                  }}
                >
                  <AttackComponent
                    variant={d.name ? 'filled' : 'toFill'}
                    name={d.name}
                    attackBonus={d.attackBonus}
                    damage={d.damage}
                    onNameEnter={(e) => handleColumnEnter(i, "name", e)}
                    onAttackEnter={(e) => handleColumnEnter(i, "attack", e)}
                    onDamageEnter={(e) => handleColumnEnter(i, "damage", e)}
                    onMouseLeave={scheduleHide}
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SectionContainer>

      {/* Tooltips */}
      {currentDisplay?.spell && hover && currentDisplay.name && hover.column === "name" && (
        <SpellTip
          spell={currentDisplay.spell}
          mouseY={hover.top}
          cardLeft={hover.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        />
      )}
      {currentDisplay?.item && hover && currentDisplay.name && hover.column === "name" && currentDisplay.item.features.length > 0 && (
        <ItemTooltip
          item={currentDisplay.item}
          mouseY={hover.top}
          cardLeft={hover.left}
          overrideLeft={hover.left - 228}
          overrideTop={Math.max(4, Math.min(hover.top - 10, window.innerHeight - 200))}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onChargeChange={handleChargeChange}
          onFocusLock={handleFocusLock}
          onFocusUnlock={handleFocusUnlock}
        />
      )}
      {currentDisplay?.item && hover && currentDisplay.name && hover.column === "attack" && (
        <HitTooltip
          weapon={currentDisplay.item}
          mouseY={hover.top}
          cardLeft={hover.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        />
      )}
      {currentDisplay?.item && hover && currentDisplay.name && hover.column === "damage" && currentDisplay.item.damageDice && (
        <DamageTooltip
          weapon={currentDisplay.item}
          mouseY={hover.top}
          cardLeft={hover.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}          computedMod={(() => {
            const item = currentDisplay.item;
            if (item.attackAttr && item.attackAttr !== "custom") {
              const key = ATTR_KEY_MAP[item.attackAttr];
              const score = attrs[key] ?? 10;
              const mod = Math.floor((score - 10) / 2);
              if (mod !== 0) return mod > 0 ? `+${mod}` : `${mod}`;
            }
            return undefined;
          })()}        />
      )}

      {/* Select mode: 空行点击后选择添加类型 */}
      {selectMode && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          onClick={(e) => e.target === e.currentTarget && setSelectMode(false)}
        >
          <div style={{
            width: "320px", backgroundColor: sheetColors.cardBg, borderRadius: "10px",
            border: "1px solid var(--color-border)", padding: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.11)", fontVariationSettings: FVAR,
          }}>
            <div className="text-base" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary, fontWeight: 600, marginBottom: 12 }}>
              选择攻击来源
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                onClick={() => { setSelectMode(false); setEditingItem({ id: "", name: "", quantity: 1, features: [], isWeapon: true } as Item); setItemDialogOpen(true); }}
                style={{
                  display: "flex", flexDirection: "column", gap: 2, padding: "10px 14px", borderRadius: "2px",
                  border: `1px solid ${sheetColors.borderLight}`, backgroundColor: sheetColors.cardBg,
                  cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.contentBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
              >
                <span style={{ fontSize: "13px", fontFamily: "var(--font-serif-medium)", color: sheetColors.textPrimary }}>新建武器</span>
              </button>
              <button
                onClick={() => { setSelectMode(false); setEquipmentPickerOpen(true); }}
                style={{
                  display: "flex", flexDirection: "column", gap: 2, padding: "10px 14px", borderRadius: "2px",
                  border: `1px solid ${sheetColors.borderLight}`, backgroundColor: sheetColors.cardBg,
                  cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.contentBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
              >
                <span style={{ fontSize: "13px", fontFamily: "var(--font-serif-medium)", color: sheetColors.textPrimary }}>从装备选择</span>
              </button>
              <button
                onClick={() => { setSelectMode(false); setSpellPickerOpen(true); }}
                style={{
                  display: "flex", flexDirection: "column", gap: 2, padding: "10px 14px", borderRadius: "2px",
                  border: `1px solid ${sheetColors.borderLight}`, backgroundColor: sheetColors.cardBg,
                  cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.contentBg; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
              >
                <span style={{ fontSize: "13px", fontFamily: "var(--font-serif-medium)", color: sheetColors.textPrimary }}>从法术选择</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Spell picker: 从已有法术中选择 */}
      {spellPickerOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          onClick={(e) => e.target === e.currentTarget && setSpellPickerOpen(false)}
        >
          <div style={{
            width: "360px", maxHeight: "480px", display: "flex", flexDirection: "column",
            backgroundColor: sheetColors.cardBg, borderRadius: "10px",
            border: "1px solid var(--color-border)", overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.11)", fontVariationSettings: FVAR,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}` }}>
              <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>选择法术</span>
              <button onClick={() => setSpellPickerOpen(false)} style={{ ...T, border: "none", background: "transparent", cursor: "pointer", color: sheetColors.textPlaceholder }}>取消</button>
            </div>
            <ScrollArea style={{ flex: 1, padding: "12px 16px" }}>
              {allSpells.filter(s => s.name && s.saveType && !safeEntries.some(e => e.type === "spell" && e.refId === s.id)).length === 0 ? (
                <div style={{ ...T, color: sheetColors.textPlaceholder, textAlign: "center", padding: 24 }}>暂无</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {allSpells.filter(s => s.name && s.saveType && !safeEntries.some(e => e.type === "spell" && e.refId === s.id)).map((spell) => (
                    <button
                      key={spell.id}
                      onClick={() => {
                        const newEntry: AttackEntry = { id: `attack_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type: "spell", refId: spell.id };
                        const newEntries = [...safeEntries, newEntry];
                        setAttackEntries(newEntries);
                        setSpellPickerOpen(false);
                      }}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 14px", borderRadius: "2px",
                        border: `1px solid ${sheetColors.borderLight}`, backgroundColor: sheetColors.cardBg,
                        cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.contentBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
                    >
                      <span style={{ fontSize: "13px", fontFamily: "var(--font-serif-medium)", color: sheetColors.textPrimary }}>{spell.name}</span>
                      {spell.damageDice && <span style={{ fontSize: "11px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textPlaceholder }}>{spell.damageDice}</span>}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>,
        document.body
      )}

      {/* Equipment picker: 从已有装备武器中选择 */}
      {equipmentPickerOpen && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          onClick={(e) => e.target === e.currentTarget && setEquipmentPickerOpen(false)}
        >
          <div style={{
            width: "360px", maxHeight: "480px", display: "flex", flexDirection: "column",
            backgroundColor: sheetColors.cardBg, borderRadius: "10px",
            border: "1px solid var(--color-border)", overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.11)", fontVariationSettings: FVAR,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${sheetColors.hoverBg}` }}>
              <span className="text-base font-semibold" style={{ fontFamily: "var(--font-serif-bold)", color: sheetColors.textPrimary }}>选择装备武器</span>
              <button onClick={() => setEquipmentPickerOpen(false)} style={{ ...T, border: "none", background: "transparent", cursor: "pointer", color: sheetColors.textPlaceholder }}>取消</button>
            </div>
            <ScrollArea style={{ flex: 1, padding: "12px 16px" }}>
              {items.filter(i => i.isWeapon && i.name && !safeEntries.some(e => e.type === "weapon" && e.refId === i.id)).length === 0 ? (
                <div style={{ ...T, color: sheetColors.textPlaceholder, textAlign: "center", padding: 24 }}>暂无</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {items.filter(i => i.isWeapon && i.name && !safeEntries.some(e => e.type === "weapon" && e.refId === i.id)).map((weapon) => (
                    <button
                      key={weapon.id}
                      onClick={() => {
                        const newEntry: AttackEntry = { id: `attack_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, type: "weapon", refId: weapon.id };
                        const newEntries = [...safeEntries, newEntry];
                        setAttackEntries(newEntries);
                        setEquipmentPickerOpen(false);
                      }}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 14px", borderRadius: "2px",
                        border: `1px solid ${sheetColors.borderLight}`, backgroundColor: sheetColors.cardBg,
                        cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.contentBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
                    >
                      <span style={{ fontSize: "13px", fontFamily: "var(--font-serif-medium)", color: sheetColors.textPrimary }}>{weapon.name}</span>
                      {weapon.damageDice && <span style={{ fontSize: "11px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textPlaceholder }}>{weapon.damageDice}</span>}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>,
        document.body
      )}

      {/* 右键删除菜单 */}
      {contextMenu && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[9999]"
          onClick={() => setContextMenu(null)}
          onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
        >
          <div
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              backgroundColor: sheetColors.cardBg,
              border: "1px solid var(--color-border)",
              borderRadius: "4px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              minWidth: "100px",
              zIndex: 10000,
              padding: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => handleDeleteEntry(contextMenu.index)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                color: sheetColors.textDark,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              删除
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Dialog: 物品/武器编辑 */}
      {itemDialogOpen && (
        <ItemDialog
          open={itemDialogOpen}
          initialItem={editingItem ?? undefined}
          onSave={handleSaveItem}
          onDelete={editingItem ? () => setItemDialogOpen(false) : undefined}
          onClose={() => { setItemDialogOpen(false); setEditingIndex(null); setEditingItem(null); }}
        />
      )}

      {/* Dialog: 法术编辑 */}
      {spellDialogOpen && editingSpell && (
        <SpellDialog
          open={spellDialogOpen}
          initialSpell={editingSpell}
          isCantrip={false}
          onSave={(s) => {
            const newBoxes = character.spellBoxes.map(box => ({
              ...box,
              spells: box.spells.map(sp => sp.id === s.id ? s : sp),
            }));
            updateCharacter({ spellBoxes: newBoxes });
            setSpellDialogOpen(false);
            setEditingSpell(null);
          }}
          onDelete={() => setSpellDialogOpen(false)}
          onClose={() => { setSpellDialogOpen(false); setEditingSpell(null); }}
        />
      )}
    </>
  );
}
