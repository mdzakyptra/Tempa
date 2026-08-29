import { useEffect, useState } from "react";
import Particles from "../backgrounds/Particles";
import SplitText from "../animations/SplitText";
import MagneticButton from "../animations/MagneticButton";
import ScrollReveal from "../animations/ScrollReveal";
import TextScramble from "../animations/TextScramble";

//<---------- CTA -------------->
export default function CTA() {
  const [status, setStatus] = useState<"loading" | "ok" | "down">("loading");
  const [message, setMessage] = useState("Menghubungkan ke backend…");

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
    fetch(`${url}/api/hello`)
      .then((r) => r.json())
      .then((d) => {
        setMessage(d.message);
        setStatus("ok");
      })
      .catch(() => {
        setMessage("Backend (be) tidak terhubung");
        setStatus("down");
      });
  }, []);

  return (
    <section
      id="contact"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      <Particles count={260} className="opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative z-10 flex flex-col items-center">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            <TextScramble text="Ready when you are" />
          </span>
        </ScrollReveal>

        <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl">
          <SplitText text="Let's make" />
          <br />
          <span className="text-stroke">
            <SplitText text="something loud" delay={0.2} />
          </span>
        </h2>

        <p className="mt-8 max-w-lg text-neutral-600">
          In the quietest palette there is. Tell us about your project and
          we&apos;ll turn contrast into motion.
        </p>

        <MagneticButton
          href="mailto:hello@monolith.studio"
          strength={0.5}
          className="mt-10 rounded-full bg-black px-10 py-5 text-base font-semibold text-white"
        >
          Start a project →
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
