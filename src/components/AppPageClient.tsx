"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { AppShell } from "@/components/AppShell";
import { CityGate } from "@/components/CityGate";
import { getCityAccess } from "@/lib/projects/storage";
import type { CityAccess } from "@/lib/projects/types";

export function AppPageClient() {
  const [city, setCity] = useState<CityAccess | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setCity(getCityAccess());
    setChecked(true);
  }, []);

  const handleAccessGranted = useCallback((access: CityAccess) => {
    setCity(access);
  }, []);

  if (!checked) {
    return (
      <>
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center text-emerald-700">
          Chargement…
        </div>
      </>
    );
  }

  if (!city) {
    return (
      <>
        <Header />
        <main>
          <CityGate onAccessGranted={handleAccessGranted} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <AppShell />
      </main>
    </>
  );
}
