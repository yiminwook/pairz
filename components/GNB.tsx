import gnb from "@/styles/gnb.module.scss";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { signIn, signOut } from "@/hooks/firebase_client_auth";
import Link from "next/link";
import { useRouter } from "next/router";

const GNB = () => {
  const [userInfo, _setUserinfo] = useRecoilState(userInfoAtom);
  const resetUserInfo = useResetRecoilState(userInfoAtom);
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

  return (
    <>
      <div className={gnb.container}>
        <div></div>
        <Link href="/">Pairz</Link>
        <Link href="/image">이미지페이지</Link>
        <Link href="/image/upload">업로드페이지</Link>
        {userInfo ? (
          <button className={gnb.logout_button} onClick={signOutHandler}>
            {userInfo.displayName} 로그아웃
          </button>
        ) : (
          <button className={gnb.login_button} onClick={signInHandler}>
            로그인
          </button>
        )}
      </div>
    </>
  );
};

export default GNB;
