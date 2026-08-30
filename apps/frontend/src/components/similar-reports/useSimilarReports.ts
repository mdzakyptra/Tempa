import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { ReportSimilarItem, SimilarReportsParams } from './types'

const DEBOUNCE_MS = 400
const MIN_JUDUL_LENGTH = 3
const MIN_DESKRIPSI_LENGTH = 10

//<---------- fetchSimilarReports -------------->
async function fetchSimilarReports(params: SimilarReportsParams): Promise<ReportSimilarItem[]> {
  const qs = new URLSearchParams({
    kawasan: params.kawasan,
    jenis_kerusakan: params.jenis_kerusakan,
  })
  // judul/deskripsi opsional — kalau diisi (dan udah cukup panjang), aktifin
  // deteksi makna/embedding di backend (JEK-19), bukan cuma cocok atribut (JEK-17).
  if (params.judul && params.judul.trim().length >= MIN_JUDUL_LENGTH) {
    qs.set('judul', params.judul)
  }
  if (params.deskripsi && params.deskripsi.trim().length >= MIN_DESKRIPSI_LENGTH) {
    qs.set('deskripsi', params.deskripsi)
  }
  return apiFetch<ReportSimilarItem[]>(`/reports/similar?${qs.toString()}`)
}

//<---------- useSimilarReports -------------->
// Debounce manual (bukan ketikan langsung nge-trigger fetch) — kawasan/jenis
// kerusakan/judul/deskripsi biasanya diketik warga, jangan nembak API tiap
// keystroke.
export function useSimilarReports(params: SimilarReportsParams) {
  const [debounced, setDebounced] = useState(params)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(params), DEBOUNCE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.kawasan, params.jenis_kerusakan, params.judul, params.deskripsi])

  const enabled = debounced.kawasan.trim().length >= 3 && debounced.jenis_kerusakan !== ''

  return useQuery({
    queryKey: ['reports-similar', debounced.kawasan, debounced.jenis_kerusakan, debounced.judul, debounced.deskripsi],
    queryFn: () => fetchSimilarReports(debounced),
    enabled,
  })
}
