"use client";

import Link from "next/link";
import { useCallback } from "react";
import type { SavedProject } from "@/lib/projects/types";
import { loadProjectStore, saveProjectStore } from "@/lib/projects/storage";

interface ProjectsGalleryProps {
  projects: SavedProject[];
  onRefresh?: () => void;
}

export function ProjectsGallery({ projects, onRefresh }: ProjectsGalleryProps) {
  const openProject = useCallback(
    (id: string) => {
      const store = loadProjectStore();
      store.activeProjectId = id;
      saveProjectStore(store);
      window.location.href = "/app";
    },
    []
  );

  if (projects.length === 0) {
    return (
      <p className="rounded-xl bg-emerald-50 px-4 py-8 text-center text-sm text-emerald-700">
        Aucun potager enregistré.{" "}
        <Link href="/app" className="font-medium underline">
          Créer un projet
        </Link>
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const area = project.config.widthM * project.config.lengthM;
        const cultures = project.config.selectedVarieties.length;
        const updated = new Date(project.updatedAt).toLocaleDateString("fr-FR");

        return (
          <li
            key={project.id}
            className="flex flex-col rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
          >
            <div className="flex min-h-[80px] items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-amber-50 text-4xl">
              🌱
            </div>
            <h3 className="mt-4 text-lg font-bold text-emerald-950">
              {project.name}
            </h3>
            <dl className="mt-2 space-y-1 text-sm text-emerald-800">
              <div className="flex justify-between">
                <dt>Surface</dt>
                <dd className="font-medium">
                  {project.config.widthM}×{project.config.lengthM} m ({area} m²)
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Cultures</dt>
                <dd className="font-medium">{cultures} variété{cultures > 1 ? "s" : ""}</dd>
              </div>
              {project.location ? (
                <div className="flex justify-between">
                  <dt>Lieu</dt>
                  <dd className="font-medium truncate max-w-[10rem]">
                    {project.location.cityHint}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt>Modifié</dt>
                <dd>{updated}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Sync</dt>
                <dd>{project.localOnly ? "Local" : "Cloud ☁️"}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => openProject(project.id)}
              className="mt-4 w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Ouvrir dans le planificateur →
            </button>
          </li>
        );
      })}
    </ul>
  );
}
