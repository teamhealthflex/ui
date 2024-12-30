import { render } from '@tests/setup';
import { Animated } from 'react-native';

import Text from '@components/text';
import { CircularProgress } from './index';

describe('CircularProgress Component', () => {
  it('renders with default props', () => {
    const { getByText } = render(<CircularProgress centerText="50%" />);

    expect(getByText('50%')).toBeTruthy();
  });

  it('renders with custom size and stroke width', () => {
    const { toJSON } = render(<CircularProgress size={150} strokeWidth={20} />);
    const tree = toJSON();
    const rootView = tree;

    expect(rootView.props.style).toContainEqual({
      width: 150,
      height: 150,
    });
  });

  it('renders with animated progress', () => {
    const animatedValue = new Animated.Value(75);
    const { toJSON } = render(<CircularProgress progress={animatedValue} />);
    const tree = toJSON();
    const svgGroup = tree.children[0].children[0];
    const animatedCircle = svgGroup.children.find(
      (child: { type: string; props: { strokeDasharray: undefined } }) =>
        child.type === 'RNSVGCircle' && child.props.strokeDasharray !== undefined,
    );

    expect(animatedCircle).toBeTruthy();
    expect(animatedCircle.props.strokeDashoffset).toBeDefined();
  });

  it('renders with custom colors', () => {
    const primaryColor = 'red';
    const secondaryColor = 'green';
    const { toJSON } = render(
      <CircularProgress primaryColor={primaryColor} secondaryColor={secondaryColor} />,
    );
    const tree = toJSON();
    const svgGroup = tree.children[0].children[0];
    const defs = svgGroup.children.find((child: { type: string }) => child.type === 'RNSVGDefs');
    const gradient = defs.children[0];

    expect(gradient).toBeTruthy();
    expect(gradient.props.gradient[0]).toBe(0);
    expect(gradient.props.gradient[2]).toBe(1);
  });

  it('renders custom center text', () => {
    const { getByText } = render(<CircularProgress centerText="Loading..." />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders children correctly', () => {
    const CustomChild = () => <Text>Custom Content</Text>;
    const { getByText } = render(
      <CircularProgress>
        <CustomChild />
      </CircularProgress>,
    );

    expect(getByText('Custom Content')).toBeTruthy();
  });

  it('applies custom text styles', () => {
    const customStyle = { color: 'blue', fontSize: 24 };
    const { getByText } = render(
      <CircularProgress centerTextStyle={customStyle} centerText="Styled Text" />,
    );
    const textComponent = getByText('Styled Text');

    expect(textComponent.props.style).toContainEqual(customStyle);
  });

  it('renders with background stroke color', () => {
    const backgroundStrokeColor = '#E5E7EB';
    const { toJSON } = render(<CircularProgress backgroundStrokeColor={backgroundStrokeColor} />);
    const tree = toJSON();
    const svgGroup = tree.children[0].children[0];
    const backgroundCircle = svgGroup.children.find(
      (child: { type: string; props: { strokeDasharray: any } }) =>
        child.type === 'RNSVGCircle' && !child.props.strokeDasharray,
    );

    expect(backgroundCircle).toBeTruthy();

    expect(backgroundCircle.props.stroke.payload).toBeDefined();
  });
});
