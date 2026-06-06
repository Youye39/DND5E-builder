// ============================================================================
// 字体令牌 (Font Tokens)
// 从全项目所有 .tsx / .css 文件中提取
// ============================================================================

/** Google Fonts 导入 URL (CJK 统一版本) */
export const googleFontsUrl =
  "https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;700&family=Noto+Sans:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap";

/** 全局 body 字体系列 (index.css) */
export const bodyFontFamily = "'Noto Sans', 'Noto Sans SC', 'Noto Sans JP', sans-serif";

/**
 * 字体系列映射 (统一 CJK)
 * 注意: Tailwind 中 font-['...'] 使用 PostScript 名称 (带冒号)
 */
export const fontFamilies = {
  /** Noto Serif Regular */
  serifRegular: "'Noto_Serif:Regular',sans-serif",
  /** Noto Serif Medium */
  serifMedium: "'Noto_Serif:Medium',sans-serif",
  /** Noto Serif Bold */
  serifBold: "'Noto_Serif:Bold',sans-serif",

  /** Noto Serif Regular + CJK fallback */
  serifRegularCJK: "'Noto_Serif:Regular','Noto_Sans_CJK:Regular',sans-serif",
  /** Noto Serif Medium + CJK */
  serifMediumCJK: "'Noto_Serif:Medium','Noto_Sans_CJK:Medium',sans-serif",
  /** Noto Serif Bold + CJK */
  serifBoldCJK: "'Noto_Serif:Bold','Noto_Sans_CJK:Bold',sans-serif",

  /** Noto Sans Medium + CJK (page tabs) */
  sansMediumCJK: "'Noto_Sans:Medium','Noto_Sans_CJK:Medium',sans-serif",

  /** Noto Serif Bold (serif fallback — logo) */
  serifBoldLogo: "'Noto_Serif:Bold',serif",
  /** Noto Serif Medium (serif fallback — logo subtitle) */
  serifMediumLogo: "'Noto_Serif:Medium',serif",
  /** Noto Serif Regular (serif fallback — logo bottom) */
  serifRegularLogo: "'Noto_Serif:Regular',serif",
} as const;

/** 常用字重 */
export const fontWeights = {
  normal: 400,
  medium: 500,
  bold: 700,
} as const;

/** fontVariationSettings 共用值 */
export const fontVariationSettings = "'CTGR' 0, 'wdth' 100";
