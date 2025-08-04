import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // ✅ Fully safe fallback: return empty array
          return [];
        },
        setAll() {
          // ✅ Suppress setting cookies in server (not supported)
          console.warn("⚠ Skipping setAll on server");
        },
      },
    }
  );

  return supabase;
}

export async function getUser() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("❌ getUser error:", error.message);
      return null;
    }
    return data.user;
  } catch (err) {
    console.error("❌ Unexpected error in getUser:", err);
    return null;
  }
}