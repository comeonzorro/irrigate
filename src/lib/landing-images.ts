export interface LandingImage {
  src: string;
  alt: string;
  caption: string;
}

export interface LandingSpotlight {
  image: LandingImage;
  eyebrow: string;
  title: string;
  description: string;
  cta?: { href: string; label: string };
}

export const HERO_IMAGE: LandingImage = {
  src: "/images/hero-watering-couple.png",
  alt: "Couple arrosant leur potager surélevé avec l'application Irrigate",
  caption: "Planifiez et arrosez intelligemment",
};

/** Grandes sections image + texte parsemées sur la landing */
export const LANDING_SPOTLIGHTS: LandingSpotlight[] = [
  {
    image: {
      src: "/images/herbs-app-garden.jpg",
      alt: "Jardinière taillant des herbes aromatiques en consultant l'application Irrigate sur son téléphone",
      caption: "Herbes et aromates au quotidien",
    },
    eyebrow: "Sur le terrain",
    title: "Votre plan, entre vos mains",
    description:
      "Taillez, semez, arrosez — consultez votre parcelle et vos cultures directement depuis le potager. Irrigate vous accompagne là où vous en avez besoin.",
    cta: { href: "/app", label: "Ouvrir le planificateur" },
  },
  {
    image: {
      src: "/images/garden-app-field.jpg",
      alt: "Jardinier dans son potager vérifiant le plan d'irrigation sur l'application mobile Irrigate",
      caption: "Potager familial, app dans la poche",
    },
    eyebrow: "Application mobile",
    title: "Le potager dans votre poche",
    description:
      "Plan 2D, vue 3D, calendrier des saisons et liste d'achats : tout votre projet vous suit dans les planches, même sans connexion sur l'appareil.",
    cta: { href: "/app", label: "Essayer sur le web" },
  },
  {
    image: {
      src: "/images/harvest-couple.png",
      alt: "Couple récoltant des tomates en consultant le plan du potager sur smartphone",
      caption: "De la planification à la récolte",
    },
    eyebrow: "De la graine à l'assiette",
    title: "Planifiez aujourd'hui, récoltez demain",
    description:
      "Estimez rendements, eau et coûts avant de planter. Puis suivez vos récoltes dans le journal de bord.",
    cta: { href: "/compte/journal", label: "Découvrir le journal" },
  },
];

/** Images d'ambiance entre les sections (bandeaux compacts) */
export const LANDING_STRIPS: LandingImage[] = [
  {
    src: "/images/greenhouse-app.png",
    alt: "Jardinière dans une serre avec pulvérisateur et application de suivi",
    caption: "Serre et tunnel",
  },
  {
    src: "/images/balcony-night-couple.png",
    alt: "Couple sur un balcon parisien consultant l'app Irrigate le soir",
    caption: "Potager urbain",
  },
  {
    src: "/images/rain-urban-garden.png",
    alt: "Jardinier vérifiant l'arrosage sous la pluie dans une cour pavée",
    caption: "Climat local",
  },
];

/** Galerie complémentaire en bas de page */
export const LANDING_GALLERY: LandingImage[] = [
  {
    src: "/images/garden-app-dusk.png",
    alt: "Jardinier taillant des herbes aromatiques au crépuscule avec l'app Irrigate",
    caption: "Herbes, légumes, fruits : tout est planifiable",
  },
  {
    src: "/images/night-garden-women.png",
    alt: "Deux jardinières parcourant les planches de légumes le soir avec l'app",
    caption: "Visualisez votre réseau d'irrigation en 2D et 3D",
  },
  {
    src: "/images/community-garden-night.png",
    alt: "Trois jardiniers dans un jardin partagé le soir",
    caption: "Potager familial ou jardin partagé",
  },
  {
    src: "/images/plant-shop-app.png",
    alt: "Couple choisissant des plantes en pépinière avec Mon jardin sur l'app",
    caption: "Catalogue de variétés adaptées à votre climat",
  },
];
