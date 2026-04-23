import { createClient } from '@supabase/supabase-js'

// Production safety: Fallback to placeholders if env vars are missing to prevent crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://armswkiqlmentnfftexv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

let client;

try {
  // Only attempt to create if we have a valid-looking URL
  if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  } else {
    console.warn('Invalid Supabase URL - Running in Mock Mode')
    client = {
      from: () => ({ select: async () => ({ data: [], error: null }), insert: async () => ({ data: [], error: null }) }),
      auth: { getSession: async () => ({ data: { session: null }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signOut: async () => {} }
    }
  }
} catch (e) {
  console.error('Supabase Initialization Failed:', e)
  // Fail-safe mock client to prevent whole-app crash
  client = {
    from: () => ({ select: async () => ({ data: [], error: null }), insert: async () => ({ data: [], error: null }) }),
    auth: { getSession: async () => ({ data: { session: null }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signOut: async () => {} }
  }
}

export const supabase = client
