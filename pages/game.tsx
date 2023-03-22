/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@/components/card";
import ServiceLayout from "@/components/service_layout";
import { ImageInfo } from "@/models/Info";
import axios, { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import game from "@/styles/game.module.scss";

interface CardInfo extends ImageInfo {
  isFlip: boolean;
  color: "white" | "red" | "orange" | "blue" | "green";
  isDisable: boolean;
}

export interface SelectedCard {
  idx: number;
  id: number;
}

const GamePage: NextPage = () => {
  //게임진행
  const [time, setTime] = useState<number>(60);
  const [life, setLife] = useState<number>(3);
  const [round, setRound] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);

  //카드관련
  const [reqRandomImg, setReqRandomImg] = useState<CardInfo[]>([]);
  const [select, setSelect] = useState<SelectedCard[]>([]);
  const [countSelect, setCountSelect] = useState<number>(0);

  //score
  const [score, setScore] = useState<number>(0);

  //pause
  const [isPause, setIsPause] = useState<boolean>(false);
  const [countPause, setCoundPause] = useState<number>(100);

  useEffect(() => {
    getRandomImage();
  }, [round]);

  useEffect(() => {
    if (life <= 0) {
      setIsGameOver(true);
    }
  }, [life]);

  useEffect(() => {
    if (countSelect >= 5) {
      setRound((pre) => pre + 1);
      setScore((pre) => pre + 100);
    }
  }, [countSelect]);

  useEffect(() => {
    if (isPause || isGameLoading) return;
    if (time <= 0) setIsGameOver((_pre) => true);
    if (isGameOver) return;
    const timer = setTimeout(() => setTime((pre) => pre - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, isGameOver, isPause, isGameLoading]);

  const getRandomImage = async () => {
    try {
      setIsGameLoading((_pre) => true);
      const randomResult: AxiosResponse<{ imageData: ImageInfo[] }> =
        await axios.get("/api/image.get?random=true");
      const { status, data } = randomResult;

      if (status !== 200 || data.imageData.length !== 5)
        throw new Error("Failed get random Image");

      const cardImages: CardInfo[] = data.imageData
        .slice()
        .map((img, idx): CardInfo => {
          let color: CardInfo["color"];
          switch (idx) {
            case 0:
              color = "white";
              break;
            case 1:
              color = "red";
              break;
            case 2:
              color = "blue";
              break;
            case 3:
              color = "green";
              break;
            case 4:
              color = "orange";
              break;
            default:
              color = "white";
          }
          return { ...img, color, isFlip: false, isDisable: true };
        });

      const images = [
        ...cardImages,
        ...cardImages.map((obj) => {
          return { ...obj };
        }),
      ];
      const shuffledArr = shuffle(images);
      setReqRandomImg((_pre) => shuffledArr);
      //카드 확인시간 5초
      setTimeout(() => {
        setReqRandomImg((pre) => {
          const flipArr = pre.slice();
          flipArr.forEach((obj: CardInfo) => {
            obj.isFlip = true;
            obj.isDisable = false;
          });
          return flipArr;
        });
        setCountSelect((_pre) => 0);
        setIsGameLoading((_pre) => false);
      }, 5000);
    } catch (err) {
      console.error(err);
    }
  };

  /** 피셔-예이츠 셔플 */
  const shuffle = (arr: CardInfo[]) => {
    const shuffleArr: CardInfo[] = arr.slice();

    for (let i = shuffleArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = shuffleArr[i];
      shuffleArr[i] = shuffleArr[j];
      shuffleArr[j] = k;
    }

    return shuffleArr;
  };

  const checkPair = (card: SelectedCard) => {
    if (!isGameOver && !isPause) {
      setReqRandomImg((pre) => {
        const preImgs = pre.slice();
        preImgs[card.idx].isFlip = false;
        preImgs[card.idx].isDisable = true;
        return preImgs;
      });

      if (select.length >= 1) {
        if (select[0].id === card.id) {
          setCountSelect((pre) => pre + 1);
          setScore((pre) => pre + 10);
          setSelect((_pre) => []);
        } else {
          setTimeout(() => {
            setReqRandomImg((pre) => {
              const preImgs = pre.slice();
              preImgs[select[0].idx].isFlip = true;
              preImgs[select[0].idx].isDisable = false;
              preImgs[card.idx].isFlip = true;
              preImgs[card.idx].isDisable = false;
              return preImgs;
            });
          }, 300);
          setLife((pre) => pre - 1);
          setSelect((_pre) => []);
        }
      } else {
        setSelect((pre) => [...pre, card]);
      }
    }
  };

  const handlePause = (bool: boolean) => {
    if (!isGameLoading && countPause >= 0) {
      setIsPause((_pre) => bool);
      setCoundPause((pre) => pre - 1);
    }
  };

  return (
    <ServiceLayout title="Game Start!">
      {isGameOver && <div className={game.game_over}>Game Over</div>}
      {isPause && (
        <div className={game.game_over}>
          <div> Pause 중</div>
          <button onClick={() => handlePause(false)}>pause 해제</button>
        </div>
      )}
      {countPause <= 0 ? (
        <p>더이상 pause 할 수 없습니다.</p>
      ) : (
        <p>앞으로 {Math.trunc(countPause / 2)}회 pause가 가능합니다.</p>
      )}
      <div className={game.container}>
        <div>time: {time}</div>
        <div>round: {round}</div>
        <div>count: {countSelect}</div>
        <div>select: {select[0]?.idx ?? "not selected"}</div>
        <div>score: {score}점</div>
        <div>life: {life}</div>
        <button onClick={() => handlePause(true)}>pause</button>
        <div>{isGameOver ? "Game Over" : "continue"}</div>
        <div className={game.card_container}>
          {reqRandomImg.length === 10 &&
            reqRandomImg.map((img, idx) => (
              <Card
                key={idx}
                idx={idx}
                color={img.color}
                imgURL={img.imgURL}
                id={img.id}
                isFlip={img.isFlip}
                isDisable={img.isDisable}
                checkPair={checkPair}
              />
            ))}
        </div>
      </div>
    </ServiceLayout>
  );
};

export default GamePage;
