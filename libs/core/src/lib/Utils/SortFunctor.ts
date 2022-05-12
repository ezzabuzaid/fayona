/**
 * @description
 * Returns a function which will sort an
 * array of objects by the given key.
 *
 */
export const sortBy = <T>(
  key: keyof T,
  reverse: boolean
): ((a: T, b: T) => number) => {
  // Move smaller items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  const moveSmaller = reverse ? 1 : -1;

  // Move larger items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  const moveLarger = reverse ? -1 : 1;

  /**
   * @param a
   * @param b
   * @return
   */
  return (a: T, b: T) => {
    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
};
