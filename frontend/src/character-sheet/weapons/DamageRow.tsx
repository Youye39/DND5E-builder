import { sheetColors } from "../../shared/tokens/colors";
import { DAMAGE_TYPES } from "../../../data/weaponState";

// ─── Shared styles ────────────────────────────────────────────────────────────

const T: React.CSSProperties = {
  fontSize: "12px", fontFamily: "var(--font-serif-regular)", color: sheetColors.textDark, fontVariationSettings: "'CTGR' 0, 'wdth' 100",
};
const MUTED: React.CSSProperties = { ...T, color: sheetColors.textLighter };

const selectStyle: React.CSSProperties = {
  ...T, border: "none", borderBottom: "1px solid var(--color-border)", borderRadius: 0,
  padding: "4px 24px 4px 0", outline: "none", backgroundColor: "transparent",
  cursor: "pointer", flex: 1, appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23bbb'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 2px center",
};

interface DamageRowProps {
  dice: string;
  onDiceChange: (val: string) => void;
  damageType: string;
  onTypeChange: (val: string) => void;
  /** Optional modifier displayed after dice (e.g. "+2") — base damage only */
  modifier?: string;
  /** Optional remove button shown at the end — extra damage only */
  onRemove?: () => void;
  className?: string;
}

export default function DamageRow({ dice, onDiceChange, damageType, onTypeChange, modifier, onRemove, className = "" }: DamageRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }} className={className}>
      <input
        type="text-xs"
        value={dice}
        placeholder="如 1d6"
        onChange={(e) => onDiceChange(e.target.value)}
        style={{
          ...T, border: "1px solid transparent", borderRadius: "2px",
          padding: "2px 4px", outline: "none", backgroundColor: "transparent",
          transition: "border-color 0.15s, background 0.15s", width: 56,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = sheetColors.borderLight; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
        onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; } }}
        onFocus={(e) => { e.currentTarget.style.borderColor = sheetColors.borderInput; e.currentTarget.style.backgroundColor = sheetColors.cardBg; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = "transparent"; }}
      />
      {modifier !== undefined && (
        <>
          <span style={MUTED}>+</span>
          <span style={{ ...T, color: sheetColors.textSecondary, minWidth: 20 }}>{modifier}</span>
        </>
      )}
      <select value={damageType} onChange={(e) => onTypeChange(e.target.value)} style={selectStyle}>
        {DAMAGE_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      {onRemove && (
        <button
          onClick={onRemove}
          style={{ ...MUTED, border: "none", background: "transparent", cursor: "pointer", padding: "0 4px", lineHeight: 1 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = sheetColors.textMedium; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = sheetColors.textLighter; }}
        >
          ×
        </button>
      )}
    </div>
  );
}
