import { FlexStyle } from 'react-native';
import { Edge, useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';

export type ExtendedEdge = Edge | 'start' | 'end';

const propertySuffixMap: Record<ExtendedEdge, string> = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Start',
  right: 'End',
  start: 'Left',
  end: 'Right',
};

const edgeInsetMap: Record<ExtendedEdge, Edge> = {
  start: 'left',
  end: 'right',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
};

/**
 * A hook that can be used to create a safe-area-aware style object that can be passed directly to a View.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/utility/useSafeAreaInsetsStyle.md)
 */
export function useSafeAreaInsetsStyle(
  safeAreaEdges: ExtendedEdge[] = [],
  property: 'padding' | 'margin' = 'padding',
): Pick<
  FlexStyle,
  | 'marginBottom'
  | 'marginEnd'
  | 'marginStart'
  | 'marginTop'
  | 'paddingBottom'
  | 'paddingEnd'
  | 'paddingStart'
  | 'paddingTop'
> {
  const insets: EdgeInsets = useSafeAreaInsets();

  return safeAreaEdges.reduce(
    (acc, e) => {
      const value = edgeInsetMap[e] ?? e;

      if (value in insets) {
        return {
          ...acc,
          [`${property}${propertySuffixMap[e]}`]: insets[value as keyof EdgeInsets],
        };
      }
      return acc;
    },
    {} as Pick<
      FlexStyle,
      | 'marginBottom'
      | 'marginEnd'
      | 'marginStart'
      | 'marginTop'
      | 'paddingBottom'
      | 'paddingEnd'
      | 'paddingStart'
      | 'paddingTop'
    >,
  );
}
