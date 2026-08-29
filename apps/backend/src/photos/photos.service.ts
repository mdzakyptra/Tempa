import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  HeadObjectCommand,
  HeadObjectCommandOutput,
  NotFound,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  ALLOWED_CONTENT_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
} from './constants/photo-upload.constant';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';
import { AddReportPhotosDto } from './dto/add-report-photos.dto';
import { ListReportPhotosDto } from './dto/list-report-photos.dto';
import { ReportPhotoResponseDto } from './dto/report-photo-response.dto';


@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

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

  //<---------- attachToReport -------------->
  async attachToReport(userId: string | undefined, dto: AddReportPhotosDto) {
    const report = await this.prisma.report.findUnique({
      where: { id: dto.reportId },
    });

    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }
    if (userId && report.dibuat_oleh && report.dibuat_oleh !== userId) {
      throw new ForbiddenException('Kamu bukan pemilik laporan ini');
    }

    // Nggak percaya begitu aja constraint content-type/content-length yang
    // dikirim client saat minta presigned URL (JEK-22) — client curang bisa
    // upload apapun ke URL itu selama signature-nya valid. Verifikasi ulang
    // objek asli di bucket sebelum referensinya disimpan permanen.
    await Promise.all(dto.keys.map((key) => this.verifyUploadedObject(key)));

    const data = dto.keys.map((key) => ({
      id: randomUUID(),
      report_id: dto.reportId,
      url_foto: `${process.env.S3_PUBLIC_URL}/${key}`,
    }));

    return this.prisma.reportPhoto.createManyAndReturn({ data });
  }

  //<---------- listByReport -------------->
  // Belum ada di tiket manapun (celah dari JEK-33: "foto laporan" disebut di
  // deskripsinya tapi nggak pernah dipecah jadi tiket sendiri kayak
  // komponen lain) — endpoint ini yang bikin foto (JEK-22/23) bisa
  // ditampilkan balik di halaman Detail Laporan.
  async listByReport(dto: ListReportPhotosDto): Promise<ReportPhotoResponseDto[]> {
    const report = await this.prisma.report.findUnique({
      where: { id: dto.reportId },
    });
    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    return this.prisma.reportPhoto.findMany({
      where: { report_id: dto.reportId },
    });
  }

  //<---------- verifyUploadedObject -------------->
  private async verifyUploadedObject(key: string): Promise<void> {
    let head: HeadObjectCommandOutput;
    try {
      head = await this.client.send(
        new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw new BadRequestException(
          `File belum ke-upload ke bucket: ${key}`,
        );
      }
      throw error;
    }

    const allowedContentType = Object.keys(ALLOWED_CONTENT_TYPES).includes(
      head.ContentType ?? '',
    );
    if (!allowedContentType) {
      throw new BadRequestException(
        `Tipe file objek di bucket tidak sesuai: ${key}`,
      );
    }
    if (!head.ContentLength || head.ContentLength > MAX_UPLOAD_SIZE_BYTES) {
      throw new BadRequestException(
        `Ukuran file objek di bucket melebihi batas: ${key}`,
      );
    }
  }
}
