import authModel from "@/models/auth/auth.model";
import scoreModel from "@/models/score/score.model";
import { arrToStr } from "@/utils/arr_to_str";
import { NextApiRequest, NextApiResponse } from "next";

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { idx } = req.query;
  const idxStr = arrToStr(idx);
  const getResult = await scoreModel.get(idxStr);
  return res.status(200).json(getResult);
};

const add = async (req: NextApiRequest, res: NextApiResponse) => {
  /* Authorization */
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) throw new Error("Unauthorized");
  const decodeToken = await authModel.verifyToken(idToken);
  if (!decodeToken) {
    return res
      .status(401)
      .json({ result: false, statusMessage: "Unauthorized" });
  }

  const { uid, score, displayName } = req.body;

  if (!(displayName && uid)) throw new Error("Insuffient userData");
  if (uid !== decodeToken.uid) throw new Error("Unauthorized"); //401code
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
