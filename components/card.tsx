/* eslint-disable @next/next/no-img-element */
import { SelectedCard } from "@/pages/game";
import card from "@/styles/card.module.scss";
import { FC, useRef, useState } from "react";

interface Props {
  idx: number;
  imgURL: string;
  isPreView?: boolean;
  isFlip: boolean;
  color: string;
  id: number;
  isDisable: boolean;
  checkPair: (card: SelectedCard) => void;
}

/** isPreView가 true이면
 *
 *  preView모드 일때는 isDisable = True
 */
const Card: FC<Props> = ({
  id,
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
        const selectedCard = { idx, id };
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
    isPreView ? card.preview : "",
    isFlip ? card.flip : "",
  ];

  return (
    <>
      <div
        onClick={handleEffect}
        className={cardClassNameList.join(" ")}
        ref={cardRef}
        style={{ backgroundColor: color }}
      >
        <div className={card.front}>
          <div className={card.front_image_container}>
            <img width={200} height={300} alt="card_img" src={imgURL} />
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
