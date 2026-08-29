import imageCompression from 'browser-image-compression'
import {
  ALLOWED_MIME_TYPES,
  COMPRESSION_INITIAL_QUALITY,
  COMPRESSION_MAX_SIZE_MB,
  COMPRESSION_MAX_WIDTH_OR_HEIGHT,
  SKIP_COMPRESSION_BELOW_BYTES,
} from './constants'

//<---------- compressPhoto -------------->
// File kecil & udah mime yang valid — nggak usah dikompres ulang, buang-buang
// CPU & kualitas turun percuma. File lain dikompres & dinormalisasi ke JPEG
// (foto kerusakan jalan, bukan grafis yang butuh transparansi PNG).
export async function compressPhoto(file: File): Promise<File> {
  if (
    file.size <= SKIP_COMPRESSION_BELOW_BYTES &&
    (ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)
  ) {
    return file
  }

  return imageCompression(file, {
    maxWidthOrHeight: COMPRESSION_MAX_WIDTH_OR_HEIGHT,
    maxSizeMB: COMPRESSION_MAX_SIZE_MB,
    initialQuality: COMPRESSION_INITIAL_QUALITY,
    fileType: 'image/jpeg',
    useWebWorker: true,
  })
}
