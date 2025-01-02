import React from 'react';
import { View, Text, Pressable, ViewStyle, Platform } from 'react-native';
import { MaterialIcons, Ionicons, Octicons } from '@expo/vector-icons';

import { useTheme } from '@contexts';
import { useSession } from '@src/contexts/session';
import { fontSizes, radius, spacing } from '@theme';

export interface BottomContainerProps {
  handleCardPress: () => void;
}

export function BottomContainer(props: BottomContainerProps) {
  const { handleCardPress, ...rest } = props;

  const { colors } = useTheme();
  const { exercise, repCount, starsAchieved } = useSession();
  const totalRepCount = React.useMemo(() => exercise?.numberOfReps ?? 0, [exercise]);

  const $bottomContainer: ViewStyle = {
    height: '10%',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: radius.lg,
    marginVertical: spacing.md,
    borderColor: colors.primary,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    backgroundColor: colors.white100,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: radius.xs,
        shadowColor: colors.black500,
      },
    }),
  };

  const $repsParentContainer: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  const $repsContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  };

  const $bottomRefreshIconContainer: ViewStyle = {
    width: spacing.xl,
    height: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.xl / 2,
    borderColor: colors.primary100,
    backgroundColor: 'rgba(26, 53, 107, 0.06)',
  };

  const $starsParentContainer: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  const $starsContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  };

  return (
    <View style={$bottomContainer} {...rest}>
      {/* Display the current and total reps */}
      <View style={$repsParentContainer}>
        <View style={$repsContainer}>
          <View style={$bottomRefreshIconContainer}>
            <MaterialIcons name="restart-alt" size={28} color={colors.primary} />
          </View>
          <View style={{ marginLeft: spacing.xxs }}>
            <Text
              style={{
                color: colors.primary,
                ...fontSizes.lg,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  ...fontSizes.lg,
                }}
              >
                {repCount}
              </Text>
              /{totalRepCount}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: colors.primary,
            ...fontSizes.sm,
          }}
        >
          Total reps
        </Text>
      </View>

      {/* Button to open the exercise playback sheet */}
      <View>
        <Pressable onPress={handleCardPress}>
          <Ionicons name="pause-circle-outline" size={spacing.xxxl} color={colors.primary} />
        </Pressable>
      </View>

      {/* Display the current and total stars */}
      <View style={$starsParentContainer}>
        <View style={$starsContainer}>
          <View style={$bottomRefreshIconContainer}>
            <Octicons name="star" size={24} color={colors.primary} />
          </View>
          <View style={{ marginLeft: spacing.xxs }}>
            <Text
              style={{
                color: colors.primary,
                ...fontSizes.lg,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  ...fontSizes.lg,
                }}
              >
                {starsAchieved}
              </Text>
              /{totalRepCount * 5}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: colors.primary,
            ...fontSizes.sm,
          }}
        >
          Total stars
        </Text>
      </View>
    </View>
  );
}

/**
 * The display name of the `BottomContainer` component.
 * @type {string}
 */
BottomContainer.displayName = 'BottomContainer';

export default BottomContainer;
