import { ApiProperty } from '@nestjs/swagger';


export class PresignedUploadResponseDto {
  @ApiProperty({
    example: 'https://<bucket>.<endpoint>/reports/<uuid>.jpg?X-Amz-...',
    description: 'PUT ke URL ini langsung dari browser, header Content-Type harus sama persis dengan yang diminta',
  })
  uploadUrl: string;

  @ApiProperty({
    example: 'reports/6d1f6c9e-2c34-4a3b-9a7e-4b1f6c9e2c34.jpg',
    description: 'Object key di bucket — dipakai lagi saat simpan foto ke laporan (JEK-23)',
  })
  key: string;

  @ApiProperty({ example: 300, description: 'Masa berlaku presigned URL dalam detik' })
  expiresIn: number;
}
