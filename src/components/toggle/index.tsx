import React from 'react';
import Animated, {
  withTiming,
  interpolate,
  Extrapolation,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  View,
  Image,
  Platform,
  ViewProps,
  ViewStyle,
  StyleProp,
  TextStyle,
  ImageStyle,
  SwitchProps,
  TextInputProps,
  TouchableOpacity,
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native';

import { spacing } from '@theme';
import { useTheme } from '@contexts';
import { Text, TextProps } from '../text';
import { iconRegistry, IconTypes } from '../icon';

export type Variants = 'checkbox' | 'switch' | 'radio';

export interface BaseToggleProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * The variant of the toggle.
   * Options: "checkbox", "switch", "radio"
   * Default: "checkbox"
   */
  variant?: unknown;

  /**
   * A style modifier for different input states.
   */
  status?: 'error' | 'disabled';

  /**
   * If false, input is not editable. The default value is true.
   */
  editable?: TextInputProps['editable'];

  /**
   * The value of the field. If true the component will be turned on.
   */
  value?: boolean;

  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: SwitchProps['onValueChange'];

  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>;

  /**
   * Optional input wrapper style override.
   * This gives the inputs their size, shape, "off" background-color, and outer border.
   */
  inputOuterStyle?: ViewStyle;

  /**
   * Optional input style override.
   * This gives the inputs their inner characteristics and "on" background-color.
   */
  inputInnerStyle?: ViewStyle;

  /**
   * The position of the label relative to the action component.
   * Default: right
   */
  labelPosition?: 'left' | 'right';

  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps['text'];

  /**
   * Style overrides for label text.
   */
  labelStyle?: StyleProp<TextStyle>;

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
}

export interface CheckboxToggleProps extends BaseToggleProps {
  /**
   * variant props set as default to 'checkbox'
   */
  variant?: 'checkbox';

  /**
   * Optional style prop that affects the Image component.
   */
  inputDetailStyle?: ImageStyle;

  /**
   * Checkbox-only prop that changes the icon used for the "on" state.
   */
  checkboxIcon?: IconTypes;
}

export interface RadioToggleProps extends BaseToggleProps {
  /**
   * variant props set as default to 'radio'
   */
  variant?: 'radio';

  /**
   * Optional style prop that affects the dot View.
   */
  inputDetailStyle?: ViewStyle;
}

export interface SwitchToggleProps extends BaseToggleProps {
  /**
   * variant props set as default to 'switch'
   */
  variant?: 'switch';

  /**
   * Switch-only prop that adds a text/icon label for on/off states.
   */
  switchAccessibilityMode?: 'text' | 'icon';

  /**
   * Optional style prop that affects the knob View.
   * Note: `width` and `height` rules should be points (numbers), not percentages.
   */
  inputDetailStyle?: Omit<ViewStyle, 'width' | 'height'> & { width?: number; height?: number };
}

export type ToggleProps = CheckboxToggleProps | RadioToggleProps | SwitchToggleProps;

export interface ToggleInputProps {
  on: boolean;
  disabled: boolean;
  outerStyle: ViewStyle;
  innerStyle: ViewStyle;
  status: BaseToggleProps['status'];
  checkboxIcon?: CheckboxToggleProps['checkboxIcon'];
  detailStyle: Omit<ViewStyle & ImageStyle, 'overflow'>;
  switchAccessibilityMode?: SwitchToggleProps['switchAccessibilityMode'];
}

const BaseStyles = {
  inputOuter: {
    flexGrow: 0,
    flexShrink: 0,
    borderWidth: 2,
    width: spacing.lg,
    height: spacing.lg,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,

  inputInner: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  inputWrapper: {
    flexGrow: 0,
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  helper: {
    marginTop: spacing.xs,
  } as TextStyle,

  label: {
    flex: 1,
  } as TextStyle,

  labelRight: {
    marginStart: spacing.md,
  } as TextStyle,

  labelLeft: {
    marginEnd: spacing.md,
  } as TextStyle,
} as const;

const VariantStyles = {
  checkbox: {
    outer: [BaseStyles.inputOuter, { borderRadius: 4 }],
    detail: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    } as ImageStyle,
  },

  radio: {
    outer: [BaseStyles.inputOuter, { height: spacing.md, width: spacing.md, borderRadius: 12 }],
    detail: {
      width: 8,
      height: 8,
      borderRadius: 4,
    } as ViewStyle,
  },

  switch: {
    outer: [BaseStyles.inputOuter, { height: 32, width: 56, borderRadius: 16, borderWidth: 0 }],
    inner: {
      width: '100%',
      height: '100%',
      paddingEnd: 4,
      paddingStart: 4,
      overflow: 'hidden',
      alignItems: 'center',
      position: 'absolute',
    } as ViewStyle,

    detail: {
      width: 24,
      height: 24,
      borderRadius: 12,
      position: 'absolute',
    } as ViewStyle,

    accessibility: {
      base: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
      } as ViewStyle,

      icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
      } as ImageStyle,

      line: {
        width: 2,
        height: 12,
      } as ViewStyle,

      circle: {
        width: 12,
        height: 12,
        borderRadius: 6,
      } as ViewStyle,
    },
  },
} as const;

