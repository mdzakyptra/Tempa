import CountUp from "../animations/CountUp";
import ScrollReveal from "../animations/ScrollReveal";

const stats = [
  { to: 4, suffix: "", label: "Komponen skor" },
  { to: 2, suffix: "", label: "Fitur AI" },
  { to: 0, suffix: "", label: "Cronjob — real-time" },
  { to: 100, suffix: "%", label: "Transparan" },
];

//<---------- Stats -------------->
export default function Stats() {
  return (
    <section className="relative border-y border-black/10 px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.1} direction="up">
            <div className="text-center">
              <div className="text-5xl font-black tracking-tighter md:text-7xl">
                <CountUp to={s.to} suffix={s.suffix} duration={2.2} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
                {s.label}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
