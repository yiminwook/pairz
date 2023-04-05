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
          objectFit="cover"
          alt="err_image"
        />
      ) : (
        <Image
          src={imgURL}
          width={200}
          height={300}
          alt={`${imageName}_image`}
          objectFit="cover"
          onError={() => setFailToGetImage((_pre) => true)}
        />
      )}
      <div className={showcase.contents_name}>{imageName}</div>
      <div className={showcase.contents_id}>{id}</div>
    </div>
  );
};

export default RenderImage;
