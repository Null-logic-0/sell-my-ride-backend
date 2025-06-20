import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private createS3() {
    return new AWS.S3({
      region: this.configService.get('appConfig.awsRegion')!,
      accessKeyId: this.configService.get('appConfig.awsAccessId'),
      secretAccessKey: this.configService.get('appConfig.awsSecretKey'),
    });
  }

  private async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    const s3 = this.createS3();
    const region = this.configService.get('appConfig.awsRegion')!;
    const bucket = this.configService.get('appConfig.awsBucketName')!;
    const fileExt = file.originalname.split('.').pop() || 'bin';
    const fileName = `${uuidv4()}.${fileExt}`;
    const key = `${folder}/user-${userId}/${fileName}`;

    await s3
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async uploadProfileImage(
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    return this.uploadFileToS3('profile-images', file, userId);
  }

  async uploadCarImages(
    files: Express.Multer.File[],
    userId: number,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFileToS3('car-images', file, userId),
    );
    return Promise.all(uploadPromises);
  }

  async uploadMakeImage(
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    return this.uploadFileToS3('manufacturer-images', file, userId);
  }
}
