import Marquee from "../animations/Marquee";
import ScrollVelocity from "../animations/ScrollVelocity";

const fitur = [
  "SKOR TRANSPARAN",
  "DETEKSI DUPLIKAT AI",
  "ASISTEN TANYA JAWAB",
  "REALTIME TANPA POLLING",
];

//<---------- LogoMarquee -------------->
export default function LogoMarquee() {
  return (
    <section id="fitur" className="relative border-y border-black/10 py-14">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
        Yang bikin beda
      </p>

      <Marquee speed={30} className="mb-10">
        {fitur.map((f) => (
          <span
            key={f}
            className="mx-10 text-2xl font-black tracking-tighter text-neutral-500 transition-colors hover:text-black md:text-3xl"
          >
            {f}
          </span>
        ))}
      </Marquee>

      <div className="text-5xl font-black uppercase tracking-tighter text-neutral-200 md:text-7xl">
        <ScrollVelocity
          text="SKOR TRANSPARAN · DETEKSI DUPLIKAT AI · ASISTEN TANYA JAWAB · "
          baseVelocity={3}
        />
      </div>
    </section>
  );
}
