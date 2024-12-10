import React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
  PressableProps,
  ActivityIndicator,
  PressableStateCallbackType,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@contexts';
import { Text, TextProps } from '../text';
import { fontSizes, fontWeights, radius, spacing } from '@theme';

export interface ButtonAccessoryProps {
  disabled?: boolean;
  style: StyleProp<any>;
  pressableState: PressableStateCallbackType;
}

export type ButtonPresets = 'default' | 'filled' | 'reversed';
export type Sizes = 'extraSmall' | 'small' | 'medium' | 'large';

export interface ButtonProps extends PressableProps {
  size?: Sizes;
  preset?: ButtonPresets;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  text?: TextProps['text'];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  pressedTextStyle?: StyleProp<TextStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
  RightAccessory?: React.ComponentType<ButtonAccessoryProps>;
  LeftAccessory?: React.ComponentType<ButtonAccessoryProps>;
}

export function Button(props: ButtonProps) {
  const {
    text,
    children,
    disabled,
    LeftAccessory,
    RightAccessory,
    loading = false,
    fullWidth = false,
    style: $viewStyleOverride = {},
    textStyle: $textStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    disabledStyle: $disabledViewStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    ...rest
  } = props;

  const scale = useSharedValue(1);
  const size: Sizes = props.size ?? 'medium';
  const preset: ButtonPresets = props.preset ?? 'default';

  const { colors } = useTheme();

  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      $sizePresets[size].button,
      fullWidth && $fullWidthPresets[preset],
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
      !!disabled && [$disabledViewPresets[preset], $disabledViewStyleOverride],
    ];
  }

  function $textStyle({ pressed }: PressableStateCallbackType): StyleProp<TextStyle> {
    const styles = [
      $textStyleOverride,
      $textPresets[preset],
      $sizePresets[size].text,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
      !!disabled && $disabledTextStyleOverride,
    ].filter(Boolean);

    return styles;
  }

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);

  const onTouchStart = React.useCallback(() => {
    if (!disabled) {
      scale.value = withTiming(0.95);
    }
  }, [disabled, scale]);

  const onTouchEnd = React.useCallback(() => {
    if (!disabled) {
      scale.value = withTiming(1);
    }
  }, [disabled, scale]);

  const $baseViewStyle: ViewStyle = {
    minHeight: 44,
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    borderRadius: radius.lg,
    justifyContent: 'center',
    borderCurve: 'continuous',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: colors.primary500,
      },
      android: {
        elevation: 2,
      },
    }),
  };

  const $baseTextStyle: TextStyle = {
    zIndex: 2,
    flexGrow: 0,
    flexShrink: 1,
    lineHeight: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: spacing.xxs,
    fontSize: spacing.xs,
    textAlign: 'center',
    color: colors.background,
    fontWeight: fontWeights.medium,
  };

  const $leftAccessoryStyle: ViewStyle = { zIndex: 1, marginEnd: spacing.xs };
  const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.xs, zIndex: 1 };

  const $viewPresets = {
    default: [
      $baseViewStyle,
      {
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
      },
    ] as StyleProp<ViewStyle>,

    filled: [
      $baseViewStyle,
      {
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
      },
    ] as StyleProp<ViewStyle>,

    reversed: [
      $baseViewStyle,
      {
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.background,
      },
    ] as StyleProp<ViewStyle>,
  };

  const $textPresets: Record<ButtonPresets, StyleProp<TextStyle>> = {
    default: $baseTextStyle,
    filled: $baseTextStyle,
    reversed: [$baseTextStyle, { color: colors.primary }],
  };

  const $loadingPresets: Record<ButtonPresets, StyleProp<ViewStyle>> = {
    default: { marginLeft: 'auto' },
    filled: { marginLeft: 'auto' },
    reversed: { marginLeft: 'auto' },
  };

  const $fullWidthPresets: Record<ButtonPresets, StyleProp<ViewStyle>> = {
    default: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    filled: { width: '100%' },
    reversed: { width: '100%' },
  };

  const $pressedViewPresets: Record<ButtonPresets, StyleProp<ViewStyle>> = {
    default: { backgroundColor: colors.primary500 },
    filled: { backgroundColor: colors.primary500 },
    reversed: { backgroundColor: colors.grey100 },
  };

  const $pressedTextPresets: Record<ButtonPresets, StyleProp<TextStyle>> = {
    filled: { opacity: 0.9 },
    default: { opacity: 0.9 },
    reversed: { opacity: 0.9 },
  };

  const $disabledViewPresets: Record<ButtonPresets, StyleProp<ViewStyle>> = {
    default: { borderColor: colors.primary100, opacity: 0.75 },
    filled: { borderColor: colors.primary100, opacity: 0.75 },
    reversed: { borderColor: colors.primary100, opacity: 0.75 },
  };

  const $sizePresets: Record<Sizes, { button: StyleProp<ViewStyle>; text: StyleProp<TextStyle> }> =
    {
      extraSmall: {
        button: {
          minHeight: 24,
          paddingVertical: spacing.xxs,
          paddingHorizontal: spacing.xs,
        },
        text: {
          ...fontSizes.xxs,
        },
      },
      small: {
        button: {
          minHeight: 32,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        },
        text: {
          ...fontSizes.xs,
        },
      },
      medium: {
        button: {
          minHeight: 40,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
        text: {
          ...fontSizes.sm,
        },
      },
      large: {
        button: {
          minHeight: 48,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        text: {
          ...fontSizes.md,
        },
      },
    };

  return (
    <Animated.View
      aria-disabled={disabled}
      style={[reanimatedStyle]}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Pressable
        style={$viewStyle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        {...rest}
      >
        {(state) => (
          <>
            {!!LeftAccessory && (
              <LeftAccessory
                style={$leftAccessoryStyle}
                pressableState={state}
                disabled={disabled}
              />
            )}

            {loading && (
              <ActivityIndicator
                style={$loadingPresets[preset]}
                color={preset === 'reversed' ? colors.primary : colors.background}
              />
            )}

            <Text text={text} style={[$textStyle(state), loading && { marginLeft: spacing.xs }]}>
              {children}
            </Text>

            {!!RightAccessory && (
              <RightAccessory
                style={$rightAccessoryStyle}
                pressableState={state}
                disabled={disabled}
              />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
