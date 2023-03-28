import Link from "next/link";
import gnb from "@/styles/gnb.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { RefObject } from "react";

interface Props {
  toggleMenuRef: RefObject<HTMLDivElement>;
  signOutHandler: () => void;
  handleMenu: () => void;
}

const ToggleMenu = ({ toggleMenuRef, signOutHandler, handleMenu }: Props) => {
  return (
    <div className={gnb["menu-toggle"]} ref={toggleMenuRef}>
      <ul className={gnb["menu-toggle__container"]}>
        <div className={gnb["menu-toggle__top"]} />
        <li className={gnb["menu-toggle__upload"]}>
          <Link href="/image/upload">upload</Link>
        </li>
        <li>
          <button
            className={gnb["menu-toggle__sign-out"]}
            onClick={signOutHandler}
          >
            sign out
          </button>
        </li>
        <hr />
        <li>
          <button className={gnb["menu-toggle__close"]} onClick={handleMenu}>
            <p>close</p>
            <FontAwesomeIcon
              icon={faXmark}
              size="2xs"
              style={{ width: "1rem" }}
            />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ToggleMenu;
