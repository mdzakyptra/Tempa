import { ApiProperty } from '@nestjs/swagger';
import { StatusLaporan } from '../../../generated/prisma/client';


export class StatusHistoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  report_id: string;

  @ApiProperty({ enum: StatusLaporan, nullable: true })
  status_lama: StatusLaporan | null;

  @ApiProperty({ enum: StatusLaporan })
  status_baru: StatusLaporan;

  @ApiProperty({ required: false, nullable: true })
  catatan: string | null;

  @ApiProperty()
  diubah_oleh: string;

  @ApiProperty()
  diubah_pada: Date;
}
