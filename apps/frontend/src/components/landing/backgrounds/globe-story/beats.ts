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
  {
    id: "asisten",
    eyebrow: "04 — Asisten AI",
    title: "Tanya kenapa, dapat jawaban asli.",
    desc: "Widget tanya jawab menjawab dari data skor yang sama persis dengan yang tampil di layar — bukan jawaban karangan model.",
  },
];

export const INTRO_END = 0.14;

//<---------- beatRange -------------->
export function beatRange(i: number): [number, number] {
  const span = (1 - INTRO_END) / BEATS.length;
  return [INTRO_END + i * span, INTRO_END + (i + 1) * span];
}

//<---------- beatLocalProgress -------------->
export function beatLocalProgress(progress: number, i: number): number {
  const [start, end] = beatRange(i);
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}
