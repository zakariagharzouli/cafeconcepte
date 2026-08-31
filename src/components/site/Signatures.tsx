"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flame } from "lucide-react";
import { formatPrice } from "@/lib/menu-data";
import { scrollTo } from "./Navbar";

const SIGNATURES = [
  {
    id: "bobun",
    index: "01",
    name: "Bo Bun poulet",
    desc: "Vermicelles de riz, poulet sauté, nems croustillants, cacahuètes, herbes fraîches.",
    price: 11.0,
    image: "/food/bo-bun.png",
    tag: "Le préféré des habitués",
  },
  {
    id: "smash",
    index: "02",
    name: "Smash Burger",
    desc: "Double steak smashé, cheddar fondant, sauce maison, frites fraîches maison.",
    price: 10.5,
    image: "/food/smash-burger.png",
    tag: "Best-seller",
  },
  {
    id: "loclac",
    index: "03",
    name: "Loclac bœuf",
    desc: "Bœuf caramélisé, riz sauté à la tomate, œuf au plat — l'incontournable cambodgien.",
    price: 13.1,
    image: "/food/loclac.png",
    tag: "Coup de cœur",
  },
  {
    id: "poke",
    index: "04",
    name: "Poke poulet",
    desc: "Riz assaisonné, avocat, mangue, edamame, sauce soja sucrée. Fraîcheur absolue.",
    price: 11.0,
    image: "/food/poke-bowl.png",
    tag: "Fraîcheur",
  },
  {
    id: "banhmi",
    index: "05",
    name: "Bánh Mì poulet",
    desc: "Sandwich vietnamien, poulet mariné, légumes pickles, coriandre fraîche.",
    price: 5.2,
    image: "/food/banh-mi.png",
    tag: "À emporter",
  },
];

export default function Signatures() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const track = trackRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Titre
      gsap.fromTo(
        ".sig-header > *",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%" },
        }
      );

      const mm = gsap.matchMedia();

      /* Desktop : section épinglée + défilement horizontal */
      mm.add("(min-width: 1024px)", () => {
        if (reduced) return;
        const getAmount = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${getAmount()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const bar = root.querySelector<HTMLElement>(".sig-progress");
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        // léger décalage parallaxe sur les images des cartes
        root.querySelectorAll<HTMLElement>(".sig-card-img img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        return () => tween.kill();
      });

      /* Mobile / tablette : apparition simple */
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".sig-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".sig-mobile-track", start: "top 80%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="signatures"
      className="relative overflow-hidden bg-grad-espresso lg:h-screen lg:overflow-hidden"
    >
      <div className="relative flex h-full flex-col justify-center py-24 lg:py-0">
        {/* En-tête */}
        <div className="sig-header mx-auto w-full max-w-7xl px-5 md:px-10 lg:pt-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-caramel-light/30 px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-caramel-light">
            <Flame size={13} aria-hidden="true" />
            Nos créations signatures
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-cream-soft sm:text-5xl md:text-7xl">
              Les plats qui font
              <br />
              <span className="text-caramel-light">la réputation</span>
            </h2>
            <p className="max-w-sm font-body text-sm leading-relaxed text-cream-soft/65 md:text-base">
              Préparés à la commande, avec le sourire. Faites défiler —
              chaque assiette a son histoire.
            </p>
          </div>
        </div>

        {/* Piste desktop */}
        <div className="mt-12 hidden lg:block">
          <div ref={trackRef} className="flex w-max items-stretch gap-8 px-[6vw] will-change-transform">
            {SIGNATURES.map((dish) => (
              <article
                key={dish.id}
                className="sig-card group relative flex w-[24rem] shrink-0 flex-col overflow-hidden rounded-[2.5rem] bg-cream-soft shadow-2xl shadow-black/30 transition-transform duration-500 hover:-translate-y-2 xl:w-[26rem]"
              >
                <div className="sig-card-img mask-blob relative m-4 mb-0 aspect-[5/4] overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={`${dish.name} — Café Concept`}
                    fill
                    sizes="420px"
                    className="scale-110 object-cover will-change-transform"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-cream-soft/90 px-3.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-wider text-espresso backdrop-blur">
                    {dish.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-5">
                  <span className="font-display text-5xl font-bold text-stroke-espresso absolute right-6 top-24 select-none opacity-60" aria-hidden="true">
                    {dish.index}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-espresso-deep">
                    {dish.name}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-cocoa">
                    {dish.desc}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-caramel">
                      {formatPrice(dish.price)}
                    </span>
                    <button
                      onClick={() => scrollTo("#menu")}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso text-cream-soft transition-all duration-300 group-hover:bg-caramel group-hover:text-espresso-deep group-hover:rotate-[-35deg]"
                      aria-label={`Voir ${dish.name} dans le menu`}
                    >
                      <ArrowRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Carte CTA finale */}
            <div className="flex w-[22rem] shrink-0 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-caramel-light/35 p-10 text-center">
              <p className="font-display text-3xl font-bold text-cream-soft">
                Et 70 autres
                <br />
                <span className="text-caramel-light">gourmandises…</span>
              </p>
              <button
                onClick={() => scrollTo("#menu")}
                className="mt-8 rounded-full bg-grad-caramel px-8 py-4 font-body font-semibold text-espresso-deep shadow-lg shadow-caramel/25 transition-transform hover:scale-105"
              >
                Voir tout le menu
              </button>
            </div>
          </div>
        </div>

        {/* Piste mobile : scroll natif snap */}
        <div className="sig-mobile-track mt-10 lg:hidden">
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SIGNATURES.map((dish) => (
              <article
                key={dish.id}
                className="sig-card w-[80vw] max-w-[20rem] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-cream-soft shadow-xl shadow-black/25"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={`${dish.name} — Café Concept`}
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-cream-soft/90 px-3.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-wider text-espresso">
                    {dish.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-espresso-deep">
                    {dish.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 font-body text-sm text-cocoa">
                    {dish.desc}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-caramel">
                      {formatPrice(dish.price)}
                    </span>
                    <button
                      onClick={() => scrollTo("#menu")}
                      className="rounded-full bg-espresso px-4 py-2 font-body text-xs font-semibold text-cream-soft"
                    >
                      Voir le menu
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Barre de progression desktop */}
        <div className="mx-auto mt-10 hidden w-[6vw] lg:block">
          <div className="h-1 overflow-hidden rounded-full bg-cream-soft/15">
            <div className="sig-progress h-full w-full origin-left scale-x-0 rounded-full bg-grad-caramel" />
          </div>
        </div>
      </div>
    </section>
  );
}
