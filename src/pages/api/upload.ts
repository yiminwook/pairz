import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const imgStoragePath = path.join(
    process.cwd() + "/src" + "/public" + "/images"
  );
  console.log(imgStoragePath);
  /** true일시 로컬에 저장 */
  const readFile = (req: NextApiRequest, saveLocally: boolean = false) => {
    const options: formidable.Options = {};

    if (saveLocally) {
      options.uploadDir = imgStoragePath;
      options.filename = (name, ext, path, form) => {
        return Date.now().toString() + "_" + path.originalFilename;
      };
    }

    return new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, rejects) => {
      const form = formidable(options);

      form.parse(req, (err, fields, files) => {
        if (err) {
          rejects(err);
        }
        console.log(fields);
        resolve({ fields, files });
      });
    });
  };

  try {
    await fs.readdir(imgStoragePath);
  } catch {
    await fs.mkdir(imgStoragePath);
  }
  const data = await readFile(req);
  console.log(data.files);
  return res.status(201).json({ message: "OK" });
}
