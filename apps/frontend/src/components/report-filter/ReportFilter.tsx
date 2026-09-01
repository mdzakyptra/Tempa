import { JENIS_KERUSAKAN_LABEL, type ReportListItem } from '../report-card'

export interface ReportFilterValue {
  kawasan: string
  jenis_kerusakan: ReportListItem['jenis_kerusakan'] | ''
}

interface ReportFilterProps {
  value: ReportFilterValue
  kawasanOptions: string[]
  onChange: (value: ReportFilterValue) => void
}

const SELECT_CLASS =
  'min-w-0 flex-1 rounded-full border border-black/15 bg-white px-2.5 py-2 text-xs font-medium text-neutral-800 outline-none transition-colors focus:border-black/40 sm:px-4 sm:text-sm'

//<---------- ReportFilter -------------->
export default function ReportFilter({ value, kawasanOptions, onChange }: ReportFilterProps) {
  const isActive = value.kawasan !== '' || value.jenis_kerusakan !== ''

  return (
    <div className="mb-5 flex items-center gap-2 border-y border-black/10 py-3 sm:gap-3 sm:py-5">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-xs sm:tracking-[0.3em]">Saring</span>

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <select
          value={value.kawasan}
          onChange={(e) => onChange({ ...value, kawasan: e.target.value })}
          className={SELECT_CLASS}
        >
          <option value="">Semua kawasan</option>
          {kawasanOptions.map((kawasan) => (
            <option key={kawasan} value={kawasan}>
              {kawasan}
            </option>
          ))}
        </select>

        <select
          value={value.jenis_kerusakan}
          onChange={(e) => onChange({ ...value, jenis_kerusakan: e.target.value as ReportFilterValue['jenis_kerusakan'] })}
          className={SELECT_CLASS}
        >
          <option value="">Semua jenis kerusakan</option>
          {Object.entries(JENIS_KERUSAKAN_LABEL).map(([nilai, label]) => (
            <option key={nilai} value={nilai}>
              {label}
            </option>
          ))}
        </select>

        {isActive && (
          <button
            type="button"
            onClick={() => onChange({ kawasan: '', jenis_kerusakan: '' })}
            className="group relative shrink-0 text-xs font-semibold text-neutral-500 transition-colors hover:text-black sm:text-sm"
          >
            Reset
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
          </button>
        )}
      </div>
    </div>
  )
}
