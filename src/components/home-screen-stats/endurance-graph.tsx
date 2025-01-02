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

export interface EnduranceGraphProps {
  sessionOverview: AchievedOverview[];
}

export function EnduranceGraph(props: EnduranceGraphProps) {
  const { sessionOverview } = props;
  const avgEndurance = React.useMemo(
    () =>
      sessionOverview.reduce((acc, item) => acc + item.endurance.average, 0) /
      sessionOverview.length,
    [sessionOverview],
  );

  const { colors } = useTheme();

  return (
    <GraphCard
      averageSuffixText="%"
      title="Endurance Score"
      average={avgEndurance.toFixed(1)}
      averageSubtitle="Avg Endurance Score"
      icon={<Icon icon="endurance" size={16} color={colors.primary} />}
    >
      <BarChart
        height={50}
        stackData={sessionOverview.map((item) => {
          return {
            value: item.endurance.average,
            stacks: [
              { value: item.endurance.value.min, color: 'transparent' },
              {
                value:
                  item.endurance.value.max - item.endurance.value.min === 0
                    ? 10
                    : item.endurance.value.max - item.endurance.value.min,
                frontColor: colors.primary,
                gradientColor: colors.primary,
              },
            ],
          };
        })}
        showLine
        hideRules
        hideOrigin
        spacing={1}
        barWidth={8}
        showGradient
        hideYAxisText
        maxValue={100}
        hideAxesAndRules
        yAxisLabelWidth={0}
        barBorderRadius={4}
        yAxisExtraHeight={10}
        xAxisLabelsHeight={0}
        lineConfig={{
          thickness: 2,
          curved: true,
          hideDataPoints: true,
          color: colors.gradient300,
        }}
        lineData={sessionOverview.map((item) => {
          return {
            value: item.endurance.average,
            label: item.createdAt,
          };
        })}
      />
    </GraphCard>
  );
}

/**
 * The display name of the `EnduranceGraph` component.
 * @type {string}
 */
EnduranceGraph.displayName = 'EnduranceGraph';

export default EnduranceGraph;
