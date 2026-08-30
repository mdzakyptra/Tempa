import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';


export class ListReportPhotosDto {
  @ApiProperty({ example: '6d1f6c9e-2c34-4a3b-9a7e-4b1f6c9e2c34' })
  @IsUUID()
  reportId: string;
}
