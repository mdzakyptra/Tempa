import { Link } from 'react-router-dom'
import type { GeocodeResult } from '@/lib/geocode'


interface GlobeSearchPanelProps {
  query: string
  onQueryChange: (value: string) => void
  searching: boolean
  results: GeocodeResult[]
  onSelect: (result: GeocodeResult) => void
}

//<---------- GlobeSearchPanel -------------->
export function GlobeSearchPanel({ query, onQueryChange, searching, results, onSelect }: GlobeSearchPanelProps) {
  return (
    <div className="relative z-10 mb-4">
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Cari kawasan, mis. Menteng, Jakarta Pusat"
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
      />
      {searching && <p className="mt-2 text-xs text-neutral-500">Mencari…</p>}
      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-black/10 overflow-hidden rounded-lg border border-black/15 bg-white">
          {results.map((result) => (
            <li key={`${result.lat}-${result.lng}`}>
              <button
                type="button"
                onClick={() => onSelect(result)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
              >
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface MapPhaseControlsProps {
  /** Versi ringkas buat globe di dalam bingkai galeri — lihat GlobeMapTransition. */
  compact: boolean
  /** Kawasan yang lagi dibuka dari klik hotzone di dalam peta (bukan hasil dive). */
  openedKawasan: string | null
  /** Kawasan bawaan hasil dive, dipakai kalau belum ada zone yang dibuka. */
  kawasan?: string
  onCollapse: () => void
  onReset: () => void
}

//<---------- MapPhaseControls -------------->
// Di mode compact kontrol ini duduk DI LUAR kotak peta, di strip mat putih bawah
// bingkai. Kalau ditumpuk di atas peta, area itu jadi gak bisa diklik/di-zoom —
// paling kerasa di layar sentuh, di mana kontrolnya makan porsi besar peta.
export function MapPhaseControls({ compact, openedKawasan, kawasan, onCollapse, onReset }: MapPhaseControlsProps) {
  const activeKawasan = openedKawasan ?? kawasan

  return (
    <div
      className={
        compact
          ? 'absolute inset-x-0 top-full mt-1 flex flex-row-reverse items-center justify-between gap-2 text-[10px] leading-none text-[#102c45]'
          : 'mt-4 space-y-2 text-sm'
      }
    >
      <div
        className={
          compact
            ? 'flex min-w-0 items-center gap-2'
            : 'flex items-center justify-between rounded-lg border border-black/10 bg-neutral-50 px-3 py-2'
        }
      >
        <span className="flex min-w-0 items-center gap-2 font-medium">
          {openedKawasan && (
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Kembali ke semua kawasan"
              className="text-neutral-500 hover:text-neutral-900"
            >
              ←
            </button>
          )}
          <span className="truncate">{activeKawasan ?? 'Semua kawasan'}</span>
        </span>
        <Link
          to={activeKawasan ? `/antrean?kawasan=${encodeURIComponent(activeKawasan)}` : '/antrean'}
          className="whitespace-nowrap font-medium text-blue-600 hover:underline"
        >
          {compact ? 'Antrean →' : 'Lihat semua di Antrean →'}
        </Link>
      </div>
      <button
        type="button"
        onClick={onReset}
        className={
          compact
            ? 'whitespace-nowrap font-medium text-neutral-600 hover:text-neutral-900'
            : 'text-neutral-500 hover:text-neutral-900'
        }
      >
        {compact ? '← Globe' : '← Lihat globe lagi'}
      </button>
    </div>
  )
}
