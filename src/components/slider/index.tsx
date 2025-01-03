import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSharedValue } from 'react-native-reanimated';
import { Slider as AwesomeSlider } from 'react-native-awesome-slider';

import { useTheme } from '@contexts';
import { radius, spacing } from '@theme';

/**
 * Slider component is a custom slider component that uses the react-native-awesome-slider library.
 * SliderProps interface defines the properties for the SliderComponent.
 */
export interface SliderProps {
  /**
   * The minimum value of the slider. Default is 0.
   */
  min?: number;
  /**
   * The maximum value of the slider. Default is 100.
   */
  max?: number;
  /**
   * The step value of the slider. Default is 1.
   */
  step?: number;
  /**
   * The callback function that is called when the value of the slider changes.
   */
  onValueChange: (value: number) => void;
}

/**
 * SliderComponent is a customizable slider component that allows users to select a value within a specified range.
 * It uses a linear gradient for the track and provides a thumb for user interaction.
 *
 * @param {SliderProps} props - The properties for the slider component.
 * @returns {JSX.Element} The rendered slider component.
 */
export function Slider(props: SliderProps) {
  const { min = 0, max = 100, step = 1, onValueChange, ...rest } = props;

  const { colors } = useTheme();

  const progress = useSharedValue(min);
  const sharedMin = useSharedValue(min);
  const sharedMax = useSharedValue(max);

  /**
   * handleValueChange is a callback function that rounds the value and calls the onValueChange prop.
   *
   * @param {number} value - The current value of the slider.
   */
  const handleValueChange = (value: number) => {
    onValueChange(Math.round(value));
  };

  const $container: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const $sliderTrack: ViewStyle = {
    width: '100%',
    height: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.xxxs,
    borderRadius: radius['2xl'],
  };

  const $gradientBackground: ViewStyle = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    borderRadius: radius['2xl'],
  };

  const $thumb: ViewStyle = {
    width: spacing.lg,
    height: spacing.lg,
    borderWidth: spacing.xxxs,
    borderColor: colors.primary,
    borderRadius: spacing.lg / 2,
    backgroundColor: colors.white200,
  };

  const $mark: ViewStyle = {
    opacity: 0,
  };

  return (
    <View style={$container} {...rest}>
      <View style={$sliderTrack}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={$gradientBackground}
          colors={[colors.success300, colors.warning400, colors.danger500]}
        />
        <AwesomeSlider
          steps={step}
          sliderHeight={0}
          markStyle={$mark}
          progress={progress}
          thumbWidth={spacing.lg}
          minimumValue={sharedMin}
          maximumValue={sharedMax}
          renderBubble={() => null}
          onValueChange={handleValueChange}
          renderThumb={() => <View style={$thumb} />}
        />
      </View>
    </View>
  );
}

/**
 * The display name of the `Slider` component.
 * @type {string}
 */
Slider.displayName = 'Slider';

export default Slider;
