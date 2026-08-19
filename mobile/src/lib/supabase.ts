import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export function isSupabaseConfigured(): boolean {
  return Boolean(extra.supabaseUrl && extra.supabaseAnonKey);
}

export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(extra.supabaseUrl as string, extra.supabaseAnonKey as string, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}
