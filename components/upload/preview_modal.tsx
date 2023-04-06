import { isLoadingAtom, userInfoAtom } from "@/recoil/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios, { AxiosResponse } from "axios";
import FirebaseClient from "@/models/firebase_client";
import imageModel from "@/models/image/image.model";
import { Dispatch, RefObject, SetStateAction } from "react";
import preview from "@/styles/upload/preview.module.scss";
import Card from "../common/card";

interface Props {
  inputNameRef: RefObject<HTMLInputElement>;
  imgRef: RefObject<HTMLImageElement>;
  imgFile: File | undefined;
  imgURL: string;
  isValidName: boolean;
  fixedImgWidth: number;
  fixedImgHeight: number;
  handleResetImg: () => void;
  handleResetCheckName: () => void;
  setShowPreview: Dispatch<SetStateAction<boolean>>;
}

const Preview = ({
  inputNameRef,
  imgRef,
  imgFile,
  imgURL,
  isValidName,
  fixedImgWidth,
  fixedImgHeight,
  handleResetImg,
  handleResetCheckName,
  setShowPreview,
}: Props) => {
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const userInfo = useRecoilValue(userInfoAtom);

  const send = async () => {
    const width = imgRef.current?.naturalWidth;
    const height = imgRef.current?.naturalHeight;
    const idToken =
      await FirebaseClient.getInstance().Auth.currentUser?.getIdToken(true);
    if (!(idToken && userInfo?.uid)) {
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
      formData.append("uid", userInfo?.uid ?? "");
      const result: AxiosResponse<Awaited<ReturnType<typeof imageModel.add>>> =
        await axios({
          method: "POST",
          url: "/api/image.add",
          data: formData,
          headers: {
            "Contest-Type": "multipart/form-data",
            authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        });
      if (result) {
        alert(result.data.message);
        handleResetImg();
        handleResetCheckName();
      }
      setIsLoading((_pre) => false);
    } catch (err) {
      console.error(err);
      setIsLoading((_pre) => false);
    }
  };
  return (
    <section className={preview["container"]}>
      <div className={preview["back-drop"]} />
      <div className={preview["content"]}>
        <Card
          idx={0}
          color="white"
          imgURL={imgURL}
          isFlip={false}
          isDisable={false}
          isPreView={true}
        />
        <h2 className={preview["title"]}>
          Title: {inputNameRef.current?.value ?? "Error"}
        </h2>
        <div className={preview["button__container"]}>
          <div className={preview["cancel"]}>
            <button
              className={preview["cancel__button"]}
              onClick={() => setShowPreview(() => false)}
            >
              cancel
            </button>
          </div>
          <div className={preview["upload"]}>
            <button className={preview["upload__button"]} onClick={send}>
              upload
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
