import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import React, { useRef, useState } from "react";
import img_upload from "@/styles/img_upload.module.scss";

const ImgUpload = () => {
  const imgRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImgUrl] = useState<string>("");

  const send = async () => {
    if (
      imgRef.current &&
      imgRef.current.files &&
      imgRef.current.files.length > 0
    ) {
      const formData = new FormData();
      formData.append("img", imgRef.current.files[0]);
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

  const imgReset = () => {
    if (imgRef.current) {
      imgRef.current.value = "";
      URL.revokeObjectURL(imgUrl);
      setImgUrl((_pre) => "");
    }
  };

  return (
    <div className={img_upload.container}>
      <form className={img_upload.form}>
        <label>file</label>
        <input
          type="file"
          name="cardImg"
          ref={imgRef}
          id="card-img--input"
          onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              URL.revokeObjectURL(imgUrl);
              setImgUrl((_pre) => URL.createObjectURL(file));
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
          <div className={img_upload.img_container}>
            <Image
              className={img_upload.preView}
              src={imgUrl}
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
