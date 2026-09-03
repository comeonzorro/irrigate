export type JournalEntryType = "harvest" | "issue" | "note";

export interface JournalEntry {
  id: string;
  projectId: string | null;
  projectName: string;
  type: JournalEntryType;
  title: string;
  body: string;
  quantityKg?: number;
  entryDate: string;
  createdAt: string;
}

export const JOURNAL_KEY = "irrigate:project-journal";

export const JOURNAL_TYPE_LABELS: Record<JournalEntryType, string> = {
  harvest: "🌾 Récolte",
  issue: "⚠️ Difficulté",
  note: "📝 Note",
};
