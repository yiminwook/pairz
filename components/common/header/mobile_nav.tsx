import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import header from '@/styles/common/header/header.module.scss';

const MobileNav = () => {
  return (
    <nav className={header['mobile']}>
      <label className={header['mobile__nav']} tabIndex={0} htmlFor="toggle-mobile__trigger">
        <div className={header['mobile__button']}>
          <FontAwesomeIcon icon={faMapLocationDot} style={{ color: '#f0ffff', width: '3rem', height: '3rem' }} />
        </div>
      </label>
    </nav>
  );
};

export default MobileNav;
