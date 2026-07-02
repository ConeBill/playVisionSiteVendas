import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  const protectedRoutes = ['/account', '/checkout'];
  const isProtected = protectedRoutes.some((route) => url.pathname.startsWith(route));

  if (isProtected) {
    const sessionCookie = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/login', url));
    }
  }

  const publicAuthRoutes = ['/login', '/register'];
  if (publicAuthRoutes.includes(url.pathname)) {
    const sessionCookie = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
    if (sessionCookie?.value) {
      return NextResponse.redirect(new URL('/', url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
