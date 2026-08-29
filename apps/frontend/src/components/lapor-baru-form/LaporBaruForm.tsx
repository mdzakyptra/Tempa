import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import { SimilarReportsSuggestion } from '../similar-reports'
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
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none'

//<---------- FieldError -------------->
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-600">{message}</p>
}

//<---------- LaporBaruForm -------------->
// JEK-37 — form beneran, menyatukan validasi client-side + deteksi duplikat
// (JEK-39/48) + submit ke POST /reports. Setelah sukses, halaman pemanggil
// (LaporBaru.tsx) yang nentuin fase foto (JEK-38) & redirect hasil (JEK-40).
export default function LaporBaruForm({ onCreated }: LaporBaruFormProps) {
  const [form, setForm] = useState<LaporBaruFormState>(INITIAL_FORM)
  const [touched, setTouched] = useState<Partial<Record<keyof LaporBaruFormState, boolean>>>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

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
    if (Object.keys(errors).length > 0) return

    createMutation.mutate({
      judul: form.judul.trim(),
      deskripsi: form.deskripsi.trim(),
      kawasan: form.kawasan.trim(),
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="kawasan" className="mb-1 block text-sm font-medium text-gray-700">
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
        <label htmlFor="jenis_kerusakan" className="mb-1 block text-sm font-medium text-gray-700">
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
        <label htmlFor="judul" className="mb-1 block text-sm font-medium text-gray-700">
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

      <div>
        <label htmlFor="tingkat_bahaya" className="mb-1 block text-sm font-medium text-gray-700">
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
        <label htmlFor="estimasi_terdampak" className="mb-1 block text-sm font-medium text-gray-700">
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

      <div>
        <label htmlFor="deskripsi" className="mb-1 block text-sm font-medium text-gray-700">
          Deskripsi
        </label>
        <textarea
          id="deskripsi"
          rows={4}
          value={form.deskripsi}
          onChange={(e) => handleChange('deskripsi', e.target.value)}
          onBlur={() => handleBlur('deskripsi')}
          placeholder="Jelaskan kerusakannya, sudah berapa lama, dan dampaknya buat warga sekitar"
          className={inputClass}
        />
        <FieldError message={showError('deskripsi')} />
      </div>

      {createMutation.isError && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Gagal mengirim laporan, coba lagi.'}
        </p>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {createMutation.isPending ? 'Mengirim…' : 'Kirim Laporan'}
      </button>
    </form>
  )
}
