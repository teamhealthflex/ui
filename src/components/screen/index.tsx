import React from 'react';
import { PortalHost } from '@gorhom/portal';
import { useScrollToTop } from '@react-navigation/native';
import { KeyboardAvoidingViewProps, StatusBarProps } from 'react-native';

import {
  View,
  FlatList,
  Platform,
  StyleProp,
  ViewStyle,
  ScrollView,
  ScrollViewProps,
  LayoutChangeEvent,
  KeyboardAvoidingView,
} from 'react-native';

import { useTheme } from '@contexts';
import { useCustomStyles } from '@theme';
import { PortalTypes } from '../../models';
import { ExtendedEdge, useSafeAreaInsetsStyle } from '../../hooks';
import { Spinner, AppScrollView, FocusAwareStatusBar } from '@teamhealthflex/ui';

export interface BaseScreenProps extends React.PropsWithChildren {
  loading?: boolean;
  keyboardOffset?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  safeAreaEdges?: ExtendedEdge[];
  StatusBarProps?: StatusBarProps;
  statusBarStyle?: 'light' | 'dark';
  disableKeyboardAvoidingView?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
}

export interface FixedScreenProps extends BaseScreenProps {
  preset: 'fixed';
}

export interface ScrollScreenProps extends BaseScreenProps {
  preset: 'scroll';
  ScrollViewProps?: ScrollViewProps;
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
}

export interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset: 'auto';
  scrollEnabledToggleThreshold?: { percent?: number; point?: number };
}

export interface ScrollScreenWithDataProps extends ScrollScreenProps {
  data: any[];
  renderItem: ({ item }: { item: any }) => React.ReactElement;
  keyExtractor: (item: any, index: number) => string;
}

export type ScreenProps =
  | FixedScreenProps
  | ScrollScreenProps
  | AutoScreenProps
  | ScrollScreenWithDataProps;

const isNonScrolling = (preset: ScreenProps['preset']) => preset === 'fixed';

export function useAutoPreset(props: AutoScreenProps) {
  const { preset, scrollEnabledToggleThreshold } = props;
  const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {};

  const scrollViewHeight = React.useRef<null | number>(null);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const scrollViewContentHeight = React.useRef<null | number>(null);

  const updateScrollState = React.useCallback(() => {
    if (scrollViewHeight.current === null || scrollViewContentHeight.current === null) return;

    const contentFitsScreen = point
      ? scrollViewContentHeight.current < scrollViewHeight.current - point
      : scrollViewContentHeight.current < scrollViewHeight.current * percent;

    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false);
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true);
  }, [scrollEnabled, percent, point]);

  const onContentSizeChange = React.useCallback(
    (w: number, h: number) => {
      scrollViewContentHeight.current = h;
      updateScrollState();
    },
    [updateScrollState],
  );

  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const { height } = e.nativeEvent.layout;
      scrollViewHeight.current = height;
      updateScrollState();
    },
    [updateScrollState],
  );

  if (preset === 'auto') updateScrollState();

  return React.useMemo(
    () => ({
      onLayout,
      onContentSizeChange,
      scrollEnabled: preset === 'auto' ? scrollEnabled : true,
    }),
    [onLayout, onContentSizeChange, scrollEnabled, preset],
  );
}

const ScreenWithoutScrolling = React.memo(
  ({ style, contentContainerStyle, children }: FixedScreenProps) => {
    const { styles } = useCustomStyles();

    const $mainContainer: ViewStyle = {
      ...styles.columnContainer,
    };

    const $innerContent: ViewStyle = {
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    };

    return (
      <View style={[$mainContainer, style]}>
        <View style={[$innerContent, contentContainerStyle]}>{children}</View>
      </View>
    );
  },
);

const ScreenWithScrolling = React.memo((props: ScrollScreenProps) => {
  const {
    style,
    children,
    contentContainerStyle = {},
    keyboardShouldPersistTaps = 'handled',
    ScrollViewProps: scrollViewProps = {},
  } = props;
  const ref = React.useRef<ScrollView>(null);

  const { styles } = useCustomStyles();

  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(
    props as unknown as AutoScreenProps,
  );

  useScrollToTop(ref);

  const $mainContainer: ViewStyle = {
    ...styles.columnContainer,
  };

  const $innerContent: ViewStyle = {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  };

  return (
    <AppScrollView
      alwaysBounceVertical={false}
      {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
      {...scrollViewProps}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[$mainContainer, scrollViewProps?.style, style]}
      onLayout={(e) => {
        onLayout(e);
        scrollViewProps?.onLayout?.(e);
      }}
      onContentSizeChange={(w: number, h: number) => {
        onContentSizeChange(w, h);
        scrollViewProps?.onContentSizeChange?.(w, h);
      }}
      contentContainerStyle={[
        $innerContent,
        scrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
    >
      {children}
    </AppScrollView>
  );
});

const ScreenWithFlatList = React.memo((props: ScrollScreenWithDataProps) => {
  const {
    style,
    data,
    renderItem,
    keyExtractor,
    contentContainerStyle,
    keyboardShouldPersistTaps = 'handled',
    ScrollViewProps: scrollViewProps = {},
  } = props;
  const ref = React.useRef<FlatList<any>>(null);

  const { styles } = useCustomStyles();

  useScrollToTop(ref);

  const $mainContainer: ViewStyle = {
    ...styles.columnContainer,
  };

  const $innerContent: ViewStyle = {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  };

  return (
    <FlatList
      alwaysBounceVertical={false}
      {...{ keyboardShouldPersistTaps, ref }}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onLayout={scrollViewProps?.onLayout}
      onContentSizeChange={scrollViewProps?.onContentSizeChange}
      style={[$mainContainer, scrollViewProps?.style, style]}
      contentContainerStyle={[
        $innerContent,
        scrollViewProps?.contentContainerStyle,
        contentContainerStyle,
      ]}
    />
  );
});

export const Screen = React.memo((props: ScreenProps) => {
  const {
    safeAreaEdges,
    loading = false,
    keyboardOffset = 0,
    backgroundColor = '#fff',
    StatusBarProps: statusBarProps,
    disableKeyboardAvoidingView = false,
    KeyboardAvoidingViewProps: keyboardAvoidingViewProps,
  } = props;
  const containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  const { colors } = useTheme();
  const { styles } = useCustomStyles();

  const $viewStyle: ViewStyle = {
    flex: 1,
    display: 'flex',
  };

  const $keyboardAvoidingViewStyle: ViewStyle = {
    flex: 1,
  };
  const $mainContainer: ViewStyle = {
    ...styles.columnContainer,
  };

  return (
    <KeyboardAvoidingView
      enabled={!disableKeyboardAvoidingView}
      keyboardVerticalOffset={keyboardOffset}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[$keyboardAvoidingViewStyle, keyboardAvoidingViewProps?.style]}
      {...keyboardAvoidingViewProps}
    >
      <FocusAwareStatusBar translucent {...statusBarProps} />
      <View style={[$mainContainer, $viewStyle, { backgroundColor }, containerInsets]}>
        <Spinner showLogo showContent={false} color={colors.background} active={loading}>
          {isNonScrolling(props.preset) ? (
            <ScreenWithoutScrolling {...(props as FixedScreenProps)} />
          ) : 'data' in props ? (
            <ScreenWithFlatList {...(props as ScrollScreenWithDataProps)} />
          ) : (
            <ScreenWithScrolling {...(props as ScrollScreenProps)} />
          )}
          <PortalHost name={PortalTypes.SELECT_FIELD_PORTAL} />
        </Spinner>
      </View>
    </KeyboardAvoidingView>
  );
});
