import React from 'react';
import { Text as RNText } from 'react-native';
import type { TextStyle, StyleProp, TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@contexts';
import { fontSizes, fontWeights } from '@theme';
import type { FontSizes, FontWeights } from '@theme';

export interface TextProps extends RNTextProps {
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>;

  /**
   * One of the different types of text presets.
   */
  preset?: Presets;

  /**
   * Text weight modifier.
   */
  weight?: FontWeights;

  /**
   * Text size modifier.
   */
  size?: FontSizes;

  /**
   * Children components.
   */
  children?: React.ReactNode;
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 * @param {TextProps} props - The props for the `Text` component.
 * @returns {JSX.Element} The rendered `Text` component.
 */
export function Text(props: TextProps) {
  const { text, size, weight, children, style: $styleOverride = {}, ...rest } = props;
  const { colors } = useTheme();

  const content = text || children;
  const preset: Presets = props.preset ?? 'default';
  const $styles: StyleProp<TextStyle> = [
    $presets[preset],
    { color: colors.text },
    size ? fontSizes[size] : undefined,
    weight ? { fontWeight: fontWeights[weight] } : undefined,
    $styleOverride,
  ];

  return (
    <RNText {...rest} style={$styles}>
      {content}
    </RNText>
  );
}

export type Presets =
  | 'default'
  | 'heading'
  | 'subHeading'
  | 'paragraph'
  | 'formLabel'
  | 'formHelper'
  | 'small'
  | 'extraSmall';

const $baseStyle: StyleProp<TextStyle> = {
  ...fontSizes.md,
  fontWeight: fontWeights.regular,
};

const $presets: Record<Presets, StyleProp<TextStyle>> = {
  default: $baseStyle,

  heading: {
    ...$baseStyle,
    ...fontSizes.xl,
    color: 'inherit',
    fontWeight: fontWeights.bold,
  },

  subHeading: {
    ...$baseStyle,
    ...fontSizes.lg,
    color: 'inherit',
    fontWeight: fontWeights.semiBold,
  },

  paragraph: {
    ...$baseStyle,
    ...fontSizes.md,
    color: 'inherit',
    fontWeight: fontWeights.regular,
  },

  formLabel: {
    ...$baseStyle,
    ...fontSizes.sm,
    color: 'inherit',
    fontWeight: fontWeights.medium,
  },

  formHelper: {
    ...$baseStyle,
    ...fontSizes.sm,
    color: 'inherit',
    fontWeight: fontWeights.light,
  },

  small: {
    ...$baseStyle,
    ...fontSizes.sm,
    color: 'inherit',
    fontWeight: fontWeights.regular,
  },

  extraSmall: {
    ...$baseStyle,
    ...fontSizes.xs,
    color: 'inherit',
    fontWeight: fontWeights.thin,
  },
};

/**
 * The display name of the `Text` component.
 * @type {string}
 */
Text.displayName = 'Text';

export default Text;
