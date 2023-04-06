import checkSupportMethod from "@/controllers/error/check_support_method";
import handleError from "@/controllers/error/handle_error";
import memberCtrl from "@/controllers/member.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    const supportMethod = ["GET"];
    checkSupportMethod(supportMethod, method);
    await memberCtrl.get(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
};
export default handler;
