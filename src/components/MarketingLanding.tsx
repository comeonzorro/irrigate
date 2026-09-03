import Image from "next/image";
import Link from "next/link";
import { HERO_IMAGE } from "@/lib/landing-images";
import { AppStoreCta } from "@/components/AppStoreCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LandingGallery } from "@/components/LandingGallery";
import { LandingScreenshots } from "@/components/LandingScreenshots";

const FEATURES = [
  {
    title: "Adapté à votre région",
    description:
      "Variétés, climat et recommandations calibrés sur votre code postal.",
  },
  {
    title: "Irrigation visualisée",
    description:
      "Réseau goutte-à-goutte en 2D et 3D, avec longueur de tuyaux et nombre de goutteurs.",
  },
  {
    title: "Eau & rentabilité",
    description:
      "Estimez consommation, coût mensuel et rendement de votre potager.",
  },
];

const TOOLS = [
  {
    href: "/calendrier",
    emoji: "📅",
    title: "Calendrier des saisons",
    description: "Semis, plantations et récoltes mois par mois.",
  },
  {
    href: "/compost",
    emoji: "♻️",
    title: "Pas-à-pas compost",
    description: "Fabriquez et utilisez votre compost au potager.",
  },
  {
    href: "/compte/materiel",
    emoji: "🛠️",
    title: "Inventaire matériel",
    description: "Cochez votre équipement et exportez la liste d'achats en PDF.",
  },
  {
    href: "/compte/journal",
    emoji: "📓",
    title: "Journal de suivi",
    description: "Notez récoltes et difficultés pour chaque projet.",
  },
] as const;

export function MarketingLanding() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={HERO_IMAGE.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/40" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:py-28 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
              Planificateur de potager intelligent
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Planifiez, arrosez, récoltez
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-emerald-100">
              Irrigate vous aide à concevoir votre potager, choisir les bonnes
              variétés et dimensionner votre réseau d&apos;irrigation — sur le
              web ou l&apos;app iOS gratuite.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/app"
                className="inline-flex rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-900 transition hover:bg-emerald-50"
              >
                Ouvrir le planificateur →
              </Link>
              <AppStoreCta
                variant="button"
                className="!bg-emerald-800 !text-white hover:!bg-emerald-900"
              />
            </div>
          </div>

          <div className="hidden w-full max-w-xs shrink-0 lg:block">
            <AppStoreCta variant="banner" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-emerald-200/60 bg-emerald-50/80 px-4 py-14">
        <ul className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-emerald-950">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-b border-emerald-200/60 bg-white px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-emerald-950">
            Outils potager
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-emerald-800">
            Calendrier, compost, inventaire et journal — gratuits sur le web.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="flex h-full flex-col rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-5 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {tool.emoji}
                  </span>
                  <h3 className="mt-3 font-bold text-emerald-950">
                    {tool.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-emerald-800">
                    {tool.description}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-emerald-700">
                    Découvrir →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LandingScreenshots />
      <LandingGallery />

      {/* CTA final */}
      <section className="bg-gradient-to-br from-emerald-700 to-teal-700 px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Prêt à planter ?</h2>
        <p className="mx-auto mt-3 max-w-lg leading-relaxed text-emerald-100">
          Entrez votre code postal et commencez à planifier votre potager en
          quelques minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/app"
            className="inline-flex rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-900 transition hover:bg-emerald-50"
          >
            Commencer gratuitement →
          </Link>
          <AppStoreCta
            variant="button"
            className="!bg-emerald-900 !text-white hover:!bg-emerald-950"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
