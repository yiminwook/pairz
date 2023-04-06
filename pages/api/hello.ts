import type { NextApiRequest, NextApiResponse } from "next";
import handleError from "@/controllers/error/handle_error";
import CustomServerError from "@/controllers/error/custom_server_error";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    throw new CustomServerError({
      statusCode: 307,
      message: "test",
      location: "/401",
    });
  } catch (err) {
    console.error(err);
    handleError(err, res);
  }
};

export default handler;
