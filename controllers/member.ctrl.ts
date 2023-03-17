import FirebaseAdmin from "@/models/firebase_admin";
import memberModel from "@/models/member/member.model";
import { arrToStr } from "@/utils/arr_to_str";
import { NextApiRequest, NextApiResponse } from "next";

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid, email, emailId, displayName, photoURL, idToken } = req.body;
  if (!(uid && email && emailId && idToken))
    throw new Error("Insuffient userData");
  const addResult = await memberModel.add({
    uid,
    email,
    emailId,
    displayName,
    photoURL,
  });

  /** 쿠키 유효시간 24시간  */
  const expiresIn = 24 * 60 * 60 * 1000;
  const cookie = await FirebaseAdmin.getInstance().Auth.createSessionCookie(
    idToken,
    { expiresIn }
  );
  res.setHeader(
    "Set-Cookie",
    `sessionCookie=${cookie};Max-Age=${expiresIn};Path=/;httpOnly;secure;SameSite=strict;`
  );
  return res.status(200).json(addResult);
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;
  const emailStr = arrToStr(email);
  const getResult = await memberModel.get(emailStr);
  return res.status(200).json(getResult);
};

const memberCtrl = {
  add,
  get,
};

export default memberCtrl;
