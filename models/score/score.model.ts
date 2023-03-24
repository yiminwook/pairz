import FirebaseAdmin from "../firebase_admin";

export const SCORE_COL = "scores";

const { db } = FirebaseAdmin.getInstance();

const get = async () => {
  return true;
};

const add = async ({
  uid,
  score,
  displayName,
}: {
  uid: string;
  score: number;
  displayName: string;
}) => {
  try {
    await db.collection(SCORE_COL).add({
      uid,
      score,
      createAt:
        FirebaseAdmin.getInstance().Firestore.FieldValue.serverTimestamp(),
      displayName: displayName ?? "Anonymous",
    });
    return true;
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
