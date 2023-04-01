import Image from "next/image";
import dragDrop from "@/styles/upload/drag_drop.module.scss";
import { DragEvent, RefObject, useRef } from "react";

interface Props {
  fixedImgWidth: number;
  fixedImgHeight: number;
  imgURL: string;
  imgRef: RefObject<HTMLImageElement>;
  handleSaveImg: (file: File) => void;
}

const DragDrop = ({
  fixedImgWidth,
  fixedImgHeight,
  imgURL,
  imgRef,
  handleSaveImg,
}: Props) => {
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
    <div className={dragDrop["container"]}>
      <label
        htmlFor="upload_file_input"
        ref={dragRef}
        onDragOver={dragOver}
        onDrop={drop}
        tabIndex={0}
      >
        {!imgURL ? (
          <div className={dragDrop["alt"]} />
        ) : (
          <div style={{ display: "flex" }}>
            <Image
              src={imgURL}
              ref={imgRef}
              alt="preview"
              width={fixedImgWidth}
              height={fixedImgHeight}
            />
          </div>
        )}
      </label>
    </div>
  );
};

export default DragDrop;
