import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';


export class AskQuestionDto {
  @ApiProperty({ example: 'Kenapa laporan ini belum ditangani?' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  pertanyaan: string;

  @ApiProperty({
    required: false,
    description: 'Laporan yang sedang dilihat warga saat bertanya (konteks dari widget chat)',
    example: 'b5c78733-0656-4482-ab1e-21a041316149',
  })
  @IsOptional()
  @IsUUID()
  report_id?: string;
}
