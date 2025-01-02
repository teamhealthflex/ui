import React from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { Icon, IconTypes, Text, TextProps } from '@teamhealthflex/ui';

export interface ListItemProps extends TouchableOpacityProps {
  /**
   * How tall the list item should be.
   * Default: 56
   */
  height?: number;

  /**
   * Whether to show the top separator.
   * Default: false
   */
  topSeparator?: boolean;

  /**
   * Whether to show the bottom separator.
   * Default: false
   */
  bottomSeparator?: boolean;

  /**
   * Text to display if not using `tx` or nested components.
   */
  text?: TextProps['text'];

  /**
   * Children components.
   */
  children?: TextProps['children'];

  /**
   * Optional text style override.
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Pass any additional props directly to the Text component.
   */
  textProps?: TextProps;

  /**
   * Optional View container style override.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Optional TouchableOpacity style override.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Icon that should appear on the left.
   */
  leftIcon?: IconTypes;

  /**
   * An optional tint color for the left icon
   */
  leftIconColor?: string;

  /**
   * Icon that should appear on the right.
   */
  rightIcon?: IconTypes;

  /**
   * An optional tint color for the right icon
   */
  rightIconColor?: string;

  /**
   * Right action custom React.ReactElement.
   * Overrides `rightIcon`.
   */
  RightComponent?: React.ReactElement;

  /**
   * Left action custom React.ReactElement.
   * Overrides `leftIcon`.
   */
  LeftComponent?: React.ReactElement;
}

export interface ListItemActionProps {
  side: Sides;
  size: number;
  icon?: IconTypes;
  iconColor?: string;
  Component?: React.ReactElement;
}

/**
 * A styled row component that can be used in FlatList, SectionList, or by itself.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/ListItem/}
 * @param {ListItemProps} props - The props for the `ListItem` component.
 * @returns {JSX.Element} The rendered `ListItem` component.
 */
export function ListItem(props: ListItemProps) {
  const {
    text,
    style,
    children,
    leftIcon,
    rightIcon,
    textProps,
    height = 56,
    topSeparator,
    LeftComponent,
    leftIconColor,
    RightComponent,
    rightIconColor,
    bottomSeparator,
    textStyle: $textStyleOverride,
    containerStyle: $containerStyleOverride,
    ...touchableOpacityProps
  } = props;

  const { colors } = useTheme();

  const $separatorTop: ViewStyle = {
    borderTopWidth: 1,
    borderTopColor: colors.white300,
  };

  const $separatorBottom: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.white300,
  };

  const $textStyle: TextStyle = {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  };

  const $touchableStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
  };

  const $textStyles = [$textStyle, $textStyleOverride, textProps?.style];

  const $containerStyles = [
    topSeparator && $separatorTop,
    bottomSeparator && $separatorBottom,
    $containerStyleOverride,
  ];

  const $touchableStyles = [$touchableStyle, { minHeight: height }, style];

  return (
    <View style={$containerStyles}>
      <TouchableOpacity {...touchableOpacityProps} style={$touchableStyles}>
        <ListItemAction
          side="left"
          size={height}
          icon={leftIcon}
          iconColor={leftIconColor}
          Component={LeftComponent}
        />

        <Text {...textProps} text={text} style={$textStyles}>
          {children}
        </Text>

        <ListItemAction
          side="right"
          size={height}
          icon={rightIcon}
          iconColor={rightIconColor}
          Component={RightComponent}
        />
      </TouchableOpacity>
    </View>
  );
}

/**
 * @param {ListItemActionProps} props - The props for the `ListItemAction` component.
 * @returns {JSX.Element | null} The rendered `ListItemAction` component.
 */
function ListItemAction(props: ListItemActionProps) {
  const { icon, Component, iconColor, size, side } = props;

  const $iconContainer: ViewStyle = {
    flexGrow: 0,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const $iconContainerLeft: ViewStyle = {
    marginEnd: spacing.md,
  };

  const $iconContainerRight: ViewStyle = {
    marginStart: spacing.md,
  };

  const $iconContainerStyles = [$iconContainer];

  if (Component) return Component;
  if (icon !== undefined) {
    return (
      <Icon
        size={24}
        icon={icon}
        color={iconColor}
        containerStyle={[
          $iconContainerStyles,
          side === 'left' && $iconContainerLeft,
          side === 'right' && $iconContainerRight,
          { height: size },
        ]}
      />
    );
  }

  return null;
}

export type Sides = 'left' | 'right';

/**
 * The display name of the `ListItem` component.
 * @type {string}
 */
ListItem.displayName = 'ListItem';

export default ListItem;
