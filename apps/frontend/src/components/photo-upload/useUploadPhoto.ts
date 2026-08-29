import { useMutation } from '@tanstack/react-query'
import { apiFetch, uploadFileToPresignedUrl } from '../../lib/api'
import { compressPhoto } from './compressImage'
import type { FailedStep, PresignedUploadResponse, ReportPhotoResponse, UploadPhase } from './types'

//<---------- PhotoUploadError -------------->
export class PhotoUploadError extends Error {
  step: FailedStep

  constructor(message: string, step: FailedStep) {
    super(message)
    this.name = 'PhotoUploadError'
    this.step = step
  }
}

//<---------- requestPresignedUpload -------------->
async function requestPresignedUpload(contentType: string, contentLength: number) {
  return apiFetch<PresignedUploadResponse>('/photos/presigned-upload', {
    method: 'POST',
    body: JSON.stringify({ contentType, contentLength }),
  })
}

//<---------- attachPhotoToReport -------------->
async function attachPhotoToReport(reportId: string, key: string) {
  return apiFetch<ReportPhotoResponse[]>('/photos', {
    method: 'POST',
    body: JSON.stringify({ reportId, keys: [key] }),
  })
}

//<---------- useUploadPhoto -------------->
// Pipeline lengkap 1 file: kompres -> minta presigned URL -> PUT ke bucket
// (progress asli lewat XHR) -> attach ke laporan. retry:false disengaja —
// retry selalu re-run dari awal (lihat PhotoUploadItem), bukan resume dari
// step yang gagal, biar nggak kejebak presigned URL yang keburu expired
// (5 menit).
export function useUploadPhoto(
  reportId: string,
  file: File,
  onPhase: (phase: UploadPhase, progressPct?: number) => void,
) {
  return useMutation<ReportPhotoResponse, PhotoUploadError, void>({
    retry: false,
    mutationFn: async () => {
      onPhase('compressing')
      let compressed: File
      try {
        compressed = await compressPhoto(file)
      } catch (error) {
        throw new PhotoUploadError(
          error instanceof Error ? error.message : 'Gagal mengompres foto',
          'compress',
        )
      }

      onPhase('uploading', 0)
      let presigned: PresignedUploadResponse
      try {
        presigned = await requestPresignedUpload(compressed.type, compressed.size)
      } catch (error) {
        throw new PhotoUploadError(
          error instanceof Error ? error.message : 'Gagal minta izin upload',
          'presign',
        )
      }

      try {
        await uploadFileToPresignedUrl(presigned.uploadUrl, compressed, compressed.type, (pct) =>
          onPhase('uploading', pct),
        )
      } catch (error) {
        throw new PhotoUploadError(
          error instanceof Error ? error.message : 'Gagal upload ke storage',
          'upload',
        )
      }

      onPhase('attaching')
      try {
        const [photo] = await attachPhotoToReport(reportId, presigned.key)
        return photo
      } catch (error) {
        throw new PhotoUploadError(
          error instanceof Error ? error.message : 'Gagal simpan foto ke laporan',
          'attach',
        )
      }
    },
  })
}
