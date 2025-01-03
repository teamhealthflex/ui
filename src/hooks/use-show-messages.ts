import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast';

import { radius } from '@theme';
import { useTheme } from '@contexts';

type ToastOptions = {
  message: string;
  duration?: number;
  position?: ToastPosition;
  styles?: {
    text?: TextStyle;
    view?: ViewStyle;
  };
};

export const useShowMessages = () => {
  const { colors } = useTheme();
  const showToast = React.useCallback((type: 'success' | 'error', options: ToastOptions) => {
    /**
     * Dismiss any existing toast to avoid overlap
     */
    toast.dismiss();

    /**
     * Display toast with specified options
     */
    if (type === 'error') {
      toast.error(options.message, {
        styles: options.styles,
        duration: options.duration || 2500,
        position: options.position || ToastPosition.TOP,
      });
    } else {
      toast.success(options.message, {
        duration: options.duration || 3000,
        position: options.position || ToastPosition.TOP,
      });
    }
  }, []);

  const $toastContainer: ViewStyle = {
    borderWidth: 1,
    borderRadius: radius.md,
    borderColor: colors.danger300,
    backgroundColor: colors.danger200,
  };

  const $errorText: TextStyle = {
    color: colors.danger300,
  };

  const showError = React.useCallback(
    (error: Error) => {
      showToast('error', {
        message: error?.message || 'An error occurred',
        styles: { text: $errorText, view: $toastContainer },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showToast],
  );

  const showSuccess = React.useCallback(
    (message: string) => {
      showToast('success', { message });
    },
    [showToast],
  );

  return { showError, showSuccess };
};
