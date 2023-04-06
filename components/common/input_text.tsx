import inputText from "@/styles/common/input_text.module.scss";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RefObject } from "react";

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  placeholder: string;
  width?: string;
}

const InputText = ({ inputRef, placeholder }: Props) => {
  return (
    <div className={inputText["container"]}>
      <div className={inputText["icon"]}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          style={{ width: "1.5rem", height: "1.5rem" }}
        />
      </div>
      <input type="type" ref={inputRef} placeholder={placeholder} />
    </div>
  );
};

export default InputText;
