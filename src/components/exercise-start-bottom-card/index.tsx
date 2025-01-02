import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useSession } from '@src/contexts';
import { MEASURABLE_TYPE } from '@src/models';
import { MemoExerciseBottomSheet } from './exercise-bottom-sheet';
import { useMeasurableExerciseStore, useNonMeasurableExerciseStore } from '@src/store';

export interface ExerciseStartBottomCardProps {
  onPress?: () => void;
}

/**
 * ExerciseStartBottomCard component to display the current and total reps and stars
 */
export const ExerciseStartBottomCard: React.FC = React.memo(() => {
  const { exerciseSession } = useSession();

  const {
    measurableRep,
    resetMeasurableExercise,
    measurablePauseExercise,
    measurableResumeExercise,
  } = useMeasurableExerciseStore(
    useShallow((state) => ({
      ready: state.ready,
      measurableRep: state.rep,
      resetMeasurableExercise: state.reset,
      measurablePauseExercise: state.pauseExercise,
      measurableResumeExercise: state.resumeExercise,
    })),
  );

  const {
    nonMeasurableRep,
    resetNonMeasurableExercise,
    nonMeasurablePauseExercise,
    nonMeasurableResumeExercise,
  } = useNonMeasurableExerciseStore(
    useShallow((state) => ({
      nonMeasurableRep: state.rep,
      resetNonMeasurableExercise: state.reset,
      nonMeasurablePauseExercise: state.pauseExercise,
      nonMeasurableResumeExercise: state.resumeExercise,
    })),
  );

  const measurableType = React.useMemo(() => exerciseSession?.measurableType, [exerciseSession]);

  const measurableBottomSheetProps = React.useMemo(() => {
    return {
      rep: measurableRep,
      resetStore: resetMeasurableExercise,
      pauseExercise: measurablePauseExercise,
      resumeExercise: measurableResumeExercise,
    };
  }, [measurableRep, measurablePauseExercise, measurableResumeExercise, resetMeasurableExercise]);

  const nonMeasurableBottomSheetProps = React.useMemo(() => {
    return {
      rep: nonMeasurableRep,
      resetStore: resetNonMeasurableExercise,
      pauseExercise: nonMeasurablePauseExercise,
      resumeExercise: nonMeasurableResumeExercise,
    };
  }, [
    nonMeasurableRep,
    resetNonMeasurableExercise,
    nonMeasurablePauseExercise,
    nonMeasurableResumeExercise,
  ]);

  const bottomSheetProps = React.useMemo(() => {
    if (measurableType === MEASURABLE_TYPE.MEASURABLE) {
      return {
        ...measurableBottomSheetProps,
      };
    }
    return {
      ...nonMeasurableBottomSheetProps,
    };
  }, [measurableType, measurableBottomSheetProps, nonMeasurableBottomSheetProps]);

  return <MemoExerciseBottomSheet {...bottomSheetProps} />;
});

export default ExerciseStartBottomCard;
