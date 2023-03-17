import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "fs/promises";

const S3_BUCKET = process.env.AWS_S3_BUCKET || "";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESSKEY_Id || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  },
  region: process.env.AWS_S3_REGION || "ap-northeast-2",
});

/** S3 Bucket에 이미지업로드
 *
 *  ex) filename.jpg로 반환
 */
const uploadFile = async (file: formidable.File) => {
  try {
    const buffer = await fs.readFile(file.filepath);

    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: file.originalFilename || "",
      Body: buffer,
      ContentType: file.mimetype || "",
    };

    await s3.send(new PutObjectCommand(uploadParams));
    await fs.unlink(file.filepath);
    return uploadParams.Key;
  } catch (err) {
    console.error(err);
    throw new Error("Faild upload to S3");
  }
};

export default uploadFile;
