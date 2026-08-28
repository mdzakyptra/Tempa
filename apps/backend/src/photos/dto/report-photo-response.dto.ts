import { ApiProperty } from '@nestjs/swagger';


export class ReportPhotoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  report_id: string;

  @ApiProperty({ description: 'URL lewat domain CDN (JEK-54), bukan URL bucket langsung' })
  url_foto: string;
}
