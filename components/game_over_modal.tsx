import { FC } from "react";
import game from "@/styles/game.module.scss";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import Link from "next/link";
import { signIn } from "@/hooks/firebase_client_auth";
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
      if (!(result.status === 201 && result.data.result))
        throw new Error("Axios Error!");
      if (confirm("기록되었습니다 SCORE페이지로 이동하시겠습니까?")) {
        router.push("/score");
      }
    } catch (err) {
      console.error(err);
      alert("통신에러");
    }
  };

  return (
    <div className={game.over_modal}>
      <div className={game.over_modal_backdrop} />
      <div className={game.over_modal_container}>
        <div className={game.over_modal_title}>Game over!</div>
        <Link className={game.over_modal_home_link} href="/">
          HOME
        </Link>
        <button className={game.over_modal_reset_button} onClick={resetGame}>
          ReStart
        </button>
        {userInfo ? (
          <button
            className={game.over_modal_recode_button}
            onClick={handleRecode}
          >
            Recode
          </button>
        ) : (
          <button
            className={game.over_modal_sign_in_button}
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
