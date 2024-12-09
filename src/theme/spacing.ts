/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
const SPACING_BASE = 4;

/**
 * Spacing tokens for managing all spacing styles.
 */
export const spacing = {
  none: 0,
  xxxs: SPACING_BASE * 0.5,
  xxs: SPACING_BASE,
  xs: SPACING_BASE * 2,
  sm: SPACING_BASE * 3,
  md: SPACING_BASE * 4,
  lg: SPACING_BASE * 6,
  xl: SPACING_BASE * 8,
  xxl: SPACING_BASE * 12,
  xxxl: SPACING_BASE * 16,
} as const;

/**
 * Spacing tokens for managing all spacing styles.
 */
export type Spacing = keyof typeof spacing;
