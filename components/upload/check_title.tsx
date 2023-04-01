import imageModel from "@/models/image/image.model";
import { isLoadingAtom } from "@/recoil/atoms";
import checkTitle from "@/styles/upload/check_title.module.scss";
import { verifyingStr } from "@/utils/validation";
import axios, { AxiosResponse } from "axios";
import { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
  inputNameRef: RefObject<HTMLInputElement>;
  isValidName: boolean;
  setIsValidName: Dispatch<SetStateAction<boolean>>;
  handleResetCheckTitle: () => void;
}

const CheckTitle = ({
  inputNameRef,
  isValidName,
  setIsValidName,
  handleResetCheckTitle: handleResetCheckImgName,
}: Props) => {
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const handleCheckImageName = async (e: FormEvent) => {
    e.preventDefault();
    setIsValidName((_pre) => false);
    try {
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
        setIsLoading(() => true);
        const decodeValue = encodeURIComponent(inputNameValue);
        const checkImageNameResult: AxiosResponse<
          Awaited<ReturnType<typeof imageModel.checkImageName>>
        > = await axios.get(`/api/image.get?imageName=${decodeValue}`);
        setIsLoading(() => false);
        //응답수정필요
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
    } catch (err) {
      console.error(err);
      setIsLoading(() => false);
    }
  };

  return (
    <form className={checkTitle["container"]}>
      <div className={checkTitle["content"]}>
        <div className={checkTitle["title"]}>
          <label className={checkTitle["title__label"]}>Title</label>
          <div className={checkTitle["title__container"]}>
            <input
              type="type"
              className={checkTitle["title__container__input"]}
              ref={inputNameRef}
              placeholder="타이틀을 적어주세요"
            ></input>

            {isValidName ? (
              <div className={checkTitle["title__container__reset"]}>
                <button
                  className={checkTitle["reset__button"]}
                  type="button"
                  onClick={handleResetCheckImgName}
                >
                  수정
                </button>
              </div>
            ) : (
              <div className={checkTitle["title__container__check"]}>
                <button
                  className={checkTitle["check__button"]}
                  type="button"
                  onClick={handleCheckImageName}
                >
                  중복확인
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckTitle;
