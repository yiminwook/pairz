import authModel from "@/models/auth/auth.model";
import scoreModel from "@/models/score/score.model";
import { arrToStr } from "@/utils/arr_to_str";
import { NextApiRequest, NextApiResponse } from "next";
import BadReqError from "./error/bad_request_error";
import CustomServerError from "./error/custom_server_error";

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idx } = req.query;
  const idxStr = arrToStr(idx);
  const getResult = await scoreModel.get(idxStr);
  return res.status(200).json(getResult);
};

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid, score, displayName } = req.body;
  if (!(displayName && uid)) throw new BadReqError("Insuffient userData");
  if (typeof score !== "number" || Number.isNaN(score))
    throw new BadReqError("Score Type Error");
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
  const addResult = await scoreModel.add({
    uid: decodeToken.uid,
    score,
    displayName,
  });
  return res.status(201).json(addResult);
};

const scoreCtrl = {
  get,
  add,
};

export default scoreCtrl;
