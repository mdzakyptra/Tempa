import { ApiProperty } from '@nestjs/swagger';
import { StatusLaporan } from '../../../generated/prisma/client';
import { StatusHistoryResponseDto } from './status-history-response.dto';


export class UpdateStatusResponseDto {
  @ApiProperty()
  report_id: string;

  @ApiProperty({ enum: StatusLaporan })
  status: StatusLaporan;

  @ApiProperty({ type: StatusHistoryResponseDto })
  riwayat_terbaru: StatusHistoryResponseDto;
}
