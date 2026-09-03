"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { locatePostalCode } from "@/lib/api/client";
import type { CityAccess } from "@/lib/projects/types";
import { getCityAccess, setCityAccess, ensureDefaultProject } from "@/lib/projects/storage";
import { HERO_IMAGE } from "@/lib/landing-images";
import { AppStoreCta } from "@/components/AppStoreCta";
import { Footer } from "@/components/Footer";
import { LandingGallery } from "@/components/LandingGallery";

export function CityGateLanding() {
  const router = useRouter();
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getCityAccess()) {
      router.replace("/app");
    }
  }, [router]);

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
      router.push("/app");
    },
    [postalCode, router]
  );

  return (
    <div className="relative min-h-screen">
      {/* Hero avec photo de fond */}
      <section className="relative flex min-h-screen flex-col">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={HERO_IMAGE.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/55 via-emerald-900/45 to-emerald-950/70" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
          <div className="w-full max-w-lg">
            <AppStoreCta variant="banner" />
          </div>

          <div className="w-full max-w-lg rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Bienvenue sur Irrigate
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
                  className="mt-2 w-full rounded-xl border border-emerald-200/80 bg-white/90 px-4 py-3 text-lg tracking-widest focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
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

          <a
            href="#gallery"
            className="mt-2 text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
          >
            Découvrir Irrigate en images ↓
          </a>
        </div>
      </section>

      <div id="gallery">
        <LandingGallery />
      </div>

      <Footer />
    </div>
  );
}
