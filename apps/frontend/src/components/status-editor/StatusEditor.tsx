import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { ApiError, apiFetch } from '../../lib/api'
import { STATUS_LAPORAN_LABEL, STATUS_LAPORAN_OPTIONS } from '../../lib/report-enums'
import type { StatusLaporan } from '../../lib/report-enums'
import type { StatusEditorProps, UpdateStatusResponse } from './types'

//<---------- StatusEditor -------------->
// JEK-44 — alat kerja petugas ubah status laporan + catatan progres,
// manggil PATCH /reports/:reportId/status (JEK-24, sudah di-guard
// PetugasPanelOnly di backend). Setelah sukses, invalidate query yang
// dipakai panel petugas SENDIRI (['reports']) dan yang dipakai warga di
// Detail Laporan (['report', reportId], ['status-history', reportId]) —
// biar dua-duanya kelihatan berubah tanpa reload manual (skenario demo #1).
export default function StatusEditor({ reportId, currentStatus, onChanged }: StatusEditorProps) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<StatusLaporan>(currentStatus)
  const [catatan, setCatatan] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<UpdateStatusResponse>(`/reports/${reportId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, catatan: catatan.trim() || undefined }),
      }),
    onSuccess: () => {
      setCatatan('')
      queryClient.invalidateQueries({ queryKey: ['status-history', reportId] })
      queryClient.invalidateQueries({ queryKey: ['report', reportId] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      onChanged?.()
    },
  })

  //<---------- handleSubmit -------------->
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate()
  }

  const errorMessage =
    mutation.error instanceof ApiError ? mutation.error.message : 'Gagal menyimpan perubahan, coba lagi.'

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-neutral-800">
          Status baru
        </label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusLaporan)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-100"
        >
          {STATUS_LAPORAN_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {STATUS_LAPORAN_LABEL[option]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catatan" className="mb-1.5 block text-sm font-medium text-neutral-800">
          Catatan progres <span className="font-normal text-neutral-400">(opsional)</span>
        </label>
        <textarea
          id="catatan"
          value={catatan}
          onChange={(event) => setCatatan(event.target.value)}
          rows={3}
          placeholder="Contoh: tim lapangan sudah dikirim, estimasi selesai besok pagi"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-100"
        />
      </div>

      {mutation.isError && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {mutation.isSuccess && !mutation.isPending && (
        <p className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Status berhasil diperbarui.
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
      >
        {mutation.isPending ? 'Menyimpan…' : 'Simpan perubahan'}
      </button>
    </form>
  )
}
