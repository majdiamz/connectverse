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

    const maxAge = 60 * 60 * 24 * 7; // 7 days

    // Check if request is over HTTPS (check forwarded proto for reverse proxy setups)
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isHttps = forwardedProto === 'https' || new URL(request.url).protocol === 'https:';

    const cookieParts = [
      `token=${token}`,
      `Path=/`,
      `Max-Age=${maxAge}`,
      `HttpOnly`,
      `SameSite=Lax`,
    ];

    // Only add Secure flag when actually on HTTPS
    if (isHttps) {
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
