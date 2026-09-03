"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function useAuthSession() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured());

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error) {
        setUser(null);
      } else {
        setUser(data.user ?? null);
      }
      setLoading(false);
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      return "Supabase non configuré.";
    }

    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      return error.message;
    }

    setUser(null);
    router.refresh();
    return null;
  }, [router]);

  return { user, loading, signOut, configured: isSupabaseConfigured() };
}
