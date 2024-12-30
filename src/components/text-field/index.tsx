import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import {
  View,
  Keyboard,
  ViewStyle,
  StyleProp,
  TextInput,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '@contexts';
import { useCustomStyles } from '@theme';
import { Text, TextProps } from '../text';
import { fontSizes, fontWeights, radius, spacing } from '@theme';

export interface TextFieldAccessoryProps {
  editable: boolean;
  multiline: boolean;
  style: StyleProp<any>;
  status: TextFieldProps['status'];
}

/**
 * A component that allows for the entering and editing of text.
 * @param {TextFieldProps} props - The props for the `TextField` component.
 * @returns {JSX.Element} The rendered `TextField` component.
 */
export interface TextFieldProps extends Omit<TextInputProps, 'ref'> {
  /**
   * A style modifier for different input states.
   */
  status?: 'error' | 'disabled';

  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps['text'];

  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps;

  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps['text'];

  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps;

  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps['text'];

  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>;

  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>;

  /**
   * An optional component to check if the input is required
   */
  required?: boolean;

  /**
   * Hide the input field and only show the label.
   */
  hideInput?: boolean;

  /**
   * Show a loading spinner in the input field.
   */
  loading?: boolean;

  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: React.ComponentType<TextFieldAccessoryProps>;

  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: React.ComponentType<TextFieldAccessoryProps>;
}

/**
 * A component that allows for the entering and editing of text.
 * @param {TextFieldProps} props - The props for the `TextField` component.
 * @returns {JSX.Element} The rendered `TextField` component.
 */
export const TextField = React.forwardRef(function TextField(
  props: TextFieldProps,
  ref: React.Ref<TextInput>,
) {
  const {
    label,
    helper,
    status,
    required,
    hideInput,
    placeholder,
    LeftAccessory,
    RightAccessory,
    HelperTextProps,
    LabelTextProps,
    style: $inputStyleOverride,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    ...textInputProps
  } = props;

  const { colors } = useTheme();
  const { styles } = useCustomStyles();

  const { multiline } = textInputProps;
  const placeholderContent = placeholder;
  const input = React.useRef<TextInput>(null);
  const nonEditable = textInputProps.editable === false;
  const disabled = nonEditable || status === 'disabled';

  const $labelStatusStyle: ViewStyle = {
    flexDirection: 'row',
    marginBottom: -spacing.xxxs,
  };

  const $labelStyle: TextStyle = {
    marginBottom: spacing.xs,
    color: colors.black500,
  };

  const $inputWrapperStyle: ViewStyle = {
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    borderColor: colors.grey400,
    backgroundColor: colors.white100,
  };

  const $inputStyle: TextStyle = {
    flex: 1,
    minHeight: 44,
    height: '100%',
    ...fontSizes.sm,
    textAlign: 'left',
    color: colors.text,
    alignSelf: 'flex-start',
    textAlignVertical: 'center',
    fontWeight: fontWeights.normal,
    paddingVertical: 0,
    paddingHorizontal: spacing.xs,
  };

  const $helperStyle: TextStyle = {
    marginTop: spacing.xs,
  };

  const $containerStyles = [$containerStyleOverride];
  const $labelStyles = [$labelStyle, LabelTextProps?.style];

  const $rightAccessoryStyle: ViewStyle = {
    height: 44,
    alignItems: 'center',
    marginEnd: spacing.xs,
    justifyContent: 'center',
  };

  const $leftAccessoryStyle: ViewStyle = {
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginStart: spacing.xs,
  };

  const $inputWrapperStyles: StyleProp<ViewStyle> = [
    $inputWrapperStyle,
    status === 'error' && { borderColor: colors.danger600 },
    multiline && {
      minHeight: 96,
      alignItems: 'flex-start',
      paddingVertical: spacing.xs,
    },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 0 },
    disabled && { opacity: 0.75 },
    $inputWrapperStyleOverride,
  ];

  const $inputStyles: StyleProp<TextStyle> = [
    $inputStyle,
    disabled && {
      ...styles.disabled,
    },
    multiline && {
      height: 'auto',
    },
    $inputStyleOverride,
  ];

  const $helperStyles = [
    $helperStyle,
    status === 'error' && { color: colors.danger600 },
    HelperTextProps?.style,
  ];

  function focusInput() {
    if (disabled || nonEditable) {
      return;
    }
    input.current?.focus();
  }

  React.useImperativeHandle(ref, () => input.current as TextInput);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={$containerStyles}
      accessibilityState={{ disabled: status === 'disabled' }}
      onPress={textInputProps?.onPress ? textInputProps?.onPress : focusInput}
    >
      {!!label && (
        <View style={$labelStatusStyle}>
          <Text text={label} preset="formLabel" {...LabelTextProps} style={$labelStyles} />
          {required && <Text text="*" style={{ color: colors.danger600 }} />}
        </View>
      )}

      {!hideInput && (
        <View style={$inputWrapperStyles}>
          {!!LeftAccessory && (
            <LeftAccessory
              style={$leftAccessoryStyle}
              status={status}
              editable={!disabled}
              multiline={textInputProps.multiline ?? false}
            />
          )}

          <TextInput
            ref={input}
            autoCorrect={false}
            editable={!disabled}
            style={$inputStyles}
            autoCapitalize={'none'}
            textAlignVertical="center"
            placeholder={placeholderContent}
            placeholderTextColor={colors.grey400}
            underlineColorAndroid={'rgba(0, 0, 0, 0)'}
            {...textInputProps}
          />

          {!!RightAccessory && (
            <RightAccessory
              style={$rightAccessoryStyle}
              status={status}
              editable={!disabled}
              multiline={textInputProps.multiline ?? false}
            />
          )}
        </View>
      )}

      {!!helper && (
        <Text preset="formHelper" text={helper} {...HelperTextProps} style={$helperStyles} />
      )}
    </TouchableOpacity>
  );
});

