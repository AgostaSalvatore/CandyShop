import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Star, Truck } from "lucide-react";

export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className="relative bg-candy-cream border-b-2 border-ink overflow-hidden bg-noise">
      {/* Decorazioni geometriche */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-[10%] size-32 rounded-full bg-candy-yellow border-2 border-ink animate-spin-slow opacity-90" />
        <div className="absolute bottom-16 left-[8%] size-20 rotate-45 bg-candy-blue border-2 border-ink opacity-80" />
        <div className="absolute top-1/2 left-1/2 size-48 rounded-full bg-candy-pink/20 blur-3xl" />
        <div className="absolute top-20 left-[40%] hidden lg:block">
          <span className="text-6xl tilt-l inline-block">✦</span>
        </div>
        <div className="absolute bottom-20 right-[30%] hidden lg:block">
          <span className="text-7xl tilt-r inline-block">✦</span>
        </div>
      </div>

      <div className="container relative mx-auto px-4 max-w-7xl py-12 sm:py-20 lg:py-24 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
        {/* Colonna sinistra: copy */}
        <div className="space-y-6 relative z-10 animate-pop">
          {/* Sticker NEW DROP */}
          <div className="inline-flex">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-candy-yellow text-ink border-2 border-ink rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-brutal tilt-l">
              <Star className="size-3.5 fill-ink" /> Drop di novembre · spedizione 24h
            </span>
          </div>

          {/* Headline gigantesco */}
          <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
            Snack <span className="bg-candy-pink text-white px-3 py-0.5 inline-block tilt-l border-2 border-ink">USA</span>{" "}
            <br />
            consegnati <br />
            a <span className="relative inline-block">
              <span className="relative z-10">casa tua.</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0,4 Q50,8 100,4 T200,4" stroke="var(--candy-yellow)" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-ink/80 max-w-lg leading-relaxed">
            Reese&apos;s, Mountain Dew, Prime, Pringles, Lucky Charms, Calypso, Sour Patch...
            <span className="font-bold"> oltre 500 prodotti</span> originali americani in un click.
          </p>

          {/* CTA brutalist */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2 bg-candy-pink text-white font-bold text-base sm:text-lg px-6 py-3.5 rounded-full border-2 border-ink shadow-brutal-lg hover-brutal"
            >
              SHOP NOW
              <span className="inline-flex items-center justify-center size-7 rounded-full bg-white text-ink transition-transform group-hover:rotate-45">
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <Link
              href={{ pathname: "/catalogo", query: { sale: "1" } }}
              className="inline-flex items-center gap-2 bg-candy-yellow text-ink font-bold text-base sm:text-lg px-6 py-3.5 rounded-full border-2 border-ink shadow-brutal hover-brutal"
            >
              🔥 OFFERTE
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-4 pt-4 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 font-mono">
              <Truck className="size-4 text-candy-pink" />
              CONSEGNA 24/48H
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono">
              <span className="size-2 rounded-full bg-candy-mint border border-ink" />
              PAGAMENTO SICURO
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono">
              <span className="text-candy-pink">★★★★★</span>
              4.9/5 SU 2.3K RECENSIONI
            </span>
          </div>
        </div>

        {/* Colonna destra: collage prodotti sticker */}
        <div className="relative hidden lg:block min-h-[460px]">
          {/* Card prodotto stilizzata 1 */}
          <div className="absolute top-0 left-8 w-56 bg-white border-2 border-ink rounded-3xl p-5 shadow-brutal-lg tilt-ll animate-bounce-slow" style={{ animationDelay: "0s" }}>
            <div className="aspect-square bg-candy-yellow rounded-2xl border-2 border-ink grid place-items-center text-7xl">🍫</div>
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-wider font-mono text-ink/60">Reese&apos;s</div>
              <div className="font-bold text-sm leading-tight">White Cups</div>
              <div className="font-display text-xl mt-1">€2.50</div>
            </div>
          </div>

          {/* Card prodotto 2 */}
          <div className="absolute top-12 right-0 w-52 bg-white border-2 border-ink rounded-3xl p-5 shadow-brutal-pink tilt-r animate-bounce-slow" style={{ animationDelay: "0.4s" }}>
            <div className="aspect-square bg-candy-blue rounded-2xl border-2 border-ink grid place-items-center text-7xl">🥤</div>
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-wider font-mono text-ink/60">Calypso</div>
              <div className="font-bold text-sm leading-tight">Ocean Blue</div>
              <div className="font-display text-xl mt-1">€3.99</div>
            </div>
          </div>

          {/* Card prodotto 3 */}
          <div className="absolute bottom-0 left-20 w-52 bg-white border-2 border-ink rounded-3xl p-5 shadow-brutal-yellow tilt-rr animate-bounce-slow" style={{ animationDelay: "0.8s" }}>
            <div className="aspect-square bg-candy-orange rounded-2xl border-2 border-ink grid place-items-center text-7xl">🍿</div>
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-wider font-mono text-ink/60">Pringles</div>
              <div className="font-bold text-sm leading-tight">Flame Chilli</div>
              <div className="font-display text-xl mt-1">€3.50</div>
            </div>
          </div>

          {/* Sticker -20% */}
          <div className="absolute top-32 left-1/2 z-10 -translate-x-1/2">
            <div className="size-24 rounded-full bg-candy-pink text-white border-2 border-ink grid place-items-center font-display text-2xl shadow-brutal animate-wiggle">
              -20%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
