import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project-id.supabase.co' || supabaseAnonKey === 'your-anon-key-here') {
  console.warn('Supabase environment variables not configured. Using demo mode.')
  // Create a mock client for demo purposes
  export const supabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode - please configure Supabase' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode - please configure Supabase' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }) }) }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode' } }) })
    })
  }
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}