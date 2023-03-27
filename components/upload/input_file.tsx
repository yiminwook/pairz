import input_file from "@/styles/upload/input_file.module.scss";
import { Dispatch, FC, RefObject, SetStateAction } from "react";

interface Props {
  inputFileRef: RefObject<HTMLInputElement>;
  imgURL: string;
  setShowCrop: Dispatch<SetStateAction<boolean>>;
  handleSaveImg: (file: File) => void;
  handleResetImg: () => void;
}

const InputFile: FC<Props> = ({
  inputFileRef,
  imgURL,
  setShowCrop,
  handleSaveImg,
  handleResetImg,
}) => {
  return (
    <form className={input_file.file_form}>
      {imgURL ? (
        <button
          type="button"
          className={input_file.file_form_cropper_button}
          onClick={() => setShowCrop((_pre) => true)}
        >
          편집
        </button>
      ) : (
        <label
          className={input_file.file_input_button}
          htmlFor="upload_file_input"
        >
          업로드
        </label>
      )}
      <input
        id="upload_file_input"
        className={input_file.file_input}
        type="file"
        accept=".png, .jpeg, .jpg"
        name="cardImg"
        multiple={false}
        ref={inputFileRef}
        style={{ display: "none", visibility: "hidden" }}
        onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => {
          if (e.target.files && e.target.files.length > 0) {
            const newfile = e.target.files[0];
            handleSaveImg(newfile);
          }
        }}
      ></input>
      <button
        type="button"
        className={input_file.file_reset_button}
        onClick={handleResetImg}
      >
        취소
      </button>
    </form>
  );
};

export default InputFile;
