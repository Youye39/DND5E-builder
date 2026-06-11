import { useState, useRef, useEffect } from "react";
import { sheetColors } from "../../../shared/tokens/colors";

interface WeaponTag {
  id: string;
  label: string;
  description: string;
}

interface TagSectionProps {
  tags: string[];
  availableTags: WeaponTag[];
  onToggleTag: (tagId: string) => void;
}

const MUTED: React.CSSProperties = {
  fontSize: "12px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textLighter, fontVariationSettings: "'CTGR' 0, 'wdth' 100",
};

function TagChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        padding: "2px 6px", borderRadius: "2px",
        backgroundColor: sheetColors.hoverBg, color: sheetColors.textDark,
        fontSize: "12px", fontFamily: "var(--font-serif-regular)",
        lineHeight: 1.4,
      }}
    >
      {label}
      <span
        onClick={onRemove}
        style={{ cursor: "pointer", color: sheetColors.textLighter, fontSize: "12px", lineHeight: 1, marginLeft: 1, display: "flex", alignItems: "center" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = sheetColors.textDark)}
        onMouseLeave={(e) => (e.currentTarget.style.color = sheetColors.textLighter)}
      >
        ×
      </span>
    </span>
  );
}

export default function TagSection({ tags, availableTags, onToggleTag }: TagSectionProps) {
  const [showPicker, setShowPicker] = useState(false);
  const tagPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPicker) return;
    const handler = (e: MouseEvent) => {
      if (tagPickerRef.current && !tagPickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
      {tags.map((tagId) => {
        const tag = availableTags.find((t) => t.id === tagId);
        return tag ? <TagChip key={tagId} label={tag.label} onRemove={() => onToggleTag(tagId)} /> : null;
      })}
      <div ref={tagPickerRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{ ...MUTED, border: "none", background: "transparent", cursor: "pointer", padding: "2px 0", lineHeight: 1.4, display: "flex", alignItems: "center" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = sheetColors.textDark)}
          onMouseLeave={(e) => (e.currentTarget.style.color = sheetColors.textLighter)}
        >
          + 添加属性
        </button>
        {showPicker && (
          <div
            style={{
              position: "absolute", zIndex: 100, left: 0, top: "100%", marginTop: 4,
              backgroundColor: sheetColors.cardBg, border: "1px solid var(--color-border)",
              borderRadius: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              padding: "6px", display: "flex", flexWrap: "wrap", gap: 4, minWidth: 240,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {availableTags.filter((t) => !tags.includes(t.id)).map((tag) => (
              <span
                key={tag.id}
                onClick={() => { onToggleTag(tag.id); setShowPicker(false); }}
                style={{ padding: "3px 8px", borderRadius: "2px", backgroundColor: sheetColors.pageBg, cursor: "pointer", fontSize: "12px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.hoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.pageBg)}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
