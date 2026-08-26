import { APP_STORE_LABEL, APP_STORE_URL } from "@/lib/app-store";

type AppStoreCtaVariant = "banner" | "button" | "inline" | "card";

interface AppStoreCtaProps {
  variant?: AppStoreCtaVariant;
  className?: string;
}

function AppStoreLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export function AppStoreCta({
  variant = "button",
  className = "",
}: AppStoreCtaProps) {
  if (variant === "banner") {
    return (
      <div
        className={`rounded-2xl border border-emerald-300/60 bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white shadow-lg shadow-emerald-900/20 ${className}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Nouveau · Gratuit
            </p>
            <p className="mt-1 text-lg font-semibold">
              L&apos;app Irrigate est sur l&apos;App Store
            </p>
            <p className="mt-1 text-sm text-emerald-50/90">
              Planifiez votre potager et synchronisez vos projets depuis votre
              iPhone ou iPad.
            </p>
          </div>
          <AppStoreLink className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50">
            <AppleIcon className="h-5 w-5" />
            {APP_STORE_LABEL}
          </AppStoreLink>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <section
        className={`rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm ${className}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-emerald-900">
              Application Irrigate (iOS)
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-emerald-800">
              Même planificateur, en poche. Vue 3D native, sync cloud avec votre
              compte — <strong>100&nbsp;% gratuite</strong>.
            </p>
          </div>
          <AppStoreLink className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
            <AppleIcon className="h-5 w-5" />
            {APP_STORE_LABEL}
          </AppStoreLink>
        </div>
      </section>
    );
  }

  if (variant === "inline") {
    return (
      <AppStoreLink
        className={`inline-flex items-center gap-1.5 font-medium text-emerald-700 underline-offset-2 hover:text-emerald-900 hover:underline ${className}`}
      >
        <AppleIcon className="h-4 w-4" />
        App Irrigate (App Store)
      </AppStoreLink>
    );
  }

  return (
    <AppStoreLink
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 ${className}`}
    >
      <AppleIcon className="h-4 w-4" />
      {APP_STORE_LABEL}
    </AppStoreLink>
  );
}
