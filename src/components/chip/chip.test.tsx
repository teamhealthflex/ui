import { render } from '@tests/setup';

import { Chip } from './index';
import { spacing } from '@theme';
import Text from '@components/text';

describe('Chip Component', () => {
  it('renders text passed as prop', () => {
    const { getByText } = render(<Chip text="Hello Chip" />);

    expect(getByText('Hello Chip')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByText } = render(
      <Chip>
        <Text text="Nested Chip" />
      </Chip>,
    );

    expect(getByText('Nested Chip')).toBeTruthy();
  });

  it('applies default size', () => {
    const { getByTestId } = render(<Chip text="Default Size Chip" testID="chip" />);
    const chipComponent = getByTestId('chip');

    expect(chipComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        }),
      ]),
    );
  });

  it('applies specific size', () => {
    const { getByTestId } = render(<Chip text="Large Chip" size="lg" testID="chip" />);
    const chipComponent = getByTestId('chip');

    expect(chipComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        }),
      ]),
    );
  });

  it('applies specific preset', () => {
    const { getByTestId } = render(<Chip text="Success Chip" preset="success" testID="chip" />);
    const chipComponent = getByTestId('chip');

    expect(chipComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderColor: '#80E680',
          backgroundColor: '#E6F9E6',
        }),
      ]),
    );
  });

  it('applies outline variant', () => {
    const { getByTestId } = render(<Chip text="Outlined Chip" variant="outline" testID="chip" />);
    const chipComponent = getByTestId('chip');

    expect(chipComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderWidth: 1,
        }),
      ]),
    );
  });

  it('merges custom style', () => {
    const customStyle = { backgroundColor: 'purple' };
    const { getByTestId } = render(<Chip text="Styled Chip" style={customStyle} testID="chip" />);
    const chipComponent = getByTestId('chip');

    expect(chipComponent.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)]),
    );
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(
      <Chip text="Accessible Chip" testID="test-chip" accessibilityLabel="Test Label" />,
    );
    const chipComponent = getByTestId('test-chip');

    expect(chipComponent.props.accessibilityLabel).toBe('Test Label');
  });

  it('has correct display name', () => {
    expect(Chip.displayName).toBe('Chip');
  });

  it('applies correct text color based on preset', () => {
    const { getByText } = render(<Chip text="Info Chip" preset="info" />);
    const textComponent = getByText('Info Chip');

    expect(textComponent.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: '#0284c7',
        }),
      ]),
    );
  });

  it('handles empty text properly', () => {
    const { getByTestId } = render(<Chip text="" testID="chip" />);
    const chipComponent = getByTestId('chip');

    expect(chipComponent).toBeTruthy();
  });
});
