import pause from '@/styles/game/pause.module.scss';
import Link from 'next/link';

interface Props {
  countPause: number;
  handlePause: (bool: boolean) => void;
}

const Pause = ({ countPause, handlePause }: Props) => {
  return (
    <div className={pause['container']}>
      <div className={pause['backdrop']} onClick={() => handlePause(false)}></div>
      <div className={pause['modal__content']}>
        <h1 className={pause['modal__title']}>pause</h1>
        <h2 className={pause['modal__desc']}>
          {countPause <= 0
            ? '더이상 pause 할 수 없습니다.'
            : `앞으로 ${Math.ceil(countPause / 2)}회 pause가 가능합니다.`}
        </h2>
        <ul className={pause['modal__list']}>
          <li className={pause['modal__list__home']}>
            <Link href="/">home</Link>
          </li>
          <li>
            <button className={pause['modal__list__close']} onClick={() => handlePause(false)}>
              close
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pause;
