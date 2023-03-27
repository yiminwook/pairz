import Head from "next/head";
import GNB from "./GNB";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import FirebaseClient from "@/models/firebase_client";
import { User } from "firebase/auth";
import { isLoadingAtom, userInfoAtom } from "@/recoil/atoms";
import { emailToEmailId } from "@/utils/email_to_emailId";
import Loading from "./loading";

interface Props {
  title?: string;
  showGNB: boolean;
  children: React.ReactNode;
}

const ServiceLayout = ({ title = "Pairz!", showGNB, children }: Props) => {
  const setUserinfo = useSetRecoilState(userInfoAtom);
  const isLoading = useRecoilValue(isLoadingAtom);

  useEffect(() => {
    const unsubscribe =
      FirebaseClient.getInstance().Auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** observe*/
  const authStateChanged = async (authState: User | null) => {
    if (authState) {
      const { displayName, email, photoURL, uid } = authState;
      const emailId = emailToEmailId(email);
      setUserinfo((_pre) => {
        return {
          uid,
          email,
          emailId,
          displayName,
          photoURL,
        };
      });
    } else {
      setUserinfo((_pre) => null);
    }
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {showGNB && <GNB />}
      {isLoading && <Loading />}
      {children}
    </div>
  );
};

export default ServiceLayout;
