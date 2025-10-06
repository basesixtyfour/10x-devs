import { NextResponse, NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const hasSessionCookie = req.cookies.has("better-auth.session_token") || req.cookies.has("__Secure-better-auth.session_token");
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static/|_next/image/|favicon.ico$|api/auth/|login|register).*)",
  ],
};