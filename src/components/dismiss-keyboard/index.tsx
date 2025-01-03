import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export const DismissKeyboard: React.FC<React.PropsWithChildren> = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

/**
 * The display name of the `DismissKeyboard` component.
 * @type {string}
 */
DismissKeyboard.displayName = 'DismissKeyboard';

export default DismissKeyboard;
