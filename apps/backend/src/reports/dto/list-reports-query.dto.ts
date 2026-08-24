import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JenisKerusakan } from '../../../generated/prisma/client';


export class ListReportsQueryDto {
  @ApiPropertyOptional({ example: 'Kelurahan Sukajadi' })
  @IsOptional()
  @IsString()
  kawasan?: string;

  @ApiPropertyOptional({ enum: JenisKerusakan })
  @IsOptional()
  @IsEnum(JenisKerusakan)
  jenis_kerusakan?: JenisKerusakan;
}
