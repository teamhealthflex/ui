import React from 'react';
import { TextStyle, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useFocusEffect } from '@react-navigation/core';

import { useTheme } from '@contexts';
import { DirectionConfig } from '@src/models';
import { fontWeights, radius, spacing } from '@theme';
import { AudioPlayer, Text } from '@teamhealthflex/ui';
import { useMeasurableExerciseStore, DirectionFeedback } from '@src/store';

export interface DirectionFeedbackProps {
  config: DirectionConfig;
}

export function ExerciseDirectionFeedback(props: DirectionFeedbackProps) {
  const { config } = props;

  const { colors } = useTheme();

  const feedbackStream$ = useMeasurableExerciseStore(useShallow((state) => state.feedbackStream$));

  /**
   * FeedbackText to show on the screen
   */
  const [feedback, setFeedback] = React.useState<DirectionFeedback | undefined>(undefined);

  /**
   * Play error audio when feedback is error
   */
  const [playErrorAudio, setPlayErrorAudio] = React.useState(false);

  /**
   * Buffer incoming values to reduce the number of updates to the UI.
   */
  useFocusEffect(
    React.useCallback(() => {
      feedbackStream$.onFeedbackEvent((_feedback) => {
        setFeedback(_feedback);
        if (_feedback.status === 'ERROR') {
          setPlayErrorAudio(true);
        } else {
          setPlayErrorAudio(false);
        }
      });

      return () => {
        feedbackStream$.removeAllListeners();
      };
    }, [feedbackStream$]),
  );

  const feedbackState = (feedback?.status || 'SUCCESS').toLowerCase();

  /**
   * Get the background color from the mapping object
   */
  const feedbackText = feedback && feedback.toString(config);

  const $text: Record<FeedbackPresets, TextStyle> = {
    error: {
      color: colors.danger300,
      fontWeight: fontWeights.medium,
    },
    success: {
      color: colors.primary,
      fontWeight: fontWeights.medium,
    },
    warning: {
      color: colors.primary,
      fontWeight: fontWeights.medium,
    },
  };

  const $container = {
    error: {
      borderWidth: 1,
      borderColor: colors.danger300,
      backgroundColor: colors.danger200,
    },
    success: {
      borderWidth: 1,
      borderColor: colors.white300,
      backgroundColor: colors.white200,
    },
    warning: {
      borderWidth: 1,
      borderColor: colors.warning300,
      backgroundColor: colors.warning200,
    },
  };

  const $textStyle = $text[feedbackState as 'error' | 'success' | 'warning'];
  const $containerStyle = $container[feedbackState as 'error' | 'success' | 'warning'];

  if (!feedbackText) {
    return null;
  }

  const $feedbackText: TextStyle = {
    textAlign: 'center',
    color: colors.primary,
  };

  return (
    <View
      style={{
        padding: spacing.sm,
        borderRadius: radius.sm,
        ...$containerStyle,
      }}
    >
      <Text size="sm" style={[$feedbackText, { ...$textStyle }]}>
        {feedbackText}
      </Text>

      {/* Play error audio when direction feedback is error */}
      {playErrorAudio && feedbackState === 'error' && (
        <AudioPlayer
          enableAudioFeedback={true}
          source={require('@assets/audio/error.mp3')}
          onPlaybackFinished={() => setPlayErrorAudio(false)}
        />
      )}
    </View>
  );
}

export type FeedbackPresets = 'error' | 'success' | 'warning';

/**
 * The display name of the `DirectionFeedback` component.
 * @type {string}
 */
DirectionFeedback.displayName = 'DirectionFeedback';

export default DirectionFeedback;
