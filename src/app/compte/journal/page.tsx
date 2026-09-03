"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectJournalPanel } from "@/components/ProjectJournalPanel";
import { useEffect, useState } from "react";
import { loadProjectStore } from "@/lib/projects/storage";
import type { SavedProject } from "@/lib/projects/types";

export default function JournalPage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setProjects(loadProjectStore().projects);
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-10">
        <Link href="/compte" className="text-sm text-emerald-700 hover:underline">
          ← Mon espace
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-emerald-950">
          Journal de suivi
        </h1>
        <p className="mt-2 text-emerald-800">
          Documentez vos récoltes, difficultés et observations potager au fil des
          saisons.
        </p>
        <div className="mt-8">
          {projects.length === 0 ? (
            <p className="text-sm text-emerald-700">
              Créez d&apos;abord un potager dans le{" "}
              <Link href="/app" className="underline">
                planificateur
              </Link>
              .
            </p>
          ) : (
            <ProjectJournalPanel projects={projects} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
