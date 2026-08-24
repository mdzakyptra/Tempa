import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { JenisKerusakan } from '../../../generated/prisma/client';


export class ListReportsQueryDto {
  // MinLength disamakan sama CreateReportDto (JEK-13) — belum ada daftar
  // kawasan valid yang disepakati tim, jadi validasinya sebatas format string.
  @ApiPropertyOptional({ example: 'Kelurahan Sukajadi' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  kawasan?: string;

  @ApiPropertyOptional({ enum: JenisKerusakan })
  @IsOptional()
  @IsEnum(JenisKerusakan)
  jenis_kerusakan?: JenisKerusakan;
}
