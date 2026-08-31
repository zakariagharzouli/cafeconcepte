"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ENGAGEMENTS } from "@/lib/site-data";

/* Composition éditoriale — plus de cards boxées à icônes :
   une grande photo organique + les engagements en liste numérotée
   séparée par filets hairline, comme les chapitres d'un ouvrage. */
export default function Engagements() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Titre en lignes qui montent
      gsap.fromTo(
        ".eng-title .line",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: { trigger: ".eng-title", start: "top 82%" },
        }
      );

      // Entrées de la liste éditoriale
      gsap.fromTo(
        ".eng-entry",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".eng-list", start: "top 82%" },
        }
      );

      // Image : révélation par clip-path organique
      gsap.fromTo(
        ".eng-photo",
        { clipPath: "inset(16% 16% 16% 16% round 200px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 200px)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".eng-photo", start: "top 78%" },
        }
      );

      // Parallaxe interne de la photo
      gsap.fromTo(
        ".eng-photo img",
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: ".eng-photo",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Photo latte flottante
      gsap.fromTo(
        ".eng-float",
        { scale: 0.7, rotate: -10, opacity: 0 },
        {
          scale: 1,
          rotate: -4,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".eng-photo", start: "top 55%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="engagements"
      className="relative overflow-hidden bg-cream-soft py-28 md:py-36"
    >
      {/* halo discret */}
      <div
        className="absolute -left-40 top-24 h-[24rem] w-[24rem] blob-b bg-sand/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Photo ambiance */}
          <div className="relative order-2 lg:order-1">
            <div className="eng-photo mask-blob relative aspect-[4/5] overflow-hidden shadow-2xl shadow-espresso/15">
              <Image
                src="/food/cafe-interior.png"
                alt="L'intérieur chaleureux du Café Concept à Moissy-Cramayel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover will-change-transform"
              />
            </div>

            {/* Photo latte flottante — décalage éditorial */}
            <div className="eng-float absolute -bottom-10 -right-2 w-36 md:-right-10 md:w-48">
              <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-cream-soft shadow-xl shadow-espresso/20">
                <Image
                  src="/food/latte.png"
                  alt="Latte avec latte art servi au Café Concept"
                  width={520}
                  height={520}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            {/* pastille maison — fine, cerclée */}
            <div className="absolute -top-5 -left-3 flex h-20 w-20 items-center justify-center rounded-full border border-espresso/15 bg-cream-soft text-center md:-left-6 md:h-24 md:w-24">
              <span className="micro-caps leading-[1.5] text-espresso">
                100%
                <br />
                maison
              </span>
            </div>
          </div>

          {/* Colonne texte */}
          <div className="order-1 lg:order-2">
            <p className="micro-caps mb-6 flex items-center gap-4 text-caramel">
              <span className="inline-block h-px w-10 bg-caramel/60" aria-hidden="true" />
              Nos engagements
            </p>

            <h2 className="eng-title display-light text-4xl leading-[1.08] text-espresso-deep sm:text-5xl md:text-[3.4rem]">
              <span className="block overflow-hidden pb-1">
                <span className="line block">Pourquoi le Café</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="line block">
                  Concept <span className="text-caramel">fait la différence</span>
                </span>
              </span>
            </h2>

            {/* Liste éditoriale numérotée — filets hairline */}
            <ol className="eng-list mt-12">
              {ENGAGEMENTS.map((eng, i) => (
                <li
                  key={eng.title}
                  className="eng-entry group border-t border-espresso/12 py-7 first:border-t-0 first:pt-0 md:py-8"
                >
                  <div className="flex items-start gap-6 md:gap-9">
                    <span
                      className="numeral-espresso display-light select-none pt-1 text-4xl md:text-5xl"
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[22px] font-normal leading-snug text-espresso-deep transition-colors duration-300 group-hover:text-caramel md:text-2xl">
                        {eng.title}
                      </h3>
                      <p className="mt-2 max-w-md font-body text-[15px] font-light leading-[1.75] text-cocoa">
                        {eng.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              <li className="eng-entry border-t border-espresso/12 pt-6">
                <p className="font-body text-sm font-light italic leading-relaxed text-mocha">
                  « Très bon café-resto de quartier. Les portions sont
                  généreuses et de qualité. » — Jonathan K., avis Google
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
