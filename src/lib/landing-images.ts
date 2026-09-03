export interface LandingImage {
  src: string;
  alt: string;
  caption: string;
}

export const HERO_IMAGE: LandingImage = {
  src: "/images/hero-watering-couple.png",
  alt: "Couple arrosant leur potager surélevé avec l'application Irrigate",
  caption: "Planifiez et arrosez intelligemment",
};

export const LANDING_GALLERY: LandingImage[] = [
  {
    src: "/images/balcony-night-couple.png",
    alt: "Couple sur un balcon parisien consultant l'app Irrigate le soir",
    caption: "Potager urbain, même sur un balcon",
  },
  {
    src: "/images/harvest-couple.png",
    alt: "Couple récoltant des tomates en consultant le plan du potager sur smartphone",
    caption: "De la planification à la récolte",
  },
  {
    src: "/images/greenhouse-app.png",
    alt: "Jardinière dans une serre avec pulvérisateur et application de suivi",
    caption: "Serre et tunnel : variétés sensibles au froid",
  },
  {
    src: "/images/garden-app-dusk.png",
    alt: "Jardinier taillant des herbes aromatiques au crépuscule avec l'app Irrigate",
    caption: "Herbes, légumes, fruits : tout est planifiable",
  },
  {
    src: "/images/rain-urban-garden.png",
    alt: "Jardinier vérifiant l'arrosage sous la pluie dans une cour pavée",
    caption: "Adapté au climat de votre région",
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
