// Ekstensi bucket-side (JEK-23) verifikasi ulang tipe/ukuran asli via HEAD
// request — batas di sini cuma nyaring di level penerbitan presigned URL.
export const ALLOWED_CONTENT_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export const PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS = 300;
