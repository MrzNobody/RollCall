import { createClient } from '@supabase/supabase-js';

// SECURE CREDENTIALS FROM .ENV
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// INDESTRUCTIBLE CLIENT WRAPPER
// If keys are missing, it returns a "Mock" object that won't crash the UI
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: { user: null }, error: 'Demo Mode Active' }),
        signOut: async () => {}
      },
      from: () => ({
        select: () => ({ order: () => ({ data: [], error: null }) }),
        insert: () => ({ data: null, error: null }),
        upsert: () => ({ data: null, error: null })
      })
    };
