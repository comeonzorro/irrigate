import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-emerald-200 bg-white/60 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:justify-between">
        <div>
          <p className="font-semibold text-emerald-900">Irrigate.fr</p>
          <p className="mt-1 max-w-sm text-sm text-emerald-700">
            Planificateur de potager et d&apos;irrigation. Estimations
            indicatives — consultez un professionnel pour votre installation.
          </p>
        </div>
        <nav aria-label="Liens légaux" className="flex flex-col gap-2 text-sm">
          <Link
            href="/assistance"
            className="text-emerald-800 underline-offset-2 hover:underline"
          >
            Assistance
          </Link>
          <Link
            href="/mentions-legales"
            className="text-emerald-800 underline-offset-2 hover:underline"
          >
            Mentions légales
          </Link>
          <Link
            href="/confidentialite"
            className="text-emerald-800 underline-offset-2 hover:underline"
          >
            Politique de confidentialité
          </Link>
          <a
            href="mailto:contact@irrigate.fr"
            className="text-emerald-800 underline-offset-2 hover:underline"
          >
            contact@irrigate.fr
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-emerald-500">
        © {new Date().getFullYear()} Irrigate — Tous droits réservés
      </p>
    </footer>
  );
}
