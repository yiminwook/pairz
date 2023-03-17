import imageCtrl from "@/controllers/image.ctrl";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") throw new Error("Unsupported method");
    const { random } = req.query;
    if (random === "true") {
      await imageCtrl.getRandom(req, res);
    } else {
      await imageCtrl.get(req, res);
    }
  } catch (err) {
    return res.status(404).end();
  }
};

export default handler;
