import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, Text, Animated, ViewStyle, TextStyle, ViewProps } from 'react-native';

import { useTheme } from '@contexts';
import { fontWeights, spacing } from '@theme';

/**
 * The props for the circular progress component.
 */
export interface CircularProgressProps extends ViewProps {
  /**
   * The size of the circular progress component.
   */
  size?: number;
  /**
   * The width of the stroke.
   */
  strokeWidth?: number;
  /**
   * The progress value (0-100).
   */
  progress?: number | Animated.Value;
  /**
   * The text to display in the center of the circular progress.
   */
  centerText?: string;
  /**
   * The style of the center text.
   */
  centerTextStyle?: object;
  /**
   * The primary color of the gradient.
   */
  primaryColor?: string;
  /**
   * The secondary color of the gradient.
   */
  secondaryColor?: string;
  /**
   * The color of the background stroke.
   */
  backgroundStrokeColor?: string;
  /**
   * Any children to render inside the circular progress
   */
  children?: React.ReactNode;
}

/**
 * A circular progress component.
 */
export function CircularProgress(props: CircularProgressProps) {
  const {
    size = 100,
    centerText,
    progress = 50,
    centerTextStyle,
    strokeWidth = 10,
    primaryColor = '#48D6E0',
    secondaryColor = '#2AEEA2',
    backgroundStrokeColor = '#E0E0E0',
    children,
    ...rest
  } = props;

  const { colors } = useTheme();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let strokeDashoffset;

  if (progress instanceof Animated.Value) {
    /*
     * If progress is an Animated.Value, use interpolation
     */
    strokeDashoffset = progress.interpolate({
      inputRange: [0, 100],
      outputRange: [circumference, 0],
    });
  } else {
    /**
     * If progress is a static number, calculate the offset directly
     */
    strokeDashoffset = circumference - (circumference * progress) / 100;
  }

  const $container: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };
  const $childrenContainer: ViewStyle = {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const $centerText: TextStyle = {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const $text: TextStyle = {
    fontSize: spacing.xl,
    fontWeight: fontWeights.bold,
    color: colors.white100,
  };

  /**
   * Create an animated version of the Circle component
   */
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={[$container, { width: size, height: size }]} {...rest}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Define the gradient */}
        <Defs>
          <LinearGradient
            id={`grad_${primaryColor}_${secondaryColor}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={secondaryColor} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Background Circle */}
        <Circle
          stroke={backgroundStrokeColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Gradient Progress Circle */}
        <AnimatedCircle
          stroke={`url(#grad_${primaryColor}_${secondaryColor})`}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          rotation="-90"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center Text (conditionally rendered) */}
      {centerText && (
        <View style={$centerText}>
          <Text style={[$text, centerTextStyle]}>{centerText ?? `${progress}%`}</Text>
        </View>
      )}

      {/* Render children */}
      {children && <View style={$childrenContainer}>{children}</View>}
    </View>
  );
}

/**
 * The display name of the `CircularProgress` component.
 * @type {string}
 */
CircularProgress.displayName = 'CircularProgress';

export default CircularProgress;
