"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectsGallery } from "@/components/ProjectsGallery";
import { useEffect, useState } from "react";
import { loadProjectStore } from "@/lib/projects/storage";
import type { SavedProject } from "@/lib/projects/types";

export default function ProjetsPage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setProjects(loadProjectStore().projects);
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-10">
        <Link href="/compte" className="text-sm text-emerald-700 hover:underline">
          ← Mon espace
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-emerald-950">Mes projets</h1>
        <p className="mt-2 max-w-2xl text-emerald-800">
          Tous vos potagers en cours — ouvrez-en un directement dans le
          planificateur.
        </p>
        <div className="mt-8">
          <ProjectsGallery projects={projects} />
        </div>
      </main>
      <Footer />
    </>
  );
}
