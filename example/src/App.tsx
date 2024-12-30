import { View, StyleSheet } from 'react-native';
import { Text, ThemeProvider, Chip, Card } from '@teamhealthflex/ui';

import { storage } from './storage';

export default function App() {
  return (
    <ThemeProvider storage={storage} defaultTheme="light" storageKey="HF_THEME_STORAGE">
      <View style={styles.container}>
        <Text>text demo component</Text>
        <Chip text="Demo Chip" size="md" preset="info" variant="outline" style={styles.chip} />
        <Card
          heading="Card Title"
          content="This is the content of the card."
          footer="Footer text"
          raised={true}
          style={styles.card}
        />
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
  chip: {
    marginTop: 20,
  },
  card: {
    marginTop: 20,
    width: '90%',
  },
});