/**
 * Renders a boolean input.
 * This is a controlled component that requires an onValueChange callback that updates the value prop in order for the component to reflect user actions. If the value prop is not updated, the component will continue to render the supplied value prop instead of the expected result of any user actions.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Toggle/}
 * @param {ToggleProps} props - The props for the `Toggle` component.
 * @returns {JSX.Element} The rendered `Toggle` component.
 */
export function Toggle(props: ToggleProps) {
  const {
    value,
    status,
    helper,
    onPress,
    onValueChange,
    HelperTextProps,
    editable = true,
    variant = 'checkbox',
    labelPosition = 'right',
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    ...WrapperProps
  } = props;
  const { checkboxIcon } = props as CheckboxToggleProps;
  const { switchAccessibilityMode } = props as SwitchToggleProps;

  const { colors } = useTheme();

  const disabled = editable === false || status === 'disabled' || props.disabled;

  const Wrapper = React.useMemo(
    () =>
      (disabled ? View : TouchableOpacity) as React.ComponentType<
        TouchableOpacityProps | ViewProps
      >,
    [disabled],
  );
  const ToggleInput = React.useMemo(() => ToggleInputs[variant] || (() => null), [variant]);

  const $containerStyles = [$containerStyleOverride];
  const $inputWrapperStyles = [BaseStyles.inputWrapper, $inputWrapperStyleOverride];
  const $helperStyles = [
    BaseStyles.helper,
    status === 'error' && { color: colors.danger500 },
    HelperTextProps?.style,
  ];

  /**
   * @param {GestureResponderEvent} e - The event object.
   */
  function handlePress(e: GestureResponderEvent) {
    if (disabled) return;
    onValueChange?.(!value);
    onPress?.(e);
  }

  return (
    <Wrapper
      activeOpacity={1}
      accessibilityRole={variant}
      accessibilityState={{ checked: value, disabled }}
      {...WrapperProps}
      style={$containerStyles}
      onPress={handlePress}
    >
      <View style={$inputWrapperStyles}>
        {labelPosition === 'left' && <FieldLabel {...props} labelPosition={labelPosition} />}

        <ToggleInput
          on={!!value}
          status={status}
          disabled={!!disabled}
          checkboxIcon={checkboxIcon}
          outerStyle={props.inputOuterStyle ?? {}}
          innerStyle={props.inputInnerStyle ?? {}}
          switchAccessibilityMode={switchAccessibilityMode}
          detailStyle={(props.inputDetailStyle as Omit<ViewStyle & ImageStyle, 'overflow'>) ?? {}}
        />

        {labelPosition === 'right' && <FieldLabel {...props} labelPosition={labelPosition} />}
      </View>

      {!!helper && (
        <Text text={helper} preset="formHelper" {...HelperTextProps} style={$helperStyles} />
      )}
    </Wrapper>
  );
}

const ToggleInputs: Record<Variants, React.FC<ToggleInputProps>> = {
  checkbox: Checkbox,
  switch: Switch,
  radio: Radio,
};

/**
 * @param {ToggleInputProps} props - The props for the `Checkbox` component.
 * @returns {JSX.Element} The rendered `Checkbox` component.
 */
