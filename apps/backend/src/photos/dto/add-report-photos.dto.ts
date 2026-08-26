import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID, Matches } from 'class-validator';

// Format persis kayak key yang diterbitkan PhotosService.createPresignedUpload
// (JEK-22) — nolak key aneh yang bukan hasil presigned-upload endpoint ini.
const OBJECT_KEY_PATTERN = /^reports\/[0-9a-f-]{36}\.(jpg|png|webp)$/;


export class AddReportPhotosDto {
  @ApiProperty({ example: '6d1f6c9e-2c34-4a3b-9a7e-4b1f6c9e2c34' })
  @IsUUID()
  reportId: string;

  @ApiProperty({
    example: ['reports/6d1f6c9e-2c34-4a3b-9a7e-4b1f6c9e2c34.jpg'],
    description: 'Object key hasil endpoint presigned-upload (JEK-22), setelah file berhasil diupload',
  })
  @IsArray()
  @ArrayMinSize(1)
  @Matches(OBJECT_KEY_PATTERN, { each: true })
  keys: string[];
}
