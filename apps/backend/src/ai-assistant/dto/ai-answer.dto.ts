import { ApiProperty } from '@nestjs/swagger';


export class AiAnswerDto {
  @ApiProperty({
    example: 'Laporan ini ada di posisi 2 dari 14 laporan aktif, dengan skor prioritas 78.5...',
  })
  jawaban: string;
}
