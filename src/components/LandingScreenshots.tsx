import Image from "next/image";
import Link from "next/link";
import { LANDING_SCREENSHOTS } from "@/lib/landing-screenshots";

export function LandingScreenshots() {
  return (
    <section
      aria-labelledby="screenshots-heading"
      className="bg-white px-4 py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            L&apos;application
          </p>
          <h2
            id="screenshots-heading"
            className="mt-2 text-3xl font-bold text-emerald-950"
          >
            Tout ce qu&apos;il faut pour planifier
          </h2>
          <p className="mt-3 leading-relaxed text-emerald-800">
            Plan 2D, vue 3D, choix des variétés et calcul de l&apos;arrosage :
            le planificateur Irrigate guide chaque étape.
          </p>
        </div>

        <ul className="mt-12 space-y-16">
          {LANDING_SCREENSHOTS.map((shot, index) => (
            <li
              key={shot.src}
              className={`flex flex-col items-center gap-8 lg:gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <div className="w-full max-w-sm shrink-0 overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-emerald-50 shadow-xl shadow-emerald-950/10">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={800}
                  height={1400}
                  className="h-auto w-full"
                />
              </div>
              <div className="max-w-lg text-center lg:text-left">
                <h3 className="text-2xl font-bold text-emerald-950">
                  {shot.title}
                </h3>
                <p className="mt-3 leading-relaxed text-emerald-800">
                  {shot.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <Link
            href="/app"
            className="inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-800"
          >
            Essayer le planificateur →
          </Link>
        </div>
      </div>
    </section>
  );
}
