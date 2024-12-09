import { Dimensions, PixelRatio, Platform } from 'react-native';

const screen = {
  scale: Dimensions.get('screen').scale,
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  fontScale: Dimensions.get('screen').fontScale,
};

/**
 * Layout tokens for managing all layout-related styles.
 */
export const layouts = {
  screen,
  platformOS: Platform.OS,
  devicePixelRatio: PixelRatio.get(),
  isSmallDevice: Dimensions.get('screen').width < 375,
};
