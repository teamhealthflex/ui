import { View, ViewStyle, StyleProp, ViewProps } from 'react-native';

import { useTheme } from '@contexts';

export interface DividerProps extends ViewProps {
  /**
   * The size of the divider.
   */
  size?: number;

  /**
   * A boolean indicating whether to render a line within the divider.
   */
  line?: boolean;

  /**
   * An optional style override for the divider.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * The type of the divider.
   */
  type?: 'vertical' | 'horizontal';

  /**
   * An optional style for the container of the divider.
   */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * For displaying dividers.
 * @param {DividerProps} props - The props for the `Divider` component.
 * @returns {JSX.Element} The rendered `Divider` component.
 */
export function Divider(props: DividerProps) {
  const {
    type = 'horizontal',
    size = 10,
    line = false,
    style: $styleOverride,
    containerStyle,
    ...rest
  } = props;

  const { colors } = useTheme();

  const $divider: ViewStyle = {
    flexGrow: 0,
    flexShrink: 0,
    position: 'relative',
    ...(type === 'vertical' ? { width: size } : { height: size }),
  };

  const $horizontal: ViewStyle = {
    height: 1,
    top: '50%',
    width: '100%',
    transform: [{ translateY: -0.5 }],
  };

  const $vertical: ViewStyle = {
    width: 1,
    left: '50%',
    height: '100%',
    transform: [{ translateX: -0.5 }],
  };

  const $line: ViewStyle = {
    position: 'absolute',
    backgroundColor: colors.primary,
    ...(type === 'vertical' ? $vertical : $horizontal),
  };

  return (
    <View {...rest} style={[$divider, containerStyle]}>
      {line && <View style={[$line, $styleOverride]} />}
    </View>
  );
}

/**
 * The display name of the `Divider` component.
 * @type {string}
 */
Divider.displayName = 'Divider';

export default Divider;
