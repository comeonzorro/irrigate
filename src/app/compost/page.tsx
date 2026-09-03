import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompostGuide } from "@/components/CompostGuide";

export default function CompostPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-10">
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-emerald-950">
          Pas-à-pas compost
        </h1>
        <p className="mt-2 text-emerald-800">
          Guides pas à pas pour fabriquer et utiliser votre compost au potager.
        </p>
        <div className="mt-8">
          <CompostGuide />
        </div>
      </main>
      <Footer />
    </>
  );
}
