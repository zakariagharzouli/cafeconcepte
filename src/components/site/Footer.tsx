"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { scrollTo } from "./Navbar";

const LINKS = [
  { href: "#signatures", label: "Signatures" },
  { href: "#menu", label: "Menu" },
  { href: "#traiteur", label: "Traiteur" },
  { href: "#avis", label: "Avis" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".foot-logo",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 85%" },
        }
      );

      // grand mot "merci" qui glisse
      gsap.fromTo(
        ".foot-thanks",
        { xPercent: 12, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".foot-thanks", start: "top 95%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden bg-espresso-deep pb-10 pt-20 text-cream-soft"
    >
      <div className="absolute -top-28 left-1/2 h-72 w-[42rem] -translate-x-1/2 blob-b bg-caramel/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* Logo géant */}
        <div className="foot-logo flex justify-center">
          <img
            src="/brand/logo-cream.png"
            alt="Café Concept — Restaurant & Traiteur à Moissy-Cramayel"
            className="h-24 object-contain md:h-32"
          />
        </div>

        {/* Navigation */}
        <nav
          aria-label="Navigation pied de page"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="link-underline font-body text-sm font-medium text-cream-soft/75 transition-colors hover:text-caramel-light"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Infos */}
        <div className="mt-14 grid gap-8 border-t border-cream-soft/10 pt-10 text-sm md:grid-cols-3">
          <div className="flex items-start gap-3">
            <MapPin size={17} className="mt-0.5 shrink-0 text-caramel-light" aria-hidden="true" />
            <p className="font-body leading-relaxed text-cream-soft/65">
              {SITE.address}
              <br />
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-caramel-light hover:underline"
              >
                Itinéraire
              </a>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={17} className="mt-0.5 shrink-0 text-caramel-light" aria-hidden="true" />
            <p className="font-body leading-relaxed text-cream-soft/65">
              Lun – Ven : 8h30 – 20h
              <br />
              Samedi : 9h30 – 20h
              <br />
              Dimanche : fermé
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={17} className="mt-0.5 shrink-0 text-caramel-light" aria-hidden="true" />
            <p className="font-body leading-relaxed text-cream-soft/65">
              <a href={SITE.phoneHref} className="transition-colors hover:text-caramel-light">
                {SITE.phone}
              </a>
              <br />
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-caramel-light">
                <Mail size={13} aria-hidden="true" /> {SITE.email}
              </a>
            </p>
          </div>
        </div>

        {/* Grand merci */}
        <p
          aria-hidden="true"
          className="foot-thanks mt-16 select-none text-center font-display text-[16vw] font-bold leading-none tracking-tight text-cream-soft/[0.055] md:text-[9rem]"
        >
          à bientôt
        </p>

        {/* Bas de page */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-cream-soft/10 pt-7 font-body text-xs text-cream-soft/45 md:flex-row">
          <p>© {new Date().getFullYear()} Café Concept — Tous droits réservés</p>
          <p>Restaurant &amp; Traiteur · Moissy-Cramayel · Sénart</p>
        </div>
      </div>
    </footer>
  );
}
