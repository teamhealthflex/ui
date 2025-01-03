/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { View, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useTheme } from '@contexts';

export interface ProgressProps {
  h: number;
  step: number;
  steps: number;
  style?: StyleProp<ViewStyle>;
}

export function Progress(props: ProgressProps) {
  const { step, steps, h, ...rest } = props;

  const width = useSharedValue(0);
  const progress = useSharedValue(0);

  const { colors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value }],
    };
  });

  React.useEffect(() => {
    if (width.value > 0) {
      const targetTranslateX = -width.value + (width.value * step) / steps;
      progress.value = withTiming(targetTranslateX, { duration: 1000 });
    }
  }, [step, steps, width, progress]);

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { width: layoutWidth } = event.nativeEvent.layout;
      if (width.value !== layoutWidth) {
        width.value = layoutWidth;
        /**
         * Recalculate progress after layout update
         */
        progress.value = -layoutWidth + (layoutWidth * step) / steps;
      }
    },
    [width, step, steps, progress],
  );

  const $container: ViewStyle = {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.transparent,
  };

  const $progressBar: ViewStyle = {
    top: 0,
    left: 0,
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: colors.primary,
  };

  return (
    <View style={[$container, { height: h }]} onLayout={onLayout} {...rest}>
      <Animated.View style={[$progressBar, animatedStyle, { height: h, width: '100%' }]} />
    </View>
  );
}

/**
 * The display name of the `Progress` component.
 * @type {string}
 */
Progress.displayName = 'Progress';

export default Progress;
