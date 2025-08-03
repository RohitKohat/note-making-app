import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { pathname, searchParams } = new URL(request.url);

  const isAuthRoute = pathname === "/login" || pathname === "/sign-up";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
  }

  if (!searchParams.get("noteId") && pathname === "/" && user) {
    const newestNoteRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`
    );
    const { newestNoteId } = await newestNoteRes.json();

    const url = request.nextUrl.clone();

    if (newestNoteId) {
      url.searchParams.set("noteId", newestNoteId);
    } else {
      const newNoteRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const { noteId } = await newNoteRes.json();
      url.searchParams.set("noteId", noteId);
    }

    return NextResponse.redirect(url);
  }

  return response;
}
