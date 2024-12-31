import type { Config } from 'jest';

const config: Config = {
  preset: 'react-native',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.ts'],
  transform: {
    '^.+\\.(js)$': ['babel-jest', { plugins: ['babel-plugin-syntax-hermes-parser'] }],
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|@expo/vector-icons|expo-linear-gradient|expo-modules-core)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/', '<rootDir>/example/node_modules'],
  moduleNameMapper: {
    '^@tests$': '<rootDir>/tests',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@contexts$': '<rootDir>/src/contexts',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@components$': '<rootDir>/src/components',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@theme$': '<rootDir>/src/theme',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
  },
  globals: {
    __DEV__: true,
    __TEST__: true,
  },
  fakeTimers: {
    enableGlobally: true,
  },
};

export default config;
