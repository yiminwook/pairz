import CustomServerError from '@/controllers/error/custom_server_error';
import { verifyingIdx } from '@/utils/validation';
import FirebaseAdmin from '../firebase_admin';
import { ImageInfo } from '../Info';
import MemberModel from '../member/member.model';

export const IMAGE_COL = 'images';

const IMAGE_PER_PAGE: number = 5;

const { db } = FirebaseAdmin.getInstance();

/** 중복 업로드x */
const add = async ({
  uid,
  fileName,
}: {
  uid: string;
  fileName: string;
}): Promise<{ result: boolean; imageName: string; message: string }> => {
  const lastImagData = await getLastImage();
  // const imageName = fileName.replace(/.jpg|.png|.jpeg/gi, "");
  const addResult = await db.runTransaction(async (transaction) => {
    const imageRef = db.collection(IMAGE_COL).doc(fileName);
    const imageDoc = await transaction.get(imageRef);
    if (imageDoc.exists) {
      return false;
    }
    const imgURL = `https://${process.env.AWS_CLOUD_FRONT_URL}/pairz/` + encodeURI(fileName);
    const newImageData: ImageInfo = {
      id: lastImagData?.id + 1 ?? 1,
      imgURL,
      uid,
      imageName: fileName,
    };
    transaction.set(imageRef, newImageData);
    return true;
  });
  if (addResult === false) {
    throw new CustomServerError({
      statusCode: 400,
      message: 'Duplicated file name',
    });
  }
  return { result: true, imageName: fileName, message: `${fileName} Created` };
};

/** id가 없을 때는 최신순으로 5개를 반환
 *
 *  id가 있을 때 내림차순 5개를 반환
 */
const get = async (idx?: string): Promise<{ imageData: ImageInfo[]; lastIdx: number }> => {
  const getResult = await db.runTransaction(async (transaction) => {
    const isNaN = Number.isNaN(idx);
    let imageRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
    if (!isNaN && idx) {
      imageRef = db.collection(IMAGE_COL).where('id', '<=', +idx).orderBy('id', 'desc').limit(IMAGE_PER_PAGE);
    } else {
      imageRef = db.collection(IMAGE_COL).orderBy('id', 'desc').limit(IMAGE_PER_PAGE);
    }
    const imageDoc = await transaction.get(imageRef);
    const imageDocData = imageDoc.docs.map((doc) => doc.data()) as ImageInfo[];
    return {
      imageData: [...imageDocData],
      lastIdx: imageDocData.at(-1)?.id ?? 0,
    };
  });

  return getResult;
};

/** 겹치지 않는 이미지를 5개 반환 */
const getRandom = async (): Promise<{ imageData: ImageInfo[] }> => {
  const size = await getImageDocSize();
  if (size < 5) throw new CustomServerError({ message: 'DB image under 5' });
  const lastImagData = await getLastImage();
  const getRandomResult = await db.runTransaction(async (transaction) => {
    const randomImages: ImageInfo[] = [];
    let randomId: number;
    const hashTable = new Set<number>();
    while (randomImages.length < 5) {
      randomId = Math.trunc(Math.random() * lastImagData.id);
      const imageRef = db.collection(IMAGE_COL).where('id', '==', randomId).limit(1);
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
};

/** imageName으로 image 찾기
 *
 *  next=true query로 pagination
 */
const findByImgName = async (
  name: string,
  /** 더보기 */
  next?: string | null,
): Promise<{
  imageData: ImageInfo[];
  lastName: string | null;
  lastIdx: number;
}> => {
  const findByImgNameResult = await db.runTransaction(async (transaction) => {
    let imageRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
    if (next === 'true') {
      imageRef = db.collection(IMAGE_COL).orderBy('imageName').startAfter(name).limit(5);
    } else {
      imageRef = db.collection(IMAGE_COL).orderBy('imageName').startAt(name).limit(5);
    }
    const imageDoc = await transaction.get(imageRef);
    const imageData = imageDoc.docs.map((docs) => docs.data()) as ImageInfo[];

    return {
      imageData,
      lastName: imageData.at(-1)?.imageName ?? null,
      lastIdx: imageData.at(-1)?.id ?? 0,
    };
  });
  return findByImgNameResult;
};

/** emailId로 image 찾기 */
const findByEmail = async (email: string, idx?: string): Promise<{ imageData: ImageInfo[]; lastIdx: number }> => {
  const userData = await MemberModel.findByEmail(email);
  const uid = userData.uid;
  const findByFileNameResult = await db.runTransaction(async (transaction) => {
    let imageRef: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
    const isValidIdx = verifyingIdx(idx);
    if (isValidIdx && idx) {
      imageRef = db.collection(IMAGE_COL).where('uid', '==', uid).where('id', '<', +idx).orderBy('id', 'desc').limit(5);
    } else {
      imageRef = db.collection(IMAGE_COL).where('uid', '==', uid).orderBy('id', 'desc').limit(5);
    }
    const imageDoc = await transaction.get(imageRef);
    const imageData = imageDoc.docs.map((docs) => docs.data()) as ImageInfo[];
    return {
      imageData,
      lastIdx: imageData.at(-1)?.id ?? 0,
    };
  });
  return findByFileNameResult;
};

const checkName = async (name: string): Promise<{ result: boolean }> => {
  const imageRef = db.collection(IMAGE_COL).where('imageName', '==', name);
  const imageDoc = await imageRef.get();
  const imageData = imageDoc.docs.map((doc) => doc.data());
  return { result: imageData.length === 0 ? true : false };
};

const getLastImage = async (): Promise<ImageInfo> => {
  const lastImageRef = db.collection(IMAGE_COL).orderBy('id', 'desc').limit(1);
  const lastImageDoc = await lastImageRef.get();
  const lastImageData = lastImageDoc.docs.map((doc) => doc.data()) as ImageInfo[];
  return lastImageData[0];
};

const getImageDocSize = async (): Promise<number> => {
  const imageSizeRef = db.collection(IMAGE_COL);
  const imageSizeDoc = await imageSizeRef.get();
  return imageSizeDoc.size;
};

const imageModel = {
  add,
  get,
  getRandom,
  findByImgName,
  findByEmail,
  checkName,
};

export default imageModel;

// https://firebase.google.com/docs/firestore/query-data/order-limit-data?hl=ko
