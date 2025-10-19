import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated by looking for auth data in cookies or headers
  // For now, we'll check localStorage on the client side
  // This is a basic implementation - in production you might want to use JWT tokens in cookies
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/verification', '/splash'];
  
  // If it's a public route, allow access
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // For authenticated routes, let the client-side handle the authentication check
  // The useAuth hook will handle redirecting to login if not authenticated
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
