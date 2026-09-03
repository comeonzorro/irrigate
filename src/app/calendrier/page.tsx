import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeasonCalendarView } from "@/components/SeasonCalendarView";

export default function CalendrierPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-10">
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-emerald-950">
          Calendrier des saisons
        </h1>
        <p className="mt-2 max-w-2xl text-emerald-800">
          Quand semer, planter et récolter selon votre région. Affinez avec votre
          code postal dans le planificateur.
        </p>
        <div className="mt-8">
          <SeasonCalendarView />
        </div>
      </main>
      <Footer />
    </>
  );
}
