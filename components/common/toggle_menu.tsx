import Link from "next/link";
import gnb from "@/styles/gnb.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  signOutHandler: () => void;
}

const ToggleMenu = ({ signOutHandler }: Props) => {
  return (
    <>
      <div className={gnb["menu__toggle"]}>
        <ul className={gnb["menu__toggle__container"]}>
          <div className={gnb["menu__toggle__top"]} />
          <li className={gnb["menu__toggle__upload"]}>
            <Link href="/upload">upload</Link>
          </li>
          <li>
            <button
              className={gnb["menu__toggle__sign-out"]}
              onClick={signOutHandler}
            >
              sign out
            </button>
          </li>
          <hr />
          <li>
            <label
              className={gnb["menu__toggle__close"]}
              htmlFor="toggle-menu"
              tabIndex={0}
            >
              <p>close</p>
              <FontAwesomeIcon icon={faXmark} style={{ width: "1rem" }} />
            </label>
          </li>
        </ul>
      </div>
      <label className={gnb["menu__toggle__back-drop"]} htmlFor="toggle-menu" />
    </>
  );
};

export default ToggleMenu;
