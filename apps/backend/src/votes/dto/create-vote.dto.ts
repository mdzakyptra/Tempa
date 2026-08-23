import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';


export class CreateVoteDto {
  @ApiProperty({ example: 'b5c78733-0656-4482-ab1e-21a041316149' })
  @IsUUID()
  report_id: string;
}
