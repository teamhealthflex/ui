import { TextStyle, View, ViewStyle } from 'react-native';

import { fontSizes, spacing } from '@theme';
import { Button, ButtonProps, Icon, Text } from '@teamhealthflex/ui';

export interface ExercisePlayPauseButtonProps extends ButtonProps {
  type: presetType;
  variant?: variantPreset;
}

const getIcon = (preset: presetType, iconSize: number) => {
  switch (preset) {
    case 'resume':
      return <Icon icon="play" size={iconSize} />;
    case 'pause':
      return <Icon icon="pause" size={iconSize} />;
    case 'skip':
      return <Icon icon="skip" size={iconSize} />;
    case 'end':
      return <Icon icon="stop" size={iconSize} />;
    case 'restart':
      return <Icon icon="restart" size={iconSize} />;
  }
};

const getTitle = (preset: presetType) => {
  switch (preset) {
    case 'resume':
      return 'Resume';
    case 'pause':
      return 'Pause';
    case 'end':
      return 'End';
    case 'skip':
      return 'Skip';
    case 'restart':
      return 'Restart';
    default:
      return 'Resume';
  }
};

export function ExercisePlayPauseButton(props: ExercisePlayPauseButtonProps) {
  const { type, onPress, variant, ...rest } = props;

  const iconSize = variant === 'vertical' ? spacing.md : spacing.lg;
  const textStyle = variant === 'vertical' ? $verticleTextStyle : $horizontalTextStyle;
  const mainContainer = variant === 'vertical' ? $verticleContainer : $horizontalContainer;
  const style = variant === 'vertical' ? $verticleContainer : $horizontalContainer;

  return (
    <Button
      size="extraSmall"
      style={[style, $playbackButtons]}
      onPress={onPress}
      preset="reversed"
      {...rest}
    >
      <View style={mainContainer}>
        {getIcon(type, iconSize)}
        <Text style={textStyle}>{getTitle(type)}</Text>
      </View>
    </Button>
  );
}

export type variantPreset = 'horizontal' | 'vertical';
export type presetType = 'resume' | 'pause' | 'end' | 'skip' | 'restart';

const $verticleTextStyle: TextStyle = {
  textAlign: 'center',
  ...fontSizes.xs,
  minWidth: 50,
};

const $verticleContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 0,
  paddingVertical: spacing.xxs,
};

const $horizontalTextStyle: TextStyle = {
  paddingRight: spacing.lg,
  ...fontSizes.lg,
};

const $horizontalContainer: ViewStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

const $playbackButtons: ViewStyle = {
  minWidth: spacing.header_section_empty_height,
};

/**
 * The display name of the `ExercisePlayPauseButton` component.
 * @type {string}
 */
ExercisePlayPauseButton.displayName = 'ExercisePlayPauseButton';

export default ExercisePlayPauseButton;
