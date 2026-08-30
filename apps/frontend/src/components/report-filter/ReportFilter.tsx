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
  'rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium text-neutral-800 outline-none transition-colors focus:border-black/40'

//<---------- ReportFilter -------------->
export default function ReportFilter({ value, kawasanOptions, onChange }: ReportFilterProps) {
  const isActive = value.kawasan !== '' || value.jenis_kerusakan !== ''

  return (
    <div className="mb-8 flex flex-col gap-3 border-y border-black/10 py-5 sm:flex-row sm:items-center">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">Saring</span>

      <div className="flex flex-1 flex-wrap items-center gap-3">
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
            className="group relative ml-auto text-sm font-semibold text-neutral-500 transition-colors hover:text-black"
          >
            Reset filter
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
          </button>
        )}
      </div>
    </div>
  )
}
