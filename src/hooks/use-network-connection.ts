import React from 'react';
import { useIsConnected } from './use-is-connected';

export const useNetworkConnection = () => {
  const { isConnected } = useIsConnected();
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const currentTimer = timer.current;
    return () => {
      if (currentTimer) {
        clearTimeout(currentTimer);
      }
    };
  }, []);

  return {
    isConnected,
    isConnectionTypeBoolean: typeof isConnected === 'boolean',
  };
};
