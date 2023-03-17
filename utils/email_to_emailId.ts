export const emailToEmailId = (email?: string | null) => {
  return email?.replace(/@(.*)\.(com|co.kr)$/gi, "");
};
