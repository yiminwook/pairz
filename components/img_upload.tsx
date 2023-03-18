import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { Cropper, ReactCropperElement } from "react-cropper";
import React, { useRef, useState } from "react";
import img_upload from "@/styles/img_upload.module.scss";
import "cropperjs/dist/cropper.css";
import { verifyingStr } from "@/utils/validation";

const ImgUpload = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [imgURL, setImgURL] = useState<string>("");
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const [fixedImgWidth, fixedImgHeight] = [200, 300];

  const send = async () => {
    const width = imgRef.current?.naturalWidth;
    const height = imgRef.current?.naturalHeight;
    if (!isValidName) {
      alert("이미지명의 유효성검사를 하지않았습니다");
      return;
    }
    if (width !== fixedImgWidth && height !== fixedImgHeight) {
      alert("이미지는 200 300만 업로드 가능합니다. ");
      return;
    }
    try {
      if (!file) throw new Error("Image undefined!");
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef?.current?.cropper?.getCroppedCanvas({
      width: fixedImgWidth,
      height: fixedImgHeight,
    });
    cropper?.toBlob((blob) => {
      const fileName = inputFileRef?.current?.files?.[0]?.name;
      if (blob && fileName) {
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
      alert("사용가능한 이미지명입니다");
    }
  };

  return (
    <>
      <div className={img_upload.container}>
        <form className={img_upload.form}>
          <label
            className={img_upload.input__button}
            htmlFor="upload_file_input"
          >
            업로드
          </label>
          <input
            id="upload_file_input"
            className={img_upload.input}
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
            className={img_upload.form_reset}
            onClick={handleResetImage}
          >
            취소
          </button>
        </form>
        {imgURL && (
          <>
            {showCrop && (
              <div className={img_upload.cropper_container}>
                <Cropper
                  ref={cropperRef}
                  src={imgURL}
                  aspectRatio={fixedImgWidth / fixedImgHeight}
                  style={{ height: "15rem", width: "15rem" }}
                />
                <button onClick={handleCrop}>저장하기</button>
                <button onClick={() => setShowCrop((_pre) => false)}>
                  취소하기
                </button>
              </div>
            )}
            <div className={img_upload.img_container}>
              <Image
                className={img_upload.preView}
                src={imgURL}
                ref={imgRef}
                alt="preview"
                width={fixedImgWidth}
                height={fixedImgHeight}
              />
            </div>
            <div className={img_upload.button}>
              <form>
                <input
                  type="type"
                  className={img_upload.name_input}
                  ref={inputNameRef}
                ></input>
                <button onClick={handleCheckImageName}>중복확인</button>
                <p>문자열과 특수문자는 입력 할수없습니다</p>
              </form>
              <button onClick={() => setShowCrop((_pre) => true)}>
                편집하기
              </button>
              <button onClick={send}>submit</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ImgUpload;
