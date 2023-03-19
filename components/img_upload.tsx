import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { ReactCropperElement } from "react-cropper";
import React, { useRef, useState } from "react";
import img_upload from "@/styles/img_upload.module.scss";
import { verifyingStr } from "@/utils/validation";
import { useSetRecoilState } from "recoil";
import { isLoadingAtom } from "@/recoil/atoms";
import { DragEvent } from "react";
import Crop from "./cropper";
import "cropperjs/dist/cropper.css";

const ImgUpload = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLLabelElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | undefined>(undefined);
  const [imgURL, setImgURL] = useState<string>("");
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [isValidName, setIsValidName] = useState<boolean>(false);

  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const [fixedImgWidth, fixedImgHeight] = [200, 300];

  const send = async () => {
    const width = imgRef.current?.naturalWidth;
    const height = imgRef.current?.naturalHeight;
    if (!file) {
      alert("이미지를 먼저 업로드 해주세요");
      return;
    }
    if (!isValidName) {
      alert("이미지명의 유효성검사를 하지않았습니다");
      return;
    }
    if (width !== fixedImgWidth && height !== fixedImgHeight) {
      alert("이미지는 200 300만 업로드 가능합니다. ");
      return;
    }
    try {
      setIsLoading((_pre) => true);
      const imageNameValue = inputNameRef.current?.value;
      if (!imageNameValue) throw new Error("nameValue undefined!");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("imageName", imageNameValue);
      formData.append("imageType", file.type);
      const result: AxiosResponse<{ message: string }> = await axios.post(
        "/api/image.add",
        formData,
        {
          headers: {
            "Contest-Type": "multipart/form-data",
          },
        }
      );
      if (result) {
        alert(result.data.message + " created!");
        handleResetImage();
        handleResetCheckImageName();
      }
      setIsLoading((_pre) => false);
    } catch (err) {
      console.error(err);
      setIsLoading((_pre) => false);
    }
  };

  const drop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleSaveImage(file);
  };

  const dragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCrop = (cropper: ReactCropperElement["cropper"]) => {
    const cropperCanvas = cropper.getCroppedCanvas({
      width: fixedImgWidth,
      height: fixedImgHeight,
    });
    cropperCanvas?.toBlob((blob) => {
      const fileName =
        file?.name || `Pairz_${Date.now()}_${Math.trunc(Math.random() * 100)}`;
      if (blob) {
        const newFile = new File([blob], fileName, { type: "image/jpeg" });
        handleSaveImage(newFile);
      }
    });
  };

  const handleSaveImage = (file: File) => {
    if (file.type === "image/png" || file.type === "image/jpeg") {
      setFile((_pre) => file);
      URL.revokeObjectURL(imgURL);
      setImgURL((_pre) => URL.createObjectURL(file));
      setShowCrop((_pre) => false);
      return;
    }

    alert("image png 파일만 업로드 가능합니다.");
    handleResetImage();
  };

  const handleResetImage = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
      URL.revokeObjectURL(imgURL);
      setImgURL((_pre) => "");
      setFile((_pre) => undefined);
      setShowCrop((_pre) => false);
      setIsValidName((_pre) => false);
    }
  };

  const handleCheckImageName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidName((_pre) => false);
    if (inputNameRef.current) {
      const inputNameValue = inputNameRef.current.value;
      if (!inputNameValue) {
        alert("입력되지 않았습니다");
        return;
      }
      if (!verifyingStr(inputNameValue)) {
        alert("유효하지않은 이름입니다");
        return;
      }
      const decodeValue = encodeURIComponent(inputNameValue);
      const checkImageNameResult: AxiosResponse<{ result: boolean }> =
        await axios.get(`/api/image.get?imageName=${decodeValue}`);
      if (
        checkImageNameResult.status !== 200 ||
        !checkImageNameResult.data.result
      ) {
        alert("중복된 이미지명입니다");
        return;
      }
      setIsValidName((_pre) => true);
      inputNameRef.current.disabled = true;
      alert("사용가능한 이미지명입니다");
    }
  };

  const handleResetCheckImageName = () => {
    if (inputNameRef.current) {
      inputNameRef.current.disabled = false;
      setIsValidName((_pre) => false);
    }
  };

  return (
    <>
      <div className={img_upload.container}>
        <form className={img_upload.file_form}>
          {imgURL ? (
            <button
              type="button"
              className={img_upload.file_form_cropper_button}
              onClick={() => setShowCrop((_pre) => true)}
            >
              편집
            </button>
          ) : (
            <label
              className={img_upload.file_input_button}
              htmlFor="upload_file_input"
            >
              업로드
            </label>
          )}
          <input
            id="upload_file_input"
            className={img_upload.file_input}
            type="file"
            accept=".png, .jpeg, .jpg"
            name="cardImg"
            multiple={false}
            ref={inputFileRef}
            style={{ display: "none", visibility: "hidden" }}
            onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => {
              if (e.target.files && e.target.files.length > 0) {
                const newfile = e.target.files[0];
                handleSaveImage(newfile);
              }
            }}
          ></input>
          <button
            type="button"
            className={img_upload.file_reset_button}
            onClick={handleResetImage}
          >
            취소
          </button>
        </form>

        <div className={img_upload.uploading_container}>
          <label
            htmlFor="upload_file_input"
            ref={dragRef}
            onDragOver={dragOver}
            onDrop={drop}
          >
            {!imgURL ? (
              <div className={img_upload.uploading__alt}></div>
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
        <div className={img_upload.uploading_option}>
          <form className={img_upload.name_form}>
            <label>이미지명</label>
            <div>
              <input
                type="type"
                className={img_upload.name_input}
                ref={inputNameRef}
              ></input>
              {isValidName ? (
                <button
                  className={img_upload.name_button__reset}
                  type="button"
                  onClick={handleResetCheckImageName}
                >
                  수정
                </button>
              ) : (
                <button
                  className={img_upload.name_button__check}
                  type="button"
                  onClick={handleCheckImageName}
                >
                  중복확인
                </button>
              )}
            </div>
          </form>
        </div>
        <div className={img_upload.submit}>
          <button className={img_upload.submit_button} onClick={send}>
            submit
          </button>
        </div>
      </div>
      {imgURL && showCrop && (
        <Crop
          imgURL={imgURL}
          fixedImgWidth={fixedImgWidth}
          fixedImgHeight={fixedImgHeight}
          handleCrop={handleCrop}
          setShowCrop={setShowCrop}
        />
      )}
    </>
  );
};

export default ImgUpload;
