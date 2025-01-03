import React from 'react';
import {
  View,
  ViewStyle,
  Modal as RnModal,
  TouchableWithoutFeedback,
  ModalProps as RnModalProps,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useTheme } from '@contexts';

export type ModalProps = RnModalProps & {
  visible: boolean;
  onClose: () => void;
  backdropOpacity?: number;
  contentStyle?: ViewStyle;
  children: React.ReactNode;
};

export function Modal(props: ModalProps) {
  const { visible, onClose, children, contentStyle = {}, backdropOpacity = 0.5, ...rest } = props;

  const { colors } = useTheme();
  const translateY = useSharedValue(50);
  const backdropOpacityValue = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      backdropOpacityValue.value = withTiming(backdropOpacity, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      backdropOpacityValue.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(50, { duration: 300 });
    }
  }, [backdropOpacity, backdropOpacityValue, translateY, visible]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacityValue.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const $backdrop: ViewStyle = {
    flex: 1,
    backgroundColor: colors.black500,
  };

  const $modalContainer: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const $content: ViewStyle = {
    elevation: 5,
    padding: 20,
    borderRadius: 10,
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    backgroundColor: 'white',
    shadowColor: colors.black500,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  };

  return (
    <RnModal animationType="none" transparent visible={visible} onRequestClose={onClose} {...rest}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[$backdrop, animatedBackdropStyle]} />
      </TouchableWithoutFeedback>
      <View style={$modalContainer}>
        <TouchableWithoutFeedback>
          <Animated.View style={[$content, contentStyle, animatedContentStyle]}>
            {children}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </RnModal>
  );
}

/**
 * The display name of the `Modal` component.
 * @type {string}
 */
Modal.displayName = 'Modal';

export default Modal;
