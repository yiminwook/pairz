import FirebaseClient from "@/models/firebase_client";
import { AddResult } from "@/models/member/member.model";
import { emailToEmailId } from "@/utils/email_to_emailId";
import axios, { AxiosResponse } from "axios";
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const signIn = async (): Promise<AddResult> => {
  const provider = new GoogleAuthProvider();
  const auth = FirebaseClient.getInstance().Auth;
  const signInResult = await signInWithPopup(auth, provider);
  if (!signInResult.user) throw new Error("Faild signIn");
  const { email, uid, photoURL, displayName } = signInResult.user;
  const emailId = emailToEmailId(email);
  if (!auth.currentUser) throw new Error("Undefind currentUser");
  const idToken = await auth.currentUser.getIdToken(true);
  const addResult: AxiosResponse<AddResult> = await axios({
    method: "POST",
    url: "/api/member.add",
    data: {
      email,
      uid,
      photoURL,
      emailId,
      displayName,
      idToken,
    },
    headers: { "Content-type": "application/json" },
    withCredentials: true,
  });
  const { status, data } = addResult;
  if (!(status === 200 && data.result)) throw new Error("Faild Login");
  return data;
};

export const signOut = async () => {
  await FirebaseClient.getInstance().Auth.signOut();
};