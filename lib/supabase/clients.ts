import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE!;

// Use in API routes with end-user auth context
export function supabaseAnon() {
  return createClient(url, anon, { auth: { persistSession: false } });
}

// Use ONLY in server code (API) that needs bulk upserts (CSV import)
export function supabaseService() {
  return createClient(url, service, { auth: { persistSession: false } });
}
