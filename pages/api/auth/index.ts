import authCtrl from "@/controllers/auth.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") throw new Error("Unsupported method");
    await authCtrl.verifyCookie(req, res);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ result: false });
  }
};

export default handler;
