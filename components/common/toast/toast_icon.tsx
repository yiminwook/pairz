import { Toast } from '@/recoil/atoms';
import { faCircleCheck, faCircleExclamation, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from '@/styles/common/toast.module.scss';

interface Props {
  type: Toast['type'];
}

const ToastIcon = ({ type }: Props) => {
  let iconData: { type: IconDefinition; color: string };

  switch (type) {
    case 'success':
      iconData = { type: faCircleCheck, color: '#3cb043' };
      break;
    case 'alert':
      iconData = { type: faCircleExclamation, color: '#ee9f27' };
      break;
    case 'error':
      iconData = { type: faCircleExclamation, color: '#ff0000' };
      break;
    default:
      iconData = { type: faCircleExclamation, color: '#ee9f27' };
      break;
  }

  return (
    <span>
      <FontAwesomeIcon icon={iconData.type} style={{ width: '1rem', height: '1rem', color: iconData.color }} />
    </span>
  );
};

export default ToastIcon;
