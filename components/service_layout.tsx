import Head from "next/head";
import GNB from "./GNB";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import FirebaseClient from "@/models/firebase_client";
import { User } from "firebase/auth";
import { userInfoAtom } from "@/recoil/atoms";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const ServiceLayout = ({ title = "Pairz!", children }: Props) => {
  const setUserinfo = useSetRecoilState(userInfoAtom);

  useEffect(() => {
    const unsubscribe =
      FirebaseClient.getInstance().Auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** observe*/
  const authStateChanged = (authState: User | null) => {
    if (authState) {
      const { displayName, email, photoURL, uid } = authState;
      setUserinfo({
        displayName,
        email,
        photoURL,
        uid,
      });
    }
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://img.icons8.com/external-vectorslab-flat-vectorslab/53/null/external-cards-travel-and-tour-camping-and-navigation-vectorslab-flat-vectorslab.png"
        />
      </Head>
      <GNB />
      {children}
    </div>
  );
};

export default ServiceLayout;
