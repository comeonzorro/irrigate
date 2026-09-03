import type { JournalEntry } from "./types";
import { JOURNAL_KEY } from "./types";

export function loadJournalEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntries(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

export function addJournalEntry(
  entry: Omit<JournalEntry, "id" | "createdAt">
): JournalEntry[] {
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const entries = [newEntry, ...loadJournalEntries()];
  saveJournalEntries(entries);
  return entries;
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  const entries = loadJournalEntries().filter((e) => e.id !== id);
  saveJournalEntries(entries);
  return entries;
}
