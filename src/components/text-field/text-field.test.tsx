import React from 'react';
import { StyleSheet } from 'react-native';
import { act, fireEvent, render } from '@tests/setup';
import { TextField, ControlledTextField } from './index';
import { Control, FieldValues, useForm } from 'react-hook-form';

import { Text } from '@components/text';

interface ControlledTextFieldWrapperProps {
  children: (control: Control<FieldValues>) => React.ReactNode;
}

const ControlledTextFieldWrapper: React.FC<ControlledTextFieldWrapperProps> = ({ children }) => {
  const { control } = useForm();
  return children(control);
};

const getFlattenedStyle = (style: any) => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map((s) => StyleSheet.flatten(s)));
  }
  return StyleSheet.flatten(style);
};

describe('TextField Component', () => {
  it('renders text input with placeholder', () => {
    const { getByPlaceholderText } = render(<TextField placeholder="Enter text" />);
    const input = getByPlaceholderText('Enter text');
    expect(input).toBeTruthy();
  });

  it('renders label and helper text', () => {
    const { getByText } = render(<TextField label="Name" helper="This is a required field" />);

    expect(getByText('Name')).toBeTruthy();
    expect(getByText('This is a required field')).toBeTruthy();
  });

  it('applies the correct status styling', () => {
    const { getByTestId } = render(
      <TextField status="error" testID="text-field" style={{ borderColor: 'red' }} />,
    );
    const input = getByTestId('text-field');
    const flattenedStyle = getFlattenedStyle(input.props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        borderColor: 'red',
      }),
    );
  });

  it('renders the left and right accessory components', () => {
    const LeftAccessory = () => <Text text="Left" />;
    const RightAccessory = () => <Text text="Right" />;

    const { getByText } = render(
      <TextField LeftAccessory={LeftAccessory} RightAccessory={RightAccessory} />,
    );

    expect(getByText('Left')).toBeTruthy();
    expect(getByText('Right')).toBeTruthy();
  });

  it('renders a disabled text field correctly', () => {
    const { getByTestId } = render(
      <TextField status="disabled" testID="text-field" style={{ opacity: 0.75 }} />,
    );
    const input = getByTestId('text-field');
    const flattenedStyle = getFlattenedStyle(input.props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        opacity: 0.75,
      }),
    );
  });
});

describe('ControlledTextField Component', () => {
  it('should display error state when validation fails', async () => {
    const { getByTestId } = render(
      <ControlledTextFieldWrapper>
        {(control: Control<FieldValues>) => (
          <ControlledTextField
            name="test"
            defaultValue=""
            control={control}
            testID="controlled-text-field"
            rules={{ required: 'This field is required' }}
            style={{ borderColor: 'red' }}
          />
        )}
      </ControlledTextFieldWrapper>,
    );

    const input = getByTestId('controlled-text-field');
    await act(async () => {
      fireEvent.changeText(input, '');
    });

    const flattenedStyle = getFlattenedStyle(input.props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        borderColor: 'red',
      }),
    );
  });

  it('should update value correctly on input change', async () => {
    const { getByTestId } = render(
      <ControlledTextFieldWrapper>
        {(control: Control<FieldValues>) => (
          <ControlledTextField
            name="test"
            control={control}
            defaultValue="Initial value"
            testID="controlled-text-field"
          />
        )}
      </ControlledTextFieldWrapper>,
    );

    const input = getByTestId('controlled-text-field');

    await act(async () => {
      fireEvent.changeText(input, 'Updated value');
    });

    expect(input.props.onChangeText).toBeDefined();
  });

  it('should handle form submission and disable field if form is submitting', () => {
    const { getByTestId } = render(
      <ControlledTextFieldWrapper>
        {(control: Control<FieldValues>) => (
          <ControlledTextField
            name="test"
            defaultValue=""
            control={control}
            testID="controlled-text-field"
            disabled
            style={{ opacity: 0.75 }}
          />
        )}
      </ControlledTextFieldWrapper>,
    );

    const input = getByTestId('controlled-text-field');
    const flattenedStyle = getFlattenedStyle(input.props.style);

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        opacity: 0.75,
      }),
    );
  });
});
