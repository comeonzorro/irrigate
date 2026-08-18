import type { FertilizerPlan, SoilType } from "../types";

interface SoilProfile {
  type: SoilType;
  name: string;
  description: string;
  waterRetention: number;
  drainage: "faible" | "moyen" | "bon";
  defaultPh: number;
}

export const SOIL_TYPES: SoilProfile[] = [
  {
    type: "argileux",
    name: "Sol argileux",
    description: "Retient l'eau, riche en minéraux. Risque de compactage.",
    waterRetention: 1.2,
    drainage: "faible",
    defaultPh: 7.0,
  },
  {
    type: "limoneux",
    name: "Sol limoneux",
    description: "Équilibré, idéal potager. Bonne rétention et drainage.",
    waterRetention: 1.0,
    drainage: "moyen",
    defaultPh: 6.8,
  },
  {
    type: "sableux",
    name: "Sol sableux",
    description: "Drainage rapide, sèche vite. Nécessite plus d'arrosage.",
    waterRetention: 0.75,
    drainage: "bon",
    defaultPh: 6.5,
  },
  {
    type: "mixte",
    name: "Sol mixte (jardin classique)",
    description: "Terreau + compost. Configuration la plus courante en potager.",
    waterRetention: 1.0,
    drainage: "moyen",
    defaultPh: 6.8,
  },
];

export function getSoilProfile(type: SoilType): SoilProfile {
  return SOIL_TYPES.find((s) => s.type === type) ?? SOIL_TYPES[3];
}

const FERTILIZER_BY_SOIL: Record<
  SoilType,
  { type: string; npk: string; notes: string }
> = {
  argileux: {
    type: "Compost mûr + fumier bien décomposé",
    npk: "5-3-8",
    notes:
      "Éviter excès azote (végétatif). Ajouter sable/coquilles pour aérer. Apport printemps + mi-été.",
  },
  limoneux: {
    type: "Compost + engrais organique équilibré",
    npk: "6-6-6",
    notes:
      "Sol idéal : entretien léger. Compost au printemps, mulch en été.",
  },
  sableux: {
    type: "Compost riche + matière organique ( BRF )",
    npk: "8-4-6",
    notes:
      "Mulch épais pour retenir l'humidité. Fractionner les apports sur la saison.",
  },
  mixte: {
    type: "Compost maison + granulés organiques tomates/légumes",
    npk: "7-5-10",
    notes:
      "Adapter NPK selon culture : tomates = plus de potassium (K). Renouveler tous les 6 semaines en croissance.",
  },
};

export function computeFertilizerPlan(
  soilType: SoilType,
  areaM2: number,
  plantCount: number
): FertilizerPlan {
  const soil = getSoilProfile(soilType);
  const fert = FERTILIZER_BY_SOIL[soilType];
  const amountKg = Math.max(2, Math.round(areaM2 * 1.5 + plantCount * 0.05));
  const costEstimate = amountKg * 2.5;

  return {
    type: fert.type,
    npk: fert.npk,
    amountKg,
    frequency: "Apport principal au printemps, complément mi-saison",
    costEstimate,
    notes: `${fert.notes} pH cible ~${soil.defaultPh}.`,
  };
}
