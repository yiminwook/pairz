import authCtrl from "@/controllers/auth.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") throw new Error("Unsupported method");
    authCtrl.expire(req, res);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ result: false });
  }
};

export default handler;
