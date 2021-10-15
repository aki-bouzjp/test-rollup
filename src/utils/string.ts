export const randomString = (length: number = 8): string => (
  Math.random().toString(length).substring(2)
);
