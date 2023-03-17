import FirebaseClient from "@/models/firebase_client";
import { emailToEmailId } from "@/utils/email_to_emailId";
import axios from "axios";
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const signIn = async () => {
  const provider = new GoogleAuthProvider();
  const auth = FirebaseClient.getInstance().Auth;
  const signInResult = await signInWithPopup(auth, provider);
  if (signInResult.user) {
    const { email, uid, photoURL, displayName } = signInResult.user;
    const emailId = emailToEmailId(email);
    if (!auth.currentUser) throw new Error("undefind currentUser");
    const idToken = await auth.currentUser.getIdToken(true);
    const result = await axios.post(
      "/api/member.add",
      {
        email,
        uid,
        photoURL,
        emailId,
        displayName,
        idToken,
      },
      {
        headers: { "Content-type": "application/json" },
      }
    );
    if (result.status !== 200) throw new Error("Faild Login");
    // await auth.setPersistence(browserSessionPersistence);
  }
};

export const signOut = async () => {
  await FirebaseClient.getInstance().Auth.signOut();
};
