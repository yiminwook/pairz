import authModel from "@/models/auth/auth.model";
import { NextApiRequest, NextApiResponse } from "next";

const verifyCookie = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.cookies.sessionCookie;
  if (!cookie) throw new Error("Undefind cookie");
  const decode = await authModel.verifyCookie(cookie);
  if (!decode) throw new Error("Invaild cookie");
  return res.status(200).json({ result: true });
};

const expire = (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.cookies.sessionCookie;
  if (cookie) {
    res.setHeader(
      "Set-Cookie",
      `sessionCookie=${cookie};Max-Age=0;Path=/;httpOnly;secure;SameSite=strict;`
    );
  }
  return res.status(200).json({ result: true });
};

const authCtrl = {
  verifyCookie,
  expire,
};

export default authCtrl;
