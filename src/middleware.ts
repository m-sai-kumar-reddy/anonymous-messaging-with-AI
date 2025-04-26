import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";

const PUBLIC_FILE = /\.(.*)$/; // matches extensioned files

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware on public files and Next.js internals:
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname.match(PUBLIC_FILE)
  ) {
    return NextResponse.next();
  }

  // 2. Get auth token (if any)
  const token = await getToken({ req: request });

  // 3a. If logged in and they hit an auth route → send to dashboard
  if (
    token &&
    ["/", "/sign-in", "/sign-up", "/verify"].some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3b. If not logged in and they hit a protected route → send to sign-in
  const isProtected = pathname.startsWith("/dashboard");
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 4. All other pages load normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico).*)", // apply middleware to everything except next internals
  ],
};
