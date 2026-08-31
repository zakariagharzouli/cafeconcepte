"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Intro vidéo scrubée au scroll — la frame est épinglée (sticky),
 * le défilement pilote video.currentTime image par image (encodage
 * all-intra : chaque frame est une keyframe, les seeks sont instantanés).
 * À la fin du scrub, on « arrive » naturellement au hero, dont le fond
 * est la dernière frame de la vidéo — continuité parfaite.
 *
 * Grammaire Sylva : filets hairline, micro-caps, typo Lexend light,
 * pas de cards, pas de curseur custom.
 */

/* Chapitres positionnés en secondes de la vidéo (durée 10 s) */
const CHAPTERS = [
  {
    eyebrow: "Café Concept — Moissy-Cramayel",
    line: "Chaque matin, tout commence ici.",
    at: 0.45,
    out: 2.0,
  },
  {
    eyebrow: "Café · Caramel · Épices",
    line: "Un tourbillon de saveurs.",
    at: 2.55,
    out: 4.6,
  },
  {
    eyebrow: "Asie — Burgers — Pâtisseries",
    line: "De la tasse au bol, tout est fait maison.",
    at: 5.2,
    out: 7.6,
  },
];

const END_CHIP_AT = 8.7;
const VIDEO_LEN = 10;

/* Saut vers le hero — calé pile sur le haut du hero (offset 0)
   pour que l'arrivée tombe exactement sur la dernière frame. */
const skipToHero = () => {
  const hero = document.querySelector("#hero");
  if (!hero) return;
  const target = hero.getBoundingClientRect().top + window.scrollY;
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(target, { duration: 1.35 });
  else hero.scrollIntoView({ behavior: "smooth" });
};

