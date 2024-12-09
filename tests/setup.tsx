import React from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';

import { storage } from './utils/storage';
import { ThemeProvider } from '@contexts';

const createAppWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider storage={storage} defaultTheme="light" storageKey="HF_THEME_STORAGE">
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  /**
   * make sure we have a new wrapper for each render
   */
  const Wrapper = createAppWrapper();
  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react-native';
export { customRender as render };
