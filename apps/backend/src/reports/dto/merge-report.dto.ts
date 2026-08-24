import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';


export class MergeReportDto {
  @ApiProperty({
    description: 'id laporan utama yang jadi tujuan gabung',
    example: 'b5c78733-0656-4482-ab1e-21a041316149',
  })
  @IsUUID()
  laporan_utama_id: string;
}
