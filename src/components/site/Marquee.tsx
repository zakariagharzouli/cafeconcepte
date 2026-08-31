"use client";

import { Coffee } from "lucide-react";

const ITEMS = [
  "Fait maison",
  "Saveurs asiatiques",
  "Burgers gourmands",
  "Salades fraîches",
  "Viennoiseries",
  "Service traiteur",
  "Café de spécialité",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <section aria-hidden="true" className="relative z-20 -my-8 rotate-[-1.6deg] scale-[1.03]">
      <div className="overflow-hidden border-y-4 border-espresso-deep bg-grad-caramel py-4 shadow-xl shadow-espresso/20">
        <div className="animate-marquee flex w-max items-center gap-8 pr-8 [--marquee-duration:26s]">
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="whitespace-nowrap font-display text-2xl font-bold uppercase tracking-wide text-espresso-deep md:text-3xl">
                {item}
              </span>
              <Coffee
                size={22}
                className="shrink-0 text-espresso-deep/70"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
