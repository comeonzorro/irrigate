"use client";

import Link from "next/link";
import type { SavedProject } from "@/lib/projects/types";
import { clearCityAccess, getCityAccess } from "@/lib/projects/storage";

interface ProjectBarProps {
  projects: SavedProject[];
  activeProjectId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  syncing?: boolean;
}

export function ProjectBar({
  projects,
  activeProjectId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
  syncing,
}: ProjectBarProps) {
  const city = getCityAccess();

  return (
    <section className="mb-6 rounded-2xl border border-emerald-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Mes projets
          </h2>
          {city ? (
            <p className="mt-1 text-sm text-emerald-800">
              📍 {city.cityHint} ({city.postalCode}) · {city.regionName}
              {" · "}
              <button
                type="button"
                onClick={() => {
                  clearCityAccess();
                  window.location.reload();
                }}
                className="underline underline-offset-2"
              >
                Changer de ville
              </button>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCreate}
            className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            + Nouveau potager
          </button>
          <Link
            href="/compte"
            className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
          >
            Mon compte
          </Link>
          <Link
            href="/compte/projets"
            className="hidden rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 sm:inline"
          >
            Galerie
          </Link>
          <Link
            href="/compte/journal"
            className="hidden rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 md:inline"
          >
            Journal
          </Link>
        </div>
      </div>

      {syncing ? (
        <p className="mt-2 text-xs text-emerald-600" role="status">
          Synchronisation cloud…
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {projects.map((project) => {
          const selected = project.id === activeProjectId;
          return (
            <div
              key={project.id}
              className={`flex items-center gap-1 rounded-full border pl-3 pr-1 py-1 ${
                selected
                  ? "border-emerald-600 bg-emerald-100"
                  : "border-emerald-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(project.id)}
                className="text-sm font-medium text-emerald-900"
              >
                {project.name}
                {project.localOnly ? " · local" : ""}
              </button>
              <button
                type="button"
                aria-label={`Renommer ${project.name}`}
                onClick={() => {
                  const next = window.prompt("Nom du projet", project.name);
                  if (next?.trim()) onRename(project.id, next.trim());
                }}
                className="rounded-full px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
              >
                ✎
              </button>
              {projects.length > 1 ? (
                <button
                  type="button"
                  aria-label={`Supprimer ${project.name}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Supprimer le projet « ${project.name} » ?`
                      )
                    ) {
                      onDelete(project.id);
                    }
                  }}
                  className="rounded-full px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  ×
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
