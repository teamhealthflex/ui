import type { TextStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

/**
 * Base font size and line height for scaling typography.
 */
const BASE_FONT_SIZE = 16;
const BASE_LINE_HEIGHT = 24;

/**
 * Function to scale font size proportionately based on the base font size
 * and a target base value for responsiveness.
 */
const scaleFontSize = (size: number) => RFValue((size / BASE_FONT_SIZE) * 14);

/**
 * Function to scale line height proportionately based on the base line height
 * and a target base value for responsiveness.
 */
const scaleLineHeight = (lineHeight: number) => RFValue((lineHeight / BASE_LINE_HEIGHT) * 20);

/**
 * Font sizes and corresponding line heights for typography.
 * Use these tokens to ensure consistent typography across your app.
 */
export const fontSizes: Record<string, TextStyle> = {
  xxl: { fontSize: scaleFontSize(24), lineHeight: scaleLineHeight(32) }, // Headline, large text
  xl: { fontSize: scaleFontSize(20), lineHeight: scaleLineHeight(28) }, // Subheadings
  lg: { fontSize: scaleFontSize(18), lineHeight: scaleLineHeight(24) }, // Body text (large)
  md: { fontSize: scaleFontSize(16), lineHeight: scaleLineHeight(20) }, // Body text (default)
  sm: { fontSize: scaleFontSize(14), lineHeight: scaleLineHeight(18) }, // Captions, small text
  xs: { fontSize: scaleFontSize(12), lineHeight: scaleLineHeight(16) }, // Metadata, fine print
  xxs: { fontSize: scaleFontSize(10), lineHeight: scaleLineHeight(14) }, // Hints, small labels
};

/**
 * Font size tokens for typography.
 */
export type FontSizes = keyof typeof fontSizes;

/**
 * Font weight tokens for typography.
 */
export const fontWeights: Record<string, TextStyle['fontWeight']> = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

/**
 * Font weight tokens for typography.
 */
export type FontWeights = keyof typeof fontWeights;

/**
 * Typography tokens for managing all text-related styles.
 * This can be extended to include font families, weights, and more.
 */
export const typography = {
  fontSizes,
  fontWeights,
};
