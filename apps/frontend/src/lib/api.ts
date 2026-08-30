import { getAccessToken, getValidAccessToken, refreshAccessToken } from './auth'


export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// GET /reports paginate ke 10 item per halaman secara default (lihat
// ListReportsQueryDto di BE, limit max 500). Beberapa tempat (globe, dropdown
// kawasan, hitung posisi antrean setelah lapor) butuh SEMUA laporan aktif,
// bukan cuma satu halaman — pakai path ini, bukan '/reports' polos.
export const ALL_REPORTS_PATH = '/reports?limit=500'

// Envelope sukses/gagal dari backend NestJS — lihat ApiResponseDto &
// ApiErrorResponseDto di apps/backend/src/common/dto/.
interface ApiSuccessEnvelope<T> {
  success: true
  message: string
  data?: T
}

interface ApiErrorEnvelope {
  success: false
  message: string
  statusCode: number
  path: string
  timestamp: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ApiPaginatedEnvelope<T> extends ApiSuccessEnvelope<T> {
  meta: PaginationMeta
}

interface ApiRequestOptions {
  retryAfterRefresh?: boolean
}

//<---------- ApiError -------------->
export class ApiError extends Error {
  statusCode: number
  path?: string

  constructor(message: string, statusCode: number, path?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.path = path
  }
}

//<---------- apiFetch -------------->
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { body } = await requestApi<T>(path, init)
  return body.data as T
}

//<---------- apiFetchPaginated -------------->
// Sama kayak apiFetch, tapi juga ngambil `meta` dari envelope — dipakai
// endpoint yang di-paginate backend-nya (lihat PaginationMetaDto di BE).
export async function apiFetchPaginated<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; meta: PaginationMeta }> {
  const { body } = await requestApi<T>(path, init)
  return { data: body.data as T, meta: body.meta }
}

//<---------- requestApi ------------>
async function requestApi<T>(
  path: string,
  init?: RequestInit,
  options: ApiRequestOptions = {},
): Promise<{ body: ApiPaginatedEnvelope<T> }> {
  let response: Response
  try {
    const token = await getValidAccessToken()
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError('Tidak bisa terhubung ke server', 0)
  }

  if (response.status === 401 && !options.retryAfterRefresh && getAccessToken()) {
    const refreshedToken = await refreshAccessToken()
    if (refreshedToken) return requestApi<T>(path, init, { retryAfterRefresh: true })
  }

  let body: ApiPaginatedEnvelope<T> | ApiErrorEnvelope
  try {
    body = await response.json()
  } catch {
    throw new ApiError('Respons server tidak valid', response.status)
  }

  if (!response.ok || !body.success) {
    const errorBody = body as ApiErrorEnvelope
    throw new ApiError(errorBody.message, errorBody.statusCode ?? response.status, errorBody.path)
  }

  return { body: body as ApiPaginatedEnvelope<T> }
}

//<---------- uploadFileToPresignedUrl -------------->
// Dipisah dari apiFetch: target-nya bucket R2/S3 (origin beda dari API),
// respons sukses body-nya kosong (bukan JSON), dan butuh progress upload
// beneran — fetch() nggak reliable buat expose upload progress lintas
// browser, jadi pakai XMLHttpRequest yang punya xhr.upload.onprogress.
export function uploadFileToPresignedUrl(
  uploadUrl: string,
  file: Blob,
  contentType: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', contentType)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100)
        resolve()
      } else {
        reject(new ApiError('Upload ke storage gagal', xhr.status))
      }
    }

    xhr.onerror = () => reject(new ApiError('Upload ke storage gagal, cek koneksi', 0))

    xhr.send(file)
  })
}
