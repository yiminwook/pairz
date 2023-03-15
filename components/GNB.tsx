import gnb from "@/styles/gnb.module.scss";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { signIn, signOut } from "@/hooks/firebase_client_auth";

const GNB = () => {
  const [userInfo, _setUserinfo] = useRecoilState(userInfoAtom);
  const resetUserInfo = useResetRecoilState(userInfoAtom);
  const signInHandler = async () => {
    await signIn();
  };
  const signOutHandler = async () => {
    await signOut();
    resetUserInfo();
  };

  return (
    <>
      <div className={gnb.container}>
        <div></div>
        <div>Pairz</div>
        {userInfo ? (
          <button className={gnb.logout_button} onClick={signOutHandler}>
            로그아웃
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
