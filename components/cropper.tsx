import { Cropper, ReactCropperElement } from "react-cropper";
import img_upload from "@/styles/img_upload.module.scss";
import { useRef } from "react";

interface Props {
  imgURL: string;
  fixedImgWidth: number;
  fixedImgHeight: number;
  handleCrop: (cropper: ReactCropperElement["cropper"]) => void;
  setShowCrop: (callback: () => boolean) => void;
}
const Crop: React.FC<Props> = ({
  imgURL,
  fixedImgWidth,
  fixedImgHeight,
  handleCrop,
  setShowCrop,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  return (
    <div className={img_upload.cropper_container}>
      <Cropper
        className={img_upload.cropper}
        ref={cropperRef}
        src={imgURL}
        aspectRatio={fixedImgWidth / fixedImgHeight}
      />
      <div className={img_upload.cropper_button_container}>
        <button
          className={img_upload.cropper_button_save}
          onClick={() => {
            if (cropperRef.current?.cropper) {
              handleCrop(cropperRef.current.cropper);
            }
          }}
        >
          저장하기
        </button>
        <button
          className={img_upload.cropper_button_cancel}
          onClick={() => setShowCrop(() => false)}
        >
          취소하기
        </button>
      </div>
    </div>
  );
};

export default Crop;
