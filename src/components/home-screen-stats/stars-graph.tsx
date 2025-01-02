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

export interface StarsGraphProps {
  sessionOverview: AchievedOverview[];
}

export function StarsGraph(props: StarsGraphProps) {
  const { sessionOverview, ...rest } = props;

  const { colors } = useTheme();

  const avgStars = React.useMemo(
    () =>
      sessionOverview.reduce((acc, item) => acc + item.stars.average, 0) / sessionOverview.length,
    [sessionOverview],
  );

  return (
    <GraphCard
      title="Stars Achieved"
      averageSuffixText="/5"
      average={avgStars.toFixed(1)}
      averageSubtitle="Avg Stars Achieved Per Rep"
      icon={<Icon icon="star" size={18} color={colors.primary} />}
      {...rest}
    >
      <BarChart
        showLine
        hideRules
        hideOrigin
        spacing={2}
        height={60}
        maxValue={5}
        barWidth={8}
        showGradient
        hideYAxisText
        hideAxesAndRules
        barBorderRadius={4}
        yAxisLabelWidth={0}
        yAxisExtraHeight={10}
        xAxisLabelsHeight={0}
        lineConfig={{
          thickness: 2,
          curved: true,
          hideDataPoints: true,
          color: colors.success400,
        }}
        lineData={sessionOverview.map((item) => {
          return {
            frontColor: '#006DFF',
            label: item.createdAt,
            gradientColor: '#009FFF',
            value: item.stars.average,
          };
        })}
        stackData={sessionOverview.map((item) => {
          return {
            value: item.stars.average,
            stacks: [
              { value: item.stars.value.min, color: 'transparent' },
              {
                color: colors.primary300,
                gradientColor: colors.primary300,
                value:
                  item.stars.value.max - item.stars.value.min !== 0
                    ? item.stars.value.max - item.stars.value.min
                    : 0.5,
              },
            ],
          };
        })}
      />
    </GraphCard>
  );
}

export const StarsGraphMemo = React.memo(StarsGraph);
