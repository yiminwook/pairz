/* eslint-disable @next/next/no-img-element */
import card from "@/styles/card.module.scss";
import { FC, useRef, useState } from "react";
import { CardBase } from "../game/deck";

interface Props {
  idx: number;
  imgURL: string;
  isPreView?: boolean;
  isFlip: boolean;
  color: "white" | "red" | "orange" | "blue" | "green";
  isDisable: boolean;
  checkPair: (card: CardBase) => void;
}

/** isPreView가 true이면
 *
 *  preView모드 일때는 isDisable = True
 */
const Card: FC<Props> = ({
  idx,
  imgURL,
  isPreView,
  isFlip,
  color,
  isDisable,
  checkPair,
}) => {
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEffect = () => {
    if (cardRef.current) {
      const { style } = cardRef.current;
      if (isPreView !== true && isDisable === false) {
        const selectedCard = { idx, color };
        checkPair(selectedCard);
      }
      //프리뷰모드일때
      if (isPreView === true) {
        if (!style.animationPlayState) {
          style.animationPlayState = "paused";
        } else {
          style.animationPlayState = "";
        }
      }
    }
  };

  const cardClassNameList = [
    card.container,
    card[color],
    isPreView ? card.preview : "",
    isFlip ? card.flip : "",
  ];

  return (
    <>
      <div
        onClick={handleEffect}
        className={cardClassNameList.join(" ")}
        ref={cardRef}
      >
        <div className={card.front}>
          <div className={card.front_image_container}>
            {failToGetImage ? (
              <img
                width={200}
                height={300}
                alt="card_img_failed"
                src="/home_icon.png"
              />
            ) : (
              <img
                width={200}
                height={300}
                alt="card_img"
                src={imgURL}
                onError={() => setFailToGetImage(() => true)}
              />
            )}
          </div>
        </div>
        <div className={card.back}>
          <div className={card.back_image_container}>
            <img src="/loading_icon.png" alt="card_back_img" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
