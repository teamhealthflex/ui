import React from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { Text } from '../text';
import { useTheme } from '@contexts';
import { radius, spacing } from '@theme';

export interface ChipProps {
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
  preset?: Presets;

  /**
   * The variant of the chip.
   */
  variant?: 'solid' | 'outline';
}

export type SizePresets = 'xs' | 'sm' | 'md' | 'lg';
export type Presets = 'info' | 'success' | 'warning' | 'error';

/**
 * A component to display a chip.
 * @param {ChipProps} props - The props for the `Chip` component.
 * @returns {JSX.Element} The rendered `Chip` component.
 */
export function Chip(props: ChipProps) {
  const { text, children, size = 'sm', preset = 'info', variant = 'solid', ...rest } = props;
  const { colors } = useTheme();

  const $baseViewStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: radius.lg,
    justifyContent: 'center',
  };

  const $viewPresets: Record<Presets, StyleProp<ViewStyle>> = {
    info: [
      $baseViewStyle,
      {
        color: colors.info600,
        borderColor: colors.info300,
        backgroundColor: colors.info100,
      },
    ] as StyleProp<ViewStyle>,

    success: [
      $baseViewStyle,
      {
        color: colors.success600,
        borderColor: colors.success300,
        backgroundColor: colors.success100,
      },
    ] as StyleProp<ViewStyle>,

    warning: [
      $baseViewStyle,
      {
        color: colors.warning600,
        borderColor: colors.warning300,
        backgroundColor: colors.warning100,
      },
    ] as StyleProp<ViewStyle>,

    error: [
      $baseViewStyle,
      {
        color: colors.danger600,
        borderColor: colors.danger300,
        backgroundColor: colors.danger100,
      },
    ] as StyleProp<ViewStyle>,
  };

  const $sizePresets: Record<SizePresets, StyleProp<ViewStyle>> = {
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
    xs: {
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.xs,
    },
  };

  const $viewStyle: StyleProp<ViewStyle> = [
    $viewPresets[preset],
    $sizePresets[size],
    {
      borderWidth: variant === 'outline' ? 1 : 0,
    },
  ];

  return (
    <View style={$viewStyle} {...rest}>
      <Text size={size} text={text}>
        {children}
      </Text>
    </View>
  );
}
