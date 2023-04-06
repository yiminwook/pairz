import { Toast, toastStateAtom } from "@/recoil/atoms";
import { getNow } from "@/utils/get_times";
import { useSetRecoilState } from "recoil";

export const useToast = () => {
  const setToasts = useSetRecoilState(toastStateAtom);

  const removeToast = (toastId: Toast["id"]) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));

  const fireToast = (toast: Omit<Toast, "id">) => {
    const id = Math.floor((getNow(false) + Math.random()) * 10);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 600 + (toast.duration ?? 3000));
  };

  return { fireToast };
};
