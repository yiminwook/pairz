import { Cropper, ReactCropperElement } from 'react-cropper';
import { Dispatch, SetStateAction, useRef } from 'react';
import crop from '@/styles/upload/crop.module.scss';
import 'cropperjs/dist/cropper.css';
import { FIXED_IMAGE_HEIGHT, FIXED_IMAGE_WIDTH } from '@/consts';

interface Props {
  imgURL: string;
  imgFile: File | undefined;
  setShowCrop: Dispatch<SetStateAction<boolean>>;
  handleSaveImg: (file: File) => void;
}

const Crop = ({ imgURL, imgFile, setShowCrop, handleSaveImg }: Props) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = (cropper: ReactCropperElement['cropper']) => {
    const cropperCanvas = cropper.getCroppedCanvas({
      width: FIXED_IMAGE_WIDTH,
      height: FIXED_IMAGE_WIDTH,
    });
    cropperCanvas?.toBlob((blob) => {
      const fileName = imgFile?.name || `Pairz_${Date.now()}_${Math.trunc(Math.random() * 100)}`;
      if (blob) {
        const newFile = new File([blob], fileName, { type: 'image/jpeg' });
        handleSaveImg(newFile);
      }
    });
  };

  return (
    <section className={crop['crop']}>
      <div className={crop['back-drop']} />
      <div className={crop['content']}>
        <div>
          <Cropper
            className={crop['cropper']}
            ref={cropperRef}
            src={imgURL}
            aspectRatio={FIXED_IMAGE_WIDTH / FIXED_IMAGE_HEIGHT}
          />
        </div>
        <div>
          <div>
            <div className={crop['cancel']}>
              <button onClick={() => setShowCrop(() => false)}>취소하기</button>
            </div>
            <div className={crop['save']}>
              <button
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
