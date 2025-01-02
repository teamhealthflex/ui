/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle, ImageStyle, ViewProps } from 'react-native';

import { Text } from '../text';
import { Image } from '../image';
import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { useCustomStyles } from '@theme';

interface UserAvatarProps extends ViewProps {
  size?: number;
  bgColor?: string;
  firstName?: string;
  lastName?: string;
  disabled?: boolean;
  borderRadius?: number;
  avatar?: string | null;
  conditionDetails?: string;
  style?: StyleProp<ViewStyle>;
  fallbackIcon?: React.ReactNode;
}

export function UserAvatar(props: UserAvatarProps) {
  const {
    size,
    style,
    avatar,
    bgColor,
    lastName,
    firstName,
    disabled,
    fallbackIcon,
    conditionDetails,
    ...rest
  } = props;
  const avatarSize = size || spacing.xxl;
  const backgroundColor = bgColor || 'transparent';
  const { colors } = useTheme();
  const { styles } = useCustomStyles();

  const containerStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    overflow: 'hidden' as 'hidden',
    backgroundColor: avatar ? 'transparent' : backgroundColor,
  };

  const renderAvatar = React.useCallback(() => {
    if (avatar) {
      return (
        <Image
          source={{ url: avatar }}
          style={[
            $avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        />
      );
    }
    return fallbackIcon || <Text preset="heading">{firstName?.charAt(0)}</Text>;
  }, [avatar, avatarSize, fallbackIcon, firstName]);

  const patientFullName = `${firstName} ${lastName}`;

  const $container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const $avatar: ImageStyle = {
    borderWidth: 0,
    width: spacing.xxl,
    height: spacing.xxl,
    borderColor: 'transparent',
  };

  const $avatarContainer: ViewStyle = {
    width: spacing.xxl,
    height: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.xxl,
  };

  const $textContainer: ViewStyle = {
    maxWidth: '70%',
    marginLeft: spacing.sm,
  };

  const $subTitle: TextStyle = {
    color: colors.primary,
  };

  const $viewStyle = [$container, disabled && styles.disabled, style && style];

  return (
    <View style={[$viewStyle]} {...rest}>
      <View style={[$avatarContainer, containerStyle]} {...rest}>
        {renderAvatar()}
      </View>
      {/* Render name and details only if provided */}
      {(firstName || conditionDetails) && (
        <View style={$textContainer}>
          {firstName && (
            <Text preset="heading" size="md" numberOfLines={1} ellipsizeMode="tail">
              {patientFullName}
            </Text>
          )}
          {conditionDetails && (
            <Text style={$subTitle} size="sm">
              {conditionDetails}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * The display name of the `UserAvatar` component.
 * @type {string}
 */
UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
