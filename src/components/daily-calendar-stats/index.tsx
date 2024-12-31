import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, ViewStyle, TextStyle, ViewProps } from 'react-native';

import { Text } from '../text';
import { useTheme } from '@contexts';
import { radius, spacing, fontWeights } from '@theme';

/**
 * Interface for the properties of a single day item in the calendar.
 */
export interface DayItemProps {
  /**
   * The day of the week (e.g., "Mon", "Tue").
   */
  day: string;

  /**
   * The specific date (e.g., "2023-10-01").
   */
  date: string;

  /**
   * Indicates whether the day is checked (marked as completed or active).
   */
  checked: boolean;
}

/**
 * Interface for the properties of the DailyCalendarStats component.
 * Extends `ViewProps` to include additional styling and functionality.
 */
export interface DailyCalendarStatsProps extends ViewProps {
  /**
   * An array of `DayItemProps` representing the days to display in the calendar.
   */
  days: DayItemProps[];

  /**
   * A message to display when no days are provided.
   * Defaults to "No weekly status found!".
   */
  noDaysMessage?: string;

  /**
   * An array of messages to display in the footer section.
   */
  footerMessages?: string[];
}

/**
 * A component that represents a single day item in the calendar.
 * Displays the day, date, and an icon based on the `checked` status.
 */
export function DayItem(props: DayItemProps) {
  const { day, date, checked, ...rest } = props;

  const { colors } = useTheme();

  const $container: ViewStyle = {
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: checked ? colors.primary : '#acebdc',
  };

  const $dayText: TextStyle = {
    color: checked ? colors.white100 : colors.primary,
  };

  const $dateText: TextStyle = {
    marginBottom: spacing.sm,
    color: checked ? colors.white100 : colors.primary,
  };

  const $iconStyle: TextStyle = {
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    color: checked ? colors.white100 : colors.primary,
    backgroundColor: checked ? colors.primary100 : '#ccf3ec',
  };

  return (
    <View style={$container} {...rest}>
      <Text size="xxs" style={$dayText}>
        {day}
      </Text>
      <Text size="xxs" style={$dateText}>
        {date}
      </Text>
      <Ionicons name={checked ? 'checkmark' : 'remove'} size={18} style={$iconStyle} />
    </View>
  );
}

/**
 * A component that displays a calendar with daily statistics.
 * It shows the days of the week, their status, and optional footer messages.
 */
export function DailyCalendarStats(props: DailyCalendarStatsProps) {
  const { days, noDaysMessage = 'No weekly status found!', footerMessages = [], ...rest } = props;

  const { colors } = useTheme();

  const $container: ViewStyle = {
    flex: 3,
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderRadius: radius.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  };

  const $title: TextStyle = {
    color: colors.primary,
    marginBottom: spacing.sm,
    fontWeight: fontWeights.semiBold,
  };

  const $daysContainer: ViewStyle = {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    justifyContent: 'space-between',
  };

  const $noDaysContainer: TextStyle = {
    textAlign: 'center',
    padding: spacing.xs,
  };

  const $footer: TextStyle = {
    marginTop: spacing.md,
  };

  const $footerText: TextStyle = {
    textAlign: 'center',
    color: colors.primary,
    marginVertical: spacing.xxs,
    fontWeight: fontWeights.normal,
  };

  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <LinearGradient
      colors={['#74d9d0', '#74e8af', '#77f595']}
      start={[0, 1]}
      end={[1, 0]}
      style={$container}
      {...rest}
    >
      {days.length === 0 ? (
        <View style={$noDaysContainer}>
          <Text>{noDaysMessage}</Text>
        </View>
      ) : (
        <>
          <Text preset="subHeading" style={$title}>
            {monthName} {year}
          </Text>
          <View style={$daysContainer}>
            {days.map((item, index) => (
              <DayItem
                key={index.toString()}
                day={item.day}
                date={item.date}
                checked={item.checked}
              />
            ))}
          </View>
        </>
      )}

      {/* Footer Section */}
      {footerMessages.length > 0 && (
        <View style={$footer}>
          {footerMessages.map((message, index) => (
            <Text key={index.toString()} style={$footerText}>
              <Ionicons name="thumbs-up" size={16} color={'#FFDB58'} /> {message}
            </Text>
          ))}
        </View>
      )}
    </LinearGradient>
  );
}

/**
 * The display name of the `DayItem` component.
 * @type {string}
 */
DayItem.displayName = 'DayItem';

/**
 * The display name of the `DailyCalendarStats` component.
 * @type {string}
 */
DailyCalendarStats.displayName = 'DailyCalendarStats';

export default DailyCalendarStats;
