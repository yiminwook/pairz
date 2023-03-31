import { firestore } from "firebase-admin";

export interface UserInfo {
  uid: string;
  email: string | null;
  emailId: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ImageInfo {
  id: number;
  imgURL: string;
  uid: string;
  imageName: string;
}

export interface ScoreInfo {
  id: number;
  uid: string;
  score: number;
  displayName: string;
  createAt: firestore.Timestamp;
}

export interface ParsedScoreInfo extends Omit<ScoreInfo, "createAt"> {
  createAt: number;
  korTime?: string;
}
