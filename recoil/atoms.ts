import { UserInfo } from "@/models/Info";
import { atom } from "recoil";
import { v1 } from "uuid";

export const userInfoAtom = atom<UserInfo | null>({
  key: `userInfoAtom${v1()}`,
  default: null,
});

export const isLoadingAtom = atom({
  key: `authLoadingAtom${v1()}`,
  default: false,
});

export interface Toast {
  id: number;
  type: "success" | "alert" | "error";
  message: string;
  duration?: number;
}

export const toastStateAtom = atom<Toast[]>({
  key: `toastStateAtom${v1()}`,
  default: [],
});
