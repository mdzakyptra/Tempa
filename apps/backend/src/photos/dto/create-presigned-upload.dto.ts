import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, Max, Min } from 'class-validator';
import {
  ALLOWED_CONTENT_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
} from '../constants/photo-upload.constant';

const ALLOWED_CONTENT_TYPE_LIST = Object.keys(ALLOWED_CONTENT_TYPES);


export class CreatePresignedUploadDto {
  @ApiProperty({ enum: ALLOWED_CONTENT_TYPE_LIST, example: 'image/jpeg' })
  @IsIn(ALLOWED_CONTENT_TYPE_LIST)
  contentType: string;

  @ApiProperty({
    example: 204800,
    description: 'Ukuran file dalam byte, maksimum 5MB',
  })
  @IsInt()
  @Min(1)
  @Max(MAX_UPLOAD_SIZE_BYTES)
  contentLength: number;
}
