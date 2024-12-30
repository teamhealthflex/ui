import React from 'react';
import { View, StyleProp, ViewStyle, TextStyle, Text, Animated } from 'react-native';

import { useTheme } from '@contexts';
import CircularProgress from '../circular-progress';
import { fontSizes, fontWeights, radius, spacing } from '@theme';
import { toTitleCase } from '../../resources/utils';

export interface RingConfig {
  /**
   * The progress value of the ring, typically between 0 and 100.
   */
  value: number;

  /**
   * The color of the active stroke in the ring (i.e., the progress portion).
   */
  activeStrokeColor?: string;

  /**
   * The secondary color of the active stroke in the ring (forms gradients) .
   */
  activeStrokeSecondaryColor?: string;

  /**
   * The color of the inactive stroke in the ring (i.e., the background portion).
   */
  inActiveStrokeColor?: string;

  /**
   * The width of the active stroke in the ring.
   */
  activeStrokeWidth?: number;

  /**
   * The width of the inactive stroke in the ring.
   */
  inActiveStrokeWidth?: number;

  /**
   * The opacity of the inactive stroke in the ring.
   */
  inActiveStrokeOpacity?: number;

  /**
   * The text that describes the legend for this ring, displayed in the color legend.
   */
  legendText: string;
}

export interface ActivityRingProps {
  /**
   * Array of ring configurations, where each ring can have different progress, colors, and widths.
   */
  rings: RingConfig[];

  /**
   * The radius of the outermost ring in the circular progress component.
   */
  radius: number;

  /**
   * Title displayed above the rings.
   */
  title?: string;

  /**
   * The style applied to the progress value displayed within the ring.
   */
  progressValueStyle?: StyleProp<TextStyle>;

  /**
   * The child components or content to be displayed within the innermost ring.
   */
  children?: React.ReactNode;

  /**
   * Additional styles to be applied to the circular progress ring component.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Styles applied to the outer container view that wraps the progress ring.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Controls whether the value text inside the progress ring is visible.
   * If true, the value text will be shown. If false, the value text is hidden.
   * Defaults to false.
   */
  showValueText?: boolean;

  /**
   * Styles applied to any text displayed inside the progress ring.
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Styles applied to the title text displayed above the ring.
   */
  titleStyle?: StyleProp<TextStyle>;
}

/**
 * A customizable circular progress component that can display multiple rings with separate configurations.
 * Includes an optional title and a color legend to identify each ring.
 *
 * @param {ActivityRingProps} props - The props for configuring the `ActivityRing` component.
 *
 * @returns {JSX.Element} The rendered `ActivityRing` component.
 */
