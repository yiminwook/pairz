import type { NextApiRequest } from "next";
import formidable from "formidable";
import { imgStoragePath } from "@/utils/img_strage_path";

/** formidable로 formData파싱
 *
 *  true일시 로컬에 저장
 */
export const readFile = async (
  req: NextApiRequest,
  saveLocally: boolean = false
) => {
  const options: formidable.Options = {};

  if (saveLocally) {
    options.uploadDir = process.env.IMAGE_STORAGE_PATH || imgStoragePath;
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
