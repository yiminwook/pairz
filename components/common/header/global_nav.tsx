import Image from "next/image";
import Link from "next/link";
import globalNav from "@/styles/common/header/global_nav.module.scss";
import UserMenu from "./user_menu";

interface Props {
  signInHandler: () => void;
  signOutHandler: () => void;
}

const GlobalNav = ({ signInHandler, signOutHandler }: Props) => {
  return (
    <>
      <div className={globalNav["home"]}>
        <Link className={globalNav["home__link"]} href="/">
          <Image
            className={globalNav["home__img"]}
            src="/favicon.png"
            width={48}
            height={48}
            alt="GNB_logo"
            priority
          />
        </Link>
      </div>
      <ul className={globalNav["container__right"]}>
        <li className={globalNav["list"]}>
          <Link href="/showcase">SHOWCASE</Link>
        </li>
        <li className={globalNav["list"]}>
          <Link href="/score">SCORE</Link>
        </li>
        <li>
          <UserMenu
            signInHandler={signInHandler}
            signOutHandler={signOutHandler}
          />
        </li>
      </ul>
    </>
  );
};

export default GlobalNav;
