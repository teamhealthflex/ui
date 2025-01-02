import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import {
  View,
  Keyboard,
  ViewStyle,
  TextStyle,
  Pressable,
  BackHandler,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import BS, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetBackdropProps,
  BottomSheetProps as BSProps,
} from '@gorhom/bottom-sheet';

import { useTheme } from '@contexts';
import { layouts, radius, spacing } from '@theme';
import { getSafeAreaInsets } from '../../resources/utils';
import { Text, Divider, AppScrollView } from '@teamhealthflex/ui';

export interface BottomSheetProps extends BSProps {
  title?: string;
  titleDivider?: boolean;
  testID?: string;
  initialIndex?: number;
  isScrollable?: boolean;
  dynamicHeight?: boolean;
  children: React.ReactNode;
  isCustomChildren?: boolean;
  isBackdropRendered?: boolean;
  displayCustomHandle?: boolean;
  handleIndicator?: 'flex' | 'none';
  backdropRenderedBehavior?: 'close' | 'collapse' | 'none';
  onBackDropPress?: () => void;
  customHandle?: () => JSX.Element;
  onCloseBottomSheetEnded?: () => void;
  onSnapChange?: (index: number) => void;
  renderAction?: () => React.ReactElement;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
  isOpen: () => void;
  snapToIndex: (index: number) => void;
}

const $handleContainer: ViewStyle = {
  height: 10,
  width: '100%',
  marginVertical: 4,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#E6F9E6',
};

const $handle: ViewStyle = {
  height: 4,
  width: '15%',
  borderRadius: radius.lg,
  backgroundColor: '#E6F9E6',
};

const displaySheetCustomHandle = () => (
  <View style={$handleContainer}>
    <View style={$handle} />
  </View>
);

const INITIAL_INDEX = -1;

