import { createClient } from '@supabase/supabase-js';

// PRODUCTION CREDENTIALS ONLY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase Environment Variables are missing. Production Mode will not function.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
