import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OptionalAuthGuard } from '../guards/optional-auth.guard';


// Modul yang pakai decorator ini wajib import AuthModule di imports-nya,
// supaya JwtService bisa di-resolve DI untuk OptionalAuthGuard.
//<---------- OptionalAuth -------------->
export const OptionalAuth = () => {
  return applyDecorators(UseGuards(OptionalAuthGuard), ApiBearerAuth());
};
