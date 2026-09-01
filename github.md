repo: zyx77550/cafeconcepte
branch: main

## Last sync
date: 2026-08-31T15:36:00Z

### Updated in this project
- Refonte design complète du site en un seul écran défilant (Design Component).
- L'intro vidéo scrubée devient une séquence autonome : clôture sur logo + voile crème.
- Nouveau hero crème éditorial (titre + photo cadrée), il n'utilise plus une frame de la vidéo en fond.
- Scrub retravaillé : ressort amorti, garde anti-seek, séquence d'images en fondu croisé en secours.

## Screen map
| Écran / section | Fichiers source |
| --- | --- |
| Site Café Concept.dc.html (tout) | src/app/page.tsx, src/app/layout.tsx, src/app/globals.css, tailwind.config.ts |
| Preloader | src/components/site/Preloader.tsx |
| Dock / nav | src/components/site/Dock.tsx |
| Intro vidéo scrubée | src/components/site/VideoIntro.tsx, src/components/site/SmoothScroll.tsx, analysis/vidframes/* |
| Hero | src/components/site/Hero.tsx, src/lib/site-data.ts |
| Marquee | src/components/site/Marquee.tsx |
| Engagements | src/components/site/Engagements.tsx, src/lib/site-data.ts |
| Signatures | src/components/site/Signatures.tsx, src/lib/menu-data.ts |
| Menu / carte | src/components/site/MenuSection.tsx, src/lib/menu-data.ts |
| Traiteur | src/components/site/Traiteur.tsx, src/lib/site-data.ts |
| Avis | src/components/site/Reviews.tsx, src/lib/site-data.ts |
| Contact | src/lib/site-data.ts (SITE, HOURS) |
| Footer | src/components/site/Footer.tsx |
| Assets | public/brand/*, public/food/*, public/video/* |
