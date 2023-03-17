/** 숫자로 변환가능한 string일때 true반환 */
export const verifyingIdx = (idx: string | undefined | null): boolean => {
  const isNaN = Number.isNaN(idx);
  return !isNaN && typeof idx === "string";
};
