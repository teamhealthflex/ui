import { ImageStyle, Platform, TextStyle, View, ViewStyle } from 'react-native';

import { useTheme } from '@contexts';
import { fontWeights, radius, spacing } from '@theme';
import { Button, Image, Icon, Text, ExercisePlayPauseButton } from '@teamhealthflex/ui';

export interface ExercisePlaybackSheetProps {
  exercise: {
    name: string;
    media: { image: string };
  };
  onResume: () => void;
  onRestart: () => void;
  endSesssion: () => void;
  nextExercise: () => void;
  exerciseOverviewBottomsheetHandler: () => void;
}

export function ExercisePlaybackSheet(props: ExercisePlaybackSheetProps) {
  const {
    exercise,
    onResume,
    onRestart,
    endSesssion,
    nextExercise,
    exerciseOverviewBottomsheetHandler,
    ...rest
  } = props;

  const { colors } = useTheme();

  const $boldLine: TextStyle = {
    height: 1.4,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
  };

  const $exerciseContainer: ViewStyle = {
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderColor: colors.primary,
    justifyContent: 'flex-start',
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.white200,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: radius.xs,
        shadowColor: colors.black500,
      },
    }),
  };

  const $imageContainer: ImageStyle = {
    height: spacing.xxl,
    width: spacing.xxxl,
    marginRight: spacing.xs,
    borderRadius: radius.md,
  };

  const $name: TextStyle = {
    maxWidth: '50%',
    fontWeight: fontWeights.medium,
  };

  const $watchButton: ViewStyle = {
    flex: 1,
  };

  const $watchButtonAlign: ViewStyle = {
    alignSelf: 'flex-end',
  };

  const $buttonContainer: ViewStyle = {
    flexDirection: 'row',
    marginTop: spacing.md,
    marginBottom: spacing.xxs,
    justifyContent: 'space-between',
  };

  return (
    <View {...rest}>
      <View style={$boldLine} />
      <View style={$exerciseContainer}>
        <Image
          style={$imageContainer}
          source={{
            resizeMode: 'contain',
            borderRadius: radius.sm,
            showActivityIndicator: true,
            cachePolicy: 'discWithCacheControl',
            url: exercise.media.image.toString(),
          }}
        />
        <Text size="sm" numberOfLines={3} style={$name}>
          {exercise.name}
        </Text>
        <View style={$watchButton}>
          <Button
            text={'Watch'}
            size="extraSmall"
            preset="reversed"
            style={$watchButtonAlign}
            onPress={() => exerciseOverviewBottomsheetHandler()}
            // eslint-disable-next-line react/no-unstable-nested-components
            LeftAccessory={() => <Icon icon="youtube" size={spacing.md} />}
          />
        </View>
      </View>

      <View style={$buttonContainer}>
        <ExercisePlayPauseButton variant="vertical" type="restart" onPress={onRestart} />
        <ExercisePlayPauseButton variant="vertical" type="resume" onPress={onResume} />
        <ExercisePlayPauseButton variant="vertical" type="skip" onPress={nextExercise} />
        <ExercisePlayPauseButton variant="vertical" type="end" onPress={endSesssion} />
      </View>
    </View>
  );
}

/**
 * The display name of the `ExercisePlaybackSheet` component.
 * @type {string}
 */
ExercisePlaybackSheet.displayName = 'ExercisePlaybackSheet';

export default ExercisePlaybackSheet;
