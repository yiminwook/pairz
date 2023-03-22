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
  const [reqRandomImg, setReqRandomImg] = useState<CardInfo[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [life, setLife] = useState<number>(3);
  const [round, setRound] = useState<number>(0);
  const [time, setTime] = useState<number>(60);
  const [select, setSelect] = useState<SelectedCard[]>([]);
  const [score, setScore] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    getRandomImage();
  }, [round]);

  useEffect(() => {
    if (life <= 0) {
      setIsGameOver(true);
    }
  }, [life]);

  useEffect(() => {
    if (count >= 5) {
      setRound((pre) => pre + 1);
      setScore((pre) => pre + 100);
    }
  }, [count]);

  useEffect(() => {
    if (time <= 0) setIsGameOver((_pre) => true);
    if (isGameOver) return;
    const timer = setTimeout(() => setTime((pre) => pre - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, isGameOver]);

  const getRandomImage = async () => {
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
        return { ...img, color, isFlip: false, isDisable: false };
      });

    const images = [
      ...cardImages,
      ...cardImages.map((obj) => {
        return { ...obj };
      }),
    ];
    const shuffledArr = shuffle(images);
    setReqRandomImg((_pre) => shuffledArr);
    setCount((_pre) => 0);
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
    if (!isGameOver) {
      setReqRandomImg((pre) => {
        const preImgs = pre.slice();
        preImgs[card.idx].isFlip = true;
        preImgs[card.idx].isDisable = true;
        return preImgs;
      });

      if (select.length >= 1) {
        if (select[0].id === card.id) {
          setCount((pre) => pre + 1);
          setScore((pre) => pre + 10);
          setSelect((_pre) => []);
        } else {
          setTimeout(() => {
            setReqRandomImg((pre) => {
              const preImgs = pre.slice();
              preImgs[select[0].idx].isFlip = false;
              preImgs[select[0].idx].isDisable = false;
              preImgs[card.idx].isFlip = false;
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

  return (
    <ServiceLayout title="Game Start!">
      {isGameOver && <div className={game.game_over}>Game Over</div>}
      <div className={game.container}>
        <div>time: {time}</div>
        <div>round: {round}</div>
        <div>count: {count}</div>
        <div>select: {select[0]?.idx ?? "not selected"}</div>
        <div>score: {score}점</div>
        <div>life: {life}</div>
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
