import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/auth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (response.ok) {
      const data = await response.json()
      const res = NextResponse.redirect(new URL('/', request.url))
      
      // Set the auth token as a cookie
      res.cookies.set('auth_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      })

      return res
    }
  }

  // If there's no code or the authentication failed, redirect to an error page
  return NextResponse.redirect(new URL('/auth/error', request.url))
}
