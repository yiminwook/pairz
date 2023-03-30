import ServiceLayout from "@/components/common/service_layout";
import { signOut } from "@/hooks/firebase_client_auth";
import Link from "next/link";
import { useEffect } from "react";
import unauthorized from "@/styles/error/unauthorized.module.scss";

const Unauthorized = () => {
  useEffect(() => {
    signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ServiceLayout>
      <div className={unauthorized["container"]}>
        <div className={unauthorized["modal__container"]}></div>
        <div className={unauthorized["modal__backdrop"]} />
        <div className={unauthorized["modal__content"]}>
          <div>
            <h1 className={unauthorized["modal__title"]}>Unauthorized</h1>
            <h2 className={unauthorized["modal__desc"]}>
              세션이 만료되었습니다.
            </h2>
          </div>
          <div className={unauthorized["modal__home"]}>
            <Link href="/" className={unauthorized["modal__home__link"]}>
              Home으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
};

export default Unauthorized;
