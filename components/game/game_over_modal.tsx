import { FC, useState } from "react";
import game_over from "@/styles/game/game_over.module.scss";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoadingAtom, userInfoAtom } from "@/recoil/atoms";
import Link from "next/link";
import { signIn, signOut } from "@/hooks/firebase_client_auth";
import FirebaseClient from "@/models/firebase_client";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";

interface Props {
  score: number;
  resetGame: () => void;
}

const auth = FirebaseClient.getInstance().Auth;

const GameOver: FC<Props> = ({ score, resetGame }) => {
  const userInfo = useRecoilValue(userInfoAtom);
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const [isRecode, setIsRecode] = useState<boolean>(false);
  const router = useRouter();

  const signInHandler = async () => {
    try {
      await signIn();
    } catch (err) {
      console.error(err);
      alert("통신에러");
    }
  };

  const handleRecode = async () => {
    try {
      if (!isRecode) {
        setIsLoading((_pre) => true);
        const idToken = await auth.currentUser?.getIdToken(true);
        const result: AxiosResponse<{ result: boolean }> = await axios({
          method: "POST",
          url: "/api/score",
          data: {
            score,
            displayName:
              userInfo?.displayName ?? userInfo?.emailId ?? "Anonymous",
          },
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        });

        if (result.status === 401) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요");
          await signOut();
        }

        if (!(result.status === 201 && result.data.result))
          throw new Error("Axios Error!");
        setIsRecode((_pre) => true);
        if (confirm("기록되었습니다 SCORE페이지로 이동하시겠습니까?")) {
          router.push("/score");
        }
        setIsLoading((_pre) => false);
      } else {
        alert("이미 기록되었습니다.");
      }
    } catch (err) {
      console.error(err);
      setIsLoading((_pre) => false);
      alert("통신에러");
    }
  };

  return (
    <div className={game_over.over_modal}>
      <div className={game_over.over_modal_backdrop} />
      <div className={game_over.over_modal_container}>
        <div className={game_over.over_modal_title}>Game over!</div>
        <Link className={game_over.over_modal_home_link} href="/">
          HOME
        </Link>
        <button
          className={game_over.over_modal_reset_button}
          onClick={resetGame}
        >
          ReStart
        </button>
        {userInfo ? (
          <button
            className={game_over.over_modal_recode_button}
            onClick={handleRecode}
          >
            Recode
          </button>
        ) : (
          <button
            className={game_over.over_modal_sign_in_button}
            onClick={signInHandler}
          >
            sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOver;
