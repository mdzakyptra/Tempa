import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PetugasPanelGuard } from '../guards/petugas-panel.guard';
import { Roles } from './roles.decorator';
import { Peran } from '../../../generated/prisma/client';


// JEK-44 — Modul yang pakai decorator ini wajib import AuthModule di
// imports-nya (sama kayak Auth()). Bedanya dari Auth(Peran.petugas):
// nambah PetugasPanelGuard di akhir chain, jadi cuma 2 akun spesifik
// (PETUGAS_PANEL_EMAILS di .env) yang lolos, bukan semua akun berperan
// petugas.
//<---------- PetugasPanelOnly -------------->
export const PetugasPanelOnly = () => {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard, PetugasPanelGuard),
    Roles(Peran.petugas),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Token tidak valid atau tidak ada' }),
    ApiForbiddenResponse({ description: 'Akun ini tidak diizinkan mengakses Panel Petugas' }),
  );
};
