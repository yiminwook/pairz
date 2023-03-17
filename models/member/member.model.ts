import { UserInfo } from "../Info";
import FirebaseAdmin from "../firebase_admin";

export const MEMBER_COL = "members";

const { db } = FirebaseAdmin.getInstance();

type AddResult = { result: boolean; message: string; uid: string };

interface memberResult {
  memberData: UserInfo[];
}

interface memberResultwithLastEmail extends memberResult {
  total: number;
  lastEmail: string | null;
}

/** 로그인할때 마다 유저정보 최신화 */
const add = async ({
  uid,
  email,
  emailId,
  displayName,
  photoURL,
}: UserInfo): Promise<AddResult> => {
  try {
    const addResult = await db.runTransaction(async (transaction) => {
      const memberRef = db.collection(MEMBER_COL).doc(uid);
      const memberDoc = await transaction.get(memberRef);
      const addData = {
        uid: uid,
        email: email ?? null,
        emailId: emailId ?? null,
        displayName: displayName ?? null,
        photoURL: photoURL ?? null,
      };
      if (memberDoc.exists) {
        transaction.update(memberRef, addData);
        return `Updated user ${uid}`;
      } else {
        transaction.set(memberRef, addData);
        return `Created user ${uid}`;
      }
    });
    return { result: true, uid, message: addResult };
  } catch (err) {
    console.error(err);
    throw new Error("Failed upload userData");
  }
};

/** 유저정보를 반환
 *
 *  email를 query로 붙여서 pagenation가능
 *
 *  관리자전용
 */
const get = async (
  email?: string | null
): Promise<memberResultwithLastEmail> => {
  try {
    const getResult = await db.runTransaction(async (transaction) => {
      let memberRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
      if (typeof email === "string") {
        memberRef = db
          .collection(MEMBER_COL)
          .orderBy("email")
          .startAfter(email)
          .limit(5);
      } else {
        memberRef = db.collection(MEMBER_COL).orderBy("email").limit(5);
      }
      const memberDoc = await transaction.get(memberRef);
      const memberData = memberDoc.docs.map((doc) => doc.data()) as UserInfo[];
      console.log(memberData);
      return {
        memberData: memberData,
        total: memberData.length,
        lastEmail: memberData.at(-1)?.email ?? null,
      };
    });

    return getResult;
  } catch (err) {
    throw new Error("Failed to find userData by email");
  }
};

/** email에 해당하는 유저정보 1개를 반환
 *
 *  email이 중복으로 검색될시 에러발생
 */
const findByEmail = async (email: string) => {
  try {
    const memberRef = db.collection(MEMBER_COL).where("email", "==", email);
    const memberDoc = await memberRef.get();
    const memberData = memberDoc.docs.map((doc) => doc.data()) as UserInfo[];
    if (memberData.length > 1) throw new Error("DB Error multiple userEmail");
    return memberData[0];
  } catch (err) {
    throw new Error("Failed to find userData by email");
  }
};

const memberModel = {
  add,
  get,
  findByEmail,
};

export default memberModel;
