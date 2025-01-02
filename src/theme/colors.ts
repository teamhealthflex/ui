const palette = {
  primary100: '#344c7c',
  primary200: '#1a356b',
  primary300: '#011f5b',
  primary400: '#011c52',
  primary500: '#011949',

  secondary100: '#6ddee6',
  secondary200: '#5adae3',
  secondary300: '#48D6E0',
  secondary400: '#41c1ca',
  secondary500: '#3aabb3',

  accent100: '#FFEED4',
  accent200: '#FFE1B2',
  accent300: '#FDD495',
  accent400: '#FBC878',
  accent500: '#FFBB50',

  black100: '#E0E0E0',
  black200: '#A0A0A0',
  black300: '#5C5C5C',
  black400: '#2E2E2E',
  black500: '#0A0A0A',

  white100: '#FFFFFF',
  white200: '#F2F2F2',
  white300: '#E6E6E6',
  white400: '#D9D9D9',
  white500: '#CCCCCC',

  grey100: '#F5F5F5',
  grey200: '#c4c4c4',
  grey300: '#acacac',
  grey400: '#626262',
  grey500: '#313131',
  grey600: '#6E6E6E',

  success100: '#E6F9E6',
  success200: '#B3F0B3',
  success300: '#80E680',
  success400: '#4DDB4D',
  success500: '#1AD11A',
  success600: '#2A7948',

  warning100: '#FFF3CC',
  warning200: '#FFE699',
  warning300: '#FFD966',
  warning400: '#FFCC33',
  warning500: '#FFBF00',
  warning600: '#ca8a04',

  info100: '#CCF2FF',
  info200: '#99E6FF',
  info300: '#66D9FF',
  info400: '#33CCFF',
  info500: '#00BFFF',
  info600: '#0284c7',

  danger100: '#FFCCCC',
  danger200: '#FF9999',
  danger300: '#FF6666',
  danger400: '#FF3333',
  danger500: '#FF0000',
  danger600: '#DC2626',

  gradient100: '#48D6E0',
  gradient200: '#3CE0C6',
  gradient300: '#2AEEA2',

  transparent: 'rgba(0, 0, 0, 0)',
} as const;

/**
 * Colors type for managing all color styles.
 */
export type Colors = keyof typeof palette;

/**
 * Color tokens for managing all color styles.
 */
const DarkTheme = {
  ...palette,
  info: palette.info200,
  grey: palette.grey400,
  text: palette.white200,
  card: palette.black400,
  border: palette.black400,
  danger: palette.danger200,
  accent: palette.accent200,
  success: palette.success200,
  warning: palette.warning200,
  primary: palette.primary200,
  background: palette.black500,
  notification: palette.danger500,
  secondary: palette.secondary200,
  transparent: 'rgba(0, 0, 0, 0)',
};

/**
 * Color tokens for managing all color styles.
 */
const LightTheme = {
  ...palette,
  info: palette.info300,
  grey: palette.grey300,
  text: palette.black500,
  card: palette.white200,
  border: palette.grey200,
  danger: palette.danger300,
  accent: palette.accent300,
  success: palette.success300,
  primary: palette.primary300,
  warning: palette.warning300,
  background: palette.white100,
  notification: palette.danger500,
  secondary: palette.secondary300,
  transparent: 'rgba(0, 0, 0, 0)',
};

/**
 * Theme type for managing all color styles.
 */
export type ThemeColors = typeof LightTheme | typeof DarkTheme;

/**
 * Color tokens for managing all color styles.
 */
export const colors = {
  dark: DarkTheme,
  palette: palette,
  light: LightTheme,
};
