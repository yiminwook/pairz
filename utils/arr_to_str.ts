export const arrToStr = (arr: string | string[] | undefined) => {
  if (Array.isArray(arr)) {
    return arr[0];
  } else {
    return arr;
  }
};
