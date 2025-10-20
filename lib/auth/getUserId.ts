import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getUserId() {
  if (process.env.DEV_USER_ID) return process.env.DEV_USER_ID; // dev fallback

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {/* ignore in Server Components */}
        }
      }
    }
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("Unauthorized");
  return data.user.id;
}
