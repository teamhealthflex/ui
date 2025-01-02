/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useBottomSheet, BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import {
  View,
  ViewStyle,
  Pressable,
  TextStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { layouts, radius, spacing } from '@theme';
import { useTheme } from '@contexts';
import { Divider, Text, AppScrollView } from '@teamhealthflex/ui';

export type ModalSheetProps = BottomSheetModalProps & {
  title?: string;
  detached?: boolean;
  isScrollable?: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export type ModalSheetRef = React.ForwardedRef<BottomSheetModal>;

type ModalSheetHeaderProps = {
  title?: string;
  dismiss: () => void;
};

export const useModalSheet = () => {
  const ref = React.useRef<BottomSheetModal>(null);

  const present = React.useCallback((data?: any) => {
    ref.current?.present(data);
  }, []);

  const dismiss = React.useCallback(() => {
    ref.current?.dismiss();
  }, []);

  return { ref, present, dismiss };
};

export const ModalSheet = React.forwardRef(
  (
    {
      snapPoints: _snapPoints,
      title,
      onScroll,
      isScrollable,
      detached = false,
      ...props
    }: ModalSheetProps,
    ref: ModalSheetRef,
  ) => {
    const modal = useModalSheet();
    const styleInsets = useSafeAreaInsets();

    const { colors } = useTheme();

    const snapPoints = React.useMemo(() => _snapPoints, [_snapPoints]);
    const detachedProps = React.useMemo(() => getDetachedProps(detached), [detached]);

    React.useImperativeHandle(ref, () => (modal.ref.current as BottomSheetModal) || null);

    const onScrollingScrollView = React.useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScroll?.(event);
      },
      [onScroll],
    );

    const ScrollableView = isScrollable ? AppScrollView : React.Fragment;
    const ScrollabelViewProps = isScrollable
      ? {
          isBottomSheet: true,
          onScroll: onScrollingScrollView,
          showsVerticalScrollIndicator: false,
          showsHorizontalScrollIndicator: false,
          keyboardShouldPersistTaps: 'always' as const,
        }
      : {};

    const $handleIndicator: ViewStyle = {
      height: 4,
      marginTop: 2,
      marginBottom: 8,
      width: 36,
      alignSelf: 'center',
      borderRadius: 4,
      backgroundColor: colors.primary,
    };

    const $bottomSheetContainer: ViewStyle = {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    };

    const renderHandleComponent = React.useCallback(
      () => (
        <>
          <View style={$handleIndicator} />
          <ModalSheetHeader title={title} dismiss={modal.dismiss} />
        </>
      ),
      [$handleIndicator, title, modal.dismiss],
    );

    return (
      <BottomSheetModal
        {...props}
        {...detachedProps}
        index={0}
        ref={modal.ref}
        snapPoints={snapPoints}
        topInset={layouts.statusBarHeight}
        handleComponent={renderHandleComponent}
        backdropComponent={props.backdropComponent || renderBackdrop}
        maxDynamicContentSize={layouts.window.height - layouts?.statusBarHeight!}
      >
        <BottomSheetView>
          <ScrollableView {...ScrollabelViewProps}>
            <View style={[$bottomSheetContainer, { marginBottom: styleInsets.bottom }]}>
              {typeof props.children === 'function'
                ? props.children({ data: props })
                : props.children}
            </View>
          </ScrollableView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CustomBackdrop = ({ style }: BottomSheetBackdropProps) => {
  const { close } = useBottomSheet();
  const { colors } = useTheme();

  const $backdrop: ViewStyle = {
    backgroundColor: colors.overlay50,
  };
  return (
    <AnimatedPressable
      onPress={() => close()}
      style={[style, $backdrop]}
      entering={FadeIn.duration(50)}
      exiting={FadeOut.duration(20)}
    />
  );
};

export const renderBackdrop = (props: BottomSheetBackdropProps) => <CustomBackdrop {...props} />;

const getDetachedProps = (detached: boolean) => {
  if (detached) {
    return {
      detached: true,
      bottomInset: 46,
      style: $detachedModal,
    } as Partial<BottomSheetModalProps>;
  }

  return {} as Partial<BottomSheetModalProps>;
};

const ModalSheetHeader = React.memo(({ title, dismiss }: ModalSheetHeaderProps) => {
  const $headerContainer: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  };

  const $titleContainer: ViewStyle = {
    flex: 1,
  };

  const $dividerHeight: ViewStyle = {
    height: 1,
  };

  const $dividerContainer: ViewStyle = {
    marginTop: spacing.xxxs,
  };

  const $bottomSheetTitle: TextStyle = {
    alignSelf: 'flex-start',
  };

  return (
    <View style={$headerContainer}>
      {title && (
        <View style={$titleContainer}>
          <Text preset="heading" style={$bottomSheetTitle}>
            {title}
          </Text>
          <Divider line style={$dividerHeight} containerStyle={$dividerContainer} />
        </View>
      )}
      <CloseButton close={dismiss} />
    </View>
  );
});

const CloseButton = ({ close }: { close: () => void }) => {
  const { colors } = useTheme();

  const $closeButton: ViewStyle = {
    top: 16,
    right: 16,
    width: 24,
    height: 24,
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
        fill={colors.primary}
        color={colors.white100}
      >
        <Path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293Z" />
      </Svg>
    </Pressable>
  );
};

const $detachedModal: ViewStyle = {
  overflow: 'hidden',
  marginHorizontal: 16,
};

/**
 * The display name of the `ModalSheet` component.
 * @type {string}
 */
ModalSheet.displayName = 'ModalSheet';

export default ModalSheet;
