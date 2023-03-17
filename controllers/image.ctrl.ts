import next, { NextApiRequest, NextApiResponse } from "next";
import imageModel from "@/models/image/image.model";
import { readFile } from "@/models/formidable";
import uploadFile from "@/models/aws_sdk";
import { arrToStr } from "@/utils/arr_to_str";

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await readFile(req, true);
  const file = Array.isArray(data.files.img)
    ? data.files.img[0]
    : data.files.img;
  const fileName = await uploadFile(file);
  await imageModel.add({ uid: "QWcOPefHLYYBWG6V7L7Kv7jkADo2", fileName });
  return res.status(201).json({ message: fileName });
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

const findByImageName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { imageName, next } = req.query;
  const imageNameStr = arrToStr(imageName);
  if (!imageNameStr) throw new Error("undefined imageName");
  const nextToStr = arrToStr(next);
  const findByImageNameResult = await imageModel.findByImageName(
    imageNameStr,
    nextToStr
  );
  return res.status(200).json(findByImageNameResult);
};

const findByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, idx } = req.query;
  const emailStr = arrToStr(email);
  if (!emailStr) throw new Error("undefined email");
  const idxToStr = arrToStr(idx);
  const findByEmailResult = await imageModel.findByEmail(emailStr, idxToStr);
  return res.status(200).json(findByEmailResult);
};

const imageCtrl = {
  add,
  get,
  getRandom,
  findByImageName,
  findByEmail,
};

export default imageCtrl;
