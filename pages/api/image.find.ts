import imageCtrl from "@/controllers/image.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") throw new Error("Unsupported method");
    const { imageName, email } = req.query;

    if (imageName && !email) {
      await imageCtrl.findByImageName(req, res);
    }
    if (!imageName && email) {
      await imageCtrl.findByEmail(req, res);
    } else {
      throw new Error("Check request query");
    }
  } catch (err) {
    console.error(err);
    return res.status(404).end();
  }
};

export default handler;
