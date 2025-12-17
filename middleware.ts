// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));

  if (isPublic) return NextResponse.next();

  const hasAccessToken = !!request.cookies.get("accessToken")?.value;
  const hasSessionId = !!request.cookies.get("sessionId")?.value;

  if (isPrivate && !(hasAccessToken || hasSessionId)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
