import { ApiProperty } from '@nestjs/swagger';
import { Peran } from '../../../generated/prisma/client';


export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Peran })
  peran: Peran;

  @ApiProperty({ required: false, nullable: true })
  kawasan_tugas: string | null;
}
