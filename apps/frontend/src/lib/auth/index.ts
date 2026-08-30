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
