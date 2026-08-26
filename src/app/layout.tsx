import type { Metadata } from "next";
import { Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Irrigate.fr — Planificateur de potager intelligent",
  description:
    "Planifiez votre potager, calculez l'arrosage idéal et visualisez votre réseau d'irrigation en 2D et 3D. Application iOS gratuite sur l'App Store.",
  metadataBase: new URL("https://irrigate.fr"),
  openGraph: {
    title: "Irrigate.fr",
    description: "Planificateur de potager et d'irrigation",
    url: "https://irrigate.fr",
    siteName: "Irrigate.fr",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${nunito.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-emerald-50 to-amber-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
