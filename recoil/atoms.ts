import { AuthUserInfo } from "@/models/auth_user_Info";
import { atom } from "recoil";
import { v1 } from "uuid";

export const userInfoAtom = atom<AuthUserInfo | null>({
  key: `userInfoAtom${v1()}`,
  default: null,
});

export const isLoadingAtom = atom({
  key: `authLoadingAtom${v1()}`,
  default: true,
});
