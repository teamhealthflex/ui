import { render } from '@tests/setup';
import { View, ViewStyle } from 'react-native';

import { Button } from './index';

describe('Button Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Button testID="button" />);
    expect(getByTestId('button')).toBeTruthy();
  });

  const flattenStyle = (style: any): ViewStyle[] => {
    if (Array.isArray(style)) {
      return style.flatMap((s) => (Array.isArray(s) ? s : [s]));
    }
    return [style].filter(Boolean);
  };

  it('renders with default size and preset', () => {
    const { getByTestId } = render(<Button testID="button" />);
    const button = getByTestId('button');
    const flattenedStyle = flattenStyle(button.props.style);

    const hasMinHeight = flattenedStyle.some(
      (style: ViewStyle) => style.minHeight === 40 || style.minHeight === 44,
    );
    expect(hasMinHeight).toBe(true);
  });

  it('renders with custom size', () => {
    const { getByTestId } = render(<Button testID="button" size="large" />);
    const button = getByTestId('button');
    const flattenedStyle = flattenStyle(button.props.style);

    expect(flattenedStyle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          minHeight: 48,
        }),
      ]),
    );
  });

  it('renders with filled preset', () => {
    const { getByTestId } = render(<Button testID="button" preset="filled" />);
    const button = getByTestId('button');
    const flattenedStyle = flattenStyle(button.props.style);

    const hasBorderWidth = flattenedStyle.some((style: ViewStyle) => style.borderWidth === 1);
    expect(hasBorderWidth).toBe(true);
  });

  it('renders loading state', () => {
    const { getByTestId } = render(<Button testID="button" loading />);
    expect(getByTestId('button')).toBeTruthy();
  });

  it('renders disabled state', () => {
    const { getByTestId } = render(<Button testID="button" disabled />);
    const button = getByTestId('button');

    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(<Button testID="button" style={customStyle} />);
    const button = getByTestId('button');
    const flattenedStyle = flattenStyle(button.props.style);

    expect(flattenedStyle).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: 'red',
        }),
      ]),
    );
  });

  it('renders with left accessory', () => {
    const LeftAccessory = () => <View testID="left-accessory" />;
    const { getByTestId } = render(<Button testID="button" LeftAccessory={LeftAccessory} />);

    expect(getByTestId('left-accessory')).toBeTruthy();
  });

  it('renders with right accessory', () => {
    const RightAccessory = () => <View testID="right-accessory" />;
    const { getByTestId } = render(<Button testID="button" RightAccessory={RightAccessory} />);

    expect(getByTestId('right-accessory')).toBeTruthy();
  });

  it('has correct display name', () => {
    expect(Button.name).toBe('Button');
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(<Button testID="button" accessibilityLabel="Button Label" />);
    const button = getByTestId('button');

    expect(button.props.accessibilityLabel).toBe('Button Label');
  });
});
