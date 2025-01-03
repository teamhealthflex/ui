import { View, Pressable, StyleProp, ViewStyle, Text, TextStyle } from 'react-native';

import { useTheme } from '@contexts';
import { fontSizes, radius, spacing, useCustomStyles } from '@theme';
import { MultiValueProgressBar, Progress } from '@teamhealthflex/ui';

export interface DataValueCardProps {
  title: string;
  onPress?: () => void;
  data: Array<DataValueProps>;
  style?: StyleProp<ViewStyle>;
}

export interface DataValueProps {
  label: string;
  valueLabel?: string;
  total?: number;
  achieved?: number;
  isPercentage?: boolean;
  isDegrees?: boolean;
  isMultiValue?: boolean;
  multiValueProgress?: {
    value1: number;
    value2?: number;
    value3?: number;
  };
  multiValueProgressBarStyles?: {
    value1Style?: StyleProp<ViewStyle>;
    value2Style?: StyleProp<ViewStyle>;
    value3Style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
  };
  progressBarStyles?: StyleProp<ViewStyle>;
}

export function DataValueCard(props: DataValueCardProps) {
  const { style = {}, onPress, data, title, ...rest } = props;

  const { colors } = useTheme();
  const { styles } = useCustomStyles();

  const $title: TextStyle = {
    ...fontSizes.md,
    color: colors.primary,
    marginTop: -spacing.xxs,
  };

  const $dataValueCard: ViewStyle = {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: '#EBFDFF',
  };

  const $valueContainer: ViewStyle = {
    marginTop: spacing.xs,
  };

  const $progressContainer: ViewStyle = {
    flex: 1,
    marginVertical: spacing.xs,
  };

  const $values: TextStyle = {
    ...fontSizes.xs,
    marginTop: spacing.sm,
    color: colors.black500,
  };

  const $label: TextStyle = {
    ...fontSizes.sm,
    marginTop: spacing.sm,
    color: colors.black500,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        $dataValueCard,
        {
          backgroundColor: pressed && onPress ? colors.white100 : colors.success100,
        },
        style,
      ]}
      onPress={onPress}
      {...rest}
    >
      <Text style={$title}>{title}</Text>
      {data.map((item, index) => {
        const achieved = item?.achieved;
        const total = item?.total;
        return (
          <View key={`${item.label}-${index}`} style={$valueContainer}>
            <View style={styles.row}>
              <Text style={$label}>{item.label}</Text>
              <View style={styles.spacer} />
              <Text style={$values}>
                {item.isDegrees
                  ? `${Math.ceil(achieved!)} ${item.valueLabel ?? 'Degrees'}`
                  : item.isPercentage
                    ? `${total !== 0 ? Math.ceil((achieved! / total!) * 100) : 0}%`
                    : `${Math.ceil(achieved!)}/${Math.ceil(total!)} ${item.valueLabel}`}
              </Text>
            </View>
            <View style={$progressContainer}>
              {item.isMultiValue && item.multiValueProgress ? (
                <MultiValueProgressBar
                  value1={item.multiValueProgress.value1}
                  value2={item.multiValueProgress.value2}
                  value3={item.multiValueProgress.value3}
                  value1Style={item.multiValueProgressBarStyles?.value1Style}
                  value2Style={item.multiValueProgressBarStyles?.value2Style}
                  value3Style={item.multiValueProgressBarStyles?.value3Style}
                  progressBarStyles={item.multiValueProgressBarStyles?.containerStyle}
                />
              ) : (
                <Progress
                  h={12}
                  steps={100}
                  step={total === 0 ? 0 : Math.ceil((achieved! / total!) * 100)}
                  style={item.progressBarStyles}
                />
              )}
            </View>
          </View>
        );
      })}
    </Pressable>
  );
}

/**
 * The display name of the `DataValueCard` component.
 * @type {string}
 */
DataValueCard.displayName = 'DataValueCard';

export default DataValueCard;
