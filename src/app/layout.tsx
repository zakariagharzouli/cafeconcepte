import type { Metadata, Viewport } from "next";
import { Baloo_2, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SmoothScroll from "@/components/site/SmoothScroll";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Café Concept — Restaurant & Traiteur à Moissy-Cramayel",
  description:
    "Café Concept, votre café-resto à Moissy-Cramayel : spécialités asiatiques, burgers gourmands, salades fraîches et pâtisseries maison. Traiteur pour vos événements. Note Google 4,9★ — 240+ avis.",
  keywords: [
    "café Moissy-Cramayel",
    "restaurant Moissy-Cramayel",
    "traiteur Moissy-Cramayel",
    "burger maison",
    "cuisine asiatique 77",
    "bo bun",
    "smash burger",
    "Café Concept",
    "restaurant Sénart",
  ],
  authors: [{ name: "Café Concept" }],
  metadataBase: new URL("https://cafeconcept77.fr"),
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Café Concept — Restaurant & Traiteur à Moissy-Cramayel",
    description:
      "Cuisine savoureuse et faite maison : saveurs asiatiques, burgers gourmands, salades fraîches. Service traiteur pour vos événements.",
    url: "https://cafeconcept77.fr",
    siteName: "Café Concept",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/food/smash-burger.png", width: 1024, height: 1024, alt: "Smash Burger maison du Café Concept" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Café Concept — Restaurant & Traiteur",
    description:
      "Saveurs asiatiques, burgers gourmands et spécialités maison à Moissy-Cramayel. Traiteur événementiel.",
  },
};

export const viewport: Viewport = {
  themeColor: "#3c2a1c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Café Concept",
  servesCuisine: ["Asiatique", "Burgers", "Café", "Traiteur"],
  priceRange: "€",
  telephone: "+33666028603",
  email: "cafe.concept@outlook.fr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "502 Avenue des Meuniers",
    postalCode: "77550",
    addressLocality: "Moissy-Cramayel",
    addressCountry: "FR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 48.6247, longitude: 2.5977 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:30",
      closes: "20:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "240",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${baloo.variable} ${poppins.variable} font-sans antialiased cursor-none-fine`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        <Toaster />
      </body>
    </html>
  );
}
