import { Truck, ShieldCheck, Sparkles, Package } from "lucide-react";

const USPS = [
  {
    icon: Truck,
    title: "Consegna 24/48h",
    desc: "Ordine prima delle 14? Spediamo in giornata. Tracking sempre incluso.",
    bg: "bg-candy-yellow",
  },
  {
    icon: ShieldCheck,
    title: "100% originali",
    desc: "Solo prodotti autentici importati direttamente dagli USA e dall'Asia.",
    bg: "bg-candy-mint",
  },
  {
    icon: Sparkles,
    title: "Drop ogni settimana",
    desc: "Nuovi arrivi tutti i venerdì. Iscriviti per essere il primo a saperlo.",
    bg: "bg-candy-blue",
  },
  {
    icon: Package,
    title: "Pack regalo curati",
    desc: "Mistery box e candy box selezionate a mano. Perfette per stupire.",
    bg: "bg-candy-orange",
  },
];

export function USPSection() {
  return (
    <section className="bg-ink text-white py-16 sm:py-20 border-y-2 border-ink relative overflow-hidden">
      {/* dots overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="text-center mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-candy-yellow">★ Why CandyShop ★</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-2 leading-none">
            Il <span className="text-candy-pink">candy store</span> <br className="sm:hidden" />
            che ti meriti.
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {USPS.map((u, i) => (
            <div
              key={i}
              className={`${u.bg} text-ink border-2 border-ink rounded-2xl p-5 sm:p-6 ${
                i % 2 === 0 ? "tilt-l" : "tilt-r"
              } shadow-brutal-lg hover-brutal`}
            >
              <u.icon className="size-7 sm:size-8 mb-3" strokeWidth={2.5} />
              <h3 className="font-display text-xl sm:text-2xl leading-tight mb-1">{u.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
