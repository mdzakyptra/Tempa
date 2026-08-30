import ScrollReveal from "../animations/ScrollReveal";
import GlobeMapTransition from "./GlobeMapTransition";

//<---------- MapReport -------------->
export default function MapReport() {
  return (
    <section id="lapor" className="relative overflow-hidden border-y border-black/10 px-6 py-24 md:py-32">
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
            Coba sendiri: cari kawasan atau klik satu titik di globe, lalu
            lihat peta jalannya langsung.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.1}>
          <GlobeMapTransition />
        </ScrollReveal>
      </div>
    </section>
  );
}
