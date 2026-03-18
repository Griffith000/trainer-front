import { type NextRequest, NextResponse } from "next/server";
import type { User } from "@/lib/types";

export async function proxy(request: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const cookieHeader = request.headers.get("cookie") ?? "";
  const { pathname } = request.nextUrl;

  try {
    const response = await fetch(`${apiBase}/api/auth/me/`, {
      headers: { Cookie: cookieHeader },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = (await response.json()) as User;

    if (!user.onboarding_completed && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/onboarding/:path*", "/profile/:path*"],
};
