import BadReqError from '@/controllers/error/bad_request_error';
import CustomServerError from '@/controllers/error/custom_server_error';
import { verifyingStr } from '@/utils/validation';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs/promises';
import { extname } from 'path';

const S3_BUCKET = process.env.AWS_S3_BUCKET ?? '';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESSKEY_Id ?? '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY ?? '',
  },
  region: process.env.AWS_S3_REGION ?? 'ap-northeast-2',
});

/** S3 Bucket에 이미지업로드
 *
 *  ex) filename.jpg로 반환
 */
const uploadFile = async (file: formidable.File, name: string, type: string) => {
  if (!file) {
    throw new BadReqError('Invalid file');
  }
  if (!verifyingStr(name)) throw new BadReqError('Invalid file name');

  const ext = extname(file.originalFilename || '');

  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    throw new BadReqError('Invalid file type');
  }
  if (name === '') {
    throw new BadReqError('Invalid file name');
  }
  try {
    const buffer = await fs.readFile(file.filepath);

    const uploadParams = {
      Bucket: S3_BUCKET,
      Key: 'pairz/' + name + ext,
      Body: buffer,
      ContentType: type ?? '',
    };

    await s3.send(new PutObjectCommand(uploadParams));
    await fs.unlink(file.filepath);
    return name + ext;
  } catch (err) {
    // console.error(err);
    await fs.unlink(file.filepath);
    throw new CustomServerError({ message: 'Faild upload to S3' });
  }
};

export default uploadFile;
