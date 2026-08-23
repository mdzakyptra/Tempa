import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { TokenPairDto } from './dto/token-pair.dto';
import { ApiStandardResponse } from '../common/decorators/api-standard-response.decorator';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //<---------- register -------------->
  @Post('register')
  @ApiStandardResponse(AuthResponseDto, { description: 'Berhasil mendaftar' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  //<---------- login -------------->
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiStandardResponse(AuthResponseDto, { description: 'Berhasil masuk' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  //<---------- refresh -------------->
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiStandardResponse(TokenPairDto, { description: 'Token diperbarui' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  //<---------- logout -------------->
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Berhasil keluar' })
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
