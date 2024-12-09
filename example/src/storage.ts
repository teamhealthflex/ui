const localStorage: { [key: string]: string } = {};

export const storage = {
  getItem: (key: string) => {
    if (localStorage[key]) {
      return localStorage[key];
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    localStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorage[key];
  },
};
