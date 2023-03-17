/** 유닉스 시간을 반환
 *
 *  서버에서 사용
 *
 *  Localtime default utc+9
 */
export const getNow = (isLocalTime: boolean) => {
  if (isLocalTime) {
    return Date.now() + +(process.env.local_time ?? 32400000);
  } else {
    return Date.now();
  }
};
