import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { Cropper, ReactCropperElement } from "react-cropper";
import React, { useRef, useState } from "react";
import img_upload from "@/styles/img_upload.module.scss";
import "cropperjs/dist/cropper.css";

const ImgUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [fixedImgWidth, fixedImgHeight] = [200, 300];

  const send = async () => {
    const width = imgRef.current?.naturalWidth;
    const height = imgRef.current?.naturalHeight;

    if (width !== fixedImgWidth && height !== fixedImgHeight) {
      alert("이미지는 200 300만 업로드 가능합니다. ");
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append("img", file);
      formData.append("title", "title");
      const result: AxiosResponse<{ message: string }> = await axios.post(
        "/api/upload",
        formData,
        {
          headers: {
            "Contest-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      imgReset();
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef?.current?.cropper?.getCroppedCanvas({
      width: fixedImgWidth,
      height: fixedImgHeight,
    });
    cropper?.toBlob((blob) => {
      const fileName = inputRef?.current?.files?.[0]?.name;
      if (blob && fileName) {
        const newFile = new File([blob], fileName);
        saveFile(newFile);
      }
    });
  };

  const saveFile = (file: File) => {
    if (file.type !== "image/png") {
      alert("image png 파일만 업로드 가능합니다.");
      imgReset();
      return;
    }
    setFile((_pre) => file);
    URL.revokeObjectURL(imgUrl);
    setImgUrl((_pre) => URL.createObjectURL(file));
    setShowCrop((_pre) => false);
  };

  const imgReset = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      URL.revokeObjectURL(imgUrl);
      setImgUrl((_pre) => "");
      setFile((_pre) => undefined);
      setShowCrop((_pre) => false);
    }
  };

  return (
    <>
      <div className={img_upload.container}>
        <form className={img_upload.form}>
          <label>file</label>
          <input
            type="file"
            name="cardImg"
            ref={inputRef}
            id="card-img--input"
            onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => {
              if (e.target.files && e.target.files.length > 0) {
                const newfile = e.target.files[0];
                saveFile(newfile);
              }
            }}
          ></input>
          <button
            type="button"
            className={img_upload.form_reset}
            onClick={imgReset}
          >
            삭제하기
          </button>
        </form>
        {imgUrl && (
          <>
            {showCrop && (
              <div className={img_upload.cropper_container}>
                <Cropper
                  ref={cropperRef}
                  src={imgUrl}
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
                src={imgUrl}
                ref={imgRef}
                alt="preview"
                width={fixedImgWidth}
                height={fixedImgHeight}
              />
            </div>
            <div className={img_upload.button}>
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
