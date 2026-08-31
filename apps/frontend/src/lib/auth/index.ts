import { API_BASE_URL } from '../api'


const REFRESH_TOKEN_STORAGE_KEY = 'antrean-kota.refresh-token'
const USER_SNAPSHOT_STORAGE_KEY = 'antrean-kota.user-snapshot'

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
  clearUserSnapshot()
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

//<---------- cacheUserSnapshot ------------>
// Dipanggil dari 2 tempat: getCurrentUser (di bawah) abis decode token, DAN
// Auth.tsx langsung pas login/register sukses — jangan nunggu getCurrentUser
// nulis belakangan, soalnya kalau halaman abis login langsung redirect ke
// route yang mount query 'current-user' baru (mis. PanelPetugas.tsx), route
// itu bisa keburu baca snapshot yang MASIH KOSONG (initialData null) dan
// mantul balik ke /auth sebelum getCurrentUser sempat nulis snapshotnya —
// nulis di titik login sukses ngilangin celah race itu.
export function cacheUserSnapshot(user: DecodedUser) {
  sessionStorage.setItem(USER_SNAPSHOT_STORAGE_KEY, JSON.stringify(user))
}

//<---------- clearUserSnapshot ------------>
function clearUserSnapshot() {
  sessionStorage.removeItem(USER_SNAPSHOT_STORAGE_KEY)
}

//<---------- getCurrentUser ------------>
// JEK-44 — belum ada endpoint /auth/me di backend, tapi JWT payload udah
// bawa email+peran sendiri, jadi cukup ambil access token yang valid
// (nyoba refresh dulu kalau kosong di memori — getValidAccessToken sudah
// nangani itu) lalu decode. Hasilnya disimpan lagi ke snapshot (lihat
// getCachedUserSnapshot) supaya render berikutnya (termasuk abis refresh
// halaman) nggak perlu nunggu round-trip /auth/refresh buat tau siapa yang
// login.
export async function getCurrentUser(): Promise<DecodedUser | null> {
  const token = await getValidAccessToken()
  const user = token ? decodeJwtPayload(token) : null
  if (user) cacheUserSnapshot(user)
  else clearUserSnapshot()
  return user
}

//<---------- getCachedUserSnapshot ------------>
// Dibaca SINKRON (bukan lewat fetch/decode token) — dipakai sebagai
// `initialData` query 'current-user' di Layout.tsx & PanelPetugas.tsx, biar
// UI (link Panel Petugas di sidebar, gate halamannya) langsung kebaca benar
// dari render pertama pas refresh, bukan nunggu network dulu (itu penyebab
// nav sempet "blink": ilang sebentar baru muncul). Cuma email+peran, bukan
// kredensial — nilai aslinya tetep divalidasi ulang backend tiap request,
// snapshot ini murni buat gating UI (sama kayak isPetugasPanelAllowed).
export function getCachedUserSnapshot(): DecodedUser | null {
  const raw = sessionStorage.getItem(USER_SNAPSHOT_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as DecodedUser
  } catch {
    return null
  }
}

// Dipisah koma, sama persis isinya kayak PETUGAS_PANEL_EMAILS di
// apps/backend/.env — lihat komentar VITE_PETUGAS_PANEL_EMAILS di
// apps/frontend/.env kenapa ini BUKAN boundary keamanan asli, cuma gate UI.
const PETUGAS_PANEL_EMAILS = (import.meta.env.VITE_PETUGAS_PANEL_EMAILS ?? '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean)

//<---------- isPetugasPanelAllowed ------------>
// Satu sumber kebenaran dipake PanelPetugas.tsx (gate isi halaman) DAN
// Layout.tsx (sembunyiin link nav) — biar warga/guest gak lihat link ke
// halaman yang bakal nolak mereka.
export function isPetugasPanelAllowed(user: DecodedUser | null | undefined) {
  return !!user && user.peran === 'petugas' && PETUGAS_PANEL_EMAILS.includes(user.email.toLowerCase())
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
