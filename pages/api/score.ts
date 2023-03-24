import scoreCtrl from "@/controllers/score.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!(req.method === "GET" || req.method === "POST"))
      throw new Error("Unsupported method");
    if (req.method === "GET") {
      await scoreCtrl.get(req, res);
    }
    if (req.method === "POST") {
      await scoreCtrl.add(req, res);
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ result: false });
  }
};

export default handler;
