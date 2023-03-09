import nextConnect from "next-connect";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
