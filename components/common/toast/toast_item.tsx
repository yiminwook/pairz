import { Toast } from "@/recoil/atoms";
import { useEffect, useState } from "react";
import toast from "@/styles/common/toast.module.scss";
import ToastIcon from "./toast_icon";

const ToastItem = ({ type, message, duration }: Toast) => {
  const [isClosing, setIsClosing] = useState(false); //닫는 이벤트

  useEffect(() => {
    setTimeout(() => {
      setIsClosing(true);
    }, duration ?? 3000);
  });

  return (
    <li className={[toast["item"], isClosing ? toast["close"] : ""].join(" ")}>
      <ToastIcon type={type} />
      <p>{message}</p>
    </li>
  );
};

export default ToastItem;
