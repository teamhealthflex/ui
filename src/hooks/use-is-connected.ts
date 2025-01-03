import React from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

export function useIsConnected(): { isConnected: boolean | null } {
  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = React.useState<boolean | null>(() => netInfo.isConnected);

  React.useEffect(() => {
    setIsConnected(netInfo.isConnected);
  }, [netInfo]);

  return { isConnected };
}
