"use client";

const ITEMS = [
  "Fait maison",
  "Saveurs asiatiques",
  "Burgers gourmands",
  "Salades fraîches",
  "Viennoiseries",
  "Service traiteur",
  "Café de spécialité",
];

/* Bande typographique fine — filets hairline, texte light, points caramel.
   Plus de bandeau caramel massif incliné : le calme éditorial remplace
   l'accroche promo. */
export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <section aria-hidden="true" className="relative z-10 border-y border-espresso/10 bg-cream-soft py-5">
      <div className="animate-marquee flex w-max items-center gap-10 pr-10 [--marquee-duration:34s]">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="whitespace-nowrap font-body text-sm font-light uppercase tracking-[0.32em] text-espresso/70">
              {item}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-caramel/60" aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}
