import { useState } from 'react';
import over from '@/styles/game/over.module.scss';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoadingAtom, userInfoAtom } from '@/recoil/atoms';
import Link from 'next/link';
import { signIn } from '@/hooks/firebase_client_auth';
import FirebaseClient from '@/models/firebase_client';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import scoreModel from '@/models/score/score.model';
import { useToast } from '@/hooks/useToast';

interface Props {
  score: number;
  resetGame: () => void;
}

const auth = FirebaseClient.getInstance().Auth;

const GameOver = ({ score, resetGame }: Props) => {
  const userInfo = useRecoilValue(userInfoAtom);
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const [isRecode, setIsRecode] = useState<boolean>(false);
  const router = useRouter();
  const { fireToast } = useToast();

  const signInHandler = async () => {
    try {
      await signIn();
    } catch (err) {
      console.error(err);
      fireToast({ type: 'error', message: '로그인 에러' });
    }
  };

  const handleRecode = async () => {
    try {
      if (!isRecode) {
        setIsLoading((_pre) => true);
        const idToken = await auth.currentUser?.getIdToken(true);
        if (!userInfo) {
          fireToast({ type: 'alert', message: '로그인되어 있지 않습니다.' });
          return;
        }
        const { uid, displayName, emailId } = userInfo;
        const result: AxiosResponse<Awaited<ReturnType<typeof scoreModel.add>>> = await axios({
          method: 'POST',
          url: '/api/score.add',
          data: {
            score,
            displayName: displayName ?? emailId ?? 'Anonymous',
            uid,
          },
          headers: {
            'Content-type': 'application/json',
            authorization: `Bearer ${idToken}`,
          },
        });
        setIsRecode((_pre) => true);
        setIsLoading((_pre) => false);

        if (confirm('기록되었습니다 SCORE페이지로 이동하시겠습니까?')) {
          router.push('/score');
        }
      } else {
        fireToast({ type: 'alert', message: '이미 기록되었습니다.' });
      }
    } catch (err) {
      console.error(err);
      setIsLoading((_pre) => false);
      fireToast({ type: 'error', message: '통신에러' });
    }
  };

  return (
    <div className={over['container']}>
      <div className={over['backdrop']} />
      <div className={over['modal__content']}>
        <div>
          <h1 className={over['modal__title']}>Game over!</h1>
          <h2 className={over['modal__score']}>score: {score}점</h2>
        </div>
        <Link className={over['modal__home']} href="/">
          home
        </Link>
        <button className={over['modal__reset']} onClick={resetGame}>
          restart
        </button>
        {userInfo ? (
          <button className={over['modal__recode']} onClick={handleRecode}>
            recode
          </button>
        ) : (
          <div className={over['modal__sign-in']}>
            <button className={over['modal__sign-in__button']} onClick={signInHandler}>
              sign in
            </button>
            <p className={over['modal__sign-in__desc']}>로그인후 score를 기록할 수 있습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameOver;
