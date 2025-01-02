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
export interface RepDistributionGraphProps {
  sessionOverview: AchievedOverview[];
}

export function RepDistributionGraph(props: RepDistributionGraphProps) {
  const { sessionOverview, ...rest } = props;

  const { colors } = useTheme();

  const totalCorrectRep = React.useMemo(
    () => sessionOverview.reduce((acc, item) => acc + item.repDistribution.correctRepCount, 0),
    [sessionOverview],
  );

  const totalIncorrectRep = React.useMemo(
    () => sessionOverview.reduce((acc, item) => acc + item.repDistribution.incorrectRepCount, 0),
    [sessionOverview],
  );

  const totalRep = React.useMemo(
    () => sessionOverview.reduce((acc, item) => acc + item.repDistribution.totalRepCount, 0),
    [sessionOverview],
  );

  return (
    <GraphCard
      title="Rep Distribution"
      averageSuffixText={`/${totalRep}`}
      averageSubtitle="Total Reps Completed"
      average={(totalCorrectRep + totalIncorrectRep).toString()}
      icon={<Icon icon="rep_distribution" size={16} color={colors.primary} />}
      {...rest}
    >
      <BarChart
        stackData={sessionOverview.map((item) => {
          return {
            value: item.repDistribution.totalRepCount,
            stacks: [
              {
                color: '#FA5D5D',
                value:
                  (item.repDistribution.incorrectRepCount / item.repDistribution.totalRepCount) *
                  100,
              },
              {
                marginBottom: 1,
                color: colors.secondary400,
                value:
                  (item.repDistribution.correctRepCount / item.repDistribution.totalRepCount) * 100,
              },
              {
                color: colors.warning200,
                value:
                  ((item.repDistribution.totalRepCount -
                    (item.repDistribution.correctRepCount +
                      item.repDistribution.incorrectRepCount)) /
                    item.repDistribution.totalRepCount) *
                  100,
              },
            ],
          };
        })}
        hideRules
        hideOrigin
        height={60}
        barWidth={8}
        hideYAxisText
        spacing={1.5}
        maxValue={100}
        hideAxesAndRules
        barBorderRadius={4}
        yAxisLabelWidth={0}
        yAxisExtraHeight={4}
        xAxisLabelsHeight={0}
      />
    </GraphCard>
  );
}

/**
 * The display name of the `RepDistributionGraph` component.
 * @type {string}
 */
RepDistributionGraph.displayName = 'RepDistributionGraph';

export default RepDistributionGraph;
