import Link from "next/link";
import toggleMenu from "@/styles/common/header/toggle_menu.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  signOutHandler: () => void;
}

const ToggleMenu = ({ signOutHandler }: Props) => {
  return (
    <>
      <div className={toggleMenu["menu__toggle"]}>
        <ul className={toggleMenu["menu__toggle__container"]}>
          <div className={toggleMenu["menu__toggle__top"]} />
          <li className={toggleMenu["menu__toggle__upload"]}>
            <Link href="/upload">upload</Link>
          </li>
          <li>
            <button
              className={toggleMenu["menu__toggle__sign-out"]}
              onClick={signOutHandler}
            >
              sign out
            </button>
          </li>
          <hr />
          <li>
            <label
              className={toggleMenu["menu__toggle__close"]}
              htmlFor="toggle-menu__trigger"
              tabIndex={0}
            >
              <p>close</p>
              <FontAwesomeIcon icon={faXmark} style={{ width: "1rem" }} />
            </label>
          </li>
        </ul>
      </div>
      <label
        className={toggleMenu["menu__toggle__back-drop"]}
        htmlFor="toggle-menu__trigger"
      />
    </>
  );
};

export default ToggleMenu;
