import { ImageSearch } from "@/pages/showcase";
import head from "@/styles/showcase/head.module.scss";
import { FormEvent, RefObject } from "react";
import InputText from "../common/input_text";

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  nameValue: string;
  handleImgSearchReset: () => void;
  handleFindData: (inputValue: string, bool: false) => void;
}

const Head = ({
  inputRef,
  nameValue,
  handleImgSearchReset,
  handleFindData,
}: Props) => {
  return (
    <form
      className={head["head"]}
      onSubmit={(e: FormEvent<ImageSearch>) => {
        e.preventDefault();
        const inputValue = inputRef.current?.value;
        if (!inputValue) {
          // 입력값이 없을시 리셋
          handleImgSearchReset();
          return;
        }
        handleFindData(inputValue, false);
      }}
    >
      <div className={head["head__top"]}>
        <h2 className={head["title"]}>
          {nameValue.length > 0 ? `검색결과 ${nameValue}` : "최신순"}
        </h2>
      </div>
      <div className={head["head__buttom"]}>
        <div className={head["input"]}>
          <InputText inputRef={inputRef} placeholder="검색" />
        </div>
        <div className={head["button__container"]}>
          <div className={head["search"]}>
            <button className={head["search__button"]} type="submit">
              검색
            </button>
          </div>
          <div className={head["reset"]}>
            <button
              className={head["reset__button"]}
              onClick={handleImgSearchReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default Head;
