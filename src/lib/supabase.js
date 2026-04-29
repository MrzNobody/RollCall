import { createClient } from '@supabase/supabase-js';

// Get Keys from Environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// INDESTRUCTIBLE MODE: If keys are missing, we provide a "dummy" client 
// so the app stays alive and can show a UI error instead of a black screen.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
      }
    })
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: new Error('Missing API Keys') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: new Error('Please configure VITE_SUPABASE_URL in Netlify Settings.') }),
        signOut: async () => {}
      },
      from: () => ({
        select: () => ({ order: () => ({ data: [], error: null }) }),
        insert: () => ({ error: new Error('Database disconnected') })
      })
    };

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ RollCall Warning: Supabase API keys are missing. Check your Netlify Environment Variables.');
}
