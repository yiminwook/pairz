/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import game from '@/styles/game/game.module.scss';
import Pause from '@/components/game/pause_modal';
import GameOver from '@/components/game/over_modal';
import ServiceLayout from '@/components/common/service_layout';
import Deck from '@/components/game/deck';
import GameStatus from '@/components/game/game_status';
import { useToast } from '@/hooks/useToast';
import { DEFALUT_GAME_SET } from '@/consts';

const GamePage: NextPage = () => {
  //게임진행
  const [time, setTime] = useState<number>(DEFALUT_GAME_SET.time);
  const [life, setLife] = useState<number>(DEFALUT_GAME_SET.life);
  const [round, setRound] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);

  const [countSelect, setCountSelect] = useState<number>(0);

  //score
  const [score, setScore] = useState<number>(DEFALUT_GAME_SET.score);

  //pause
  const [isPause, setIsPause] = useState<boolean>(false);
  const [countPause, setCoundPause] = useState<number>(DEFALUT_GAME_SET.countPause);

  const { fireToast } = useToast();

  //life
  useEffect(() => {
    if (life <= 0) {
      setIsGameOver(true);
    }
  }, [life]);

  //round
  useEffect(() => {
    if (countSelect >= 5) {
      setRound((pre) => pre + 1);
      setScore((pre) => pre + DEFALUT_GAME_SET.roundScore);
    }
  }, [countSelect]);

  //time
  useEffect(() => {
    if (isPause || isGameLoading) return;
    if (time <= 0) setIsGameOver((_pre) => true);
    if (isGameOver) return;
    const timer = setTimeout(() => setTime((pre) => pre - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, isGameOver, isPause, isGameLoading]);

  const handlePause = useCallback(
    (bool: boolean) => {
      if (isGameLoading) {
        fireToast({
          type: 'alert',
          message: '카드확인중에는 pause 할 수 없습니다.',
        });
      }

      if (countPause < 0) {
        fireToast({
          type: 'alert',
          message: '더이상 pause 할 수 없습니다.',
        });
      }

      if (!isGameLoading && countPause >= 0) {
        setIsPause((_pre) => bool);
        setCoundPause((pre) => pre - 1);
      }
    },
    [isGameLoading, countPause, isGameLoading],
  );

  const resetGame = useCallback(() => {
    //게임진행
    setTime(() => DEFALUT_GAME_SET.time);
    setLife(() => DEFALUT_GAME_SET.life);
    setIsGameOver(() => false);

    //score
    setScore(() => 0);

    //pause
    setIsPause(() => false);
    setCoundPause(() => DEFALUT_GAME_SET.countPause);

    //deck 초기화
    setRound(() => -1);
    setTimeout(() => setRound(() => 0), 10);
  }, []);

  return (
    <ServiceLayout title="Game Start!">
      <main className={game['game']}>
        {/* game over modal */}
        {isGameOver ? <GameOver score={score} resetGame={resetGame} /> : null}
        {/* pause modal */}
        {isPause ? <Pause handlePause={handlePause} countPause={countPause} /> : null}
        <section className={game['content']}>
          <GameStatus
            time={time}
            round={round}
            score={score}
            life={life}
            handlePause={handlePause}
            countPause={countPause}
          />
          <Deck
            round={round}
            isGameOver={isGameOver}
            isPause={isPause}
            setIsGameLoading={setIsGameLoading}
            setLife={setLife}
            checkCardTime={DEFALUT_GAME_SET.checkCardTime}
            setCountSelect={setCountSelect}
            pairScore={DEFALUT_GAME_SET.pairScore}
            setScore={setScore}
          />
        </section>
      </main>
    </ServiceLayout>
  );
};

export default GamePage;
