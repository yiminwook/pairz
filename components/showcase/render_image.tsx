import Image from "next/image";
import { useState } from "react";
import showcase from "@/styles/showcase.module.scss";

interface Props {
  id: number;
  imgURL: string;
  imageName: string;
}

const RenderImage = ({ id, imgURL, imageName }: Props) => {
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  return (
    <div className={showcase.contents_image_container}>
      {failToGetImage ? (
        <Image
          src="/loading_icon.png"
          width={200}
          height={300}
          alt="card_img_err"
        />
      ) : (
        <Image
          src={imgURL}
          width={200}
          height={300}
          alt="card_img"
          onError={() => setFailToGetImage((_pre) => true)}
        />
      )}
      <div className={showcase.contents_name}>{imageName}</div>
      <div className={showcase.contents_id}>{id}</div>
    </div>
  );
};

export default RenderImage;
