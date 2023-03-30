import FirebaseAdmin from "@/models/firebase_admin";
import memberModel from "@/models/member/member.model";
import { arrToStr } from "@/utils/arr_to_str";
import { NextApiRequest, NextApiResponse } from "next";

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) throw new Error("Undefiend Token");
  const decodeToken = await FirebaseAdmin.getInstance().Auth.verifyIdToken(
    idToken
  );
  const { uid, email, emailId, displayName, photoURL } = req.body;
  if (decodeToken.uid !== uid) throw new Error("Unauthorized"); //401code
  if (!(uid && email && emailId)) throw new Error("Insuffient userData");
  const addResult = await memberModel.add({
    uid,
    email,
    emailId,
    displayName,
    photoURL,
  });

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
