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

export interface StabilityGraphProps {
  sessionOverview: AchievedOverview[];
}

export function StabilityGraph(props: StabilityGraphProps) {
  const { sessionOverview, ...rest } = props;

  const { colors } = useTheme();

  const avgStability = React.useMemo(
    () =>
      sessionOverview.reduce((acc, item) => acc + item.stability.average, 0) /
      sessionOverview.length,
    [sessionOverview],
  );

  return (
    <GraphCard
      averageSuffixText="%"
      title="Stability Score"
      average={avgStability.toFixed(1)}
      averageSubtitle="Avg Stability Score"
      icon={<Icon icon="stability_score" size={18} color={colors.primary} />}
      {...rest}
    >
      <BarChart
        showLine
        hideRules
        hideOrigin
        height={50}
        spacing={1}
        showGradient
        barWidth={8}
        hideYAxisText
        maxValue={100}
        hideAxesAndRules
        barBorderRadius={4}
        yAxisLabelWidth={0}
        yAxisExtraHeight={10}
        xAxisLabelsHeight={0}
        lineConfig={{
          color: '#FF991C',
          thickness: 2,
          curved: true,
          hideDataPoints: true,
        }}
        lineData={sessionOverview.map((item) => {
          return {
            value: item.stability.average,
            frontColor: '#006DFF',
            gradientColor: '#009FFF',
            label: item.createdAt,
          };
        })}
        stackData={sessionOverview.map((item) => {
          return {
            value: item.stability.average,
            stacks: [
              { value: item.stability.value.min, color: 'transparent' },
              {
                color: colors.info500,
                gradientColor: colors.info600,
                value:
                  item.stability.value.max - item.stability.value.min === 0
                    ? 10
                    : item.stability.value.max - item.stability.value.min,
              },
            ],
          };
        })}
      />
    </GraphCard>
  );
}

/**
 * The display name of the `StabilityGraph` component.
 * @type {string}
 */
StabilityGraph.displayName = 'StabilityGraph';

export default StabilityGraph;
