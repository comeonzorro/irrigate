import type { IrrigationMode } from "../types";

export const IRRIGATION_MODES: IrrigationMode[] = [
  {
    id: "drip_buried",
    name: "Goutte-à-goutte enterré",
    description:
      "Tuyaux poreux ou goutteurs enterrés à 15 cm. Efficace, discret.",
    efficiency: 0.92,
    setupCostPerM2: 4.5,
    available: true,
  },
  {
    id: "drip_surface",
    name: "Goutte-à-goutte de surface",
    description: "Réseau visible avec goutteurs. Installation rapide.",
    efficiency: 0.85,
    setupCostPerM2: 2.8,
    available: true,
  },
  {
    id: "sprinkler_auto",
    name: "Arrosage automatique",
    description: "Programmateur + arroseurs. Large surface.",
    efficiency: 0.65,
    setupCostPerM2: 3.2,
    available: true,
  },
  {
    id: "hose_jet",
    name: "Jet d'eau (tuyau)",
    description: "Arrosage manuel. Simple et peu coûteux.",
    efficiency: 0.55,
    setupCostPerM2: 0.3,
    available: true,
  },
  {
    id: "watering_can",
    name: "Arrosoir 6 L",
    description: "Au pied, plante par plante. Précis mais long.",
    efficiency: 0.95,
    setupCostPerM2: 0.05,
    available: true,
  },
  {
    id: "arduino_smart",
    name: "Système Arduino intelligent",
    description: "Capteurs humidité + pompe pilotée. Bientôt disponible.",
    efficiency: 0.94,
    setupCostPerM2: 8.0,
    available: false,
    v2: true,
  },
];

export function getIrrigationMode(id: string): IrrigationMode | undefined {
  return IRRIGATION_MODES.find((m) => m.id === id);
}
