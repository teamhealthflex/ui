import { View, StyleSheet } from 'react-native';
import { Text, ThemeProvider } from '@teamhealthflex/ui';

import { storage } from './storage';

export default function App() {
  return (
    <ThemeProvider storage={storage} defaultTheme="light" storageKey="HF_THEME_STORAGE">
      <View style={styles.container}>
        <Text>text demo component</Text>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
