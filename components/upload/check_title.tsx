import imageModel from "@/models/image/image.model";
import check_title from "@/styles/upload/check_title.module.scss";
import { verifyingStr } from "@/utils/validation";
import axios, { AxiosResponse } from "axios";
import { Dispatch, FC, RefObject, SetStateAction } from "react";

interface Props {
  inputNameRef: RefObject<HTMLInputElement>;
  isValidName: boolean;
  setIsValidName: Dispatch<SetStateAction<boolean>>;
  handleResetCheckImgName: () => void;
}

const CheckTitle: FC<Props> = ({
  inputNameRef,
  isValidName,
  setIsValidName,
  handleResetCheckImgName,
}) => {
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
      const checkImageNameResult: AxiosResponse<
        Awaited<ReturnType<typeof imageModel.checkImageName>>
      > = await axios.get(`/api/image.get?imageName=${decodeValue}`);
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

  return (
    <div>
      <form className={check_title.name_form}>
        <label>이미지명</label>
        <div>
          <input
            type="type"
            className={check_title.name_input}
            ref={inputNameRef}
          ></input>
          {isValidName ? (
            <button
              className={check_title.name_button__reset}
              type="button"
              onClick={handleResetCheckImgName}
            >
              수정
            </button>
          ) : (
            <button
              className={check_title.name_button__check}
              type="button"
              onClick={handleCheckImageName}
            >
              중복확인
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CheckTitle;
