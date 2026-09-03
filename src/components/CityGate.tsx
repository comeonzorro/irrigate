"use client";

import { useCallback, useState } from "react";
import { locatePostalCode } from "@/lib/api/client";
import type { CityAccess } from "@/lib/projects/types";
import { setCityAccess, ensureDefaultProject } from "@/lib/projects/storage";
import { AppStoreCta } from "@/components/AppStoreCta";

interface CityGateProps {
  onAccessGranted: (city: CityAccess) => void;
}

export function CityGate({ onAccessGranted }: CityGateProps) {
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const cp = postalCode.replace(/\D/g, "").slice(0, 5);
      if (cp.length !== 5) {
        setError("Entrez un code postal français à 5 chiffres.");
        return;
      }
      setLoading(true);
      setError(null);
      const location = await locatePostalCode(cp);
      setLoading(false);
      if (!location) {
        setError("Code postal non reconnu.");
        return;
      }

      const city: CityAccess = {
        postalCode: location.postalCode,
        regionId: location.regionId,
        cityHint: location.cityHint,
        regionName: location.regionName,
        locatedAt: new Date().toISOString(),
      };
      setCityAccess(city);
      ensureDefaultProject(city);
      onAccessGranted(city);
    },
    [postalCode, onAccessGranted]
  );

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-emerald-200/80 bg-white p-8 shadow-xl shadow-emerald-950/5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Planificateur
        </p>
        <h1 className="mt-2 text-3xl font-bold text-emerald-950">
          Où se situe votre potager ?
        </h1>
        <p className="mt-3 leading-relaxed text-emerald-800">
          Indiquez votre code postal pour adapter variétés, climat et
          recommandations à votre région.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label htmlFor="gate-postal" className="block">
            <span className="text-sm font-medium text-emerald-900">
              Code postal
            </span>
            <input
              id="gate-postal"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder="94450"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5));
                setError(null);
              }}
              className="mt-2 w-full rounded-xl border border-emerald-200/80 bg-white px-4 py-3 text-lg tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Localisation…" : "Accéder au planificateur →"}
          </button>
        </form>

        <div className="mt-6 space-y-4 border-t border-emerald-200/80 pt-6">
          <p className="text-center text-sm text-emerald-800">
            Ou téléchargez l&apos;app gratuite pour iPhone et iPad
          </p>
          <div className="flex justify-center">
            <AppStoreCta variant="button" />
          </div>
        </div>

        <p className="mt-6 text-xs text-emerald-600">
          France métropolitaine · Sauvegarde cloud via votre compte sur{" "}
          <span className="font-medium">/compte</span>
        </p>
      </div>
    </div>
  );
}
