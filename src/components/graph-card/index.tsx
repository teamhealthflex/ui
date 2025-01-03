import { ReactNode } from 'react';
import { View, TextStyle, Text as RNText, ViewStyle, Platform } from 'react-native';

import { useTheme } from '@contexts';
import { Text } from '@teamhealthflex/ui';
import { fontSizes, fontWeights, radius, spacing } from '@theme';

export interface GraphCardProps {
  title: string;
  average: string;
  icon?: ReactNode;
  children?: ReactNode;
  averageSubtitle: string;
  averageSuffix?: ReactNode;
  averageSuffixText?: string;
}

export function GraphCard(props: GraphCardProps) {
  const {
    icon,
    title,
    average,
    children,
    averageSuffix,
    averageSubtitle,
    averageSuffixText,
    ...rest
  } = props;

  const { colors } = useTheme();

  const $averageStyle: TextStyle = {
    ...fontSizes.lg,
    color: colors.primary,
    fontWeight: fontWeights.semiBold,
  };

  const $averageSuffixStyle: TextStyle = {
    ...fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.semiBold,
  };

  const $container: ViewStyle = {
    backgroundColor: colors.white100,
    padding: spacing.sm,
    borderRadius: radius.lg,
    marginHorizontal: spacing.xxxs,
    marginVertical: spacing.xxs,
    ...Platform.select({
      ios: {
        shadowColor: colors.black500,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: radius.xs,
      },
    }),
  };

  const $headingRom: TextStyle = {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  };

  const $valueContainer: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'flex-start',
  };

  const $mainRow: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  return (
    <View style={$container} {...rest}>
      <View style={$mainRow}>
        <View style={$valueContainer}>
          <View style={$headingRom}>
            {icon}
            <Text preset="subHeading" text={title} size="sm" />
          </View>
          <RNText style={$averageStyle}>
            {average}
            {averageSuffixText && <RNText style={$averageSuffixStyle}>{averageSuffixText}</RNText>}
            {averageSuffix}
          </RNText>
          <Text text={averageSubtitle} preset="extraSmall" />
        </View>
        <View>{children}</View>
      </View>
    </View>
  );
}

/**
 * The display name of the `GraphCard` component.
 * @type {string}
 */
GraphCard.displayName = 'GraphCard';

export default GraphCard;
