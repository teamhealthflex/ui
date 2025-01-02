import { Image, View, StyleProp, ViewStyle, ImageStyle } from 'react-native';

import { useCustomStyles } from '@theme';

export interface ScreenLogoProps {
  logoStyle?: StyleProp<ViewStyle>;
}

const logoWithTitle = require('@assets/images/logo/logo-with-title.png');

export function ScreenLogo(props: ScreenLogoProps) {
  const { logoStyle = {}, ...rest } = props;

  const { styles } = useCustomStyles();

  const $logoContainer: ViewStyle = {
    width: 300,
    height: 93,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#edfbfc',
    ...styles.screenLogoBox,
  };

  const $logo: ImageStyle = {
    marginVertical: 5,
    ...styles.screenLogo,
  };

  const image = <Image style={$logo} source={logoWithTitle} />;

  return (
    <View style={[$logoContainer, logoStyle]} {...rest}>
      {image}
    </View>
  );
}

/**
 * The display name of the `ScreenLogo` component.
 * @type {string}
 */
ScreenLogo.displayName = 'ScreenLogo';

export default ScreenLogo;
