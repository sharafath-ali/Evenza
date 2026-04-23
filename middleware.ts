import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const token = request.cookies.get("evenza_token")?.value;
  const path = request.nextUrl.pathname;

  // Protect these routes
  const isProtectedPath = 
    path.startsWith('/manage') || 
    path.startsWith('/addEvent') || 
    path.startsWith('/settings');

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: Prevent logged-in users from accessing login/signup
  const isAuthPath = path === '/login' || path === '/signup';
  if (isAuthPath && token) {
     return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
