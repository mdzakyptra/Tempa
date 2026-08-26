import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import {
  ALLOWED_CONTENT_TYPES,
  PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
} from './constants/photo-upload.constant';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';


@Injectable()
export class PhotosService {
  // forcePathStyle wajib true buat R2 — endpoint-nya per-account (bukan
  // per-bucket), jadi bucket harus di path (bucket.<endpoint>/key), bukan
  // di subdomain (bucket.<endpoint>).
  private readonly client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });

  //<---------- createPresignedUpload -------------->
  async createPresignedUpload(
    dto: CreatePresignedUploadDto,
  ): Promise<PresignedUploadResponseDto> {
    const extension =
      ALLOWED_CONTENT_TYPES[dto.contentType as keyof typeof ALLOWED_CONTENT_TYPES];
    const key = `reports/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: dto.contentType,
      ContentLength: dto.contentLength,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
    });

    return {
      uploadUrl,
      key,
      expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
    };
  }
}
