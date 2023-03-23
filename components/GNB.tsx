/* eslint-disable @next/next/no-img-element */
import gnb from "@/styles/gnb.module.scss";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { signIn, signOut } from "@/hooks/firebase_client_auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

const GNB = () => {
  const [userInfo, _setUserinfo] = useRecoilState(userInfoAtom);
  const resetUserInfo = useResetRecoilState(userInfoAtom);
  const menuRef = useRef<HTMLDivElement>(null);
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
      resetUserInfo();
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
      <Link href="/image/score">SCORE</Link>
      <hr />
      {userInfo ? (
        <button className={gnb.menu_button}>
          <div className={gnb.user_interface} onClick={handleMenu}>
            <div className={gnb.user_name}>{userInfo.displayName ?? ""}</div>
            <div className={gnb.user_photo_container}>
              <img src={userInfo?.photoURL ?? ""} alt="user_photoURL" />
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
              X
            </button>
          </div>
        </button>
      ) : (
        <button className={gnb.signin_button} onClick={signInHandler}>
          로그인
        </button>
      )}
    </div>
  );
};

export default GNB;
