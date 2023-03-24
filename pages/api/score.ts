import scoreCtrl from "@/controllers/score.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      await scoreCtrl.get(req, res);
    }
    if (req.method === "POST") {
      await scoreCtrl.add(req, res);
    } else throw new Error("Unsupported method");
  } catch (err) {
    return res.status(400).json({ result: false });
  }
};

export default handler;
