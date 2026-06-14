import { useState, useCallback, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import SectionContainer from "../../shared/components/SectionContainer";
import ScrollArea from "../../shared/components/ScrollArea";
import { useCharacter } from "../../shared/storage/CharacterContext";
import { createDefaultTrait } from "../../shared/types/types";
import type { TraitItem } from "../../shared/types/types";
import { sheetColors } from "../../shared/tokens/colors";
import TraitDialog from "./TraitDialog";
import { TraitTooltip } from "./TraitTooltip";

interface TraitsPanelProps {
  className?: string;
}

export default function TraitsPanel({ className }: TraitsPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const traitList = character?.traitList ?? [];
  const setTraitList = (list: TraitItem[]) => updateCharacter({ traitList: list });

  const [inputText, setInputText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState({ left: 0, top: 0 });
  const [contextMenu, setContextMenu] = useState<{ index: number; x: number; y: number } | null>(null);
  const [focusedUsageIndex, setFocusedUsageIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const measureRef = useRef<HTMLCanvasElement | null>(null);

  // 用 Canvas 精确测量文本宽度
  const getTextPixelWidth = useCallback((text: string): number => {
    if (!text) return 24;
    if (!measureRef.current) {
      measureRef.current = document.createElement('canvas');
    }
    const ctx = measureRef.current.getContext('2d');
    if (!ctx) return text.length * 12 + 8;
    // 匹配实际 CSS font-family 以得到准确的测量结果
    ctx.font = '18px "Noto Serif", "Noto Sans SC", "Noto Sans CJK SC", serif';
    return Math.max(24, Math.ceil(ctx.measureText(text).width) + 6);
  }, []);

  // 迁移：旧的 traits 字符串 → traitList
  useEffect(() => {
    const oldTraits = character?.traits;
    if (oldTraits && oldTraits.trim() && (!character?.traitList || character.traitList.length === 0)) {
      const names = oldTraits.split(/[、,，\n]+/).map(s => s.trim()).filter(Boolean);
      if (names.length > 0) {
        updateCharacter({
          traitList: names.map(name => createDefaultTrait(name)),
          traits: "",
        });
      }
    }
  }, []);

  const commitInput = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    const names = text.split(/[、,，\n]+/).map(s => s.trim()).filter(Boolean);
    if (names.length === 0) return;
    const newTraits = names.map(name => createDefaultTrait(name));
    setTraitList([...traitList, ...newTraits]);
    setInputText("");
  }, [inputText, traitList, setTraitList]);

  const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitInput();
    }
  }, [commitInput]);

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleSave = (trait: TraitItem) => {
    const newList = [...traitList];
    if (editingIndex !== null) {
      newList[editingIndex] = trait;
    } else {
      newList.push(trait);
    }
    setTraitList(newList);
  };

  const handleDeleteTrait = useCallback((index: number) => {
    const newList = traitList.filter((_, i) => i !== index);
    setTraitList(newList);
    setContextMenu(null);
  }, [traitList, setTraitList]);

  const handleContextMenu = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ index, x: e.clientX, y: e.clientY });
  }, []);

  // ── Tooltip ──
  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHoveredIndex(null), 300);
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

  // 清理定时器
  useEffect(() => {
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  const hoveredTrait = hoveredIndex !== null ? traitList[hoveredIndex] ?? null : null;

  return (
    <>
      <SectionContainer title="特性和特质" className={`${className || ""} w-[358px] h-[770px]`}>
        <ScrollArea className="absolute top-[9px] left-[9px] right-[9px] bottom-[33px] bg-sheet-content-bg rounded-[2px] overflow-x-hidden">
          <div className="pl-[8px] pt-[5px] pb-[5px] min-h-full">
            {traitList.map((trait, i) => (
              <div key={trait.id} className="flex items-baseline max-w-full leading-normal">
                <span
                  onClick={() => openEditDialog(i)}
                  onContextMenu={(e) => handleContextMenu(e, i)}
                  onMouseEnter={(e) => handleItemEnter(i, e)}
                  onMouseLeave={scheduleHide}
                  className="min-w-0 flex-1 font-serif-regular-cjk text-[18px] text-black leading-normal cursor-pointer hover:bg-sheet-hover-bg rounded-[1px] px-[2px] truncate"
                >
                  {trait.name}
                </span>
                <span className="shrink-0 whitespace-nowrap text-[18px]">
                  {trait.usage || focusedUsageIndex === i ? "（" : ""}
                  <input
                    type="text"
                    value={trait.usage ?? ""}
                    onChange={(e) => {
                      const newList = [...traitList];
                      newList[i] = { ...newList[i], usage: e.target.value || undefined };
                      setTraitList(newList);
                    }}
                    onFocus={() => setFocusedUsageIndex(i)}
                    onBlur={() => setFocusedUsageIndex(null)}
                    className="p-0 border-none bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{
                      fontVariationSettings: "'CTGR' 0, 'wdth' 100",
                      width: `${getTextPixelWidth(trait.usage ?? "")}px`,
                      font: "inherit",
                      color: "inherit",
                      lineHeight: "normal",
                      verticalAlign: "baseline",
                      maxWidth: "160px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {trait.usage || focusedUsageIndex === i ? "） " : ""}
                </span>
              </div>
            ))}
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={commitInput}
              placeholder={traitList.length === 0 ? "输入特性" : "添加特性"}
              rows={1}
              className="block w-full bg-transparent border-none outline-none resize-none overflow-hidden font-serif-regular-cjk text-[18px] text-black placeholder:text-sheet-text-placeholder leading-normal"
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

      {/* Dialog */}
      {dialogOpen && (
        <TraitDialog
          open={dialogOpen}
          initialTrait={editingIndex !== null ? traitList[editingIndex] : undefined}
          onSave={handleSave}
          onDelete={editingIndex !== null ? () => handleDeleteTrait(editingIndex) : undefined}
          onClose={() => setDialogOpen(false)}
        />
      )}

      {/* Tooltip */}
      <TraitTooltip
        trait={hoveredTrait}
        mouseY={hoverPos.top}
        cardLeft={hoverPos.left}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      />

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
              onClick={() => handleDeleteTrait(contextMenu.index)}
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
