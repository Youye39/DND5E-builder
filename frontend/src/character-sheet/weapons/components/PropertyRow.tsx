import { sheetColors } from "../../../shared/tokens/colors";
import type { ExtraProperty } from "../../../../data/weaponState";

const T: React.CSSProperties = {
  fontSize: "12px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: "'CTGR' 0, 'wdth' 100",
};

interface PropertyRowProps {
  property: ExtraProperty;
  onUpdate: (id: string, field: keyof Omit<ExtraProperty, "id">, val: string | number | null) => void;
  onRemove: (id: string) => void;
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

export default function PropertyRow({ property, onUpdate, onRemove }: PropertyRowProps) {
  const ep = property;

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <GhostInput
          type="text"
          value={ep.name}
          placeholder="特性名称"
          onChange={(e) => onUpdate(ep.id, "name", e.target.value)}
          style={{ width: 120, fontWeight: 600 }}
        />
        <input
          type="text"
          value={ep.chargeText ?? "3/3"}
          onChange={(e) => onUpdate(ep.id, "chargeText", e.target.value)}
          style={{ ...T, width: 44, textAlign: "center", border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0, padding: "1px 0", outline: "none", backgroundColor: "transparent", color: sheetColors.textPlaceholder }}
        />
        <div style={{ flex: 1 }} />
        <button
          onClick={() => onRemove(ep.id)}
          style={{ ...T, border: "none", background: "transparent", cursor: "pointer", padding: "0 4px", lineHeight: 1, color: sheetColors.textLighter }}
          onMouseEnter={(e) => { e.currentTarget.style.color = sheetColors.textMedium; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = sheetColors.textLighter; }}
        >
          ×
        </button>
      </div>
      <textarea
        value={ep.description}
        placeholder="特性描述"
        onChange={(e) => onUpdate(ep.id, "description", e.target.value)}
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
