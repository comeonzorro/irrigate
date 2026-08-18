import type { IrrigationMode } from "../types";

export const IRRIGATION_MODES: IrrigationMode[] = [
  {
    id: "drip_buried",
    name: "Goutte-à-goutte enterré",
    description:
      "Tuyaux poreux ou goutteurs enterrés à 15 cm. Efficace, discret, idéal tomates & courgettes.",
    efficiency: 0.92,
    setupCostPerM2: 4.5,
    waterCostPerLiter: 0.003,
    laborMinutesPerWeek: 5,
    available: true,
  },
  {
    id: "drip_surface",
    name: "Goutte-à-goutte de surface",
    description:
      "Réseau visible avec goutteurs autorégulants. Installation rapide, bon compromis.",
    efficiency: 0.85,
    setupCostPerM2: 2.8,
    waterCostPerLiter: 0.003,
    laborMinutesPerWeek: 10,
    available: true,
  },
  {
    id: "sprinkler_auto",
    name: "Arrosage automatique (aspersion)",
    description:
      "Programmateur + électrovanne + arroseurs. Couvre large surface, moins précis.",
    efficiency: 0.65,
    setupCostPerM2: 3.2,
    waterCostPerLiter: 0.003,
    laborMinutesPerWeek: 2,
    available: true,
  },
  {
    id: "hose_jet",
    name: "Jet d'eau (tuyau + lance)",
    description: "Arrosage manuel au tuyau. Simple, peu coûteux, demande du temps.",
    efficiency: 0.55,
    setupCostPerM2: 0.3,
    waterCostPerLiter: 0.003,
    laborMinutesPerWeek: 45,
    available: true,
  },
  {
    id: "watering_can",
    name: "Arrosoir 6 L (manuel)",
    description:
      "Arrosage au pied, plante par plante. Précis mais long — ~2 min par arrosoir plein.",
    efficiency: 0.95,
    setupCostPerM2: 0.05,
    waterCostPerLiter: 0.003,
    laborMinutesPerWeek: 0,
    available: true,
  },
  {
    id: "arduino_smart",
    name: "Système Arduino intelligent",
    description:
      "Capteurs humidité sol + pompe pilotée. Mode V2 — schéma et BOM disponibles bientôt.",
    efficiency: 0.94,
    setupCostPerM2: 8.0,
    waterCostPerLiter: 0.003,
    laborMinutesPerWeek: 3,
    available: false,
    v2: true,
  },
];

export const WATERING_CAN_CAPACITY_L = 6;
export const MINUTES_PER_WATERING_CAN = 2;

export function getIrrigationMode(id: string): IrrigationMode | undefined {
  return IRRIGATION_MODES.find((m) => m.id === id);
}
