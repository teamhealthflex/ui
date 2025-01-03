import React from 'react';
import LottieView from 'lottie-react-native';
import { View, TextStyle, ViewStyle, AccessibilityProps, StyleProp } from 'react-native';

import { Text } from '../text';
import { fontSizes } from '@theme';
import { useTheme } from '@contexts';
import { ScreenLogo } from '../screen-logo';
import loading from '../../../example/assets/lottie/loading.json';

export interface SpinnerProps extends AccessibilityProps {
  color?: string;
  active: boolean;
  style?: StyleProp<ViewStyle>;
  showLogo?: boolean;
  showContent?: boolean;
  children?: React.ReactNode;
}

/**
 * The `Spinner` component.
 * @param {SpinnerProps} props - The props for the `Spinner` component.
 * @returns {JSX.Element} The rendered `Spinner` component.
 */
export function Spinner(props: SpinnerProps) {
  const {
    children,
    active = true,
    showLogo = false,
    showContent = true,
    color = 'transparent',
    style: $styleOverride = {},
    ...rest
  } = props;

  const { colors } = useTheme();

  if (!active) {
    return <>{children}</>;
  }

  const preset: SpinnerPresets = showLogo ? 'withLogo' : showContent ? 'withContent' : 'default';
  const $styles: StyleProp<ViewStyle> = [
    $presets[preset],
    { backgroundColor: color },
    $styleOverride,
  ];

  return (
    <View style={$styles} {...rest}>
      {showLogo && <ScreenLogo />}
      <LottieView autoPlay loop={true} style={$imageStyle} source={loading} />
      {showContent && !showLogo && (
        <Text style={[$textStyle, { color: colors.primary }]}>Please Wait ...</Text>
      )}
    </View>
  );
}

/**
 * Presets for the `Spinner` component.
 */
export type SpinnerPresets = 'default' | 'withLogo' | 'withContent';

/**
 * Styles for the `Spinner` component.
 */
const $baseStyle: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

const $presets: Record<SpinnerPresets, ViewStyle> = {
  default: $baseStyle,
  withLogo: {
    ...$baseStyle,
    backgroundColor: 'transparent',
  },
  withContent: {
    ...$baseStyle,
    backgroundColor: 'transparent',
  },
};

const $textStyle: TextStyle = {
  ...fontSizes.md,
  width: '100%',
  textAlign: 'center',
};

const $imageStyle: ViewStyle = {
  width: 80,
  height: 80,
};

/**
 * The display name of the `Spinner` component.
 * @type {string}
 */
Spinner.displayName = 'Spinner';

export default Spinner;
