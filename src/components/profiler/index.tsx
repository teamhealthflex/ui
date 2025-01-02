import React from 'react';
import { EventTypes, logger } from '@src/services';

export interface AppProfilerProps extends Omit<React.ProfilerProps, 'onRender'> {
  phases: Parameters<React.ProfilerOnRenderCallback>[1];
  metadata?: Parameters<React.ProfilerOnRenderCallback>;
}

/**
 * By wrapping the Profile like this, we can set the onRender to whatever
 * we want and we get the additional benefit of being able to include additional data and filter phases
 */
export const AppProfiler: React.FC<AppProfilerProps> = ({ metadata, phases, ...props }) => {
  const reportProfile: React.ProfilerOnRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
  ) => {
    if (!__DEV__) {
      return;
    }

    if (!phases || phases.includes(phase)) {
      logger.info({
        message: 'profiler data',
        data: {
          id,
          phase,
          metadata,
          startTime,
          commitTime,
          baseDuration,
          actualDuration,
        },
        event: EventTypes.APP_PROFILER_DATA,
      });
    }
  };

  if (!__DEV__) {
    return <>{props.children}</>; // Render children directly in production
  }

  return <React.Profiler onRender={reportProfile} {...props} />;
};

/**
 * The display name of the `AppProfiler` component.
 * @type {string}
 */
AppProfiler.displayName = 'AppProfiler';

export default AppProfiler;
