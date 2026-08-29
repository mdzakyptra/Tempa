import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsLatitude, IsLongitude, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { JenisKerusakan, TingkatBahaya } from '../../../generated/prisma/client';


export class CreateReportDto {
  @ApiProperty({ example: 'Jalan berlubang depan pasar' })
  @IsString()
  @MinLength(3)
  judul: string;

  // MinLength lebih longgar disengaja: deskripsi ini yang jadi bahan embedding
  // deteksi laporan serupa (JEK-15/16), jadi perlu cukup teks buat dicocokkan.
  @ApiProperty({
    example: 'Lubang sedalam 20cm di jalur utama, sudah 2 minggu belum diperbaiki',
  })
  @IsString()
  @MinLength(10)
  deskripsi: string;

  @ApiProperty({ example: 'Kelurahan Sukajadi' })
  @IsString()
  @MinLength(3)
  kawasan: string;

  // Opsional buat sementara: form Lapor Baru (JEK-37) yang wajib ngirim ini
  // belum kelar disambung ke globe/picker lokasinya. Begitu itu selesai,
  // naikkan jadi wajib biar laporan baru selalu punya koordinat buat peta (JEK-45).
  @ApiPropertyOptional({ example: -6.9147 })
  @IsOptional()
  @IsLatitude()
  lat?: number;

  @ApiPropertyOptional({ example: 107.6098 })
  @IsOptional()
  @IsLongitude()
  lng?: number;

  @ApiProperty({ enum: JenisKerusakan, example: JenisKerusakan.jalan })
  @IsEnum(JenisKerusakan)
  jenis_kerusakan: JenisKerusakan;

  @ApiProperty({ enum: TingkatBahaya, example: TingkatBahaya.tinggi })
  @IsEnum(TingkatBahaya)
  tingkat_bahaya: TingkatBahaya;

  @ApiProperty({
    example: 50,
    description: 'Estimasi awal warga terdampak, sebelum ada dukungan',
  })
  @IsInt()
  @Min(0)
  estimasi_terdampak: number;
}
