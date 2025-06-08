import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Add debugging for environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options = {}) => {
      console.log('Supabase fetch request:', url);
      return fetch(url, {
        ...options,
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000)
      }).catch(error => {
        console.error('Supabase fetch error:', error);
        console.error('Request URL:', url);
        console.error('Request options:', options);
        throw error;
      });
    }
  }
});

// Test connection on initialization
supabase.auth.getSession().catch(error => {
  console.error('Initial Supabase connection test failed:', error);
});