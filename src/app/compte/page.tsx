"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthPanel } from "@/components/AuthPanel";
import { useEffect, useState } from "react";
import { loadProjectStore } from "@/lib/projects/storage";
import type { SavedProject } from "@/lib/projects/types";

export default function ComptePage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    setProjects(loadProjectStore().projects);
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl flex-1 space-y-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950">Mon espace</h1>
          <p className="mt-2 text-emerald-800">
            Sauvegardez plusieurs potagers et retrouvez-les sur le web et
            l&apos;application iOS.
          </p>
        </div>

        <AuthPanel />

        <section className="rounded-2xl border border-emerald-200 bg-white p-5">
          <h2 className="font-semibold text-emerald-900">
            Projets sur cet appareil
          </h2>
          {projects.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-700">
              Aucun projet local.{" "}
              <Link href="/app" className="underline">
                Ouvrir le planificateur
              </Link>
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-emerald-900">{p.name}</span>
                  <span className="text-emerald-600">
                    {p.config.widthM}×{p.config.lengthM} m
                    {p.localOnly ? " · local" : " · cloud"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/app"
            className="mt-4 inline-block text-sm font-medium text-emerald-700 underline"
          >
            ← Retour au planificateur
          </Link>
        </section>

        <section className="rounded-2xl border border-violet-200 bg-violet-50/80 p-5">
          <h2 className="font-semibold text-violet-900">
            Réalisations potager (bientôt)
          </h2>
          <p className="mt-2 text-sm text-violet-800 leading-relaxed">
            Partagez photos et retours d&apos;expérience de votre potager
            planifié avec Irrigate. La table{" "}
            <code className="rounded bg-violet-100 px-1">garden_showcases</code>{" "}
            est déjà prête côté Supabase pour cette V2.
          </p>
        </section>

        <Footer />
      </main>
    </>
  );
}
