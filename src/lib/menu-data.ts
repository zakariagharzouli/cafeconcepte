export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tag?: "populaire" | "signature" | "nouveau";
  image?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  emoji: string;
  items: MenuItem[];
}

export const MENU: MenuCategory[] = [
  {
    id: "asian",
    label: "Asian Food",
    emoji: "🥢",
    items: [
      {
        id: "nems",
        name: "Nems poulet (3 pièces)",
        description: "Délicieux nems au poulet faits maison",
        price: 4.7,
        tag: "populaire",
      },
      {
        id: "bobun-poulet",
        name: "Bo Bun poulet",
        description:
          "Vermicelles de riz, sauté de viandes, salades, carotte, nems, cacahuètes, persil",
        price: 11.0,
        tag: "signature",
        image: "/food/bo-bun.png",
      },
      {
        id: "bobun-boeuf",
        name: "Bo Bun bœuf",
        description:
          "Vermicelles de riz, bœuf sauté, crudités et sauce nuoc-mâm",
        price: 11.0,
        tag: "populaire",
        image: "/food/bo-bun.png",
      },
      {
        id: "banhmi",
        name: "Bánh Mì poulet",
        description: "Sandwich vietnamien au poulet mariné",
        price: 5.2,
        image: "/food/banh-mi.png",
      },
      {
        id: "riz-curry-coco",
        name: "Riz poulet croustillant curry coco",
        description:
          "Riz sauté, poulet frit, salade, tomate, concombre, omelette, sauce curry coco",
        price: 12.1,
      },
      {
        id: "loclac",
        name: "Loclac bœuf",
        description:
          "Riz sauté à la tomate, viande caramélisée, salade, tomate, concombre, œuf au plat",
        price: 13.1,
        tag: "signature",
        image: "/food/loclac.png",
      },
      {
        id: "poke",
        name: "Poke poulet",
        description:
          "Riz assaisonné, poulet frit, tomate, concombre, carotte, avocat, mangue, sauce soja sucrée",
        price: 11.0,
        tag: "populaire",
        image: "/food/poke-bowl.png",
      },
      {
        id: "katsu",
        name: "Poulet katsu",
        description:
          "Riz sauté au poulet frit, sauce mayo épicée, oignons frits",
        price: 12.1,
      },
    ],
  },
  {
    id: "burgers",
    label: "Burgers",
    emoji: "🍔",
    items: [
      {
        id: "smash",
        name: "Smash Burger",
        description:
          "Pain bun's brioché, double steak smashé, cheddar fondant, sauce maison, salade, frites maison",
        price: 10.5,
        tag: "signature",
        image: "/food/smash-burger.png",
      },
      {
        id: "montagnard",
        name: "Montagnard Burger",
        description:
          "Pain bun's brioché, steak 150g, fromage raclette, sauce poivre, barbecue, salade, frites maison",
        price: 11.0,
        tag: "populaire",
        image: "/food/smash-burger.png",
      },
      {
        id: "mix",
        name: "Mix Burger",
        description:
          "Pain bun's brioché, poulet frit, steak haché, cheddar, sauce smash, salade, frites maison",
        price: 12.0,
      },
      {
        id: "chicken",
        name: "Chicken Burger",
        description:
          "Pain bun's brioché, poulet frit, cheddar, sauce smash & barbecue, salade, cornichon, frites maison",
        price: 11.0,
        image: "/food/smash-burger.png",
      },
      {
        id: "americain",
        name: "Sandwich Américain",
        description:
          "Demi baguette, steak haché, cheddar, tomate, frites maison",
        price: 8.0,
      },
      {
        id: "menu-enfant",
        name: "Menu Enfant",
        description: "Poulet frits, frites maison / riz",
        price: 6.5,
      },
      {
        id: "frites",
        name: "Frites maison",
        description: "Portion de frites fraîches",
        price: 4.0,
      },
    ],
  },
  {
    id: "salades",
    label: "Salades",
    emoji: "🥗",
    items: [
      {
        id: "salade-poulet",
        name: "Salade Poulet",
        description:
          "Salade, poulet frit, emmental, tomate, croûton, sauce blanche",
        price: 8.0,
      },
      {
        id: "salade-thon",
        name: "Salade Thon",
        description:
          "Salade, thon, feta, oignon rouge, concombre, olive noire, sauce vinaigrette",
        price: 8.0,
        tag: "populaire",
      },
      {
        id: "salade-chevre",
        name: "Salade Chèvre miel",
        description:
          "Salade, tomate, graines de tournesol, jambon de dinde, petit pain chèvre miel",
        price: 8.0,
      },
    ],
  },
  {
    id: "sandwichs",
    label: "Sandwichs",
    emoji: "🥖",
    items: [
      {
        id: "sand-poulet",
        name: "Sandwich Poulet",
        description: "Poulet, crudités, sauce au choix",
        price: 4.5,
      },
      {
        id: "sand-thon",
        name: "Sandwich Thon",
        description: "Thon, crudités, mayonnaise",
        price: 4.5,
      },
      {
        id: "sand-americain",
        name: "Sandwich Américain",
        description:
          "Demi baguette, steak haché, cheddar, tomate, frites maison",
        price: 8.0,
      },
    ],
  },
  {
    id: "boissons",
    label: "Cafés & Boissons",
    emoji: "☕",
    items: [
      {
        id: "expresso",
        name: "Café expresso",
        description: "Café serré",
        price: 1.9,
        tag: "populaire",
        image: "/food/latte.png",
      },
      {
        id: "allonge",
        name: "Café allongé",
        description: "Café long",
        price: 2.1,
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Café avec mousse de lait",
        price: 3.4,
        image: "/food/latte.png",
      },
      {
        id: "latte",
        name: "Latte",
        description: "Café au lait crémeux",
        price: 3.2,
        tag: "signature",
        image: "/food/latte.png",
      },
      {
        id: "the",
        name: "Thé",
        description: "Sélection de thés",
        price: 1.6,
      },
      {
        id: "chocolat",
        name: "Chocolat chaud",
        description: "Chocolat maison",
        price: 3.4,
      },
      {
        id: "coca",
        name: "Coca-Cola 33cl",
        description: "Servi frais",
        price: 2.0,
      },
      {
        id: "orangina",
        name: "Orangina 33cl",
        description: "Servi frais",
        price: 2.0,
      },
      {
        id: "eau",
        name: "Eau minérale 50cl",
        description: "Plate ou pétillante",
        price: 2.0,
      },
      {
        id: "jus-orange",
        name: "Jus d'orange frais",
        description: "Pressé minute",
        price: 2.8,
        tag: "nouveau",
      },
    ],
  },
  {
    id: "patisseries",
    label: "Pâtisseries",
    emoji: "🥐",
    items: [
      {
        id: "croissant",
        name: "Croissant au beurre",
        description: "Feuilleté, doré, pur beurre — cuit du matin",
        price: 1.2,
        tag: "populaire",
      },
      {
        id: "pain-choco",
        name: "Pain au chocolat",
        description: "Viennoserie feuilletée au chocolat noir",
        price: 1.4,
        tag: "populaire",
      },
      {
        id: "pain-raisin",
        name: "Pain aux raisins",
        description: "Frangipane et raisins blonds",
        price: 1.5,
      },
      {
        id: "cookies",
        name: "Cookie maison",
        description: "Pépites de chocolat, cœur fondant",
        price: 2.0,
        tag: "nouveau",
      },
      {
        id: "part-brioche",
        name: "Brioche maison",
        description: "Moelleuse, sucrée juste ce qu'il faut",
        price: 2.2,
      },
    ],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
