import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, CheckCircle2, Loader2, RotateCcw, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useUploadPhoto } from './useUploadPhoto'
import type { ReportPhotoResponse, UploadPhase } from './types'

const PHASE_LABEL: Record<UploadPhase, string> = {
  compressing: 'Mengompres…',
  uploading: 'Mengupload…',
  attaching: 'Menyimpan…',
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

//<---------- formatBytes -------------->
function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`
}

interface PhotoUploadItemProps {
  file: File
  reportId: string
  onUploaded?: (photo: ReportPhotoResponse) => void
  onRemove: () => void
}

//<---------- StatusIcon -------------->
function StatusIcon({ isPending, isSuccess, isError, reduce }: {
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  reduce: boolean
}) {
  const status = isSuccess ? 'success' : isError ? 'error' : isPending ? 'pending' : 'idle'
  const tone = isSuccess
    ? 'text-emerald-600'
    : isError
      ? 'text-red-600'
      : 'text-neutral-500'

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(4px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-4px)' }}
        transition={{ duration: 0.16, ease: EASE_OUT }}
        className={cn('grid h-6 w-6 place-items-center', tone)}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : isError ? (
          <AlertCircle className="h-4 w-4" />
        ) : isPending ? (
          <Loader2 className={cn('h-4 w-4 animate-spin', reduce && 'animate-none')} />
        ) : null}
      </motion.span>
    </AnimatePresence>
  )
}

//<---------- PhotoUploadItem -------------->
export default function PhotoUploadItem({ file, reportId, onUploaded, onRemove }: PhotoUploadItemProps) {
  const reduce = useReducedMotion() ?? false
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [phase, setPhase] = useState<UploadPhase>('compressing')
  const [progress, setProgress] = useState(0)
  const startedRef = useRef(false)

  const mutation = useUploadPhoto(reportId, file, (nextPhase, progressPct) => {
    setPhase(nextPhase)
    if (progressPct !== undefined) setProgress(progressPct)
  })

  // Bikin & revoke object URL DI DALAM effect yang sama (bukan useMemo +
  // effect terpisah) — di dev, StrictMode jalanin mount->cleanup->mount
  // sekali. Kalau URL dibikin di useMemo (di luar effect), cleanup effect
  // bakal revoke URL yang sama yang masih dipakai render kedua, bikin
  // thumbnail gagal load (ERR_FILE_NOT_FOUND). Bikin ulang di tiap mount
  // effect memastikan URL yang aktif di state akhir selalu yang belum
  // di-revoke.
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // React StrictMode double-invoke effect di dev — guard biar mutate() cuma
  // beneran jalan sekali per file, nggak dobel minta presigned URL/attach.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    mutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      onUploaded?.(mutation.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.isSuccess])

  const handleRetry = () => {
    setProgress(0)
    setPhase('compressing')
    mutation.mutate()
  }

  const showProgress = mutation.isPending || mutation.isSuccess
  const progressRatio = mutation.isSuccess ? 1 : progress / 100

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px)' }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-white p-3',
        mutation.isError ? 'border-red-300' : 'border-neutral-200',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          {previewUrl && <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900">{file.name}</p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {formatBytes(file.size)}
                {mutation.isPending ? ` · ${PHASE_LABEL[phase]}${phase === 'uploading' ? ` ${progress}%` : ''}` : ''}
                {mutation.isError ? ` · ${mutation.error.message}` : ''}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <StatusIcon
                isPending={mutation.isPending}
                isSuccess={mutation.isSuccess}
                isError={mutation.isError}
                reduce={reduce}
              />

              {mutation.isError && (
                <button
                  type="button"
                  onClick={handleRetry}
                  aria-label={`Coba lagi upload ${file.name}`}
                  className="grid h-7 w-7 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={onRemove}
                aria-label={`Hapus ${file.name}`}
                className="grid h-7 w-7 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {showProgress && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <motion.div
                className={cn('h-full rounded-full', mutation.isSuccess ? 'bg-emerald-500' : 'bg-neutral-900')}
                style={{
                  transformOrigin: 'left',
                  transform: reduce ? `scaleX(${progressRatio})` : undefined,
                }}
                initial={false}
                animate={reduce ? undefined : { transform: `scaleX(${progressRatio})` }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.li>
  )
}
