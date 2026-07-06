import { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { sheetColors } from "../tokens/colors";
import announcementsData from "../../../data/announcements.json";
import { useLanguage } from "../i18n/LanguageContext";

const FVAR = "'CTGR' 0, 'wdth' 100";

// ─── 简易 Markdown 渲染 ─────────────────────────────────────────────────────

/** 将 Markdown 文本渲染为 React 元素 */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 空行
    if (!trimmed) {
      nodes.push(<br key={key++} />);
      continue;
    }

    // 标题 ###
    const h3Match = trimmed.match(/^###\s+(.+)/);
    if (h3Match) {
      nodes.push(
        <div key={key++} style={{ fontWeight: 600, fontSize: "14px", color: sheetColors.textDark, marginTop: 8, marginBottom: 4 }}>
          {renderInline(h3Match[1])}
        </div>
      );
      continue;
    }

    // 标题 ##
    const h2Match = trimmed.match(/^##\s+(.+)/);
    if (h2Match) {
      nodes.push(
        <div key={key++} style={{ fontWeight: 700, fontSize: "15px", color: sheetColors.textDark, marginTop: 10, marginBottom: 6 }}>
          {renderInline(h2Match[1])}
        </div>
      );
      continue;
    }

    // 标题 #
    const h1Match = trimmed.match(/^#\s+(.+)/);
    if (h1Match) {
      nodes.push(
        <div key={key++} style={{ fontWeight: 700, fontSize: "16px", color: sheetColors.textDark, marginTop: 12, marginBottom: 8 }}>
          {renderInline(h1Match[1])}
        </div>
      );
      continue;
    }

    // 无序列表 -
    const listMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (listMatch) {
      nodes.push(
        <div key={key++} style={{ display: "flex", gap: 6, marginBottom: 2, paddingLeft: 4 }}>
          <span style={{ color: sheetColors.textLighter, flexShrink: 0 }}>•</span>
          <span style={{ flex: 1 }}>{renderInline(listMatch[1])}</span>
        </div>
      );
      continue;
    }

    // 普通段落
    nodes.push(
      <div key={key++} style={{ marginBottom: 4 }}>
        {renderInline(trimmed)}
      </div>
    );
  }

  return nodes;
}

/** 渲染行内元素：加粗 **text**、行内代码 `code` */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let key = 0;

  // 匹配 **bold** 和 `inline code`
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // 普通文本
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={key++} style={{ fontWeight: 700 }}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // `code`
      parts.push(
        <code key={key++} style={{
          fontFamily: "monospace", fontSize: "12px",
          backgroundColor: sheetColors.hoverBg,
          padding: "1px 4px", borderRadius: "2px",
        }}>
          {match[3]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // 剩余文本
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// ─── 公告弹窗 ───────────────────────────────────────────────────────────────

interface Announcement {
  id: string;
  version: string;
  title: string;
  content: string;
  date: string;
}

const ANNOUNCEMENTS = announcementsData as Announcement[];
const STORAGE_KEY = "dndbuilder_last_dismissed_announcement";

export default function AnnouncementDialog() {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === ANNOUNCEMENTS[0]?.id;
    } catch {
      return false;
    }
  });

  // 取最新一条公告
  const latest = useMemo(() => {
    return ANNOUNCEMENTS.length > 0 ? ANNOUNCEMENTS[ANNOUNCEMENTS.length - 1] : null;
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (latest) {
      try {
        localStorage.setItem(STORAGE_KEY, latest.id);
      } catch { /* 存储不可用时静默失败 */ }
    }
  };

  if (!latest || dismissed) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={(e) => e.target === e.currentTarget && handleDismiss()}
    >
      <div
        style={{
          width: "90%", maxWidth: "400px", maxHeight: "70vh",
          display: "flex", flexDirection: "column",
          backgroundColor: sheetColors.cardBg, borderRadius: "10px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.11)",
          fontVariationSettings: FVAR,
          overflow: "hidden",
        }}
      >
        {/* 标题栏 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px 12px",
          borderBottom: `1px solid ${sheetColors.hoverBg}`,
        }}>
          <span
            className="font-serif-bold-cjk font-bold"
            style={{ fontSize: "16px", color: sheetColors.textDark }}
          >
            {latest.title}
          </span>
          <span style={{ fontSize: "11px", color: sheetColors.textPlaceholder }}>
            {latest.date}
          </span>
        </div>

        {/* 内容区（可滚动） */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "12px 20px 16px",
          fontSize: "13px", lineHeight: 1.6,
          color: sheetColors.textMedium,
          fontFamily: "var(--font-serif-regular)",
          fontVariationSettings: FVAR,
        }}>
          {renderMarkdown(latest.content)}
        </div>

        {/* 底部按钮 */}
        <div style={{
          padding: "8px 20px 16px",
          display: "flex", justifyContent: "center",
        }}>
          <button
            onClick={handleDismiss}
            className="font-serif-medium-cjk"
            style={{
              padding: "6px 32px",
              border: `1px solid ${sheetColors.buttonDarkBg}`,
              borderRadius: "4px",
              backgroundColor: sheetColors.buttonDarkBg,
              color: sheetColors.textWhite,
              cursor: "pointer",
              fontSize: "14px",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = sheetColors.buttonDarkBg)}
          >
            {t('mobile.dismiss')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
