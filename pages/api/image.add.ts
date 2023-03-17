import type { NextApiRequest, NextApiResponse } from "next";
import imageCtrl from "@/controllers/image.ctrl";
import { imgStoragePath } from "@/utils/img_strage_path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") throw new Error("Unsupported method");
    await imageCtrl.add(req, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "ERR!" });
  }
};

export default handler;
