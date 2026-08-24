import { ApiProperty } from '@nestjs/swagger';
import {
  JenisKerusakan,
  StatusLaporan,
  TingkatBahaya,
} from '../../../generated/prisma/client';


export class ReportResponseDto {
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

  @ApiProperty({
    nullable: true,
    example: null,
    description: 'id laporan utama kalau ini sudah jadi duplikat (JEK-18)',
  })
  digabung_ke_id: string | null;
}
