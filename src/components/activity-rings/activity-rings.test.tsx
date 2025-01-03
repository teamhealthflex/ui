import { render } from '@tests/setup';
import { Text, StyleSheet } from 'react-native';

import { ActivityRing } from './index';

const getFlattenedStyle = (style: any[]) => {
  if (!style || (Array.isArray(style) && style.length === 0)) return {};
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map((s) => StyleSheet.flatten(s || {})));
  }
  return StyleSheet.flatten(style || {});
};

describe('ActivityRing Component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    const rings = [{ value: 50, legendText: 'Ring 1' }];
    const defaultStyle = { color: 'black' };

    const { getByTestId } = render(
      <ActivityRing rings={rings} radius={100} textStyle={defaultStyle} testID="ring" />,
    );

    const ringComponent = getByTestId('ring');

    expect(ringComponent).toBeTruthy();
  });

  it('renders legends with correct styles and values', () => {
    const rings = [
      { value: 45, legendText: 'Steps' },
      { value: 75, legendText: 'Calories' },
    ];
    const { getByText } = render(<ActivityRing rings={rings} radius={100} />);

    expect(getByText('Steps')).toBeTruthy();
    expect(getByText('Calories')).toBeTruthy();
    expect(getByText('45.00%')).toBeTruthy();
    expect(getByText('75.00%')).toBeTruthy();
  });

  it('renders multiple rings with custom styles', () => {
    const rings = [
      { value: 60, legendText: 'Ring1' },
      { value: 40, legendText: 'Ring2' },
    ];
    const customStyle = { fontSize: 14 };

    const { getByText } = render(
      <ActivityRing rings={rings} radius={120} textStyle={customStyle} />,
    );

    expect(getByText('Ring1')).toBeTruthy();
    expect(getByText('Ring2')).toBeTruthy();
  });

  it('renders the title and children correctly', () => {
    const { getByTestId, getByText } = render(
      <ActivityRing
        rings={[{ value: 70, legendText: 'Ring 1' }]}
        title="Activity Progress"
        radius={100}
        testID="ring"
      >
        <Text>Custom Child</Text>
      </ActivityRing>,
    );
    const ringComponent = getByTestId('ring');

    expect(ringComponent).toBeTruthy();
    expect(getByText('Custom Child')).toBeTruthy();
  });

  it('applies animated progress values correctly', () => {
    const rings = [
      { value: 70, legendText: 'Ring 1' },
      { value: 30, legendText: 'Ring 2' },
    ];

    const { getByTestId } = render(
      <>
        {rings.map((ring, index) => (
          <ActivityRing
            key={index}
            rings={[ring]}
            radius={150}
            testID={`circular-progress-${index}`}
          />
        ))}
      </>,
    );

    jest.advanceTimersByTime(1000);

    const animatedCircle1 = getByTestId('circular-progress-0');
    const animatedCircle2 = getByTestId('circular-progress-1');

    expect(animatedCircle1).toBeTruthy();
    expect(animatedCircle2).toBeTruthy();
  });

  it('renders with custom text and title styles', () => {
    const titleStyle = { color: 'red', fontSize: 20 };
    const textStyle = { color: 'blue', fontSize: 14 };
    const rings = [{ value: 60, legendText: 'Ring 1' }];

    const { getByText } = render(
      <ActivityRing
        rings={rings}
        title="Custom Title"
        titleStyle={titleStyle}
        textStyle={textStyle}
        radius={100}
        testID="ring"
      />,
    );

    const title = getByText('Custom Title');
    const flattenedTitleStyle = getFlattenedStyle(title.props.style);

    expect(flattenedTitleStyle).toEqual(expect.objectContaining(titleStyle));
  });
});
