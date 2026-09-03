"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthSession } from "@/lib/useAuthSession";

type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "update-password";

const MIN_PASSWORD_LENGTH = 8;

function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  return null;
}

export function AuthPanel() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, configured } = useAuthSession();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") !== "1") return;

    setMode("update-password");
    const supabase = createClient();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError(
          "Session expirée ou lien déjà utilisé — demandez un nouveau lien de réinitialisation."
        );
      }
    });
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update-password");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearFeedback = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  const signIn = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    clearFeedback();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "E-mail ou mot de passe incorrect."
          : signInError.message
      );
      return;
    }

    setPassword("");
    setEmail(data.user?.email ?? email.trim());
    setMessage("Connexion réussie.");
    router.refresh();
  }, [clearFeedback, email, password, router]);

  const signUp = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    clearFeedback();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/compte`,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");

    if (data.session) {
      setMessage("Compte créé — vous êtes connecté.");
      router.refresh();
      return;
    }

    setMessage(
      "Compte créé. Consultez votre e-mail pour confirmer votre adresse, puis connectez-vous."
    );
    setMode("sign-in");
  }, [clearFeedback, confirmPassword, email, password, router]);

  const sendPasswordReset = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    clearFeedback();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/compte?reset=1")}`,
      }
    );
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage(
      "E-mail de réinitialisation envoyé — consultez votre boîte mail."
    );
  }, [clearFeedback, email]);

  const updatePassword = useCallback(async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    clearFeedback();
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      ok?: boolean;
    };
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Impossible de mettre à jour le mot de passe.");
      return;
    }

    const supabase = createClient();
    if (supabase) {
      await supabase.auth.getSession();
    }

    setPassword("");
    setConfirmPassword("");
    setMode("sign-in");
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/compte");
    }
    setMessage("Mot de passe mis à jour.");
    router.refresh();
  }, [clearFeedback, confirmPassword, password, router]);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    clearFeedback();
    const signOutError = await signOut();
    setLoading(false);

    if (signOutError) {
      setError(signOutError);
      return;
    }

    setMode("sign-in");
    setMessage("Vous êtes déconnecté.");
  }, [clearFeedback, signOut]);

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

  if (authLoading) {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-white p-5">
        <p className="text-sm text-emerald-700">Vérification de la session…</p>
      </section>
    );
  }

  if (user && mode !== "update-password") {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-white p-5">
        <h2 className="font-semibold text-emerald-900">Connecté</h2>
        <p className="mt-1 text-sm text-emerald-700">{user.email}</p>
        <p className="mt-2 text-sm text-emerald-600">
          Vos potagers sont synchronisés entre le site et l&apos;application iOS.
        </p>

        {message ? (
          <p className="mt-3 text-sm text-emerald-700" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              clearFeedback();
              setMode("update-password");
            }}
            className="rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
          >
            Changer le mot de passe
          </button>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={loading}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-emerald-200 px-3 py-2.5 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300";
  const buttonClass =
    "rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60";

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-5">
      <h2 className="font-semibold text-emerald-900">
        {mode === "sign-in" && "Connexion"}
        {mode === "sign-up" && "Créer un compte"}
        {mode === "forgot-password" && "Mot de passe oublié"}
        {mode === "update-password" && "Nouveau mot de passe"}
      </h2>
      <p className="mt-1 text-sm text-emerald-700">
        {mode === "sign-in" &&
          "Connectez-vous avec votre e-mail et votre mot de passe pour synchroniser vos potagers."}
        {mode === "sign-up" &&
          "Choisissez un mot de passe pour accéder à votre compte sur le site et l'app iOS."}
        {mode === "forgot-password" &&
          "Nous vous enverrons un lien pour définir un nouveau mot de passe."}
        {mode === "update-password" &&
          "Définissez un nouveau mot de passe pour sécuriser votre compte."}
      </p>

      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "sign-in") void signIn();
          else if (mode === "sign-up") void signUp();
          else if (mode === "forgot-password") void sendPasswordReset();
          else if (mode === "update-password") void updatePassword();
        }}
      >
        {mode !== "update-password" ? (
          <input
            type="email"
            autoComplete="email"
            required
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        ) : null}

        {mode !== "forgot-password" ? (
          <input
            type="password"
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            required
            placeholder={
              mode === "sign-in"
                ? "Mot de passe"
                : `Mot de passe (min. ${MIN_PASSWORD_LENGTH} caractères)`
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        ) : null}

        {mode === "sign-up" || mode === "update-password" ? (
          <input
            type="password"
            autoComplete="new-password"
            required
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
        ) : null}

        <button
          type="submit"
          disabled={
            loading ||
            (mode !== "update-password" && !email.trim()) ||
            ((mode === "sign-in" ||
              mode === "sign-up" ||
              mode === "update-password") &&
              !password)
          }
          className={buttonClass}
        >
          {loading
            ? "Patientez…"
            : mode === "sign-in"
              ? "Se connecter"
              : mode === "sign-up"
                ? "Créer mon compte"
                : mode === "forgot-password"
                  ? "Envoyer le lien"
                  : "Enregistrer"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 text-sm text-emerald-700" role="status">
          {message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {mode === "sign-in" ? (
          <>
            <button
              type="button"
              className="font-medium text-emerald-700 underline"
              onClick={() => {
                clearFeedback();
                setMode("sign-up");
              }}
            >
              Créer un compte
            </button>
            <button
              type="button"
              className="font-medium text-emerald-700 underline"
              onClick={() => {
                clearFeedback();
                setMode("forgot-password");
              }}
            >
              Mot de passe oublié ?
            </button>
          </>
        ) : null}
        {mode === "sign-up" || mode === "forgot-password" ? (
          <button
            type="button"
            className="font-medium text-emerald-700 underline"
            onClick={() => {
              clearFeedback();
              setMode("sign-in");
            }}
          >
            Déjà un compte ? Se connecter
          </button>
        ) : null}
        {mode === "update-password" && user ? (
          <button
            type="button"
            className="font-medium text-emerald-700 underline"
            onClick={() => {
              clearFeedback();
              setMode("sign-in");
            }}
          >
            Annuler
          </button>
        ) : null}
      </div>
    </section>
  );
}
