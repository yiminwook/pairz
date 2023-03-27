import memberCtrl from "@/controllers/member.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") throw new Error("Unsupported method");
    await memberCtrl.add(req, res);
  } catch (err) {
    console.error(err);
    return res.status(404).end();
  }
};
export default handler;
