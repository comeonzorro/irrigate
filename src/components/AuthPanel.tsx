"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/compte`,
      },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Lien magique envoyé — consultez votre boîte mail.");
  }, [email]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  if (!configured) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-semibold text-amber-900">Compte cloud</h2>
        <p className="mt-2 text-sm text-amber-800">
          Supabase n&apos;est pas encore configuré. Ajoutez{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          et{" "}
          <code className="rounded bg-amber-100 px-1">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          sur Vercel pour activer la sauvegarde en ligne.
        </p>
      </section>
    );
  }

  if (user) {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-white p-5">
        <h2 className="font-semibold text-emerald-900">Connecté</h2>
        <p className="mt-1 text-sm text-emerald-700">{user.email}</p>
        <button
          type="button"
          onClick={signOut}
          className="mt-4 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
        >
          Se déconnecter
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-5">
      <h2 className="font-semibold text-emerald-900">Connexion</h2>
      <p className="mt-1 text-sm text-emerald-700">
        Sauvegardez vos projets potager dans le cloud et retrouvez-les sur le
        site et l&apos;app iOS.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          placeholder="vous@exemple.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-emerald-200 px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
        <button
          type="button"
          disabled={loading || !email.trim()}
          onClick={signIn}
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {loading ? "Envoi…" : "Lien magique"}
        </button>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-emerald-700" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
