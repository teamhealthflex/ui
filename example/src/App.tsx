import { View, StyleSheet } from 'react-native';
import { Text, ThemeProvider, Divider, Button } from '@teamhealthflex/ui';

import { storage } from './storage';

export default function App() {
  return (
    <ThemeProvider storage={storage} defaultTheme="light" storageKey="HF_THEME_STORAGE">
      <View style={styles.container}>
        <Text>Text demo component</Text>
        <Divider line style={styles.divider} type="horizontal" />
        <Button text="Test" />
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
  divider: {
    height: 2,
    width: '50%',
    borderRadius: 20,
    marginVertical: 4,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
});
