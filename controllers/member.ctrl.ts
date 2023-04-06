import authModel from "@/models/auth/auth.model";
import FirebaseAdmin from "@/models/firebase_admin";
import memberModel from "@/models/member/member.model";
import { arrToStr } from "@/utils/arr_to_str";
import { NextApiRequest, NextApiResponse } from "next";
import BadReqError from "./error/bad_request_error";
import CustomServerError from "./error/custom_server_error";

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid, email, emailId, displayName, photoURL } = req.body;
  if (!(uid && email && emailId)) throw new BadReqError("Insuffient UserData");
  /* Authorization */
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) throw new BadReqError("Undefiend IdToken");
  const decodeToken = await authModel.verifyToken(idToken);
  if (decodeToken.uid !== uid) {
    throw new CustomServerError({
      statusCode: 307,
      message: "Not Matched IdToken",
      location: "/timeout",
    });
  }
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
