"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ArrowRight } from "lucide-react";
import { TRAITEUR_OFFRES, TRAITEUR_ENGAGEMENTS } from "@/lib/site-data";
import { scrollTo } from "./Dock";

/* Chapitre traiteur — dark premium éditorial :
   offres en liste numérotée sur filets, CTA frosted.
   Plus de boîtes translucides à carrés d'icônes. */
export default function Traiteur() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.fromTo(
        ".tra-header > *",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tra-header", start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".tra-photo",
        { clipPath: "inset(20% 20% 20% 20% round 220px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 220px)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".tra-photo", start: "top 75%" },
        }
      );

      gsap.fromTo(
        ".tra-offer",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tra-list", start: "top 82%" },
        }
      );

      gsap.fromTo(
        ".tra-pill",
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: ".tra-pills", start: "top 88%" },
        }
      );

      gsap.to(".tra-photo img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".tra-photo",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const goDevis = () => {
    window.dispatchEvent(
      new CustomEvent("cc:subject", { detail: "Traiteur — Demande de devis" })
    );
    scrollTo("#contact");
  };

  return (
    <section
      ref={rootRef}
      id="traiteur"
      className="relative overflow-hidden bg-grad-espresso py-28 md:py-36"
    >
      <div
        className="absolute -top-24 right-0 h-[28rem] w-[28rem] blob-c bg-caramel/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="tra-header mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <p className="micro-caps mb-6 text-caramel-light/85">Service traiteur</p>
          <h2 className="display-light text-4xl leading-[1.08] text-cream-soft sm:text-5xl md:text-[3.4rem]">
            Vos événements,
            <br />
            <span className="text-caramel-light">notre passion</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-[15px] font-light leading-[1.75] text-cream-soft/65">
            Anniversaires, mariages, séminaires, baptêmes… Nous prenons en
            charge votre buffet de A à Z pour des moments inoubliables.
          </p>
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-24">
          {/* Photo buffet */}
          <div className="relative">
            <div className="tra-photo mask-blob relative aspect-[4/3] overflow-hidden shadow-2xl shadow-black/40">
              <Image
                src="/food/traiteur-buffet.png"
                alt="Buffet traiteur du Café Concept pour un événement"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="scale-110 object-cover will-change-transform"
              />
            </div>
            <div className="frost-pill absolute -bottom-5 right-2 rotate-2 px-6 py-3.5 md:-right-6">
              <p className="display-light text-xl text-cream-soft">Devis gratuit</p>
              <p className="mt-0.5 font-body text-[11px] font-light tracking-[0.14em] text-cream-soft/60">
                réponse sous 24h
              </p>
            </div>
          </div>

          {/* Liste éditoriale des offres */}
          <div>
            <ol className="tra-list">
              {TRAITEUR_OFFRES.map((offre, i) => (
                <li
                  key={offre.title}
                  className="tra-offer group border-t border-cream-soft/12 py-7 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start gap-7 md:gap-9">
                    <span
                      className="numeral-cream display-light select-none pt-0.5 text-4xl md:text-5xl"
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[22px] font-normal leading-snug text-cream-soft transition-colors duration-300 group-hover:text-caramel-light md:text-2xl">
                        {offre.title}
                      </h3>
                      <p className="mt-2 max-w-md font-body text-[15px] font-light leading-[1.75] text-cream-soft/60">
                        {offre.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Engagements — chips cerclées fines */}
            <ul className="tra-pills mt-8 flex flex-wrap gap-2.5">
              {TRAITEUR_ENGAGEMENTS.map((e) => (
                <li
                  key={e}
                  className="tra-pill flex items-center gap-1.5 rounded-full border border-cream-soft/15 px-3.5 py-1.5 font-body text-[11px] font-light tracking-[0.08em] text-cream-soft/70"
                >
                  <Check size={12} strokeWidth={2.4} className="text-caramel-light" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>

            <button
              onClick={goDevis}
              className="frost-pill group mt-9 flex items-center gap-3 px-8 py-4 font-body text-[15px] font-light text-cream-soft transition-colors duration-300 hover:border-caramel-light/60 hover:text-caramel-light"
            >
              Demander un devis gratuit
              <ArrowRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
