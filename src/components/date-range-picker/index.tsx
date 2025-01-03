/**
 * DateRangePicker Component
 *
 * A React component that allows users to select a date range using a date picker.
 *
 * Props:
 * - payload: An object containing:
 *   - heading (optional): A string to display as the heading.
 *   - selectedStartDate (optional): The initially selected start date.
 *   - selectedEndDate (optional): The initially selected end date.
 * - onConfirm: A callback function that is called with the selected start and end dates when the user confirms their selection.
 * - onClear: A callback function that is called when the user clears the selection.
 *
 * Features:
 * - Displays a heading if provided.
 * - Allows users to select a date range.
 * - Provides confirm and clear buttons.
 *
 * Usage:
 * <DateRangePicker
 *   payload={{ heading: "Select Date Range", selectedStartDate: new Date(), selectedEndDate: new Date() }}
 *   onConfirm={(startDate, endDate) => console.log(startDate, endDate)}
 *   onClear={() => console.log("Cleared")}
 * />
 */

import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import DateTimePicker from 'react-native-ui-datepicker';
import { TextStyle, View, ViewStyle } from 'react-native';

import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { useCustomStyles } from '@theme';
import { Button } from '@teamhealthflex/ui';

export interface DateRangePickerProps {
  payload: {
    heading?: string;
    selectedStartDate?: Date;
    selectedEndDate?: Date;
  };
  onClear: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
}

export function DateRangePicker(props: DateRangePickerProps) {
  const { payload, onConfirm, onClear } = props;

  const { selectedStartDate, selectedEndDate } = payload || {};

  const { colors } = useTheme();
  const { styles } = useCustomStyles();

  // Defining states
  const [startDate, setStartDate] = React.useState<Dayjs | undefined>(
    selectedStartDate ? dayjs(selectedStartDate) : undefined,
  );
  const [endDate, setEndDate] = React.useState<Dayjs | undefined>(
    selectedEndDate ? dayjs(selectedEndDate) : undefined,
  );

  React.useEffect(() => {
    if (selectedStartDate) {
      setStartDate(dayjs(selectedStartDate));
    }
    if (selectedEndDate) {
      setEndDate(dayjs(selectedEndDate));
    }
  }, [selectedStartDate, selectedEndDate]);

  const handleConfirm = React.useCallback(() => {
    if (startDate && endDate) {
      onConfirm(startDate.toDate(), endDate.toDate());
      return; // early return
    }
    onConfirm(dayjs().toDate(), dayjs().toDate());
  }, [onConfirm, startDate, endDate]);

  const handleClear = React.useCallback(() => {
    setStartDate(dayjs()); // Set start date to the current present date
    setEndDate(undefined);
    onClear();
  }, [onClear]);

  if (!payload) {
    return null;
  }

  const $calendarTextStyle: TextStyle = {
    color: colors.primary300,
  };

  return (
    <View style={$dateContainer}>
      <View style={$container}>
        <DateTimePicker
          mode="range"
          locale="en-IN"
          maxDate={dayjs()}
          endDate={endDate}
          startDate={startDate}
          displayFullDays={true}
          headerTextStyle={$calendarTextStyle}
          calendarTextStyle={$calendarTextStyle}
          weekDaysTextStyle={$calendarTextStyle}
          selectedItemColor={colors.primary500}
          onChange={({ startDate: newStartDate, endDate: newEndDate }) => {
            setStartDate(newStartDate as Dayjs);
            setEndDate(newEndDate as Dayjs);
          }}
        />
      </View>
      <View style={[styles.row, $buttonContainer]}>
        <Button size="small" onPress={handleConfirm} style={$button}>
          Confirm
        </Button>

        <Button size="small" preset="reversed" style={$button} onPress={handleClear}>
          Clear
        </Button>
      </View>
    </View>
  );
}

const $dateContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.xs,
};

const $container: ViewStyle = {
  marginBottom: spacing.xxs,
};

const $buttonContainer: ViewStyle = {
  marginVertical: spacing.xxs,
  marginHorizontal: spacing.sm,
  justifyContent: 'space-between',
};

const $button: ViewStyle = {
  flex: 1,
  marginTop: spacing.xxs,
};

/**
 * The display name of the `DateRangePicker` component.
 * @type {string}
 */
DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
