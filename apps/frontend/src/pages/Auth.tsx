import { lazy, Suspense, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ChevronLeft, LockKeyhole, UserRound } from 'lucide-react'
import { ApiError, apiFetch } from '../lib/api'
import { storeTokens, type TokenPair } from '../lib/auth'


const Dither = lazy(() => import('../components/Dither'))


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
type CurtainPhase = 'idle' | 'closing' | 'opening'
type CurtainDirection = 'rtl' | 'ltr'

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
  const [curtain, setCurtain] = useState<CurtainPhase>('idle')
  const [curtainDirection, setCurtainDirection] = useState<CurtainDirection>('rtl')
  const [pendingMode, setPendingMode] = useState<AuthMode | null>(null)

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
    if (nextMode === mode || curtain !== 'idle') return
    setCurtainDirection(nextMode === 'register' ? 'rtl' : 'ltr')
    setPendingMode(nextMode)
    setCurtain('closing')
  }

  //<---------- handleCurtainAnimationComplete ------------>
  function handleCurtainAnimationComplete() {
    if (curtain === 'closing' && pendingMode) {
      setMode(pendingMode)
      setForm(INITIAL_FORM)
      authMutation.reset()
      setPendingMode(null)
      setCurtain('opening')
    } else if (curtain === 'opening') {
      setCurtain('idle')
    }
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
    <div className="min-h-screen bg-neutral-50">
      {curtain !== 'idle' && (
        <motion.div
          initial={{ x: curtain === 'closing' ? (curtainDirection === 'rtl' ? '100%' : '-100%') : '0%' }}
          animate={{ x: curtain === 'closing' ? '0%' : curtainDirection === 'rtl' ? '-100%' : '100%' }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={handleCurtainAnimationComplete}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: curtain === 'closing' ? 1 : 0, scale: curtain === 'closing' ? 1 : 0.94 }}
            transition={{ duration: 0.3, delay: curtain === 'closing' ? 0.15 : 0 }}
            className="text-lg font-black tracking-tighter text-white"
          >
            Aspiraku
          </motion.p>
        </motion.div>
      )}

      <section className="grid min-h-screen w-full bg-white md:grid-cols-2">
        <div className={`relative flex flex-col justify-center p-6 sm:p-10 lg:p-16 ${mode === 'login' ? 'md:order-1' : 'md:order-2'}`}>
        <Link
          to="/antrean"
          aria-label="Kembali ke antrean"
          className="absolute top-6 left-6 flex items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:top-8 sm:left-8"
        >
          <ChevronLeft className="size-5" aria-hidden />
          Kembali
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
          {mode === 'login' ? <LockKeyhole className="size-5" aria-hidden /> : <UserRound className="size-5" aria-hidden />}
          </div>
          <h1 className="mt-5 text-2xl font-bold text-neutral-900">
            {mode === 'login' ? 'Masuk ke Aspiraku' : 'Buat akun warga'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {mode === 'login'
              ? 'Masuk untuk mendukung laporan dan melacak aktivitas Anda.'
              : 'Daftar untuk mendukung laporan serta mengikuti pembaruan antrean.'}
          </p>

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

          <p className="mt-6 text-center text-sm text-neutral-600 md:hidden">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button
              type="button"
              disabled={curtain !== 'idle'}
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-neutral-900 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mode === 'login' ? 'Daftar' : 'Masuk'}
            </button>
          </p>
        </div>
        </div>

        <aside
          className={`relative hidden overflow-hidden bg-neutral-950 md:block ${mode === 'login' ? 'md:order-2' : 'md:order-1'}`}
          aria-label="Visualisasi dither Aspiraku"
        >
          <Suspense fallback={<div className="h-full w-full bg-neutral-950" />}>
            <Dither
              waveColor={[0.38, 0.55, 0.45]}
              backgroundColor={[0.02, 0.03, 0.02]}
              colorNum={4}
              pixelSize={3}
              waveAmplitude={0.3}
              waveFrequency={3}
              waveSpeed={0.05}
              mouseRadius={0.3}
            />
          </Suspense>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-10">
            <p className="pointer-events-none text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">Aspiraku</p>
            <p className="pointer-events-none mt-3 max-w-sm text-2xl font-semibold tracking-tight text-white">Suara warga, gerak kota.</p>
            <p className="pointer-events-none mt-2 max-w-sm text-sm leading-relaxed text-white/70">Pantau laporan lingkungan dan dukung perubahan yang terlihat.</p>

            <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-white/80">
                {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
              </p>
              <button
                type="button"
                disabled={curtain !== 'idle'}
                onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mode === 'login' ? 'Daftar' : 'Masuk'}
              </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
