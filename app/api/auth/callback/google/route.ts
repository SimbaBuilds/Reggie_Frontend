import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  console.log('Callback route hit');
  const token = await getToken({ req: request as any });

  console.log('Token received:', token);

  if (token) {
    console.log('Attempting to register user with backend');
    try {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/registration/signup/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: token.email,
          first_name: token.name?.split(' ')[0] || '',
          last_name: token.name?.split(' ').slice(1).join(' ') || '',
          google_id: token.sub,
        }),
      });

      console.log('Backend response status:', backendResponse.status);

      if (backendResponse.ok) {
        console.log('Registration successful, redirecting to registration page');
        return NextResponse.redirect(new URL('/registration?step=organizationDetails', request.url));
      } else {
        const errorData = await backendResponse.json();
        console.error('Registration failed', backendResponse.status, JSON.stringify(errorData, null, 2));
        return NextResponse.redirect(new URL(`/auth/error?error=RegistrationFailed&details=${encodeURIComponent(JSON.stringify(errorData))}`, request.url));
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return NextResponse.redirect(new URL('/auth/error?error=RegistrationFailed&details=UnexpectedError', request.url));
    }
  }
  console.log('No token found, redirecting to error page');
  return NextResponse.redirect(new URL('/auth/error?error=AuthenticationFailed', request.url));
}

