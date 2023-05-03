import inputFile from '@/styles/upload/input_file.module.scss';
import { Dispatch, RefObject, SetStateAction } from 'react';

interface Props {
  inputFileRef: RefObject<HTMLInputElement>;
  imgURL: string;
  setShowCrop: Dispatch<SetStateAction<boolean>>;
  handleSaveImg: (file: File) => void;
  handleResetImg: () => void;
}

const InputFile = ({ inputFileRef, imgURL, setShowCrop, handleSaveImg, handleResetImg }: Props) => {
  return (
    <section className={inputFile['input-file']}>
      <form>
        <div className={inputFile['reset']}>
          <button type="button" onClick={handleResetImg}>
            취소
          </button>
        </div>
        {imgURL ? (
          <div className={inputFile['crop']}>
            <button type="button" onClick={() => setShowCrop((_pre) => true)}>
              편집
            </button>
          </div>
        ) : (
          <div className={inputFile['upload']}>
            <label htmlFor="upload_file_input" tabIndex={0}>
              업로드
            </label>
          </div>
        )}
        <input
          id="upload_file_input"
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
    </section>
  );
};

export default InputFile;
