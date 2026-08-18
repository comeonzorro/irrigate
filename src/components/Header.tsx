export function Header() {
  return (
    <header className="border-b border-emerald-200/50 bg-emerald-900/95 px-4 py-5 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            💧 Irrigate
          </h1>
          <p className="text-sm text-emerald-200">
            Planifiez votre potager, optimisez l&apos;arrosage, maximisez la
            récolte
          </p>
        </div>
        <span className="hidden rounded-full bg-emerald-700 px-3 py-1 text-xs sm:inline">
          MVP · V1
        </span>
      </div>
    </header>
  );
}
