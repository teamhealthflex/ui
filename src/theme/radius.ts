/**
 * elevation tokens for managing all elevation styles.
 */
const ELEVATION_BASE = 2;

/**
 * Base border radius value for scaling border radius.
 */
const BORDER_RADIUS_BASE = 4;

/**
 * Border radius tokens for managing all border radius styles.
 */
export const radius = {
  'none': 0,
  'full': 9999, // for pill-shaped or fully rounded corners
  'xs': BORDER_RADIUS_BASE * 0.5,
  'sm': BORDER_RADIUS_BASE,
  'md': BORDER_RADIUS_BASE * 1.5,
  'lg': BORDER_RADIUS_BASE * 2.5,
  'xl': BORDER_RADIUS_BASE * 3,
  '2xl': BORDER_RADIUS_BASE * 4,
};

/**
 * Border radius tokens for managing all border radius styles.
 */
export type Radius = keyof typeof radius;

/**
 * Elevation tokens for managing all elevation styles.
 */
export const elevation = {
  'none': 0,
  'xs': ELEVATION_BASE,
  'sm': ELEVATION_BASE * 2,
  'md': ELEVATION_BASE * 3,
  'lg': ELEVATION_BASE * 4,
  'xl': ELEVATION_BASE * 6,
  '2xl': ELEVATION_BASE * 8,
};

/**
 * Elevation tokens for managing all elevation styles.
 */
export type Elevation = keyof typeof elevation;
