import React from 'react';
import { StyleProp, TextStyle, View, ViewProps, ViewStyle } from 'react-native';

import { Text } from '../text';
import { useTheme } from '@contexts';
import { radius, spacing } from '@theme';

export interface ChipProps extends ViewProps {
  /**
   * The text to display inside the chip.
   */
  text?: string;

  /**
   * Children components.
   */
  children?: React.ReactNode;

  /**
   * The size of the chip.
   */
  size?: SizePresets;

  /**
   * The preset style of the chip.
   */
  preset?: ChipPresets;

  /**
   * The variant of the chip.
   */
  variant?: 'solid' | 'outline';

  /**
   * Additional styles for the chip.
   */
  style?: StyleProp<ViewStyle>;
}

export type SizePresets = 'xs' | 'sm' | 'md' | 'lg';
export type ChipPresets = 'info' | 'success' | 'warning' | 'error';

/**
 * A component to display a chip.
 * @param {ChipProps} props - The props for the `Chip` component.
 * @returns {JSX.Element} The rendered `Chip` component.
 */
export function Chip(props: ChipProps) {
  const { text, children, size = 'sm', preset = 'info', variant = 'solid', style, ...rest } = props;
  const { colors } = useTheme();

  const $baseViewStyle: ViewStyle = {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: radius.lg,
    justifyContent: 'center',
  };

  const $viewPresets: Record<ChipPresets, ViewStyle> = {
    info: {
      ...$baseViewStyle,
      borderColor: colors.info300,
      backgroundColor: colors.info100,
    },
    success: {
      ...$baseViewStyle,
      borderColor: colors.success300,
      backgroundColor: colors.success100,
    },
    warning: {
      ...$baseViewStyle,
      borderColor: colors.warning300,
      backgroundColor: colors.warning100,
    },
    error: {
      ...$baseViewStyle,
      borderColor: colors.danger300,
      backgroundColor: colors.danger100,
    },
  };

  const $sizePresets: Record<SizePresets, ViewStyle> = {
    xs: {
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.xs,
    },
    sm: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    md: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    lg: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
  };

  const $textColors: Record<ChipPresets, string> = {
    info: colors.info600,
    error: colors.danger600,
    success: colors.success600,
    warning: colors.warning600,
  };

  const $textStyle: StyleProp<TextStyle> = {
    color: $textColors[preset],
  };

  const $variantStyle: ViewStyle = {
    borderWidth: variant === 'outline' ? 1 : 0,
  };

  const $viewStyle: StyleProp<ViewStyle> = [
    style,
    $variantStyle,
    $sizePresets[size],
    $viewPresets[preset],
  ].filter(Boolean);

  return (
    <View style={$viewStyle} {...rest}>
      <Text size={size} text={text} style={$textStyle}>
        {children}
      </Text>
    </View>
  );
}

/**
 * The display name of the `Chip` component.
 * @type {string}
 */
Chip.displayName = 'Chip';

export default Chip;
