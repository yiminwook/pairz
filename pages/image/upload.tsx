import ImgUpload from "@/components/img_upload";
import ServiceLayout from "@/components/service_layout";
import { NextPage } from "next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoadingAtom, userInfoAtom } from "@/recoil/atoms";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "@/hooks/firebase_client_auth";
import { validatonToken } from "@/hooks/vaildation_token";

interface Props {}

const UploadPage: NextPage<Props> = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  const router = useRouter();
  const setIsLoading = useSetRecoilState(isLoadingAtom);

  const validaton = async () => {
    try {
      setIsLoading((_pre) => true);
      await validatonToken();
      setIsLoading((_pre) => false);
    } catch (err) {
      setIsLoading((_pre) => false);
      console.error(err);
      await signOut();
      alert("다시 로그인 해주세요");
      router.push("/");
    }
  };

  useEffect(() => {
    validaton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ServiceLayout title="Pairz Upload Page" showGNB={true}>
        <ImgUpload />
      </ServiceLayout>
    </>
  );
};

export default UploadPage;
