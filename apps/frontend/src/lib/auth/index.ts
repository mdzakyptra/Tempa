import { API_BASE_URL } from '../api'


const REFRESH_TOKEN_STORAGE_KEY = 'antrean-kota.refresh-token'

let accessToken: string | null = null
let refreshRequest: Promise<string | null> | null = null

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

interface AuthEnvelope<T> {
  success: boolean
  data?: T
}

//<---------- storeTokens ------------>
export function storeTokens(tokens: TokenPair) {
  accessToken = tokens.accessToken
  sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
}

//<---------- getAccessToken ------------>
export function getAccessToken() {
  return accessToken
}

//<---------- hasStoredSession ------------>
export function hasStoredSession() {
  return accessToken !== null || sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) !== null
}

//<---------- clearTokens ------------>
export function clearTokens() {
  accessToken = null
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

//<---------- redirectToLogin ------------>
function redirectToLogin() {
  if (window.location.pathname !== '/auth') window.location.assign('/auth')
}

//<---------- refreshAccessToken ------------>
export async function refreshAccessToken(redirectOnFailure = true): Promise<string | null> {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
  if (!refreshToken) return null

  if (!refreshRequest) {
    refreshRequest = requestTokenRefresh(refreshToken)
      .catch(() => {
        clearTokens()
        if (redirectOnFailure) redirectToLogin()
        return null
      })
      .finally(() => {
        refreshRequest = null
      })
  }

  return refreshRequest
}

//<---------- getValidAccessToken ------------>
export async function getValidAccessToken() {
  return accessToken ?? refreshAccessToken()
}

// Mirror apps/backend/src/auth/interfaces/jwt-payload.interface.ts
export interface DecodedUser {
  sub: string
  email: string
  peran: 'warga' | 'petugas'
}

//<---------- decodeJwtPayload ------------>
// Baca payload JWT tanpa verifikasi signature — cukup buat gating UI
// (tau siapa yang login), BUKAN buat keputusan keamanan (itu tugas
// backend, yang beneran verifikasi signature-nya lewat JwtAuthGuard).
function decodeJwtPayload(token: string): DecodedUser | null {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as DecodedUser
  } catch {
    return null
  }
}

//<---------- getCurrentUser ------------>
// JEK-44 — belum ada endpoint /auth/me di backend, tapi JWT payload udah
// bawa email+peran sendiri, jadi cukup ambil access token yang valid
// (nyoba refresh dulu kalau kosong di memori — getValidAccessToken sudah
// nangani itu) lalu decode.
export async function getCurrentUser(): Promise<DecodedUser | null> {
  const token = await getValidAccessToken()
  return token ? decodeJwtPayload(token) : null
}

//<---------- logout ------------>
export async function logout() {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)

  try {
    if (refreshToken) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
    }
  } finally {
    clearTokens()
  }
}

//<---------- requestTokenRefresh ------------>
async function requestTokenRefresh(refreshToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) throw new Error('Gagal memperbarui sesi')

  const body = (await response.json()) as AuthEnvelope<TokenPair>
  if (!body.success || !body.data?.accessToken || !body.data.refreshToken) {
    throw new Error('Respons pembaruan sesi tidak valid')
  }

  storeTokens(body.data)
  return body.data.accessToken
}
