import React from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardState = () => {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      keyboardHeight,
      isKeyboardShown: keyboardHeight !== 0,
    }),
    [keyboardHeight],
  );

  return contextValue;
};
