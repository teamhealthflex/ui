import { View, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { useTheme } from '@contexts';
import { radius, spacing } from '@theme';

export interface MultiValueProgressBarProps {
  value1: number;
  value2?: number;
  value3?: number;
  value1Style?: StyleProp<ViewStyle>;
  value2Style?: StyleProp<ViewStyle>;
  value3Style?: StyleProp<ViewStyle>;
  progressBarStyles?: StyleProp<ViewStyle>;
}

export function MultiValueProgressBar(props: MultiValueProgressBarProps) {
  const {
    value1,
    value2,
    value3,
    value1Style,
    value2Style,
    value3Style,
    progressBarStyles,
    ...rest
  } = props;
  const value1IsZero = value1 === 0;
  const value2IsZero = value2 === 0;

  const { colors } = useTheme();

  const $baseContainer: ViewStyle = {
    height: spacing.sm,
    flexDirection: 'row',
    borderRadius: radius.md,
    backgroundColor: colors.transparent,
  };
  const $value1: TextStyle = {
    alignItems: 'center',
    borderTopLeftRadius: radius.md,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.md,
  };
  const $value2: TextStyle = {
    alignItems: 'center',
    borderTopRightRadius: radius.md,
    backgroundColor: colors.danger200,
    borderBottomRightRadius: radius.md,
  };
  const $value3: TextStyle = {
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white100,
  };

  return (
    <View style={[$baseContainer, progressBarStyles]} {...rest}>
      <View style={[{ flex: value1 }, $value1, value1Style]} />
      {value2 !== undefined && value2 > 0 && (
        <View
          style={[
            { flex: value2 },
            $value2,
            value2Style,
            value1IsZero && { borderTopLeftRadius: radius.md, borderBottomLeftRadius: radius.md },
            value2IsZero && { borderTopRightRadius: radius.md, borderBottomRightRadius: radius.md },
          ]}
        />
      )}
      {value3 !== undefined && value3 > 0 && (
        <View style={[{ flex: value3 }, $value3, value3Style]} />
      )}
    </View>
  );
}

/**
 * The display name of the `MultiValueProgressBar` component.
 * @type {string}
 */
MultiValueProgressBar.displayName = 'MultiValueProgressBar';

export default MultiValueProgressBar;
