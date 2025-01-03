import React from 'react';
import {
  View,
  Keyboard,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

import { useTheme } from '@contexts';
import { spacing, fontSizes, radius } from '@theme';
import { fontWeights, useCustomStyles } from '@theme';
import { Text, Icon, ModalSheet, useModalSheet } from '@teamhealthflex/ui';

export type Option = {
  label: string;
  value: string | number;
};

export type SelectProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  helper?: string;
  options: Option[];
  style: ViewStyle;
  required?: boolean;
  placeholder?: string;
  multiSelect?: boolean;
  value?: string | number;
  status?: 'error' | 'disabled';
  onClear?: () => void;
  selectedOptions: Option | Option[];
  onSelect: (selected: Option | Option[]) => void;
};

export function Select(props: SelectProps) {
  const {
    label,
    value,
    status,
    helper,
    options,
    onClear,
    onSelect,
    selectedOptions,
    required = false,
    multiSelect = false,
    placeholder = 'Select an option',
    ...textInputProps
  } = props;

  const { colors } = useTheme();
  const { styles } = useCustomStyles();

  const { ref, present, dismiss } = useModalSheet();
  const [selected, setSelected] = React.useState<Option | Option[]>(() => {
    if (value !== undefined) {
      const option = options.find((opt) => opt.value === value);
      return option || selectedOptions;
    }

    return selectedOptions;
  });

  /**
   * Update selected when value or selectedOptions change
   */
  React.useEffect(() => {
    if (value !== undefined) {
      const option = options.find((opt) => opt.value === value);
      if (option) {
        setSelected(option);
      }
    } else {
      setSelected(selectedOptions);
    }
  }, [value, selectedOptions, options]);

  const sheetTitle = label || placeholder;
  const disabled = textInputProps.editable === false || status === 'disabled';
  const $textStyle = [(selected as Option)?.label ? {} : { color: colors.grey400 }];

  const handleSelect = React.useCallback(
    (option: Option) => {
      let newSelected;
      if (multiSelect) {
        if (Array.isArray(selected)) {
          if (selected.some((item) => item.value === option.value)) {
            newSelected = selected.filter((item) => item.value !== option.value);
          } else {
            newSelected = [...selected, option];
          }
        } else {
          newSelected = [option];
        }
      } else {
        newSelected = option;
        dismiss();
      }
      setSelected(newSelected);
      onSelect(newSelected);
    },
    [selected, dismiss, multiSelect, onSelect],
  );

  const isSelected = (option: Option) => {
    if (multiSelect) {
      return Array.isArray(selected) && selected.some((item) => item.value === option.value);
    }
    return (selected as Option)?.value === option.value;
  };

  const bottomSheetOpenHandler = React.useCallback(
    (event: GestureResponderEvent) => {
      event.preventDefault();

      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
      }

      if (!disabled) {
        present();
      }
    },
    [disabled, present],
  );

  const handleClear = React.useCallback(
    (event: GestureResponderEvent) => {
      event.preventDefault();

      setSelected(multiSelect ? [] : []);
      onSelect(multiSelect ? [] : []);
      if (onClear) onClear();
    },
    [multiSelect, onClear, onSelect],
  );

  const isOptSelected = !Array.isArray(selected) && selected;
  const isArraySelected = Array.isArray(selected) && selected.length > 0;
  const isOptionSelected = isOptSelected || isArraySelected;

  const $container: ViewStyle = {
    flex: 1,
    marginBottom: spacing.xs,
  };

  const $textView: ViewStyle = {
    flex: 1,
  };

  const $labelStatusStyle: ViewStyle = {
    flexDirection: 'row',
    marginBottom: -spacing.xxxs,
  };

  const $labelStyle: TextStyle = {
    alignSelf: 'center',
    marginBottom: spacing.xs,
    color: colors.black500,
  };

  const $inputWrapperStyle: ViewStyle = {
    minHeight: 44,
    display: 'flex',
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderColor: colors.grey400,
    backgroundColor: colors.white100,
  };

  const $inputStyle: TextStyle = {
    flex: 1,
    display: 'flex',
    ...fontSizes.sm,
    color: colors.text,
    textAlignVertical: 'center',
    paddingVertical: spacing.xxxs,
    paddingHorizontal: spacing.xs,
    fontWeight: fontWeights.normal,
  };

  const $helperStyle: TextStyle = {
    marginTop: spacing.xs,
  };

  const $option: ViewStyle = {
    width: '100%',
    padding: spacing.sm,
  };

  const $selectedOption: ViewStyle = {
    borderRadius: 4,
    marginVertical: spacing.xxxs,
    backgroundColor: colors.primary300,
  };

  return (
    <>
      <View style={$textView}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={bottomSheetOpenHandler}
          accessibilityState={{ disabled }}
          style={[$container, textInputProps.style, disabled && styles.disabled]}
        >
          {!!label && (
            <View style={$labelStatusStyle}>
              <Text text={label} preset="formLabel" style={$labelStyle} />
              {required && <Text text="*" style={{ color: colors.danger500 }} />}
            </View>
          )}

          <View
            style={[$inputWrapperStyle, status === 'error' && { borderColor: colors.danger500 }]}
          >
            <Text preset="subHeading" style={[$inputStyle, $textStyle]}>
              {multiSelect
                ? Array.isArray(selected) && selected.length > 0
                  ? selected.map((item) => item.label).join(', ')
                  : placeholder
                : (selected as Option)?.label || placeholder}
            </Text>
            {isOptionSelected ? (
              <Icon icon="clear" onPress={handleClear} />
            ) : (
              <Icon icon="arrow-down" onPress={bottomSheetOpenHandler} />
            )}
          </View>

          {!!helper && (
            <Text
              text={helper}
              preset="formHelper"
              style={[$helperStyle, status === 'error' && { color: colors.danger500 }]}
            />
          )}
        </TouchableOpacity>
      </View>

      <ModalSheet enableDynamicSizing title={sheetTitle} ref={ref}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => handleSelect(option)}
            style={[$option, isSelected(option) && $selectedOption]}
          >
            <Text preset="subHeading" style={[isSelected(option) && { color: colors.background }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ModalSheet>
    </>
  );
}

/**
 * The display name of the `Select` component.
 * @type {string}
 */
Select.displayName = 'Select';

export default Select;
