import React from 'react';
import * as Updates from 'expo-updates';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { View, Animated, ViewStyle, TextStyle, StyleSheet, ActivityIndicator } from 'react-native';

import { Env } from '@src/env';
import { useTheme } from '@contexts';
import { storage } from '@src/services';
import { useAppState } from '@src/hooks/app';
import { Icon, Text } from '@teamhealthflex/ui';
import { fontSizes, spacing, layouts } from '@theme';
import { useCrashlytics, useShowMessages } from '@src/hooks';

export interface AppUpdaterProps extends React.PropsWithChildren {}

export function AppUpdater() {
  const { logError } = useCrashlytics();
  const { showSuccess } = useShowMessages();

  const { colors } = useTheme();

  const [isUpdating, setIsUpdating] = React.useState(false);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<Error | null>(null);

  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [dismissAction, setDismissAction] = React.useState(false);
  const [overlayVisible, setOverlayVisible] = React.useState(false);

  const isDevelopment = React.useMemo(() => __DEV__ || Env.APP_ENV === 'development', []);

  const showSnackbar = async () => {
    showSuccess('App Update Available!');
  };

  const checkForUpdates = React.useCallback(async () => {
    try {
      if (Updates.isEnabled) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setUpdateAvailable(true);
          storage.setItem('DISMISS_UPDATE', 'false');
        } else {
          setUpdateAvailable(false);
        }
      } else {
        setUpdateAvailable(false);
      }
    } catch (err) {
      logError(err as Error);
    }
  }, [logError]);

  React.useEffect(() => {
    const checkForUserDismissAction = async () => {
      const dismiss = storage.getItem('DISMISS_UPDATE');
      if (dismiss === 'true') {
        setDismissAction(true);
      }
    };

    checkForUserDismissAction();
  }, []);

  React.useEffect(() => {
    if (!updateAvailable && !dismissAction) {
      setOverlayVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      setOverlayVisible(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [updateAvailable, dismissAction, fadeAnim]);

  const handleDismiss = async () => {
    setDismissAction(true);
    storage.setItem('DISMISS_UPDATE', 'true');
    setOverlayVisible(false);
  };

  const handleUpdate = React.useCallback(async () => {
    if (isDevelopment) {
      showSuccess('You are in DEVELOPMENT mode. Please press close and continue ...');
      return;
    }

    setIsUpdating(true);

    try {
      if (Updates.isEnabled) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          /**
           * This will download the update and store it in the cache.
           */
          await Updates.fetchUpdateAsync();

          /**
           * This will reload the app to apply the update
           */
          await Updates.reloadAsync();
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        logError(e);
        setUpdateError(e);
      }
    } finally {
      setIsUpdating(false);
    }
  }, [isDevelopment, logError, showSuccess]);

  useAppState({ onForeground: checkForUpdates });

  /**
   * Don't show update notification if dismissed, or no update is available, or in development mode.
   */
  if (dismissAction || !updateAvailable || isDevelopment) {
    return null;
  }

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
    backgroundColor: colors.background,
    paddingTop: layouts.statusBarHeight,
    height: layouts?.statusBarHeight! + 50,
  };

  const $text: TextStyle = {
    flex: 1,
    ...fontSizes.xs,
    color: colors.primary500,
  };

  const $overlay: ViewStyle = {
    flex: 1,
    zIndex: 1000,
    ...StyleSheet.absoluteFillObject,
    top: layouts?.statusBarHeight! + 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  };

  const $iconContainer: ViewStyle = {
    padding: spacing.sm,
  };

  const $loadingSnackbar: ViewStyle = {
    left: 0,
    right: 0,
    zIndex: 1001,
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'flex-start',
    position: 'absolute',
    justifyContent: 'flex-start',
    top: layouts?.statusBarHeight! + 50,
    backgroundColor: colors.background,
  };

  const $loadingText: TextStyle = {
    marginLeft: spacing.sm,
    color: colors.primary500,
    ...fontSizes.xs,
  };

  const $errorText: TextStyle = {
    marginLeft: spacing.sm,
    color: colors.danger300,
    ...fontSizes.xs,
  };

  return (
    <>
      <Animated.View style={[$container, { opacity: fadeAnim }]}>
        <Text style={$text} preset="subHeading">
          {isUpdating
            ? 'Updating App. Please Wait ...'
            : 'App Update Available. Please download the update.'}
        </Text>
        <Icon icon="download" containerStyle={$iconContainer} onPress={handleUpdate} />
        <Icon icon="clear" containerStyle={$iconContainer} onPress={handleDismiss} />
      </Animated.View>

      {isUpdating && (
        <View style={$loadingSnackbar}>
          <ActivityIndicator size="small" color={colors.primary500} />
          <Text style={$loadingText}>Downloading update...</Text>
        </View>
      )}

      {updateError && (
        <View style={$loadingSnackbar}>
          <Text style={$errorText}>{updateError.message}</Text>
        </View>
      )}

      {overlayVisible && (
        <TouchableWithoutFeedback containerStyle={$overlay} onPress={showSnackbar}>
          <View style={$overlay} />
        </TouchableWithoutFeedback>
      )}
    </>
  );
}

/**
 * The display name of the `AppUpdater` component.
 * @type {string}
 */
AppUpdater.displayName = 'AppUpdater';

export default AppUpdater;
