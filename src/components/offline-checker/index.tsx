import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast';
import { View, Animated, ViewStyle, TextStyle, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '@contexts';
import { Text } from '@teamhealthflex/ui';
import { useNetworkConnection } from '../../hooks';
import { fontSizes, spacing, layouts } from '@theme';

export interface OfflineCheckerProps extends React.PropsWithChildren {}

export function OfflineChecker(props: OfflineCheckerProps) {
  const { children } = props;

  const { colors } = useTheme();
  const { isConnected } = useNetworkConnection();
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [overlayVisible, setOverlayVisible] = React.useState(false);
  const [delayedIsConnected, setDelayedIsConnected] = React.useState(true);

  const showSnackbar = async () => {
    toast.dismiss();
    toast.error('Please Enable Network!', {
      duration: 3000,
      position: ToastPosition.TOP,
    });
  };

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isConnected) {
      timeoutId = setTimeout(() => {
        setDelayedIsConnected(false);
        setOverlayVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 3000); // 3 seconds delay
    } else {
      setDelayedIsConnected(true);
      setOverlayVisible(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }

    return () => clearTimeout(timeoutId);
  }, [isConnected, fadeAnim, setOverlayVisible]);

  if (delayedIsConnected) return <>{children}</>;

  const $container: ViewStyle = {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    backgroundColor: colors.danger300,
    paddingTop: layouts.statusBarHeight,
    height: layouts?.statusBarHeight! + 50,
  };

  const $text: TextStyle = {
    flex: 1,
    ...fontSizes.xs,
    color: colors.white100,
  };

  const $overlay: ViewStyle = {
    flex: 1,
    zIndex: 1000,
    ...StyleSheet.absoluteFillObject,
    left: 0,
    opacity: 0.9,
    top: layouts?.statusBarHeight! + 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  };

  const $iconContainer: ViewStyle = {
    padding: spacing.sm,
  };

  return (
    <>
      <Animated.View style={[$container, { opacity: fadeAnim }]}>
        <Text style={$text} preset="subHeading">
          You are offline. Please enable mobile network or connect to wifi.
        </Text>
        <TouchableOpacity style={$iconContainer}>
          <MaterialIcons name="refresh" size={24} color={colors.white100} />
        </TouchableOpacity>
      </Animated.View>

      {overlayVisible && (
        <TouchableWithoutFeedback containerStyle={$overlay} onPress={showSnackbar}>
          <View style={$overlay} />
        </TouchableWithoutFeedback>
      )}
      {children}
    </>
  );
}

/**
 * The display name of the `OfflineChecker` component.
 * @type {string}
 */
OfflineChecker.displayName = 'OfflineChecker';

export default OfflineChecker;
