import ImgUpload from "@/components/img_upload";
import ServiceLayout from "@/components/service_layout";
import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "@/hooks/firebase_client_auth";
import { validatonToken } from "@/hooks/vaildation_token";

interface Props {}

const UploadPage: NextPage<Props> = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  const router = useRouter();
  const [load, setLoad] = useState(false);

  const validaton = async () => {
    try {
      await validatonToken();
      setLoad((_pre) => true);
    } catch (err) {
      console.error(err);
      await signOut();
      alert("다시 로그인 해주세요");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    validaton();
  }, []);

  return (
    <>
      <ServiceLayout title="Pairz Upload Page">
        {!load ? (
          <>
            <div>비정상적 접근</div>
          </>
        ) : (
          <>
            <ImgUpload />
          </>
        )}
      </ServiceLayout>
    </>
  );
};

export default UploadPage;
