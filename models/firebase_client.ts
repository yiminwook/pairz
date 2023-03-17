import { getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_API_KEY,
  FIREBASE_AUTH_AUTH_DOMAIN,
} = publicRuntimeConfig;

const firebaseConfig = {
  apiKey: FIREBASE_AUTH_API_KEY || "",
  authDomain: FIREBASE_AUTH_AUTH_DOMAIN || "",
  projectId: FIREBASE_PROJECT_ID || "",
};

export default class FirebaseClient {
  private static instance: FirebaseClient;

  private auth: Auth;

  public constructor() {
    const apps = getApps();
    if (apps.length === 0) {
      initializeApp(firebaseConfig);
    }
    this.auth = getAuth();
  }

  public static getInstance(): FirebaseClient {
    if (
      FirebaseClient.instance === undefined ||
      FirebaseClient.instance === null
    ) {
      FirebaseClient.instance = new FirebaseClient();
    }

    return FirebaseClient.instance;
  }

  public get Auth(): Auth {
    return this.auth;
  }
}
