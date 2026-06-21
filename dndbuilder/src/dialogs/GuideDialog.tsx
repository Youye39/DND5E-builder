import ReactDOM from "react-dom";
import { sheetColors } from "../shared/tokens/colors";

const FVAR = "'CTGR' 0, 'wdth' 100";

interface GuideDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function GuideDialog({ open, onClose }: GuideDialogProps) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "320px",
          backgroundColor: sheetColors.cardBg,
          borderRadius: "10px",
          border: "1px solid var(--color-border)",
          padding: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11)",
          fontVariationSettings: FVAR,
          position: "relative",
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            lineHeight: 1,
            padding: 0,
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "inherit",
          }}
        >
          ×
        </button>

        <div
          className="text-base font-semibold"
          style={{
            fontFamily: "var(--font-serif-bold)",
            color: sheetColors.textPrimary,
            marginBottom: 16,
          }}
        >
          车卡指引
        </div>

        <div
          style={{
            fontSize: "14px",
            fontFamily: "var(--font-serif-regular)",
            color: sheetColors.textMedium,
            lineHeight: 1.6,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          功能开发中，敬请期待
        </div>
        <div
          style={{
            fontSize: "12px",
            fontFamily: "var(--font-serif-regular)",
            color: sheetColors.textMedium,
            lineHeight: 1.6,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          反馈bug/修改建议 → QQ:1226247814
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "6px 0",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              fontFamily: "var(--font-serif-medium)",
              fontSize: "13px",
              backgroundColor: sheetColors.cardBg,
              color: sheetColors.textDark,
              cursor: "pointer",
              transition: "all 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = sheetColors.pageBg;
              e.currentTarget.style.borderColor = sheetColors.borderLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = sheetColors.cardBg;
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            上一页
          </button>
          <button
            style={{
              flex: 1,
              padding: "6px 0",
              border: `1px solid ${sheetColors.buttonDarkBg}`,
              borderRadius: "2px",
              fontFamily: "var(--font-serif-medium)",
              fontSize: "13px",
              backgroundColor: sheetColors.buttonDarkBg,
              color: sheetColors.textWhite,
              cursor: "pointer",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)
            }
          >
            下一页
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
