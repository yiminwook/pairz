import type { NextApiRequest, NextApiResponse } from "next";
import checkSupportMethod from "@/controllers/error/check_support_method";
import handleError from "@/controllers/error/handle_error";
import imageCtrl from "@/controllers/image.ctrl";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    const supportMethod = ["GET"];
    checkSupportMethod(supportMethod, method);
    await imageCtrl.checkName(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
};

export default handler;
