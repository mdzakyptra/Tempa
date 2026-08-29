import { useEffect, useState } from "react";
import Particles from "../backgrounds/Particles";
import SplitText from "../animations/SplitText";
import MagneticButton from "../animations/MagneticButton";
import ScrollReveal from "../animations/ScrollReveal";
import TextScramble from "../animations/TextScramble";
import { apiFetch } from "../../../lib/api";

interface HealthResponse {
  status: string;
  database: string;
}

//<---------- CTA -------------->
export default function CTA() {
  const [status, setStatus] = useState<"loading" | "ok" | "down">("loading");
  const [message, setMessage] = useState("Menghubungkan ke backend…");

  useEffect(() => {
    apiFetch<HealthResponse>("/health")
      .then((d) => {
        setMessage(`Backend & database ${d.database === "up" ? "aktif" : "bermasalah"}`);
        setStatus(d.database === "up" ? "ok" : "down");
      })
      .catch(() => {
        setMessage("Backend tidak terhubung");
        setStatus("down");
      });
  }, []);

  return (
    <section
      id="kontak"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      <Particles count={260} className="opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative z-10 flex flex-col items-center">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            <TextScramble text="Antrean menunggumu" />
          </span>
        </ScrollReveal>

        <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl">
          <SplitText text="Laporan menumpuk?" />
          <br />
          <span className="text-stroke">
            <SplitText text="Bikin dia kelihatan" delay={0.2} />
          </span>
        </h2>

        <p className="mt-8 max-w-lg text-neutral-600">
          Sekali lapor, skornya langsung kelihatan. Warga lain bisa dukung,
          petugas bisa tindak lanjuti, kamu bisa pantau posisinya di antrean.
        </p>

        <MagneticButton
          href="/lapor-baru"
          strength={0.5}
          className="mt-10 rounded-full bg-black px-10 py-5 text-base font-semibold text-white"
        >
          Lapor Sekarang →
        </MagneticButton>

        {/* live backend status — keeps the fe <-> be link visible */}
        <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 font-mono text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "ok"
                ? "animate-pulse bg-black"
                : status === "down"
                  ? "bg-neutral-400"
                  : "animate-pulse bg-neutral-600"
            }`}
          />
          <span className="text-neutral-600">{message}</span>
        </div>
      </div>
    </section>
  );
}
