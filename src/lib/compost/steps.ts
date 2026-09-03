export interface CompostStep {
  id: string;
  title: string;
  description: string;
  tip?: string;
}

export interface CompostMethod {
  id: string;
  name: string;
  description: string;
  durationWeeks: string;
  steps: CompostStep[];
}

export const COMPOST_METHODS: CompostMethod[] = [
  {
    id: "bac-400l",
    name: "Composteur bac 400 L",
    description: "Solution compacte pour jardin urbain ou balcon collectif.",
    durationWeeks: "12–16 semaines",
    steps: [
      {
        id: "1",
        title: "Choisir l'emplacement",
        description:
          "Mi-ombre, sol drainé, accès facile à l'eau. Évitez les racines d'arbres.",
        tip: "Surélevez le bac sur parpaings pour favoriser l'aération.",
      },
      {
        id: "2",
        title: "Première couche (brun)",
        description:
          "Branchages broyés, feuilles mortes, carton non imprimé — 10–15 cm.",
      },
      {
        id: "3",
        title: "Couche verte",
        description:
          "Épluchures, tontes (fine couche), marc de café, déchets de cuisine sans viande.",
      },
      {
        id: "4",
        title: "Alterner et humidifier",
        description:
          "Alternez brun/vert en couches de 10 cm. Humidifiez comme une éponge essorée.",
        tip: "Ratio visé : 2 volumes bruns pour 1 volume verts.",
      },
      {
        id: "5",
        title: "Retourner toutes les 2 semaines",
        description:
          "Aérez le tas pour accélérer la décomposition et éviter les odeurs.",
      },
      {
        id: "6",
        title: "Compost mûr",
        description:
          "Texture fine, odeur forestière. Tamisez avant d'incorporer au potager (2–3 cm en surface).",
      },
    ],
  },
  {
    id: "tas-sol",
    name: "Tas au sol (1 m³)",
    description: "Idéal pour potager familial avec beaucoup de déchets verts.",
    durationWeeks: "16–24 semaines",
    steps: [
      {
        id: "1",
        title: "Tracer la zone",
        description: "Carré ~1,5 × 1,5 m, directement sur terre ou sur lattes aérées.",
      },
      {
        id: "2",
        title: "Base drainante",
        description: "Branchelles et tiges ligneuses sur 20 cm.",
      },
      {
        id: "3",
        title: "Monter le tas",
        description: "Alternez matières brunes et vertes jusqu'à 1,2 m de haut.",
      },
      {
        id: "4",
        title: "Couverture",
        description: "Couvrez avec un voile ou de la paille pour garder l'humidité.",
      },
      {
        id: "5",
        title: "Retournements mensuels",
        description: "2 à 3 retournements suffisent pour un compost mûr en une saison.",
      },
      {
        id: "6",
        title: "Utilisation au potager",
        description: "Incorporez 3–5 cm au pied des tomates, courgettes et légumes feuilles.",
      },
    ],
  },
  {
    id: "lombricompost",
    name: "Lombricomposteur",
    description: "Production rapide de compost et lixiviat pour balcon ou cuisine.",
    durationWeeks: "8–12 semaines",
    steps: [
      {
        id: "1",
        title: "Installer le lombricomposteur",
        description: "Intérieur 15–25 °C, à l'abri du soleil direct.",
      },
      {
        id: "2",
        title: "Bedding initial",
        description: "Carton humide + compost mûr + 500 g de vers.",
      },
      {
        id: "3",
        title: "Alimentation",
        description: "200 g de déchets/jour max. Pas d'agrumes, oignons, viande.",
      },
      {
        id: "4",
        title: "Récupérer le lixiviat",
        description: "Diluez 1/10 pour arroser les plants en pots.",
      },
      {
        id: "5",
        title: "Récolter le vermicompost",
        description: "Séparez les vers, utilisez le compost en surface des carrés potagers.",
      },
    ],
  },
];
