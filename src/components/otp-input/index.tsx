/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  Platform,
  Keyboard,
  TextInput,
  ViewStyle,
  TextProps,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
  TextInputKeyPressEventData,
} from 'react-native';

import { useTheme } from '@contexts';
import { fontSizes, radius, spacing } from '@theme';

export interface OTPInputProps extends TextProps {
  /**
   * Number of OTP digits
   */
  pinCount?: number;

  /**
   * Callback when OTP is fully entered
   */
  onCodeFilled?: (code: string) => void;
}

export function OtpInput(props: OTPInputProps) {
  const { pinCount = 4, onCodeFilled, ...rest } = props;
  const inputRefs = React.useRef<(TextInput | null)[]>([]);
  const focusedIndexRef = React.useRef<number | null>(null);
  const otp = React.useRef<string[]>(Array(pinCount).fill(''));

  const { colors } = useTheme();

  const $container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    justifyContent: 'space-between',
  };
  const $inputBox: ViewStyle = {
    width: 40,
    aspectRatio: 1,
    borderWidth: 1,
    ...fontSizes.md,
    borderRadius: radius.md,
    borderColor: colors.grey200,
    backgroundColor: colors.white200,
  };
  const $focusedInputBox: ViewStyle = {
    borderColor: colors.primary,
  };

  /**
   * Handles text input change
   */
  const handleChange = React.useCallback(
    (value: string, index: number) => {
      const sanitizedValue = value.replace(/[^0-9]/g, '');
      if (sanitizedValue) {
        const char = sanitizedValue.charAt(0);
        otp.current[index] = char;

        inputRefs.current[index]?.setNativeProps({ text: char });

        const fullOtp = otp.current.join('');
        if (fullOtp.length === pinCount) {
          Keyboard.dismiss();
          onCodeFilled?.(fullOtp);
        }

        if (index < pinCount - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    },
    [pinCount, onCodeFilled],
  );

  /**
   * Handles backspace
   */
  const handleKeyPress = React.useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (event.nativeEvent.key === 'Backspace') {
        otp.current[index] = '';
        inputRefs.current[index]?.setNativeProps({ text: '' });

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    },
    [],
  );

  /**
   * Handles focus
   */
  const handleFocus = React.useCallback(
    (index: number) => {
      focusedIndexRef.current = index;
      inputRefs.current[index]?.setNativeProps({
        style: [$inputBox, $focusedInputBox],
      });
    },
    [$focusedInputBox, $inputBox],
  );

  /**
   * Handles blur
   */
  const handleBlur = React.useCallback((index: number) => {
    if (focusedIndexRef.current === index) {
      focusedIndexRef.current = null;
    }
    inputRefs.current[index]?.setNativeProps({
      style: $inputBox,
    });
  }, []);

  /**
   * Render OTP input fields
   */
  const inputs = Array.from({ length: pinCount }).map((_, index) => (
    <TextInput
      maxLength={1}
      style={$inputBox}
      key={`otp-${index}`}
      keyboardType="numeric"
      autoFocus={index === 0}
      textContentType="oneTimeCode"
      onBlur={() => handleBlur(index)}
      onFocus={() => handleFocus(index)}
      ref={(ref) => (inputRefs.current[index] = ref)}
      onChangeText={(value) => handleChange(value, index)}
      onKeyPress={(event) => handleKeyPress(event, index)}
      autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
      {...rest}
    />
  ));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} {...rest}>
      <View style={$container} {...rest}>
        {inputs}
      </View>
    </TouchableWithoutFeedback>
  );
}

/**
 * The display name of the `OtpInput` component.
 * @type {string}
 */
OtpInput.displayName = 'OtpInput';

export default OtpInput;
