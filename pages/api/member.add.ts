import type { NextApiRequest, NextApiResponse } from "next";
import checkSupportMethod from "@/controllers/error/check_support_method";
import handleError from "@/controllers/error/handle_error";
import memberCtrl from "@/controllers/member.ctrl";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    const supportMethod = ["POST"];
    checkSupportMethod(supportMethod, method);
    await memberCtrl.add(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
};
export default handler;
