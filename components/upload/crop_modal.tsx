import { Cropper, ReactCropperElement } from "react-cropper";
import { Dispatch, SetStateAction, useRef } from "react";
import crop from "@/styles/upload/crop.module.scss";
import "cropperjs/dist/cropper.css";

interface Props {
  imgURL: string;
  fixedImgWidth: number;
  fixedImgHeight: number;
  imgFile: File | undefined;
  setShowCrop: Dispatch<SetStateAction<boolean>>;
  handleSaveImg: (file: File) => void;
}

const Crop = ({
  imgURL,
  fixedImgWidth,
  fixedImgHeight,
  imgFile,
  setShowCrop,
  handleSaveImg,
}: Props) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = (cropper: ReactCropperElement["cropper"]) => {
    const cropperCanvas = cropper.getCroppedCanvas({
      width: fixedImgWidth,
      height: fixedImgHeight,
    });
    cropperCanvas?.toBlob((blob) => {
      const fileName =
        imgFile?.name ||
        `Pairz_${Date.now()}_${Math.trunc(Math.random() * 100)}`;
      if (blob) {
        const newFile = new File([blob], fileName, { type: "image/jpeg" });
        handleSaveImg(newFile);
      }
    });
  };

  return (
    <section className={crop["container"]}>
      <div className={crop["back-drop"]} />
      <div className={crop["content"]}>
        <div className={crop["cropper"]}>
          <Cropper
            className={crop["cropper__img"]}
            ref={cropperRef}
            src={imgURL}
            aspectRatio={fixedImgWidth / fixedImgHeight}
          />
        </div>
        <div className={crop["lower"]}>
          <div className={crop["button_container"]}>
            <div className={crop["cancel"]}>
              <button
                className={crop["cancel__button"]}
                onClick={() => setShowCrop(() => false)}
              >
                취소하기
              </button>
            </div>
            <div className={crop["save"]}>
              <button
                className={crop["save__button"]}
                onClick={() => {
                  if (cropperRef.current?.cropper) {
                    handleCrop(cropperRef.current.cropper);
                  }
                }}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Crop;
