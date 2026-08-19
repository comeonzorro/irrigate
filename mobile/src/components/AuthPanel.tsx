import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "../lib/supabase";
import { colors } from "../theme/colors";

type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "update-password";

const MIN_PASSWORD_LENGTH = 8;

function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Minimum ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  return null;
}

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    const { error: signInError } = await supabase.auth.signInWithPassword({
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
    setMessage("Connecté.");
  }, [clearFeedback, email, password]);

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
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");

    if (data.session) {
      setMessage("Compte créé.");
      return;
    }

    setMessage("Compte créé — confirmez votre e-mail puis connectez-vous.");
    setMode("sign-in");
  }, [clearFeedback, confirmPassword, email, password]);

  const sendPasswordReset = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    clearFeedback();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `https://irrigate.fr/auth/callback?next=${encodeURIComponent("/compte?reset=1")}`,
      }
    );
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("E-mail de réinitialisation envoyé.");
  }, [clearFeedback, email]);

  const updatePassword = useCallback(async () => {
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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMode("sign-in");
    setMessage("Mot de passe mis à jour.");
  }, [clearFeedback, confirmPassword, password]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setMode("sign-in");
    clearFeedback();
  }, [clearFeedback]);

  if (!configured) {
    return (
      <View style={[styles.card, styles.warnCard]}>
        <Text style={styles.warnTitle}>Compte cloud</Text>
        <Text style={styles.warnText}>
          Supabase non configuré sur cette build (EXPO_PUBLIC_SUPABASE_*).
        </Text>
      </View>
    );
  }

  if (user && mode !== "update-password") {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Connecté</Text>
        <Text style={styles.subtitle}>{user.email}</Text>
        <View style={styles.row}>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => {
              clearFeedback();
              setMode("update-password");
            }}
          >
            <Text style={styles.secondaryBtnText}>Changer le mot de passe</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => void signOut()}>
            <Text style={styles.secondaryBtnText}>Se déconnecter</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const titles: Record<AuthMode, string> = {
    "sign-in": "Connexion",
    "sign-up": "Créer un compte",
    "forgot-password": "Mot de passe oublié",
    "update-password": "Nouveau mot de passe",
  };

  const submitLabels: Record<AuthMode, string> = {
    "sign-in": "Se connecter",
    "sign-up": "Créer mon compte",
    "forgot-password": "Envoyer le lien",
    "update-password": "Enregistrer",
  };

  const handleSubmit = () => {
    if (mode === "sign-in") void signIn();
    else if (mode === "sign-up") void signUp();
    else if (mode === "forgot-password") void sendPasswordReset();
    else void updatePassword();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titles[mode]}</Text>
      <Text style={styles.subtitle}>
        {mode === "sign-in"
          ? "E-mail et mot de passe pour synchroniser vos potagers."
          : mode === "sign-up"
            ? "Choisissez un mot de passe pour le site et l'app."
            : mode === "forgot-password"
              ? "Lien de réinitialisation par e-mail."
              : "Définissez un nouveau mot de passe."}
      </Text>

      {mode !== "update-password" ? (
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="E-mail"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
        />
      ) : null}

      {mode !== "forgot-password" ? (
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          placeholder={
            mode === "sign-in"
              ? "Mot de passe"
              : `Mot de passe (min. ${MIN_PASSWORD_LENGTH})`
          }
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
        />
      ) : null}

      {mode === "sign-up" || mode === "update-password" ? (
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Confirmer le mot de passe"
          placeholderTextColor="#6b7280"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      ) : null}

      <Pressable
        style={[styles.primaryBtn, loading && styles.disabled]}
        disabled={loading}
        onPress={handleSubmit}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>{submitLabels[mode]}</Text>
        )}
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {mode === "sign-in" ? (
        <View style={styles.links}>
          <Pressable
            onPress={() => {
              clearFeedback();
              setMode("sign-up");
            }}
          >
            <Text style={styles.link}>Créer un compte</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              clearFeedback();
              setMode("forgot-password");
            }}
          >
            <Text style={styles.link}>Mot de passe oublié ?</Text>
          </Pressable>
        </View>
      ) : null}

      {mode === "sign-up" || mode === "forgot-password" ? (
        <Pressable
          onPress={() => {
            clearFeedback();
            setMode("sign-in");
          }}
        >
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  warnCard: {
    borderColor: colors.amberBorder,
    backgroundColor: colors.amber,
  },
  warnTitle: { fontWeight: "700", color: "#92400e", fontSize: 16 },
  warnText: { color: "#92400e", fontSize: 14, lineHeight: 20 },
  title: { fontWeight: "700", color: colors.primaryDark, fontSize: 16 },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: "#fff",
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  secondaryBtnText: { color: colors.text, fontWeight: "600", fontSize: 14 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  links: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  link: { color: colors.primary, fontWeight: "600", fontSize: 14 },
  error: { color: "#b91c1c", fontSize: 14 },
  message: { color: colors.textMuted, fontSize: 14 },
  disabled: { opacity: 0.6 },
});
