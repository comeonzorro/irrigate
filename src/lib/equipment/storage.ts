const EQUIPMENT_KEY = "irrigate:user-equipment";

export type OwnedEquipment = Record<string, boolean>;

export function loadOwnedEquipment(): OwnedEquipment {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(EQUIPMENT_KEY);
    return raw ? (JSON.parse(raw) as OwnedEquipment) : {};
  } catch {
    return {};
  }
}

export function saveOwnedEquipment(owned: OwnedEquipment): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(owned));
}

export function toggleEquipment(id: string, value: boolean): OwnedEquipment {
  const next = { ...loadOwnedEquipment(), [id]: value };
  saveOwnedEquipment(next);
  return next;
}
