import Link from "next/link";
import { AppStoreCta } from "@/components/AppStoreCta";
import { AuthNav } from "@/components/AuthNav";

const TOOL_LINKS = [
  { href: "/calendrier", label: "Calendrier" },
  { href: "/compost", label: "Compost" },
  { href: "/compte", label: "Mon espace" },
] as const;

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
        <nav className="flex shrink-0 items-center gap-2 text-sm sm:gap-3">
          <Link
            href="/app"
            className="hidden text-emerald-200 hover:text-white sm:inline"
          >
            Planificateur
          </Link>
          {TOOL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-emerald-200 hover:text-white md:inline"
            >
              {link.label}
            </Link>
          ))}
          <AuthNav />
          <AppStoreCta
            variant="button"
            className="!bg-white !px-3 !py-2 !text-emerald-900 hover:!bg-emerald-50 sm:!px-4"
          />
          <Link
            href="/mentions-legales"
            className="hidden text-emerald-200 hover:text-white lg:inline"
          >
            Mentions légales
          </Link>
        </nav>
      </div>
    </header>
  );
}
