import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Set cookie error:', error);
    return NextResponse.json({ message: 'An internal error occurred while setting session.' }, { status: 500 });
  }
}
