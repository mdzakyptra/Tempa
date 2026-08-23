import { ApiProperty } from '@nestjs/swagger';
import { TokenPairDto } from './token-pair.dto';
import { ProfileResponseDto } from './profile-response.dto';


export class AuthResponseDto extends TokenPairDto {
  @ApiProperty({ type: ProfileResponseDto })
  profile: ProfileResponseDto;
}
