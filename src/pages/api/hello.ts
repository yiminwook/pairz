// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";

//버퍼 형식으로 메모리에 저장
const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();

interface parsedNextApiRequest extends NextApiRequest {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
  body: {
    title: string;
    imgToBase64: string;
  };
}

interface answer {
  message: string;
}

handler.use(upload.single("img"));

handler.post((req: parsedNextApiRequest, res: NextApiResponse<answer>) => {
  if (req.files) {
    // console.log(req.file);
    // console.log(req.body.title);
    return res.status(200).json({ message: "OK" });
  } else {
    return res.status(404).json({ message: "not found" });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default handler;
