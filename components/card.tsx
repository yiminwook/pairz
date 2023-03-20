/* eslint-disable @next/next/no-img-element */
import card from "@/styles/card.module.scss";
import { FC, useRef, useState } from "react";

interface Props {
  imgURL: string;
  isPreView?: boolean;
}

/** isPreView가 true이면
 *
 *  preView 모드
 */
const Card: FC<Props> = ({ imgURL, isPreView }) => {
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEffect = () => {
    if (cardRef.current) {
      const { classList, style } = cardRef.current;
      if (isPreView !== true) {
        classList.toggle(card.flip);
      }
      if (isPreView === true) {
        if (!style.animationPlayState) {
          style.animationPlayState = "paused";
        } else {
          style.animationPlayState = "";
        }
      }
    }
  };

  return (
    <>
      <div
        onClick={handleEffect}
        className={[card.container, isPreView ? card.preview : ""].join(" ")}
        ref={cardRef}
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
