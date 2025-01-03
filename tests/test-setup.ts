import '@testing-library/react-native/extend-expect';

/**
 * Needed for: https://stackoverflow.com/questions/76903168/mocking-libraries-in-jest
 */
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  __esModule: true,
  default: {
    ignoreLogs: jest.fn(),
    ignoreAllLogs: jest.fn(),
  },
}));

/**
 * Turn off the console logs for timing events. They are not relevant for unit tests and create a lot of noise
 */
jest.spyOn(console, 'debug').mockImplementation((...params: string[]) => {
  if (params.at(0)?.startsWith('Timing:')) {
    return;
  }

  // Send the message to console.log but don't re-used console.debug or else this mock method is called in an infinite loop. Instead, just prefix the output with the word "DEBUG"
  console.log('DEBUG', ...params);
});

/**
 * Mock NativeEventEmitter as it is needed to provide mocks of libraries which include it
 */
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

/**
 * This makes FlatList render synchronously for easier testing.
 */
jest.mock(
  '@react-native/virtualized-lists/Interaction/Batchinator',
  () =>
    class SyncBachinator {
      #callback: () => void;

      constructor(callback: () => void) {
        this.#callback = callback;
      }

      schedule() {
        this.#callback();
      }

      dispose() {}
    },
);

jest.mock('react-native-responsive-fontsize', () => {
  return {
    RFValue: jest.fn((value: number, standardScreenHeight: number = 812) => {
      // Mocked implementation, return the input value directly or adjust as needed
      return value * (standardScreenHeight / 812);
    }),
    RFPercentage: jest.fn((percentage: number) => {
      // Mocked implementation, return the input value directly or adjust as needed
      return percentage;
    }),
  };
});

// @ts-ignore
global.window = {};

// @ts-ignore
global.window = global;

declare global {
  // @ts-ignore
  let __TEST__: boolean;
}
