import { ApiProperty } from '@nestjs/swagger';
import { ReportResponseDto } from './report-response.dto';


export class ReportSimilarItemDto extends ReportResponseDto {
  @ApiProperty({
    nullable: true,
    example: 0.89,
    description: 'Skor kemiripan makna (kosinus, 0-1) dari embedding Gemini — null kalau salah satu laporan belum punya embedding',
  })
  kemiripan: number | null;

  @ApiProperty({
    example: true,
    description: 'Cocok lewat atribut terstruktur (kawasan + jenis kerusakan sama persis, JEK-17)',
  })
  cocok_atribut: boolean;

  @ApiProperty({
    example: true,
    description: 'Cocok lewat makna teks (embedding di atas ambang kemiripan, JEK-19) — bisa true walau kawasan/jenis beda',
  })
  cocok_embedding: boolean;
}
