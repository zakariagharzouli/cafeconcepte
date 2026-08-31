"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatPrice } from "@/lib/menu-data";
import { scrollTo } from "./Dock";

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

/* Galerie éditoriale — chaque plat est une planche de expo :
   grande image organique, numéral géant en contour, titre light,
   prix fin sur filet. Décalages verticaux asymétriques. */
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
        { y: 40, opacity: 0 },
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

        // parallaxe interne des images
        root.querySelectorAll<HTMLElement>(".sig-img img").forEach((img) => {
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
          ".sig-panel",
          { y: 50, opacity: 0 },
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
        <div className="sig-header mx-auto w-full max-w-7xl px-5 md:px-10 lg:pt-24">
          <p className="micro-caps mb-6 flex items-center gap-4 text-caramel-light/85">
            <span className="inline-block h-px w-10 bg-caramel-light/60" aria-hidden="true" />
            Nos créations signatures
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-light text-4xl leading-[1.06] text-cream-soft sm:text-5xl md:text-[2.7rem] xl:text-[3.1rem]">
              Les plats qui font
              <br />
              <span className="text-caramel-light">la réputation</span>
            </h2>
            <p className="hidden max-w-sm font-body text-[15px] font-light leading-[1.75] text-cream-soft/60 xl:block">
              Préparés à la commande, avec le sourire. Faites défiler —
              chaque assiette a son histoire.
            </p>
          </div>
        </div>

        {/* Piste desktop — planches éditoriales */}
        <div className="mt-6 hidden lg:block">
          <div ref={trackRef} className="flex w-max items-start gap-14 px-[6vw] will-change-transform xl:gap-16">
            {SIGNATURES.map((dish, i) => (
              <article
                key={dish.id}
                className={`sig-panel group relative w-[16.5rem] shrink-0 xl:w-[18.5rem] ${
                  i % 2 === 1 ? "mt-6" : ""
                }`}
              >
                {/* Image organique + numéral géant qui chevauche */}
                <div className="relative">
                  <div className="sig-img mask-blob relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={dish.image}
                      alt={`${dish.name} — Café Concept`}
                      fill
                      sizes="420px"
                      className="scale-110 object-cover will-change-transform"
                    />
                  </div>
                  <span
                    className="numeral-cream display-light absolute -bottom-7 -left-2 select-none text-[7rem] leading-none xl:text-[8rem]"
                    aria-hidden="true"
                  >
                    {dish.index}
                  </span>
                </div>

                {/* Légende typographique */}
                <div className="mt-8">
                  <p className="micro-caps text-caramel-light/75">{dish.tag}</p>
                  <h3 className="display-light mt-2 text-2xl text-cream-soft">
                    {dish.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 font-body text-[13.5px] font-light leading-[1.65] text-cream-soft/60">
                    {dish.desc}
                  </p>
                  <p className="display-light mt-3.5 border-t border-cream-soft/12 pt-3 text-xl text-caramel-light">
                    {formatPrice(dish.price)}
                  </p>
                </div>
              </article>
            ))}

            {/* Planche finale CTA */}
            <div className="flex w-[20rem] shrink-0 flex-col items-start justify-center self-center py-10">
              <p className="display-light text-4xl leading-[1.15] text-cream-soft">
                Et 70 autres
                <br />
                <span className="text-caramel-light">gourmandises…</span>
              </p>
              <button
                onClick={() => scrollTo("#menu")}
                className="frost-pill mt-9 px-8 py-4 font-body text-[15px] font-light text-cream-soft transition-colors duration-300 hover:border-caramel-light/50 hover:text-caramel-light"
              >
                Voir tout le menu
              </button>
            </div>
          </div>
        </div>

        {/* Piste mobile : scroll natif snap */}
        <div className="sig-mobile-track mt-10 lg:hidden">
          <div className="flex snap-x snap-mandatory gap-10 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SIGNATURES.map((dish) => (
              <article key={dish.id} className="sig-panel w-[76vw] max-w-[19rem] shrink-0 snap-center">
                <div className="relative">
                  <div className="mask-blob relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={dish.image}
                      alt={`${dish.name} — Café Concept`}
                      fill
                      sizes="76vw"
                      className="object-cover"
                    />
                  </div>
                  <span
                    className="numeral-cream display-light absolute -bottom-5 -left-1 select-none text-7xl leading-none"
                    aria-hidden="true"
                  >
                    {dish.index}
                  </span>
                </div>
                <div className="mt-9">
                  <p className="micro-caps text-caramel-light/75">{dish.tag}</p>
                  <h3 className="display-light mt-2 text-2xl text-cream-soft">{dish.name}</h3>
                  <p className="mt-2 font-body text-[13.5px] font-light leading-[1.7] text-cream-soft/60">
                    {dish.desc}
                  </p>
                  <p className="display-light mt-4 border-t border-cream-soft/12 pt-3 text-xl text-caramel-light">
                    {formatPrice(dish.price)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Filet de progression desktop */}
        <div className="mx-auto mt-6 hidden w-[5vw] lg:block">
          <div className="h-px overflow-hidden bg-cream-soft/15">
            <div className="sig-progress h-full w-full origin-left scale-x-0 bg-caramel-light" />
          </div>
        </div>
      </div>
    </section>
  );
}
