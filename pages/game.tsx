/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@/components/card";
import ServiceLayout from "@/components/service_layout";
import { ImageInfo } from "@/models/Info";
import axios, { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import game from "@/styles/game.module.scss";

const GamePage: NextPage = () => {
  const [reqRandomImg, setReqRandomImg] = useState<CardInfo[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [life, setLife] = useState<number>(3);
  const [round, setRound] = useState<number>(0);
  const [time, setTime] = useState<number>(10);
  const [select, setSelect] = useState<0 | 1 | 2>(0);
  const [score, setScore] = useState<number>(0);

  interface CardInfo extends ImageInfo {
    isFlip: boolean;
    color: "white" | "red" | "blue" | "green" | "orange";
  }

  useEffect(() => {
    getRandomImage();
  }, [round]);

  useEffect(() => {
    if (time === 0) setIsGameOver((_pre) => true);
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
          case (idx = 1):
            color = "white";
            break;
          case (idx = 2):
            color = "red";
            break;
          case (idx = 3):
            color = "blue";
            break;
          case (idx = 4):
            color = "green";
            break;
          case (idx = 5):
            color = "orange";
            break;
          default:
            color = "white";
        }
        return { ...img, color, isFlip: false };
      });

    const images = [...cardImages, ...cardImages];
    const shuffledArr = shuffle(images);
    setReqRandomImg((_pre) => shuffledArr);
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

  return (
    <ServiceLayout title="Game Start!">
      <div className={game.container}>
        <div>time: {time}</div>
        <div>{isGameOver ? "Game Over" : "continue"}</div>
        <div className={game.card_container}>
          {reqRandomImg.length === 10 &&
            reqRandomImg.map((img, idx) => (
              <Card
                key={idx}
                color={img.color}
                imgURL={img.imgURL}
                id={img.id}
                isFlip={img.isFlip}
              />
            ))}
        </div>
      </div>
    </ServiceLayout>
  );
};

export default GamePage;
