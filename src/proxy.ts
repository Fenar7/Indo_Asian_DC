import { NextRequest, NextResponse } from "next/server";

// Routes that are always accessible without a password
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/studio",           // Sanity Studio
  "/_next",            // Next.js internals
  "/favicon.ico",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public paths
  if (isPublic(pathname)) return NextResponse.next();

  // Check auth cookie
  const authCookie = req.cookies.get("site_auth")?.value;
  const secret = process.env.SITE_AUTH_SECRET;

  if (!secret || authCookie !== secret) {
    // Not authenticated — redirect to login
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
