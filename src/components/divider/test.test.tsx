import { View } from 'react-native';
import { render } from '@tests/setup';

import { Divider } from './index';

describe('Divider Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Divider testID="divider" />);
    expect(getByTestId('divider')).toBeTruthy();
  });

  it('renders horizontal divider by default', () => {
    const { getByTestId } = render(<Divider testID="divider" />);
    const divider = getByTestId('divider');

    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          height: 10,
        }),
      ]),
    );
  });

  it('renders vertical divider when type prop is set', () => {
    const { getByTestId } = render(<Divider testID="divider" type="vertical" />);
    const divider = getByTestId('divider');

    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 10,
        }),
      ]),
    );
  });

  it('renders with custom size', () => {
    const customSize = 20;
    const { getByTestId } = render(<Divider testID="divider" size={customSize} />);
    const divider = getByTestId('divider');

    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          height: customSize,
        }),
      ]),
    );
  });

  it('renders line when line prop is true', () => {
    const { getByTestId } = render(<Divider testID="divider" line />);
    const line = getByTestId('divider').findByType(View);

    expect(line).toBeTruthy();
  });

  it('does not render line when line prop is false', () => {
    const { getByTestId } = render(<Divider testID="divider" line={false} />);
    const divider = getByTestId('divider');

    expect(divider.props.children).toBeFalsy();
  });

  it('applies container style correctly', () => {
    const containerStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(<Divider testID="divider" containerStyle={containerStyle} />);
    const divider = getByTestId('divider');

    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: 'red',
        }),
      ]),
    );
  });

  it('applies style override to the line', () => {
    const lineStyle = { opacity: 0.5 };
    const { getByTestId } = render(<Divider testID="divider" line style={lineStyle} />);
    const line = getByTestId('divider').findByType(View);

    expect(line.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          opacity: 0.5,
        }),
      ]),
    );
  });

  it('has correct display name', () => {
    expect(Divider.displayName).toBe('Divider');
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(<Divider testID="divider" accessibilityLabel="Divider Line" />);

    const divider = getByTestId('divider');
    expect(divider.props.accessibilityLabel).toBe('Divider Line');
  });
});
