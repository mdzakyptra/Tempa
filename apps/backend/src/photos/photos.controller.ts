import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PhotosService } from './photos.service';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator';
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
}
