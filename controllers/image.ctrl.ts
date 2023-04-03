import { NextApiRequest, NextApiResponse } from "next";
import imageModel from "@/models/image/image.model";
import { readFile } from "@/models/formidable";
import { arrToStr } from "@/utils/arr_to_str";
import uploadFile from "@/models/aws_sdk";
import authModel from "@/models/auth/auth.model";

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  /* Authorization */
  //err 발생시 401code return
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) throw new Error("Undefined idToken");
  const decodeToken = await authModel.verifyToken(idToken);
  /* save file to Local */
  const data = await readFile(req, false);
  let image = data.files.image;
  let imageName = data.fields.imageName;
  let imageType = data.fields.imageType;
  image = Array.isArray(image) ? image[0] : image;
  imageName = Array.isArray(imageName) ? imageName[0] : imageName;
  imageType = Array.isArray(imageType) ? imageType[0] : imageType;
  /* upload file to S3 */
  const fileName = await uploadFile(image, imageName, imageType);
  /* save file metaData to FireStore */
  const addResult = await imageModel.add({ uid: decodeToken.uid, fileName });
  return res.status(201).json(addResult);
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idx } = req.query;
  const idxToStr = arrToStr(idx);
  const getResult = await imageModel.get(idxToStr);
  return res.status(200).json(getResult);
};

const getRandom = async (_req: NextApiRequest, res: NextApiResponse) => {
  const getRandomResult = await imageModel.getRandom();
  return res.status(200).json(getRandomResult);
};

const findByImgTitle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, next } = req.query;
  const titleStr = arrToStr(title);
  if (!titleStr) throw new Error("undefined title");
  const nextToStr = arrToStr(next);
  const findByImgTitleResult = await imageModel.findByImgTitle(
    titleStr,
    nextToStr
  );
  return res.status(200).json(findByImgTitleResult);
};

const findByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, idx } = req.query;
  const emailStr = arrToStr(email);
  if (!emailStr) throw new Error("undefined email");
  const idxToStr = arrToStr(idx);
  const findByEmailResult = await imageModel.findByEmail(emailStr, idxToStr);
  return res.status(200).json(findByEmailResult);
};

const checkTitle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title } = req.query;
  const titleStr = arrToStr(title);
  if (!titleStr) throw new Error("undefined exmail");
  const checkTitleResult = await imageModel.checkTitle(titleStr);

  return res.status(200).json(checkTitleResult);
};

const imageCtrl = {
  add,
  get,
  getRandom,
  findByImgTitle,
  findByEmail,
  checkTitle,
};

export default imageCtrl;
