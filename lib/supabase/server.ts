// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Full read/write server client.
 * Use this in server actions or route handlers where cookie writes are OK.
 */
export function createClient(cookieStore = cookies()) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

/**
 * Read-only server client for Server Component render paths.
 * It reads auth cookies but does NOT attempt to write cookies.
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
        setAll() {
          // no-op in RSC to avoid "set cookie during render" issues
        },
      },
    }
  );
}

/** Helper to fetch the current user in RSC-friendly way */
export async function getSessionUser() {
  const sb = createReadOnlyClient();
  const { data: { user } } = await sb.auth.getUser();
  return user ?? null;
}
