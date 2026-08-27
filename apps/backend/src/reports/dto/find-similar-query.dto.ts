import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { JenisKerusakan } from '../../../generated/prisma/client';


export class FindSimilarQueryDto {
  @ApiProperty({ example: 'Kelurahan Sukajadi' })
  @IsString()
  @MinLength(3)
  kawasan: string;

  @ApiProperty({ enum: JenisKerusakan })
  @IsEnum(JenisKerusakan)
  jenis_kerusakan: JenisKerusakan;

  // Opsional biar endpoint ini tetap jalan buat caller lama (JEK-17,
  // cuma kawasan+jenis_kerusakan). Kalau diisi, deteksi makna (JEK-19)
  // ikut jalan lewat embedding — nangkep laporan kalimatnya beda tapi
  // maksudnya sama, nggak cuma laporan sekawasan+sejenis.
  @ApiProperty({
    required: false,
    example: 'Jalan berlubang depan pasar',
    description: 'Judul draft laporan yang lagi diisi warga (aktifkan deteksi embedding)',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  judul?: string;

  @ApiProperty({
    required: false,
    example: 'Lubang sedalam 20cm, sudah 2 minggu belum diperbaiki',
    description: 'Deskripsi draft laporan yang lagi diisi warga (aktifkan deteksi embedding)',
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  deskripsi?: string;
}
