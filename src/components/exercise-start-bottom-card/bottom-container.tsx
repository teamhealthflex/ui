import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons, Ionicons, Octicons } from '@expo/vector-icons';

import styles from './styles';
import { useSession } from '@src/contexts/session';
import { colors, spacing, typography } from '@src/theme';

interface BottomContainerProps {
  handleCardPress: () => void;
}

const BottomContainer: React.FC<BottomContainerProps> = React.memo(({ handleCardPress }) => {
  const { exercise, repCount, starsAchieved } = useSession();
  const totalRepCount = React.useMemo(() => exercise?.numberOfReps ?? 0, [exercise]);

  return (
    <View style={styles.bottomContainer}>
      {/* Display the current and total reps */}
      <View style={styles.repsParentContainer}>
        <View style={styles.repsContainer}>
          <View style={styles.bottomRefreshIconContainer}>
            <MaterialIcons name="restart-alt" size={28} color={colors.primary} />
          </View>
          <View style={{ marginLeft: spacing.xxs }}>
            <Text
              style={{
                color: colors.primary,
                fontSize: typography.size.lg.fontSize,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: typography.size.lg.fontSize,
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
            fontSize: typography.size.sm.fontSize,
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
      <View style={styles.starsParentContainer}>
        <View style={styles.starsContainer}>
          <View style={styles.bottomRefreshIconContainer}>
            <Octicons name="star" size={24} color={colors.primary} />
          </View>
          <View style={{ marginLeft: spacing.xxs }}>
            <Text
              style={{
                color: colors.primary,
                fontSize: typography.size.lg.fontSize,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: typography.size.lg.fontSize,
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
            fontSize: typography.size.sm.fontSize,
          }}
        >
          Total stars
        </Text>
      </View>
    </View>
  );
});

export default BottomContainer;
