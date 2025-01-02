import React from 'react';

import styles from './styles';
import { fontSizes, spacing } from '@src/theme';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Button, ButtonProps, Icon, Text } from '@src/components';

type presetType = 'resume' | 'pause' | 'end' | 'skip' | 'restart';
export interface ExercisePlayPauseButtonProps extends ButtonProps {
  type: presetType;
  variant?: 'horizontal' | 'vertical';
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

export const ExercisePlayPauseButton: React.FC<ExercisePlayPauseButtonProps> = React.memo(
  ({ type, onPress, variant, ...props }) => {
    const iconSize = variant === 'vertical' ? spacing.md : spacing.lg;
    const textStyle = variant === 'vertical' ? $verticleTextStyle : $horizontalTextStyle;
    const mainContainer = variant === 'vertical' ? $verticleContainer : $horizontalContainer;
    const style = variant === 'vertical' ? styles.verticalContainer : styles.horizontalContainer;

    return (
      <Button
        size="extraSmall"
        style={[style, styles.playbackButtons]}
        onPress={onPress}
        preset="reversed"
        {...props}
      >
        <View style={mainContainer}>
          {getIcon(type, iconSize)}
          <Text style={textStyle}>{getTitle(type)}</Text>
        </View>
      </Button>
    );
  },
);

export default ExercisePlayPauseButton;

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
