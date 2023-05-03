import Link from 'next/link';
import toggleMenu from '@/styles/common/header/toggle_menu.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface Props {
  signOutHandler: () => void;
}

const ToggleMenu = ({ signOutHandler }: Props) => {
  return (
    <>
      <div className={toggleMenu['toggle-menu']}>
        <ul>
          <div />
          <li className={toggleMenu['upload']}>
            <Link href="/upload">upload</Link>
          </li>
          <li className={toggleMenu['sign-out']}>
            <button onClick={signOutHandler}>sign out</button>
          </li>
          <hr />
          <li className={toggleMenu['close']}>
            <label htmlFor="toggle-menu__trigger" tabIndex={0}>
              <p>close</p>
              <FontAwesomeIcon icon={faXmark} style={{ width: '1rem' }} />
            </label>
          </li>
        </ul>
      </div>
      <label className={toggleMenu['back-drop']} htmlFor="toggle-menu__trigger" />
    </>
  );
};

export default ToggleMenu;
