import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import { SimilarReportsSuggestion } from '../similar-reports'
import { LocationPicker } from '../location-picker'
import type { LocationValue } from '../location-picker'
import {
  JENIS_KERUSAKAN_LABEL,
  JENIS_KERUSAKAN_OPTIONS,
  TINGKAT_BAHAYA_LABEL,
  TINGKAT_BAHAYA_OPTIONS,
} from '../../lib/report-enums'
import { validateLaporBaruForm } from './validate'
import type { CreateReportPayload, LaporBaruFormProps, LaporBaruFormState } from './types'


const INITIAL_FORM: LaporBaruFormState = {
  judul: '',
  kawasan: '',
  jenis_kerusakan: '',
  tingkat_bahaya: '',
  estimasi_terdampak: '',
  deskripsi: '',
}

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5'

//<---------- FieldError -------------->
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>
}

//<---------- LaporBaruForm -------------->
// JEK-37 — form beneran, menyatukan validasi client-side + deteksi duplikat
// (JEK-39/48) + submit ke POST /reports. Setelah sukses, halaman pemanggil
// (LaporBaru.tsx) yang nentuin fase foto (JEK-38) & redirect hasil (JEK-40).
export default function LaporBaruForm({ onCreated }: LaporBaruFormProps) {
  const [form, setForm] = useState<LaporBaruFormState>(INITIAL_FORM)
  const [touched, setTouched] = useState<Partial<Record<keyof LaporBaruFormState, boolean>>>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [location, setLocation] = useState<LocationValue | null>(null)

  const errors = useMemo(() => validateLaporBaruForm(form), [form])

  const showError = (field: keyof LaporBaruFormState) =>
    touched[field] || attemptedSubmit ? errors[field] : undefined

  const handleChange = <K extends keyof LaporBaruFormState>(field: K, value: LaporBaruFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleBlur = (field: keyof LaporBaruFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateReportPayload) =>
      apiFetch<{ id: string }>('/reports', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: (data) => onCreated(data.id),
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setAttemptedSubmit(true)
    if (Object.keys(errors).length > 0 || !location) return

    createMutation.mutate({
      judul: form.judul.trim(),
      deskripsi: form.deskripsi.trim(),
      kawasan: form.kawasan.trim(),
      lat: location.lat,
      lng: location.lng,
      jenis_kerusakan: form.jenis_kerusakan as CreateReportPayload['jenis_kerusakan'],
      tingkat_bahaya: form.tingkat_bahaya as CreateReportPayload['tingkat_bahaya'],
      estimasi_terdampak: Number(form.estimasi_terdampak),
    })
  }

  // Cuma dikirim ke SimilarReportsSuggestion kalau valid — biar
  // canSubmitAndMerge di komponen itu nggak nyala pas angkanya belum bener.
  const estimasiValid =
    form.estimasi_terdampak.trim() !== '' &&
    Number.isInteger(Number(form.estimasi_terdampak)) &&
    Number(form.estimasi_terdampak) >= 0

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(0,0,0,0.3)] sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">1</span>
          <div><h2 className="font-semibold text-neutral-950">Lokasi kerusakan</h2><p className="mt-1 text-sm text-neutral-500">Titik presisi membantu petugas menemukan masalahnya.</p></div>
        </div>
        <LocationPicker value={location} onChange={setLocation} />
        {attemptedSubmit && !location && <FieldError message="Pilih titik lokasi kerusakan terlebih dahulu" />}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(0,0,0,0.3)] sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">2</span>
          <div><h2 className="font-semibold text-neutral-950">Ceritakan masalahnya</h2><p className="mt-1 text-sm text-neutral-500">Informasi yang jelas membantu laporan diprioritaskan dengan tepat.</p></div>
        </div>

      <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="kawasan" className="mb-2 block text-sm font-medium text-neutral-800">
          Kawasan
        </label>
        <input
          id="kawasan"
          type="text"
          value={form.kawasan}
          onChange={(e) => handleChange('kawasan', e.target.value)}
          onBlur={() => handleBlur('kawasan')}
          placeholder="Contoh: Kelurahan Sukajadi"
          className={inputClass}
        />
        <FieldError message={showError('kawasan')} />
      </div>

      <div>
        <label htmlFor="jenis_kerusakan" className="mb-2 block text-sm font-medium text-neutral-800">
          Jenis Kerusakan
        </label>
        <select
          id="jenis_kerusakan"
          value={form.jenis_kerusakan}
          onChange={(e) => handleChange('jenis_kerusakan', e.target.value as LaporBaruFormState['jenis_kerusakan'])}
          onBlur={() => handleBlur('jenis_kerusakan')}
          className={inputClass}
        >
          <option value="">Pilih jenis kerusakan</option>
          {JENIS_KERUSAKAN_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {JENIS_KERUSAKAN_LABEL[option]}
            </option>
          ))}
        </select>
        <FieldError message={showError('jenis_kerusakan')} />
      </div>
      </div>

      {/* JEK-39/48 — terpicu otomatis begitu kawasan+jenis (idealnya juga
          judul+deskripsi) terisi, sebelum warga lanjut submit di bawah. */}
      <SimilarReportsSuggestion
        kawasan={form.kawasan}
        jenis_kerusakan={form.jenis_kerusakan}
        judul={form.judul}
        deskripsi={form.deskripsi}
        tingkat_bahaya={form.tingkat_bahaya}
        estimasi_terdampak={estimasiValid ? Number(form.estimasi_terdampak) : undefined}
      />

      <div>
        <label htmlFor="judul" className="mb-2 block text-sm font-medium text-neutral-800">
          Judul Laporan
        </label>
        <input
          id="judul"
          type="text"
          value={form.judul}
          onChange={(e) => handleChange('judul', e.target.value)}
          onBlur={() => handleBlur('judul')}
          placeholder="Contoh: Jalan berlubang depan pasar"
          className={inputClass}
        />
        <FieldError message={showError('judul')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="tingkat_bahaya" className="mb-2 block text-sm font-medium text-neutral-800">
          Tingkat Bahaya
        </label>
        <select
          id="tingkat_bahaya"
          value={form.tingkat_bahaya}
          onChange={(e) => handleChange('tingkat_bahaya', e.target.value as LaporBaruFormState['tingkat_bahaya'])}
          onBlur={() => handleBlur('tingkat_bahaya')}
          className={inputClass}
        >
          <option value="">Pilih tingkat bahaya</option>
          {TINGKAT_BAHAYA_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {TINGKAT_BAHAYA_LABEL[option]}
            </option>
          ))}
        </select>
        <FieldError message={showError('tingkat_bahaya')} />
      </div>

      <div>
        <label htmlFor="estimasi_terdampak" className="mb-2 block text-sm font-medium text-neutral-800">
          Estimasi Warga Terdampak
        </label>
        <input
          id="estimasi_terdampak"
          type="number"
          min={0}
          step={1}
          value={form.estimasi_terdampak}
          onChange={(e) => handleChange('estimasi_terdampak', e.target.value)}
          onBlur={() => handleBlur('estimasi_terdampak')}
          placeholder="Contoh: 50"
          className={inputClass}
        />
        <FieldError message={showError('estimasi_terdampak')} />
      </div>
      </div>

      <div>
        <label htmlFor="deskripsi" className="mb-2 block text-sm font-medium text-neutral-800">
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          rows={4}
          value={form.deskripsi}
          onChange={(e) => handleChange('deskripsi', e.target.value)}
          onBlur={() => handleBlur('deskripsi')}
          placeholder="Jelaskan kerusakannya, sudah berapa lama, dan dampaknya buat warga sekitar"
          className={`${inputClass} resize-y`}
        />
        <FieldError message={showError('deskripsi')} />
      </div>
      </section>

      {createMutation.isError && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Gagal mengirim laporan, coba lagi.'}
        </p>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full rounded-xl bg-neutral-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {createMutation.isPending ? 'Mengirim…' : 'Kirim Laporan'}
      </button>
    </form>
  )
}
