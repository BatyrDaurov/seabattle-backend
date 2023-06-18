export const isValidCoordinates = (num: number) => {
  if (num >= 0 && num < 10) {
    return num;
  } else {
    return null;
  }
};
