import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { useTheme } from '@contexts';
import { radius, spacing } from '@theme';
import { MemoStarRatings } from './star-ratings';

/**
 * Thresholds for the star ratings
 */
const STAR_THRESHOLDS = [10, 30, 50, 70, 90];

export interface ExerciseProgressProps {
  /**
   * Current progress percentage (0-100)
   */
  romPercentage: number;

  /**
   * Star thresholds
   */
  thresholds?: number[];
}

export function ExerciseProgress(props: ExerciseProgressProps) {
  const { romPercentage, thresholds = STAR_THRESHOLDS, ...rest } = props;

  const { colors } = useTheme();
  const sharedPercentage = useSharedValue(romPercentage);

  /**
   * Sync shared value with prop updates
   */
  React.useEffect(() => {
    sharedPercentage.value = romPercentage;
  }, [romPercentage, sharedPercentage]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: colors.gradient200,
      width: `${sharedPercentage.value}%`,
    };
  });

  const markColor0 = useAnimatedStyle(() => ({
    color: sharedPercentage.value >= 0 ? colors.secondary300 : colors.white100,
  }));

  const markColor1 = useAnimatedStyle(() => ({
    color: sharedPercentage.value >= 50 ? colors.secondary300 : colors.white100,
  }));

  const markColor2 = useAnimatedStyle(() => ({
    color: sharedPercentage.value >= 100 ? colors.secondary300 : colors.white100,
  }));

  const $progressBarContainer: ViewStyle = {
    zIndex: 0,
    borderRadius: radius.md,
    justifyContent: 'center',
    backgroundColor: colors.primary,
  };

  const $percentageContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xs,
    justifyContent: 'space-between',
  };

  const $percentageItem: TextStyle = {
    alignItems: 'center',
    flexDirection: 'column',
  };

  const $verticalLine: ViewStyle = {
    width: 1,
    height: spacing.xs,
    marginTop: spacing.xxs,
    backgroundColor: colors.grey400,
  };

  const $progress: ViewStyle = {
    alignItems: 'center',
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
  };

  const $gradientContainer: ViewStyle = {
    width: '100%',
    overflow: 'hidden',
    height: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.grey400,
  };

  const $filled: ViewStyle = {
    height: spacing.xs,
    borderRadius: radius.md,
  };

  const $stars: ViewStyle = {
    flexDirection: 'row',
    padding: spacing.sm,
    justifyContent: 'space-around',
  };

  const $start: ViewStyle = {
    alignItems: 'flex-start',
    marginLeft: spacing.xxs,
  };

  const $mid: ViewStyle = {
    alignItems: 'center',
    marginLeft: spacing.sm,
  };

  const $end: ViewStyle = {
    alignItems: 'flex-end',
    marginRight: spacing.xxs,
  };

  return (
    <View style={$progressBarContainer} {...rest}>
      <View style={$percentageContainer}>
        <View style={[$percentageItem, $start]}>
          <Animated.Text style={[markColor0]}>0%</Animated.Text>
          <View style={[$verticalLine]} />
        </View>
        <View style={[$percentageItem, $mid]}>
          <Animated.Text style={[markColor1]}>50%</Animated.Text>
          <View style={[$verticalLine]} />
        </View>
        <View style={[$percentageItem, $end]}>
          <Animated.Text style={[markColor2]}>100%</Animated.Text>
          <View style={[$verticalLine]} />
        </View>
      </View>

      {/* Progress bar */}
      <View style={$progress}>
        <View style={$gradientContainer}>
          <Animated.View style={[$filled, animatedStyles]} />
        </View>
      </View>

      <View style={$stars}>
        {thresholds.map((threshold, index) => (
          <MemoStarRatings key={index} progress={sharedPercentage} threshold={threshold} />
        ))}
      </View>
    </View>
  );
}
