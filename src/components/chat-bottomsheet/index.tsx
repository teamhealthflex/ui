import React from 'react';
import { View, Pressable, TextStyle, ViewStyle } from 'react-native';

import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { Portal } from '@gorhom/portal';
import { PortalTypes } from '../../models';
import { BottomSheet, BottomSheetRef, Icon, Text } from '@teamhealthflex/ui';

export interface ChatBottomSheetProps {
  ref: React.Ref<BottomSheetRef>;
  onClose?: () => void;
  onDoctorChatPress: () => void;
  onWhatsappChatPress?: () => void;
}

export const ChatBottomSheet = React.forwardRef<BottomSheetRef, ChatBottomSheetProps>(
  ({ onDoctorChatPress, onWhatsappChatPress, onClose }, ref) => {
    const { colors } = useTheme();
    return (
      <Portal hostName={PortalTypes.APP}>
        <BottomSheet
          ref={ref}
          title="Chat"
          initialIndex={-1}
          onClose={onClose}
          enableOverDrag={false}
          enablePanDownToClose={true}
        >
          <View>
            <Pressable onPress={onDoctorChatPress}>
              <View style={$bottomSheetItem}>
                <Icon icon="docChat" size={28} color={colors.primary} />
                <Text preset="subHeading" style={$bottomSheetItemText}>
                  Doctor
                </Text>
              </View>
            </Pressable>
            {onWhatsappChatPress && (
              <Pressable onPress={onWhatsappChatPress}>
                <View style={$bottomSheetItem}>
                  <Icon icon="whatsapp" size={28} color={colors.primary} />
                  <Text preset="subHeading" style={$bottomSheetItemText}>
                    WhatsApp
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </BottomSheet>
      </Portal>
    );
  },
);

const $bottomSheetItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: spacing.md,
};

const $bottomSheetItemText: TextStyle = {
  marginLeft: spacing.md,
};

/**
 * The display name of the `ChatBottomSheet` component.
 * @type {string}
 */
ChatBottomSheet.displayName = 'ChatBottomSheet';

export default ChatBottomSheet;
