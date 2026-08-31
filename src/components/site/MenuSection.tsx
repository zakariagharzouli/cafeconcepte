"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { MENU, formatPrice, type MenuCategory } from "@/lib/menu-data";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site-data";

/* La carte comme un vrai menu de restaurant :
   liste typographique (nom + prix alignés, description fine),
   filets hairline entre les lignes, onglets texte soulignés.
   Fini la grille de cards blanches — c'était ça, le générique. */
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
      y: 22,
      opacity: 0,
      duration: 0.26,
      ease: "power2.in",
      onComplete: () => {
        setActive(cat);
        requestAnimationFrame(() => {
          gsap.fromTo(
            grid,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              onComplete: () => setPending(null),
            }
          );
          gsap.fromTo(
            grid.querySelectorAll(".menu-row"),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power3.out" }
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
            { y: 36, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out" }
          );
          gsap.fromTo(
            ".menu-tab",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.2 }
          );
          gsap.fromTo(
            ".menu-row",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "power3.out", delay: 0.35 }
          );
        }, root);
        ctx.revert();
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
      <div
        className="absolute -right-28 top-16 h-80 w-80 blob-a bg-caramel/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="menu-header mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="micro-caps mb-6 text-caramel">Notre carte</p>
          <h2 className="display-light text-4xl leading-[1.08] text-espresso-deep sm:text-5xl md:text-[3.4rem]">
            Une carte généreuse,
            <br />
            <span className="text-caramel">faite maison</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-body text-[15px] font-light leading-[1.75] text-cocoa">
            De l&rsquo;asie aux burgers gourmands, en passant par les
            viennoiseries du matin : il y en a pour toutes les envies, sur
            place ou à emporter.
          </p>
        </div>

        {/* Onglets — texte + soulignement caramel animé */}
        <div
          role="tablist"
          aria-label="Catégories du menu"
          className="mb-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
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
                className={`menu-tab group relative py-1.5 font-body text-[15px] font-light tracking-[0.01em] transition-colors duration-300 disabled:opacity-50 ${
                  isActive ? "text-espresso-deep" : "text-espresso/45 hover:text-espresso"
                }`}
              >
                {cat.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-caramel transition-transform duration-400 ease-out ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Liste typographique */}
        <div
          ref={gridRef}
          role="tabpanel"
          aria-label={`Plats — ${active.label}`}
          className="mx-auto grid max-w-5xl gap-x-20 md:grid-cols-2"
        >
          {active.items.map((item) => (
            <article
              key={`${active.id}-${item.id}`}
              className="menu-row group border-b border-espresso/10 py-6 md:py-7"
            >
              <div className="flex items-start gap-5">
                {item.image && (
                  <div className="mask-blob relative mt-1 h-16 w-16 shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[17px] font-normal leading-snug text-espresso-deep transition-colors duration-300 group-hover:text-caramel">
                      {item.name}
                    </h3>
                    <span className="shrink-0 font-display text-lg font-light text-caramel">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="mt-1.5 font-body text-[13.5px] font-light leading-[1.7] text-mocha">
                    {item.description}
                  </p>
                  {item.tag && (
                    <p className="micro-caps mt-2.5 text-caramel/80">{item.tag}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Note bas de carte */}
        <div className="mt-14 flex flex-col items-center gap-6 text-center">
          <p className="max-w-md font-body text-[13.5px] font-light leading-relaxed text-mocha">
            Prix TTC, susceptibles d&rsquo;évoluer selon les saisons et les
            arrivages — la carte complète est aussi disponible sur place.
          </p>
          <a
            href={SITE.phoneHref}
            className="frost-pill--light inline-flex items-center gap-2.5 rounded-full border border-espresso/15 bg-cream-soft px-7 py-3.5 font-body text-sm font-light text-espresso-deep transition-colors duration-300 hover:border-caramel hover:text-caramel"
          >
            <Phone size={15} strokeWidth={1.8} aria-hidden="true" />
            Commander par téléphone — {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
