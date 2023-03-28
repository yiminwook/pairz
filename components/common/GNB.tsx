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
import Image from "next/image";

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
      <div className={gnb["container"]}>
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
        <div className={gnb["container__right"]}>
          <Link className={gnb["showcase"]} href="/image">
            SHOWCASE
          </Link>
          <Link className={gnb["score"]} href="/score">
            SCORE
          </Link>
          {userInfo ? (
            <div className={gnb["menu"]}>
              <div className={gnb["menu-button"]} onClick={handleMenu}>
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
              </div>
              {/* 토글메뉴 */}
              <div className={gnb["menu-toggle"]} ref={menuRef}>
                <div className={gnb["menu-toggle__container"]}>
                  <div className={gnb["menu-toggle__top"]} />
                  <Link
                    className={gnb["menu-toggle__upload"]}
                    href="/image/upload"
                  >
                    upload
                  </Link>
                  <button
                    className={gnb["menu-toggle__sign-out"]}
                    onClick={signOutHandler}
                  >
                    sign out
                  </button>
                  <hr />
                  <button
                    className={gnb["menu-toggle__close"]}
                    onClick={handleMenu}
                  >
                    <p>close</p>
                    <span>
                      <FontAwesomeIcon
                        icon={faXmark}
                        size="2xs"
                        style={{ width: "1rem" }}
                      />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button className={gnb["sign-in"]} onClick={signInHandler}>
              sign In
            </button>
          )}
        </div>
      </div>
      <div className={gnb["poly-fill"]} />
    </>
  );
};

export default GNB;
