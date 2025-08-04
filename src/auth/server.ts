import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ✅ Create the Supabase server client
export async function createClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            if (typeof cookieStore.getAll === "function") {
              return cookieStore.getAll();
            }
            return [];
          } catch (err) {
            console.error("❌ getAll error:", err);
            return [];
          }
        },
        setAll() {
          // Server environment can't set cookies, so we skip it
          console.warn("⚠ setAll skipped on server");
        },
      },
    }
  );

  return supabase;
}

// ✅ Fetch the user from Supabase
export async function getUser() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("❌ getUser error:", error.message);
      return null;
    }

    return data.user;
  } catch (err) {
    console.error("❌ Unexpected getUser error:", err);
    return null;
  }
}