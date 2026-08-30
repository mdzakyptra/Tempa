import type { LaporBaruFormErrors, LaporBaruFormState } from './types'

// Mirror aturan apps/backend/src/reports/dto/create-report.dto.ts — dipakai
// buat validasi client-side, backend tetap jadi sumber kebenaran terakhir.
export function validateLaporBaruForm(form: LaporBaruFormState): LaporBaruFormErrors {
  const errors: LaporBaruFormErrors = {}

  if (form.judul.trim().length < 3) {
    errors.judul = 'Judul minimal 3 karakter'
  }

  if (form.kawasan.trim().length < 3) {
    errors.kawasan = 'Kawasan minimal 3 karakter'
  }

  if (form.jenis_kerusakan === '') {
    errors.jenis_kerusakan = 'Pilih jenis kerusakan'
  }

  if (form.tingkat_bahaya === '') {
    errors.tingkat_bahaya = 'Pilih tingkat bahaya'
  }

  const estimasi = Number(form.estimasi_terdampak)
  if (form.estimasi_terdampak.trim() === '' || !Number.isInteger(estimasi) || estimasi < 0) {
    errors.estimasi_terdampak = 'Isi perkiraan warga terdampak (angka bulat, minimal 0)'
  }

  if (form.deskripsi.trim().length < 10) {
    errors.deskripsi = 'Deskripsi minimal 10 karakter'
  }

  return errors
}
