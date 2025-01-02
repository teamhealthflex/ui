import React from 'react';
import { ScrollView } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { type BottomSheetScrollViewProps } from '@gorhom/bottom-sheet/src/components/bottomSheetScrollable/types';

import { useKeyboardState } from '../../hooks';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';
import {
  SCROLLABLE_TYPE,
  type BottomSheetScrollViewMethods,
  createBottomSheetScrollableComponent,
} from '@gorhom/bottom-sheet';

type CombinedProps = BottomSheetScrollViewProps &
  KeyboardAwareScrollViewProps & {
    isBottomSheet?: boolean;
    onKeyboardDismiss?: () => void;
  };

const AnimatedScrollView =
  Reanimated.createAnimatedComponent<KeyboardAwareScrollViewProps>(KeyboardAwareScrollView);

const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);

export const AppScrollView = React.forwardRef<
  BottomSheetScrollViewMethods | ScrollView,
  CombinedProps
>(({ isBottomSheet = false, onKeyboardDismiss, ...props }, ref) => {
  const { keyboardHeight } = useKeyboardState();

  const sharedProps = {
    ref,
    automaticallyAdjustContentInsets: true,
    onScrollBeginDrag: onKeyboardDismiss,
    ...props,
  };

  if (isBottomSheet) {
    return <BottomSheetScrollViewComponent {...sharedProps} />;
  }

  return <AnimatedScrollView enabled contentInset={{ bottom: keyboardHeight }} {...sharedProps} />;
});

export default AppScrollView;
