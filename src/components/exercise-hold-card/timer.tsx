import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

import { Text } from '../text';
import { colors, radius, spacing, typography } from '@src/theme';

const endTimerConfig = 0;
interface HoldTimerProps {
  holdTime: number;
}

export const HoldTimer: React.FC<HoldTimerProps> = React.memo(({ holdTime }) => {
  /**
   * desturcture the styles object
   */
  const { $hold, $circle, $circleText, $lottie, $labelText } = styles;

  return (
    <View style={$hold}>
      <View style={$circle}>
        {holdTime > endTimerConfig ? (
          <Text style={$circleText}>{holdTime}</Text>
        ) : (
          <LottieView
            autoPlay
            loop={false}
            style={$lottie}
            source={require('@assets/lottie/success-primary.json')}
          />
        )}
      </View>
      <Text style={$labelText}>{holdTime > endTimerConfig ? 'Keep Holding' : 'Well Done!'}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  $hold: {
    flex: 1,
    padding: spacing.xs,
    alignItems: 'center',
    borderRadius: radius.lg,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  $lottie: {
    width: '100%',
    height: '100%',
  },
  $circle: {
    width: spacing.xxl,
    height: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.xxl / 2,
    backgroundColor: colors.primary,
  },
  $circleText: {
    fontWeight: 'bold',
    color: colors.palette.white100,
    fontSize: typography.size.sm.fontSize,
  },
  $labelText: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontSize: typography.size.sm.fontSize,
  },
});
