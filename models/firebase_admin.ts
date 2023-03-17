import { apps, auth, firestore } from "firebase-admin";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

export default class FirebaseAdmin {
  private static instance: FirebaseAdmin;

  private init = false;

  public static getInstance(): FirebaseAdmin {
    if (
      FirebaseAdmin.instance === undefined ||
      FirebaseAdmin.instance === null
    ) {
      FirebaseAdmin.instance = new FirebaseAdmin();
      FirebaseAdmin.instance.bootFirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }
  /** 환경초기화 */
  private bootFirebaseAdmin() {
    const haveapp = apps.length !== 0;
    if (haveapp) {
      this.init = true;
      return;
    }

    const {
      FIREBASE_ADMIN_PROJECT_ID,
      FIREBASE_ADMIN_CLIENT_EMAIL,
      FIREBASE_ADMIN_PRIVATE_KEY,
    } = process.env;

    const credential = {
      projectId: FIREBASE_ADMIN_PROJECT_ID || "",
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL || "",
      privateKey: (FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    };

    initializeApp({ credential: cert(credential) });
  }

  public get db() {
    if (this.init === false) {
      this.bootFirebaseAdmin();
    }
    return getFirestore();
  }

  public get Auth(): auth.Auth {
    if (this.init === false) {
      this.bootFirebaseAdmin();
    }
    return auth();
  }
  public get Firestore() {
    if (this.init === false) {
      this.bootFirebaseAdmin();
    }
    return firestore;
  }
}

// https://firebase.google.com/docs/reference/node/firebase
