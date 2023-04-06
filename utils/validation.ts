/** 숫자로 변환가능한 string일때 true반환 */
export const verifyingIdx = (idx: string | undefined | null): boolean => {
  const isNaN = Number.isNaN(idx);
  return !isNaN && typeof idx === "string";
};

/** 문자열 undefinded null, 특수문자 공백 검증
 *
 *  유효한 문자열일시 true 반환
 */
export const verifyingStr = (str: string | undefined | null): boolean => {
  const strRegExp = /[\s\{\}\[\]\(\)\/?.,;:|*~`!^\-_+<>@\#$%&\\\=\'\"]/g;
  if (str && str.search(strRegExp) < 0) {
    return true;
  }
  return false;
};