export const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>((props, ref) => {
  const {
    style,
    title,
    onClose,
    children,
    onScroll,
    snapPoints,
    customHandle,
    renderAction,
    onSnapChange,
    onBackDropPress,
    titleDivider = true,
    dynamicHeight = true,
    isScrollable = false,
    handleIndicator = 'flex',
    onCloseBottomSheetEnded,
    isCustomChildren = false,
    isBackdropRendered = true,
    displayCustomHandle = false,
    enablePanDownToClose = true,
    initialIndex = INITIAL_INDEX,
    keyboardBehavior = 'fillParent',
    backdropRenderedBehavior = 'close',
    ...rest
  } = props;
  const styleInsets = useSafeAreaInsets();
  const insets = getSafeAreaInsets(styleInsets);

  const { colors } = useTheme();

  const bottomSheetRef = React.useRef<BottomSheetMethods>(null);
  const [sheetIndex, setSheetIndex] = React.useState<number>(initialIndex);

  React.useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setSheetIndex(0);
        bottomSheetRef.current?.collapse();
      },
      snapToIndex: (i) => {
        setSheetIndex(i);
        bottomSheetRef.current?.snapToIndex(i);
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
      isOpen: () => sheetIndex !== -1,
    }),
    [sheetIndex],
  );

  const onSheetChange = React.useCallback(
    async (index: number) => {
      if (index !== -1) {
        setSheetIndex(index);

        if (Keyboard.isVisible()) {
          Keyboard.dismiss();
        }
      } else {
        setSheetIndex(-1);
        onCloseBottomSheetEnded?.();
      }
      onSnapChange?.(index);
    },
    [onSnapChange, onCloseBottomSheetEnded],
  );

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (sheetIndex !== -1) {
          bottomSheetRef.current?.close();
          return true;
        } else {
          bottomSheetRef.current?.close();
          return false;
        }
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [sheetIndex]),
  );

  const renderBackdrop = React.useCallback(
    (backdropProps: BottomSheetBackdropProps) => {
      if (isBackdropRendered) {
        return (
          <BottomSheetBackdrop
            {...backdropProps}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            onPress={onBackDropPress}
            pressBehavior={backdropRenderedBehavior}
          />
        );
      }
      return null;
    },
    [isBackdropRendered, backdropRenderedBehavior, onBackDropPress],
  );

  const onCloseBottomSheet = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const onScrollingScrollView = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll?.(event);
    },
    [onScroll],
  );

  const ScrollableView = isScrollable ? AppScrollView : React.Fragment;
  const SheetView = isCustomChildren ? React.Fragment : BottomSheetView;

  const ScrollabelViewProps = isScrollable
    ? {
        isBottomSheet: true,
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false,
        keyboardShouldPersistTaps: 'always' as const,
      }
    : {};

  const $headerContainer: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const $titleContainer: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const $dividerHeight: ViewStyle = {
    height: 1,
  };

  const $dividerContainer: ViewStyle = {
    marginVertical: spacing.xxxs,
  };

  const $bottomSheetTitle: TextStyle = {
    alignSelf: 'flex-start',
  };

  const $bottomSheetContainer: ViewStyle = {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  };

  const $bottomStyle: ViewStyle = {
    paddingVertical: 0,
    borderTopLeftRadius: spacing.md,
    borderTopRightRadius: spacing.md,
    backgroundColor: colors.white100,
  };

  return (
    <BS
      ref={bottomSheetRef}
      index={initialIndex}
      snapPoints={snapPoints}
      onChange={onSheetChange}
      onClose={onCloseBottomSheet}
      style={[$bottomStyle, style]}
      backdropComponent={renderBackdrop}
      topInset={layouts.statusBarHeight}
      enableDynamicSizing={dynamicHeight}
      keyboardBehavior={keyboardBehavior}
      enablePanDownToClose={enablePanDownToClose}
      handleIndicatorStyle={{ display: handleIndicator }}
      maxDynamicContentSize={layouts.window.height - layouts?.statusBarHeight!}
      handleComponent={
        displayCustomHandle && sheetIndex !== -1
          ? customHandle
            ? customHandle
            : displaySheetCustomHandle
          : undefined
      }
      {...rest}
    >
      {isCustomChildren ? (
        children
      ) : (
        <BottomSheetScrollView
          onScroll={onScrollingScrollView}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[{ marginBottom: insets.bottom }]}
        >
          <SheetView>
            <ScrollableView {...ScrollabelViewProps}>
              <View style={[$bottomSheetContainer, { marginBottom: styleInsets.bottom }]}>
                <View style={$headerContainer}>
                  <View style={$titleContainer}>
                    {title && (
                      <Text preset="heading" style={$bottomSheetTitle}>
                        {title}
                      </Text>
                    )}

                    {renderAction ? (
                      renderAction()
                    ) : (
                      <CloseButton
                        close={() => {
                          if (enablePanDownToClose) {
                            bottomSheetRef.current?.close();
                          }
                        }}
                      />
                    )}
                  </View>
                </View>
                {titleDivider && (
                  <Divider line style={$dividerHeight} containerStyle={$dividerContainer} />
                )}
                {children}
              </View>
            </ScrollableView>
          </SheetView>
        </BottomSheetScrollView>
      )}
    </BS>
  );
});

const CloseButton = ({ close }: { close: () => void }) => {
  const { colors } = useTheme();

  const $closeButton: ViewStyle = {
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    zIndex: 10,
    alignItems: 'center',
    position: 'absolute',
    borderRadius: radius.sm,
    justifyContent: 'center',
  };

  const $closeIcon: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Pressable
      onPress={close}
      style={$closeButton}
      accessibilityRole="button"
      accessibilityLabel="close modal"
      accessibilityHint="closes the modal"
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <Svg
        width={24}
        height={24}
        style={$closeIcon}
        viewBox="0 0 24 24"
        fill={colors.primary300}
        color={colors.white100}
      >
        <Path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293Z" />
      </Svg>
    </Pressable>
  );
};

/**
 * The display name of the `BottomSheet` component.
 * @type {string}
 */
BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
