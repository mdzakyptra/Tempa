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
  'rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-neutral-400 focus:outline-none'

//<---------- ReportFilter -------------->
export default function ReportFilter({ value, kawasanOptions, onChange }: ReportFilterProps) {
  const isActive = value.kawasan !== '' || value.jenis_kerusakan !== ''

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center">
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
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 sm:ml-auto"
        >
          Reset filter
        </button>
      )}
    </div>
  )
}
