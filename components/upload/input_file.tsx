import inputFile from "@/styles/upload/input_file.module.scss";
import { Dispatch, RefObject, SetStateAction } from "react";

interface Props {
  inputFileRef: RefObject<HTMLInputElement>;
  imgURL: string;
  setShowCrop: Dispatch<SetStateAction<boolean>>;
  handleSaveImg: (file: File) => void;
  handleResetImg: () => void;
}

const InputFile = ({
  inputFileRef,
  imgURL,
  setShowCrop,
  handleSaveImg,
  handleResetImg,
}: Props) => {
  return (
    <div className={inputFile["container"]}>
      <form className={inputFile["file"]}>
        <div className={inputFile["file__reset"]}>
          <button
            type="button"
            className={inputFile["reset__button"]}
            onClick={handleResetImg}
          >
            취소
          </button>
        </div>
        {imgURL ? (
          <div className={inputFile["file__crop"]}>
            <button
              type="button"
              className={inputFile["crop__button"]}
              onClick={() => setShowCrop((_pre) => true)}
            >
              편집
            </button>
          </div>
        ) : (
          <div className={inputFile["file__upload"]}>
            <label
              className={inputFile["upload__button"]}
              htmlFor="upload_file_input"
              tabIndex={0}
            >
              업로드
            </label>
          </div>
        )}
        <input
          id="upload_file_input"
          className={inputFile["file__input"]}
          type="file"
          accept=".png, .jpeg, .jpg"
          name="cardImg"
          multiple={false}
          ref={inputFileRef}
          onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => {
            if (e.target.files && e.target.files.length > 0) {
              const newfile = e.target.files[0];
              handleSaveImg(newfile);
            }
          }}
        ></input>
      </form>
    </div>
  );
};

export default InputFile;
