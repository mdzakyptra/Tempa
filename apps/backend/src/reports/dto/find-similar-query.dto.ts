import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { JenisKerusakan } from '../../../generated/prisma/client';


export class FindSimilarQueryDto {
  @ApiProperty({ example: 'Kelurahan Sukajadi' })
  @IsString()
  @MinLength(3)
  kawasan: string;

  @ApiProperty({ enum: JenisKerusakan })
  @IsEnum(JenisKerusakan)
  jenis_kerusakan: JenisKerusakan;
}
