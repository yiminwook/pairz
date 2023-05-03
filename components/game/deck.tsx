/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import Card, { color } from '@/components/common/card';
import { ImageInfo } from '@/models/Info';
import axios, { AxiosResponse } from 'axios';
import imageModel from '@/models/image/image.model';
import game from '@/styles/game/game.module.scss';

export interface CardBase {
  idx: number;
  color: color;
}

export interface CardInfo extends CardBase {
  isFlip: boolean;
  isDisable: boolean;
}

interface Props {
  round: number;
  isGameOver: boolean;
  isPause: boolean;
  setIsGameLoading: Dispatch<SetStateAction<boolean>>;
  setLife: Dispatch<SetStateAction<number>>;
  checkCardTime: number;
  setCountSelect: Dispatch<SetStateAction<number>>;
  pairScore: number;
  setScore: Dispatch<SetStateAction<number>>;
}

const Deck = ({
  round,
  isGameOver,
  isPause,
  setIsGameLoading,
  setLife,
  checkCardTime,
  setCountSelect,
  pairScore,
  setScore,
}: Props) => {
  const [reqRandomImgs, setReqRandomImgs] = useState<ImageInfo[]>([]);
  const [select, setSelect] = useState<CardBase[]>([]);
  const [cards, setCards] = useState<CardInfo[]>([]);

  useEffect(() => {
    if (round >= 0) {
      drawCards();
    }
  }, [round]);

  /** 겹치지 않는 이미지 5장 서버에서 요청 */
  const getImgs = useCallback(async () => {
    try {
      const randomResult: AxiosResponse<Awaited<ReturnType<typeof imageModel.getRandom>>> = await axios.get(
        '/api/image.random',
      );
      const { status, data } = randomResult;
      if (status !== 200 || data.imageData.length !== 5) throw new Error('Failed get random Image');

      const cardImages: ImageInfo[] = data.imageData;
      setReqRandomImgs((_pre) => [...cardImages]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  /** 카드 5쌍을 뒷면으로 생성 */
  const setCard = useMemo(() => {
    const newCards = Array.from(Array(5), () => []);
    const setCardsData = newCards.map((img, idx): CardInfo => {
      let color: CardInfo['color'];
      switch (idx) {
        case 0:
          color = 'white';
          break;
        case 1:
          color = 'red';
          break;
        case 2:
          color = 'blue';
          break;
        case 3:
          color = 'green';
          break;
        case 4:
          color = 'orange';
          break;
        default:
          color = 'white';
      }
      return { ...img, idx, color, isFlip: true, isDisable: true };
    }, []);

    const copyCards = [
      ...setCardsData,
      ...setCardsData.map((obj) => {
        return { ...obj };
      }),
    ];

    return copyCards;
  }, []);

  /** 피셔-예이츠 셔플 */
  const shuffle = useCallback((arr: CardInfo[]) => {
    const shuffleArr: CardInfo[] = arr.slice();

    for (let i = shuffleArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = shuffleArr[i];
      shuffleArr[i] = shuffleArr[j];
      shuffleArr[j] = k;
    }

    return shuffleArr;
  }, []);

  const drawCards = useCallback(async () => {
    setIsGameLoading((_pre) => true);
    await getImgs(); //서버에 이미지요청
    const shuffledCards = shuffle(setCard);

    setCards((_pre) => [...shuffledCards]);
    /* 뒷면으로 생성한 카드를 열어서 보여줌, 조작불가 */
    setTimeout(() => {
      setCards((pre) => {
        return pre.slice().map((card) => {
          return { ...card, isFlip: false, isDisable: true };
        });
      });
    }, 350);
    /* 일정시간이 지난후에 카드가 닫힘, 이후 조작가능 */
    setTimeout(() => {
      setCards((pre) => {
        return pre.slice().map((card) => {
          return { ...card, isFlip: true, isDisable: false };
        });
      });
      setCountSelect((_pre) => 0);
      setIsGameLoading((_pre) => false);
    }, checkCardTime);
  }, []);

  const checkPair = useCallback(
    (card: CardBase) => {
      if (!isGameOver && !isPause) {
        setCards((pre) => {
          const preCards = pre.slice();
          preCards[card.idx] = {
            ...preCards[card.idx],
            isFlip: false,
            isDisable: true,
          };
          return preCards;
        });
        if (select.length >= 1) {
          if (select[0].color === card.color) {
            /* pair */
            setScore((pre) => pre + pairScore);
            setSelect((_pre) => []);
            setCountSelect((pre) => pre + 1);
          } else {
            /* no pair */
            setTimeout(() => {
              setCards((pre) => {
                const preCards = pre.slice();
                preCards[select[0].idx] = {
                  ...preCards[select[0].idx],
                  isFlip: true,
                  isDisable: false,
                };
                preCards[card.idx] = {
                  ...preCards[card.idx],
                  isFlip: true,
                  isDisable: false,
                };
                return preCards;
              });
              setLife((pre) => pre - 1);
              setSelect((_pre) => []);
            }, 300);
          }
        } else {
          setSelect((pre) => [...pre, card]);
        }
      }
    },
    [cards, isGameOver, isPause, select],
  );

  return (
    <section className={game['deck']}>
      {cards.map((card, idx) => (
        <Card
          key={idx}
          idx={idx}
          color={card.color}
          imgURL={reqRandomImgs[card.idx]?.imgURL ?? '/home_icon.png'}
          isFlip={card.isFlip}
          isDisable={card.isDisable}
          checkPair={checkPair}
        />
      ))}
    </section>
  );
};

export default Deck;
