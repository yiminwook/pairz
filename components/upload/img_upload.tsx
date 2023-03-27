import axios, { AxiosResponse } from "axios";
import React, { useRef, useState } from "react";
import upload from "@/styles/upload/upload.module.scss";
import { useSetRecoilState } from "recoil";
import { isLoadingAtom } from "@/recoil/atoms";
import Crop from "./crop";
import FirebaseClient from "@/models/firebase_client";
import { useRouter } from "next/router";
import DragDrop from "./drag_drop";
import CheckTitle from "./check_title";
import InputFile from "./input_file";

/* 이미지 사이즈 제한 단위 px */
const [fixedImgWidth, fixedImgHeight] = [200, 300];

const ImgUpload = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);

  const [imgFile, setImgFile] = useState<File | undefined>(undefined);
  const [imgURL, setImgURL] = useState<string>("");
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [isValidName, setIsValidName] = useState<boolean>(false);

  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const router = useRouter();

  const send = async () => {
    const width = imgRef.current?.naturalWidth;
    const height = imgRef.current?.naturalHeight;
    const idToken =
      await FirebaseClient.getInstance().Auth.currentUser?.getIdToken(true);
    if (!idToken) {
      alert("비정상적인 접근 또는 로그인이 만료되었습니다");
    }
    if (!imgFile) {
      alert("이미지를 먼저 업로드 해주세요");
      return;
    }
    if (!isValidName) {
      alert("이미지명의 유효성검사를 하지않았습니다");
      return;
    }
    if (width !== fixedImgWidth && height !== fixedImgHeight) {
      alert(
        `이미지는 ${fixedImgWidth} x ${fixedImgHeight}만 업로드 가능합니다.`
      );
      return;
    }
    try {
      setIsLoading((_pre) => true);
      const imageNameValue = inputNameRef.current?.value;
      if (!imageNameValue) throw new Error("nameValue undefined!");
      const formData = new FormData();
      formData.append("image", imgFile);
      formData.append("imageName", imageNameValue);
      formData.append("imageType", imgFile.type);
      const result: AxiosResponse<{ message: string }> = await axios({
        method: "POST",
        url: "/api/image.add",
        data: formData,
        headers: {
          "Contest-Type": "multipart/form-data",
          authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      });
      if (result.status === 401) {
        router.push("/401");
      }
      if (result) {
        alert(result.data.message + " created!");
        handleResetImg();
        handleResetCheckImgName();
      }
      setIsLoading((_pre) => false);
    } catch (err) {
      console.error(err);
      setIsLoading((_pre) => false);
    }
  };

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
      setIsValidName((_pre) => false);
    }
  };

  const handleResetCheckImgName = () => {
    if (inputNameRef.current) {
      inputNameRef.current.disabled = false;
      setIsValidName((_pre) => false);
    }
  };

  return (
    <>
      <div className={upload.container}>
        <InputFile
          inputFileRef={inputFileRef}
          imgURL={imgURL}
          setShowCrop={setShowCrop}
          handleSaveImg={handleSaveImg}
          handleResetImg={handleResetImg}
        />
        <div className={upload.uploading_container}>
          <DragDrop
            fixedImgWidth={fixedImgWidth}
            fixedImgHeight={fixedImgHeight}
            imgURL={imgURL}
            imgRef={imgRef}
            handleSaveImg={handleSaveImg}
          />
        </div>
        <div className={upload.uploading_option}>
          <CheckTitle
            inputNameRef={inputNameRef}
            isValidName={isValidName}
            setIsValidName={setIsValidName}
            handleResetCheckImgName={handleResetCheckImgName}
          />
        </div>
        <div className={upload.submit}>
          <button className={upload.submit_button} onClick={send}>
            submit
          </button>
        </div>
      </div>
      {imgURL && showCrop && (
        <div className={upload.cropper_container}>
          <Crop
            imgURL={imgURL}
            fixedImgWidth={fixedImgWidth}
            fixedImgHeight={fixedImgHeight}
            imgFile={imgFile}
            setShowCrop={setShowCrop}
            handleSaveImg={handleSaveImg}
          />
        </div>
      )}
    </>
  );
};

export default ImgUpload;
