/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View, StyleProp, Pressable, ViewStyle, PressableProps, TextStyle } from 'react-native';

import { Text } from '../text';
import { useCustomStyles } from '@theme';

interface ListTileProps extends PressableProps {
  disabled?: boolean;
  onPress?: () => void;
  title?: React.ReactNode;
  leading?: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}

export function ListTile(props: ListTileProps) {
  const {
    style,
    title,
    leading,
    subtitle,
    trailing,
    disabled,
    titleStyle = {},
    subtitleStyle = {},
    onPress,
    ...pressableProps
  } = props;

  const { styles } = useCustomStyles();

  const handlePress = React.useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const $tile: ViewStyle = {
    alignItems: 'center',
    ...styles.row,
  };

  const $leadingContainer: ViewStyle = {
    flex: 2.5,
    overflow: 'hidden',
  };

  const $trailing: ViewStyle = {
    flex: 1,
    height: '100%',
  };

  const combinedStyle = React.useMemo(() => [$tile, style], [$tile]);

  return (
    <Pressable disabled={disabled} style={combinedStyle} onPress={handlePress} {...pressableProps}>
      <View style={$leadingContainer}>{leading}</View>
      {(title || subtitle) && (
        <View>
          {title && (
            <Text preset="heading" style={titleStyle}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text preset="subHeading" style={subtitleStyle}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={$trailing}>{trailing}</View>
    </Pressable>
  );
}

/**
 * The display name of the `ListTile` component.
 * @type {string}
 */
ListTile.displayName = 'ListTile';

export default ListTile;
