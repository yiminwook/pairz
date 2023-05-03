import { userInfoAtom } from '@/recoil/atoms';
import userMenu from '@/styles/common/header/user_menu.module.scss';
import toggleMenu from '@/styles/common/header/toggle_menu.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import ToggleMenu from '@/components/common/header/toggle_menu';
import gravatar from 'gravatar';

interface Props {
  signInHandler: () => void;
  signOutHandler: () => void;
}

const UserMenu = ({ signInHandler, signOutHandler }: Props) => {
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  const userInfo = useRecoilValue(userInfoAtom);

  if (userInfo === null) {
    return (
      <button className={userMenu['sign-in']} onClick={signInHandler}>
        sign In
      </button>
    );
  }

  return (
    <ul className={userMenu['user-menu']}>
      {/* toggle menu trigger */}
      <input type="checkbox" className={toggleMenu['menu__checkbox']} id="toggle-menu__trigger" />
      <label className={userMenu['menu']} htmlFor="toggle-menu__trigger" tabIndex={0}>
        <div className={userMenu['name']}>{userInfo.displayName ?? ''}</div>
        <div className={userMenu['photo']}>
          {failToGetImage ? (
            <Image
              src={gravatar.url(userInfo.email ?? userInfo.uid, { s: '48px', d: 'retro' })}
              width={48}
              height={48}
              alt={`${userInfo.displayName ?? 'user'}-photo`}
            />
          ) : (
            <Image
              src={userInfo?.photoURL ?? '/user_icon.png'}
              width={48}
              height={48}
              alt={`${userInfo.displayName ?? 'user'}-photo`}
              onError={() => setFailToGetImage(() => true)}
            />
          )}
        </div>
      </label>
      <ToggleMenu signOutHandler={signOutHandler} />
    </ul>
  );
};

export default UserMenu;
