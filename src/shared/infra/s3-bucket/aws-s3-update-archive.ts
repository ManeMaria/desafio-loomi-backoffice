import { IFileUpdateHandler } from '@/shared/interface/s3-bucket';

import {
  AwsS3UploadArchive,
  AwsS3DeleteArchive,
  AwsS3Exception,
} from '@/shared/infra/s3-bucket';



export class AwsS3FileUpdateHandler implements IFileUpdateHandler {
  private awsS3ArchiveUploader: AwsS3UploadArchive;
  private awsS3ArchiveEraser: AwsS3DeleteArchive;

  constructor() {
    this.awsS3ArchiveUploader = new AwsS3UploadArchive();
    this.awsS3ArchiveEraser = new AwsS3DeleteArchive();
  }

  async updateFile(params: IFileUpdateHandler.Params): Promise<string> {
    console.log({
      message: 'AwsS3UploadileHandler',
      params,
    });

    const { newFile, previousFileURL } = params;

    const newFileUrl = await this.awsS3ArchiveUploader.upload({
      file: newFile,
    });

    console.log({
      message: 'File uploaded',
      newFileUrl,
    });

    if (previousFileURL) {
      try {
        await this.awsS3ArchiveEraser.delete({
          path: previousFileURL,
        });

        console.log({
          message: 'Previus file deleted',
          previousFileURL,
        });

        return newFileUrl;
      } catch (error) {
        console.log({
          message: 'Something wrong with AWS services',
          error,
        });

        await this.awsS3ArchiveEraser.delete({ path: newFileUrl });
        throw new AwsS3Exception(error, 'Delete Error');
      }
    }

    return newFileUrl;
  }
}
