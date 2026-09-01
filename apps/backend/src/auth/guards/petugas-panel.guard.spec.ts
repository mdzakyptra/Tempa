import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PetugasPanelGuard } from './petugas-panel.guard';


//<---------- contextWithEmail -------------->
// Guard cuma baca request.user.email (diisi JwtAuthGuard sebelumnya), jadi
// cukup palsuin sepotong itu — nggak perlu bikin app Nest beneran.
function contextWithEmail(email?: string): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => (email ? { user: { email } } : {}) }),
  } as unknown as ExecutionContext;
}

describe('PetugasPanelGuard', () => {
  const guard = new PetugasPanelGuard();
  const allowlistAsli = process.env.PETUGAS_PANEL_EMAILS;

  beforeEach(() => {
    process.env.PETUGAS_PANEL_EMAILS = 'petugas@aspiraku.test, KEDUA@Aspiraku.test ';
  });

  afterAll(() => {
    process.env.PETUGAS_PANEL_EMAILS = allowlistAsli;
  });

  it('ngizinin email yang persis ada di allowlist', () => {
    expect(guard.canActivate(contextWithEmail('petugas@aspiraku.test'))).toBe(true);
  });

  it('gak peduli beda huruf besar-kecil & spasi di allowlist', () => {
    expect(guard.canActivate(contextWithEmail('Kedua@ASPIRAKU.test'))).toBe(true);
  });

  it('nolak email di luar allowlist walau perannya petugas', () => {
    expect(() => guard.canActivate(contextWithEmail('petugas.lain@aspiraku.test'))).toThrow(
      ForbiddenException,
    );
  });

  it('nolak request tanpa user sama sekali', () => {
    expect(() => guard.canActivate(contextWithEmail())).toThrow(ForbiddenException);
  });

  it('nolak semua orang kalau allowlist kosong (bukan malah ngebolehin semua)', () => {
    process.env.PETUGAS_PANEL_EMAILS = '';
    expect(() => guard.canActivate(contextWithEmail('petugas@aspiraku.test'))).toThrow(
      ForbiddenException,
    );
  });
});
