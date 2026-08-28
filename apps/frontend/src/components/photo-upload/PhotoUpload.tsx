import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { motion } from 'motion/react'
import { RotateCcw, UploadCloud } from 'lucide-react'
import { cn } from '../../lib/cn'
import PhotoUploadItem from './PhotoUploadItem'
import { ALLOWED_MIME_TYPES, DEFAULT_MAX_FILES } from './constants'
import type { PhotoUploadProps, ReportPhotoResponse } from './types'

interface PickedFile {
  id: string
  file: File
}

type LayoutVariant = 'centered' | 'row'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

//<---------- PhotoUpload -------------->
export default function PhotoUpload({ reportId, onUploaded, maxFiles, className }: PhotoUploadProps) {
  const [items, setItems] = useState<PickedFile[]>([])
  const [rejected, setRejected] = useState<string[]>([])
  const [successCount, setSuccessCount] = useState(0)
  const [layout, setLayout] = useState<LayoutVariant>('centered')
  const inputRef = useRef<HTMLInputElement>(null)
  const limit = maxFiles ?? DEFAULT_MAX_FILES
  const disabled = !reportId
  const maxReached = items.length >= limit

  //<---------- handleFilesSelected -------------->
  const handleFilesSelected = (fileList: FileList) => {
    const incoming = Array.from(fileList)
    const rejectedNames: string[] = []
    const accepted: PickedFile[] = []

    for (const file of incoming) {
      if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
        rejectedNames.push(file.name)
        continue
      }
      accepted.push({ id: crypto.randomUUID(), file })
    }

    setItems((prev) => {
      const room = Math.max(0, limit - prev.length)
      const overflow = accepted.slice(room)
      overflow.forEach((f) => rejectedNames.push(f.file.name))
      return [...prev, ...accepted.slice(0, room)]
    })
    if (rejectedNames.length > 0) setRejected(rejectedNames)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFilesSelected(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (disabled || maxReached) return
    handleFilesSelected(e.dataTransfer.files)
  }

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUploaded = (photo: ReportPhotoResponse) => {
    setSuccessCount((n) => n + 1)
    onUploaded?.(photo)
  }

  const handleReset = () => {
    setItems([])
    setRejected([])
    setSuccessCount(0)
  }

  const centered = layout === 'centered'

  return (
    <div className={cn('w-full max-w-md rounded-[2rem] border border-neutral-200 bg-white p-3', className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Foto Laporan</p>
          <p className="text-xs text-neutral-500">
            {successCount} dari {items.length} foto siap
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex rounded-full border border-neutral-200 bg-neutral-100 p-1">
            {(['centered', 'row'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLayout(option)}
                data-selected={layout === option}
                className="h-7 rounded-full px-3 text-xs font-medium text-neutral-500 transition-colors data-[selected=true]:bg-white data-[selected=true]:text-neutral-900"
              >
                {option === 'centered' ? 'Kotak' : 'Baris'}
              </button>
            ))}
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset daftar foto"
              className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={disabled || maxReached}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          'group relative flex w-full overflow-hidden rounded-3xl border border-dashed border-neutral-200 bg-white outline-none',
          'transition-colors hover:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-300',
          'disabled:pointer-events-none disabled:opacity-55',
          centered ? 'min-h-56 flex-col items-center justify-center gap-3 p-7 text-center' : 'items-center gap-4 p-5 text-left',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_MIME_TYPES.join(',')}
          className="sr-only"
          disabled={disabled || maxReached}
          onChange={handleInputChange}
        />

        <motion.span
          aria-hidden="true"
          className={cn(
            'grid shrink-0 place-items-center bg-neutral-100 text-neutral-900',
            centered ? 'h-16 w-16 rounded-[1.35rem] border border-neutral-200' : 'h-14 w-14 rounded-[1.25rem]',
          )}
          transition={{ duration: 0.16, ease: EASE_OUT }}
        >
          <UploadCloud className={centered ? 'h-7 w-7' : 'h-6 w-6'} />
        </motion.span>

        <span className={cn('min-w-0', centered ? 'max-w-xs' : 'flex-1')}>
          <span className={cn('block font-semibold text-neutral-900', centered ? 'text-base' : 'text-sm')}>
            {disabled
              ? 'Laporan belum dibuat'
              : maxReached
                ? 'Batas foto tercapai'
                : 'Tarik foto ke sini'}
          </span>
          <span className={cn('block text-xs text-neutral-500', centered ? 'mt-1 leading-5' : 'mt-0.5')}>
            {disabled
              ? 'Tunggu laporan tersimpan dulu'
              : maxReached
                ? `${items.length} dari ${limit} foto ditambahkan`
                : `JPG, PNG, atau WEBP · maksimal ${limit} foto`}
          </span>
        </span>

        <span
          className={cn(
            'shrink-0 rounded-full border border-neutral-200 text-xs font-medium text-neutral-900 transition-colors group-hover:bg-neutral-100',
            centered ? 'mt-1 px-4 py-2' : 'px-3.5 py-2',
          )}
        >
          Pilih Foto
        </span>
      </button>

      {rejected.length > 0 && (
        <p className="mt-2 px-1 text-xs text-red-600">
          Ditolak (bukan gambar atau kelebihan batas): {rejected.join(', ')}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <PhotoUploadItem
              key={item.id}
              file={item.file}
              reportId={reportId}
              onUploaded={handleUploaded}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
