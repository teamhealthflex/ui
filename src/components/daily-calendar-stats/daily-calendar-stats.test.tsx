// #TODO: Tests not implemented due to jest mock issues for expo-linear-gradient

import { render, fireEvent } from '@tests/setup';

import { Text } from '@components';
import { DailyCalendarStats } from './index';

describe('DailyCalendarStats Component', () => {
  const days = [
    { day: 'Mon', date: '1', checked: true },
    { day: 'Tue', date: '2', checked: false },
    { day: 'Wed', date: '3', checked: true },
    { day: 'Thu', date: '4', checked: false },
    { day: 'Fri', date: '5', checked: true },
    { day: 'Sat', date: '6', checked: false },
    { day: 'Sun', date: '7', checked: false },
  ];

  const footerMessages = ['Great! You’ve exercised 5 days!', 'Keep up the good work!'];

  it('renders all days passed as props', () => {
    const { getByText } = render(
      <DailyCalendarStats days={days} footerMessages={footerMessages} />,
    );

    days.forEach(({ day, date }) => {
      expect(getByText(day)).toBeTruthy();
      expect(getByText(date)).toBeTruthy();
    });
  });

  it('renders the correct state for checked and unchecked days', () => {
    const { getByText } = render(
      <DailyCalendarStats days={days} footerMessages={footerMessages} />,
    );

    days.forEach(({ day, checked }) => {
      const dayElement = getByText(day);

      if (checked) {
        expect(dayElement.props.style).toContainEqual(expect.objectContaining({ color: 'green' }));
      } else {
        expect(dayElement.props.style).toContainEqual(expect.objectContaining({ color: 'grey' }));
      }
    });
  });

  it('renders footer messages', () => {
    const { getByText } = render(
      <DailyCalendarStats days={days} footerMessages={footerMessages} />,
    );

    footerMessages.forEach((message) => {
      expect(getByText(message)).toBeTruthy();
    });
  });

  it('renders no days message when days prop is empty', () => {
    const noDaysMessage = 'No data for this week.';
    const { getByText } = render(
      <DailyCalendarStats
        days={[]}
        footerMessages={footerMessages}
        noDaysMessage={noDaysMessage}
      />,
    );

    expect(getByText(noDaysMessage)).toBeTruthy();
  });

  it('handles press events on individual days', () => {
    const onDayPressMock = jest.fn();
    const { getByText } = render(
      <DailyCalendarStats
        days={days.map((day) => ({ ...day, onPress: () => onDayPressMock(day) }))}
        footerMessages={footerMessages}
      />,
    );

    const dayToPress = days[0];
    fireEvent.press(getByText(dayToPress?.day!));

    expect(onDayPressMock).toHaveBeenCalledWith(dayToPress);
  });

  it('renders custom components for days', () => {
    const CustomDayComponent = ({ day }: { day: string }) => (
      <Text testID={`custom-${day}`}>{day}</Text>
    );
    const { getByTestId } = render(
      <DailyCalendarStats
        days={days.map((day) => ({
          ...day,
          CustomDayComponent: <CustomDayComponent day={day.day} />,
        }))}
        footerMessages={footerMessages}
      />,
    );

    days.forEach(({ day }) => {
      expect(getByTestId(`custom-${day}`)).toBeTruthy();
    });
  });

  it('applies style overrides correctly', () => {
    const customStyle = { backgroundColor: 'blue' };
    const { getByText } = render(
      <DailyCalendarStats days={days} footerMessages={footerMessages} style={customStyle} />,
    );

    const dayElement = getByText(days[0]?.day!);
    expect(dayElement.props.style).toContainEqual(customStyle);
  });
});
