import { verifyingIdx } from "@/utils/verify_idx";
import FirebaseAdmin from "../firebase_admin";
import { ImageInfo } from "../Info";
import MemberModel from "../member/member.model";

export const IMAGE_COL = "images";

const IMAGE_PER_PAGE: number = 5;

const { db } = FirebaseAdmin.getInstance();

export type AddResult = { result: boolean; message: string };

export interface ImageResult {
  imageData: ImageInfo[];
}

export interface ImageResultWithIdx extends ImageResult {
  total: number;
  lastIdx: number | null;
}

export type findByImageName = Omit<ImageResultWithIdx, "lastIdx"> & {
  lastImageName: string | null;
};

/** 중복 업로드x */
const add = async ({
  uid,
  fileName,
}: {
  uid: string;
  fileName: string;
}): Promise<AddResult> => {
  try {
    const lastImagData = await getLastImage();
    const addResult = await db.runTransaction(async (transaction) => {
      const imageRef = db.collection(IMAGE_COL).doc(fileName);
      const imageDoc = await transaction.get(imageRef);
      if (imageDoc.exists) {
        return false;
      }
      const { AWS_S3_BUCKET, AWS_S3_REGION } = process.env;
      const imgURL =
        `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/` +
        encodeURI(fileName);
      const imageName = fileName.replace(/.jpg|.png|.jpeg/gi, "");
      transaction.set(imageRef, {
        id: lastImagData.id + 1,
        imgURL,
        uid,
        imageName,
      });
      return true;
    });
    if (!addResult) {
      throw new Error("Duplicated file name");
    }
    return { result: true, message: `${fileName} Created` };
  } catch (err) {
    console.error(err);
    throw new Error("File upload failed");
  }
};

/** id가 없을 때는 최신순으로 5개를 반환
 *
 *  id가 있을 때 내림차순 5개를 반환
 */
const get = async (idx?: string | null): Promise<ImageResultWithIdx> => {
  try {
    const getResult = await db.runTransaction(async (transaction) => {
      const isNaN = Number.isNaN(idx);
      let imageRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
      if (!isNaN && idx) {
        imageRef = db
          .collection(IMAGE_COL)
          .where("id", "<=", +idx)
          .orderBy("id", "desc")
          .limit(IMAGE_PER_PAGE);
      } else {
        imageRef = db
          .collection(IMAGE_COL)
          .orderBy("id", "desc")
          .limit(IMAGE_PER_PAGE);
      }
      const imageDoc = await transaction.get(imageRef);
      const imageDocData = imageDoc.docs.map((doc) =>
        doc.data()
      ) as ImageInfo[];
      if (!imageDocData) throw new Error("Firstore Error");
      return {
        imageData: [...imageDocData],
        total: imageDocData.length,
        lastIdx: imageDocData.at(-1)?.id ?? null,
      };
    });
    return getResult;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get file");
  }
};

/** 겹치지 않는 이미지를 5개 반환 */
const getRandom = async (): Promise<ImageResult> => {
  try {
    const size = await getImageDocSize();
    if (size < 5) throw new Error("DB image under 5, Upload Image over 5");
    const lastImagData = await getLastImage();
    const getRandomResult = await db.runTransaction(async (transaction) => {
      const randomImages: ImageInfo[] = [];
      let randomId: number;
      const hashTable = new Set<number>();
      while (randomImages.length < 5) {
        randomId = Math.trunc(Math.random() * lastImagData.id);
        const imageRef = db
          .collection(IMAGE_COL)
          .where("id", "==", randomId)
          .limit(1);
        const imageDoc = await transaction.get(imageRef);
        imageDoc.forEach((doc) => {
          if (!doc.exists || hashTable.has(randomId)) {
            return;
          }
          hashTable.add(randomId);
          const { id, imgURL, uid, imageName } = doc.data();
          randomImages.push({ id, imgURL, uid, imageName });
        });
      }
      return { imageData: randomImages };
    });
    return getRandomResult;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get file");
  }
};

/** imageName으로 image 찾기
 *
 *  next=true query로 pagination
 */
const findByImageName = async (
  imageName: string,
  next?: string | null
): Promise<findByImageName> => {
  try {
    const findByFileNameResult = await db.runTransaction(
      async (transaction) => {
        let imageRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
        if (next === "true") {
          imageRef = db
            .collection(IMAGE_COL)
            .orderBy("imageName")
            .startAfter(imageName)
            .limit(5);
        } else {
          imageRef = db
            .collection(IMAGE_COL)
            .orderBy("imageName")
            .startAt(imageName)
            .limit(5);
        }
        const imageDoc = await transaction.get(imageRef);
        const imageData = imageDoc.docs.map((docs) =>
          docs.data()
        ) as ImageInfo[];

        return {
          imageData,
          total: imageData.length,
          lastImageName: imageData.at(-1)?.imageName ?? null,
        };
      }
    );
    return findByFileNameResult;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get file");
  }
};

/** emailId로 image 찾기 */
const findByEmail = async (
  email: string,
  idx?: string | null
): Promise<ImageResultWithIdx> => {
  try {
    const userData = await MemberModel.findByEmail(email);
    const uid = userData.uid;
    const findByFileNameResult = await db.runTransaction(
      async (transaction) => {
        let imageRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
        const isValidIdx = verifyingIdx(idx);
        if (isValidIdx && idx) {
          imageRef = db
            .collection(IMAGE_COL)
            .where("uid", "==", uid)
            .where("id", "<", +idx)
            .orderBy("id", "desc")
            .limit(5);
        } else {
          imageRef = db
            .collection(IMAGE_COL)
            .where("uid", "==", uid)
            .orderBy("id", "desc")
            .limit(5);
        }
        const imageDoc = await transaction.get(imageRef);
        const imageData = imageDoc.docs.map((docs) =>
          docs.data()
        ) as ImageInfo[];
        return {
          imageData,
          total: imageData.length,
          lastIdx: imageData.at(-1)?.id ?? 0,
        };
      }
    );
    return findByFileNameResult;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get file");
  }
};

const getLastImage = async () => {
  try {
    const lastImageRef = db
      .collection(IMAGE_COL)
      .orderBy("id", "desc")
      .limit(1);
    const lastImageDoc = await lastImageRef.get();
    const lastImageData = lastImageDoc.docs.map((doc) =>
      doc.data()
    ) as ImageInfo[];
    return lastImageData[0];
  } catch (err) {
    throw new Error("failed to get LastImageDoc");
  }
};

const getImageDocSize = async () => {
  try {
    const imageSizeRef = db.collection(IMAGE_COL);
    const imageSizeDoc = await imageSizeRef.get();
    return imageSizeDoc.size;
  } catch (err) {
    throw new Error("failed to get ImageDoc Size");
  }
};

const imageModel = {
  add,
  get,
  getRandom,
  findByImageName,
  findByEmail,
};

export default imageModel;

// https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ko
