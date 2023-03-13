import type { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "@/models/formidable";
import uploadFile from "@/models/aws_sdk";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await readFile(req, true);
    const file = Array.isArray(data.files.img)
      ? data.files.img[0]
      : data.files.img;

    const filename = await uploadFile(file);
    await fs.unlink(file.filepath);
    return res.status(201).json({ message: filename });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "ERR!" });
  }
}

// "https://{bucket}.s3.{region}.amazonaws.com/"+
// encodeURIComponent(key);
