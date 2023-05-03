import Image from 'next/image';
import Link from 'next/link';
import globalNav from '@/styles/common/header/global_nav.module.scss';
import UserMenu from '@/components/common/header/user_menu';
import header from '@/styles/common/header/header.module.scss';

interface Props {
  signInHandler: () => void;
  signOutHandler: () => void;
}

const GlobalNav = ({ signInHandler, signOutHandler }: Props) => {
  return (
    <div className={header['global-nav']}>
      <div className={globalNav['home']}>
        <Link href="/">
          <Image src="/favicon.png" width={48} height={48} alt="GNB_logo" priority />
        </Link>
      </div>
      <ul className={globalNav['right']}>
        <li>
          <Link href="/showcase">SHOWCASE</Link>
        </li>
        <li>
          <Link href="/score">SCORE</Link>
        </li>
        <li>
          <UserMenu signInHandler={signInHandler} signOutHandler={signOutHandler} />
        </li>
      </ul>
    </div>
  );
};

export default GlobalNav;
