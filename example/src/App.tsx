import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Chip,
  Icon,
  OtpInput,
  TextField,
  ActivityRing,
  ThemeProvider,
  CountDownTimer,
  CircularProgress,
  DailyCalendarStats,
} from '@teamhealthflex/ui';

import { storage } from './storage';

export default function App() {
  const rings = [
    {
      value: 75,
      legendText: 'Ring 1',
      activeStrokeColor: '#48D6E0',
      inActiveStrokeColor: '#E0E0E0',
      activeStrokeSecondaryColor: '#2AEEA2',
    },
    {
      value: 50,
      legendText: 'Ring 2',
      activeStrokeColor: '#FF5733',
      inActiveStrokeColor: '#E0E0E0',
      activeStrokeSecondaryColor: '#FFC300',
    },
    {
      value: 25,
      legendText: 'Ring 3',
      activeStrokeColor: '#C70039',
      inActiveStrokeColor: '#E0E0E0',
      activeStrokeSecondaryColor: '#900C3F',
    },
  ];

  const days = [
    { day: 'Mon', date: '1', checked: true },
    { day: 'Tue', date: '2', checked: false },
    { day: 'Wed', date: '3', checked: true },
    { day: 'Thu', date: '4', checked: false },
    { day: 'Fri', date: '5', checked: true },
    { day: 'Sat', date: '6', checked: false },
    { day: 'Sun', date: '7', checked: false },
  ];

  const footerMessages = ['Great! You’ve exercised 5 days!', 'Keep up the good work!'];

  return (
    <ThemeProvider storage={storage} defaultTheme="light" storageKey="HF_THEME_STORAGE">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
            LeftComponent={<Icon icon="star" size={24} color="#FFD700" />}
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

          {/* Demo ActivityRing Component */}
          <ActivityRing
            rings={rings}
            radius={100}
            showValueText={true}
            title="Activity Progress"
            containerStyle={styles.activityRingContainer}
          />

          {/* Demo CountDownTimer Component */}
          <CountDownTimer
            initialTime={10} // Set initial time to 10 seconds
            onFinish={() => console.log('Countdown finished!')}
            style={styles.timerContainer}
            textStyle={styles.timerText}
          />

          {/* Daily Calendar Stats Component */}
          <DailyCalendarStats
            days={days}
            footerMessages={footerMessages}
            noDaysMessage="No data for this week."
          />

          {/* Demo OtpInput Component */}
          <View style={styles.otpInputContainer}>
            <Text style={styles.otpInputLabel}>Enter OTP</Text>
            <OtpInput pinCount={4} />
          </View>
        </ScrollView>
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
  scrollViewContent: {
    marginVertical: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    marginVertical: 20,
  },
  card: {
    width: '90%',
    marginVertical: 20,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 16,
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
    fontSize: 12,
    color: 'black',
  },
  activityRingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  timerContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  otpInputContainer: {
    width: '100%',
    marginVertical: 20,
    alignItems: 'center',
  },
  otpInputLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
});
