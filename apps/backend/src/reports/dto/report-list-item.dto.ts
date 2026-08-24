import { ApiProperty } from '@nestjs/swagger';
import {
  JenisKerusakan,
  StatusLaporan,
  TingkatBahaya,
} from '../../../generated/prisma/client';


// Rincian tiap komponen dalam skala 0-100, biar bisa ditampilkan langsung
// di halaman Detail Laporan (JEK-34) tanpa frontend perlu hitung ulang.
export class SkorKomponenDto {
  @ApiProperty({ description: 'Tingkat bahaya, bobot 35%' })
  bahaya: number;

  @ApiProperty({ description: 'Jumlah warga terdampak, bobot 25%' })
  terdampak: number;

  @ApiProperty({ description: 'Lama menunggu, bobot 20%' })
  lama_menunggu: number;

  @ApiProperty({ description: 'Jalur vital, bobot 20%' })
  jalur_vital: number;
}

export class ReportListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  judul: string;

  @ApiProperty()
  deskripsi: string;

  @ApiProperty()
  kawasan: string;

  @ApiProperty({ enum: JenisKerusakan })
  jenis_kerusakan: JenisKerusakan;

  @ApiProperty({ enum: TingkatBahaya })
  tingkat_bahaya: TingkatBahaya;

  @ApiProperty()
  estimasi_terdampak: number;

  @ApiProperty()
  jalur_vital: boolean;

  @ApiProperty()
  votes_count: number;

  @ApiProperty({ enum: StatusLaporan })
  status: StatusLaporan;

  @ApiProperty()
  dibuat_pada: Date;

  @ApiProperty({ nullable: true, example: null })
  dibuat_oleh: string | null;

  @ApiProperty({ description: 'Skor prioritas akhir, skala 0-100' })
  skor: number;

  @ApiProperty({ type: SkorKomponenDto })
  skor_komponen: SkorKomponenDto;
}
