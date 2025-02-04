import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;
    const isAuth = !!token;
    const isAuthPage = pathname.startsWith("/login");
    const isPublicPage = pathname === "/" || pathname === "/about";

    // Allow access to public pages without any checks
    if (isPublicPage) {
      return NextResponse.next();
    }

    // Check token expiration for non-public pages
    if (token?.exp && Date.now() >= token.exp * 1000) {
      // Token has expired, redirect to login
      const from = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?from=${from}`, req.url));
    }

    // Redirect authenticated users away from auth pages
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect dashboard routes
    if (!isAuth && pathname.startsWith("/dashboard")) {
      const from = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?from=${from}`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
