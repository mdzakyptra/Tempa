import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react'
import { ApiError, apiFetch } from '../lib/api'
import { storeTokens, type TokenPair } from '../lib/auth'


type AuthMode = 'login' | 'register'

interface AuthProfile {
  id: string
  nama: string
  email: string
  peran: 'warga' | 'petugas'
  kawasan_tugas: string | null
}

interface AuthResponse extends TokenPair {
  profile: AuthProfile
}

interface AuthFormValues {
  nama: string
  email: string
  password: string
}

const INITIAL_FORM: AuthFormValues = { nama: '', email: '', password: '' }

//<---------- getRedirectPath ------------>
function getRedirectPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/auth')) return null
  return value
}

//<---------- getErrorMessage ------------>
function getErrorMessage(error: unknown, mode: AuthMode) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) return 'Email atau kata sandi tidak sesuai.'
    if (error.statusCode === 409) return 'Email ini sudah terdaftar. Silakan masuk.'
    if (error.statusCode === 0) return 'Server tidak dapat dihubungi. Coba lagi sebentar lagi.'
  }

  return mode === 'login' ? 'Gagal masuk. Periksa data Anda lalu coba lagi.' : 'Pendaftaran gagal. Coba lagi sebentar lagi.'
}

//<---------- Auth ------------>
export default function Auth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState<AuthMode>('login')
  const [form, setForm] = useState<AuthFormValues>(INITIAL_FORM)

  const authMutation = useMutation({
    mutationFn: (values: AuthFormValues) => {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const body = mode === 'login' ? { email: values.email, password: values.password } : values
      return apiFetch<AuthResponse>(path, { method: 'POST', body: JSON.stringify(body) })
    },
    onSuccess: (response) => {
      storeTokens(response)
      const redirectPath = getRedirectPath(searchParams.get('redirect'))
      navigate(redirectPath ?? (response.profile.peran === 'petugas' ? '/panel-petugas' : '/'))
    },
  })

  const errorMessage = authMutation.isError ? getErrorMessage(authMutation.error, mode) : null

  //<---------- handleModeChange ------------>
  function handleModeChange(nextMode: AuthMode) {
    setMode(nextMode)
    setForm(INITIAL_FORM)
    authMutation.reset()
  }

  //<---------- handleSubmit ------------>
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    authMutation.mutate({
      ...form,
      nama: form.nama.trim(),
      email: form.email.trim().toLowerCase(),
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-neutral-50 px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
          {mode === 'login' ? <LockKeyhole className="size-5" aria-hidden /> : <UserRound className="size-5" aria-hidden />}
        </div>
        <h1 className="mt-5 text-2xl font-bold text-neutral-900">
          {mode === 'login' ? 'Masuk ke Antrean Kota' : 'Buat akun warga'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {mode === 'login'
            ? 'Masuk untuk mendukung laporan dan melacak aktivitas Anda.'
            : 'Daftar untuk mendukung laporan serta mengikuti pembaruan antrean.'}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === 'login' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === 'register' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Daftar
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label htmlFor="nama" className="text-sm font-medium text-neutral-800">
                Nama lengkap
              </label>
              <input
                id="nama"
                value={form.nama}
                onChange={(event) => setForm((current) => ({ ...current, nama: event.target.value }))}
                minLength={2}
                required
                autoComplete="name"
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-100"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-neutral-800">
              Kata sandi
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              minLength={8}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-100"
            />
            {mode === 'register' && <p className="mt-1.5 text-xs text-neutral-500">Minimal 8 karakter.</p>}
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={authMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {authMutation.isPending ? 'Memproses…' : mode === 'login' ? 'Masuk' : 'Buat akun dan masuk'}
            {!authMutation.isPending && <ArrowRight className="size-4" aria-hidden />}
          </button>
        </form>
      </section>
    </div>
  )
}
