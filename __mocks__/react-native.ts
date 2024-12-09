import * as ReactNative from 'react-native';

const { BootSplash } = ReactNative.NativeModules;

const mockFile = {
  scale: 2.0,
  width: 100,
  height: 100,
  uri: 'https://placekitten.com/200/200',
};

jest.doMock('react-native', () => {
  let url = 'https://dev.healthflex.in';
  const getInitialURL = () => Promise.resolve(url);

  let count = 0;
  let appState: ReactNative.AppStateStatus = 'active';

  const changeListeners: Record<number, (state: ReactNative.AppStateStatus) => void> = {};

  // Tests will run with the app in a typical small screen size by default. We do this since the react-native test renderer
  // runs against index.native.js source and so anything that is testing a component reliant on withWindowDimensions()
  // would be most commonly assumed to be on a mobile phone vs. a tablet or desktop style view. This behavior can be
  // overridden by explicitly setting the dimensions inside a test via Dimensions.set()
  let dimensions: Record<string, number> = {
    width: 300,
    height: 700,
    scale: 1,
    fontScale: 1,
  };

  type ReactNativeMock = typeof ReactNative & {
    NativeModules: typeof ReactNative.NativeModules & {
      BootSplash: {
        hide: typeof BootSplash.hide;
        logoSizeRatio: number;
        navigationBarHeight: number;
      };
    };
    Linking: typeof ReactNative.Linking & {
      setInitialURL: (newUrl: string) => void;
    };
    AppState: typeof ReactNative.AppState & {
      emitCurrentTestState: (state: ReactNative.AppStateStatus) => void;
    };
  };

  const reactNativeMock = Object.setPrototypeOf(
    {
      NativeModules: {
        ...ReactNative.NativeModules,
        BootSplash: {
          hide: jest.fn(),
          logoSizeRatio: 1,
          navigationBarHeight: 0,
        },
        StartupTimer: { stop: jest.fn() },
      },
      Linking: {
        ...ReactNative.Linking,
        getInitialURL,
        setInitialURL(newUrl: string) {
          url = newUrl;
        },
      },
      AppState: {
        ...ReactNative.AppState,
        get currentState() {
          return appState;
        },
        emitCurrentTestState(state: ReactNative.AppStateStatus) {
          appState = state;
          Object.entries(changeListeners).forEach(([, listener]) => listener(appState));
        },
        addEventListener(
          type: ReactNative.AppStateEvent,
          listener: (state: ReactNative.AppStateStatus) => void,
        ) {
          if (type === 'change') {
            const originalCount = count;
            changeListeners[originalCount] = listener;
            ++count;
            return {
              remove: () => {
                delete changeListeners[originalCount];
              },
            };
          }

          return ReactNative.AppState.addEventListener(type, listener);
        },
      },
      Dimensions: {
        ...ReactNative.Dimensions,
        addEventListener: jest.fn(() => ({ remove: jest.fn() })),
        get: () => dimensions,
        set: (newDimensions: Record<string, number>) => {
          dimensions = newDimensions;
        },
      },

      // `runAfterInteractions` method would normally be triggered after the native animation is completed,
      // we would have to mock waiting for the animation end and more state changes,
      // so it seems easier to just run the callback immediately in tests.
      InteractionManager: {
        ...ReactNative.InteractionManager,
        runAfterInteractions: (callback: () => void) => {
          callback();
          return { cancel: () => {} };
        },
      },
      StyleSheet: {
        ...ReactNative.StyleSheet,
        create: (styles: any) => styles, // Mocking StyleSheet.create to return the input
        flatten: jest.fn((style) => style), // Mocking flatten to return the input style as-is
      },
      Image: {
        ...ReactNative.Image,
        resolveAssetSource: jest.fn((_source) => mockFile),
        getSize: jest.fn(
          (
            _uri: string,
            success: (width: number, height: number) => void,
            _failure?: (_error: any) => void,
          ) => success(100, 100),
        ),
      },
    },
    ReactNative,
  ) as ReactNativeMock;

  return reactNativeMock;
});
