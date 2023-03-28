import ServiceLayout from "@/components/common/service_layout";
import { NextPage } from "next";
import { useSetRecoilState } from "recoil";
import { isLoadingAtom } from "@/recoil/atoms";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { validatonToken } from "@/hooks/vaildation_token";
import ImgUpload from "@/components/upload/img_upload";

const UploadPage: NextPage = () => {
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
      router.push("/401");
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
