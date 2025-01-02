import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  Animated,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Text } from '../../text';
import { useTheme } from '@contexts';
import { useBle } from '@src/contexts';
import { useShowMessages } from '@src/hooks';
import { AppError, bleService } from '@src/services';
import { fontSizes, spacing, layouts, timings } from '@src/theme';

export type BluetoothCheckerProps = React.PropsWithChildren;

export function BluetoothChecker(props: BluetoothCheckerProps) {
  const { children, ...rest } = props;

  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isBluetoothEnabled } = useBle();
  const { showError } = useShowMessages();
  const [loading, setLoading] = React.useState(false);
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [overlayVisible, setOverlayVisible] = React.useState(false);

  const enableBluetooth = async () => {
    try {
      setLoading(true);
      await bleService.turnOnBluetooth();
    } catch (error) {
      showError(new AppError('Failed to enable Bluetooth. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isBluetoothEnabled) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: timings.slow,
      }).start(() => setOverlayVisible(false));
    } else {
      setOverlayVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: timings.slow,
      }).start();
    }
  }, [isBluetoothEnabled, fadeAnim, setOverlayVisible]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (!isBluetoothEnabled) {
        event.preventDefault();
        showError(new AppError('Please Enable Bluetooth to continue.'));
      }
    });

    return unsubscribe;
  }, [isBluetoothEnabled, navigation, showError]);

  const handleScreenPress = React.useCallback(() => {
    showError(new AppError('Please Enable Bluetooth!'));
  }, [showError]);

  const $container: ViewStyle = {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: colors.danger300,
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-between',
    paddingTop: layouts.statusBarHeight,
    height: layouts.statusBarHeight + 50,
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
    top: layouts.statusBarHeight + 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  };

  const $iconContainer: ViewStyle = {
    padding: spacing.sm,
  };

  return (
    <>
      {overlayVisible && (
        <>
          <Animated.View style={[$container, { opacity: fadeAnim }]} {...rest}>
            <Text style={$text} preset="subHeading">
              Bluetooth is disabled. Please enable Bluetooth to continue.
            </Text>
            <TouchableOpacity style={$iconContainer}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <MaterialIcons
                  size={24}
                  name="refresh"
                  onPress={enableBluetooth}
                  color={colors.white100}
                />
              )}
            </TouchableOpacity>
          </Animated.View>
          <TouchableWithoutFeedback containerStyle={$overlay} onPress={handleScreenPress} {...rest}>
            <Animated.View style={$overlay} />
          </TouchableWithoutFeedback>
        </>
      )}
      {children}
    </>
  );
}

/**
 * The display name of the `BluetoothChecker` component.
 * @type {string}
 */
BluetoothChecker.displayName = 'BluetoothChecker';

export default BluetoothChecker;