/* prefers-reduced-motion : snapshot réactif, sans setState dans un effet */
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function VideoIntro() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false // serveur : version scrub par défaut
  );

  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;

    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    /* ── Le scroll pilote la tête de lecture ── */
    const progress = { v: 0 };
    const shown = { t: 0 }; // temps affiché (lissé)
    let raf = 0;

    ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.v = self.progress;
      },
    });

    const tick = () => {
      const duration = video.duration || VIDEO_LEN;
      const goal = progress.v * duration;

      // Lissage : la vidéo « rattrape » le scroll avec un léger retard,
      // ce qui donne un mouvement de caméra au lieu d'un saut sec.
      shown.t += (goal - shown.t) * 0.22;
      if (Math.abs(goal - shown.t) < 0.0004) shown.t = goal;

      if (
        video.readyState >= 2 &&
        Math.abs(video.currentTime - shown.t) > 1 / 48 // demi-frame @24fps
      ) {
        try {
          video.currentTime = shown.t;
        } catch {
          /* seek pas encore possible — on retentera à la prochaine frame */
        }
      }

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress.v})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* ── Chapitres : timeline scrubée sur la même piste de scroll ── */
    const q = gsap.utils.selector(track);
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    // Indication « faites défiler » : visible dès le départ, s'efface au démarrage
    tl.to(q(".intro-hint"), { autoAlpha: 0, y: -12, duration: 0.45 }, 1.15);

    CHAPTERS.forEach((c, i) => {
      const el = q(`.intro-cap-${i}`);
      // Chapitre 1 : visible dès l'arrivée (entrée jouée au montage,
      // pas au scrub) — un premier écran vide donnerait l'impression d'un bug.
      if (i === 0) {
        tl.to(el, { autoAlpha: 0, y: -26, duration: 0.5 }, c.out);
        return;
      }
      tl.fromTo(
        el,
        { autoAlpha: 0, y: 38 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
        c.at
      ).to(el, { autoAlpha: 0, y: -26, duration: 0.5 }, c.out);
    });

    // Chip de fin, sous le logo révélé
    tl.fromTo(
      q(".intro-end"),
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.55 },
      END_CHIP_AT
    );

    // Caler la timeline sur exactement 10 s (= fin de piste)
    tl.to({}, { duration: VIDEO_LEN - END_CHIP_AT - 0.55 }, END_CHIP_AT + 0.55);

    /* ── Déverrouillage lecture iOS : muted play/pause une fois ──
       Sans geste, iOS peut refuser les seeks ; un play() muet immédiat
       lève la limite. Garde stricte pour ne jamais glitcher en plein scrub. */
    const unlock = () => {
      if (video.currentTime < 0.05 && progress.v < 0.02 && video.paused) {
        const p = video.play();
        if (p) p.then(() => video.pause()).catch(() => {});
      }
    };
    video.addEventListener("loadeddata", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true, passive: true });

    /* Entrée du chapitre 1 après le preloader (~2,2 s), indépendante du scrub.
       Garde : si l'utilisateur a déjà dépassé la sortie du chapitre 1,
       on ne le fait pas réapparaître par-dessus le chapitre 2. */
    const capIn = gsap.fromTo(
      q(".intro-cap-0"),
      { autoAlpha: 0, y: 34 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        delay: 2.35,
        ease: "power3.out",
        onStart: () => {
          if (progress.v > 0.18) capIn.kill();
        },
      }
    );

    return () => {
      cancelAnimationFrame(raf);
      capIn.kill();
      video.removeEventListener("loadeddata", unlock);
      window.removeEventListener("touchstart", unlock);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduced]);

  /* ── Fallback statique (prefers-reduced-motion) ── */
  if (reduced) {
    return (
      <section
        id="intro"
        className="relative flex h-[74svh] items-end overflow-hidden bg-grad-espresso"
      >
        <img
          src="/video/hero-still.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-espresso-deep/85 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 md:px-10">
          <p className="micro-caps mb-4 text-cream-soft/70">
            Café Concept — Moissy-Cramayel
          </p>
          <p className="display-light max-w-2xl text-4xl leading-[1.1] text-cream-soft md:text-6xl">
            Chaque matin, tout commence ici.
          </p>
          <button
            onClick={skipToHero}
            className="micro-caps mt-8 inline-flex items-center gap-3 border-b border-caramel-light/50 pb-2 text-caramel-light transition-colors hover:text-cream-soft"
          >
            découvrir la maison
          </button>
        </div>
      </section>
    );
  }

  return (
    <section ref={trackRef} id="intro" className="relative h-[380vh]">
      {/* Frame épinglée */}
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-grad-espresso">
        <video
          ref={videoRef}
          poster="/video/intro-poster.jpg"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video/intro-540.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/video/intro.mp4" type="video/mp4" />
        </video>

        {/* Voiles de lisibilité — discrets, la vidéo est déjà sombre */}
        <div
          className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-espresso-deep/70 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-espresso-deep/35 to-transparent"
          aria-hidden="true"
        />

        {/* Chapitres — ancrés bas gauche, grammaire Sylva.
            Le chapitre 1 est visible immédiatement (pas d'écran vide). */}
        {CHAPTERS.map((c, i) => (
          <div
            key={i}
            className={`intro-cap-${i} absolute bottom-[16%] left-5 right-5 max-w-3xl md:bottom-[20%] md:left-10 md:right-auto ${
              i === 0 ? "opacity-0" : "invisible"
            }`}
          >
            <p className="micro-caps mb-5 flex items-center gap-4 text-cream-soft/70">
              <span className="inline-block h-px w-10 bg-caramel-light/70" aria-hidden="true" />
              {c.eyebrow}
            </p>
            <p className="display-light text-[9.5vw] leading-[1.06] text-cream-soft sm:text-6xl md:text-7xl">
              {c.line}
            </p>
          </div>
        ))}

        {/* Chip de fin — sous le logo révélé, pont vers le hero */}
        <p className="intro-end invisible absolute inset-x-0 bottom-[12%] text-center md:bottom-[9%]">
          <span className="micro-caps text-caramel-light/90">
            — la maison vous attend —
          </span>
        </p>

        {/* Indication de départ */}
        <div className="intro-hint absolute inset-x-0 bottom-10 flex flex-col items-center gap-3">
          <span className="micro-caps text-cream-soft/60">
            faites défiler — la vidéo suit
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-cream-soft/15">
            <span
              className="absolute left-0 top-0 h-3 w-px bg-caramel-light"
              style={{ animation: "scroll-drip 2.2s ease-in-out infinite" }}
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Passer l'intro — bas droite, dégagé du dock sur mobile */}
        <button
          onClick={skipToHero}
          className="micro-caps absolute bottom-[4.2rem] right-5 z-20 text-cream-soft/55 transition-colors duration-300 hover:text-caramel-light md:bottom-12 md:right-10"
        >
          passer l&rsquo;intro
        </button>

        {/* Progression — filet 1 px, remplissage caramel */}
        <div className="absolute inset-x-5 bottom-0 h-px bg-cream-soft/12 md:inset-x-10" aria-hidden="true">
          <span
            ref={barRef}
            className="block h-full w-full origin-left scale-x-0 bg-caramel-light"
          />
        </div>
      </div>
    </section>
  );
}
