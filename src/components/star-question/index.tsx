import { Rating } from '@kolking/react-native-rating';
import { Variants } from '@kolking/react-native-rating/src/variants';
import { View, StyleProp, TextStyle, ViewStyle, ViewProps } from 'react-native';

import { fontSizes, spacing } from '@theme';
import { Text, useTheme } from '@teamhealthflex/ui';

export interface StarQuestionCardProps extends ViewProps {
  color?: string;
  rating?: number;
  question: string;
  maxStars?: number;
  starSize?: number;
  emptyColor?: string;
  initialRating?: number;
  enableSwiping?: boolean;
  enableHalfStar?: boolean;
  starStyle?: StyleProp<ViewStyle>;
  onChange?: (rating: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  questionTextStyle?: StyleProp<TextStyle>;
}

export function StarQuestionCard(props: StarQuestionCardProps) {
  const {
    question,
    onChange,
    starStyle,
    maxStars = 5,
    initialRating,
    containerStyle,
    color = '#FFD700',
    questionTextStyle,
    starSize = spacing.xl,
    ...rest
  } = props;

  const { colors } = useTheme();

  const handleRatingChange = (newRating: number) => {
    if (onChange) {
      onChange(newRating);
    }
  };

  const $container: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  };
  const $questionText: TextStyle = {
    ...fontSizes.sm,
    marginBottom: spacing.md,
  };

  return (
    <View style={[$container, containerStyle]} {...rest}>
      <Text text={question} size="sm" style={[$questionText, questionTextStyle]} />
      <Rating
        scale={1.3}
        size={starSize}
        style={starStyle}
        fillColor={color}
        touchColor={color}
        maxRating={maxStars}
        spacing={spacing.lg}
        rating={initialRating!!}
        baseColor={colors.primary}
        onChange={handleRatingChange}
        variant={Variants.STARS_OUTLINE}
      />
    </View>
  );
}

/**
 * The display name of the `StarQuestionCard` component.
 * @type {string}
 */
StarQuestionCard.displayName = 'StarQuestionCard';

export default StarQuestionCard;
