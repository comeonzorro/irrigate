import Link from "next/link";

export function GuestModeBanner() {
  return (
    <section className="mb-6 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
        Aperçu gratuit
      </p>
      <h2 className="mt-1 text-xl font-bold text-amber-950">
        Créez un compte pour planifier votre potager
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-amber-900">
        Inscrivez-vous gratuitement pour débloquer le catalogue de variétés,
        le plan 2D/3D, le calcul d&apos;arrosage et la sauvegarde cloud sur le
        web et l&apos;app iOS.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/compte"
          className="inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Créer un compte gratuit
        </Link>
        <Link
          href="/compte"
          className="inline-flex rounded-xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
        >
          Se connecter
        </Link>
      </div>
    </section>
  );
}
