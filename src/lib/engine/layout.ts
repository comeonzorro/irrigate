import type { CropVariety, PlacedPlant, SunExposure } from "../types";
import { getVariety } from "../data/crops";

const TILE_SIZE_M = 0.5;

export function computeGridDimensions(widthM: number, lengthM: number) {
  return {
    gridCols: Math.max(1, Math.round(widthM / TILE_SIZE_M)),
    gridRows: Math.max(1, Math.round(lengthM / TILE_SIZE_M)),
    tileSizeM: TILE_SIZE_M,
  };
}

function sunMultiplier(sun: SunExposure): number {
  const map: Record<SunExposure, number> = { S: 1.0, E: 0.85, O: 0.85, N: 0.6 };
  return map[sun];
}

export function layoutPlants(
  widthM: number,
  lengthM: number,
  varietyIds: string[],
  sun: SunExposure
): { plants: PlacedPlant[]; gridCols: number; gridRows: number; tileSizeM: number } {
  const { gridCols, gridRows, tileSizeM } = computeGridDimensions(widthM, lengthM);

  if (varietyIds.length === 0) {
    return { plants: [], gridCols, gridRows, tileSizeM };
  }

  const plants: PlacedPlant[] = [];
  const occupied = new Set<string>();

  const varieties = varietyIds
    .map((id) => getVariety(id))
    .filter((v): v is CropVariety => v !== undefined)
    .sort((a, b) => {
      const areaA = a.spacingCm.row * a.spacingCm.plant;
      const areaB = b.spacingCm.row * b.spacingCm.plant;
      return areaB - areaA;
    });

  for (const variety of varieties) {
    const spacingM = {
      row: variety.spacingCm.row / 100,
      plant: variety.spacingCm.plant / 100,
    };
    const colsPerPlant = Math.max(1, Math.ceil(spacingM.plant / tileSizeM));
    const rowsPerPlant = Math.max(1, Math.ceil(spacingM.row / tileSizeM));

    for (let gy = 0; gy < gridRows; gy += rowsPerPlant) {
      for (let gx = 0; gx < gridCols; gx += colsPerPlant) {
        let fits = true;
        for (let dy = 0; dy < rowsPerPlant && fits; dy++) {
          for (let dx = 0; dx < colsPerPlant && fits; dx++) {
            const key = `${gx + dx},${gy + dy}`;
            if (gx + dx >= gridCols || gy + dy >= gridRows || occupied.has(key)) {
              fits = false;
            }
          }
        }
        if (!fits) continue;

        for (let dy = 0; dy < rowsPerPlant; dy++) {
          for (let dx = 0; dx < colsPerPlant; dx++) {
            occupied.add(`${gx + dx},${gy + dy}`);
          }
        }

        plants.push({
          varietyId: variety.id,
          x: gx + colsPerPlant / 2,
          y: gy + rowsPerPlant / 2,
        });
      }
    }
  }

  void sunMultiplier(sun);
  return { plants, gridCols, gridRows, tileSizeM };
}

export { sunMultiplier };
