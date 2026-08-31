"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cake, Heart, Briefcase, Check, ArrowRight } from "lucide-react";
import { TRAITEUR_OFFRES, TRAITEUR_ENGAGEMENTS } from "@/lib/site-data";
import Magnetic from "./Magnetic";
import { scrollTo } from "./Navbar";

const ICONS = [Cake, Heart, Briefcase];

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
        { y: 50, opacity: 0 },
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
        { clipPath: "inset(22% 22% 22% 22% round 220px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 220px)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".tra-photo", start: "top 75%" },
        }
      );

      gsap.fromTo(
        ".tra-offer",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tra-grid", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".tra-pill",
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(2)",
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
      {/* blobs */}
      <div className="absolute -top-24 right-0 h-[30rem] w-[30rem] blob-c bg-caramel/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 -left-24 h-96 w-96 blob-a bg-espresso/60 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="tra-header mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <p className="mb-4 inline-block rounded-full border border-caramel-light/30 px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-caramel-light">
            Service traiteur
          </p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream-soft sm:text-5xl md:text-6xl">
            Vos événements,
            <br />
            <span className="text-caramel-light">notre passion</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-cream-soft/70">
            Anniversaires, mariages, séminaires, baptêmes… Nous prenons en
            charge votre buffet de A à Z pour des moments inoubliables.
          </p>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
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
            <div className="absolute -bottom-6 -right-3 rotate-3 rounded-[1.6rem] bg-grad-caramel px-6 py-4 shadow-xl shadow-black/30 md:-right-8">
              <p className="font-display text-xl font-bold text-espresso-deep">Devis gratuit</p>
              <p className="font-body text-xs font-medium text-espresso-deep/75">réponse sous 24h</p>
            </div>
          </div>

          {/* Offres */}
          <div className="tra-grid space-y-5">
            {TRAITEUR_OFFRES.map((offre, i) => {
              const Icon = ICONS[i];
              return (
                <article
                  key={offre.title}
                  className="tra-offer group flex items-start gap-5 rounded-[1.8rem] border border-cream-soft/10 bg-cream-soft/[0.06] p-6 backdrop-blur-sm transition-all duration-400 hover:border-caramel-light/40 hover:bg-cream-soft/10"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-grad-caramel text-espresso-deep shadow-md shadow-caramel/20 transition-transform duration-500 group-hover:rotate-12">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-cream-soft">
                      {offre.title}
                    </h3>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-cream-soft/65">
                      {offre.text}
                    </p>
                  </div>
                </article>
              );
            })}

            {/* Engagements */}
            <ul className="tra-pills flex flex-wrap gap-2.5 pt-2">
              {TRAITEUR_ENGAGEMENTS.map((e) => (
                <li
                  key={e}
                  className="tra-pill flex items-center gap-1.5 rounded-full bg-caramel/15 px-3.5 py-1.5 font-body text-xs font-medium text-caramel-light"
                >
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>

            <Magnetic className="pt-3">
              <button
                onClick={goDevis}
                data-cursor="Devis"
                className="group flex items-center gap-3 rounded-full bg-grad-caramel px-8 py-4 font-body text-base font-semibold text-espresso-deep shadow-2xl shadow-caramel/25 transition-shadow hover:shadow-caramel/40"
              >
                Demander un devis gratuit
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
