export interface LandingScreenshot {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export const LANDING_SCREENSHOTS: LandingScreenshot[] = [
  {
    src: "/screenshots/plan-2d.jpg",
    alt: "Plan 2D du potager avec réseau d'irrigation goutte-à-goutte",
    title: "Plan 2D interactif",
    description:
      "Visualisez cultures, tuyaux et goutteurs sur votre parcelle. Ajustez dimensions et densité en direct.",
  },
  {
    src: "/screenshots/vue-3d.jpg",
    alt: "Vue 3D de l'installation d'irrigation enterrée",
    title: "Vue 3D immersive",
    description:
      "Explorez votre réseau enterré en trois dimensions. Rotation, zoom et plein écran sur mobile.",
  },
  {
    src: "/screenshots/mode-irrigation.jpg",
    alt: "Comparatif des modes d'irrigation avec coûts et efficacité",
    title: "Modes d'irrigation",
    description:
      "Comparez goutte-à-goutte, aspersion et arrosage manuel : coût, efficacité et temps passé.",
  },
  {
    src: "/screenshots/cultures-varietes.jpg",
    alt: "Catalogue de cultures et variétés adaptées à la région",
    title: "Cultures & variétés",
    description:
      "Catalogue régional débloqué par code postal. Mode serre pour les variétés sensibles au froid.",
  },
  {
    src: "/screenshots/plan-arrosage.jpg",
    alt: "Tableau de bord eau, rendement et rentabilité du potager",
    title: "Arrosage & rentabilité",
    description:
      "Consommation d'eau, coût mensuel, récolte estimée et valeur marchande — le tout calculé pour vous.",
  },
];
