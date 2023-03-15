import FirebaseClient from "@/models/firebase_client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const signIn = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  try {
    const signInResult = await signInWithPopup(
      FirebaseClient.getInstance().Auth,
      provider
    );
    if (signInResult.user) {
      console.log(signInResult);
    }
  } catch (err) {
    console.error(err);
  }
};

export async function signOut() {
  try {
    await FirebaseClient.getInstance().Auth.signOut();
  } catch (err) {
    console.error(err);
  }
}
