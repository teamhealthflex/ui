import React from 'react';
import { Animated, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { LinearGradient } from 'expo-linear-gradient';

import styles from './styles';
import { HoldTimer } from './timer';
import { HoldStability } from './stability';
import { colors, spacing } from '@src/theme';
import { useMeasurableExerciseStore } from '@src/store';
import { useFocusEffect } from '@react-navigation/core';

export interface ExerciseHoldCardProps {
  holdTime: number;
}

export const ExerciseHoldCard: React.FC<ExerciseHoldCardProps> = React.memo(
  ({ holdTime: timeDuration }) => {
    const holdStatusStream$ = useMeasurableExerciseStore(useShallow((state) => state.holdStream$));

    const [isHold, setIsHold] = React.useState(false);
    const [holdTime, setHoldTime] = React.useState<number>(timeDuration);

    const slideAnim = React.useRef(new Animated.Value(-20)).current;

    /**
     * Buffer incoming values to reduce the number of updates to the UI.
     */
    useFocusEffect(
      React.useCallback(() => {
        holdStatusStream$.onHoldEvent((hold) => {
          /**
           * Update the hold value
           */
          setIsHold(hold);
        });

        return () => {
          holdStatusStream$.removeAllListeners();
        };
      }, [holdStatusStream$]),
    );

    React.useEffect(() => {
      Animated.timing(slideAnim, {
        duration: 250,
        useNativeDriver: true,
        toValue: isHold ? -spacing.xs : -spacing.xl,
      }).start();
    }, [isHold, slideAnim]);

    const decrementTimer = React.useCallback(() => {
      setHoldTime((prevTimer) => prevTimer - 1);
    }, []);

    /**
     * Decrement the timer every second when the hold is active
     */
    React.useEffect(() => {
      let intervalId: NodeJS.Timeout | undefined;
      if (holdTime > 0 && isHold) {
        intervalId = setInterval(decrementTimer, 1000);
      } else if (!isHold) {
        setHoldTime(timeDuration);
      }

      return () => {
        clearInterval(intervalId);
      };
    }, [holdTime, isHold, timeDuration, decrementTimer]);

    return (
      <View>
        {isHold && (
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.holdContainer}
            colors={[...colors.palette.primary_gradient]}
          >
            {/* hold timer */}
            <HoldTimer holdTime={holdTime} />

            {/* hold stability */}
            <HoldStability holdTime={holdTime} />
          </LinearGradient>
        )}
      </View>
    );
  },
);
