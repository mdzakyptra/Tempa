import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PhotosService } from './photos.service';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';
import { AddReportPhotosDto } from './dto/add-report-photos.dto';
import { ListReportPhotosDto } from './dto/list-report-photos.dto';
import { ReportPhotoResponseDto } from './dto/report-photo-response.dto';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiStandardResponse } from '../common/decorators/api-standard-response.decorator';


@ApiTags('Photos')
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  //<---------- createPresignedUpload -------------->
  @Post('presigned-upload')
  @OptionalAuth()
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @ApiStandardResponse(PresignedUploadResponseDto, {
    description: 'Presigned URL untuk upload langsung ke bucket',
  })
  createPresignedUpload(@Body() dto: CreatePresignedUploadDto) {
    return this.photosService.createPresignedUpload(dto);
  }

  //<---------- listByReport -------------->
  // Celah dari JEK-33 ("foto laporan" kesebut di deskripsi, nggak pernah
  // dipecah jadi tiket sendiri) — dipakai buat nampilin foto balik di
  // halaman Detail Laporan.
  @Get()
  @OptionalAuth()
  @ApiStandardResponse(ReportPhotoResponseDto, {
    isArray: true,
    description: 'Daftar foto milik satu laporan',
  })
  listByReport(@Query() dto: ListReportPhotosDto) {
    return this.photosService.listByReport(dto);
  }

  //<---------- attachToReport -------------->
  @Post()
  @OptionalAuth()
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  @ApiStandardResponse(ReportPhotoResponseDto, {
    isArray: true,
    description: 'Foto berhasil ditautkan ke laporan',
  })
  attachToReport(
    @CurrentUser() user: JwtPayload | undefined,
    @Body() dto: AddReportPhotosDto,
  ) {
    return this.photosService.attachToReport(user?.sub, dto);
  }
}
