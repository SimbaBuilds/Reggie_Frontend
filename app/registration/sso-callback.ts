import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const afterSignInUrl = searchParams.get('after_sign_in_url');
  const afterSignUpUrl = searchParams.get('after_sign_up_url');

  // Redirect to the dashboard or the provided URL
  const redirectUrl = afterSignInUrl || afterSignUpUrl || '/dashboard';

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
