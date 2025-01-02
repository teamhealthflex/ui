import { EdgeInsets } from 'react-native-safe-area-context';

// Define environment type
type Environment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';

// Function to generate the env object
const createEnvironmentObject = <T extends Record<string, string>>(obj: T) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[key as Environment] = obj[key as keyof T] as Environment;
      return acc;
    },
    {} as Record<Environment, Environment>,
  );
};

// function to convert string to title case
export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// function to extract date number and day from the iso string
export function extractDateNumberAndDay(isoString: string): { dateNumber: number; day: string } {
  const dateObj = new Date(isoString);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = dayNames[dateObj.getUTCDay()]?.slice(0, 3)!; // getUTCDay() returns the day of the week (0-6) according to universal time

  const dateNumber = dateObj.getUTCDate(); // getUTCDate() returns the day of the month (1-31) according to universal time

  return { dateNumber: dateNumber, day: day };
}

// function to extract date from the iso string
export function extractDate(isoString: Date | undefined): string {
  if (isoString === undefined) return '';
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

export const getSafeAreaInsets = (insets: EdgeInsets) => {
  return {
    top: insets.top,
    left: insets.left,
    right: insets.right,
    bottom: insets.bottom || 16,
  };
};

// Generate the env object
const env = createEnvironmentObject({
  STAGING: 'stag',
  PRODUCTION: 'prod',
  DEVELOPMENT: 'dev',
});

// Determine environment based on process.env.APP_ENV
let ENVIRONMENT: Environment = env.DEVELOPMENT;
if (process.env.APP_ENV === 'prod') {
  ENVIRONMENT = env.PRODUCTION;
} else if (process.env.APP_ENV === 'stag') {
  ENVIRONMENT = env.STAGING;
}

const utils = {
  env,
  toTitleCase,
  extractDate,
  ENVIRONMENT,
  getSafeAreaInsets,
  extractDateNumberAndDay,
};

export default utils;
