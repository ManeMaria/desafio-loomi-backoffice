import aws, { S3 } from 'aws-sdk';

import { s3Environments, IUploadArchive } from '@/shared/interface/s3-bucket';
import { AwsS3Exception } from './aws-s3-exception';
import { env } from '@/main/config';



export class AwsS3UploadArchive implements IUploadArchive {
  private readonly s3Instance: S3;

  constructor() {
    this.s3Instance = new aws.S3({
      region: s3Environments.region,
      signatureVersion: 'v4',
      ...(env.application.mode === 'local'
        ? {
          credentials: {
            accessKeyId: s3Environments.accessKeyId,
            secretAccessKey: s3Environments.secretAccessKey,
          },
        }
        : {}),
    });
  }

  async upload(params: IUploadArchive.Params): Promise<string> {
    console.log({
      message: 'AwsS3UploadArchive',
      params,
    });

    const { file } = params;
    const acceptedFormats: string[] = [];

    const mimeTypes = file.mimetype.split('/');
    const fileExtension = mimeTypes[mimeTypes.length - 1].toLowerCase();

    if (!acceptedFormats.includes(fileExtension)) {
      const error = 'Invalid Format';
      throw new AwsS3Exception(error, 'Upload Error');
    }

    console.log({
      message: 'AwsS3UploadArchive-Format-accepted',
      fileExtension,
    });

    const fileNameWithoutSlashes = file.originalname.replace(/\//gi, '-');
    const lastDotIndex = fileNameWithoutSlashes.lastIndexOf('.');
    const filenameFormatted = fileNameWithoutSlashes.slice(
      0,
      lastDotIndex >= 0 ? lastDotIndex : fileNameWithoutSlashes.length + 1
    );
    const fileName = `${Date.now()}-${filenameFormatted}.${fileExtension}`;

    const uploadParams: S3.PutObjectRequest = {
      Bucket: s3Environments.bucketName,
      Key: `${s3Environments.folderAwsS3Bucket}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentEncoding: file.encoding,
    };

    console.log({
      message: 'AwsS3UploadArchive-Upload-Params',
      uploadParams,
    });

    return new Promise((resolve, reject) => {
      this.s3Instance.putObject(uploadParams, (err, data) => {
        if (err) {
          throw new AwsS3Exception(err, 'Upload Error');
        }

        console.log({
          message: 'AwsS3UploadArchive-Uploaded',
          uploadParams,
        });

        resolve(
          `https://${s3Environments.bucketName}.s3.amazonaws.com/${s3Environments.folderAwsS3Bucket}/${fileName}`
        );
      });
    });
  }
}
