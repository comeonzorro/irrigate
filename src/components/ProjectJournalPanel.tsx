"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedProject } from "@/lib/projects/types";
import {
  addJournalEntry,
  deleteJournalEntry,
  loadJournalEntries,
} from "@/lib/journal/storage";
import {
  JOURNAL_TYPE_LABELS,
  type JournalEntry,
  type JournalEntryType,
} from "@/lib/journal/types";

interface ProjectJournalPanelProps {
  projects: SavedProject[];
}

export function ProjectJournalPanel({ projects }: ProjectJournalPanelProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [type, setType] = useState<JournalEntryType>("note");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [quantityKg, setQuantityKg] = useState("");
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    setEntries(loadJournalEntries());
    if (projects[0]) setProjectId(projects[0].id);
  }, [projects]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;
      const project = projects.find((p) => p.id === projectId);
      const next = addJournalEntry({
        projectId: projectId || null,
        projectName: project?.name ?? "Sans projet",
        type,
        title: title.trim(),
        body: body.trim(),
        quantityKg: quantityKg ? Number(quantityKg) : undefined,
        entryDate: new Date().toISOString().slice(0, 10),
      });
      setEntries(next);
      setTitle("");
      setBody("");
      setQuantityKg("");
    },
    [body, projectId, projects, quantityKg, title, type]
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-emerald-200 bg-white p-5">
        <h3 className="font-semibold text-emerald-900">Nouvelle entrée</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-emerald-800">Potager</span>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-emerald-800">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as JournalEntryType)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            >
              {(Object.keys(JOURNAL_TYPE_LABELS) as JournalEntryType[]).map((t) => (
                <option key={t} value={t}>
                  {JOURNAL_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-medium text-emerald-800">Titre</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            placeholder="Ex. Première récolte de tomates"
          />
        </label>

        {type === "harvest" ? (
          <label className="block text-sm">
            <span className="font-medium text-emerald-800">Quantité (kg)</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            />
          </label>
        ) : null}

        <label className="block text-sm">
          <span className="font-medium text-emerald-800">Détails</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2"
            placeholder="Notes, difficultés, observations…"
          />
        </label>

        <button
          type="submit"
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Enregistrer
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="text-sm text-emerald-700">Aucune entrée pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-emerald-600">
                    {JOURNAL_TYPE_LABELS[entry.type]} · {entry.projectName} ·{" "}
                    {new Date(entry.entryDate).toLocaleDateString("fr-FR")}
                  </p>
                  <h4 className="font-semibold text-emerald-950">{entry.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setEntries(deleteJournalEntry(entry.id))}
                  className="text-xs text-red-700 underline"
                >
                  Supprimer
                </button>
              </div>
              {entry.quantityKg != null ? (
                <p className="mt-1 text-sm font-medium text-emerald-800">
                  {entry.quantityKg} kg récoltés
                </p>
              ) : null}
              {entry.body ? (
                <p className="mt-2 text-sm text-emerald-800">{entry.body}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
