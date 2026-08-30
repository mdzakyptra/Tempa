import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
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

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
