import { ApiProperty } from '@nestjs/swagger';


export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Data tidak ditemukan' })
  message: string;

  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: '/reports/123' })
  path: string;

  @ApiProperty({ example: '2026-08-24T10:00:00.000Z' })
  timestamp: string;
}
