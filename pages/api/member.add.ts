import type { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "../../models/formidable";
import uploadFile from "../../models/aws_sdk";
import fs from "fs/promises";
import { imgStoragePath } from "@/utils/img_strage_path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(201).json({ message: "create user" });
}
