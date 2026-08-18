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
  title: "Irrigate — Planificateur de potager intelligent",
  description:
    "Définissez votre parcelle, choisissez vos cultures et obtenez le plan d'arrosage parfait avec estimation de rendement.",
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
