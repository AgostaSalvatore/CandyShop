import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Instagram, Twitter } from "lucide-react";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-candy-cream mt-12 border-t-2 border-ink relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute -top-20 right-10 size-40 rounded-full bg-candy-pink/20 blur-3xl pointer-events-none" />

      {/* Mega logo */}
      <div className="border-b-2 border-candy-cream/10">
        <div className="container mx-auto px-4 max-w-7xl py-10 sm:py-14">
          <div className="font-display text-[clamp(3rem,12vw,9rem)] leading-[0.9] tracking-tighter">
            CANDY<span className="text-candy-pink">SHOP</span>.
          </div>
          <p className="font-mono text-xs sm:text-sm text-candy-cream/60 uppercase tracking-widest mt-2">
            ★ {t("common.tagline")} ★
          </p>
        </div>
      </div>

      {/* Colonne */}
      <div className="container mx-auto px-4 max-w-7xl py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-display text-lg text-candy-yellow mb-3">Shop</h3>
          <ul className="space-y-2 text-candy-cream/80">
            <li><Link href="/catalogo" className="hover:text-candy-pink transition-colors">Tutto il catalogo</Link></li>
            <li><Link href={{ pathname: "/catalogo", query: { sale: "1" } }} className="hover:text-candy-pink transition-colors">🔥 Offerte</Link></li>
            <li><Link href={{ pathname: "/catalogo", query: { new: "1" } }} className="hover:text-candy-pink transition-colors">✨ Novità</Link></li>
            <li><Link href={{ pathname: "/catalogo", query: { cat: "bevande-americane" } }} className="hover:text-candy-pink transition-colors">Bevande</Link></li>
            <li><Link href={{ pathname: "/catalogo", query: { cat: "cioccolato" } }} className="hover:text-candy-pink transition-colors">Cioccolato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-candy-yellow mb-3">Help</h3>
          <ul className="space-y-2 text-candy-cream/80">
            <li><a href="#" className="hover:text-candy-pink transition-colors">{t("footer.shipping")}</a></li>
            <li><a href="#" className="hover:text-candy-pink transition-colors">{t("footer.returns")}</a></li>
            <li><a href="#" className="hover:text-candy-pink transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-candy-pink transition-colors">{t("footer.contact")}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-candy-yellow mb-3">About</h3>
          <ul className="space-y-2 text-candy-cream/80">
            <li><a href="#" className="hover:text-candy-pink transition-colors">{t("footer.about")}</a></li>
            <li><a href="#" className="hover:text-candy-pink transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-candy-pink transition-colors">Lavora con noi</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-candy-yellow mb-3">Legal</h3>
          <ul className="space-y-2 text-candy-cream/80">
            <li><a href="#" className="hover:text-candy-pink transition-colors">{t("footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-candy-pink transition-colors">{t("footer.terms")}</a></li>
            <li><a href="#" className="hover:text-candy-pink transition-colors">Cookie</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-candy-cream/10 py-5 px-4">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="font-mono text-candy-cream/60 uppercase tracking-wider">
            {t("footer.copyright", { year })}
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="size-9 rounded-full border-2 border-candy-cream/20 grid place-items-center hover:bg-candy-pink hover:border-candy-pink transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="#"
              className="size-9 rounded-full border-2 border-candy-cream/20 grid place-items-center hover:bg-candy-pink hover:border-candy-pink transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="size-4" />
            </a>
            <span className="font-mono text-candy-cream/60 ml-2">EUR · IT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
