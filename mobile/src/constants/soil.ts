import type { SoilType } from "../types";

export interface SoilProfile {
  type: SoilType;
  name: string;
  description: string;
  drainage: string;
}

export const SOIL_TYPES: SoilProfile[] = [
  {
    type: "argileux",
    name: "Sol argileux",
    description: "Retient l'eau, riche en minéraux.",
    drainage: "faible",
  },
  {
    type: "limoneux",
    name: "Sol limoneux",
    description: "Équilibré, idéal potager.",
    drainage: "moyen",
  },
  {
    type: "sableux",
    name: "Sol sableux",
    description: "Drainage rapide, sèche vite.",
    drainage: "bon",
  },
  {
    type: "mixte",
    name: "Sol mixte",
    description: "Terreau + compost. Le plus courant.",
    drainage: "moyen",
  },
];

export const SOIL_ICONS: Record<SoilType, string> = {
  argileux: "🧱",
  limoneux: "🌾",
  sableux: "🏖️",
  mixte: "🪴",
};
