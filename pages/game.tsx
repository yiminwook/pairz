/* eslint-disable react-hooks/exhaustive-deps */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import game from "@/styles/game/game.module.scss";
import Pause from "@/components/game/pause_modal";
import GameOver from "@/components/game/game_over_modal";
import ServiceLayout from "@/components/common/service_layout";
import Deck from "@/components/game/deck";

const defaultValue = {
  //게임진행
  time: 60,
  life: 3,
  //score
  score: 0,
  pairScore: 10,
  roundScore: 100,
  /** pause회수 3회 */
  countPause: 5,
  /** 카드확인시간 */
  checkCardTime: 5600,
};

const GamePage: NextPage = () => {
  //게임진행
  const [isReady, setIsReady] = useState<boolean>(false);
  const [time, setTime] = useState<number>(defaultValue.time);
  const [life, setLife] = useState<number>(defaultValue.life);
  const [round, setRound] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);

  const [countSelect, setCountSelect] = useState<number>(0);

  //score
  const [score, setScore] = useState<number>(defaultValue.score);

  //pause
  const [isPause, setIsPause] = useState<boolean>(false);
  const [countPause, setCoundPause] = useState<number>(defaultValue.countPause);

  useEffect(() => {
    if (life <= 0) {
      setIsGameOver(true);
    }
  }, [life]);

  useEffect(() => {
    if (countSelect >= 5) {
      setRound((pre) => pre + 1);
      setScore((pre) => pre + defaultValue.roundScore);
    }
  }, [countSelect]);

  useEffect(() => {
    if (isPause || isGameLoading) return;
    if (time <= 0) setIsGameOver((_pre) => true);
    if (isGameOver) return;
    const timer = setTimeout(() => setTime((pre) => pre - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, isGameOver, isPause, isGameLoading]);

  const handlePause = (bool: boolean) => {
    if (isGameLoading) {
      alert("카드확인중에는 pause 할 수 없습니다");
    }

    if (countPause < 0) {
      alert("더이상 pause 할 수 없습니다.");
    }

    if (!isGameLoading && countPause >= 0) {
      setIsPause((_pre) => bool);
      setCoundPause((pre) => pre - 1);
    }
  };

  const resetGame = () => {
    //게임진행
    setTime(() => defaultValue.time);
    setLife(() => defaultValue.life);
    setIsGameOver(() => false);

    //score
    setScore(() => 0);

    //pause
    setIsPause(() => false);
    setCoundPause(() => defaultValue.countPause);

    //deck 초기화
    setRound(() => -1);
    setTimeout(() => setRound(() => 0), 10);
  };

  return (
    <ServiceLayout title="Game Start!" showGNB={false}>
      <div className={game.container}>
        {isGameOver && <GameOver score={score} resetGame={resetGame} />}
        {isPause && <Pause handlePause={handlePause} countPause={countPause} />}
        <div className={game.content_container}>
          <div>time: {time}</div>
          <div>round: {round}</div>
          <div>count: {countSelect}</div>
          <div>score: {score}점</div>
          <div>life: {life}</div>
          <button onClick={() => handlePause(true)}>pause</button>
          <div>{isGameOver ? "Game Over" : "continue"}</div>
          <div className={game.card_container}>
            <Deck
              round={round}
              isGameOver={isGameOver}
              isPause={isPause}
              setIsGameLoading={setIsGameLoading}
              setLife={setLife}
              checkCardTime={defaultValue.checkCardTime}
              setCountSelect={setCountSelect}
              pairScore={defaultValue.pairScore}
              setScore={setScore}
            />
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default GamePage;
