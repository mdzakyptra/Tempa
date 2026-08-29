// Mirror enum di apps/backend/prisma/schema.prisma. String union, bukan
// `enum` — tsconfig.app.json pakai erasableSyntaxOnly:true.
export type JenisKerusakan =
  | 'jalan'
  | 'trotoar'
  | 'lampu_jalan'
  | 'drainase'
  | 'jembatan'
  | 'fasilitas_umum'
  | 'lainnya'

export type TingkatBahaya = 'rendah' | 'sedang' | 'tinggi' | 'darurat'

export const JENIS_KERUSAKAN_LABEL: Record<JenisKerusakan, string> = {
  jalan: 'Jalan',
  trotoar: 'Trotoar',
  lampu_jalan: 'Lampu Jalan',
  drainase: 'Drainase',
  jembatan: 'Jembatan',
  fasilitas_umum: 'Fasilitas Umum',
  lainnya: 'Lainnya',
}

export const TINGKAT_BAHAYA_LABEL: Record<TingkatBahaya, string> = {
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'Tinggi',
  darurat: 'Darurat',
}

export const JENIS_KERUSAKAN_OPTIONS = Object.keys(JENIS_KERUSAKAN_LABEL) as JenisKerusakan[]
export const TINGKAT_BAHAYA_OPTIONS = Object.keys(TINGKAT_BAHAYA_LABEL) as TingkatBahaya[]
