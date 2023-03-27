import Image from "next/image";
import drag_drop from "@/styles/upload/drag_drop.module.scss";
import { DragEvent, FC, RefObject, useRef } from "react";

interface Props {
  fixedImgWidth: number;
  fixedImgHeight: number;
  imgURL: string;
  imgRef: RefObject<HTMLImageElement>;
  handleSaveImg: (file: File) => void;
}

const DragDrop: FC<Props> = ({
  fixedImgWidth,
  fixedImgHeight,
  imgURL,
  imgRef,
  handleSaveImg,
}) => {
  const dragRef = useRef<HTMLLabelElement>(null);

  const drop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleSaveImg(file);
  };

  const dragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div>
      <label
        htmlFor="upload_file_input"
        ref={dragRef}
        onDragOver={dragOver}
        onDrop={drop}
      >
        {!imgURL ? (
          <div className={drag_drop.uploading__alt}></div>
        ) : (
          <Image
            src={imgURL}
            ref={imgRef}
            alt="preview"
            width={fixedImgWidth}
            height={fixedImgHeight}
          />
        )}
      </label>
    </div>
  );
};

export default DragDrop;
