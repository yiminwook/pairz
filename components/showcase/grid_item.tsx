import Image from "next/image";
import { useState } from "react";
import grid from "@/styles/showcase/grid.module.scss";

interface Props {
  id: number;
  imgURL: string;
  imageName: string;
}

const GridItem = ({ id, imgURL, imageName }: Props) => {
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  return (
    <div className={grid["item"]}>
      <div className={grid["image__container"]}>
        {failToGetImage ? (
          <Image src="/loading_icon.png" fill alt="err_image" />
        ) : (
          <Image
            src={imgURL}
            fill
            alt={`${imageName}_image`}
            onError={() => setFailToGetImage((_pre) => true)}
          />
        )}
      </div>
      <div className={grid["item__desc"]}>
        <div className={grid.contents_id}>ID: {id}</div>
        <div className={grid.contents_name}>{imageName}</div>
      </div>
    </div>
  );
};

export default GridItem;
