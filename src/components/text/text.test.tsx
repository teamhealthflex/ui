import { render } from '@tests/setup';

import { Text } from './index';
import { fontWeights } from '@theme';

describe('Text Component', () => {
  it('renders text passed as prop', () => {
    const { getByText } = render(<Text text="Hello World" />);

    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(
      <Text>
        <Text text="Nested Text" />
      </Text>,
    );

    expect(getByText('Nested Text')).toBeTruthy();
  });

  it('applies default preset', () => {
    const { getByText } = render(<Text text="Default Text" />);

    const textComponent = getByText('Default Text');
    expect(textComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: expect.any(Number),
          fontWeight: expect.any(String),
        }),
      ]),
    );
  });

  it('applies specific preset', () => {
    const { getByText } = render(<Text text="Heading" preset="heading" />);

    const textComponent = getByText('Heading');
    expect(textComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontWeight: fontWeights.bold,
        }),
      ]),
    );
  });

  it('applies custom size', () => {
    const { getByText } = render(<Text text="Large Text" size="xl" />);

    const textComponent = getByText('Large Text');
    expect(textComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: expect.any(Number),
        }),
      ]),
    );
  });

  it('applies custom weight', () => {
    const { getByText } = render(<Text text="Bold Text" weight="bold" />);

    const textComponent = getByText('Bold Text');
    expect(textComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontWeight: fontWeights.bold,
        }),
      ]),
    );
  });

  it('merges custom style', () => {
    const { getByText } = render(<Text text="Styled Text" style={{ color: 'red' }} />);

    const textComponent = getByText('Styled Text');
    expect(textComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: 'red',
        }),
      ]),
    );
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(
      <Text text="Accessible Text" testID="test-text" accessibilityLabel="Test Label" />,
    );

    const textComponent = getByTestId('test-text');
    expect(textComponent.props.accessibilityLabel).toBe('Test Label');
  });

  it('has correct display name', () => {
    expect(Text.displayName).toBe('Text');
  });
});
