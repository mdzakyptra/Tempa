export interface Beat {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
}


export const MARKER = { lat: -6.2, lng: 106.8, label: "Jl. Melati, Jakarta Selatan" };

export const VOTE_OFFSETS: [number, number][] = [
  [0.9, 1.1],
  [-1.2, 0.6],
  [1.4, -0.5],
  [-0.7, -1.3],
  [0.3, 1.6],
  [-1.6, -0.4],
];

export const BEATS: Beat[] = [
  {
    id: "lapor",
    eyebrow: "01 — Lapor",
    title: "Satu laporan, satu titik di peta.",
    desc: "Warga foto kerusakan, tandai lokasinya persis — laporan langsung masuk antrean kota, bukan tumpukan keluhan tanpa arah.",
  },
  {
    id: "skor",
    eyebrow: "02 — Skor Prioritas",
    title: "Skornya kelihatan, bukan tebakan.",
    desc: "Bahaya, jumlah terdampak, lama menunggu, dan jalur vital dihitung terbuka lewat query — semua orang bisa lihat kenapa satu laporan didahulukan.",
  },
  {
    id: "dukungan",
    eyebrow: "03 — Dukungan Warga",
    title: "Dukungan warga lain, terhitung otomatis.",
    desc: "Laporan yang sama dirasakan banyak orang naik sendiri lewat trigger basis data — makin banyak dukungan, makin cepat dilihat petugas.",
  },
];

export const INTRO_END = 0.14;

// Hero's sticky pin releases at 0.8 (container 500vh, sticky item 100vh tall).
// Beats must finish inside [INTRO_END, BEATS_END] so the last beat isn't
// still fading in once Hero starts unpinning and scrolling away.
export const BEATS_END = 0.8;

// Relative scroll weight per beat — the last beat gets extra room so
// readers have time to finish it before WorkStack overlays on top of Hero.
const BEAT_WEIGHTS = [1, 1, 1.8];

//<---------- beatRange -------------->
export function beatRange(i: number): [number, number] {
  const totalWeight = BEAT_WEIGHTS.reduce((sum, w) => sum + w, 0);
  const unit = (BEATS_END - INTRO_END) / totalWeight;
  const startWeight = BEAT_WEIGHTS.slice(0, i).reduce((sum, w) => sum + w, 0);
  return [
    INTRO_END + startWeight * unit,
    INTRO_END + (startWeight + BEAT_WEIGHTS[i]) * unit,
  ];
}

//<---------- beatLocalProgress -------------->
export function beatLocalProgress(progress: number, i: number): number {
  const [start, end] = beatRange(i);
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}
