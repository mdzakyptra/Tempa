// Mirror apps/backend/src/photos/constants/photo-upload.constant.ts
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

// Disesuaikan sama throttle backend: presigned-upload 10/60s, attach 20/60s
// (photos.controller.ts) — 6 file per laporan masih jauh di bawah limit itu
// walau ada retry.
export const DEFAULT_MAX_FILES = 6

// Kompresi (lihat compressImage.ts)
export const SKIP_COMPRESSION_BELOW_BYTES = 500 * 1024
export const COMPRESSION_MAX_WIDTH_OR_HEIGHT = 1600
export const COMPRESSION_MAX_SIZE_MB = 1
export const COMPRESSION_INITIAL_QUALITY = 0.8
