import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';


// JEK-44 — dijalankan SETELAH JwtAuthGuard+RolesGuard (lihat
// PetugasPanelOnly decorator), jadi request.user udah pasti keisi kalau
// guard ini kepanggil. Nambahin pembatasan: bukan cuma peran==='petugas',
// tapi email-nya juga harus persis ada di allowlist — dua akun tertentu
// aja yang boleh akses Panel Petugas/ubah status, sesuai permintaan.
function allowedEmails(): string[] {
  return (process.env.PETUGAS_PANEL_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

@Injectable()
export class PetugasPanelGuard implements CanActivate {
  //<---------- canActivate -------------->
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    const email = request.user?.email?.toLowerCase();

    if (!email || !allowedEmails().includes(email)) {
      throw new ForbiddenException('Akun ini tidak diizinkan mengakses Panel Petugas.');
    }

    return true;
  }
}
