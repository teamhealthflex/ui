/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Rating } from '@kolking/react-native-rating';
import { StyleProp, ViewStyle, TextStyle, View, Text } from 'react-native';

import { spacing as spacings } from '@theme';

export interface EmojiRatingProps {
  question: string;
  rating?: number;
  size?: number;
  scale?: number;
  spacing?: number;
  maxRating?: number;
  disabled?: boolean;
  baseColor?: string;
  fillColor?: string;
  touchColor?: string;
  variant: VariantPresets;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onChange?: (rating: number) => void;
}

export function EmojiRating(props: EmojiRatingProps) {
  const {
    question,
    variant,
    rating: initialRating = 0,
    size = 30,
    scale = 1.3,
    spacing,
    maxRating = 5,
    disabled = false,
    baseColor,
    fillColor,
    touchColor,
    style,
    textStyle,
    onChange,
    ...rest
  } = props;

  const [rating, setRating] = React.useState(initialRating);

  const handleRatingChange = React.useCallback(
    (value: number) => {
      setRating(value);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange],
  );

  return (
    <View style={[{ alignItems: 'center' }, style]} {...rest}>
      <Text style={[{ fontSize: 16, marginBottom: spacings.md }, textStyle]}>{question}</Text>
      <Rating
        size={size}
        scale={scale}
        rating={rating}
        variant={variant}
        spacing={spacing}
        disabled={disabled}
        fillColor={fillColor}
        maxRating={maxRating}
        baseColor={baseColor}
        touchColor={touchColor}
        onChange={handleRatingChange}
      />
    </View>
  );
}

export type VariantPresets = 'stars' | 'stars-outline' | 'hearts' | 'hearts-outline' | 'emoji';

/**
 * The display name of the `EmojiRating` component.
 * @type {string}
 */
EmojiRating.displayName = 'EmojiRating';

export default EmojiRating;
