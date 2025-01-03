const mockGradientFile = {
  colors: ['red', 'green'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

const createMockLinearGradient = (props: any) => ({
  ...props,
  start: mockGradientFile.start,
  end: mockGradientFile.end,
  colors: mockGradientFile.colors,
});

export const LinearGradient = createMockLinearGradient({
  style: { height: 100, width: 100 },
});

jest.doMock('react-native-linear-gradient', () => ({
  LinearGradient: jest.fn((props) => createMockLinearGradient(props)),
}));
