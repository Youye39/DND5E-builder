import { useState, useCallback, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import SectionContainer from "../../shared/components/SectionContainer";
import ScrollArea from "../../shared/components/ScrollArea";
import { useCharacter } from "../../shared/storage/CharacterContext";
import type { Item } from "../../shared/types/types";
import { createDefaultItem } from "../../shared/types/types";
import { ItemDialog } from "./ItemDialog";
import { ItemTooltip } from "./ItemTooltip";
import { sheetColors } from "../../shared/tokens/colors";

interface EquipmentPanelProps {
  className?: string;
}

export default function EquipmentPanel({ className }: EquipmentPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const items = character?.items ?? [];
  const setItems = (newItems: Item[]) => updateCharacter({ items: newItems });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ left: 0, top: 0 });
  const [quantityEditIndex, setQuantityEditIndex] = useState<number | null>(null);
  const [quantityValue, setQuantityValue] = useState("");
  const [inputText, setInputText] = useState("");
  const [contextMenu, setContextMenu] = useState<{ index: number; x: number; y: number } | null>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLTextAreaElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideLocked = useRef(false);

  // 自动聚焦数量输入框
  useEffect(() => {
    if (quantityEditIndex !== null && quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  }, [quantityEditIndex]);

  // 敲入分隔符时立即分割
  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  const commitInput = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    const names = text.split(/[、,，]+/).map(s => s.trim()).filter(Boolean);
    if (names.length === 0) return;
    const newItems = [...items, ...names.map(name => createDefaultItem(name))];
    setItems(newItems);
    setInputText("");
  }, [inputText, items, setItems]);

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitInput();
    }
  }, [commitInput]);

  const scheduleHide = useCallback(() => {
    if (hideLocked.current) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHoveredIndex(null), 350);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);

  const handleItemEnter = useCallback((i: number, e: React.MouseEvent) => {
    cancelHide();
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({ left: rect.left, top: rect.top });
    setHoveredIndex(i);
  }, [cancelHide]);

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
    setHoveredIndex(null);
  };

  const handleSave = (item: Item) => {
    const newItems = [...items];
    if (editingIndex !== null) {
      newItems[editingIndex] = item;
    } else {
      newItems.push(item);
    }
    setItems(newItems);
  };

  const handleChargeChange = useCallback((featureId: string, note: string) => {
    if (hoveredIndex === null) return;
    const newItems = [...items];
    const item = { ...newItems[hoveredIndex] };
    item.features = item.features.map((f) =>
      f.id === featureId ? { ...f, note } : f
    );
    newItems[hoveredIndex] = item;
    setItems(newItems);
  }, [hoveredIndex, items, setItems]);

  const handleFocusLock = useCallback(() => { hideLocked.current = true; }, []);
  const handleFocusUnlock = useCallback(() => { hideLocked.current = false; }, []);

  const startQuantityEdit = (i: number, currentQty: number) => {
    setQuantityEditIndex(i);
    setQuantityValue(String(currentQty));
  };

  const commitQuantity = (i: number) => {
    const newQty = Math.max(1, parseInt(quantityValue) || 1);
    const newItems = [...items];
    newItems[i] = { ...newItems[i], quantity: newQty };
    setItems(newItems);
    setQuantityEditIndex(null);
  };

  const handleDeleteItem = useCallback((itemId: string) => {
    if (!character) return;
    const newItems = character.items.filter(it => it.id !== itemId);
    const newEntries = character.attackEntries.filter(e => !(e.type === "weapon" && e.refId === itemId));
    updateCharacter({ items: newItems, attackEntries: newEntries });
  }, [character, updateCharacter]);

  // ── 右键删除 ──
  const handleContextMenu = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ index, x: e.clientX, y: e.clientY });
  }, []);

  const handleDeleteItemFromMenu = useCallback((index: number) => {
    handleDeleteItem(items[index].id);
    setContextMenu(null);
  }, [items, handleDeleteItem]);

  // 如果物品有特性或描述才显示 tooltip
  const showTooltip = hoveredIndex !== null && items[hoveredIndex] && (
    items[hoveredIndex].features.length > 0 || !!items[hoveredIndex].description
  );

  // 移入库存
  const handleMoveToInventory = useCallback((index: number) => {
    const item = items[index];
    if (!item) return;
    const label = item.quantity > 1 ? `${item.name}×${item.quantity}` : item.name;
    const prefix = character?.inventory ? `${character.inventory}\n` : "";
    updateCharacter({
      inventory: `${prefix}${label}`,
      items: items.filter((_, i) => i !== index),
    });
    setContextMenu(null);
  }, [items, character, updateCharacter]);

  return (
    <>
      <SectionContainer title="装备" className={`${className || ""} w-[358px] h-[437px]`}>
        <ScrollArea className="absolute top-[56px] left-[9px] right-[9px] bottom-[33px] bg-sheet-content-bg rounded-[2px]">
          {/* 物品列表 + 尾部行内输入框 */}
          <div className="pl-[8px] pt-[5px] pb-[5px] min-h-full">
            {items.map((item, i) => (
              <span key={item.id} className="inline">
                {i > 0 && <span className="text-sheet-text-secondary">、</span>}
                <span
                  onClick={() => openEditDialog(i)}
                  onContextMenu={(e) => handleContextMenu(e, i)}
                  onMouseEnter={(e) => handleItemEnter(i, e)}
                  onMouseLeave={scheduleHide}
                  className="font-serif-regular-cjk text-[18px] text-black leading-normal cursor-pointer hover:bg-sheet-hover-bg rounded-[1px] px-[2px]"
                >
                  {item.name}
                </span>
                {item.quantity > 1 && (
                  quantityEditIndex === i ? (
                    <span className="text-sheet-text-secondary">
                      ×
                      <input
                        ref={quantityInputRef}
                        type="number"
                        min={1}
                        value={quantityValue}
                        onChange={(e) => setQuantityValue(e.target.value)}
                        onBlur={() => commitQuantity(i)}
                        onKeyDown={(e) => { if (e.key === "Enter") commitQuantity(i); if (e.key === "Escape") setQuantityEditIndex(null); }}
                        className="p-0 border-none bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{
                          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
                          width: `${Math.max(20, quantityValue.length * 10)}px`,
                          font: "inherit",
                          color: "inherit",
                          lineHeight: "normal",
                          verticalAlign: "baseline",
                        }}
                      />
                    </span>
                  ) : (
                    <span
                      className="text-sheet-text-secondary cursor-pointer hover:text-sheet-text-dark"
                      onClick={(e) => { e.stopPropagation(); startQuantityEdit(i, item.quantity); }}
                    >
                      ×{item.quantity}
                    </span>
                  )
                )}
              </span>
            ))}
            {/* 输入框：自动换行，不会撑宽容器 */}
            <textarea
              ref={addInputRef as React.Ref<HTMLTextAreaElement>}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={commitInput}
              placeholder={items.length === 0 ? "输入物品" : "添加物品"}
              rows={1}
              className="block w-full bg-transparent border-none outline-none resize-none overflow-hidden font-serif-regular-cjk text-[18px] text-black placeholder:text-sheet-text-placeholder leading-normal pl-[2px]"
              style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }}
            />
          </div>
        </ScrollArea>
      </SectionContainer>

      {/* Tooltip */}
      {showTooltip && (
        <ItemTooltip
          item={items[hoveredIndex!]}
          mouseY={hoverPos.top}
          cardLeft={hoverPos.left}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onChargeChange={handleChargeChange}
          onFocusLock={handleFocusLock}
          onFocusUnlock={handleFocusUnlock}
        />
      )}

      {/* Dialog */}
      {dialogOpen && (
        <ItemDialog
          open={dialogOpen}
          initialItem={editingIndex !== null ? items[editingIndex] : undefined}
          onSave={handleSave}
          onDelete={editingIndex !== null && items[editingIndex] ? () => handleDeleteItem(items[editingIndex].id) : undefined}
          onClose={() => setDialogOpen(false)}
        />
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
              onClick={() => handleMoveToInventory(contextMenu.index)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                color: sheetColors.textDark,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = sheetColors.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              移入库存
            </div>
            <div
              onClick={() => handleDeleteItemFromMenu(contextMenu.index)}
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
    </>
  );
}