export function ActivityRing({
  rings,
  title,
  children,
  textStyle,
  titleStyle,
  containerStyle,
  progressValueStyle,
  showValueText = false,
  radius: activityRingRadius,
  ...rest
}: ActivityRingProps): JSX.Element {
  const { colors } = useTheme();

  const $wrapper: ViewStyle = {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };
  const $container: ViewStyle = {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  };
  const $title: TextStyle = {
    ...fontSizes.lg,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontWeight: fontWeights.bold,
  };
  const $legendContainer: ViewStyle = {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderRadius: radius.md,
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
    justifyContent: 'space-between',
    backgroundColor: colors.white100,
  };
  const $legendItem: TextStyle = {
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: spacing.xxxs,
    marginBottom: spacing.xs,
    justifyContent: 'flex-start',
  };
  const $textContainer: ViewStyle = {
    maxWidth: '80%',
    flexWrap: 'wrap',
    marginLeft: radius.sm,
    flexDirection: 'column',
  };
  const $colorDot: TextStyle = {
    width: spacing.md,
    marginRight: radius.md,
    borderRadius: radius.md,
    height: spacing.sm * 1.3, // as per business requirements
  };
  const $legendText: TextStyle = {
    ...fontSizes.sm,
    color: colors.primary300,
  };
  const $valueText: TextStyle = {
    ...fontSizes.xs,
    marginTop: spacing.xxxs,
    color: colors.primary200,
  };

  const combinedStyle: StyleProp<ViewStyle> = [$container, containerStyle];

  /*
   * Default colors for active stroke colors
   */
  const defaultColors = [
    colors.gradient300,
    colors.gradient200,
    colors.warning300,
    colors.danger300,
  ];

  /**
   * Secondary default colors for activity rings (for gradients)
   */
  const secondaryDefaultColors = [colors.gradient100, colors.primary300, 'orange', 'pink'];

  const MAX_VALUE = 100;

  /*
   * Assign default colors if not specified
   */
  const updatedRings = rings.map((ring, index) => {
    const cappedValue = Math.min(ring.value ?? 0, MAX_VALUE);

    const activeColor = ring.activeStrokeColor || defaultColors[index % defaultColors.length];
    const secondaryActiveColor =
      ring.activeStrokeSecondaryColor || secondaryDefaultColors[index % defaultColors.length];
    return {
      ...ring,
      value: cappedValue,
      activeStrokeColor: activeColor,
      activeStrokeSecondaryColor: secondaryActiveColor,
      inActiveStrokeColor: ring.inActiveStrokeColor || colors.black100,
    };
  });

  const numRings = updatedRings.length;

  /**
   * Defining the smallest possible radius.
   */
  const smallestRadius = activityRingRadius / (numRings + 1);

  /**
   * Dynamically calculate radii for each ring.
   */
  const ringRadii = Array.from(
    { length: numRings },
    (_, i) => smallestRadius + i * smallestRadius + spacing.md,
  );

  /**
   * Each ring animates its progress value over a duration of 1000 milliseconds.
   */
  const animatedValues = React.useRef<Animated.Value[]>([]).current;

  React.useEffect(() => {
    animatedValues.length = 0;
    updatedRings.forEach(() => {
      animatedValues.push(new Animated.Value(0));
    });

    if (animatedValues.length !== updatedRings.length) {
      throw new Error('animatedValues length does not match updatedRings length');
    }

    const animations = updatedRings.map((ring, index) => {
      const animatedValue = animatedValues[index];
      if (!animatedValue) {
        throw new Error(`animatedValue at index ${index} is undefined`);
      }

      return Animated.timing(animatedValue, {
        toValue: ring.value,
        duration: 1000,
        useNativeDriver: true,
      });
    });

    const animation = Animated.stagger(100, animations);
    animation.start();

    /**
     * Cleanup function to stop animations when the component unmounts.
     */
    return () => {
      animation.stop();
    };
  }, [animatedValues, updatedRings]);

  /**
   * Renders the circular progress rings recursively. It takes the current index
   * as an argument and renders a `CircularProgress` component for each ring
   * until all rings are rendered. It also conditionally displays the value
   * text and any additional children components at the end.
   *
   * @param {number} currentIndex - The index of the current ring being rendered.
   * @returns {JSX.Element | null} - The rendered circular progress ring or null if all rings are rendered.
   */
  const renderRings = (currentIndex: number): JSX.Element | null => {
    if (currentIndex >= rings.length) return null;

    const ring = updatedRings[currentIndex];
    const currentRadius = ringRadii[currentIndex];
    const size = currentRadius ? currentRadius * 2 : 2;

    return (
      <CircularProgress
        key={currentIndex}
        size={size}
        strokeWidth={spacing.md}
        progress={animatedValues[currentIndex]}
        primaryColor={ring?.activeStrokeColor}
        secondaryColor={ring?.activeStrokeSecondaryColor}
        backgroundStrokeColor={ring?.inActiveStrokeColor}
      >
        {renderRings(currentIndex + 1)}

        {currentIndex === rings.length - 1 && showValueText && (
          <Text style={[textStyle, progressValueStyle]}>{ring?.value}%</Text>
        )}

        {currentIndex === rings.length - 1 && children}
      </CircularProgress>
    );
  };

  return (
    <View style={$wrapper} {...rest}>
      {/* Title */}
      {title && <Text style={[$title, titleStyle]}>{title}</Text>}

      {/* Render rings */}
      <View style={combinedStyle}>{renderRings(0)}</View>

      {/* Color Legend - Placed at bottom of rings */}
      <View style={[$legendContainer, { marginTop: spacing.lg }]}>
        {updatedRings.map((ring, index) => {
          const trimmedText = ring.legendText.trim();
          const firstLineEndIndex = Math.min(19, trimmedText.length);
          const lastSpaceIndex = trimmedText.lastIndexOf(' ', firstLineEndIndex);

          const formattedFirstLine =
            lastSpaceIndex > 0
              ? trimmedText.substring(0, lastSpaceIndex)
              : trimmedText.substring(0, firstLineEndIndex);

          return (
            <View key={index} style={$legendItem}>
              <View style={[$colorDot, { backgroundColor: ring.activeStrokeColor }]} />

              <View style={$textContainer}>
                <Text style={$legendText}>{toTitleCase(formattedFirstLine)}</Text>

                {trimmedText.length > 19 && (
                  <Text style={$legendText}>
                    {toTitleCase(trimmedText.substring(lastSpaceIndex + 1, 38))}
                  </Text>
                )}

                <Text style={$valueText}>{isNaN(ring.value) ? 0 : ring.value.toFixed(2)}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
