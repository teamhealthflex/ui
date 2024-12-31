import { StyleProp, ViewStyle } from 'react-native';

const mockFile = {
  scale: 2.0,
  width: 100,
  height: 100,
  uri: 'https://placekitten.com/200/200',
};

const createMockIcon = (name: string, style?: StyleProp<ViewStyle>) => ({
  name,
  getImageSource: jest.fn(() => mockFile),
  style,
});

export const Feather = createMockIcon('Feather');
export const Ionicons = createMockIcon('Ionicons');
export const MaterialIcons = createMockIcon('MaterialIcons');
export const MaterialCommunityIcons = createMockIcon('MaterialCommunityIcons');
export const FontAwesome = createMockIcon('FontAwesome');

jest.doMock('@expo/vector-icons', () => ({
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
}));
