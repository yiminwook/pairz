import type { NextApiRequest, NextApiResponse } from "next";
import imageCtrl from "@/controllers/image.ctrl";
import handleError from "@/controllers/error/handle_error";
import checkSupportMethod from "@/controllers/error/check_support_method";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    const supportMethod = ["POST"];
    checkSupportMethod(supportMethod, method);
    await imageCtrl.add(req, res);
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
};

export default handler;
