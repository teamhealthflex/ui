import React from 'react';
import { View, ViewStyle } from 'react-native';

import { spacing } from '@theme';
import { StarsGraphMemo } from './stars-graph';
import { StabilityGraph } from './stability-graph';
import { EnduranceGraph } from './endurance-graph';
import { PainScoreGraph } from './painscore-graph';
import { RepDistributionGraph } from './rep-distribution-graph';

export interface ValueRange {
  min: number;
  max: number;
}

export interface RepDistribution {
  totalRepCount: number;
  correctRepCount: number;
  incorrectRepCount: number;
}

export interface Metric {
  average: number;
  value: ValueRange;
}

export interface AchievedOverview {
  stars: Metric;
  createdAt: string;
  stability: Metric;
  endurance: Metric;
  painScore: number;
  repDistribution: RepDistribution;
}

export interface HomeScreenStatProps {
  sessionOverview: AchievedOverview[];
}

export const HomeScreenStats: React.FC<HomeScreenStatProps> = React.memo(({ sessionOverview }) => {
  const $HomeScreenStatsContainer: ViewStyle = {
    paddingBottom: spacing.sm,
  };

  return (
    <View style={$HomeScreenStatsContainer}>
      <StarsGraphMemo sessionOverview={sessionOverview} />
      <RepDistributionGraph sessionOverview={sessionOverview} />
      <PainScoreGraph sessionOverview={sessionOverview} />
      <StabilityGraph sessionOverview={sessionOverview} />
      <EnduranceGraph sessionOverview={sessionOverview} />
    </View>
  );
});

/**
 * The display name of the `HomeScreenStats` component.
 * @type {string}
 */
HomeScreenStats.displayName = 'HomeScreenStats';

export default HomeScreenStats;
