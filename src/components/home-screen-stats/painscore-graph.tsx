import React from 'react';
import { BarChart } from 'react-native-gifted-charts';

import { useTheme } from '@contexts';
import { GraphCard, Icon } from '@teamhealthflex/ui';

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

export interface PainScoreGraphProps {
  sessionOverview: AchievedOverview[];
}

export function PainScoreGraph(props: PainScoreGraphProps) {
  const { sessionOverview, ...rest } = props;
  const { colors } = useTheme();

  const avgPainScore = React.useMemo(
    () => sessionOverview.reduce((acc, item) => acc + item.painScore, 0) / sessionOverview.length,
    [sessionOverview],
  );

  return (
    <GraphCard
      title=" Pain Score"
      averageSuffixText="/10"
      averageSubtitle="Avg Pain Score"
      average={avgPainScore.toFixed(1)}
      icon={<Icon icon="alert" size={16} color={colors.primary} />}
      {...rest}
    >
      <BarChart
        hideRules
        hideOrigin
        isAnimated
        height={60}
        spacing={1}
        barWidth={8}
        hideYAxisText
        maxValue={10}
        hideAxesAndRules
        barBorderRadius={4}
        yAxisLabelWidth={0}
        yAxisExtraHeight={2}
        xAxisLabelsHeight={0}
        data={sessionOverview.map((item) => {
          return {
            value: item.painScore,
            label: item.createdAt,
            frontColor: item.painScore <= 6 ? colors.success500 : colors.danger400,
          };
        })}
      />
    </GraphCard>
  );
}

/**
 * The display name of the `PainScoreGraph` component.
 * @type {string}
 */
PainScoreGraph.displayName = 'PainScoreGraph';

export default PainScoreGraph;
