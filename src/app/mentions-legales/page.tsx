import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales — Irrigate.fr",
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-10 prose prose-emerald">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-emerald-700 no-underline hover:underline"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1>Mentions légales</h1>
        <p className="text-sm text-emerald-600">Dernière mise à jour : août 2026</p>

        <h2>1. Éditeur du site</h2>
        <p>
          Le site <strong>irrigate.fr</strong> est édité par :
        </p>
        <ul>
          <li>Raison sociale / nom : <em>[À compléter — ex. Irrigate SAS ou votre nom]</em></li>
          <li>Adresse : <em>[À compléter]</em></li>
          <li>SIRET : <em>[À compléter]</em></li>
          <li>Directeur de la publication : <em>[À compléter]</em></li>
          <li>Contact : <a href="mailto:contact@irrigate.fr">contact@irrigate.fr</a></li>
        </ul>

        <h2>2. Hébergement</h2>
        <p>
          Le site est hébergé par <strong>Vercel Inc.</strong>
          <br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
          <br />
          <a href="https://vercel.com" rel="noopener noreferrer" target="_blank">
            vercel.com
          </a>
        </p>

        <h2>3. Objet du service</h2>
        <p>
          Irrigate.fr propose un outil gratuit de simulation pour planifier un
          potager, estimer les besoins en eau et visualiser un réseau
          d&apos;irrigation. Les résultats (rendements, coûts, produits
          suggérés) sont des <strong>estimations indicatives</strong> et ne
          constituent ni un conseil agronomique professionnel ni une offre
          commerciale ferme.
        </p>

        <h2>4. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du site (textes, interface, algorithmes, visuels) est
          protégé par le droit d&apos;auteur. Toute reproduction, extraction ou
          réutilisation du service ou de ses résultats à des fins commerciales
          sans autorisation écrite préalable est interdite.
        </p>

        <h2 id="confidentialite">5. Données personnelles</h2>
        <p>
          Les paramètres saisis (code postal, dimensions de parcelle, cultures)
          sont traités pour afficher des recommandations adaptées. Ils ne sont
          pas vendus à des tiers. Le code postal sert uniquement à déterminer
          une zone climatique régionale.
        </p>
        <p>
          Conformément au RGPD, vous pouvez exercer vos droits d&apos;accès,
          de rectification et de suppression en écrivant à{" "}
          <a href="mailto:contact@irrigate.fr">contact@irrigate.fr</a>.
        </p>
        <p>
          Des cookies techniques peuvent être déposés par l&apos;hébergeur pour
          le bon fonctionnement du site. Aucun cookie publicitaire n&apos;est
          déposé par défaut.
        </p>

        <h2>6. Responsabilité</h2>
        <p>
          L&apos;éditeur ne saurait être tenu responsable des dommages directs ou
          indirects liés à l&apos;utilisation des simulations (installation
          d&apos;irrigation, choix de cultures, achats de matériel). L&apos;utilisateur
          reste seul responsable de ses décisions et de la conformité de ses
          installations (eau potable / eau de pluie, normes locales).
        </p>

        <h2>7. Liens et produits recommandés</h2>
        <p>
          Les produits affichés sont des suggestions génériques à titre
          informatif. Irrigate.fr n&apos;est pas revendeur et ne perçoit pas de
          commission sauf mention contraire future. Les prix indiqués sont
          estimatifs.
        </p>
      </main>
      <Footer />
    </>
  );
}
