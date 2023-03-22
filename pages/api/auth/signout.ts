import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "GET") throw new Error("Unsupported method");
    const cookie = req.cookies.sessionCookie;
    if (!cookie) return res.status(200).json({ result: true });
    res.setHeader(
      "Set-Cookie",
      `sessionCookie=${cookie};Max-Age=0;Path=/;httpOnly;secure;SameSite=strict;`
    );
    return res.status(200).json({ result: true });
  } catch (err) {
    return res.status(400).json({ result: false });
  }
};

export default handler;
