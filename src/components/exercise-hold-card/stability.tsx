import React from 'react';
import { Subscription } from 'rxjs';
import { StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useFocusEffect } from '@react-navigation/core';
import { distinctUntilChanged, bufferTime } from 'rxjs/operators';

import { Text } from '../text';
import { useMeasurableExerciseStore } from '@src/store';
import { colors, radius, spacing, typography } from '@src/theme';

/** * Config for stability score, need to move in remote config */
const stabilityScoreConfig = {
  veryStable: 33,
  intermediateStable: 66,
};

/**
 ** Need to move this utility funciton
 ** @param score
 ** @returns  color code
 **/
const getBackgroundColor = (score: number): string => {
  if (score >= stabilityScoreConfig.veryStable) {
    return colors.primary; // Blue
  }
  if (score >= stabilityScoreConfig.intermediateStable) {
    return colors.palette.warning300; // Yellow
  }
  return colors.palette.danger300; // Red
};

export const HoldStability: React.FC<{ holdTime: number }> = React.memo(({ holdTime }) => {
  const stabilityScoreStream$ = useMeasurableExerciseStore(
    useShallow((state) => state.stabilityScoreStream$),
  );

  const [stabilityScore, setStabilityScore] = React.useState<number>(0);

  /**
   * Subscription ref to keep track of the subscription
   */
  const subscription = React.useRef<Subscription | null>(null);

  /**
   * Memoize the buffered stream to prevent unnecessary recreations
   */
  const stabilityBufferedStream$ = React.useMemo(
    () => stabilityScoreStream$?.pipe(bufferTime(16), distinctUntilChanged()),
    [stabilityScoreStream$],
  );

  const roundedScore = React.useMemo(() => Math.round(stabilityScore * 5) / 5, [stabilityScore]);
  const backgroundColor = React.useMemo(() => getBackgroundColor(roundedScore), [roundedScore]);

  useFocusEffect(
    React.useCallback(() => {
      const stabilitySubscription = stabilityBufferedStream$?.subscribe((stabilityValues) => {
        if (stabilityValues.length > 0) {
          /**
           * Calculate the average or any logic for stability values.
           */
          const averageStability =
            stabilityValues.reduce((sum, value) => sum + value, 0) / stabilityValues.length;
          const newScore = averageStability * 100;
          setStabilityScore((prevScore) =>
            Math.abs(newScore - prevScore) > 0.1 ? newScore : prevScore,
          );
        }
      });

      if (stabilitySubscription) {
        subscription.current = stabilitySubscription;
      }

      return () => {
        subscription.current?.unsubscribe();
      };
    }, [stabilityBufferedStream$]),
  );

  React.useEffect(() => {
    if (holdTime <= 0) {
      /**
       * Stop the stability score stream when the hold time is over by unsubscribing
       */
      subscription.current?.unsubscribe();
    }
  }, [holdTime]);

  return (
    <View style={styles.stability}>
      <View style={[styles.circle, { backgroundColor }]}>
        <Text style={styles.circleText}>{roundedScore}%</Text>
      </View>
      <Text style={styles.labelText}>Stability Score</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  stability: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.xxs,
    borderRadius: radius.lg,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  circle: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: spacing.xxl / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontWeight: 'bold',
    color: colors.palette.white100,
    fontSize: typography.size.sm.fontSize,
  },
  labelText: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontSize: typography.size.sm.fontSize,
  },
});
