export const SITE = {
  name: "Café Concept",
  baseline: "Restaurant & Traiteur — Moissy-Cramayel",
  address: "502 Avenue des Meuniers, 77550 Moissy-Cramayel",
  phone: "06 66 02 86 03",
  phoneHref: "tel:0666028603",
  email: "cafe.concept@outlook.fr",
  mapsUrl:
    "https://www.google.com/maps/place/502+Avenue+des+Meuniers,+77550+Moissy-Cramayel",
  mapsEmbed:
    "https://www.google.com/maps?q=Caf%C3%A9+Concept,+502+Avenue+des+Meuniers,+77550+Moissy-Cramayel&output=embed",
  rating: "4,9",
  reviewsCount: "240+",
  dishesCount: "75+",
} as const;

export interface DayHours {
  day: string;
  hours: string;
  jsDay: number; // 0 = dimanche
}

export const HOURS: DayHours[] = [
  { day: "Lundi", hours: "8h30 – 20h", jsDay: 1 },
  { day: "Mardi", hours: "8h30 – 20h", jsDay: 2 },
  { day: "Mercredi", hours: "8h30 – 20h", jsDay: 3 },
  { day: "Jeudi", hours: "8h30 – 20h", jsDay: 4 },
  { day: "Vendredi", hours: "8h30 – 20h", jsDay: 5 },
  { day: "Samedi", hours: "9h30 – 20h", jsDay: 6 },
  { day: "Dimanche", hours: "Fermé", jsDay: 0 },
];

export interface Review {
  name: string;
  initial: string;
  text: string;
  context: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Jonathan K.",
    initial: "J",
    text: "Très bon café-resto de quartier. Les portions sont généreuses et de qualité. Je recommande vivement !",
    context: "Avis Google",
  },
  {
    name: "Rébecca C.",
    initial: "R",
    text: "Nous avons commandé traiteur pour un événement familial : prestation de très bonne qualité, quantité et choix copieux.",
    context: "Service traiteur",
  },
  {
    name: "Marie L.",
    initial: "M",
    text: "Super café, délicieux croissants et pains au chocolat. Équipe conviviale et accueillante !",
    context: "Petit-déjeuner",
  },
];

export const ENGAGEMENTS = [
  {
    title: "Fait Maison",
    text: "Tous nos plats sont préparés sur place avec des produits frais sélectionnés avec soin.",
  },
  {
    title: "Service Rapide",
    text: "Commandez sur place ou à emporter — prêt à l'heure souhaitée, sans attente.",
  },
  {
    title: "Qualité Premium",
    text: "Des ingrédients de qualité pour des plats savoureux. Satisfaction garantie !",
  },
] as const;

export const TRAITEUR_OFFRES = [
  {
    title: "Anniversaires",
    text: "Buffets sucrés et salés pour célébrer en beauté avec vos proches.",
  },
  {
    title: "Mariages",
    text: "Cocktails, buffets, repas assis… Votre mariage à votre image.",
  },
  {
    title: "Entreprises",
    text: "Séminaires, réunions, événements corporate avec des formules adaptées.",
  },
] as const;

export const TRAITEUR_ENGAGEMENTS = [
  "Devis gratuit sous 24h",
  "Produits frais et maison",
  "Menu personnalisable",
  "Livraison et installation",
] as const;
