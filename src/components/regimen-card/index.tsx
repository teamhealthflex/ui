/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { Card, Toggle, Text, Icon } from '@teamhealthflex/ui';

export interface Regimen {
  name: string;
  index: number;
  exerciseList: { name: string }[];
}

export interface RegimenCardProps {
  regimen: Regimen;
  isDisabled?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  isDeleteMode?: boolean;
}

export function RegimenCard(props: RegimenCardProps) {
  const { regimen, onPress, isSelected, isDisabled, isDeleteMode, ...rest } = props;

  const { colors } = useTheme();

  const scale = useSharedValue(1);
  const [isPressed, setIsPressed] = React.useState(false);

  const exerciseNames = React.useMemo(
    () => (regimen.exerciseList ? regimen.exerciseList.map((exercise) => exercise.name) : []),
    [regimen.exerciseList],
  );

  const handlePress = React.useCallback(() => {
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const renderRightComponent = () => {
    return isDeleteMode ? (
      <Toggle
        variant="checkbox"
        value={isSelected}
        onValueChange={handlePress}
        containerStyle={$checkboxContainer}
      />
    ) : (
      <View style={$iconContainer}>
        <Icon icon="chevron-right" size={24} color={colors.primary} />
      </View>
    );
  };

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, []);

  const onTouchStart = React.useCallback(() => {
    if (!isDisabled) {
      scale.value = withTiming(0.95);
      setIsPressed(true);
    }
  }, [isDisabled, scale]);

  const onTouchEnd = React.useCallback(() => {
    if (!isDisabled) {
      scale.value = withTiming(1);
      setIsPressed(false);
    }
  }, [isDisabled, scale]);

  const $card: ViewStyle = {
    margin: 0,
    minHeight: 48,
    padding: spacing.xs,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white100,
  };

  const $pressedStyle: ViewStyle = {
    borderColor: colors.white400,
    backgroundColor: colors.background,
  };

  const $title: TextStyle = {
    alignSelf: 'flex-start',
  };

  const $iconContainer: ViewStyle = {
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  };

  const $regimenDetails: TextStyle = {
    paddingLeft: spacing.xs,
    marginBottom: spacing.xxxs,
    paddingVertical: spacing.xxxs,
  };

  const $checkboxContainer: ViewStyle = {
    marginRight: spacing.sm,
  };

  return (
    <>
      <Animated.View style={[reanimatedStyle]} {...rest}>
        <Card
          raised
          disabled={isDisabled}
          onPress={handlePress}
          heading={regimen.name}
          onPressOut={onTouchEnd}
          onPressIn={onTouchStart}
          pressedStyle={$pressedStyle}
          headingStyle={{ textTransform: 'capitalize' }}
          HeadingTextProps={{ preset: 'heading', style: $title }}
          style={[
            $card,
            isPressed && {
              borderColor: colors.white400,
              backgroundColor: colors.background,
            },
          ]}
          ContentComponent={
            <View style={{ paddingTop: spacing.xxs }}>
              {exerciseNames.map((exercise, index) => (
                <Text key={exercise} preset="formLabel" style={$regimenDetails}>
                  {index + 1}. {exercise.length > 40 ? `${exercise.slice(0, 37)} ...` : exercise}
                </Text>
              ))}
            </View>
          }
          RightComponent={renderRightComponent()}
        />
      </Animated.View>
    </>
  );
}

/**
 * The display name of the `RegimenCard` component.
 * @type {string}
 */
RegimenCard.displayName = 'RegimenCard';

export default RegimenCard;
