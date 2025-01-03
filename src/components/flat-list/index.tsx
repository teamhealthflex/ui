import React from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import {
  View,
  Animated,
  StyleProp,
  ViewStyle,
  NativeScrollEvent,
  InteractionManager,
  NativeSyntheticEvent,
} from 'react-native';

import { useFlatList } from '../../hooks';

export type FlatListProps<T> = Omit<FlashListProps<T>, 'ListHeaderComponent'> & {
  /**
   * An element that is above all
   *
   * Hides when scrolling
   */
  HeaderComponent?: JSX.Element;

  /**
   * An element that is above the list but lower than {@link Props.HeaderComponent HeaderComponent} and has the property sticky
   *
   * When scrolling is fixed on top
   */
  StickyElementComponent?: JSX.Element;

  /**
   * An element that is higher than the list but lower than {@link Props.HeaderComponent HeaderComponent} and {@link Props.StickyElementComponent StickyElementComponent}
   *
   * Hides when scrolling
   */
  TopListElementComponent?: JSX.Element;

  /**
   * Style for {@link Props.HeaderComponent HeaderComponent}
   */
  style?: StyleProp<ViewStyle>;
};

/**
 * A customizable FlatList component that integrates a header, sticky element, and optional top list element.
 * This component extends the standard React Native `FlatList` by providing additional layout and style customization options.
 *
 * @param {FlatListProps<T>} props - The props for the FlatList component.
 * @returns {React.ReactNode} The rendered FlatList component.
 *
 * Features:
 * - `HeaderComponent`: A component that is displayed above all other elements in the list. This component hides when scrolling.
 * - `StickyElementComponent`: A component that appears above the list but below the `HeaderComponent`. It remains fixed at the top of the screen when scrolling.
 * - `TopListElementComponent`: An optional component that appears above the list but below both `HeaderComponent` and `StickyElementComponent`. It hides when scrolling.
 *
 * Use Case:
 * This component is ideal for situations where you need a `FlatList` with a fixed header, a sticky element that remains visible while scrolling, and an additional top list element. It is useful for building complex UIs where you want to keep certain elements always visible while the user interacts with a long list.
 *
 * Sample Usage:
 *
 * ```tsx
 * import React from 'react';
 * import { FlatList } from './path/to/FlatList';
 * import { View, Text } from 'react-native';
 *
 * const data = Array.from({ length: 20 }, (_, i) => ({
 *   id: i.toString(),
 *   title: `Item ${i + 1}`,
 * }));
 *
 * const App = () => (
 *   <FlatList
 *     data={data}
 *     keyExtractor={(item) => item.id}
 *     renderItem={({ item }) => (
 *       <View style={{ padding: 20, borderBottomWidth: 1, borderColor: 'gray' }}>
 *         <Text>{item.title}</Text>
 *       </View>
 *     )}
 *     HeaderComponent={
 *       <View style={{ padding: 20, backgroundColor: 'lightblue' }}>
 *         <Text>Header Component</Text>
 *       </View>
 *     }
 *     StickyElementComponent={
 *       <View style={{ padding: 20, backgroundColor: 'lightgreen' }}>
 *         <Text>Sticky Element Component</Text>
 *       </View>
 *     }
 *     TopListElementComponent={
 *       <View style={{ padding: 20, backgroundColor: 'lightcoral' }}>
 *         <Text>Top List Element Component</Text>
 *       </View>
 *     }
 *   />
 * );
 *
 * export default App;
 * ```
 *
 * In the sample usage above, the `FlatList` component is used with a header, a sticky element, and a top list element. Each component is styled and positioned as per the requirements.
 *
 * Why Use This Component:
 * - **Customizability**: Allows easy integration of complex layouts with fixed and sticky elements in a scrollable list.
 * - **Flexibility**: Provides the ability to maintain a consistent and interactive UI with additional components that adapt based on user interaction.
 */
export function FlatList<T>({
  HeaderComponent,
  style = $defaultStyle,
  StickyElementComponent,
  TopListElementComponent,
  ...props
}: FlatListProps<T>): React.ReactNode {
  const [focused, setIsFocused] = React.useState(false);
  const listRef = React.useRef<FlashList<T> | null>(null);
  const [scrollY, styles, ...flatListProps] = useFlatList();
  const [onLayoutHeaderElement, onLayoutTopListElement, onLayoutStickyElement] = flatListProps;

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsFocused(true);
      });

      return () => {
        /**
         * Cancel the task when the component is unmounted
         * NOTE: To avoid memory leaks
         */
        task.cancel();

        setIsFocused(false);
      };
    }, []),
  );

  const renderHeader = React.useCallback(
    () => <Animated.View onLayout={onLayoutHeaderElement}>{HeaderComponent}</Animated.View>,
    [HeaderComponent, onLayoutHeaderElement],
  );

  const renderTopElement = React.useCallback(
    () => (
      <Animated.View style={styles.topElement} onLayout={onLayoutTopListElement}>
        {TopListElementComponent}
      </Animated.View>
    ),
    [TopListElementComponent, onLayoutTopListElement, styles.topElement],
  );

  const listHeaderStyle = React.useMemo(
    () => [props.ListHeaderComponentStyle, styles.header],
    [props.ListHeaderComponentStyle, styles.header],
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (props.onScroll) {
      props.onScroll(event);
    }

    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
    });
  };

  if (focused) {
    return (
      <View style={[style]}>
        <Animated.View style={[styles.stickyElement]} onLayout={onLayoutStickyElement}>
          {StickyElementComponent}
        </Animated.View>

        {/* Top of List Component */}
        {TopListElementComponent && renderTopElement()}

        <FlashList<T>
          {...props}
          ref={listRef}
          onScroll={onScroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponentStyle={listHeaderStyle}
        />
      </View>
    );
  }

  return null;
}

const $defaultStyle: ViewStyle = { flex: 1 };

/**
 * The display name of the `FlatList` component.
 * @type {string}
 */
FlatList.displayName = 'FlatList';

export default FlatList;
