/* eslint-disable @next/next/no-img-element */
import gnb from "@/styles/gnb.module.scss";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { signIn, signOut } from "@/hooks/firebase_client_auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Image from "next/image";
import ToggleMenu from "./toggle_menu";

const GNB = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  const toggleMenuRef = useRef<HTMLDivElement>(null);
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
    const current = toggleMenuRef.current;
    if (current) {
      const classList = current.classList;
      if (!classList.contains(gnb.render)) {
        classList.add(gnb.render);
        setTimeout(() => {
          classList.add(gnb.show);
        }, 100);
      } else {
        classList.remove(gnb.show);
        setTimeout(() => {
          classList.remove(gnb.render);
        }, 300);
      }
    }
  };

  return (
    <>
      <header className={gnb["container"]}>
        <div className={gnb["home"]}>
          <Link className={gnb["home__link"]} href="/">
            <Image
              className={gnb["home__img"]}
              src="/favicon.png"
              width={48}
              height={48}
              alt="GNB_logo"
              priority
            />
          </Link>
        </div>
        <ul className={gnb["container__right"]}>
          <li className={gnb["showcase"]}>
            <Link href="/image">SHOWCASE</Link>
          </li>
          <li className={gnb["score"]}>
            <Link href="/score">SCORE</Link>
          </li>
          {userInfo ? (
            <li className={gnb["menu"]}>
              <button className={gnb["menu-button"]} onClick={handleMenu}>
                <div className={gnb["menu-name"]}>
                  {userInfo.displayName ?? ""}
                </div>
                <div className={gnb["menu-photo"]}>
                  {failToGetImage ? (
                    <img
                      className={gnb["menu-photo__img"]}
                      src="/user_icon.png"
                      width="48px"
                      height="48px"
                      alt="user_photoURL_failed"
                    />
                  ) : (
                    <img
                      className={gnb["menu-button__img"]}
                      src={userInfo?.photoURL ?? "/user_icon.png"}
                      width="48px"
                      height="48px"
                      alt="user_photoURL"
                      onError={() => setFailToGetImage(() => true)}
                    />
                  )}
                </div>
              </button>
              <ToggleMenu
                toggleMenuRef={toggleMenuRef}
                signOutHandler={signInHandler}
                handleMenu={handleMenu}
              />
            </li>
          ) : (
            <li>
              <button className={gnb["sign-in"]} onClick={signInHandler}>
                sign In
              </button>
            </li>
          )}
        </ul>
      </header>
      <div className={gnb["poly-fill"]} />
    </>
  );
};

export default GNB;
