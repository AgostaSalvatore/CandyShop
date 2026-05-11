type Props = {
  items: React.ReactNode[];
  className?: string;
  /** velocità: "fast" o "slow" (default) */
  speed?: "fast" | "slow";
};

export function Marquee({ items, className = "", speed = "slow" }: Props) {
  // Duplica gli items per il loop infinito
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex w-max gap-8 ${
          speed === "fast" ? "animate-marquee-fast" : "animate-marquee"
        }`}
      >
        {doubled.map((node, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            {node}
            <span className="text-2xl" aria-hidden>★</span>
          </div>
        ))}
      </div>
    </div>
  );
}
