/* eslint-disable @next/next/no-img-element */
import gnb from "@/styles/gnb.module.scss";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { signIn, signOut } from "@/hooks/firebase_client_auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const GNB = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  const menuRef = useRef<HTMLDivElement>(null);
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  const router = useRouter();

  const signInHandler = async () => {
    try {
      await signIn();
    } catch (err) {
      console.error(err);
      await signOutHandler();
    }
  };

  const signOutHandler = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMenu = () => {
    const current = menuRef.current;
    if (current) {
      current.classList.toggle(gnb.show);
    }
  };

  return (
    <div className={gnb.container}>
      <Link className={gnb.home_link} href="/">
        Pairz!
      </Link>
      <hr />
      <Link href="/image">SHOWCASE</Link>
      <hr />
      <Link href="/score">SCORE</Link>
      <hr />
      {userInfo ? (
        <div className={gnb.menu_button}>
          <div className={gnb.user_interface} onClick={handleMenu}>
            <div className={gnb.user_name}>{userInfo.displayName ?? ""}</div>
            <div className={gnb.user_photo_container}>
              {failToGetImage ? (
                <img
                  src="/user_icon.png"
                  width="96px"
                  height="96px"
                  alt="user_photoURL_failed"
                />
              ) : (
                <img
                  src={userInfo?.photoURL ?? "/user_icon.png"}
                  width="96px"
                  height="96px"
                  alt="user_photoURL"
                  onError={() => setFailToGetImage(() => true)}
                />
              )}
            </div>
          </div>
          {/* 토글메뉴 */}
          <div className={gnb.menu} ref={menuRef}>
            <div className={gnb.menu_title}>MENU</div>
            <hr />
            <Link className={gnb.upload_link} href="/image/upload">
              UPLOAD
            </Link>
            <button className={gnb.signout_button} onClick={signOutHandler}>
              SIGNOUT
            </button>
            <button className={gnb.menu_close_button} onClick={handleMenu}>
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>
        </div>
      ) : (
        <button className={gnb.signin_button} onClick={signInHandler}>
          로그인
        </button>
      )}
    </div>
  );
};

export default GNB;
