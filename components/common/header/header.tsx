import header from '@/styles/common/header/header.module.scss';
import { signIn, signOut } from '@/hooks/firebase_client_auth';
import { useRouter } from 'next/router';
import GlobalNav from '@/components/common/header/global_nav';
import MobileNav from '@/components/common/header/mobile_nav';

const Header = () => {
  const router = useRouter();

  const signInHandler = async () => {
    await signIn();
  };

  const signOutHandler = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      {/* toggle mobile nav trigger */}
      <input type="checkbox" className={header['mobile__check-box']} id="toggle-mobile__trigger" />
      <GlobalNav signInHandler={signInHandler} signOutHandler={signOutHandler} />
      <MobileNav />
      <div className={header['blank']} />
    </header>
  );
};

export default Header;
