import ServiceLayout from "@/components/common/service_layout";
import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import React, { useRef, useState } from "react";
import upload from "@/styles/upload/upload.module.scss";
import Preview from "@/components/upload/preview_modal";
import InputFile from "@/components/upload/input_file";
import DragDrop from "@/components/upload/drag_drop";
import CheckName from "@/components/upload/check_name";
import Crop from "@/components/upload/crop_modal";

/* 이미지 사이즈 제한 단위 px */
const [fixedImgWidth, fixedImgHeight] = [200, 300];

const UploadPage: NextPage = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);

  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const [imgURL, setImgURL] = useState<string>("");
  const [showCrop, setShowCrop] = useState<boolean>(false);

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isValidName, setIsValidNameisValidName] = useState<boolean>(false);

  const userInfo = useRecoilValue(userInfoAtom);

  const handleSaveImg = (file: File) => {
    if (file.type === "image/png" || file.type === "image/jpeg") {
      setImgFile((_pre) => file);
      URL.revokeObjectURL(imgURL);
      setImgURL((_pre) => URL.createObjectURL(file));
      setShowCrop((_pre) => false);
      return;
    }

    alert("image png 파일만 업로드 가능합니다.");
    handleResetImg();
  };

  const handleResetImg = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
      URL.revokeObjectURL(imgURL);
      setImgURL((_pre) => "");
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
      alert("로그인이후 이용가능합니다.");
      return;
    }
    if (imgFile === undefined || imgURL === "") {
      alert("이미지를 업로드 해주세요");
      return;
    }
    if (width !== fixedImgWidth && height !== fixedImgHeight) {
      alert(
        `이미지는 ${fixedImgWidth} x ${fixedImgHeight}만 업로드 가능합니다.`
      );
      return;
    }
    if (isValidName === false) alert("타이틀 중복검사를 해주세요");
    setShowPreview(() => true);
  };

  return (
    <ServiceLayout title="Pairz Upload Page">
      <main className={upload["container"]}>
        {/* preview modal */}
        {isValidName && showPreview ? (
          <Preview
            inputNameRef={inputNameRef}
            imgRef={imgRef}
            imgFile={imgFile}
            imgURL={imgURL}
            isValidName={isValidName}
            fixedImgWidth={fixedImgWidth}
            fixedImgHeight={fixedImgHeight}
            handleResetImg={handleResetImg}
            handleResetCheckName={handleResetCheckName}
            setShowPreview={setShowPreview}
          />
        ) : null}
        {/* crop modal */}
        {imgURL && showCrop ? (
          <Crop
            imgURL={imgURL}
            imgFile={imgFile}
            fixedImgWidth={fixedImgWidth}
            fixedImgHeight={fixedImgHeight}
            setShowCrop={setShowCrop}
            handleSaveImg={handleSaveImg}
          />
        ) : null}
        <section className={upload["content"]}>
          <section className={upload["drag-drop"]}>
            <DragDrop
              fixedImgWidth={fixedImgWidth}
              fixedImgHeight={fixedImgHeight}
              imgURL={imgURL}
              imgRef={imgRef}
              handleSaveImg={handleSaveImg}
            />
          </section>
          <section className={upload["check-name"]}>
            <CheckName
              inputNameRef={inputNameRef}
              isValidName={isValidName}
              setIsValidName={setIsValidNameisValidName}
              handleResetCheckName={handleResetCheckName}
            />
          </section>
          <section className={upload["input-file"]}>
            <InputFile
              inputFileRef={inputFileRef}
              imgURL={imgURL}
              setShowCrop={setShowCrop}
              handleSaveImg={handleSaveImg}
              handleResetImg={handleResetImg}
            />
          </section>
          <section className={upload["submit"]}>
            <button
              className={upload["submit__button"]}
              onClick={handleShowPreview}
            >
              preview
            </button>
          </section>
        </section>
      </main>
    </ServiceLayout>
  );
};

export default UploadPage;
