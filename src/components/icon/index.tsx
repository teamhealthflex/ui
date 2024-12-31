/**
 * Icon component for rendering registered icons with optional properties.
 *
 * This component allows you to display an icon from a predefined registry.
 * You can customize the icon's color, size, and styles for both the image
 * and the container. Additionally, it supports a press event handler to
 * make the icon interactive.
 *
 * Props:
 * - icon: The name of the icon to display (required).
 * - color: Optional tint color for the icon.
 * - size: Optional size for the icon.
 * - style: Optional style overrides for the icon image.
 * - containerStyle: Optional style overrides for the icon container.
 * - onPress: Optional function to handle press events.
 */

import React from 'react';
import { Image, ImageStyle } from 'react-native';
import {
  Feather,
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { spacing } from '@theme';
import { useCustomStyles } from '@theme';

export type IconTypes = keyof typeof iconRegistry;

export interface IconProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * The name of the icon
   */
  icon: IconTypes;

  /**
   * An optional tint color for the icon
   */
  color?: string;

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number;

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps['onPress'];
}

const DEFAULT_ICON_SIZE = 24;
const DEFAULT_ICON_COLOR = '#011f5b';

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @param {IconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size = DEFAULT_ICON_SIZE,
    style: $iconStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props;
  const isPressable = !!WrapperProps.onPress;

  const { styles } = useCustomStyles();

  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as React.ComponentType<
    TouchableOpacityProps | ViewProps
  >;

  const $imageStyleBase: ImageStyle = {
    resizeMode: 'contain',
  };

  const $iconContainer: ViewStyle = {
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  };

  const $disabed: ImageStyle = {
    ...styles.disabled,
  };

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { width: size, height: size },
    $iconStyleOverride,
  ];

  /**
   * Clone the element with additional props
   */
  const IconElement = iconRegistry[icon];
  const isValidIconCOmponent = React.isValidElement(iconRegistry[icon]);

  const imageStyleMain: StyleProp<ImageStyle> = [$imageStyle, WrapperProps.disabled && $disabed];

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'button' : undefined}
      style={[isValidIconCOmponent && $iconContainer, $containerStyleOverride]}
      {...WrapperProps}
    >
      {isValidIconCOmponent ? (
        React.cloneElement(IconElement, {
          size: size || DEFAULT_ICON_SIZE,
          color: color || DEFAULT_ICON_COLOR,
          style: [$iconStyleOverride, WrapperProps.disabled && $disabed],
        })
      ) : (
        <Image style={imageStyleMain} />
        // <Image source={IconElement} style={imageStyleMain} />
      )}
    </Wrapper>
  );
}

export const iconRegistry = {
  /**
   * asset icons from the assets folder
   */
  //   'view': require('@assets/icons/view.png'),
  //   'check': require('@assets/icons/check.png'),
  //   'hidden': require('@assets/icons/hidden.png'),
  //   'exercise': require('@assets/icons/exercise.png'),
  //   'ai-guided': require('@assets/icons/ai.png'),
  //   'self-guided': require('@assets/icons/selfguided.png'),

  /**
   * vector icons from the expo vector icons library
   */
  'user': <Feather name="user" />,
  'gallery': <Feather name="image" />,
  'camera': <Feather name="camera" />,
  'stop': <MaterialIcons name="stop" />,
  'edit': <MaterialIcons name="edit" />,
  'check': <MaterialIcons name="check" />,
  'pause': <MaterialIcons name="pause" />,
  'clear': <Ionicons name="close-outline" />,
  'checkmark': <Ionicons name="checkmark" />,
  'remove_dash': <Ionicons name="remove" />,
  'skip': <MaterialIcons name="skip-next" />,
  'alert': <Feather name="alert-triangle" />,
  'play': <MaterialIcons name="play-arrow" />,
  'delete': <Ionicons name="trash-outline" />,
  'search': <Ionicons name="search-outline" />,
  'star': <MaterialIcons name="star-border" />,
  'whatsapp': <Ionicons name="logo-whatsapp" />,
  'logout': <Ionicons name="log-out-outline" />,
  'endurance': <Ionicons name="flash-outline" />,
  'options': <Ionicons name="options-outline" />,
  'rep_distribution': <Feather name="activity" />,
  'chat': <Ionicons name="chatbubbles-outline" />,
  'back': <Ionicons name="chevron-back-outline" />,
  'close': <Ionicons name="close-circle-outline" />,
  'bluetooth': <Ionicons name="bluetooth-outline" />,
  'download': <MaterialIcons name="cloud-download" />,
  'youtube': <MaterialCommunityIcons name="youtube" />,
  'restart': <MaterialCommunityIcons name="restart" />,
  'check_circle': <MaterialIcons name="check-circle" />,
  'youtube-play': <FontAwesome name="youtube-play" />,
  'add-person': <Ionicons name="person-add-outline" />,
  'chevron-up': <Ionicons name="chevron-up-outline" />,
  'camera-outline': <Ionicons name="camera-outline" />,
  'hold': <MaterialCommunityIcons name="timer-outline" />,
  'stability': <MaterialIcons name="stacked-line-chart" />,
  'stability_score': <MaterialIcons name="legend-toggle" />,
  'docChat': <Ionicons name="chatbubble-ellipses-outline" />,
  'chevron-down': <Ionicons name="chevron-down-outline" />,
  'correctness': <Ionicons name="checkmark-circle-outline" />,
  'arrow-down': <MaterialIcons name="keyboard-arrow-down" />,
  'arm_flex': <MaterialCommunityIcons name="arm-flex-outline" />,
};
