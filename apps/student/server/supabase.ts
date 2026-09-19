import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.SUPABASE_ANON_KEY
  )?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] Initialized client with URL:', supabaseUrl);
    return supabaseClient;
  } catch (err) {
    console.error('[Supabase] Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.SUPABASE_URL && 
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  );
}
