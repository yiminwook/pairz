import ServiceLayout from "@/components/common/service_layout";
import { signOut } from "@/hooks/firebase_client_auth";
import Link from "next/link";
import { useEffect } from "react";

const Unauthorized = () => {
  useEffect(() => {
    signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ServiceLayout showGNB={false}>
      <div>세션이 만료되었습니다.</div>
      <Link href="/">Home으로 돌아가기</Link>
    </ServiceLayout>
  );
};

export default Unauthorized;
