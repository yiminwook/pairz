import FirebaseClient from "@/models/firebase_client";
import memberModel from "@/models/member/member.model";
import { emailToEmailId } from "@/utils/email_to_emailId";
import axios, { AxiosResponse } from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

type addMemberResult = Awaited<ReturnType<typeof memberModel.add>>;
export const signIn = async (): Promise<addMemberResult | undefined> => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = FirebaseClient.getInstance().Auth;
    const signInResult = await signInWithPopup(auth, provider);
    if (!signInResult.user) throw new Error("Faild signIn");
    const { email, uid, photoURL, displayName } = signInResult.user;
    const emailId = emailToEmailId(email);
    if (!auth.currentUser) throw new Error("Undefind currentUser");
    const idToken = await auth.currentUser.getIdToken(true);
    const addResult: AxiosResponse<addMemberResult> = await axios({
      method: "POST",
      url: "/api/member.add",
      data: {
        email,
        uid,
        photoURL,
        emailId,
        displayName,
      },
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${idToken}`,
      },
      withCredentials: true,
    });
    const { status, data } = addResult;
    if (!(status === 200 && data.result)) throw new Error("Faild SignIn");
    return data;
  } catch (err) {
    console.error(err);
    await signOut();
  }
};

/** firebaseClient signOut */
export const signOut = async () => {
  await FirebaseClient.getInstance().Auth.signOut();
};
