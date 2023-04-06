import { NextApiRequest, NextApiResponse } from "next";
import imageModel from "@/models/image/image.model";
import { readFile } from "@/models/formidable";
import { arrToStr } from "@/utils/arr_to_str";
import uploadFile from "@/models/aws_sdk";
import authModel from "@/models/auth/auth.model";
import BadReqError from "./error/bad_request_error";
import CustomServerError from "./error/custom_server_error";

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  /* Authorization */
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) throw new BadReqError("Undefined IdToken");
  const decodeToken = await authModel.verifyToken(idToken);
  /* Save file to Local */
  const data = await readFile(req, false);
  let { image } = data.files;
  let { imageName, imageType, uid } = data.fields;
  image = Array.isArray(image) ? image[0] : image;
  imageName = Array.isArray(imageName) ? imageName[0] : imageName;
  imageType = Array.isArray(imageType) ? imageType[0] : imageType;
  uid = Array.isArray(uid) ? uid[0] : uid;
  if (decodeToken.uid !== uid) {
    throw new CustomServerError({
      statusCode: 307,
      message: "Not Matched IdToken",
      location: "/timeout",
    });
  }
  /* Upload file to S3 */
  const fileName = await uploadFile(image, imageName, imageType);
  /* Save file metaData to FireStore */
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

const findByImgName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, next } = req.query;
  const nameStr = arrToStr(name);
  if (!nameStr) throw new BadReqError("Undefined Name");
  const nextToStr = arrToStr(next);
  const findByImgNameResult = await imageModel.findByImgName(
    nameStr,
    nextToStr
  );
  return res.status(200).json(findByImgNameResult);
};

const findByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, idx } = req.query;
  const emailStr = arrToStr(email);
  if (!emailStr) throw new BadReqError("Undefined Email");
  const idxToStr = arrToStr(idx);
  const findByEmailResult = await imageModel.findByEmail(emailStr, idxToStr);
  return res.status(200).json(findByEmailResult);
};

const checkName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name } = req.query;
  const nameStr = arrToStr(name);
  if (!nameStr) throw new BadReqError("Undefined Email");
  const checkNameResult = await imageModel.checkName(nameStr);
  return res.status(200).json(checkNameResult);
};

const imageCtrl = {
  add,
  get,
  getRandom,
  findByImgName,
  findByEmail,
  checkName,
};

export default imageCtrl;
