import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  };
};

export const isSupabaseConfigured = (): boolean => {
  const config = getSupabaseConfig();
  return Boolean(
    config.url &&
    config.anonKey &&
    config.url !== 'https://seu-projeto.supabase.co' &&
    config.anonKey !== 'sua-chave-anonima-publica'
  );
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    const config = getSupabaseConfig();
    supabaseInstance = createClient(config.url, config.anonKey);
  }
  return supabaseInstance;
};

export const databaseStatus = {
  get isConfigured() {
    return isSupabaseConfigured();
  },
  get driver() {
    return isSupabaseConfigured() ? 'Supabase PostgreSQL (Ativo)' : 'Armazenamento Local';
  },
  rlsEnforced: true,
};
