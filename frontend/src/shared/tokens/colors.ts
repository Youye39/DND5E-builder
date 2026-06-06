// ============================================================================
// 颜色令牌 (Color Tokens)
// 从全项目所有 .tsx / .css 文件中提取
// ============================================================================

/** 品牌/主题色 — 来自 theme.css :root 变量 */
export const themeColors = {
  background: '#ffffff',
  foreground: 'oklch(0.145 0 0)',
  card: '#ffffff',
  cardForeground: 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.145 0 0)',
  primary: '#030213',
  primaryForeground: 'oklch(1 0 0)',
  secondary: 'oklch(0.95 0.0058 264.53)',
  secondaryForeground: '#030213',
  muted: '#ececf0',
  mutedForeground: '#717182',
  accent: '#e9ebef',
  accentForeground: '#030213',
  destructive: '#d4183d',
  destructiveForeground: '#ffffff',
  border: 'rgba(0, 0, 0, 0.1)',
  input: 'transparent',
  inputBackground: '#f3f3f5',
  switchBackground: '#cbced4',
  ring: 'oklch(0.708 0 0)',
  chart1: 'oklch(0.646 0.222 41.116)',
  chart2: 'oklch(0.6 0.118 184.704)',
  chart3: 'oklch(0.398 0.07 227.392)',
  chart4: 'oklch(0.828 0.189 84.429)',
  chart5: 'oklch(0.769 0.188 70.08)',
  sidebar: 'oklch(0.985 0 0)',
  sidebarForeground: 'oklch(0.145 0 0)',
  sidebarPrimary: '#030213',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.97 0 0)',
  sidebarAccentForeground: 'oklch(0.205 0 0)',
  sidebarBorder: 'oklch(0.922 0 0)',
  sidebarRing: 'oklch(0.708 0 0)',
} as const;

/**
 * 角色卡片全局用色 (CSS 变量引用)
 * 与 styles/theme.css 中 @theme inline 定义的变量对应
 */
export const sheetColors = {
  /** 页面/面板背景 */
  pageBg: 'var(--color-sheet-bg)',
  /** 卡片主体背景 (白色) */
  cardBg: 'var(--color-sheet-card-bg)',
  /** 面板/区块背景 */
  panelBg: 'var(--color-sheet-panel-bg)',
  /** 内容区背景 (浅灰) */
  contentBg: 'var(--color-sheet-content-bg)',
  /** 表头背景 */
  headerBg: 'var(--color-sheet-header-bg)',
  /** 深色区块背景 (属性/基础信息) */
  darkSectionBg: 'var(--color-sheet-dark-section-bg)',
  /** 导航栏背景 */
  navBg: 'var(--color-sheet-nav-bg)',

  /** 主要文字色 (黑) */
  textPrimary: 'var(--color-sheet-text-primary)',
  /** 深灰文字 */
  textDark: 'var(--color-sheet-text-dark)',
  /** 中灰文字 */
  textMedium: 'var(--color-sheet-text-medium)',
  /** 次要文字 */
  textSecondary: 'var(--color-sheet-text-secondary)',
  /** 浅灰文字 / 占位文字 */
  textPlaceholder: 'var(--color-sheet-text-placeholder)',
  /** 更浅文字 */
  textLighter: 'var(--color-sheet-text-lighter)',
  /** 白色文字 */
  textWhite: 'var(--color-sheet-text-white)',
  /** 页码标签深色文字 */
  textPageActive: 'var(--color-sheet-text-page-active)',
  /** 法术占位文字 */
  textSpellPlaceholder: 'var(--color-sheet-text-spell-placeholder)',

  /** 强调色 (屬性調整值、技能加值) */
  accentBlue: 'var(--color-sheet-accent-blue)',

  /** 深色按钮背景 */
  buttonDarkBg: 'var(--color-sheet-button-dark-bg)',
  /** 深色按钮悬停 */
  buttonDarkHover: 'var(--color-sheet-button-dark-hover)',

  /** 边框 - 页面内 */
  borderLight: 'var(--color-sheet-border-light)',
  /** 边框 - 输入框 */
  borderInput: 'var(--color-sheet-border-input)',
  /** 边框 - 区块/面板 */
  borderSection: 'var(--color-sheet-border-section)',
  /** 边框 - 次要 */
  borderSecondary: 'var(--color-sheet-border-secondary)',
  /** 边框 - 占位区块 */
  borderPlaceholder: 'var(--color-sheet-border-placeholder)',

  /** 悬停背景 */
  hoverBg: 'var(--color-sheet-hover-bg)',
  /** 悬停浅色 */
  hoverLight: 'var(--color-sheet-hover-light)',

  /** 箭头/图标默认色 */
  iconDefault: 'var(--color-sheet-icon-default)',
  /** 箭头/图标悬停色 */
  iconHover: 'var(--color-sheet-icon-hover)',
  /** 箭头/图标禁用色 */
  iconDisabled: 'var(--color-sheet-icon-disabled)',
  /** 箭头/图标默认 (导航) */
  iconNavDefault: 'var(--color-sheet-icon-nav-default)',

  /** SVG 填充色 */
  svgFill: 'var(--color-sheet-svg-fill)',
  /** SVG 描边 */
  svgStroke: 'var(--color-sheet-svg-stroke)',
} as const;

/** 阴影值 */
export const shadows = {
  sheetContainer: '0 0 10px rgba(0, 0, 0, 0.1)',
  pageNav: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
  section: '0px 0px 2px 0px rgba(0,0,0,0.25)',
  button: '0px 0px 3px 0px #000000',
  scrollbar: 'rgba(0,0,0,0.3)',
  arrowBtn: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15))',
} as const;

/** Tailwind @theme 映射的颜色变量名 */
export const tailwindColorVars = {
  '--color-background': 'var(--background)',
  '--color-foreground': 'var(--foreground)',
  '--color-card': 'var(--card)',
  '--color-card-foreground': 'var(--card-foreground)',
  '--color-popover': 'var(--popover)',
  '--color-popover-foreground': 'var(--popover-foreground)',
  '--color-primary': 'var(--primary)',
  '--color-primary-foreground': 'var(--primary-foreground)',
  '--color-secondary': 'var(--secondary)',
  '--color-secondary-foreground': 'var(--secondary-foreground)',
  '--color-muted': 'var(--muted)',
  '--color-muted-foreground': 'var(--muted-foreground)',
  '--color-accent': 'var(--accent)',
  '--color-accent-foreground': 'var(--accent-foreground)',
  '--color-destructive': 'var(--destructive)',
  '--color-destructive-foreground': 'var(--destructive-foreground)',
  '--color-border': 'var(--border)',
  '--color-input': 'var(--input)',
  '--color-input-background': 'var(--input-background)',
  '--color-switch-background': 'var(--switch-background)',
  '--color-ring': 'var(--ring)',
  '--color-chart-1': 'var(--chart-1)',
  '--color-chart-2': 'var(--chart-2)',
  '--color-chart-3': 'var(--chart-3)',
  '--color-chart-4': 'var(--chart-4)',
  '--color-chart-5': 'var(--chart-5)',
  '--color-sidebar': 'var(--sidebar)',
  '--color-sidebar-foreground': 'var(--sidebar-foreground)',
  '--color-sidebar-primary': 'var(--sidebar-primary)',
  '--color-sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
  '--color-sidebar-accent': 'var(--sidebar-accent)',
  '--color-sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
  '--color-sidebar-border': 'var(--sidebar-border)',
  '--color-sidebar-ring': 'var(--sidebar-ring)',
} as const;
