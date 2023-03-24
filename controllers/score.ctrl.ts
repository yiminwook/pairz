import authModel from "@/models/auth/auth.model";
import scoreModel from "@/models/score/score.model";
import { NextApiRequest, NextApiResponse } from "next";

const get = async (_req: NextApiRequest, res: NextApiResponse) => {
  const getResult = await scoreModel.get();
  return res.status(201).json({ result: getResult });
};

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  /* Authorization */
  const cookie = req.cookies.sessionCookie;
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!(cookie && idToken)) throw new Error("Unauthorized");
  const decodeCookie = await authModel.verifyCookie(cookie);
  const decodeToken = await authModel.verifyToken(idToken);
  if (!(decodeCookie && decodeToken && decodeCookie.uid === decodeToken.uid))
    throw new Error("Unauthorized");

  const { score, displayName } = req.body;
  if (!(score && displayName)) throw new Error("Insufficent data");
  if (typeof score !== "number" || Number.isNaN(score))
    throw new Error("Unauthorized Type score");

  const addResult = await scoreModel.add({
    uid: decodeToken.uid,
    score: +score as number,
    displayName,
  });

  if (addResult) {
    return res.status(201).json({ result: addResult });
  } else {
    return res.status(500).json({ result: addResult });
  }
};

const scoreCtrl = {
  get,
  add,
};

export default scoreCtrl;
