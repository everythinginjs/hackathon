import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const pathname = request.nextUrl.pathname;
  const hasValidToken = !!(accessToken || refreshToken);

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const authRoutes = ['/signin', '/signup'];

  // Check if current path is protected or auth route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to signin if accessing protected route without tokens
  if (isProtectedRoute && !hasValidToken) {
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && hasValidToken) {
    // Get the callback URL from query params or referrer
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const referer = request.headers.get('referer');

    // Determine redirect destination
    let redirectUrl: string;
    if (callbackUrl) {
      // Use callback URL if provided
      redirectUrl = callbackUrl;
    } else if (referer) {
      // Use referrer if it's from the same origin and not an auth page
      const refererUrl = new URL(referer);
      const isSameOrigin = refererUrl.origin === request.nextUrl.origin;
      const isRefererAuthRoute = authRoutes.some((route) =>
        refererUrl.pathname.startsWith(route)
      );

      if (isSameOrigin && !isRefererAuthRoute && refererUrl.pathname !== pathname) {
        redirectUrl = refererUrl.pathname + refererUrl.search;
      } else {
        redirectUrl = '/';
      }
    } else {
      // Default to home page
      redirectUrl = '/';
    }

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Allow access to all other pages
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
