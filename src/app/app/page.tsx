import { Header } from "@/components/Header";
import { AppShell } from "@/components/AppShell";

export default function AppPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <AppShell />
      </main>
    </>
  );
}
