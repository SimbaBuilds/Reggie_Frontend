import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // Redirect unauthenticated users to login page for protected routes
  if (!token && request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/protected/:path*'
  ],
};
