import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Server-only Supabase client using the service_role key.
// NEVER import this into a client component — the service key bypasses RLS.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!serviceRoleKey) {
  // Fail loudly at startup rather than silently using the anon key.
  console.warn('[supabase-server] SUPABASE_SERVICE_ROLE_KEY is not set — admin writes will fail.')
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
