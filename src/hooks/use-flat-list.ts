import React from 'react';
import { Animated, LayoutChangeEvent, StyleProp, ViewStyle, StatusBar } from 'react-native';

import { layouts } from '@theme';

export type CustomFlatListStyles = {
  header: StyleProp<ViewStyle>;
  topElement?: StyleProp<ViewStyle>;
  stickyElement: StyleProp<ViewStyle>;
};

export type UseFlatList = [
  Animated.Value,
  CustomFlatListStyles,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void,
  (event: LayoutChangeEvent) => void,
];

/**
 * A custom hook for managing layout and scroll behavior in a FlatList component with header, sticky, and top elements.
 *
 * This hook provides styles and scroll position management for integrating a header, sticky element, and optional top element
 * into a `FlatList`. It uses the `Animated` API to handle scroll animations and updates layout dimensions dynamically.
 *
 * Features:
 * - **Scroll Management**: Tracks the vertical scroll position using `Animated.Value` to interpolate styles.
 * - **Dynamic Layout Management**: Adjusts the position and dimensions of the header, sticky, and top elements based on layout changes.
 * - **Customizable Styles**: Provides styles for the header, sticky element, and optional top element that adapt based on scroll position.
 * Usage:
 *
 * ```tsx
 * import React from 'react';
 * import { View, Text, LayoutChangeEvent } from 'react-native';
 * import { useFlatList } from './path/to/useFlatList';
 *
 * const MyComponent = () => {
 *   const [scrollY, styles, onLayoutHeader, onLayoutTop, onLayoutSticky] = useFlatList();
 *
 *   return (
 *     <View style={{ flex: 1 }}>
 *       <View onLayout={onLayoutHeader}>
 *         <Text>Header Component</Text>
 *       </View>
 *       <View onLayout={onLayoutSticky} style={styles.stickyElement}>
 *         <Text>Sticky Element Component</Text>
 *       </View>
 *       {TopListElementComponent && (
 *         <View onLayout={onLayoutTop} style={styles.topElement}>
 *           <Text>Top List Element Component</Text>
 *         </View>
 *       )}
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * Parameters:
 * - `scrollY`: An `Animated.Value` that tracks the vertical scroll position.
 * - `styles`: An object containing styles for the header, sticky element, and top element.
 * - `onLayoutHeaderElement`: A callback to update the height of the header component when its layout changes.
 * - `onLayoutTopListElement`: A callback to update the height of the top list element when its layout changes.
 * - `onLayoutTopStickyElement`: A callback to update the height of the sticky element when its layout changes.
 *
 * Why Use This Hook:
 * - **Enhanced UI**: Provides smooth scroll animations and positioning for complex list layouts with fixed and sticky elements.
 * - **Dynamic Layout Adjustments**: Automatically handles layout changes and recalculates positions based on the content and scroll position.
 * - **Custom Styling**: Allows for flexible styling of list elements based on their position and the scroll state.
 */

export const useFlatList = (): UseFlatList => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [heights, setHeights] = React.useState({
    header: StatusBar.currentHeight,
    sticky: 0,
    topList: 0,
  });

  const styles: CustomFlatListStyles = {
    header: {
      marginBottom: heights.sticky + (heights.topList > 0 ? heights.topList : 0),
    },
    stickyElement: {
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      position: 'absolute',
      marginTop: heights.header,
      transform: [
        {
          translateY: scrollY.interpolate({
            extrapolate: 'clamp',
            inputRange: [-layouts.window.height, heights?.header!],
            outputRange: [layouts.window.height, -heights?.header!],
          }),
        },
      ],
      zIndex: 2,
    },
    topElement: {
      left: 0,
      right: 0,
      width: '100%',
      position: 'absolute',
      marginTop: heights?.header! + heights.sticky,
      transform: [
        {
          translateY: scrollY.interpolate({
            extrapolate: 'clamp',
            inputRange: [-layouts.window.height, 0, heights?.header! + heights.sticky],
            outputRange: [layouts.window.height, 0, -(heights?.header! + heights.topList)],
          }),
        },
      ],
      zIndex: 1,
    },
  };

  const onLayoutHeaderElement = (event: LayoutChangeEvent): void => {
    const newHeight = event.nativeEvent.layout.height;
    if (heights.header !== newHeight) {
      setHeights((prevHeights) => ({ ...prevHeights, header: newHeight }));
    }
  };

  const onLayoutTopListElement = (event: LayoutChangeEvent): void => {
    const newHeight = event.nativeEvent.layout.height;
    if (heights.topList !== newHeight) {
      setHeights((prevHeights) => ({ ...prevHeights, topList: newHeight }));
    }
  };

  const onLayoutTopStickyElement = (event: LayoutChangeEvent): void => {
    const newHeight = event.nativeEvent.layout.height;
    if (heights.sticky !== newHeight) {
      setHeights((prevHeights) => ({ ...prevHeights, sticky: newHeight }));
    }
  };

  return [scrollY, styles, onLayoutHeaderElement, onLayoutTopListElement, onLayoutTopStickyElement];
};
