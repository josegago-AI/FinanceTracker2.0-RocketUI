// lib/supabase/server-readonly.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * SSR-safe read-only client using anon key + cookies for session.
 * No writes here; use your supabaseService() for mutations.
 */
export function createReadOnlyClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Ignore writes in Server Components (Next may call this where setting isn't allowed)
        setAll() {},
      },
    }
  );
}
