import ServiceLayout from '@/components/common/service_layout';
import { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { userInfoAtom } from '@/recoil/atoms';
import React, { useRef, useState } from 'react';
import upload from '@/styles/upload/upload.module.scss';
import Preview from '@/components/upload/preview_modal';
import InputFile from '@/components/upload/input_file';
import DragDrop from '@/components/upload/drag_drop';
import CheckName from '@/components/upload/check_name';
import Crop from '@/components/upload/crop_modal';
import { useToast } from '@/hooks/useToast';
import { FIXED_IMAGE_HEIGHT, FIXED_IMAGE_WIDTH } from '@/consts';

const UploadPage: NextPage = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);

  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const [imgURL, setImgURL] = useState<string>('');
  const [showCrop, setShowCrop] = useState<boolean>(false);

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isValidName, setIsValidNameisValidName] = useState<boolean>(false);

  const userInfo = useRecoilValue(userInfoAtom);
  const { fireToast } = useToast();

  const handleSaveImg = (file: File) => {
    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      setImgFile((_pre) => file);
      URL.revokeObjectURL(imgURL);
      setImgURL((_pre) => URL.createObjectURL(file));
      setShowCrop((_pre) => false);
      return;
    }
    fireToast({
      type: 'alert',
      message: 'image 또는 png 파일만 업로드 가능합니다.',
    });
    handleResetImg();
  };

  const handleResetImg = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
      URL.revokeObjectURL(imgURL);
      setImgURL((_pre) => '');
      setImgFile((_pre) => undefined);
      setShowCrop((_pre) => false);
      setIsValidNameisValidName((_pre) => false);
    }
  };

  const handleResetCheckName = () => {
    if (inputNameRef.current) {
      inputNameRef.current.disabled = false;
      setIsValidNameisValidName((_pre) => false);
    }
  };

  const handleShowPreview = () => {
    const width = imgRef.current?.naturalWidth;
    const height = imgRef.current?.naturalHeight;
    if (!(userInfo !== null && userInfo.uid)) {
      fireToast({
        type: 'alert',
        message: '로그인이후 이용가능합니다.',
      });
      return;
    }
    if (imgFile === undefined || imgURL === '') {
      fireToast({
        type: 'alert',
        message: '이미지를 업로드 해주세요',
      });
      return;
    }
    if (width !== FIXED_IMAGE_WIDTH && height !== FIXED_IMAGE_HEIGHT) {
      fireToast({
        type: 'alert',
        message: `이미지는 ${FIXED_IMAGE_WIDTH} x ${FIXED_IMAGE_HEIGHT}만 업로드 가능합니다.`,
      });
      return;
    }
    if (isValidName === false) {
      fireToast({
        type: 'alert',
        message: '타이틀 중복검사를 해주세요',
      });
      return;
    }
    setShowPreview(() => true);
  };

  return (
    <ServiceLayout title="Pairz Upload Page">
      <main className={upload['upload']}>
        {/* preview modal */}
        {isValidName && userInfo?.uid && showPreview ? (
          <Preview
            uid={userInfo.uid}
            inputNameRef={inputNameRef}
            imgRef={imgRef}
            imgFile={imgFile}
            imgURL={imgURL}
            isValidName={isValidName}
            handleResetImg={handleResetImg}
            handleResetCheckName={handleResetCheckName}
            setShowPreview={setShowPreview}
          />
        ) : null}
        {/* crop modal */}
        {imgURL && showCrop ? (
          <Crop imgURL={imgURL} imgFile={imgFile} setShowCrop={setShowCrop} handleSaveImg={handleSaveImg} />
        ) : null}
        <section className={upload['content']}>
          <DragDrop imgURL={imgURL} imgRef={imgRef} handleSaveImg={handleSaveImg} />
          <CheckName
            inputNameRef={inputNameRef}
            isValidName={isValidName}
            setIsValidName={setIsValidNameisValidName}
            handleResetCheckName={handleResetCheckName}
          />
          <InputFile
            inputFileRef={inputFileRef}
            imgURL={imgURL}
            setShowCrop={setShowCrop}
            handleSaveImg={handleSaveImg}
            handleResetImg={handleResetImg}
          />
          <section className={upload['submit']}>
            <button onClick={handleShowPreview}>preview</button>
          </section>
        </section>
      </main>
    </ServiceLayout>
  );
};

export default UploadPage;
