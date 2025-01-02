import React from 'react';
import { View, ViewStyle } from 'react-native';
import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/core';

import { spacing } from '@theme';
import { useSession } from '@src/contexts';
import BottomContainer from './bottom-container';
import { ExerciseRepData, MEASURABLE_TYPE } from '@src/models';
import {
  Spinner,
  AudioPlayer,
  BottomSheet,
  BottomSheetRef,
  ExercisePlaybackSheet,
} from '@teamhealthflex/ui';
import {
  ExerciseFlowRoutes,
  RegimenStackRoutes,
  SessionStackRoutes,
  AuthenticatedRoutes,
  PreExerciseStackRoutes,
} from '@src/navigation';

export type ExerciseBottomSheetProps = {
  rep?: ExerciseRepData;
  resetStore: () => void;
  pauseExercise: () => void;
  resumeExercise: () => void;
};

export function ExerciseBottomSheet(props: ExerciseBottomSheetProps) {
  const { rep, pauseExercise, resumeExercise } = props;

  const navigation = useNavigation();
  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  const {
    addRep,
    loading,
    exercise,
    repCount,
    resetReps,
    endSession,
    exerciseQueue,
    exerciseSession,
    endExerciseSession,
  } = useSession();

  const totalRepCount = React.useMemo(() => exercise?.numberOfReps ?? 0, [exercise]);
  const isLastRepOver = React.useMemo(() => repCount === totalRepCount, [repCount, totalRepCount]);

  /**
   * Play audio feedback when a rep is completed
   */
  const [playAudio, setPlayAudio] = React.useState(false);

  const handleCardPress = React.useCallback(() => {
    if (bottomSheetRef.current) {
      pauseExercise();
      bottomSheetRef.current?.open();
    }
  }, [pauseExercise]);

  const handleCloseBottomSheet = React.useCallback(() => {
    if (bottomSheetRef.current) {
      resumeExercise();
      bottomSheetRef.current?.close();
    }
  }, [resumeExercise]);

  const onRestart = React.useCallback(() => {
    resetReps();
    handleCloseBottomSheet();
    navigation.dispatch(
      StackActions.replace(ExerciseFlowRoutes.PreExerciseStack, {
        screen: PreExerciseStackRoutes.ExerciseWaitScreen,
      }),
    );
  }, [navigation, resetReps, handleCloseBottomSheet]);

  const onEndSession = React.useCallback(async () => {
    const _session = await endSession();
    handleCloseBottomSheet();
    navigation.dispatch(
      StackActions.replace(AuthenticatedRoutes.SessionStack, {
        screen: SessionStackRoutes.SessionFeedbackScreen,
        params: { sessionId: _session._id! },
      }),
    );
  }, [navigation, endSession, handleCloseBottomSheet]);

  const onSkipExercise = React.useCallback(async () => {
    const completedExercise = await endExerciseSession();
    if (completedExercise && exerciseQueue.hasNextItem()) {
      handleCloseBottomSheet();
      navigation.dispatch(
        StackActions.replace(ExerciseFlowRoutes.PreExerciseStack, {
          screen: PreExerciseStackRoutes.ExerciseWaitScreen,
          params: {
            exerciseSessionResponse:
              completedExercise.measurableType === MEASURABLE_TYPE.MEASURABLE
                ? completedExercise
                : undefined,
          },
        }),
      );
    } else {
      const _session = await endSession();
      handleCloseBottomSheet();
      navigation.dispatch(
        StackActions.replace(AuthenticatedRoutes.SessionStack, {
          params: { sessionId: _session._id! },
          screen: SessionStackRoutes.SessionFeedbackScreen,
        }),
      );
    }
  }, [navigation, endSession, exerciseQueue, endExerciseSession, handleCloseBottomSheet]);

  React.useEffect(() => {
    if (rep) {
      addRep(rep);
      setPlayAudio(true);
    }
  }, [rep, addRep]);

  React.useEffect(() => {
    if (repCount === totalRepCount) {
      onSkipExercise();
      handleCardPress();
      pauseExercise();
    }
  }, [repCount, totalRepCount, pauseExercise, handleCardPress, onSkipExercise]);

  /**
   * Reset rep and star count when navigating away from the exercise and unmounting it
   */
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (exerciseSession?.measurableType === MEASURABLE_TYPE.NON_MEASURABLE) {
          resetReps();
        }
      };
    }, [exerciseSession?.measurableType, resetReps]),
  );

  const handleWatchOverview = React.useCallback(() => {
    handleCloseBottomSheet();
    navigation.dispatch(
      StackActions.push(AuthenticatedRoutes.RegimenStack, {
        screen: RegimenStackRoutes.ExerciseVideoScreen,
        params: { videoTitle: exercise!.name, videoUrl: exercise!.media.video!.toString() },
      }),
    );
  }, [exercise, handleCloseBottomSheet, navigation]);

  return (
    <>
      <BottomContainer handleCardPress={handleCardPress} />

      <BottomSheet
        initialIndex={-1}
        ref={bottomSheetRef}
        titleDivider={false}
        enableOverDrag={false}
        onClose={handleCloseBottomSheet}
        enablePanDownToClose={loading || isLastRepOver ? false : true}
        backdropRenderedBehavior={loading || isLastRepOver ? 'none' : 'close'}
        title={loading || isLastRepOver ? 'Finishing Exercise' : 'Exercise Paused'}
      >
        {exercise && !loading && !isLastRepOver && (
          <ExercisePlaybackSheet
            exercise={exercise}
            onRestart={onRestart}
            endSesssion={onEndSession}
            nextExercise={onSkipExercise}
            onResume={handleCloseBottomSheet}
            exerciseOverviewBottomsheetHandler={handleWatchOverview}
          />
        )}
        {(loading || isLastRepOver) && (
          <View style={$spinnerContainer}>
            <Spinner active />
          </View>
        )}
      </BottomSheet>

      {/* Audio feedback for rep completion */}
      {playAudio && (
        <AudioPlayer
          enableAudioFeedback={true}
          onPlaybackFinished={() => setPlayAudio(false)}
          source={require('@assets/audio/rep_complete.mp3')}
        />
      )}
    </>
  );
}

const $spinnerContainer: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: spacing.xl,
};

/**
 * The display name of the `ExerciseBottomSheet` component.
 * @type {string}
 */
ExerciseBottomSheet.displayName = 'ExerciseBottomSheet';

export default ExerciseBottomSheet;
