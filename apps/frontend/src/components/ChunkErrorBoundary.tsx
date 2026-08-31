import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

//<---------- ChunkErrorBoundary ------------>
// Nangkep gagal fetch chunk lazy-load (koneksi putus pas pindah halaman) —
// tanpa ini React nge-crash blank pas dynamic import() gagal.
export default class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-neutral-50 p-6 text-center">
          <p className="text-sm text-neutral-600">Gagal memuat halaman. Coba muat ulang.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
          >
            Muat ulang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
