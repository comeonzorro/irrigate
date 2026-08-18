import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-emerald-200/50 bg-emerald-900/95 px-4 py-5 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="min-w-0 hover:opacity-90">
          <h1 className="text-2xl font-bold tracking-tight">💧 Irrigate.fr</h1>
          <p className="text-sm text-emerald-200">
            Planifiez votre potager, optimisez l&apos;arrosage
          </p>
        </Link>
        <nav className="hidden shrink-0 items-center gap-4 text-sm sm:flex">
          <Link
            href="/mentions-legales"
            className="text-emerald-200 hover:text-white"
          >
            Mentions légales
          </Link>
        </nav>
      </div>
    </header>
  );
}
