import { Globe } from "../backgrounds/Globe";
import ScrollReveal from "../animations/ScrollReveal";

const markers = [
  { id: "jakarta", location: [-6.2088, 106.8456] as [number, number], label: "Jakarta" },
  { id: "bandung", location: [-6.9175, 107.6191] as [number, number], label: "Bandung" },
  { id: "surabaya", location: [-7.2575, 112.7521] as [number, number], label: "Surabaya" },
  { id: "yogyakarta", location: [-7.7956, 110.3695] as [number, number], label: "Yogyakarta" },
  { id: "makassar", location: [-5.1477, 119.4327] as [number, number], label: "Makassar" },
];

const arcs = [
  {
    id: "jakarta-bandung",
    from: [-6.2088, 106.8456] as [number, number],
    to: [-6.9175, 107.6191] as [number, number],
  },
  {
    id: "jakarta-surabaya",
    from: [-6.2088, 106.8456] as [number, number],
    to: [-7.2575, 112.7521] as [number, number],
  },
  {
    id: "surabaya-makassar",
    from: [-7.2575, 112.7521] as [number, number],
    to: [-5.1477, 119.4327] as [number, number],
  },
];


//<---------- MapReport -------------->
export default function MapReport() {
  return (
    <section className="relative overflow-hidden border-y border-black/10 px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <ScrollReveal direction="right">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">
            Peta & Koordinat
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Setiap laporan punya titik koordinat, bukan cuma kawasan.
          </h2>
          <p className="mt-6 max-w-md text-neutral-600">
            Warga menandai lokasi kerusakan langsung di peta saat melapor.
            Titik itu yang dipakai sistem untuk menghitung jalur vital —
            apakah dekat sekolah, rumah sakit, atau jalur utama kota — salah
            satu komponen skor prioritas yang menentukan urutan antrean
            perbaikan.
          </p>
          <p className="mt-4 max-w-md text-neutral-600">
            Filter berdasarkan kawasan di halaman Antrean juga bekerja dari
            data koordinat yang sama, jadi warga bisa langsung lihat laporan
            di sekitar mereka.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.1}>
          <Globe
            markers={markers}
            arcs={arcs}
            className="mx-auto w-full max-w-md"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
