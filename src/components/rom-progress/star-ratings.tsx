import React from 'react';
import { ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { colors } from '@src/theme';

/**
 * Create an animated version of FontAwesome
 */
const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);

interface AnimatedStarProps {
  size?: number;
  threshold: number;
  activeColor?: string;
  inactiveColor?: string;
  progress: SharedValue<number>;
}

export const StarRatings: React.FC<AnimatedStarProps> = ({
  progress,
  size = 20,
  threshold,
  activeColor = colors.star_yellow_color,
  inactiveColor = colors.palette.grey300,
}) => {
  const starStyle = useAnimatedStyle(() => {
    const isActive = progress.value >= threshold;
    return {
      transform: [{ scale: withTiming(isActive ? 1.2 : 1, { duration: 300 }) }],
    };
  });

  const starColorStyle = useAnimatedStyle(() => ({
    color: progress.value >= threshold ? activeColor : inactiveColor,
  }));

  return (
    <Animated.View style={[$viewContainer, starStyle]}>
      <AnimatedFontAwesome name="star" size={size} style={starColorStyle} />
    </Animated.View>
  );
};

const $viewContainer: ViewStyle = {
  marginHorizontal: 4,
};

export const MemoStarRatings = React.memo(StarRatings);
