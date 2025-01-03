import React from 'react';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Pressable, StyleProp, ViewStyle, View, TextStyle } from 'react-native';

import { useTheme } from '@contexts';
import { utils } from '../../resources';
import { fontSizes, radius, spacing } from '@theme';
import { Icon, MultiValueProgressBar, Progress, Text } from '@teamhealthflex/ui';

export interface SessionProgressData {
  value: number;
  total?: number;
  displayType?: DisplayPresets;
}

export interface SessionCardData {
  measurableType: MeasurablePresets;
  rating: number;
  createdAt: string;
  metrics: {
    label: string;
    progress: SessionProgressData;
  };
  overview: {
    painScore: number;
    starsAverageAchieved: number;
    stabilityScoreAverage?: number;
    endurancePercentAchieved?: number;
    correctnessAverageAchieved?: number;
    sessionTime?: { achieved: number; total: number };
    repDistribution?: { achieved: number; total: number };
  };
}

export interface SessionCardProps {
  index: number;
  regimenName: string;
  onPress?: () => void;
  data: SessionCardData;
  style?: StyleProp<ViewStyle>;
}

export function SessionCard(props: SessionCardProps) {
  const { data, index, onPress, style = {}, regimenName, ...rest } = props;
  const { colors } = useTheme();

  const handlePress = React.useCallback(() => {
    onPress?.();
  }, [onPress]);

  const $sessionCard: ViewStyle = {
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: '#EBFDFF',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  };

  const $startStyle: ViewStyle = {
    marginLeft: '0.025%',
    marginRight: '0.025%',
  };

  const $sessionCardHeading: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.xxxs,
    justifyContent: 'space-between',
  };

  const $sessionCardHeadingTextAndIcon: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  };

  const $dateContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.xxxs,
  };

  const $align: TextStyle = {
    alignItems: 'flex-end',
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        $sessionCard,
        {
          backgroundColor: pressed ? '#e1f8fb' : '#EBFDFF',
        },
        style,
      ]}
      {...rest}
    >
      <View style={$sessionCardHeading}>
        <View style={$sessionCardHeadingTextAndIcon}>
          <View style={{ marginRight: spacing.xs }}>
            {data.measurableType === 'MEASURABLE' ? (
              <Icon icon="ai-guided" size={28} />
            ) : (
              <Icon icon="self-guided" size={28} />
            )}
          </View>
          <View>
            <Text preset="heading">Session {index + 1}</Text>
            <Text preset="formLabel">
              {regimenName.length > 20 ? `${regimenName.substring(0, 20)}...` : regimenName}
            </Text>
          </View>
        </View>
        <View style={$align}>
          <StarRatingDisplay
            starStyle={$startStyle}
            starSize={18}
            emptyColor={colors.grey500}
            rating={data.overview.starsAverageAchieved}
          />
          <View style={$dateContainer}>
            <Text preset="formLabel">{utils.extractDate(new Date(data.createdAt))}</Text>
          </View>
        </View>
      </View>

      {data.measurableType === 'NON_MEASURABLE' ? (
        <>
          <RenderCard
            label="Session Time"
            progress={
              data.overview.sessionTime
                ? (data.overview.sessionTime.achieved / data.overview.sessionTime.total) * 100 || 0
                : 0
            }
          />
          <RenderCard label="Pain Score" progress={data.overview.painScore} />
          <RenderCard
            label="Rep Distribution"
            progress={
              data.overview.repDistribution
                ? [data.overview.repDistribution.achieved, data.overview.repDistribution.total]
                : [0, 0]
            }
          />
        </>
      ) : (
        <>
          <RenderCard label="Endurance" progress={data.overview.endurancePercentAchieved || 0} />
          <RenderCard
            label="Correctness"
            progress={data.overview.correctnessAverageAchieved || 0}
          />
          <RenderCard label="Stability Score" progress={data.overview.stabilityScoreAverage || 0} />
          <RenderCard label="Pain Score" progress={data.overview.painScore} />
          <RenderCard
            label="Rep Distribution"
            progress={
              data.overview.repDistribution
                ? [data.overview.repDistribution.achieved, data.overview.repDistribution.total]
                : [0, 0]
            }
          />
        </>
      )}
    </Pressable>
  );
}

const RenderCard = React.memo((props: { label: string; progress: number | number[] }) => {
  const { label, progress, ...rest } = props;
  const id = React.useId();
  const painLimit = 10;

  const isMultiValueProgress = label === 'Rep Distribution' && Array.isArray(progress);

  const $eachCard: ViewStyle = {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const $textContainerLeft: ViewStyle = {
    width: '30%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  };

  const $textContainerRight: ViewStyle = {
    width: '12.5%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: spacing.xxxs,
  };

  const $text: TextStyle = {
    ...fontSizes.sm,
  };

  const $progressContainer: ViewStyle = {
    flex: 1,
    marginHorizontal: spacing.xxxs,
  };

  return (
    <View style={$eachCard} key={id} {...rest}>
      <View style={$textContainerLeft}>
        <Text preset="extraSmall" weight="light" style={$text}>
          {label}
        </Text>
      </View>

      <View style={$progressContainer}>
        {isMultiValueProgress ? (
          <MultiValueProgressBar value1={progress[0] || 0} value2={progress[1] || 0} />
        ) : label === 'Pain Score' ? (
          <Progress step={progress as number} steps={10} h={12} />
        ) : (
          <Progress step={progress as number} steps={100} h={12} />
        )}
      </View>

      <View style={$textContainerRight}>
        {label === 'Pain Score' ? (
          <Text preset="extraSmall" weight="light" style={$text}>
            {Math.ceil(progress as number)}/{painLimit}
          </Text>
        ) : isMultiValueProgress ? (
          <Text preset="extraSmall" weight="light" style={$text}>
            {`${progress[0] || 0}/${progress[1] || 0}`}
          </Text>
        ) : (
          <Text preset="extraSmall" weight="light" style={$text}>
            {Math.ceil(progress as number)}%
          </Text>
        )}
      </View>
    </View>
  );
});

export type MeasurablePresets = 'MEASURABLE' | 'NON_MEASURABLE';
export type DisplayPresets = 'percentage' | 'fraction' | 'painScore';

/**
 * The display name of the `SessionCard` component.
 * @type {string}
 */
SessionCard.displayName = 'SessionCard';

export default SessionCard;
