import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, ViewStyle, View, TextStyle } from 'react-native';

import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { useCustomStyles } from '@theme';
import { Text, Card, Progress } from '@teamhealthflex/ui';

export interface DashboardCardProps {
  title: string;
  progress?: number;
  disabled?: boolean;
  onPress?: () => void;
  icon: React.ReactNode;
  isPercentage?: boolean;
  value: string | number;
  style?: StyleProp<ViewStyle>;
}

export function DashboardCard(props: DashboardCardProps) {
  const {
    style,
    icon,
    title,
    value,
    onPress,
    progress,
    isPercentage,
    disabled = false,
    ...rest
  } = props;

  const { colors } = useTheme();
  const { styles } = useCustomStyles();

  const formattedValue = isPercentage ? `${value}%` : `${value}`;

  const $card: ViewStyle = {
    flex: 1,
    height: '100%',
    borderWidth: 0,
    overflow: 'hidden',
  };

  const $viewContainer: ViewStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const $progress: ViewStyle = {
    marginVertical: spacing.xxs,
  };

  const $title: TextStyle = {
    color: colors.primary,
    marginTop: spacing.xs,
    marginBottom: spacing.xxxs,
  };

  const $row: ViewStyle = {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.xxs,
    justifyContent: 'center',
  };

  const $tapToView: TextStyle = {
    color: colors.primary,
  };

  return (
    <Card
      raised
      onPress={onPress}
      disabled={disabled}
      style={[$card, style]}
      verticalAlignment="center"
      ContentComponent={
        <>
          <View style={$viewContainer}>
            {icon}
            <Text weight="semiBold" preset="subHeading">
              {formattedValue}
            </Text>
          </View>
          <Text weight="semiBold" size="sm" style={$title}>
            {title}
          </Text>

          {progress !== undefined && (
            <View style={$progress}>
              <Progress step={progress ?? 0} steps={100} h={6} />
            </View>
          )}

          {onPress && (
            <View style={$row}>
              <Text preset="extraSmall" weight="light" size="xxs" style={$tapToView}>
                Tap to view
              </Text>
              <View style={styles.spacer} />
              <MaterialIcons name="arrow-forward-ios" size={10} color={colors.primary} />
            </View>
          )}
        </>
      }
      {...rest}
    />
  );
}

/**
 * The display name of the `DashboardCard` component.
 * @type {string}
 */
DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
