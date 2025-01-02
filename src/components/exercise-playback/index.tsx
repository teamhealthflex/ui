import React from 'react';
import { View } from 'react-native';

import styles from './styles';
import { Exercise } from '@src/models';
import { radius, spacing } from '@src/theme';
import { Button, Image, Icon, Text, ExercisePlayPauseButton } from '@src/components';

export interface ExercisePlaybackSheetProps {
  exercise: Exercise;
  onResume: () => void;
  onRestart: () => void;
  endSesssion: () => void;
  nextExercise: () => void;
  exerciseOverviewBottomsheetHandler: () => void;
}

const ExercisePlaybackSheet: React.FC<ExercisePlaybackSheetProps> = React.memo(
  ({
    exercise,
    onResume,
    onRestart,
    endSesssion,
    nextExercise,
    exerciseOverviewBottomsheetHandler,
  }) => {
    return (
      <View>
        <View style={styles.boldLine} />
        <View style={styles.exerciseContainer}>
          <Image
            style={styles.imageContainer}
            source={{
              resizeMode: 'contain',
              borderRadius: radius.sm,
              showActivityIndicator: true,
              cachePolicy: 'discWithCacheControl',
              url: exercise.media.image.toString(),
            }}
          />
          <Text size="sm" numberOfLines={3} style={styles.name}>
            {exercise.name}
          </Text>
          <View style={styles.watchButton}>
            <Button
              text={'Watch'}
              size="extraSmall"
              preset="reversed"
              style={styles.watchButtonAlign}
              onPress={() => exerciseOverviewBottomsheetHandler()}
              LeftAccessory={() => <Icon icon="youtube" size={spacing.md} />}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ExercisePlayPauseButton variant="vertical" type="restart" onPress={onRestart} />
          <ExercisePlayPauseButton variant="vertical" type="resume" onPress={onResume} />
          <ExercisePlayPauseButton variant="vertical" type="skip" onPress={nextExercise} />
          <ExercisePlayPauseButton variant="vertical" type="end" onPress={endSesssion} />
        </View>
      </View>
    );
  },
);

export default ExercisePlaybackSheet;
