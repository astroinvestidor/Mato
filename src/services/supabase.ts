/**
 * MATO Platform - Supabase Client & Database Services
 * 
 * Configured with environment variable detection and fallback to a resilient
 * client architecture for local demonstration and automated testing.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mock-mato.supabase.co',
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-mato',
  };
};

export const isSupabaseConfigured = (): boolean => {
  const config = getSupabaseConfig();
  return (
    config.url !== 'https://mock-mato.supabase.co' &&
    config.anonKey !== 'mock-anon-key-mato' &&
    Boolean(config.url && config.anonKey)
  );
};

export const databaseStatus = {
  isConfigured: isSupabaseConfigured(),
  driver: isSupabaseConfigured() ? 'Supabase PostgREST + Auth' : 'Local Mock Reactive Store',
  rlsEnforced: true,
  currentUserId: 'usr_mateus_silva_demo',
};
