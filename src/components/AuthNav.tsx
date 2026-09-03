"use client";

import Link from "next/link";
import { useAuthSession } from "@/lib/useAuthSession";

export function AuthNav() {
  const { user, loading, signOut, configured } = useAuthSession();

  if (!configured || loading) {
    return null;
  }

  if (!user) {
    return (
      <Link
        href="/compte"
        className="hidden text-emerald-200 hover:text-white md:inline"
      >
        Mon compte
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href="/compte"
        className="max-w-[10rem] truncate text-emerald-200 hover:text-white"
        title={user.email ?? "Mon compte"}
      >
        {user.email}
      </Link>
      <button
        type="button"
        onClick={() => void signOut()}
        className="rounded-lg border border-emerald-400/50 px-2.5 py-1 text-emerald-100 transition hover:border-white hover:text-white"
      >
        Déconnexion
      </button>
    </div>
  );
}
