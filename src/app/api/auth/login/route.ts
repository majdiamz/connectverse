import { NextResponse } from 'next/server';

// This route now acts as a "session setter".
// It receives the token from the frontend (which got it from the backend)
// and sets it as a secure, httpOnly cookie.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = body;

    if (!token || !user) {
      return NextResponse.json({ message: 'Invalid token or user data provided' }, { status: 400 });
    }

    // Build cookie attributes manually for better cross-environment compatibility
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = 60 * 60 * 24 * 7; // 7 days

    const cookieParts = [
      `token=${token}`,
      `Path=/`,
      `Max-Age=${maxAge}`,
      `HttpOnly`,
      `SameSite=Lax`,
    ];

    // Only add Secure flag in production with HTTPS
    if (isProduction) {
      cookieParts.push('Secure');
    }

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', cookieParts.join('; '));

    return response;

  } catch (error) {
    console.error('Set cookie error:', error);
    return NextResponse.json({ message: 'An internal error occurred while setting session.' }, { status: 500 });
  }
}
