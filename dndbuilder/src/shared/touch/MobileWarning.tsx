import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../tokens/colors";

const FVAR = "'CTGR' 0, 'wdth' 100";

export default function MobileWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 只显示一次
    if (localStorage.getItem("mobile_warning_dismissed")) return;
    const check = () => setShow(window.innerWidth < 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("mobile_warning_dismissed", "1");
    setShow(false);
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={(e) => e.target === e.currentTarget && handleDismiss()}
    >
      <div
        style={{
          width: "90%", maxWidth: "360px",
          backgroundColor: sheetColors.cardBg, borderRadius: "10px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11)",
          padding: "24px 20px 20px",
          fontVariationSettings: FVAR,
          textAlign: "center",
        }}
      >
        <div
          className="font-serif-bold-cjk font-bold text-[16px]"
          style={{ color: sheetColors.textDark, marginBottom: 12 }}
        >
          提示
        </div>
        <p
          className="font-serif-medium-cjk text-[14px]"
          style={{ lineHeight: 1.6, color: sheetColors.textMedium, marginBottom: 20 }}
        >
          为了获得更好的体验，请使用电脑或平板打开。
        </p>
        <button
          onClick={handleDismiss}
          className="font-serif-medium-cjk text-[14px]"
          style={{
            padding: "6px 24px",
            border: `1px solid ${sheetColors.buttonDarkBg}`,
            borderRadius: "4px",
            backgroundColor: sheetColors.buttonDarkBg,
            color: sheetColors.textWhite,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
        >
          我知道了
        </button>
      </div>
    </div>,
    document.body
  );
}
