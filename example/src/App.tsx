import { View, StyleSheet } from 'react-native';
import { Text, ThemeProvider, Chip, Card, TextField, CircularProgress } from '@teamhealthflex/ui';

import { storage } from './storage';

export default function App() {
  return (
    <ThemeProvider storage={storage} defaultTheme="light" storageKey="HF_THEME_STORAGE">
      <View style={styles.container}>
        {/* Demo Text Component */}
        <Text>text demo component</Text>

        {/* Demo Chip Component */}
        <Chip text="Demo Chip" size="md" preset="info" variant="outline" style={styles.chip} />

        {/* Demo Card Component */}
        <Card
          heading="Card Title"
          content="This is the content of the card."
          footer="Footer text"
          raised={true}
          style={styles.card}
        />

        {/* Demo TextField Component */}
        <View style={styles.inputContainer}>
          <TextField label="Name" placeholder="Enter your name" style={styles.input} />
        </View>

        {/* Demo CircularProgress Component */}
        <CircularProgress
          size={100}
          progress={75}
          centerText="75%"
          strokeWidth={10}
          primaryColor="#48D6E0"
          secondaryColor="#2AEEA2"
          backgroundStrokeColor="#E0E0E0"
          centerTextStyle={styles.centerText}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    marginVertical: 20,
  },
  card: {
    marginVertical: 20,
    width: '90%',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#CCC',
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },
  centerText: {
    color: 'black',
    fontSize: 12,
  },
});
