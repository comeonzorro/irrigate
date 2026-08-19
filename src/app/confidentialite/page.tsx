import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Irrigate",
  description:
    "Comment Irrigate traite vos données : code postal, paramètres de parcelle, application mobile et site irrigate.fr.",
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
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

        <h1>Politique de confidentialité</h1>
        <p className="text-sm text-emerald-600">
          Dernière mise à jour : 19 août 2026 · Applicable au site irrigate.fr
          et à l&apos;application mobile Irrigate (iOS).
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          <strong>Léo Le Coguic</strong>
          <br />
          1 rue George V, 35400 Saint-Malo, France
          <br />
          <a href="mailto:contact@irrigate.fr">contact@irrigate.fr</a>
        </p>
        <p>
          Coordonnées légales complètes :{" "}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>

        <h2>2. Données que nous traitons</h2>
        <p>
          Irrigate est un outil de simulation. <strong>Nous ne créons pas de compte utilisateur</strong>{" "}
          et ne vendons pas vos données.
        </p>
        <ul>
          <li>
            <strong>Code postal</strong> (5 chiffres) — pour déterminer la zone
            climatique et adapter le catalogue de variétés. Non stocké de façon
            permanente côté serveur au-delà du traitement de la requête.
          </li>
          <li>
            <strong>Paramètres de parcelle</strong> — dimensions, exposition,
            type de sol, cultures choisies, mode d&apos;irrigation, option
            serre. Envoyés à nos serveurs uniquement pour calculer le plan et
            les estimations affichés.
          </li>
          <li>
            <strong>Données techniques</strong> — logs hébergeur (adresse IP,
            horodatage, user-agent) conservés par Vercel pour la sécurité et
            le bon fonctionnement, durée limitée conformément à leur politique.
          </li>
        </ul>
        <p>
          L&apos;application mobile communique avec les mêmes API que le site.
          Aucune donnée de localisation GPS n&apos;est collectée.
        </p>

        <h2>3. Finalités et base légale</h2>
        <ul>
          <li>Fournir le service de planification (intérêt légitime / exécution du service).</li>
          <li>Améliorer la fiabilité et la sécurité (intérêt légitime).</li>
        </ul>
        <p>Nous n&apos;utilisons pas vos données pour de la publicité ciblée.</p>

        <h2>4. Partage avec des tiers</h2>
        <p>
          Données hébergées par <strong>Vercel Inc.</strong> (États-Unis) avec
          garanties contractuelles appropriées. Aucun partage avec des
          régies publicitaires ou des courtiers de données.
        </p>

        <h2>5. Durée de conservation</h2>
        <p>
          Les requêtes API sont traitées de manière éphémère. Les logs
          techniques sont conservés le temps nécessaire au diagnostic (généralement
          moins de 30 jours).
        </p>

        <h2>6. Vos droits (RGPD)</h2>
        <p>
          Accès, rectification, effacement, opposition, limitation et portabilité
          : écrivez à{" "}
          <a href="mailto:contact@irrigate.fr">contact@irrigate.fr</a>. Réponse
          sous un mois. Réclamation possible auprès de la CNIL (
          <a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">
            cnil.fr
          </a>
          ).
        </p>

        <h2>7. Mineurs</h2>
        <p>
          Le service s&apos;adresse au grand public. Nous ne collectons pas
          sciemment de données d&apos;enfants de moins de 15 ans.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Le site peut utiliser des cookies strictement nécessaires à
          l&apos;hébergement. Aucun cookie publicitaire par défaut. Voir aussi
          les <Link href="/mentions-legales">mentions légales</Link>.
        </p>

        <h2>9. Modifications</h2>
        <p>
          Cette politique peut être mise à jour. La date en tête de page indique
          la dernière révision.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions confidentialité :{" "}
          <a href="mailto:contact@irrigate.fr">contact@irrigate.fr</a> ·{" "}
          <Link href="/assistance">Centre d&apos;assistance</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
