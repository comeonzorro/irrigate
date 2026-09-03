import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EquipmentChecklist } from "@/components/EquipmentChecklist";

export default function MaterielPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-10">
        <Link href="/compte" className="text-sm text-emerald-700 hover:underline">
          ← Mon espace
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-emerald-950">
          Mon inventaire matériel
        </h1>
        <p className="mt-2 text-emerald-800">
          Cochez ce que vous possédez déjà pour filtrer les listes d&apos;achats
          dans le planificateur.
        </p>
        <div className="mt-8">
          <EquipmentChecklist />
        </div>
      </main>
      <Footer />
    </>
  );
}
