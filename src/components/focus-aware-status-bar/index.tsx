import React from 'react';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';

export type FocusAwareStatusBarProps = React.ComponentProps<typeof StatusBar>;

export function FocusAwareStatusBar(props: FocusAwareStatusBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const barStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <StatusBar
      hidden={false}
      translucent={true}
      barStyle={barStyle}
      networkActivityIndicatorVisible={false}
      {...props}
    />
  );
}

/**
 * The display name of the `FocusAwareStatusBar` component.
 * @type {string}
 */
FocusAwareStatusBar.displayName = 'FocusAwareStatusBar';

export default FocusAwareStatusBar;
