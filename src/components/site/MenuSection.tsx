"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { MENU, formatPrice, type MenuCategory } from "@/lib/menu-data";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site-data";

const TAG_STYLES: Record<string, string> = {
  populaire: "bg-caramel/12 text-caramel",
  signature: "bg-espresso/10 text-espresso",
  nouveau: "bg-leaf/12 text-leaf",
};

export default function MenuSection() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<MenuCategory>(MENU[0]);
  const [pending, setPending] = useState<string | null>(null);

  /* Changement d'onglet : sortie → swap → entrée */
  const switchCategory = (cat: MenuCategory) => {
    if (cat.id === active.id) return;
    setPending(cat.id);
    const grid = gridRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !grid) {
      setActive(cat);
      setPending(null);
      return;
    }

    gsap.to(grid, {
      y: 26,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        setActive(cat);
        requestAnimationFrame(() => {
          gsap.fromTo(
            grid,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
              onComplete: () => setPending(null),
            }
          );
          gsap.fromTo(
            grid.querySelectorAll(".menu-item"),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.045, ease: "power3.out" }
          );
        });
      },
    });
  };

  /* Apparition de la section */
  useEffect(() => {
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const ctx = gsap.context(() => {
          gsap.fromTo(
            ".menu-header > *",
            { y: 44, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            }
          );
          gsap.fromTo(
            ".menu-tab",
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.05, ease: "power2.out", delay: 0.2 }
          );
          gsap.fromTo(
            ".menu-item",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease: "power3.out", delay: 0.35 }
          );
        }, root);
        ctx.revert(); // nettoie les tweens one-shot
      },
      { threshold: 0.15 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="menu"
      className="relative overflow-hidden bg-cream py-28 md:py-36"
    >
      {/* blobs */}
      <div className="absolute -left-36 bottom-24 h-96 w-96 blob-d bg-sand/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-28 top-16 h-80 w-80 blob-a bg-caramel/8 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="menu-header mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 inline-block rounded-full bg-sand px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso">
            Notre carte
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-espresso-deep sm:text-5xl md:text-6xl">
            Une carte généreuse,
            <span className="text-caramel"> faite maison</span>
          </h2>
          <p className="mt-5 font-body text-base leading-relaxed text-cocoa">
            De l'asie aux burgers gourmands, en passant par les viennoiseries
            du matin : il y en a pour toutes les envies, sur place ou à
            emporter.
          </p>
        </div>

        {/* Onglets */}
        <div
          role="tablist"
          aria-label="Catégories du menu"
          className="mb-12 flex flex-wrap justify-center gap-2.5"
        >
          {MENU.map((cat) => {
            const isActive = cat.id === active.id && !pending;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={cat.id === active.id}
                disabled={!!pending}
                onClick={() => switchCategory(cat)}
                className={`menu-tab rounded-full px-5 py-2.5 font-body text-sm font-semibold transition-all duration-300 disabled:opacity-60 ${
                  isActive
                    ? "bg-grad-espresso text-cream-soft shadow-lg shadow-espresso/25"
                    : "bg-cream-soft text-espresso hover:bg-sand"
                }`}
              >
                <span className="mr-1.5" aria-hidden="true">{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grille produits */}
        <div
          ref={gridRef}
          role="tabpanel"
          aria-label={`Plats — ${active.label}`}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {active.items.map((item) => (
            <article
              key={`${active.id}-${item.id}`}
              className="menu-item group relative flex items-stretch gap-4 overflow-hidden rounded-[1.8rem] border border-espresso/6 bg-cream-soft p-4 transition-all duration-400 hover:-translate-y-1 hover:border-caramel/30 hover:shadow-xl hover:shadow-caramel/12"
            >
              {item.image ? (
                <div className="mask-blob relative h-24 w-24 shrink-0 overflow-hidden sm:h-26 sm:w-26">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="104px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                  />
                </div>
              ) : (
                <div className="mask-blob flex h-24 w-24 shrink-0 items-center justify-center bg-grad-cream text-3xl sm:h-26 sm:w-26" aria-hidden="true">
                  {active.emoji}
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[17px] font-bold leading-snug text-espresso-deep">
                    {item.name}
                  </h3>
                  <span className="shrink-0 font-display text-lg font-bold text-caramel">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 font-body text-[13px] leading-relaxed text-mocha">
                  {item.description}
                </p>
                {item.tag && (
                  <span
                    className={`mt-2 w-fit rounded-full px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider ${TAG_STYLES[item.tag]}`}
                  >
                    {item.tag}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Note bas de carte */}
        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="max-w-md font-body text-sm text-mocha">
            Prix TTC, susceptibles d'évoluer selon les saisons et les arrivages
            — la carte complète est aussi disponible sur place.
          </p>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2.5 rounded-full bg-grad-espresso px-7 py-3.5 font-body text-sm font-semibold text-cream-soft shadow-lg shadow-espresso/25 transition-transform hover:scale-105"
          >
            <Phone size={15} aria-hidden="true" />
            Commander par téléphone — {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
