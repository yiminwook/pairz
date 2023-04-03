/* eslint-disable @next/next/no-img-element */
import gnb from "@/styles/gnb.module.scss";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { signIn, signOut } from "@/hooks/firebase_client_auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import ToggleMenu from "./toggle_menu";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GNB = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  const router = useRouter();

  const signInHandler = async () => {
    await signIn();
  };

  const signOutHandler = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      {/* toggle mobile nav trigger */}
      <input
        type="checkbox"
        className={gnb["mobile__check-box"]}
        id="toggle-mobile-nav"
      />
      <nav className={gnb["container"]}>
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
          <li className={gnb["list"]}>
            <Link href="/showcase">SHOWCASE</Link>
          </li>
          <li className={gnb["list"]}>
            <Link href="/score">SCORE</Link>
          </li>
          {userInfo ? (
            <li className={gnb["menu"]}>
              {/* toggle menu trigger */}
              <input
                type="checkbox"
                className={gnb["menu__checkbox"]}
                id="toggle-menu"
              />
              <label
                className={gnb["menu__button"]}
                htmlFor="toggle-menu"
                tabIndex={0}
              >
                <div className={gnb["menu__name"]}>
                  {userInfo.displayName ?? ""}
                </div>
                <div className={gnb["menu__photo"]}>
                  {failToGetImage ? (
                    <img
                      className={gnb["menu__photo__img"]}
                      src="/user_icon.png"
                      width="48px"
                      height="48px"
                      alt="user_photoURL_failed"
                    />
                  ) : (
                    <img
                      className={gnb["menu__button__img"]}
                      src={userInfo?.photoURL ?? "/user_icon.png"}
                      width="48px"
                      height="48px"
                      alt="user_photoURL"
                      onError={() => setFailToGetImage(() => true)}
                    />
                  )}
                </div>
              </label>
              <ToggleMenu signOutHandler={signOutHandler} />
            </li>
          ) : (
            <li>
              <button className={gnb["sign-in"]} onClick={signInHandler}>
                sign In
              </button>
            </li>
          )}
        </ul>
      </nav>
      <nav className={gnb["mobile"]}>
        <label
          className={gnb["mobile__nav"]}
          tabIndex={0}
          htmlFor="toggle-mobile-nav"
        >
          <div className={gnb["mobile__button"]}>
            <FontAwesomeIcon
              icon={faMapLocationDot}
              style={{ color: "#f0ffff", width: "3rem", height: "3rem" }}
            />
          </div>
        </label>
      </nav>
      <div className={gnb["blank"]} />
    </header>
  );
};

export default GNB;
