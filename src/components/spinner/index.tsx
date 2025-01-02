import React from 'react';
import LottieView from 'lottie-react-native';
import { View, TextStyle, ViewStyle, AccessibilityProps } from 'react-native';

import { Text } from '../text';
import { fontSizes } from '@theme';
import { useTheme } from '@contexts';
import { ScreenLogo } from '../screen-logo';
import loading from '../../../example/assets/lottie/loading.json';

export interface SpinnerProps extends AccessibilityProps {
  color?: string;
  active: boolean;
  style?: ViewStyle;
  showLogo?: boolean;
  showContent?: boolean;
  children?: React.ReactNode;
}

export function Spinner(props: SpinnerProps) {
  const {
    children,
    active = true,
    showLogo = false,
    showContent = true,
    color = 'transparent',
    ...rest
  } = props;

  const { colors } = useTheme();

  if (!active) {
    return <>{children}</>;
  }

  const $container: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const $text: TextStyle = {
    ...fontSizes.md,
    width: '100%',
    textAlign: 'center',
    color: colors.primary300,
  };

  const $image: ViewStyle = {
    width: 80,
    height: 80,
  };

  return (
    <View style={[$container, { backgroundColor: color }, props.style]} {...rest}>
      {showLogo && <ScreenLogo />}
      <LottieView autoPlay loop={true} style={$image} source={loading} />
      {showContent && !showLogo && <Text style={$text}>Please Wait ...</Text>}
    </View>
  );
}

/**
 * The display name of the `Spinner` component.
 * @type {string}
 */
Spinner.displayName = 'Spinner';

export default Spinner;
