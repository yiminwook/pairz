import type { NextApiRequest } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import { imgStoragePath } from "@/utils/img_strage_path";

/** true일시 로컬에 저장 */
export const readFile = async (
  req: NextApiRequest,
  saveLocally: boolean = false
) => {
  try {
    await fs.readdir(imgStoragePath);
  } catch {
    await fs.mkdir(imgStoragePath);
  }

  const options: formidable.Options = {};

  if (saveLocally) {
    options.uploadDir = imgStoragePath;
    options.filename = (_name, _ext, path, _form) => {
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
      resolve({ fields, files });
    });
  });
};
