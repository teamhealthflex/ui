import { View, StyleProp, ViewStyle, TextStyle, ViewProps } from 'react-native';

import { radius } from '@theme';
import { useTheme } from '@contexts';

export interface ValueProgressBarProps extends ViewProps {
  /**
   * The value of the progress bar.
   */
  progress: number;

  /**
   * The style of the progress bar.
   */
  progressBarStyles?: StyleProp<ViewStyle>;
}

export function ValueProgressBar(props: ValueProgressBarProps) {
  const { progress, progressBarStyles, ...rest } = props;
  const boundedProgress = Math.min(progress, 1);

  const { colors } = useTheme();

  const $baseContainer: ViewStyle = {
    flexDirection: 'row',
    height: 24,
    backgroundColor: colors.white100,
    borderRadius: 8,
    padding: 2,
  };
  const $value: TextStyle = {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
  };

  return (
    <View style={[$baseContainer, progressBarStyles]} {...rest}>
      <View style={[$value, { width: `${boundedProgress * 100}%` }]} />
    </View>
  );
}

/**
 * The display name of the `ValueProgressBar` component.
 * @type {string}
 */
ValueProgressBar.displayName = 'ValueProgressBar';

export default ValueProgressBar;
