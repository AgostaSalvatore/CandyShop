import { Marquee } from "./marquee";

const BRANDS = [
  "REESE'S",
  "PRINGLES",
  "COCA-COLA",
  "MOUNTAIN DEW",
  "OREO",
  "HARIBO",
  "TROLLI",
  "WARHEADS",
  "SOUR PATCH",
  "NERDS",
  "PRIME",
  "CALYPSO",
  "ARIZONA",
  "HERSHEY'S",
  "LUCKY CHARMS",
  "FROOT LOOPS",
  "SNICKERS",
  "TWIX",
  "DR PEPPER",
  "FANTA",
];

export function BrandStrip() {
  return (
    <section className="bg-candy-pink text-white py-5 border-y-2 border-ink overflow-hidden">
      <Marquee
        speed="fast"
        items={BRANDS.map((b, i) => (
          <span
            key={i}
            className="font-display text-2xl sm:text-3xl tracking-tight whitespace-nowrap"
          >
            {b}
          </span>
        ))}
      />
    </section>
  );
}
