// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
//
// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = new URL(request.url);
//
//   const protectedRoutes = ['/account', '/checkout'];
//   const isProtected = protectedRoutes.some((route) => url.pathname.startsWith(route));
//
//   if (isProtected && !token) {
//     return NextResponse.redirect(new URL('/login', url));
//   }
//
//   const publicAuthRoutes = ['/login', '/register'];
//   if (publicAuthRoutes.includes(url.pathname) && token) {
//     return NextResponse.redirect(new URL('/', url));
//   }
//
//   return NextResponse.next();
// }
//
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

export function middleware() {
  return new Response('OK', { status: 200 });
}

export const config = {
  matcher: [],
};
