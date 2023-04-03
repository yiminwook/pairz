import imageModel from "@/models/image/image.model";
import { isLoadingAtom } from "@/recoil/atoms";
import checkTitle from "@/styles/upload/check_title.module.scss";
import { verifyingStr } from "@/utils/validation";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import { useSetRecoilState } from "recoil";

interface Props {
  inputNameRef: RefObject<HTMLInputElement>;
  isValidTitle: boolean;
  setIsValidTitle: Dispatch<SetStateAction<boolean>>;
  handleResetCheckTitle: () => void;
}

const CheckTitle = ({
  inputNameRef,
  isValidTitle,
  setIsValidTitle,
  handleResetCheckTitle,
}: Props) => {
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const handleCheckTitle = async (e: FormEvent) => {
    e.preventDefault();
    setIsValidTitle((_pre) => false);
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
        const checkTitleResult: AxiosResponse<
          Awaited<ReturnType<typeof imageModel.checkTitle>>
        > = await axios.get(`/api/image.get?title=${decodeValue}`);
        setIsLoading(() => false);
        //응답수정필요
        if (checkTitleResult.status !== 200 || !checkTitleResult.data.result) {
          alert("중복된 이미지명입니다");
          return;
        }
        setIsValidTitle((_pre) => true);
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
            <div className={checkTitle["title__container__left"]}>
              <div className={checkTitle["input__icon"]}>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{ width: "1.5rem", height: "1.5rem" }}
                />
              </div>
              <input
                type="type"
                ref={inputNameRef}
                placeholder="타이틀을 입력"
              ></input>
            </div>
            <div className={checkTitle["title__container__right"]}>
              {isValidTitle ? (
                <button
                  className={checkTitle["reset__button"]}
                  type="button"
                  onClick={handleResetCheckTitle}
                >
                  수정
                </button>
              ) : (
                <button
                  className={checkTitle["check__button"]}
                  type="button"
                  onClick={handleCheckTitle}
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

export default CheckTitle;
