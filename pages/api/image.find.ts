import imageCtrl from "@/controllers/image.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") throw new Error("Unsupported method");
    const { title } = req.query;
    if (!title) throw new Error("check query");
    await imageCtrl.findByImgTitle(req, res);
  } catch (err) {
    console.error(err);
    return res.status(404).end();
  }
};

export default handler;
