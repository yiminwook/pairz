import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import img_upload from "@/styles/img_upload.module.scss";

const ImgUpload = () => {
  const imgRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<Blob | null>(null);
  const [imgToBase64, setImgToBase64] = useState<string>("");

  const send = async () => {
    if (img) {
      const formData = new FormData();
      formData.append("imgToBase64", imgToBase64);
      formData.append("img", img);
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
    }
  };

  const imgRendering = () => {
    const reader = new window.FileReader();
    if (img) {
      reader.readAsDataURL(img);
      reader.onloadend = () => {
        const base64 = reader.result;
        if (base64) {
          setImgToBase64((_pre) => base64.toString());
        }
      };
      reader.onerror = () => {
        alert("upload error!!");
      };
    }
  };

  const imgReset = () => {
    setImg((_pre) => null);
  };

  useEffect(() => {
    return imgRendering();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]);

  return (
    <div className={img_upload.container}>
      <form className={img_upload.form}>
        <label>file</label>
        <input
          type="file"
          name="cardImg"
          id="card-img--input"
          onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              setImg((_pre) => file);
            }
          }}
        ></input>
        <button className={img_upload.form_reset} onClick={imgReset}>
          삭제하기
        </button>
      </form>
      {img && (
        <>
          <div className={img_upload.img_container}>
            <Image
              className={img_upload.preView}
              src={URL.createObjectURL(img)}
              alt="preview"
              width={200}
              height={300}
            />
          </div>
          <button onClick={send} className={img_upload.button}>
            submit
          </button>
        </>
      )}
    </div>
  );
};

export default ImgUpload;
