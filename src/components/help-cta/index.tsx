import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, StyleProp, ViewStyle, TextStyle, Platform } from 'react-native';

import { useTheme } from '@contexts';
import { radius, spacing } from '@theme';
import { Button, Text } from '@teamhealthflex/ui';
import { useWhatsApp } from '../../hooks/use-whatsapp';

export interface HelpCtaProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}

export function HelpCta(props: HelpCtaProps) {
  const { style, onPress, ...rest } = props;
  const { colors } = useTheme();

  /** Creating a deafult linking if no onPress handler provided  */
  const { sendWhatsApp } = useWhatsApp();

  /**
   * handler to trigger chat with healtflex customer support
   */
  const handleWhatsappChatPress = React.useCallback(() => {
    const message = `Hello, I am facing issue in the patient app.`;
    sendWhatsApp(message);
  }, [sendWhatsApp]);

  const $container: ViewStyle = {
    borderRadius: radius.lg,
    marginVertical: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.success100,
    ...Platform.select({
      ios: {
        shadowColor: colors.black500,
        shadowOffset: {
          width: 0,
          height: 0.5,
        },
        shadowOpacity: 0.25,
        shadowRadius: radius.xs,
      },
      android: {
        elevation: 1,
      },
    }),
  };

  const $ctaButton: ViewStyle = {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  };

  const $text: TextStyle = {
    color: colors.primary300,
    alignSelf: 'center',
    marginVertical: spacing.xxs,
  };

  const $heading: TextStyle = {
    alignSelf: 'center',
  };

  const $icon: ViewStyle = {
    marginRight: spacing.lg,
  };

  return (
    <View style={[$container, style]} {...rest}>
      <Text preset="heading" style={$heading} size="sm">
        Need Help?
      </Text>
      <Text preset="paragraph" style={$text} size="sm">
        Reach out instantly to our care team.
      </Text>
      <Button
        preset="reversed"
        onPress={onPress ? onPress : handleWhatsappChatPress}
        style={$ctaButton}
      >
        <FontAwesome size={16} name="whatsapp" style={$icon} color={colors.secondary500} />
        <Text preset="small"> Get Help</Text>
      </Button>
    </View>
  );
}

/**
 * The display name of the `HelpCta` component.
 * @type {string}
 */
HelpCta.displayName = 'HelpCta';

export default HelpCta;
