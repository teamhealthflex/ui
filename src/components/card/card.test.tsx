import { render, fireEvent } from '@tests/setup';

import { Card } from './index';
import { Text } from '@components';

describe('Card Component', () => {
  it('renders heading passed as prop', () => {
    const { getByText } = render(<Card heading="Hello Card" />);

    expect(getByText('Hello Card')).toBeTruthy();
  });

  it('renders content passed as prop', () => {
    const { getByText } = render(<Card content="This is the content of the card." />);

    expect(getByText('This is the content of the card.')).toBeTruthy();
  });

  it('renders footer passed as prop', () => {
    const { getByText } = render(<Card footer="Footer text" />);

    expect(getByText('Footer text')).toBeTruthy();
  });

  it('renders with active state', () => {
    const { getByText } = render(
      <Card heading="Active Card" defaultStyle={{ backgroundColor: 'light blue' }} />,
    );
    const heading = getByText('Active Card');

    expect(heading).toBeTruthy();
  });

  it('renders content with vertical alignment', () => {
    const { getByText } = render(<Card content="Content" verticalAlignment="center" />);
    const content = getByText('Content');

    expect(content).toBeTruthy();
  });

  it('renders custom heading component', () => {
    const CustomHeading = () => <Text testID="custom-heading">Custom Heading</Text>;
    const { getByTestId } = render(<Card HeadingComponent={<CustomHeading />} />);

    expect(getByTestId('custom-heading')).toBeTruthy();
  });

  it('renders custom content component', () => {
    const CustomContent = () => <Text>Custom Content</Text>;
    const { getByText } = render(<Card ContentComponent={<CustomContent />} />);

    expect(getByText('Custom Content')).toBeTruthy();
  });

  it('renders custom footer component', () => {
    const CustomFooter = () => <Text>Custom Footer</Text>;
    const { getByText } = render(<Card FooterComponent={<CustomFooter />} />);

    expect(getByText('Custom Footer')).toBeTruthy();
  });

  it('renders LeftComponent correctly', () => {
    const LeftComponent = () => <Text>Left</Text>;
    const { getByText } = render(<Card LeftComponent={<LeftComponent />} />);

    expect(getByText('Left')).toBeTruthy();
  });

  it('renders RightComponent correctly', () => {
    const RightComponent = () => <Text>Right</Text>;
    const { getByText } = render(<Card RightComponent={<RightComponent />} />);

    expect(getByText('Right')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Card heading="Press Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('applies style overrides', () => {
    const { getByText } = render(<Card heading="Styled Card" headingStyle={{ color: 'red' }} />);
    const heading = getByText('Styled Card');

    const styles = heading.props.style;

    const hasRedColor = styles.some(
      (style: { color?: string }) =>
        style &&
        (style.color === 'red' ||
          (Array.isArray(style) && style.some((innerStyle) => innerStyle.color === 'red'))),
    );

    expect(hasRedColor).toBe(true);
  });
});
