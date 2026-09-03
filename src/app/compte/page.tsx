"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppStoreCta } from "@/components/AppStoreCta";
import { AuthPanel } from "@/components/AuthPanel";
import { useEffect, useState } from "react";
import { loadProjectStore } from "@/lib/projects/storage";
import type { SavedProject } from "@/lib/projects/types";

const HUB_CARDS = [
  {
    href: "/compte/projets",
    emoji: "🗂️",
    title: "Mes projets",
    description: "Galerie de tous vos potagers — ouvrez-en un en un clic.",
  },
  {
    href: "/compte/materiel",
    emoji: "🛠️",
    title: "Inventaire matériel",
    description: "Cochez ce que vous possédez déjà pour affiner les achats.",
  },
  {
    href: "/compte/journal",
    emoji: "📓",
    title: "Journal de suivi",
    description: "Récoltes, difficultés et observations au fil des saisons.",
  },
  {
    href: "/calendrier",
    emoji: "📅",
    title: "Calendrier des saisons",
    description: "Quand semer, planter et récolter selon votre région.",
  },
  {
    href: "/compost",
    emoji: "♻️",
    title: "Pas-à-pas compost",
    description: "Guides étape par étape pour fabriquer votre compost.",
  },
  {
    href: "/app",
    emoji: "🌱",
    title: "Planificateur",
    description: "Dimensionnez parcelle, cultures et irrigation.",
  },
] as const;

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

        <AppStoreCta variant="card" />

        <section className="grid gap-4 sm:grid-cols-2">
          {HUB_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden="true">
                {card.emoji}
              </span>
              <h2 className="mt-2 font-semibold text-emerald-900">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-emerald-700">{card.description}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-emerald-900">
              Projets sur cet appareil
            </h2>
            <Link
              href="/compte/projets"
              className="text-sm font-medium text-emerald-700 underline"
            >
              Voir la galerie →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-700">
              Aucun projet local.{" "}
              <Link href="/app" className="underline">
                Ouvrir le planificateur
              </Link>
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {projects.slice(0, 5).map((p) => (
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
        </section>

        <Footer />
      </main>
    </>
  );
}
