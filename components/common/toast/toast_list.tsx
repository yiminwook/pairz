import { toastStateAtom } from '@/recoil/atoms';
import { useRecoilValue } from 'recoil';
import ToastItem from '@/components/common/toast/toast_item';
import toast from '@/styles/common/toast.module.scss';

const ToastList = () => {
  const toasts = useRecoilValue(toastStateAtom);
  return (
    <ul className={toast['toast']}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </ul>
  );
};

export default ToastList;
