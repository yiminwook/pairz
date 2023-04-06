import imageModel from "@/models/image/image.model";
import { isLoadingAtom } from "@/recoil/atoms";
import checkName from "@/styles/upload/check_name.module.scss";
import { verifyingStr } from "@/utils/validation";
import axios, { AxiosResponse } from "axios";
import { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import { useSetRecoilState } from "recoil";
import InputText from "../common/input_text";

interface Props {
  inputNameRef: RefObject<HTMLInputElement>;
  isValidName: boolean;
  setIsValidName: Dispatch<SetStateAction<boolean>>;
  handleResetCheckName: () => void;
}

const CheckName = ({
  inputNameRef,
  isValidName,
  setIsValidName,
  handleResetCheckName,
}: Props) => {
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const handleCheckName = async (e: FormEvent) => {
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
        const encodeValue = encodeURIComponent(inputNameValue);
        const checkNameResult: AxiosResponse<
          Awaited<ReturnType<typeof imageModel.checkName>>
        > = await axios.get(`/api/image.check?name=${encodeValue}`);
        setIsLoading(() => false);
        //응답수정필요
        if (checkNameResult.status !== 200 || !checkNameResult.data.result) {
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
    <form className={checkName["container"]}>
      <div className={checkName["content"]}>
        <div className={checkName["name"]}>
          <label className={checkName["name__label"]}>Name</label>
          <div className={checkName["name__container"]}>
            <div className={checkName["name__container__left"]}>
              <InputText inputRef={inputNameRef} placeholder="타이틀을 입력" />
            </div>
            <div className={checkName["name__container__right"]}>
              {isValidName ? (
                <button
                  className={checkName["reset__button"]}
                  type="button"
                  onClick={handleResetCheckName}
                >
                  수정
                </button>
              ) : (
                <button
                  className={checkName["check__button"]}
                  type="button"
                  onClick={handleCheckName}
                >
                  중복확인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckName;
