import { verifyingIdx } from "@/utils/validation";
import { firestore } from "firebase-admin";
import FirebaseAdmin from "../firebase_admin";

export const SCORE_COL = "scores";
const SCORE_COL_PER_PAGE: number = 10;

export interface scoreInfo {
  id: number;
  uid: string;
  score: number;
  displayName: string;
  createAt: number;
  korTime?: string;
}

export interface scoreResult {
  scoreData: scoreInfo[];
  total: number;
  lastIdx?: number;
}

const { db, Firestore } = FirebaseAdmin.getInstance();

const get = async (idx?: string): Promise<scoreResult> => {
  let scoreRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
  const isValidIdx = verifyingIdx(idx);
  if (isValidIdx && idx) {
    scoreRef = db
      .collection(SCORE_COL)
      .where("score", "<=", +idx)
      .orderBy("score", "desc")
      .orderBy("id", "desc")
      .limit(SCORE_COL_PER_PAGE);
  } else {
    scoreRef = db
      .collection(SCORE_COL)
      .orderBy("score", "desc")
      .orderBy("id", "desc")
      .limit(SCORE_COL_PER_PAGE);
  }
  const scoreDoc = await scoreRef.get();
  const scoreData = scoreDoc.docs.map((doc) => {
    const docData = doc.data() as Omit<scoreInfo, "createAt"> & {
      createAt: firestore.Timestamp;
    };
    const time =
      docData.createAt.toDate().getTime() + +(process.env.LOCAL_TIME ?? 0);
    const korDate = new Date(time);
    const korTime = korDate.toLocaleString("ko-kr", {
      year: "2-digit",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h24",
    });

    return {
      ...docData,
      createAt: time,
      korTime,
    };
  }) as scoreInfo[];

  return {
    scoreData,
    lastIdx: scoreData.at(-1)?.score,
    total: scoreData.length,
  };
};

const add = async ({
  uid,
  score,
  displayName,
}: {
  uid: string;
  score: number;
  displayName: string;
}): Promise<boolean> => {
  try {
    const addResult = await db.runTransaction(async (transaction) => {
      const scoreSizeRef = db
        .collection(SCORE_COL)
        .orderBy("id", "desc")
        .limit(1);
      const scoreSizeDoc = await transaction.get(scoreSizeRef);
      const scoreSizeLastData = scoreSizeDoc.docs.map(
        (doc) => doc.data() as scoreInfo
      )[0];

      const scoreRef = db.collection(SCORE_COL).doc();
      await transaction.get(scoreRef);

      const newScoreData = {
        uid,
        score,
        createAt: Firestore.FieldValue.serverTimestamp(),
        displayName: displayName ?? "Anonymous",
        id: scoreSizeLastData?.id + 1 || 1,
      };

      transaction.create(scoreRef, newScoreData);

      return newScoreData.id;
    });
    if (addResult) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const scoreModel = {
  get,
  add,
};

export default scoreModel;
