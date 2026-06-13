import type { ThemeConfig } from 'antd';

// Brand tokens — values copied verbatim from the design system
// (tgbot/designs/design-system/tokens/colors.css + typography.css), the
// source of truth shared across all three repos.
//
// Palette rule from the brandbook: green = "bozor" (trust), orange = "tez"
// (speed) used ONLY on CTAs/primary actions, blue is FORBIDDEN (reads as a
// payment provider). So AntD's default blue is overridden everywhere below.
export const brand = {
  green: '#1FA055', // green-500 — brand / primary
  greenDark: '#157A40', // green-700 — hover/press
  greenLight: '#E6F4EC', // green-050 — tints, success bg
  orange: '#FF7A00', // orange-500 — primary actions / CTAs
  orangeDark: '#E66E00', // orange-600 — CTA hover/press
  orangeLight: '#FFF1E0', // orange-050 — promo/warning bg
  ink900: '#1E2A32', // primary text
  ink600: '#51616B', // secondary text
  ink200: '#D8DEE2', // borders
  paper: '#FAF7F2', // page background
  card: '#FFFFFF', // surfaces
  danger: '#D64545', // errors (warm red, never blue)
  fontBody: "'Inter', system-ui, -apple-system, sans-serif",
  fontHeading: "'Montserrat', system-ui, -apple-system, sans-serif",
} as const;

// Global AntD theme. colorPrimary = brand green; info/success forced green and
// warning/error to brand orange/red so no AntD blue leaks in.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: brand.green,
    colorInfo: brand.green,
    colorSuccess: brand.green,
    colorWarning: brand.orange,
    colorError: brand.danger,
    colorLink: brand.greenDark,
    colorTextBase: brand.ink900,
    colorBgLayout: brand.paper,
    fontFamily: brand.fontBody,
    borderRadius: 10,
  },
  components: {
    Layout: {
      bodyBg: brand.paper,
      headerBg: brand.card,
      siderBg: brand.card,
    },
  },
};

// Scoped theme for primary-action buttons (login submit, key CTAs): orange.
// Wrap a button in <ConfigProvider theme={ctaTheme}> to make it the "tez" CTA.
export const ctaTheme: ThemeConfig = {
  token: {
    colorPrimary: brand.orange,
    colorPrimaryHover: brand.orangeDark,
    colorPrimaryActive: brand.orangeDark,
  },
};
