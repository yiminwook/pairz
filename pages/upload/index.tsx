import ImgUpload from "@/components/img_upload";
import ServiceLayout from "@/components/service_layout";
import { NextPage } from "next";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoAtom } from "@/recoil/atoms";

interface Props {}

const UploadPage: NextPage<Props> = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  console.log("test", userInfo);

  return (
    <>
      <ServiceLayout title="Pairz Upload Page">
        <ImgUpload />
      </ServiceLayout>
    </>
  );
};

export default UploadPage;
