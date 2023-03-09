import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import img_upload from "@/styles/img_upload.module.scss";

const ImgUpload = () => {
  const imgRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImgUrl] = useState<Blob | null>(null);
  const [imgToBase64, setImgToBase64] = useState<string>("");

  const send = async () => {
    if (imgUrl) {
      const formData = new FormData();
      formData.append("img", imgUrl);
      const result = await axios.post("/api/upload", formData, {
        headers: {
          "Contest-Type": "multipart/form-data",
        },
      });

      console.log(result);
    }
  };

  const imgRendering = () => {
    const reader = new window.FileReader();
    if (imgUrl) {
      reader.readAsDataURL(imgUrl);
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
    setImgUrl((_pre) => null);
  };

  useEffect(() => {
    return imgRendering();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl]);

  return (
    <div className={img_upload.container}>
      <form className={img_upload.form} onSubmit={send}>
        <label>file</label>
        <input
          type="file"
          name="cardImg"
          id="card-img--input"
          onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              setImgUrl((_pre) => file);
            }
          }}
        ></input>
        <button className={img_upload.form_reset} onClick={imgReset}>
          삭제하기
        </button>
      </form>
      {imgUrl && (
        <>
          <div className={img_upload.img_container}>
            <Image
              className={img_upload.preView}
              src={URL.createObjectURL(imgUrl)}
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
