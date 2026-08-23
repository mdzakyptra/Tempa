import { ApiProperty } from '@nestjs/swagger';


export class VoteResponseDto {
  @ApiProperty()
  report_id: string;

  @ApiProperty()
  votes_count: number;
}
