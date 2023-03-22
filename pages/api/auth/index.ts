import type { NextApiRequest, NextApiResponse } from "next";
import FirebaseAdmin from "@/models/firebase_admin";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") throw new Error("Unsupported method");
    const cookie = req.cookies.sessionCookie;
    if (!cookie) throw new Error("Undefind cookie");
    const decode = await FirebaseAdmin.getInstance().Auth.verifySessionCookie(
      cookie
    );
    if (!decode) throw new Error("Invaild cookie");

    return res.status(200).json({ result: true });
  } catch (err) {
    return res.status(400).json({ result: false });
  }
};

export default handler;
