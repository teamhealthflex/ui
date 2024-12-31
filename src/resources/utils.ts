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

const utils = {
  toTitleCase,
  extractDateNumberAndDay,
};

export default utils;
