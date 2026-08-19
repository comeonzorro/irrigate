import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Assistance — Irrigate",
  description:
    "FAQ, contact et aide pour utiliser Irrigate : plan potager, irrigation, variétés régionales, application iOS.",
  robots: { index: true, follow: true },
};

const FAQ = [
  {
    q: "Les estimations de rendement et d'eau sont-elles garanties ?",
    a: "Non. Irrigate fournit des simulations indicatives basées sur des moyennes régionales et des paramètres que vous saisissez. Consultez un pépiniériste ou un installateur pour valider vos choix.",
  },
  {
    q: "Pourquoi entrer mon code postal ?",
    a: "Le code postal permet d'adapter le catalogue de variétés à votre climat (Bretagne, Île-de-France, etc.) et d'affiner les recommandations produits.",
  },
  {
    q: "Qu'est-ce que l'option serre / tunnel ?",
    a: "Elle débloque des variétés sensibles au froid (tomates, poivrons, melons…) dans les régions plus fraîches. Le plan tient compte d'un surcoût d'installation estimé.",
  },
  {
    q: "La vue 3D ne répond pas sur mobile",
    a: "Utilisez le bouton « Plein écran » sur le site, ou l'onglet 3D de l'application native. Un doigt pour pivoter, deux doigts pour zoomer et déplacer.",
  },
  {
    q: "Mes données sont-elles vendues ?",
    a: "Non. Nous ne créons pas de compte et ne revendons pas vos paramètres. Détails dans la politique de confidentialité.",
  },
  {
    q: "Puis-je utiliser Irrigate pour une installation professionnelle ?",
    a: "L'outil aide à visualiser un projet ; la conformité hydraulique, le raccordement réseau et les normes locales restent de votre responsabilité ou celle de votre installateur.",
  },
];

export default function AssistancePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-emerald-700 hover:underline"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold text-emerald-900">
          Centre d&apos;assistance
        </h1>
        <p className="mt-2 text-emerald-700">
          Aide pour irrigate.fr et l&apos;application Irrigate (iOS).
        </p>

        <section className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-900">Nous contacter</h2>
          <p className="mt-2 text-emerald-800">
            Email :{" "}
            <a
              href="mailto:contact@irrigate.fr"
              className="font-medium text-emerald-700 underline"
            >
              contact@irrigate.fr
            </a>
          </p>
          <p className="mt-2 text-sm text-emerald-600">
            Délai de réponse habituel : 2 à 5 jours ouvrés.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-emerald-900">
            Questions fréquentes
          </h2>
          <ul className="mt-4 space-y-4">
            {FAQ.map((item) => (
              <li
                key={item.q}
                className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
              >
                <h3 className="font-medium text-emerald-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                  {item.a}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 text-sm text-emerald-700">
          <Link href="/confidentialite" className="underline">
            Politique de confidentialité
          </Link>
          {" · "}
          <Link href="/mentions-legales" className="underline">
            Mentions légales
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