/**
 * Extend the TextFieldProps with react-hook-form's UseControllerProps
 */
export interface ControlledTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, 'onChangeText' | 'value' | 'defaultValue'>,
    UseControllerProps<T> {
  defaultValue?: T[keyof T];
}

/**
 * A controlled TextField that integrates with react-hook-form.
 * @param {ControlledTextFieldProps} props - The props for the ControlledTextField component.
 * @returns {JSX.Element} The rendered ControlledTextField component.
 */
export const ControlledTextField = React.forwardRef(function ControlledTextField<
  T extends FieldValues,
>(props: ControlledTextFieldProps<T>, ref: React.Ref<TextInput>) {
  const { name, control, rules, defaultValue, ...textFieldProps } = props;

  const {
    field,
    fieldState: { error, invalid },
    formState: { isSubmitting, isDirty },
  } = useController({ control, name, rules, defaultValue });

  const onInputChange = (text: string) => {
    field.onChange(text);

    /**
     * check if limit is reached if passed then close the input field
     */
    if (textFieldProps.maxLength && text.length >= textFieldProps.maxLength) {
      field.onBlur();
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
      }
    }
  };

  const isFieldInvalid = error && invalid && !isSubmitting;

  /**
   * Set the status of the input field based on the form state.
   */
  const status = isSubmitting && isDirty ? 'disabled' : isFieldInvalid ? 'error' : undefined;

  /**
   * Set the helper text based on the form state.
   */
  const helper = error?.message ? props.helper : '';

  return (
    <TextField
      ref={ref}
      status={status}
      helper={helper}
      onBlur={field.onBlur}
      onChangeText={onInputChange}
      defaultValue={(field.value as string) || ''}
      {...textFieldProps}
    />
  );
});

/**
 * The display name of the `TextField` component.
 * @type {string}
 */
ControlledTextField.displayName = 'ControlledTextField';

export default TextField;
