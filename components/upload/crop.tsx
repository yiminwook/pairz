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

const Crop: React.FC<Props> = ({
  imgURL,
  fixedImgWidth,
  fixedImgHeight,
  imgFile,
  setShowCrop,
  handleSaveImg,
}) => {
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
    <div>
      <Cropper
        className={crop.cropper}
        ref={cropperRef}
        src={imgURL}
        aspectRatio={fixedImgWidth / fixedImgHeight}
      />
      <div className={crop.cropper_button_container}>
        <button
          className={crop.cropper_button_save}
          onClick={() => {
            if (cropperRef.current?.cropper) {
              handleCrop(cropperRef.current.cropper);
            }
          }}
        >
          저장하기
        </button>
        <button
          className={crop.cropper_button_cancel}
          onClick={() => setShowCrop(() => false)}
        >
          취소하기
        </button>
      </div>
    </div>
  );
};

export default Crop;
