import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusLaporan } from '../../../generated/prisma/client';


export class UpdateStatusDto {
  @ApiProperty({ enum: StatusLaporan, example: StatusLaporan.diproses })
  @IsEnum(StatusLaporan)
  status: StatusLaporan;

  @ApiProperty({
    required: false,
    example: 'Sedang dikerjakan tim lapangan',
  })
  @IsOptional()
  @IsString()
  catatan?: string;
}
