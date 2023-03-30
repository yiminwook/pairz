import ServiceLayout from "@/components/common/service_layout";
import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ImgUpload from "@/components/upload/img_upload";

const UploadPage: NextPage = () => {
  const router = useRouter();
  const userInfo = useRecoilValue(userInfoAtom);

  const validaton = async () => {
    if (userInfo !== null && userInfo.uid) {
      return;
    } else {
      router.push("/401");
      return;
    }
  };

  useEffect(() => {
    validaton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ServiceLayout title="Pairz Upload Page">
        <ImgUpload />
      </ServiceLayout>
    </>
  );
};

export default UploadPage;
