/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View, Text, ViewStyle, TextStyle, ViewProps } from 'react-native';

/**
 * Interface for controlling the CountDownTimer component.
 * @extends ViewProps
 */
export interface CountDownTimerControls extends ViewProps {
  /**
   * The current time remaining in the countdown timer.
   */
  time: number;

  /**
   * Starts the timer if it is not already running.
   * The timer decrements the time every second until it reaches 0.
   */
  startTimer: () => void;

  /**
   * Pauses the timer if it is currently running.
   */
  pauseTimer: () => void;

  /**
   * Cancels the timer by pausing it and resetting the time to the initial value.
   */
  cancelTimer: () => void;

  /**
   * Restarts the timer by resetting the time to the initial value and starting it again.
   */
  restartTimer: () => void;

  /**
   * Indicates whether the timer is currently active (running).
   */
  isTimerActive: boolean;
}

/**
 * Props for the CountDownTimer component.
 * @extends ViewProps
 */
export interface CountDownTimerProps extends ViewProps {
  /**
   * Custom styles for the container View component.
   */
  style?: ViewStyle;

  /**
   * Custom styles for the Text component that displays the countdown time.
   */
  textStyle?: TextStyle;

  /**
   * The initial time (in seconds) from which the countdown starts.
   * Defaults to 5 if not provided.
   */
  initialTime?: number;

  /**
   * Callback function triggered when the countdown timer reaches 0.
   */
  onFinish?: () => void;

  /**
   * Callback function triggered when the timer is ready and provides controls
   * to manage the timer (start, pause, cancel, restart).
   */
  onReady?: (controls: CountDownTimerControls) => void;
}

/**
 * A reusable CountDownTimer component that counts down from a specified initial time.
 * It provides controls to start, pause, cancel, and restart the timer.
 * The timer is managed using React hooks and React Navigation's useFocusEffect.
 */
export function CountDownTimer(props: CountDownTimerProps) {
  const { style, onReady, onFinish, textStyle, initialTime = 5, ...rest } = props;
  const [time, setTime] = React.useState(initialTime);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isTimerActive, setIsTimerActive] = React.useState(false);

  const startTimer = React.useCallback(() => {
    if (timerRef.current) return;

    setIsTimerActive(true);

    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsTimerActive(false);
          onFinish?.();
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);
  }, [onFinish]);

  const pauseTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsTimerActive(false);
    }
  }, []);

  const restartTimer = React.useCallback(() => {
    pauseTimer();
    setTime(initialTime);
    startTimer();
  }, [initialTime, pauseTimer, startTimer]);

  const cancelTimer = React.useCallback(() => {
    pauseTimer();
    setTime(initialTime);
  }, [initialTime, pauseTimer]);

  /**
   * Manages the timer lifecycle using React Navigation's useFocusEffect.
   * Resets the timer and starts it when the component is focused.
   * Cleans up the timer when the component loses focus.
   */

  React.useEffect(() => {
    setTime(initialTime);
    startTimer();

    const controls = {
      time,
      startTimer,
      pauseTimer,
      cancelTimer,
      restartTimer,
      isTimerActive,
    };

    onReady?.(controls);

    return () => {
      pauseTimer();
    };
  }, [startTimer, pauseTimer, cancelTimer, restartTimer]);

  return (
    <View style={style} {...rest}>
      <Text style={textStyle}>{time === 0 ? 'START' : time}</Text>
    </View>
  );
}

/**
 * The display name of the `CountDownTimer` component.
 * @type {string}
 */
CountDownTimer.displayName = 'CountDownTimer';

export default CountDownTimer;
