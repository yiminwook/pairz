import { verifyingIdx } from "@/utils/validation";
import FirebaseAdmin from "../firebase_admin";
import { ParsedScoreInfo, ScoreInfo } from "../Info";

export const SCORE_COL = "scores";
const SCORE_COL_PER_PAGE: number = 10;

const { db, Firestore } = FirebaseAdmin.getInstance();

const get = async (
  idx?: string
): Promise<{ scoreData: ParsedScoreInfo[]; lastIdx: number }> => {
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
  const scoreData: ParsedScoreInfo[] = scoreDoc.docs.map((doc) => {
    const docData = doc.data() as ScoreInfo;
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
  });

  return {
    scoreData,
    lastIdx: scoreData.at(-1)?.score ?? 0,
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
}): Promise<{ result: boolean }> => {
  const addResult = await db.runTransaction(async (transaction) => {
    const scoreSizeRef = db
      .collection(SCORE_COL)
      .orderBy("id", "desc")
      .limit(1);
    const scoreSizeDoc = await transaction.get(scoreSizeRef);
    const scoreSizeLastData = scoreSizeDoc.docs.map(
      (doc) => doc.data() as ScoreInfo
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
  if (addResult < 0 || !addResult) throw new Error("Faild to add score ");
  return { result: true };
};

const scoreModel = {
  get,
  add,
};

export default scoreModel;
