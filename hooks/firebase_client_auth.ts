import FirebaseClient from "@/models/firebase_client";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const signIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const signInResult = await signInWithPopup(
      FirebaseClient.getInstance().Auth,
      provider
    );
    if (signInResult.user) {
      const { email, uid, photoURL, displayName } = signInResult.user;
      const emailId = email?.replace(/@(.*)\.(com|co.kr)$/gi, "");
      axios.post(
        "/api/member.add",
        {
          email,
          uid,
          photoURL,
          emailId,
          displayName,
        },
        {
          headers: { "Content-type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

export const signOut = async () => {
  try {
    await FirebaseClient.getInstance().Auth.signOut();
  } catch (err) {
    console.error(err);
  }
};
