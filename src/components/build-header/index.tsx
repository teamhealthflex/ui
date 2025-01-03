import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';

import { layouts } from '@theme';
import { useTheme } from '@contexts';
import { utils } from '../../resources';
import { Text } from '@teamhealthflex/ui';

export const BuildHeader: React.FC = () => {
  const { colors } = useTheme();

  function headerBuild() {
    if (utils.ENVIRONMENT === utils.env.STAGING) {
      return '__STAG_BUILD__';
    }

    return '__DEV_BUILD__';
  }

  if (utils.ENVIRONMENT !== utils.env.PRODUCTION) {
    const $view: ViewStyle = {
      left: 0,
      right: 0,
      height: 16,
      zIndex: 1000,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'orange',
      top: layouts?.statusBarHeight! - 8,
    };
    const $text: TextStyle = {
      fontSize: 12,
      color: colors.white100,
    };
    return (
      <View style={$view}>
        <Text style={$text}>{headerBuild()}</Text>
      </View>
    );
  }

  return null;
};

/**
 * The display name of the `BuildHeader` component.
 * @type {string}
 */
BuildHeader.displayName = 'BuildHeader';

export default BuildHeader;