function Checkbox(props: ToggleInputProps) {
  const {
    on,
    status,
    disabled,
    checkboxIcon,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props;

  const { colors } = useTheme();

  const offBackgroundColor = [
    disabled ? colors.primary100 : undefined,
    status === 'error' ? colors.danger100 : undefined,
    colors.white100,
  ].filter(Boolean)[0];

  const onBackgroundColor = [
    disabled ? colors.transparent : undefined,
    status === 'error' ? colors.danger100 : undefined,
    colors.primary300,
  ].filter(Boolean)[0];

  const outerBorderColor = [
    disabled ? colors.primary100 : undefined,
    status === 'error' ? colors.danger500 : undefined,
    colors.primary300,
  ].filter(Boolean)[0];

  const iconTintColor = [
    disabled ? colors.white300 : undefined,
    status === 'error' ? colors.danger500 : undefined,
    colors.white100,
  ].filter(Boolean)[0];

  return (
    <View
      style={[
        VariantStyles.checkbox.outer,
        {
          backgroundColor: on ? onBackgroundColor : offBackgroundColor,
          borderColor: outerBorderColor,
        },
        $outerStyleOverride,
      ]}
    >
      <View
        style={[
          BaseStyles.inputInner,
          { backgroundColor: on ? onBackgroundColor : offBackgroundColor },
          $innerStyleOverride,
          on ? { opacity: 1 } : { opacity: 0 },
        ]}
      >
        <Image
          source={checkboxIcon ? iconRegistry[checkboxIcon] : iconRegistry.check}
          style={[
            VariantStyles.checkbox.detail,
            !!iconTintColor && { tintColor: iconTintColor },
            $detailStyleOverride,
          ]}
        />
      </View>
    </View>
  );
}

/**
 * @param {ToggleInputProps} props - The props for the `Radio` component.
 * @returns {JSX.Element} The rendered `Radio` component.
 */
function Radio(props: ToggleInputProps) {
  const {
    on,
    status,
    disabled,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props;

  const { colors } = useTheme();

  const offBackgroundColor = [
    disabled ? colors.primary100 : undefined,
    status === 'error' ? colors.danger100 : undefined,
    colors.grey200,
  ].filter(Boolean)[0];

  const onBackgroundColor = [
    disabled ? colors.transparent : undefined,
    status === 'error' ? colors.danger100 : undefined,
    colors.primary500,
  ].filter(Boolean)[0];

  const outerBorderColor = [
    disabled ? colors.primary100 : undefined,
    status === 'error' ? colors.danger500 : undefined,
    !on ? colors.grey200 : undefined,
    colors.primary300,
  ].filter(Boolean)[0];

  const dotBackgroundColor = [
    disabled ? colors.white300 : undefined,
    status === 'error' ? colors.danger500 : undefined,
    colors.white100,
  ].filter(Boolean)[0];

  const $opacityStyle = useAnimatedStyle(
    () => ({
      opacity: disabled ? withTiming(on ? 0.5 : 1) : withTiming(on ? 1 : 0),
    }),
    [on],
  );

  return (
    <View
      style={[
        VariantStyles.radio.outer,
        { backgroundColor: offBackgroundColor, borderColor: outerBorderColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          BaseStyles.inputInner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          $opacityStyle,
        ]}
      >
        <View
          style={[
            VariantStyles.radio.detail,
            { backgroundColor: dotBackgroundColor },
            $detailStyleOverride,
          ]}
        />
      </Animated.View>
    </View>
  );
}

/**
 * @param {ToggleInputProps} props - The props for the `Switch` component.
 * @returns {JSX.Element} The rendered `Switch` component.
 */
function Switch(props: ToggleInputProps) {
  const {
    on,
    status,
    disabled,
    outerStyle: $outerStyleOverride,
    innerStyle: $innerStyleOverride,
    detailStyle: $detailStyleOverride,
  } = props;

  const { colors } = useTheme();

  const knobSizeFallback = 2;

  const knobWidth = [
    $detailStyleOverride?.width,
    VariantStyles.switch.detail.width,
    knobSizeFallback,
  ].find((v) => typeof v === 'number');

  const knobHeight = [
    $detailStyleOverride?.height,
    VariantStyles.switch.detail.height,
    knobSizeFallback,
  ].find((v) => typeof v === 'number');

  const offBackgroundColor = [
    colors.primary300,
    disabled ? colors.primary100 : undefined,
    status === 'error' ? colors.danger100 : undefined,
  ].filter(Boolean)[0];

  const onBackgroundColor = [
    colors.primary500,
    disabled ? colors.transparent : undefined,
    status === 'error' ? colors.danger100 : undefined,
  ].filter(Boolean)[0];

  const knobBackgroundColor = (function () {
    if (on) {
      return [
        colors.white100,
        $detailStyleOverride?.backgroundColor,
        disabled ? colors.primary500 : undefined,
        status === 'error' ? colors.danger500 : undefined,
      ].filter(Boolean)[0];
    } else {
      return [
        colors.white200,
        $innerStyleOverride?.backgroundColor,
        disabled ? colors.primary500 : undefined,
        status === 'error' ? colors.danger500 : undefined,
      ].filter(Boolean)[0];
    }
  })();

  const $animatedSwitchKnob = useAnimatedStyle(() => {
    const offsetLeft = ($innerStyleOverride?.paddingStart ||
      $innerStyleOverride?.paddingLeft ||
      VariantStyles.switch.inner?.paddingStart ||
      VariantStyles.switch.inner?.paddingLeft ||
      0) as number;

    const offsetRight = ($innerStyleOverride?.paddingEnd ||
      $innerStyleOverride?.paddingRight ||
      VariantStyles.switch.inner?.paddingEnd ||
      VariantStyles.switch.inner?.paddingRight ||
      0) as number;

    // For RTL support:
    // - web flip input range to [1,0]
    // - outputRange doesn't want rtlAdjustment
    const rtlAdjustment = 1;
    const inputRange = Platform.OS === 'web' ? [0, 1] : [0, 1];
    const outputRange =
      Platform.OS === 'web'
        ? [offsetLeft, +(knobWidth || 0) + offsetRight]
        : [rtlAdjustment * offsetLeft, rtlAdjustment * (+(knobWidth || 0) + offsetRight)];

    const translateX = interpolate(on ? 1 : 0, inputRange, outputRange, Extrapolation.CLAMP);

    return { transform: [{ translateX: withTiming(translateX) }] };
  }, [on, knobWidth]);

  const $opacityStyle = useAnimatedStyle(
    () => ({
      opacity: disabled ? withTiming(on ? 0.5 : 1) : withTiming(on ? 1 : 0),
    }),
    [on],
  );

  return (
    <View
      style={[
        VariantStyles.switch.outer,
        { backgroundColor: offBackgroundColor },
        $outerStyleOverride,
      ]}
    >
      <Animated.View
        style={[
          VariantStyles.switch.inner,
          { backgroundColor: onBackgroundColor },
          $innerStyleOverride,
          $opacityStyle,
        ]}
      />

      <SwitchAccessibilityLabel {...props} role="on" />
      <SwitchAccessibilityLabel {...props} role="off" />

      <Animated.View
        style={[
          VariantStyles.switch.detail,
          $detailStyleOverride,
          $animatedSwitchKnob,
          { width: knobWidth, height: knobHeight },
          { backgroundColor: knobBackgroundColor },
        ]}
      />
    </View>
  );
}

/**
 * @param {ToggleInputProps & { role: "on" | "off" }} props - The props for the `SwitchAccessibilityLabel` component.
 * @returns {JSX.Element} The rendered `SwitchAccessibilityLabel` component.
 */
function SwitchAccessibilityLabel(props: ToggleInputProps & { role: 'on' | 'off' }) {
  const { on, disabled, status, switchAccessibilityMode, role, innerStyle, detailStyle } = props;
  const { colors } = useTheme();

  if (!switchAccessibilityMode) return null;

  const shouldLabelBeVisible = (on && role === 'on') || (!on && role === 'off');

  const $switchAccessibilityStyle: StyleProp<ViewStyle> = [
    VariantStyles.switch.accessibility.base,
    role === 'off' && { end: '5%' },
    role === 'on' && { left: '5%' },
  ];

  const color = (function () {
    if (disabled) return colors.primary500;
    if (status === 'error') return colors.danger500;
    if (!on) return innerStyle?.backgroundColor || colors.white300;
    return detailStyle?.backgroundColor || colors.white100;
  })();

  return (
    <View style={$switchAccessibilityStyle}>
      {switchAccessibilityMode === 'text' && shouldLabelBeVisible && (
        <View
          style={[
            role === 'on' && VariantStyles.switch.accessibility.line,
            role === 'on' && { backgroundColor: color },
            role === 'off' && VariantStyles.switch.accessibility.circle,
            role === 'off' && { borderColor: color },
          ]}
        />
      )}

      {switchAccessibilityMode === 'icon' && shouldLabelBeVisible && (
        <Image
          style={[VariantStyles.switch.accessibility.icon, { tintColor: color }]}
          source={role === 'off' ? iconRegistry.hidden : iconRegistry.view}
        />
      )}
    </View>
  );
}

/**
 * @param {BaseToggleProps} props - The props for the `FieldLabel` component.
 * @returns {JSX.Element} The rendered `FieldLabel` component.
 */
function FieldLabel(props: BaseToggleProps) {
  const { status, label, LabelTextProps, labelPosition, labelStyle: $labelStyleOverride } = props;

  const { colors } = useTheme();

  if (!label && !LabelTextProps?.children) return null;

  const $labelStyle = [
    BaseStyles.label,
    status === 'error' && { color: colors.danger500 },
    labelPosition === 'right' && BaseStyles.labelRight,
    labelPosition === 'left' && BaseStyles.labelLeft,
    $labelStyleOverride,
    LabelTextProps?.style,
  ];

  return <Text preset="formLabel" text={label} {...LabelTextProps} style={$labelStyle} />;
}

/**
 * The display name of the `Toggle` component.
 * @type {string}
 */
Toggle.displayName = 'Toggle';

export default Toggle;
