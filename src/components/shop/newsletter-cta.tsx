import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";

export function NewsletterCTA() {
  return (
    <section className="container mx-auto px-4 max-w-7xl py-16 sm:py-20">
      <div className="relative bg-candy-yellow border-2 border-ink rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden shadow-brutal-xl">
        {/* Decorazioni */}
        <div className="absolute top-6 right-6 hidden sm:block">
          <Sparkles className="size-12 fill-ink tilt-r" />
        </div>
        <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-candy-pink border-2 border-ink hidden sm:block" />
        <div className="absolute top-1/2 -right-12 size-32 rotate-45 bg-candy-blue border-2 border-ink hidden lg:block" />

        <div className="relative max-w-2xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink/70">★ Insider club</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mt-2 leading-none mb-3">
            10% di sconto al tuo <br />
            primo ordine.
          </h2>
          <p className="text-ink/80 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Iscriviti alla newsletter e ricevi <span className="font-bold">drop esclusivi</span>,
            offerte e accesso anticipato ai nuovi arrivi.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink/60 pointer-events-none" />
              <Input
                type="email"
                placeholder="tu@email.com"
                required
                className="pl-9 h-12 rounded-full border-2 border-ink bg-white text-base"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 bg-candy-pink text-white font-bold rounded-full border-2 border-ink shadow-brutal hover-brutal whitespace-nowrap"
            >
              ISCRIVITI →
            </button>
          </form>
          <p className="text-[11px] text-ink/60 mt-3 font-mono">
            Niente spam. Cancellati quando vuoi.
          </p>
        </div>
      </div>
    </section>
  );
}
